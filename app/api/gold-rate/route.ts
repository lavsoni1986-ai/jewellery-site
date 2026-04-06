import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Multi-source AI rate fetching
async function fetchFromSource(apiUrl: string, apiKey?: string) {
  try {
    let url = apiUrl;
    if (apiKey) {
      if (apiUrl.includes('metalpriceapi')) {
        url = `${apiUrl}${apiKey}&base=USD&currencies=XAU`;
      } else if (apiUrl.includes('goldapi')) {
        url = `${apiUrl}?apikey=${apiKey}`;
      } else {
        url = `${apiUrl}${apiKey}`;
      }
    }
    const response = await fetch(url, { next: { revalidate: 0 } });

    if (!response.ok) return null;

    const data = await response.json();

    let ratePerGram = null;

    // Handle different API structures
    if (data.rates?.XAU) {
      // MetalPriceAPI format (USD per troy ounce)
      const usdPerOunce = data.rates.XAU;
      const usdPerGram = usdPerOunce / 31.1035;
      // Assume 1 USD = 83 INR (update if needed)
      const inrPerGram = usdPerGram * 83;
      ratePerGram = Math.round(inrPerGram);
    } else if (data.price_gram_24k) {
      // GoldAPI format (directly in INR per gram for INR endpoint)
      ratePerGram = Math.round(data.price_gram_24k);
    } else if (data.price && data.currency === 'INR') {
      // Fallback for GoldAPI if price is per gram
      ratePerGram = Math.round(data.price);
    } else if (data.price) {
      // Emergency fallback: assume per 10g and convert
      ratePerGram = Math.round(data.price / 10);
    }

    if (!ratePerGram || ratePerGram < 3000 || ratePerGram > 10000) return null;

    return ratePerGram;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    // Check if rate is frozen
    const freezeDoc = await getDoc(doc(db, "system", "settings"));
    if (freezeDoc.exists() && freezeDoc.data().rateFrozen) {
      return NextResponse.json({
        success: false,
        message: "Rate is frozen, not updating"
      });
    }

    // Multi-source fetching with AI averaging
    const sources = [
      {
        name: "goldapi",
        url: "https://www.goldapi.io/api/XAU/INR",
        key: process.env.GOLD_API_KEY
      },
      {
        name: "metalpriceapi",
        url: "https://api.metalpriceapi.com/v1/latest?api_key=",
        key: process.env.GOLD_API_KEY2 || "demo"
      },
      // Add more sources here for redundancy
      // { name: "source3", url: "...", key: "..." }
    ];

    const rates: number[] = [];

    for (const source of sources) {
      const rate = await fetchFromSource(source.url, source.key);
      if (rate) rates.push(rate);
    }

    if (rates.length === 0) {
      throw new Error('All API sources failed');
    }

    // AI averaging - use median for outlier resistance
    const sortedRates = rates.sort((a, b) => a - b);
    const medianRate = sortedRates[Math.floor(sortedRates.length / 2)];

    // Get last rate for hard limit check
    let lastRate = null;
    try {
      const docRef = doc(db, "goldRate", "current");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        lastRate = docSnap.data().rate;
      }
  } catch (error) {
    console.error("Gold rate fetch failed:", error);

    // Save failed attempt to history
    try {
      await setDoc(doc(db, "goldRateHistory", Date.now().toString()), {
        rate: null,
        timestamp: Date.now(),
        source: "failed",
        error: error instanceof Error ? error.message : String(error)
      });
    } catch (historyError) {
      console.log("Failed attempt history save failed:", historyError);
    }

    // Get last saved rate as fallback
    try {
      const docRef = doc(db, "goldRate", "current");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        await setDoc(doc(db, "goldRate", "current"), {
          ...data,
          source: "fallback",
          lastAttempt: new Date(),
          fallbackReason: error instanceof Error ? error.message : String(error)
        });

        // Admin alert system
        try {
          const alertMessage = `🚨 ALERT: Gold rate update failed at ${new Date().toISOString()}\nError: ${error instanceof Error ? error.message : String(error)}\nUsing fallback rate.`;
          // Send WhatsApp alert to admin
          await fetch(`https://api.whatsapp.com/send?phone=${process.env.ADMIN_PHONE || '919425182098'}&text=${encodeURIComponent(alertMessage)}`);
        } catch (alertError) {
          console.log("Admin alert failed:", alertError);
        }
        console.log("ALERT: Gold rate update failed, using fallback");
      }
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: "Using last saved rate, will retry automatically"
    });
  }

    // Hard limit guard - reject if change > 15%
    if (lastRate && Math.abs(medianRate - lastRate) / lastRate > 0.15) {
      throw new Error(`Rate change too extreme: ${((medianRate - lastRate) / lastRate * 100).toFixed(1)}%`);
    }

    // Rate smoothing algorithm - prevent sudden jumps
    let finalRate = medianRate;
    if (lastRate) {
      // Smooth by 30% towards new rate, 70% keep old
      finalRate = Math.round((lastRate * 0.7) + (medianRate * 0.3));

      // If smoothing brings it within 2% of original, use original for accuracy
      if (Math.abs(finalRate - medianRate) / medianRate < 0.02) {
        finalRate = medianRate;
      }
    }

    // Save to rate history
    try {
      await setDoc(doc(db, "goldRateHistory", Date.now().toString()), {
        rate: medianRate,
        timestamp: Date.now(),
        source: "api",
        sourcesUsed: rates.length
      });
    } catch (error) {
      console.log("History save failed:", error);
    }

    // Check for volatility and auto-lock if needed
    let volatilityFlag = null;
    let autoLock = false;
    if (lastRate) {
      const changePercent = Math.abs((medianRate - lastRate) / lastRate) * 100;
      if (changePercent > 5) {
        volatilityFlag = `High volatility: ${changePercent.toFixed(1)}% change`;
      }
      if (changePercent > 10) {
        autoLock = true;
        await setDoc(doc(db, "system", "settings"), {
          rateFrozen: true,
          frozenAt: new Date(),
          frozenReason: `Auto-lock due to extreme volatility: ${changePercent.toFixed(1)}%`
        });
        console.log("AUTO-LOCK: Rate frozen due to extreme volatility");
      }
    }

    // Final validation - if rate is still suspicious, rollback
    let rateToSave = finalRate;
    let rollbackReason = null;

    if (lastRate && Math.abs(finalRate - lastRate) / lastRate > 0.08) {
      // Even after smoothing, if change > 8%, rollback to last rate
      rateToSave = lastRate;
      rollbackReason = `Rate change too volatile after smoothing: ${((finalRate - lastRate) / lastRate * 100).toFixed(1)}%`;
      console.log("ROLLBACK: Using last rate due to volatility");
    }

    await setDoc(doc(db, "goldRate", "current"), {
      rate: rateToSave,
      updatedAt: new Date(),
      source: rollbackReason ? "rollback" : "api",
      timestamp: Date.now(),
      volatility: volatilityFlag,
      sourcesUsed: rates.length,
      lastUpdate: new Date(),
      smoothedRate: finalRate,
      rollbackReason
    });

    return NextResponse.json({
      success: true,
      rate: medianRate,
      message: volatilityFlag || `Gold rate updated from ${rates.length} source(s)`
    });

  } catch (error) {
    console.error("Gold rate fetch failed:", error);

    // Get last saved rate as fallback
    try {
      const docRef = doc(db, "goldRate", "current");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        await setDoc(doc(db, "goldRate", "current"), {
          ...data,
          source: "fallback",
          lastAttempt: new Date()
        });
      }
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
    }

    return NextResponse.json({
      success: false,
      error: "Failed to update gold rate, using fallback",
      message: "System will retry automatically"
    });
  }
}