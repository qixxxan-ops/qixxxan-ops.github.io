import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "摄影档案 — 胡宇杰 HUYU",
  description: "胡宇杰的个人摄影档案：关于水、森林、城市与日常光线的六组观察。",
  openGraph: {
    title: "摄影档案 — 胡宇杰 HUYU",
    description: "关于水、森林、城市与日常光线的个人摄影观察。",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/photography/01.jpg", width: 405, height: 270, alt: "胡宇杰摄影档案" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "摄影档案 — 胡宇杰 HUYU",
    description: "关于水、森林、城市与日常光线的个人摄影观察。",
    images: ["/photography/01.jpg"],
  },
};

export default function PhotographyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
