"use client";

import { motion } from "framer-motion";

const legacyData = [
  {
    year: "1954",
    title: "M/S काशीदीन नत्थूलाल सर्राफ",
    description: "बुढ़ार में स्वर्ण परंपरा की नींव रखी गई। हमारे परदादा और दादा जी ने ईमानदारी और शुद्धता का जो संकल्प लिया, वह आज भी हमारी पहचान है।",
    role: "The Pioneers"
  },
  {
    year: "Legacy Continues",
    title: "श्री राधेलाल सोनी जी",
    description: "आपके पिताजी के मार्गदर्शन में इस विरासत को विस्तार मिला। उन्होंने व्यापार को केवल लेन-देन नहीं, बल्कि पारिवारिक संबंधों में बदला।",
    role: "The Pillar"
  },
  {
    year: "Present",
    title: "अंशु ज्वेलर्स (अमित सोनी)",
    description: "आज अमित सोनी के नेतृत्व में, हम आधुनिक डिज़ाइन्स और डिजिटल पारदर्शिता के साथ आपकी तीसरी पीढ़ी की सेवा कर रहे हैं।",
    role: "The Visionary"
  }
];

export default function LegacySection() {
  return (
    <section className="py-20 bg-[#FAF9F6] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-3xl md:text-5xl text-[#65000b] mb-4">
            70+ वर्षों की स्वर्णिम विरासत
          </h2>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto italic">
            "बुढ़ार के हृदय स्थल में 1954 से, आपके विश्वास और हमारे संस्कारों की एक अनूठी यात्रा।"
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#D4AF37]/30"></div>

          <div className="space-y-12 md:space-y-24">
            {legacyData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Text Content */}
                <div className="w-full md:w-1/2 px-8 text-center md:text-left">
                  <span className="text-[#D4AF37] font-bold tracking-widest text-sm uppercase">{item.role}</span>
                  <h3 className="font-cinzel text-2xl text-[#65000b] mt-2 mb-4">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>

                {/* Year Bubble */}
                <div className="relative flex items-center justify-center my-6 md:my-0">
                  <div className="z-10 bg-[#65000b] text-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center border-4 border-[#FAF9F6] shadow-xl font-bold text-sm text-center px-2">
                    {item.year}
                  </div>
                </div>

                {/* Empty Space for alignment */}
                <div className="hidden md:block w-1/2 px-8"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}