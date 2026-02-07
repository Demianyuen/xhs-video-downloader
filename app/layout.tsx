import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "小红书视频下载器 - 免费下载无水印视频 | XHS Downloader",
  description: "免费在线下载小红书视频，无水印高清画质。支持所有小红书视频链接，一键下载到本地。Free Xiaohongshu video downloader.",
  keywords: "小红书下载,小红书视频下载,XHS下载器,小红书无水印,xiaohongshu downloader,红书视频保存",
  authors: [{ name: "XHS Downloader" }],
  robots: "index, follow",
  openGraph: {
    title: "小红书视频下载器 - 免费下载无水印视频",
    description: "免费在线下载小红书视频，无水印高清画质。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Google AdSense - Replace ca-pub-XXXXXXX with your publisher ID after approval */}
        {/*
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        */}
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
