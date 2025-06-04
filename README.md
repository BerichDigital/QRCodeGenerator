# 动态二维码生成器 🚀

一个功能完整的动态二维码生成和管理平台，支持实时数据追踪、链接动态修改和详细的统计分析。

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.15-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ 核心功能

### 🎯 动态二维码生成
- **实时生成**：支持快速生成高质量二维码
- **个性化定制**：自定义颜色、尺寸、边距等样式
- **多种格式**：支持不同的纠错级别设置
- **即时预览**：所见即所得的预览功能

### 🔄 动态链接管理
- **实时修改**：二维码生成后可随时修改目标链接
- **无需重印**：更改链接不影响已打印的二维码
- **版本控制**：保留原始链接和当前链接记录
- **批量管理**：支持管理多个二维码项目

### 📊 数据分析与统计
- **实时统计**：扫码次数、独立访客、设备类型
- **可视化图表**：趋势分析、设备分布、时段统计
- **详细报告**：支持7天、30天、90天数据分析
- **导出功能**：统计数据可视化展示

### 🎨 现代化界面
- **响应式设计**：完美适配移动端和桌面端
- **直观操作**：简洁易用的用户界面
- **实时反馈**：操作状态的即时提示
- **暗色模式**：支持明暗主题切换

## 🛠️ 技术栈

- **前端框架**：Next.js 15.3.3 (App Router)
- **开发语言**：TypeScript 5.8.2
- **样式框架**：Tailwind CSS 4.0.15
- **UI组件库**：shadcn/ui
- **状态管理**：Zustand
- **图表库**：Recharts
- **二维码生成**：next-qrcode
- **数据持久化**：LocalStorage
- **代码规范**：Biome
- **包管理器**：npm

## 🚀 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/BerichDigital/QRCodeGenerator.git
cd QRCodeGenerator
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run typecheck

# 代码检查和格式化
npm run check
npm run check:write
```

## 📱 功能模块

### 1. 二维码生成器
- 输入目标网址和二维码名称
- 自定义样式：颜色、尺寸、边距
- 实时预览生成效果
- 一键下载PNG格式图片

### 2. 二维码管理
- 查看所有已创建的二维码
- 复制短链接到剪贴板
- 动态修改目标链接
- 删除不需要的二维码

### 3. 数据分析
- 总体统计：扫码次数、独立访客、设备数量
- 趋势分析：每日扫码变化趋势
- 设备分布：移动端vs桌面端统计
- 时段分析：24小时访问分布
- 性能排行：二维码表现对比

### 4. 重定向系统
- 智能短链接：`/r/{shortCode}` 格式
- 自动统计：记录扫码时间、设备、IP等信息
- 错误处理：无效链接的友好提示
- 响应式：支持各种设备访问

## 🎯 使用场景

- **营销推广**：活动海报、宣传册二维码
- **产品标签**：商品包装动态链接
- **名片二维码**：个人/企业信息展示
- **菜单二维码**：餐厅数字菜单
- **文档分享**：在线文档快速访问
- **社交媒体**：个人主页/社媒链接

## 🔧 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── r/                 # 重定向页面
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 主页面
├── components/            # React组件
│   ├── ui/               # shadcn UI组件
│   ├── QRGenerator.tsx   # 二维码生成器
│   ├── QRList.tsx        # 二维码列表
│   ├── QRAnalytics.tsx   # 数据分析
│   └── DemoData.tsx      # 演示数据
├── store/                # 状态管理
│   └── qrStore.ts        # 二维码数据store
└── styles/               # 样式文件
```

## 🌟 特色亮点

- **零配置部署**：开箱即用，无需复杂配置
- **本地数据存储**：隐私安全，数据本地化
- **演示数据**：内置样例数据，快速体验功能
- **TypeScript**：完整的类型安全保障
- **响应式设计**：适配各种屏幕尺寸
- **现代化UI**：基于最新设计规范
- **性能优化**：代码分割、懒加载等优化

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 详情请查看LICENSE文件

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 联系方式

- 项目地址：[https://github.com/BerichDigital/QRCodeGenerator](https://github.com/BerichDigital/QRCodeGenerator)
- 问题反馈：[https://github.com/BerichDigital/QRCodeGenerator/issues](https://github.com/BerichDigital/QRCodeGenerator/issues)

## 🙏 致谢

感谢以下开源项目的支持：
- [Next.js](https://nextjs.org/) - React全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - UI组件库
- [Zustand](https://github.com/pmndrs/zustand) - 状态管理
- [Recharts](https://recharts.org/) - 图表库
- [next-qrcode](https://github.com/Bunlong/next-qrcode) - 二维码生成

---

<div align="center">
  <strong>让您的二维码更智能！</strong><br>
  ⭐ 如果这个项目对您有帮助，请给我们一个Star！⭐
</div>
