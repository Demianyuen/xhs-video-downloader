import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 - 小红书视频下载器",
  description: "小红书视频下载器隐私政策",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">隐私政策</h1>
          <p className="text-gray-500 text-sm mb-8">最后更新：2024年1月</p>

          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">1. 信息收集</h2>
              <p>
                我们不会收集您的个人身份信息。本网站仅在您的浏览器本地存储（localStorage）中保存下载次数统计，用于实现每日下载限制功能。这些数据仅存储在您的设备上，我们无法访问。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Cookie 和广告</h2>
              <p>
                本网站使用 Google AdSense 展示广告。Google 可能会使用 Cookie 来提供基于您兴趣的广告。您可以通过访问 Google 广告设置来管理您的广告偏好。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">3. 数据安全</h2>
              <p>
                您提供的视频链接仅用于下载处理，不会被存储或分享给第三方。下载完成后，临时文件会在几秒内自动删除。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">4. 第三方服务</h2>
              <p>
                本网站使用以下第三方服务：
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Google AdSense - 广告服务</li>
                <li>Vercel - 网站托管服务</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">5. 用户权利</h2>
              <p>
                您可以随时清除浏览器的本地存储数据来重置下载计数。由于我们不收集个人信息，因此没有需要删除的用户数据。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">6. 政策更新</h2>
              <p>
                我们可能会不时更新本隐私政策。任何更改都会在本页面上发布，并更新&ldquo;最后更新&rdquo;日期。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">7. 联系我们</h2>
              <p>
                如果您对本隐私政策有任何疑问，请通过关于页面的联系方式与我们联系。
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <a href="/" className="text-pink-600 hover:text-pink-700 transition">
              ← 返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
