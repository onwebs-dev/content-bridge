import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const pageUrl = `${origin}/en`;

  return {
    title: "Automated WordPress Content Creation | Content Bridge",
    description: "A managed AI content automation service for WordPress: content strategy, keyword research, editorial planning, SEO fields, images and scheduled publishing.",
    keywords: [
      "automated content creation",
      "AI content automation",
      "WordPress content generator",
      "automated blog writing",
      "AI article publishing",
      "WordPress SEO automation",
      "Content Bridge plugin download",
      "WordPress content automation plugin",
      "managed content engine",
      "custom website content automation",
      "custom publishing integration script",
    ],
    alternates: {
      canonical: pageUrl,
      languages: { "fa-IR": origin, "en-US": pageUrl, "x-default": origin },
    },
    openGraph: {
      title: "Content Bridge | Strategy first. Publishing on schedule.",
      description: "Managed automated content creation for WordPress—from keyword strategy to complete, scheduled articles.",
      locale: "en_US",
      alternateLocale: ["fa_IR"],
      type: "website",
      siteName: "Content Bridge",
      url: pageUrl,
      images: [{ url: `${origin}/og-en.png`, width: 1727, height: 911, alt: "Content Bridge automated content workflow" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Automated WordPress Content Creation | Content Bridge",
      description: "Strategy, keyword research, editorial planning and automated publishing—managed as one content engine.",
      images: [`${origin}/og-en.png`],
    },
  };
}

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div lang="en" dir="ltr">{children}</div>;
}
