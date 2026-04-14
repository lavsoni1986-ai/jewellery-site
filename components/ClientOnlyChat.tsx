"use client";

import dynamic from "next/dynamic";

// यहाँ ssr: false सुरक्षित है क्योंकि यह एक Client Component है
const LiveChat = dynamic(() => import("@/components/LiveChat"), {
  ssr: false,
  loading: () => null // लोड होते समय कुछ न दिखाएँ
});

export default function ClientOnlyChat() {
  return <LiveChat />;
}