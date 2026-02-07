import { NextRequest, NextResponse } from 'next/server';

const XHS_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://www.xiaohongshu.com/',
};

/**
 * Extract video URL from XHS page
 */
async function extractVideoUrl(url: string): Promise<{
  videoUrl: string;
  title: string;
  author: string;
}> {
  // Follow redirects to get the final URL
  const response = await fetch(url, {
    headers: XHS_HEADERS,
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.status}`);
  }

  const html = await response.text();

  // Try to extract video URL from the page
  // Method 1: Look for video URL in JSON-LD or initial state data
  const stateMatch = html.match(/__INITIAL_STATE__\s*=\s*({.+?})\s*<\/script>/s);
  if (stateMatch) {
    try {
      // Clean up the JSON string (XHS uses undefined which isn't valid JSON)
      const cleanJson = stateMatch[1]
        .replace(/undefined/g, 'null')
        .replace(/\n/g, '');
      const state = JSON.parse(cleanJson);

      // Navigate the state object to find video info
      const noteData = state?.note?.noteDetailMap;
      if (noteData) {
        const noteId = Object.keys(noteData)[0];
        const note = noteData[noteId]?.note;
        if (note) {
          const video = note.video;
          const title = note.title || note.desc || '小红书视频';
          const author = note.user?.nickname || '未知';

          if (video) {
            // Try different video URL sources
            const videoUrl =
              video.consumer?.originVideoKey
                ? `https://sns-video-bd.xhscdn.com/${video.consumer.originVideoKey}`
                : video.media?.stream?.h264?.[0]?.masterUrl
                  || video.media?.stream?.h265?.[0]?.masterUrl
                  || video.media?.stream?.av1?.[0]?.masterUrl
                  || '';

            if (videoUrl) {
              return { videoUrl, title, author };
            }
          }
        }
      }
    } catch {
      // JSON parse failed, try other methods
    }
  }

  // Method 2: Look for video meta tags
  const ogVideoMatch = html.match(/<meta\s+property="og:video"\s+content="([^"]+)"/);
  if (ogVideoMatch) {
    const title = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/)?.[1] || '小红书视频';
    return { videoUrl: ogVideoMatch[1], title, author: '未知' };
  }

  // Method 3: Look for video source in HTML
  const videoSrcMatch = html.match(/<video[^>]*src="([^"]+)"/);
  if (videoSrcMatch) {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '小红书视频';
    return { videoUrl: videoSrcMatch[1], title, author: '未知' };
  }

  // Method 4: Look for video URLs in script tags
  const videoKeyMatch = html.match(/"originVideoKey"\s*:\s*"([^"]+)"/);
  if (videoKeyMatch) {
    const videoUrl = `https://sns-video-bd.xhscdn.com/${videoKeyMatch[1]}`;
    const title = html.match(/"title"\s*:\s*"([^"]+)"/)?.[1] || '小红书视频';
    const author = html.match(/"nickname"\s*:\s*"([^"]+)"/)?.[1] || '未知';
    return { videoUrl, title, author };
  }

  throw new Error('无法从页面中提取视频链接，该内容可能不是视频或链接已失效');
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: '请提供视频链接' },
        { status: 400 }
      );
    }

    // Validate URL format - accept xiaohongshu.com and xhslink.com (share links)
    if (!url.includes('xiaohongshu.com') && !url.includes('xhslink.com')) {
      return NextResponse.json(
        { error: '请提供有效的小红书链接' },
        { status: 400 }
      );
    }

    const result = await extractVideoUrl(url);

    return NextResponse.json({
      success: true,
      videoUrl: result.videoUrl,
      metadata: {
        title: result.title,
        author: result.author,
        type: '视频',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    console.error('[Download] API Error:', message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: '下载服务运行正常',
  });
}
