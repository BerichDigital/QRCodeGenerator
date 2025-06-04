'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface QRCodeData {
  id: string;
  name: string;
  currentUrl: string;
  shortCode: string;
  scans: any[];
}

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  
  const shortCode = params.shortCode as string;

  const addDebugInfo = (info: string) => {
    console.log('DEBUG:', info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        addDebugInfo(`开始处理重定向，短码: ${shortCode}`);

        // 直接从localStorage读取数据
        const storeData = localStorage.getItem('qr-store');
        addDebugInfo(`localStorage数据: ${storeData ? '存在' : '不存在'}`);
        
        if (!storeData) {
          setError('未找到二维码数据，请先创建二维码');
          return;
        }

        let parsedData;
        try {
          parsedData = JSON.parse(storeData);
          addDebugInfo(`数据解析成功，包含 ${parsedData.state?.qrCodes?.length || 0} 个二维码`);
        } catch (e) {
          addDebugInfo(`数据解析失败: ${e}`);
          setError('数据格式错误');
          return;
        }

        const qrCodes = parsedData.state?.qrCodes || [];
        addDebugInfo(`查找短码 ${shortCode} 在 ${qrCodes.length} 个二维码中`);

        const qrCode = qrCodes.find((qr: any) => qr.shortCode === shortCode);
        
        if (!qrCode) {
          addDebugInfo(`未找到匹配的二维码`);
          addDebugInfo(`现有短码: ${qrCodes.map((qr: any) => qr.shortCode).join(', ')}`);
          setError('二维码不存在或已失效');
          return;
        }

        addDebugInfo(`找到目标二维码: ${qrCode.name}`);
        addDebugInfo(`目标URL: ${qrCode.currentUrl}`);
        setQrData(qrCode);

        // 检查URL
        if (!qrCode.currentUrl) {
          setError('目标链接为空');
          return;
        }

        // 记录扫码（简化版）
        const newScan = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: 'unknown',
          device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          country: 'unknown',
          city: 'unknown'
        };

        // 更新localStorage
        try {
          const updatedQRCodes = qrCodes.map((qr: any) => {
            if (qr.shortCode === shortCode) {
              return { ...qr, scans: [...qr.scans, newScan] };
            }
            return qr;
          });

          const updatedData = {
            ...parsedData,
            state: {
              ...parsedData.state,
              qrCodes: updatedQRCodes
            }
          };

          localStorage.setItem('qr-store', JSON.stringify(updatedData));
          addDebugInfo('扫码记录已保存');
        } catch (e) {
          addDebugInfo(`保存扫码记录失败: ${e}`);
        }

        // 准备跳转
        let targetUrl = qrCode.currentUrl;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = 'https://' + targetUrl;
          addDebugInfo(`URL已修正为: ${targetUrl}`);
        }

        addDebugInfo(`准备跳转到: ${targetUrl}`);

        // 延迟跳转
        setTimeout(() => {
          addDebugInfo('执行跳转');
          window.location.href = targetUrl;
        }, 2000);

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '未知错误';
        addDebugInfo(`处理失败: ${errorMsg}`);
        setError(`重定向失败: ${errorMsg}`);
      }
    };

    if (shortCode) {
      // 延迟一下确保页面完全加载
      setTimeout(handleRedirect, 500);
    }
  }, [shortCode, router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => router.push('/'), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">跳转失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">5秒后自动返回首页</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              立即返回首页
            </button>
            
            <details className="text-left">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                查看调试信息 ({debugInfo.length} 条)
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
                <div className="space-y-1">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="text-gray-600 font-mono break-all">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">正在跳转</h2>
        <p className="text-gray-600 mb-4">请稍候，正在为您跳转到目标页面...</p>
        
        <div className="space-y-2 text-sm">
          <p className="text-gray-500">短码: <span className="font-mono">{shortCode}</span></p>
          {qrData && (
            <>
              <p className="text-gray-500">目标: <span className="font-medium">{qrData.name}</span></p>
              <p className="text-gray-500 break-all">链接: {qrData.currentUrl}</p>
            </>
          )}
        </div>

        <details className="mt-4 text-left">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
            实时调试信息 ({debugInfo.length} 条)
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-xs max-h-40 overflow-y-auto">
            <div className="space-y-1">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-gray-600 font-mono break-all">
                  {info}
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
} 