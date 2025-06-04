'use client';

import { useState, useRef, useEffect } from 'react';
import { useQRCode } from 'next-qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useQRStore, type QRCodeStyle } from '@/store/qrStore';
import { Download, Palette, Settings, Upload, X, Image } from 'lucide-react';
import { toast } from 'sonner';

export default function QRGenerator() {
  const { Canvas } = useQRCode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [style, setStyle] = useState<QRCodeStyle>({
    size: 300,
    color: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M',
    margin: 4,
    logoOptions: {
      width: 60,
    },
  });

  const { createQRCode, currentQR } = useQRStore();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    // 检查文件大小 (2MB限制)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('图片文件不能超过2MB');
      return;
    }

    setLogoFile(file);

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      setStyle(prev => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setStyle(prev => ({ ...prev, logoUrl: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    handleRemoveLogo();
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

            {/* Logo 上传区域 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <Label>Logo设置</Label>
              </div>

              {!logoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-2"
                      >
                        选择Logo图片
                      </Button>
                      <p className="text-xs">支持 JPG、PNG 格式，建议尺寸正方形，最大2MB</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={logoPreview}
                        alt="Logo预览"
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{logoFile?.name}</p>
                        <p className="text-gray-500">
                          {logoFile ? Math.round(logoFile.size / 1024) : 0} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logoWidth">Logo尺寸</Label>
                    <Input
                      id="logoWidth"
                      type="number"
                      min="20"
                      max="120"
                      value={style.logoOptions?.width || 60}
                      onChange={(e) => setStyle(prev => ({
                        ...prev,
                        logoOptions: {
                          ...prev.logoOptions,
                          width: Number(e.target.value),
                        }
                      }))}
                    />
                    <p className="text-xs text-gray-500">推荐尺寸：40-80像素</p>
                  </div>
                </div>
              )}
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
                    logo={currentQR.style.logoUrl ? {
                      src: currentQR.style.logoUrl,
                      options: currentQR.style.logoOptions,
                    } : undefined}
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