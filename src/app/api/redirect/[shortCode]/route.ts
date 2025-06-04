import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    
    // 从localStorage读取数据（实际项目中应该从数据库读取）
    // 这里我们返回HTML页面来在客户端处理重定向和统计
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>重定向中...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
        }
        .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h2>正在跳转...</h2>
        <p>如果页面没有自动跳转，<a href="#" id="manual-link">请点击这里</a></p>
    </div>
    
    <script>
        async function redirect() {
            try {
                // 获取设备信息
                const userAgent = navigator.userAgent;
                const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'Mobile' : 'Desktop';
                
                // 从localStorage获取二维码数据
                const qrStore = localStorage.getItem('qr-store');
                if (!qrStore) {
                    window.location.href = '/';
                    return;
                }
                
                const { state } = JSON.parse(qrStore);
                const qrCode = state.qrCodes.find(qr => qr.shortCode === '${shortCode}');
                
                if (!qrCode) {
                    window.location.href = '/';
                    return;
                }
                
                // 记录扫码统计
                const scan = {
                    timestamp: new Date().toISOString(),
                    userAgent: userAgent,
                    ip: 'unknown', // 在客户端无法获取真实IP
                    device: device,
                    country: 'unknown',
                    city: 'unknown'
                };
                
                // 更新localStorage中的扫码数据
                const updatedQRCodes = state.qrCodes.map(qr => {
                    if (qr.shortCode === '${shortCode}') {
                        return {
                            ...qr,
                            scans: [...qr.scans, { ...scan, id: Date.now().toString() }]
                        };
                    }
                    return qr;
                });
                
                const updatedStore = {
                    ...state,
                    qrCodes: updatedQRCodes
                };
                
                localStorage.setItem('qr-store', JSON.stringify({
                    state: updatedStore,
                    version: 0
                }));
                
                // 更新手动链接
                document.getElementById('manual-link').href = qrCode.currentUrl;
                
                // 延迟跳转，确保统计记录成功
                setTimeout(() => {
                    window.location.href = qrCode.currentUrl;
                }, 500);
                
            } catch (error) {
                console.error('重定向失败:', error);
                window.location.href = '/';
            }
        }
        
        // 页面加载完成后开始重定向
        redirect();
    </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
} 