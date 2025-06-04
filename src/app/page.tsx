'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import QRGenerator from '@/components/QRGenerator'
import QRList from '@/components/QRList'
import QRAnalytics from '@/components/QRAnalytics'
import DemoData from '@/components/DemoData'
import { QrCode, List, BarChart3, Zap } from 'lucide-react'
import { Toaster } from 'sonner'

/**
 * @description 这只是个示例页面，你可以随意修改这个页面或进行全面重构
 */
export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Toaster position="top-right" />
			
			{/* 头部 */}
			<header className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
							<QrCode className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">动态二维码生成器</h1>
							<p className="text-gray-600">创建可追踪、可修改的智能二维码</p>
						</div>
					</div>
				</div>
			</header>

			{/* 功能介绍 */}
			<section className="bg-blue-50 border-b border-blue-100">
				<div className="container mx-auto px-4 py-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
								<Zap className="h-6 w-6 text-white" />
							</div>
							<h3 className="font-semibold text-gray-900 mb-2">动态修改</h3>
							<p className="text-gray-600 text-sm">二维码生成后可随时修改目标链接，无需重新打印</p>
						</div>
						<div className="text-center">
							<div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
								<BarChart3 className="h-6 w-6 text-white" />
							</div>
							<h3 className="font-semibold text-gray-900 mb-2">数据统计</h3>
							<p className="text-gray-600 text-sm">实时追踪扫码次数、访客来源和设备信息</p>
						</div>
						<div className="text-center">
							<div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
								<QrCode className="h-6 w-6 text-white" />
							</div>
							<h3 className="font-semibold text-gray-900 mb-2">个性化设计</h3>
							<p className="text-gray-600 text-sm">自定义颜色、尺寸和样式，打造专属二维码</p>
						</div>
					</div>
				</div>
			</section>

			{/* 主内容 */}
			<main className="container mx-auto px-4 py-8">
				<Tabs defaultValue="generator" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="generator" className="flex items-center gap-2">
							<QrCode className="h-4 w-4" />
							生成二维码
						</TabsTrigger>
						<TabsTrigger value="list" className="flex items-center gap-2">
							<List className="h-4 w-4" />
							我的二维码
						</TabsTrigger>
						<TabsTrigger value="analytics" className="flex items-center gap-2">
							<BarChart3 className="h-4 w-4" />
							数据分析
						</TabsTrigger>
					</TabsList>

					<div className="mt-6">
						<TabsContent value="generator">
							<QRGenerator />
						</TabsContent>

						<TabsContent value="list">
							<div className="space-y-6">
								<DemoData />
								<QRList />
							</div>
						</TabsContent>

						<TabsContent value="analytics">
							<QRAnalytics />
						</TabsContent>
					</div>
				</Tabs>
			</main>

			{/* 页脚 */}
			<footer className="bg-white border-t border-gray-200 mt-12">
				<div className="container mx-auto px-4 py-6">
					<div className="text-center text-gray-600">
						<p className="text-sm">
							动态二维码生成器 - 让您的二维码更智能
						</p>
						<p className="text-xs mt-2">
							数据保存在本地浏览器中，请注意备份重要数据
						</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
