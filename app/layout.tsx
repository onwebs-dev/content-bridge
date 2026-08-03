import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const image = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: "محتواساز خودکار وردپرس | Content Bridge",
    description: "تولید و انتشار خودکار محتوای وردپرس با استراتژی، تحقیق کلمات کلیدی، تصویر، متا، تگ، لینک‌سازی و سئوی کامل. آشنایی با پلن‌های Content Bridge.",
    keywords: ["محتواساز خودکار", "تولید محتوای خودکار", "تولید محتوا با هوش مصنوعی", "انتشار خودکار وردپرس", "ساخت مقاله خودکار", "اتوماسیون محتوا", "سئو محتوا", "GEO"],
    authors: [{ name: "ویرا وب آریا" }],
    creator: "ویرا وب آریا",
    alternates: {
      canonical: origin,
      languages: { "fa-IR": origin, "en-US": `${origin}/en`, "x-default": origin },
    },
    openGraph: {
      title: "Content Bridge | استراتژی را ما می‌سازیم؛ محتوا خودش منتشر می‌شود",
      description: "از شناخت سایت و برنامه‌ریزی تا انتشار منظم محتوا در وردپرس.",
      locale: "fa_IR",
      alternateLocale: ["en_US"],
      type: "website",
      siteName: "Content Bridge",
      url: origin,
      images: [{ url: image, width: 1731, height: 909, alt: "Content Bridge — استراتژی و انتشار هوشمند محتوا" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Content Bridge | استراتژی و انتشار هوشمند محتوا",
      description: "از شناخت سایت و برنامه‌ریزی تا انتشار منظم محتوا در وردپرس.",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
