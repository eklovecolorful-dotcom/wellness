import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wellness · 身心整合練習",
    short_name: "Wellness",
    description: "Yoga × Zen × Coffee mindfulness, bilingual daily practice",
    start_url: "/practice",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#2f4f3a",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
