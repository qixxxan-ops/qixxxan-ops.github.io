import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://huyu-personal-website.a2d1d889-8e77-43ab-976e-32821382ae81.chatgpt.site",
  ),
  title: "胡宇杰 HUYU — AI 与影像产品作品集",
  description: "胡宇杰的 AI 产品、智能影像、用户研究与人机交互作品集。",
  openGraph: {
    title: "胡宇杰 HUYU — AI 与影像产品作品集",
    description: "把复杂的 AI 能力，变成可以被理解、使用与验证的影像产品。",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "HUYU 个人网站",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "胡宇杰 HUYU — AI 与影像产品作品集",
    description: "把复杂的 AI 能力，变成可以被理解、使用与验证的影像产品。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
