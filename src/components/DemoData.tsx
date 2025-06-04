'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQRStore } from '@/store/qrStore';
import { Database, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function DemoData() {
  const { createQRCode, addScan, qrCodes } = useQRStore();

  const addDemoData = () => {
    // 创建演示二维码
    const demoQRs = [
      {
        name: '官方网站',
        url: 'https://example.com',
        style: { color: '#1f2937', backgroundColor: '#ffffff', size: 200 }
      },
      {
        name: '产品介绍',
        url: 'https://product.example.com',
        style: { color: '#dc2626', backgroundColor: '#ffffff', size: 250 }
      },
      {
        name: '联系我们',
        url: 'https://contact.example.com',
        style: { color: '#059669', backgroundColor: '#ffffff', size: 180 }
      }
    ];

    demoQRs.forEach((demo, index) => {
      const qr = createQRCode(demo.name, demo.url, demo.style);
      
      // 为每个二维码添加一些演示扫码数据
      const scanCount = Math.floor(Math.random() * 50) + 10;
      const devices = ['Mobile', 'Desktop', 'Tablet'];
      
      for (let i = 0; i < scanCount; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - daysAgo);
        timestamp.setHours(timestamp.getHours() - hoursAgo);
        
        const countries = ['中国', '美国', '日本', '德国'];
        const cities = ['北京', '上海', '广州', '深圳'];
        const deviceIndex = Math.floor(Math.random() * devices.length);
        const countryIndex = Math.floor(Math.random() * countries.length);
        const cityIndex = Math.floor(Math.random() * cities.length);
        
        addScan(qr.id, {
          timestamp: timestamp.toISOString(),
          userAgent: `Demo User Agent ${i}`,
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          device: devices[deviceIndex] || 'Desktop',
          country: countries[countryIndex],
          city: cities[cityIndex]
        });
      }
    });

    toast.success('演示数据已添加！');
  };

  if (qrCodes.length > 0) {
    return null; // 如果已有数据则不显示
  }

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-gray-600">
          <Database className="h-5 w-5" />
          快速体验
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600 text-sm">
          还没有二维码？添加一些演示数据快速体验功能
        </p>
        <Button onClick={addDemoData} variant="outline" className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          添加演示数据
        </Button>
      </CardContent>
    </Card>
  );
} 