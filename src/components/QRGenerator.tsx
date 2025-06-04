'use client';

import { useState, useRef, useEffect } from 'react';
import { useQRCode } from 'next-qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useQRStore, type QRCodeStyle } from '@/store/qrStore';
import { Download, Palette, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function QRGenerator() {
  const { Canvas } = useQRCode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [style, setStyle] = useState<QRCodeStyle>({
    size: 300,
    color: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M',
    margin: 4,
  });

  const { createQRCode, currentQR } = useQRStore();

  const handleGenerate = () => {
    if (!name.trim() || !url.trim()) {
      toast.error('请填写二维码名称和目标网址');
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error('请输入有效的网址');
      return;
    }

    const qr = createQRCode(name, url, style);
    toast.success(`二维码 "${name}" 创建成功！`);
    
    // 清空表单
    setName('');
    setUrl('');
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      toast.error('未找到二维码，请先生成二维码');
      return;
    }
    
    const link = document.createElement('a');
    link.download = `${currentQR?.name || 'qrcode'}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success('二维码已下载');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 生成器表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              创建新二维码
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">二维码名称</Label>
              <Input
                id="name"
                placeholder="例如：官网链接"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">目标网址</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <Label>样式设置</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">尺寸</Label>
                  <Input
                    id="size"
                    type="number"
                    min="100"
                    max="500"
                    value={style.size}
                    onChange={(e) => setStyle({ ...style, size: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margin">边距</Label>
                  <Input
                    id="margin"
                    type="number"
                    min="0"
                    max="10"
                    value={style.margin}
                    onChange={(e) => setStyle({ ...style, margin: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">前景色</Label>
                  <Input
                    id="color"
                    type="color"
                    value={style.color}
                    onChange={(e) => setStyle({ ...style, color: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">背景色</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={style.backgroundColor}
                    onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleGenerate} className="w-full">
              生成二维码
            </Button>
          </CardContent>
        </Card>

        {/* 预览区域 */}
        <Card>
          <CardHeader>
            <CardTitle>预览</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {currentQR ? (
              <>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Canvas
                    text={`${window.location.origin}/r/${currentQR.shortCode}`}
                    options={{
                      width: style.size,
                      color: {
                        dark: style.color,
                        light: style.backgroundColor,
                      },
                      margin: style.margin,
                      errorCorrectionLevel: style.errorCorrectionLevel,
                    }}
                  />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="font-medium">{currentQR.name}</p>
                  <p className="text-sm text-gray-600 break-all">
                    短链接: {window.location.origin}/r/{currentQR.shortCode}
                  </p>
                  <p className="text-xs text-gray-500 break-all">
                    目标网址: {currentQR.currentUrl}
                  </p>
                </div>

                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  下载二维码
                </Button>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-4"></div>
                <p>创建您的第一个二维码</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 