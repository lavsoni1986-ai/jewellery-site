/**
 * JewelleryCard to Firebase Synchronization Engine
 * 
 * Rules:
 * 1. Safe idempotency: Repeated syncs produce identical results without duplicates.
 * 2. Stable matching priority:
 *    a) exact jewelleryCardProductId
 *    b) existing known sourceProductId
 *    c) unambiguous name match only if no conflict
 *    d) otherwise create new product
 * 3. NO fake/invented business fields:
 *    - New products leave weight, making, carat, stock, price empty/undefined.
 * 4. Existing Firebase business data is preserved:
 *    - Never overwrites weight, making, carat, stock, or manually edited fields.
 * 5. Products missing from JewelleryCard are NEVER deleted.
 * 6. Dry run mode supported for pre-flight verification.
 */

import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  fetchAllJewelleryCardProducts,
  fetchJewelleryCardPage,
  JewelleryCardProduct,
  FetchAllOptions,
} from "@/lib/jewelleryCard";

export interface SyncOptions extends FetchAllOptions {
  dryRun?: boolean; // When true, no writes are made to Firestore
  singlePageOnly?: boolean; // Only fetch page 1 (useful for quick checks)
}

export interface SyncProductAction {
  action: "added" | "updated" | "unchanged" | "skipped";
  jewelleryCardId: string;
  firebaseDocId?: string;
  name: string;
  image: string;
  reason?: string;
}

export interface SyncResult {
  success: boolean;
  dryRun: boolean;
  totalFetched: number;
  pagesFetched: number;
  totalCatalogueReported: number;
  addedCount: number;
  updatedCount: number;
  unchangedCount: number;
  skippedCount: number;
  actions: SyncProductAction[];
  errors: string[];
  durationMs: number;
  timestamp: number;
}

interface ExistingDocRecord {
  id: string;
  data: Record<string, unknown>;
}

export async function syncJewelleryCardToFirebase(
  options: SyncOptions = {}
): Promise<SyncResult> {
  const startTime = Date.now();
  const dryRun = Boolean(options.dryRun);
  const errors: string[] = [];
  const actions: SyncProductAction[] = [];

  let addedCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;
  let skippedCount = 0;

  let fetchedProducts: JewelleryCardProduct[] = [];
  let pagesFetched = 0;
  let totalCatalogueReported = 0;

  // 1. Fetch products from JewelleryCard API
  try {
    if (options.singlePageOnly) {
      const pageResult = await fetchJewelleryCardPage(1, options.timeoutMs || 15000);
      fetchedProducts = pageResult.products;
      pagesFetched = 1;
      totalCatalogueReported = pageResult.total;
    } else {
      const fetchResult = await fetchAllJewelleryCardProducts(options);
      fetchedProducts = fetchResult.products;
      pagesFetched = fetchResult.pagesFetched;
      totalCatalogueReported = fetchResult.totalReported;
      if (fetchResult.errors.length > 0) {
        errors.push(...fetchResult.errors);
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Failed to fetch from JewelleryCard: ${msg}`);
    return {
      success: false,
      dryRun,
      totalFetched: 0,
      pagesFetched: 0,
      totalCatalogueReported: 0,
      addedCount: 0,
      updatedCount: 0,
      unchangedCount: 0,
      skippedCount: 0,
      actions: [],
      errors,
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
    };
  }

  // 2. Fetch existing products from Firestore
  const existingByJcId = new Map<string, ExistingDocRecord>();
  const existingByName = new Map<string, ExistingDocRecord[]>();

  try {
    const snapshot = await getDocs(collection(db, "products"));
    for (const d of snapshot.docs) {
      const data = d.data() as Record<string, unknown>;
      const record: ExistingDocRecord = { id: d.id, data };

      const jcId = (data.jewelleryCardProductId || data.sourceProductId) as string | undefined;
      if (jcId) {
        existingByJcId.set(String(jcId).trim(), record);
      }

      const name = typeof data.name === "string" ? data.name.trim().toLowerCase() : "";
      if (name) {
        const list = existingByName.get(name) || [];
        list.push(record);
        existingByName.set(name, list);
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Failed to read existing Firestore products: ${msg}`);
    return {
      success: false,
      dryRun,
      totalFetched: fetchedProducts.length,
      pagesFetched,
      totalCatalogueReported,
      addedCount: 0,
      updatedCount: 0,
      unchangedCount: 0,
      skippedCount: 0,
      actions: [],
      errors,
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
    };
  }

  // 3. Process each JewelleryCard product
  for (const jcProduct of fetchedProducts) {
    try {
      // Find matching existing product using matching priority
      let matchedDoc: ExistingDocRecord | null = null;

      // Priority a & b: Exact jewelleryCardProductId / sourceProductId
      if (existingByJcId.has(jcProduct.id)) {
        matchedDoc = existingByJcId.get(jcProduct.id)!;
      }

      // Priority c: Unambiguous exact name match (only if no conflict)
      if (!matchedDoc) {
        const normalizedName = jcProduct.name.trim().toLowerCase();
        const candidateDocs = existingByName.get(normalizedName);
        if (candidateDocs && candidateDocs.length === 1) {
          const candidate = candidateDocs[0];
          const candidateJcId = (candidate.data.jewelleryCardProductId || candidate.data.sourceProductId) as string | undefined;
          // If candidate doesn't have a different conflicting JC id, match safely
          if (!candidateJcId || String(candidateJcId) === jcProduct.id) {
            matchedDoc = candidate;
          }
        }
      }

      if (matchedDoc) {
        // --- UPDATE EXISTING PRODUCT ---
        const existingData = matchedDoc.data;
        const currentName = existingData.name;
        const currentImage = existingData.image;
        const currentCat = existingData.category;

        const needsImageUpdate = Boolean(jcProduct.image && jcProduct.image !== currentImage);
        const needsNameUpdate = Boolean(jcProduct.name && jcProduct.name !== currentName);
        const needsCatUpdate = Boolean(jcProduct.category && jcProduct.category !== currentCat && !currentCat);
        const needsIdBackfill = !existingData.jewelleryCardProductId;

        if (needsImageUpdate || needsNameUpdate || needsCatUpdate || needsIdBackfill) {
          // Prepare source-owned update payload
          // CRITICAL: Preserve all business metadata (weight, making, carat, stock, price, etc.)
          const updatePayload: Record<string, unknown> = {
            jewelleryCardProductId: jcProduct.id,
            sourceProductId: jcProduct.id,
            source: "jewellerycard",
            sourceUrl: jcProduct.sourceUrl || "https://jewellerycard.in/ANSHU-JEWELLERS",
            lastSyncedAt: new Date(),
          };

          if (needsImageUpdate && jcProduct.image) {
            updatePayload.image = jcProduct.image;
          }
          if (needsNameUpdate && jcProduct.name) {
            updatePayload.name = jcProduct.name;
          }
          if (needsCatUpdate && jcProduct.category) {
            updatePayload.category = jcProduct.category;
          }

          if (!dryRun) {
            await updateDoc(doc(db, "products", matchedDoc.id), updatePayload);
          }

          updatedCount++;
          actions.push({
            action: "updated",
            jewelleryCardId: jcProduct.id,
            firebaseDocId: matchedDoc.id,
            name: jcProduct.name,
            image: jcProduct.image,
            reason: `Updated fields: ${Object.keys(updatePayload).join(", ")}`,
          });
        } else {
          unchangedCount++;
          actions.push({
            action: "unchanged",
            jewelleryCardId: jcProduct.id,
            firebaseDocId: matchedDoc.id,
            name: jcProduct.name,
            image: jcProduct.image,
          });
        }
      } else {
        // --- ADD NEW PRODUCT ---
        // CRITICAL: DO NOT invent fake business values for weight, making, carat, stock
        const newDocId = `jc_${jcProduct.id}`;
        const newDocData: Record<string, unknown> = {
          name: jcProduct.name,
          image: jcProduct.image,
          category: jcProduct.category,
          jewelleryCardProductId: jcProduct.id,
          sourceProductId: jcProduct.id,
          source: "jewellerycard",
          sourceUrl: jcProduct.sourceUrl || "https://jewellerycard.in/ANSHU-JEWELLERS",
          createdAt: new Date(),
          lastSyncedAt: new Date(),
        };

        if (!dryRun) {
          await setDoc(doc(db, "products", newDocId), newDocData);
        }

        // Register in our in-memory maps to prevent intra-batch duplicate creation
        existingByJcId.set(jcProduct.id, { id: newDocId, data: newDocData });

        addedCount++;
        actions.push({
          action: "added",
          jewelleryCardId: jcProduct.id,
          firebaseDocId: newDocId,
          name: jcProduct.name,
          image: jcProduct.image,
          reason: "Created new product from JewelleryCard catalogue",
        });
      }
    } catch (itemErr: unknown) {
      const msg = itemErr instanceof Error ? itemErr.message : String(itemErr);
      skippedCount++;
      errors.push(`Product ID ${jcProduct.id} (${jcProduct.name}) processing error: ${msg}`);
      actions.push({
        action: "skipped",
        jewelleryCardId: jcProduct.id,
        name: jcProduct.name,
        image: jcProduct.image,
        reason: msg,
      });
    }
  }

  // 4. Save sync log in Firestore (only if not dryRun)
  if (!dryRun) {
    try {
      await setDoc(doc(db, "system", "jewelleryCardSync"), {
        lastSync: new Date(),
        totalProducts: fetchedProducts.length,
        addedCount,
        updatedCount,
        unchangedCount,
        skippedCount,
        pagesFetched,
        totalCatalogueReported,
        hasErrors: errors.length > 0,
        errors: errors.slice(0, 10),
      });
    } catch (logErr) {
      console.error("Failed to write sync log to system collection:", logErr);
    }
  }

  return {
    success: errors.length === 0,
    dryRun,
    totalFetched: fetchedProducts.length,
    pagesFetched,
    totalCatalogueReported,
    addedCount,
    updatedCount,
    unchangedCount,
    skippedCount,
    actions,
    errors,
    durationMs: Date.now() - startTime,
    timestamp: Date.now(),
  };
}
