"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { PHONE } from "@/lib/config";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Auto-show chat after 10 seconds (only once)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add location info if booking visit
    const enhancedMessage = message.toLowerCase().includes('visit') || message.toLowerCase().includes('book')
      ? `${message} (Our showroom: near Jain Mandir, Station Road, Burhar)`
      : message;

    const whatsappUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(enhancedMessage)}`;
    window.open(whatsappUrl, '_blank');
    setMessage("");
    setIsOpen(false);
  };

  const quickReplies = [
    "What's today's gold rate?",
    "Show me ring designs",
    "I want to book a visit",
    "Custom design inquiry"
  ];

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-24 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#22C55E] transition-all duration-300 animate-bounce"
            aria-label="Open live chat"
          >
            <MessageCircle size={24} />
          </button>
        )}

        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[calc(100vw-2rem)] max-w-[320px] md:max-w-[400px] max-h-[70vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[#25D366] text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#25D366] font-bold text-sm">A</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Anshu Jewellers</h3>
                  <p className="text-xs opacity-90">Usually replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 max-h-60 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                <p className="text-sm text-gray-800">
                  नमस्ते! मैं Anshu Jewellers का assistant हूं। हमारा शोरूम Jain Mandir के पास, Station Road, Burhar में है। कैसे मदद कर सकता हूं?
                </p>
                    <p className="text-xs text-gray-500 mt-1">Just now</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                    <p className="text-sm text-gray-800">
                      आज के गोल्ड रेट, डिजाइन देखना या स्टोर विजिट बुक करना - सब कुछ!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(reply)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#25D366] text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#22C55E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Messages sent via WhatsApp for instant response
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}