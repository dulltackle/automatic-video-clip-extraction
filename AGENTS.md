# AI 授课视频智能剪辑系统 - 项目上下文

## 项目概述

构建一个基于 LangChain-TypeScript 的本地应用，实现：

1. 从授课视频中提取音频并转录为带时间戳的文字
2. 根据用户的自然语言描述，智能识别并提取符合要求的知识片段
3. 从原视频中剪辑出多个独立片段，保持原分辨率
4. 可选生成带字幕的视频
5. 处理流程：`视频导入(验证) → 提取音频(FFmpeg) → 转录(Whisper) → 分析(LLM) → 剪辑(FFmpeg) → 导出`

## 技术栈

| 层次         | 技术                        | 用途                           |
| ------------ | --------------------------- | ------------------------------ |
| **运行时**   | Node.js                     | JavaScript/TypeScript 执行环境 |
| **语言**     | TypeScript                  | 类型安全的开发语言             |
| **桌面框架** | Electron 28+ (Vite + React) | 跨平台桌面应用                 |
| **UI 组件**  | shadcn/ui                   | 现代化 UI 组件库               |
| **AI 框架**  | LangChain.js                | LLM 应用开发框架               |
| **视频处理** | FFmpeg                      | 视频/音频提取、剪辑、字幕合成  |
| **语音识别** | Whisper API / FunASR        | 语音转文字                     |
| **LLM API**  | OpenAI API                  | 自然语言理解与分析             |

## 系统架构

### 数据流

1. **VideoProcessor** (FFmpeg): 视频 -> 音频
2. **AudioTranscriber** (Whisper): 音频 -> 带时间戳文本 `[{start, end, text}]`
3. **ContentAnalyzer** (LLM): 文本+描述 -> 目标片段 `[{start, end, confidence}]`
4. **ClipExtractor** (FFmpeg): 视频+片段 -> 结果视频

### 目录结构

```
video-clip-extraction/
├── electron/                       # Electron 主进程
│   ├── main.ts                     # 主进程入口
│   ├── preload.ts                  # 预加载脚本 (IPC 桥接)
│   ├── window.ts                   # 窗口管理
│   ├── ipc/                        # IPC 处理器
│   │   ├── video.handler.ts        # 视频处理 IPC
│   │   ├── transcription.handler.ts  # 转录 IPC
│   │   ├── analysis.handler.ts     # 分析 IPC
│   │   ├── config.handler.ts       # 配置 IPC
│   │   └── dialog.handler.ts       # 对话框 IPC
│   └── tray.ts                     # 系统托盘
│
├── src/                            # 渲染进程 (React)
│   ├── main.tsx                    # React 入口
│   ├── App.tsx                     # 根组件
│   │
│   ├── components/                 # UI 组件
│   │   ├── layout/                 # 布局组件
│   │   │   ├── Sidebar.tsx         # 侧边导航
│   │   │   ├── Header.tsx          # 顶部标题栏
│   │   │   ├── StatusBar.tsx       # 底部状态栏
│   │   │   └── MainContent.tsx     # 主内容区
│   │   │
│   │   ├── video/                  # 视频相关组件
│   │   │   ├── VideoDropZone.tsx   # 拖拽上传区域
│   │   │   ├── VideoList.tsx       # 视频列表
│   │   │   ├── VideoCard.tsx       # 视频卡片
│   │   │   └── VideoPreview.tsx    # 视频预览播放器
│   │   │
│   │   ├── transcription/          # 转录相关组件
│   │   │   ├── TranscriptionPanel.tsx   # 转录面板
│   │   │   ├── TranscriptionEditor.tsx  # 转录编辑器
│   │   │   ├── TranscriptionProgress.tsx # 转录进度
│   │   │   └── TimestampMarker.tsx      # 时间戳标记
│   │   │
│   │   ├── analysis/               # 分析相关组件
│   │   │   ├── QueryInput.tsx          # 查询输入框
│   │   │   ├── AnalysisProgress.tsx    # 分析进度
│   │   │   ├── MatchedSegments.tsx     # 匹配片段列表
│   │   │   ├── SegmentCard.tsx         # 片段卡片
│   │   │   └── ConfidenceBadge.tsx     # 置信度徽章
│   │   │
│   │   ├── clips/                  # 剪辑相关组件
│   │   │   ├── ClipList.tsx            # 片段列表
│   │   │   ├── ClipCard.tsx            # 片段卡片
│   │   │   ├── ClipPreview.tsx         # 片段预览
│   │   │   ├── ClipProgress.tsx        # 剪辑进度
│   │   │   └── ExportOptions.tsx       # 导出选项
│   │   │
│   │   ├── settings/               # 设置相关组件
│   │   │   ├── SettingsPanel.tsx       # 设置面板
│   │   │   ├── LLMSettings.tsx         # LLM 配置
│   │   │   ├── AudioSettings.tsx       # 音频配置
│   │   │   ├── OutputSettings.tsx      # 输出配置
│   │   │   ├── AdvancedSettings.tsx    # 高级设置
│   │   │   └── AppearanceSettings.tsx  # 外观设置
│   │   │
│   │   └── common/                 # 通用组件
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── Toast.tsx
│   │       ├── EmptyState.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── pages/                      # 页面组件
│   │   ├── HomePage.tsx            # 首页/视频导入
│   │   ├── TranscriptionPage.tsx   # 转录页面
│   │   ├── AnalysisPage.tsx        # 分析页面
│   │   ├── ClipsPage.tsx           # 剪辑页面
│   │   ├── ResultsPage.tsx         # 结果页面
│   │   └── SettingsPage.tsx        # 设置页面
│   │
│   ├── hooks/                      # 自定义 Hooks
│   │   ├── useVideo.ts             # 视频管理
│   │   ├── useTranscription.ts     # 转录管理
│   │   ├── useAnalysis.ts          # 分析管理
│   │   ├── useClips.ts             # 剪辑管理
│   │   ├── useConfig.ts            # 配置管理
│   │   ├── useIPC.ts               # IPC 通信
│   │   └── useNotification.ts      # 通知管理
│   │
│   ├── stores/                     # 状态管理 (Zustand)
│   │   ├── videoStore.ts
│   │   ├── transcriptionStore.ts
│   │   ├── analysisStore.ts
│   │   ├── clipsStore.ts
│   │   ├── configStore.ts
│   │   └── uiStore.ts
│   │
│   ├── utils/                      # 工具函数
│   │   ├── formatters.ts           # 格式化
│   │   ├── validators.ts           # 验证
│   │   └── helpers.ts              # 辅助函数
│   │
│   ├── types/                      # 类型定义
│   │   ├── electron.d.ts           # Electron API 类型
│   │   └── app.d.ts                # 应用类型
│   │
│   └── styles/                     # 样式文件
│       ├── globals.css             # 全局样式
│       ├── variables.css           # CSS 变量
│
├── src-core/                        # 核心业务逻辑 (主进程调用)
│   ├── core/
│   ├── llm/
│   ├── audio/
│   ├── video/
│   ├── types/
│   └── utils/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/                         # Electron E2E 测试
│   └── fixtures/
│
├── scripts/
├── docs/
├── build/                           # 构建输出
│   ├── electron/                    # Electron 构建
│   └── renderer/                    # 渲染进程构建
│
├── release/                         # 发布包
├── resources/                       # 资源文件
│   ├── icons/                       # 应用图标
│   ├── images/                      # 图片资源
│   └── sounds/                      # 音效（可选）
│
├── electron.vite.config.ts          # Electron Vite 配置
├── electron-builder.json5           # Electron Builder 配置
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── README.md
```

## 开发阶段

| 阶段                           | 目标                                                 |
| ------------------------------ | ---------------------------------------------------- |
| **Phase 0: 技术验证POC**       | FFmpeg验证、Whisper验证、LangChain验证、Go/No-Go决策 |
| **Phase 1: 基础架构**          | 项目初始化、类型定义、工具函数、单元测试（TDD）      |
| **Phase 2: 视频与音频处理**    | FFmpeg 集成、音频提取、单元测试（TDD）               |
| **Phase 3: 语音识别**          | Whisper 集成、转录功能、单元测试（TDD）              |
| **Phase 4: LLM 智能分析**      | LangChain 集成、内容匹配、单元测试（TDD）            |
| **Phase 5: 片段剪辑**          | 视频剪辑、字幕生成、单元测试（TDD）                  |
| **Phase 6: Electron 桌面应用** | Electron 框架、UI 界面、基础 IPC 集成（TDD）         |
| **Phase 7: 集成测试与优化**    | 集成测试、E2E 测试、性能优化、可观测性               |
| **Phase 8: 文档与发布**        | 使用文档、架构文档、打包发布                         |

## 代码规范

### 测试驱动开发 (TDD)

- **Red**: 先编写失败的测试用例
- **Green**: 编写最简代码使测试通过
- **Refactor**: 重构代码，保持测试通过
- 单元测试覆盖率目标：>= 75%
- 核心模块覆盖率目标：>= 85%

### 文件命名规范

- 类文件: `PascalCase.ts` (如 `VideoProcessor.ts`)
- 接口文件: `IPascalCase.ts` 或 `PascalCase.interface.ts`
- 工具函数: `camelCase.ts` (如 `formatTime.ts`)
- 测试文件: `OriginalName.test.ts` (如 `VideoProcessor.test.ts`)
- 常量: `SCREAMING_SNAKE_CASE` 或 `camelCase.constants.ts`

### 代码风格

- **缩进**: 2 空格
- **引号**: 单引号 `'` (字符串), 双引号 `"` (JSON)
- **分号**: 必须
- **行尾**: LF (Unix 风格)
- **最大行长度**: 100 字符
- **尾随逗号**: 多行对象/数组必须

## 开发原则

### 1. 测试优先 (Test First)

- 任何功能实现前，先编写测试用例
- 单元测试必须覆盖正常路径和边界情况
- 集成测试验证模块间协作

### 2. 渐进增强 (Progressive Enhancement)

- 核心功能必须稳定可靠
- 可选功能（如字幕生成）不影响主流程
- 降级策略确保服务可用性

### 3. 配置驱动 (Configuration Driven)

- 行为通过配置调整，避免硬编码
- 支持环境变量和配置文件
- 配置变更无需重新构建

### 4. 错误透明 (Error Transparency)

- 错误信息必须清晰、可操作
- 日志分级（DEBUG/INFO/WARN/ERROR）
- 错误上下文完整，便于排查

## 参考文档

- 详细规划: `.sisyphus/plans/video-clip-extraction-plan.md`
