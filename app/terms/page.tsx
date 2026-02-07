import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用条款 - 小红书视频下载器",
  description: "小红书视频下载器使用条款",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">使用条款</h1>
          <p className="text-gray-500 text-sm mb-8">最后更新：2024年1月</p>

          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">1. 服务说明</h2>
              <p>
                小红书视频下载器（以下简称&ldquo;本服务&rdquo;）是一个免费的在线视频下载工具。使用本服务即表示您同意遵守以下条款。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">2. 使用限制</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>每位用户每天最多可下载5个视频</li>
                <li>每次下载之间需等待15秒</li>
                <li>本服务仅供个人学习和研究使用</li>
                <li>禁止将下载内容用于商业用途</li>
                <li>禁止使用自动化工具批量下载</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">3. 版权声明</h2>
              <p>
                本服务不拥有任何通过本工具下载的视频内容的版权。所有视频内容的版权归原创作者所有。用户应尊重原创作者的知识产权，不得侵犯他人权益。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">4. 用户责任</h2>
              <p>用户在使用本服务时应：</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>遵守所在地区的法律法规</li>
                <li>尊重原创作者的版权</li>
                <li>不得将下载内容用于非法目的</li>
                <li>不得滥用本服务或干扰服务正常运行</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">5. 免责声明</h2>
              <p>
                本服务按&ldquo;现状&rdquo;提供，不提供任何明示或暗示的保证。我们不对以下情况承担责任：
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>服务中断或不可用</li>
                <li>下载失败或视频质量问题</li>
                <li>用户因使用本服务而产生的任何损失</li>
                <li>用户违反版权法规而产生的法律责任</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">6. 服务变更</h2>
              <p>
                我们保留随时修改、暂停或终止本服务的权利，恕不另行通知。我们也可能随时更新这些使用条款。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">7. 广告</h2>
              <p>
                本服务通过展示广告来维持运营。使用本服务即表示您同意接收这些广告。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">8. 适用法律</h2>
              <p>
                本条款受中华人民共和国法律管辖。如有争议，应友好协商解决。
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
