'use client';

import { useMemo } from 'react';
import { useQRStore } from '@/store/qrStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Smartphone, Globe, Calendar, BarChart3 } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import { useState } from 'react';

export default function QRAnalytics() {
  const { qrCodes, currentQR } = useQRStore();
  const [selectedQRId, setSelectedQRId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7');

  // 获取要分析的数据
  const targetQRCodes = useMemo(() => {
    if (selectedQRId === 'all') {
      return qrCodes;
    }
    const qr = qrCodes.find(q => q.id === selectedQRId);
    return qr ? [qr] : [];
  }, [qrCodes, selectedQRId]);

  // 获取时间范围内的扫码数据
  const scansInRange = useMemo(() => {
    const daysAgo = parseInt(timeRange);
    const cutoffDate = subDays(new Date(), daysAgo);
    
    return targetQRCodes.flatMap(qr => 
      qr.scans.filter(scan => isAfter(new Date(scan.timestamp), cutoffDate))
    );
  }, [targetQRCodes, timeRange]);

  // 总体统计
  const totalStats = useMemo(() => {
    const totalScans = scansInRange.length;
    const uniqueDevices = new Set(scansInRange.map(scan => scan.device)).size;
    const uniqueIPs = new Set(scansInRange.map(scan => scan.ip)).size;
    
    return {
      totalScans,
      uniqueDevices,
      uniqueIPs,
      avgScansPerDay: Math.round(totalScans / parseInt(timeRange)),
    };
  }, [scansInRange, timeRange]);

  // 每日扫码统计
  const dailyScans = useMemo(() => {
    const days = parseInt(timeRange);
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      
      const count = scansInRange.filter(scan => {
        const scanDate = new Date(scan.timestamp);
        return scanDate >= dayStart && scanDate < dayEnd;
      }).length;
      
      data.push({
        date: format(date, 'MM/dd'),
        scans: count,
      });
    }
    
    return data;
  }, [scansInRange, timeRange]);

  // 设备类型统计
  const deviceStats = useMemo(() => {
    const deviceCounts = scansInRange.reduce((acc, scan) => {
      acc[scan.device] = (acc[scan.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count,
    }));
  }, [scansInRange]);

  // 时段分布统计
  const hourlyStats = useMemo(() => {
    const hourCounts = new Array(24).fill(0);
    
    scansInRange.forEach(scan => {
      const hour = new Date(scan.timestamp).getHours();
      hourCounts[hour]++;
    });

    return hourCounts.map((count, hour) => ({
      hour: `${hour}:00`,
      scans: count,
    }));
  }, [scansInRange]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={selectedQRId} onValueChange={setSelectedQRId}>
            <SelectTrigger>
              <SelectValue placeholder="选择二维码" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有二维码</SelectItem>
              {qrCodes.map(qr => (
                <SelectItem key={qr.id} value={qr.id}>{qr.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">最近7天</SelectItem>
              <SelectItem value="30">最近30天</SelectItem>
              <SelectItem value="90">最近90天</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总扫码次数</p>
                <p className="text-2xl font-bold">{totalStats.totalScans}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">独立访客</p>
                <p className="text-2xl font-bold">{totalStats.uniqueIPs}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">设备数量</p>
                <p className="text-2xl font-bold">{totalStats.uniqueDevices}</p>
              </div>
              <Smartphone className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">日均扫码</p>
                <p className="text-2xl font-bold">{totalStats.avgScansPerDay}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 每日扫码趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>扫码趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyScans}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scans" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 设备类型分布 */}
        <Card>
          <CardHeader>
            <CardTitle>设备类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ device, count }) => `${device}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {deviceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 时段分布 */}
      <Card>
        <CardHeader>
          <CardTitle>24小时访问分布</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 二维码表现 */}
      {selectedQRId === 'all' && qrCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>二维码表现排行</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qrCodes
                .map(qr => ({
                  ...qr,
                  recentScans: qr.scans.filter(scan => 
                    isAfter(new Date(scan.timestamp), subDays(new Date(), parseInt(timeRange)))
                  ).length
                }))
                .sort((a, b) => b.recentScans - a.recentScans)
                .map((qr, index) => (
                  <div key={qr.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{qr.name}</p>
                        <p className="text-sm text-gray-600">总扫码: {qr.scans.length}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{qr.recentScans}</p>
                      <p className="text-sm text-gray-600">近期扫码</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 