"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Lead {
  productName: string;
  price: number;
  createdAt?: { toDate: () => Date } | Date | string;
}

export default function Leads() {
useEffect(() => {
  if (typeof window !== "undefined") {
    const pass = prompt("Enter Admin Password");
    if (pass !== "1234") {
      window.location.href = "/";
    }
  }
}, []);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setLeads(snap.docs.map(doc => doc.data() as Lead));
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-white bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl text-[#D4AF37] mb-6">Leads Dashboard</h1>

      <div className="bg-[#111111] border border-[#D4AF37] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl text-[#D4AF37] mb-4">Recent Enquiries ({leads.length})</h2>

        {leads.length === 0 ? (
          <p className="text-gray-400">No leads yet. Start getting enquiries!</p>
        ) : (
          <div className="space-y-3">
            {leads.map((lead, i) => (
              <div key={i} className="border p-4 border-[#D4AF37]/20 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[#D4AF37]">{lead.productName}</p>
                    <p className="text-gray-300">₹{lead.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {lead.createdAt
                        ? (typeof lead.createdAt === 'object' && 'toDate' in lead.createdAt
                            ? lead.createdAt.toDate().toLocaleString()
                            : lead.createdAt instanceof Date
                              ? lead.createdAt.toLocaleString()
                              : lead.createdAt)
                        : 'Recent'}
                    </p>
                    <button
                      onClick={() => window.open(`https://wa.me/919425182098?text=Hi, regarding your enquiry for ${lead.productName}`, '_blank')}
                      className="mt-2 bg-[#25D366] text-white px-3 py-1 rounded text-xs hover:bg-[#128C7E] transition"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}