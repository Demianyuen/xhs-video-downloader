"use client";

import { useState, useEffect, useCallback } from "react";

const MAX_DAILY_DOWNLOADS = 5;
const COOLDOWN_SECONDS = 15;

const STORAGE_KEYS = {
  DAILY_COUNT: "xhs_daily_downloads",
  LAST_DATE: "xhs_last_download_date",
  LAST_TIME: "xhs_last_download_time",
};

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getUsageStatus() {
  if (typeof window === "undefined") {
    return { downloadsRemaining: MAX_DAILY_DOWNLOADS, cooldownRemaining: 0, canDownload: true, isLimitReached: false };
  }
  const today = getTodayDate();
  const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE);
  let dailyCount = 0;
  if (lastDate === today) {
    dailyCount = parseInt(localStorage.getItem(STORAGE_KEYS.DAILY_COUNT) || "0", 10);
  }
  const lastTime = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_TIME) || "0", 10);
  const elapsedSeconds = Math.floor((Date.now() - lastTime) / 1000);
  const cooldownRemaining = Math.max(0, COOLDOWN_SECONDS - elapsedSeconds);
  const downloadsRemaining = Math.max(0, MAX_DAILY_DOWNLOADS - dailyCount);
  const isLimitReached = downloadsRemaining === 0;
  const canDownload = downloadsRemaining > 0 && cooldownRemaining === 0;
  return { downloadsRemaining, cooldownRemaining, canDownload, isLimitReached };
}

function recordDownload() {
  if (typeof window === "undefined") return;
  const today = getTodayDate();
  const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE);
  let dailyCount = 0;
  if (lastDate === today) {
    dailyCount = parseInt(localStorage.getItem(STORAGE_KEYS.DAILY_COUNT) || "0", 10);
  }
  dailyCount += 1;
  localStorage.setItem(STORAGE_KEYS.DAILY_COUNT, dailyCount.toString());
  localStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
  localStorage.setItem(STORAGE_KEYS.LAST_TIME, Date.now().toString());
}

interface UsageStatus {
  downloadsRemaining: number;
  cooldownRemaining: number;
  canDownload: boolean;
  isLimitReached: boolean;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setUsage(getUsageStatus());
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown(cooldown - 1);
      if (cooldown === 1) {
        setUsage(getUsageStatus());
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleDownload = useCallback(async () => {
    if (!url) {
      setError("请输入小红书视频链接");
      return;
    }

    const currentUsage = getUsageStatus();
    if (!currentUsage.canDownload) {
      if (currentUsage.isLimitReached) {
        setError("今日下载次数已用完，明天再来！");
      } else {
        setError(`请等待 ${currentUsage.cooldownRemaining} 秒后再下载`);
      }
      return;
    }

    setIsDownloading(true);
    setError("");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success && data.videoUrl) {
        recordDownload();
        setUsage(getUsageStatus());
        setCooldown(COOLDOWN_SECONDS);

        // Open video URL in new tab for download
        window.open(data.videoUrl, "_blank");
        setUrl("");
      } else {
        setError(data.error || "下载失败，请稍后重试");
      }
    } catch {
      setError("下载失败，请检查网络连接后重试");
    } finally {
      setIsDownloading(false);
    }
  }, [url]);

  const canDownload = usage?.canDownload && !isDownloading && cooldown === 0;

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Ad Banner Top */}
      <div className="w-full bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-2 text-center text-gray-400 text-sm">
          <div className="h-[90px] flex items-center justify-center border border-dashed border-gray-300 rounded">
            广告位
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">小</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            小红书视频下载器
          </h1>
          <p className="text-gray-500">
            免费下载小红书无水印视频
          </p>
        </div>

        {/* Download Box */}
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Usage Info */}
          {usage && (
            <div className="text-center mb-6 text-sm text-gray-500">
              今日剩余下载次数: <span className="font-bold text-pink-600">{usage.downloadsRemaining}</span> / {MAX_DAILY_DOWNLOADS}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="mb-6">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="粘贴小红书视频链接..."
              className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition"
              onKeyDown={(e) => e.key === "Enter" && canDownload && handleDownload()}
              disabled={isDownloading || cooldown > 0}
            />
          </div>

          {/* Cooldown Timer */}
          {cooldown > 0 && (
            <div className="mb-6">
              <div className="bg-gray-100 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">{cooldown}</div>
                <div className="text-gray-500">秒后可再次下载</div>
                <div className="mt-4 h-[250px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                  <span className="text-gray-400">广告位</span>
                </div>
              </div>
            </div>
          )}

          {/* Download Button */}
          {cooldown === 0 && (
            <button
              onClick={handleDownload}
              disabled={!canDownload || usage?.isLimitReached}
              className={`w-full py-4 rounded-xl text-white text-lg font-semibold transition ${
                canDownload && !usage?.isLimitReached
                  ? "bg-gradient-to-r from-pink-500 to-red-500 hover:shadow-lg cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isDownloading ? "下载中..." : usage?.isLimitReached ? "今日次数已用完" : "下载视频"}
            </button>
          )}

          {/* Limit Reached Message */}
          {usage?.isLimitReached && cooldown === 0 && (
            <div className="mt-4 text-center">
              <p className="text-gray-500 mb-4">明天再来下载更多视频吧！</p>
              <div className="h-[250px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                <span className="text-gray-400">广告位</span>
              </div>
            </div>
          )}
        </div>

        {/* How to use */}
        <div className="w-full max-w-2xl text-center text-gray-500 text-sm">
          <p className="mb-2">使用方法：复制小红书视频链接 → 粘贴到上方输入框 → 点击下载</p>
          <p>支持格式：https://www.xiaohongshu.com/... 或 分享链接</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6 text-center">
            <div className="h-[90px] flex items-center justify-center border border-dashed border-gray-300 rounded">
              <span className="text-gray-400">广告位</span>
            </div>
          </div>
          <div className="flex justify-center space-x-6 text-sm text-gray-500 mb-4">
            <a href="/privacy" className="hover:text-pink-600 transition">隐私政策</a>
            <a href="/about" className="hover:text-pink-600 transition">关于我们</a>
            <a href="/terms" className="hover:text-pink-600 transition">使用条款</a>
          </div>
          <p className="text-center text-gray-400 text-xs">
            &copy; 2024 XHS Downloader. 仅供个人学习使用。
          </p>
        </div>
      </footer>
    </div>
  );
}
