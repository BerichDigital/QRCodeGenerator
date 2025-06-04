'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQRStore } from '@/store/qrStore';

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const { getQRByShortCode, addScan, qrCodes } = useQRStore();
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');
  
  const shortCode = params.shortCode as string;

  useEffect(() => {
    const handleRedirect = async () => {
      const currentAttempt = attempts + 1;
      setAttempts(currentAttempt);
      
      try {
        setDebugInfo(`尝试第${currentAttempt}次，短码: ${shortCode}`);
        
        // 如果尝试超过3次，显示错误
        if (currentAttempt > 3) {
          setError('重定向失败，请检查二维码是否有效');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // 等待store hydration
        await new Promise(resolve => setTimeout(resolve, currentAttempt * 200));
        
        setDebugInfo(`正在查找二维码，当前数据数量: ${qrCodes.length}`);
        
        // 查找对应的二维码
        const qrCode = getQRByShortCode(shortCode);
        
        if (!qrCode) {
          if (qrCodes.length === 0 && currentAttempt < 3) {
            // 数据还没加载完，重试
            setDebugInfo('数据加载中，准备重试...');
            setTimeout(() => handleRedirect(), 1000);
            return;
          }
          
          console.log('未找到二维码，shortCode:', shortCode, 'qrCodes:', qrCodes);
          setError('二维码不存在或已失效');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        console.log('找到二维码:', qrCode);
        setDebugInfo(`找到目标: ${qrCode.name}`);

        // 检查目标URL是否有效
        if (!qrCode.currentUrl) {
          setError('目标链接无效');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // 记录扫码统计
        const userAgent = navigator.userAgent;
        const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'Mobile' : 'Desktop';
        
        addScan(qrCode.id, {
          timestamp: new Date().toISOString(),
          userAgent: userAgent,
          ip: 'unknown',
          device: device,
          country: 'unknown',
          city: 'unknown'
        });

        console.log('即将跳转到:', qrCode.currentUrl);
        setDebugInfo(`准备跳转到: ${qrCode.currentUrl}`);

        // 确保URL格式正确
        let targetUrl = qrCode.currentUrl;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = 'https://' + targetUrl;
        }

        // 延迟一下再跳转，给用户看到状态
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 800);

      } catch (error) {
        console.error('重定向失败:', error);
        setError(`重定向失败: ${error instanceof Error ? error.message : '未知错误'}`);
        setTimeout(() => router.push('/'), 3000);
      }
    };

    if (shortCode && attempts === 0) {
      handleRedirect();
    }
  }, [shortCode, attempts, getQRByShortCode, addScan, router, qrCodes]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">跳转失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">3秒后自动返回首页...</p>
          <div className="space-y-2">
            <button 
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              立即返回
            </button>
            <details className="text-left">
              <summary className="text-xs text-gray-400 cursor-pointer">调试信息</summary>
              <pre className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded overflow-auto">
                短码: {shortCode}{'\n'}
                尝试次数: {attempts}{'\n'}
                二维码数量: {qrCodes.length}{'\n'}
                {debugInfo}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">正在跳转</h2>
        <p className="text-gray-600 mb-2">请稍候，正在为您跳转到目标页面...</p>
        <p className="text-sm text-gray-500 mb-2">短码: {shortCode}</p>
        <p className="text-xs text-gray-400">{debugInfo}</p>
        {attempts > 1 && (
          <p className="text-xs text-orange-500 mt-2">重试中... ({attempts}/3)</p>
        )}
      </div>
    </div>
  );
} 