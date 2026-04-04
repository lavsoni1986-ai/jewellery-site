import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anshu Jewellers",
    short_name: "Anshu",
    description: "70+ years trusted jewellery shop in Burhar",
    start_url: "/",
    display: "standalone",
    background_color: "#fff5f5",
    theme_color: "#D4AF37",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}