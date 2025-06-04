'use client';

import { useState } from 'react';
import { useQRStore } from '@/store/qrStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Edit, 
  MoreVertical, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  BarChart3, 
  Copy 
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function QRList() {
  const { qrCodes, updateQRUrl, deleteQRCode, setCurrentQR } = useQRStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');

  const handleCopyShortLink = (shortCode: string) => {
    const shortLink = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(shortLink);
    toast.success('短链接已复制到剪贴板');
  };

  const handleEditUrl = (id: string, currentUrl: string) => {
    setEditingId(id);
    setNewUrl(currentUrl);
  };

  const handleSaveUrl = () => {
    if (!editingId) return;
    
    try {
      new URL(newUrl);
      updateQRUrl(editingId, newUrl);
      setEditingId(null);
      setNewUrl('');
      toast.success('链接已更新');
    } catch {
      toast.error('请输入有效的网址');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`确定要删除二维码"${name}"吗？`)) {
      deleteQRCode(id);
      toast.success('二维码已删除');
    }
  };

  const handleSelect = (qr: any) => {
    setCurrentQR(qr);
    toast.success(`已选择二维码"${qr.name}"`);
  };

  if (qrCodes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-4"></div>
          <p className="text-gray-500">还没有创建任何二维码</p>
          <p className="text-sm text-gray-400 mt-2">创建您的第一个动态二维码吧</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">我的二维码</h2>
        <Badge variant="secondary">{qrCodes.length} 个二维码</Badge>
      </div>

      <div className="grid gap-4">
        {qrCodes.map((qr) => (
          <Card key={qr.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{qr.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSelect(qr)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      选择预览
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditUrl(qr.id, qr.currentUrl)}>
                      <Edit className="h-4 w-4 mr-2" />
                      编辑链接
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(qr.id, qr.name)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">短链接:</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopyShortLink(qr.shortCode)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    复制
                  </Button>
                </div>
                <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded break-all">
                  {window.location.origin}/r/{qr.shortCode}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">目标网址:</span>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded flex-1 break-all">
                    {qr.currentUrl}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(qr.currentUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(qr.createdAt), 'yyyy/MM/dd HH:mm')}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BarChart3 className="h-3 w-3" />
                  {qr.scans.length} 次扫码
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 编辑链接弹窗 */}
      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑目标链接</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">新的目标网址</Label>
              <Input
                id="edit-url"
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingId(null)}>
                取消
              </Button>
              <Button onClick={handleSaveUrl}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 