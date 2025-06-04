'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQRStore } from '@/store/qrStore';

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const { getQRByShortCode, addScan } = useQRStore();
  const [error, setError] = useState<string | null>(null);
  
  const shortCode = params.shortCode as string;

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // 查找对应的二维码
        const qrCode = getQRByShortCode(shortCode);
        
        if (!qrCode) {
          setError('二维码不存在或已失效');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // 记录扫码统计
        const userAgent = navigator.userAgent;
        const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'Mobile' : 'Desktop';
        
        addScan(qrCode.id, {
          timestamp: new Date().toISOString(),
          userAgent: userAgent,
          ip: 'unknown', // 在客户端无法获取真实IP
          device: device,
          country: 'unknown',
          city: 'unknown'
        });

        // 延迟跳转，确保统计记录成功
        setTimeout(() => {
          window.location.href = qrCode.currentUrl;
        }, 500);

      } catch (error) {
        console.error('重定向失败:', error);
        setError('重定向失败，请稍后重试');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleRedirect();
  }, [shortCode, getQRByShortCode, addScan, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">出错了</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">3秒后自动返回首页...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">正在跳转</h2>
        <p className="text-gray-600">请稍候，正在为您跳转到目标页面...</p>
      </div>
    </div>
  );
} 