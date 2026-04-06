import { NextResponse } from "next/server";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const historyQuery = query(
      collection(db, "goldRateHistory"),
      orderBy("timestamp", "desc"),
      limit(30) // Last 30 entries
    );

    const snapshot = await getDocs(historyQuery);
    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp
    }));

    return NextResponse.json({
      success: true,
      history
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}