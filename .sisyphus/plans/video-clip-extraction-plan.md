# AI 授课视频智能剪辑系统 - 工作规划

## 项目概述

构建一个基于 LangChain-TypeScript 的本地应用，实现：

1. 从授课视频中提取音频并转录为带时间戳的文字
2. 根据用户的自然语言描述，智能识别并提取符合要求的知识片段
3. 从原视频中剪辑出多个独立片段，保持原分辨率
4. 可选生成带字幕的视频

---

## MVP战略与发布路线图

### MVP版本定义

#### MVP v0.1 - CLI版本（核心功能验证）

**发布定位**：面向开发者和早期用户的命令行版本，快速验证核心业务逻辑

**包含Phase**：Phase 0-5

**核心功能范围**：

| 功能模块             | 功能点                       | 验收标准                                 |
| -------------------- | ---------------------------- | ---------------------------------------- |
| **视频处理**         | 音频提取、元数据读取         | FFmpeg集成，支持MP4/MOV格式              |
| **语音识别**         | Whisper API转录，时间戳生成  | 准确率>=85%，支持长音频分块              |
| **智能分析**         | LangChain LLM内容匹配        | 自然语言查询->时间片段，置信度阈值可配置 |
| **片段剪辑**         | 视频片段批量提取，保持原编码 | 输出格式一致，命名规范                   |
| **字幕生成**（可选） | SRT/ASS字幕，烧录            | 样式可配置                               |
| **配置管理**         | 环境变量配置，API密钥管理    | .env支持，配置验证                       |

**CLI接口设计**：

```bash
# 核心命令
video-clip-extractor process <video-path> --query "用户自然语言描述"

# 可选参数
--output-dir <path>          # 输出目录
--threshold <0-1>            # 置信度阈值
--no-subtitles               # 禁用字幕生成
--cache-dir <path>           # 缓存目录
--debug                      # 调试模式

# 辅助命令
video-clip-extractor transcribe <video-path>  # 仅转录
video-clip-extractor analyze <video-path> --query "..."  # 仅分析
video-clip-extractor clip <video-path> --segments <json>  # 仅剪辑
video-clip-extractor config set <key> <value>  # 配置管理
video-clip-extractor diagnose  # 系统诊断
```

**技术架构**：

- 纯Node.js运行时，无GUI依赖
- 模块化设计，便于后续扩展为Electron应用
- 单元测试覆盖率 >= 75%
- 集成测试覆盖完整流程

---

#### MVP v1.0 - Electron应用（用户体验完整版）

**发布定位**：面向终端用户的桌面应用，提供可视化界面和完整体验

**包含Phase**：Phase 0-6

**在v0.1基础上新增功能**：

| 功能模块     | 功能点                             | 验收标准                         |
| ------------ | ---------------------------------- | -------------------------------- |
| **GUI界面**  | 视频拖拽导入、流程可视化、实时进度 | 响应式设计，支持暗黑主题         |
| **交互增强** | 转录编辑、片段预览、查询历史       | 手动修正转录结果，一键跳转时间点 |
| **配置界面** | 图形化配置、连接测试               | 配置持久化，实时验证             |
| **状态管理** | 后台处理、系统托盘、通知           | 最小化继续处理，完成提醒         |
| **打包发布** | Windows/macOS安装包、代码签名      | 一键安装，自动更新               |

**用户体验目标**：

- 零依赖启动（内置FFmpeg或引导下载）
- 3分钟内完成首次配置
- 10分钟内完成首次完整流程
- 错误信息友好，一键报告问题

---

### 功能优先级矩阵

| 优先级          | 标识 | 功能模块              | 功能点                                 | 归属MVP | 说明               |
| --------------- | ---- | --------------------- | -------------------------------------- | ------- | ------------------ |
| **Must have**   | P0   | Phase 0: 技术验证POC  | FFmpeg验证、Whisper验证、LangChain验证 | v0.1    | 核心基础能力       |
| **Must have**   | P0   | Phase 1: 基础架构     | 项目初始化、类型定义、工具函数         | v0.1    | 核心基础能力       |
| **Must have**   | P0   | Phase 2: 视频处理     | 音频提取、元数据读取、FFmpeg封装       | v0.1    | 核心业务入口       |
| **Must have**   | P0   | Phase 3: 语音识别     | Whisper转录、时间戳生成、缓存机制      | v0.1    | 核心AI能力         |
| **Must have**   | P0   | Phase 4: 智能分析     | LangChain集成、提示词工程、内容匹配    | v0.1    | 核心价值点         |
| **Must have**   | P0   | Phase 5: 片段剪辑     | 视频剪辑、字幕生成（可选）             | v0.1    | 核心输出能力       |
| **Should have** | P1   | Phase 6: Electron基础 | Electron+Vite框架、主进程/渲染进程架构 | v1.0    | 用户体验基础       |
| **Should have** | P1   | Phase 6: 主窗口UI     | 拖拽上传、流程可视化、实时进度         | v1.0    | 核心交互界面       |
| **Should have** | P1   | Phase 6: IPC集成      | 主进程与渲染进程通信、核心服务调用     | v1.0    | 架桥核心能力       |
| **Should have** | P1   | Phase 6: 打包发布     | 多平台构建、代码签名、自动更新         | v1.0    | 发布能力           |
| **Could have**  | P2   | Phase 7: 性能优化     | 并行处理、缓存策略优化                 | v1.1+   | 体验优化           |
| **Could have**  | P2   | Phase 7: 可观测性     | 错误分类、结构化日志、诊断工具         | v1.1+   | 运维友好           |
| **Could have**  | P2   | 扩展功能              | 说话人识别、内容去重                   | v2.0+   | 高级AI能力         |
| **Won't have**  | P3   | -                     | 云端部署                               | -       | 定位本地应用       |
| **Won't have**  | P3   | -                     | 应用商店发布                           | -       | 资源限制，后续考虑 |

---

### 发布里程碑

#### 里程碑 1: MVP v0.1 内测版（Day 15）

**时间点**：Phase 0-5完成后（Day 1-11）+ 4天集成测试缓冲

**发布范围**：

- 内部Alpha测试，面向开发者和早期反馈用户
- CLI版本完整功能
- 基础单元测试和集成测试通过

**验收标准**：

- [ ] 完整流程测试通过（视频导入→转录→分析→剪辑）
- [ ] 单元测试覆盖率 >= 75%
- [ ] 3种不同时长视频（30秒、10分钟、1小时）测试通过
- [ ] 错误处理和日志系统基本完善
- [ ] 使用文档（README + USAGE）完整

**发布清单**：

- npm包发布（@internal scope）
- GitHub Release（tag: v0.1.0-alpha）
- 内部测试邀请（3-5个种子用户）
- 反馈收集机制（Issue模板）

---

#### 里程碑 2: MVP v0.1 公测版（Day 18）

**时间点**：内测反馈修复后 + 3天优化

**发布范围**：

- 公开Beta测试，面向更广泛用户
- CLI版本 + 轻量使用文档
- 已知问题列表

**验收标准**：

- [ ] 内测关键Bug全部修复
- [ ] 性能基线建立（10分钟视频 < 5分钟）
- [ ] 错误信息友好化
- [ ] 常见问题文档完整

**发布清单**：

- npm包发布（public scope）
- GitHub Release（tag: v0.1.0-beta）
- 宣发内容（社交媒体、技术社区）
- 反馈渠道强化（Discord/微信群）

---

#### 里程碑 3: MVP v1.0 正式版（Day 28）

**时间点**：Phase 6完成后（Day 15-20）+ Phase 7部分优化（Day 21-23）+ 5天缓冲与修复

**发布范围**：

- 面向终端用户的桌面应用
- Windows/macOS双平台安装包
- 完整使用文档和架构文档

**验收标准**：

- [ ] Phase 0-6全部功能完成
- [ ] Electron E2E测试通过
- [ ] 打包流程自动化（GitHub Actions）
- [ ] 代码签名完成
- [ ] 自动更新机制验证
- [ ] 文档完整（README、USAGE、ARCHITECTURE）

**发布清单**：

- GitHub Release（tag: v1.0.0）
- 多平台安装包（Windows NSIS、macOS DMG）
- 官网/着陆页（简单介绍+下载链接）
- 发布公告（Medium/技术博客）
- 用户反馈收集表单

---

#### 里程碑 4: MVP v1.1 稳定版（Day 35）

**时间点**：Phase 7-8全部完成（Day 21-26）+ 用户反馈修复

**发布范围**：

- v1.0用户的自动更新推送
- 性能优化和稳定性改进
- 完整的可观测性支持

**验收标准**：

- [ ] Phase 7-8全部完成
- [ ] 性能测试达标（1小时视频 < 10分钟）
- [ ] 错误处理和日志系统完善
- [ ] 用户反馈Bug修复率 > 80%
- [ ] 测试覆盖率 >= 70%

**发布清单**：

- GitHub Release（tag: v1.1.0）
- 自动更新推送
- 更新日志（CHANGELOG.md）
- 技术案例分享

---

### MVP成功指标

#### MVP v0.1 (CLI) 成功指标

| 指标类别       | 指标项             | 目标值  | 测量方式       |
| -------------- | ------------------ | ------- | -------------- |
| **功能完整性** | 核心流程通过率     | 100%    | 集成测试       |
| **代码质量**   | 单元测试覆盖率     | >= 75%  | Vitest报告     |
| **准确性**     | 转录准确率（中文） | >= 85%  | 人工验证测试集 |
| **准确性**     | 片段提取准确率     | >= 80%  | 人工验证测试集 |
| **性能**       | 10分钟视频处理时间 | < 5分钟 | 性能基准测试   |
| **性能**       | 内存占用峰值       | < 4GB   | 性能基准测试   |
| **用户反馈**   | 内测用户数量       | >= 5人  | 邀请记录       |
| **用户反馈**   | 关键Bug修复率      | 100%    | Issue跟踪      |

#### MVP v1.0 (Electron) 成功指标

| 指标类别       | 指标项            | 目标值   | 测量方式       |
| -------------- | ----------------- | -------- | -------------- |
| **功能完整性** | Phase 0-6全部完成 | 100%     | 验收清单       |
| **质量**       | E2E测试通过率     | 100%     | Playwright报告 |
| **可用性**     | 首次配置时间      | < 3分钟  | 用户体验测试   |
| **可用性**     | 首次完整流程时间  | < 10分钟 | 用户体验测试   |
| **兼容性**     | Windows安装成功率 | >= 95%   | 内部测试       |
| **兼容性**     | macOS安装成功率   | >= 95%   | 内部测试       |
| **稳定性**     | 启动成功率        | 100%     | 内部测试       |
| **用户反馈**   | 公测用户数量      | >= 50人  | 下载统计       |

---

## 需求分析

### 输入规格

- **视频格式**：MP4, MOV（手机拍摄）
- **视频时长**：10 分钟 ~ 数小时
- **语言**：中文为主
- **音频质量**：原声，无需降噪

### 处理流程

1. **音频提取**：从视频中提取音轨
2. **语音识别**：将音频转录为带时间戳的文字
3. **智能分析**：使用 LLM 分析文字内容，匹配用户需求
4. **片段提取**：根据时间戳从原视频中剪辑片段
5. **字幕生成（可选）**：为片段添加字幕

### 输出规格

- **视频格式**：与输入一致（MP4/MOV）
- **分辨率**：保持原分辨率
- **片段数量**：多个独立片段（无过渡）
- **字幕**：可选叠加

### 技术栈

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

---

## 系统架构

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

### 数据流

1. **VideoProcessor** (FFmpeg): 视频 -> 音频
2. **AudioTranscriber** (Whisper): 音频 -> 带时间戳文本 `[{start, end, text}]`
3. **ContentAnalyzer** (LLM): 文本+描述 -> 目标片段 `[{start, end, confidence}]`
4. **ClipExtractor** (FFmpeg): 视频+片段 -> 结果视频

## Phase 0: 技术验证POC (Day 1-3)

### POC 概述

在正式开发前，通过 3 天的技术验证 POC（Proof of Concept），快速验证关键技术栈的可行性，降低正式开发的技术风险。POC 代码为临时代码，不进入正式仓库，专注于技术验证而非代码质量。

---

### POC 目标

| 技术栈              | 验证目标                           | 成功指标                                                                                     |
| ------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| **FFmpeg**          | 验证视频音频提取、元数据获取能力   | ✓ 成功提取 30 秒、10 分钟视频的音频<br>✓ 准确获取时长、分辨率、编码格式                      |
| **Whisper API**     | 验证转录准确率、处理速度、限流策略 | ✓ 转录准确率 ≥ 80%（中文）<br>✓ 10 分钟视频处理时间 < 3 分钟                                 |
| **LangChain + LLM** | 验证内容匹配效果、提示词质量       | ✓ LLM 能基于转录文本正确匹配用户查询<br>✓ 返回格式符合 JSON Schema<br>✓ 匹配置信度可计算     |
| **性能基线**        | 评估处理不同时长视频的性能基线     | ✓ 30秒视频处理时间 < 30秒<br>✓ 10分钟视频处理时间 < 5分钟<br>✓ 1小时视频处理时间有可测量基线 |

---

### Day 1: 环境搭建 + FFmpeg 验证

**目标**：搭建开发环境并验证 FFmpeg 集成可行性

**验收标准**：

- [ ] 环境搭建：
  - [ ] Node.js 18+ 安装
  - [ ] TypeScript 5.x 配置
  - [ ] FFmpeg 安装（系统版本或本地二进制）
  - [ ] OpenAI API Key 配置（.env）
  - [ ] 项目依赖安装（npm install）

- [ ] FFmpeg 验证：
  - [ ] 从测试视频（30秒 MP4）提取音频为 WAV
  - [ ] 获取视频元数据（时长、分辨率、帧率、编码格式）
  - [ ] 验证输出格式正确性（WAV 音频采样率、比特率）
  - [ ] 记录处理时间（建立性能基线）

- [ ] 快速失败机制：
  - [ ] 如果 FFmpeg 不支持某些视频格式，记录为已知限制
  - [ ] 准备备选方案（格式转换预处理）

**输出物**：

- POC 目录：`./poc/day1/`
- 测试脚本：`poc/day1/ffmpeg-test.ts`
- 验证报告：`poc/day1/ffmpeg-validation.md`

---

### Day 2: Whisper API 集成验证

**目标**：验证 Whisper API 的集成可行性、准确率和处理速度

**验收标准**：

- [ ] Whisper API 集成：
  - [ ] 配置 OpenAI API 客户端
  - [ ] 实现音频上传（支持文件路径和 Buffer）
  - [ ] 调用 Whisper API 转录接口
  - [ ] 解析响应为带时间戳的文本数组
  - [ ] 输出格式：`{start: number, end: number, text: string, confidence?: number}[]`

- [ ] 功能验证：
  - [ ] 30秒视频转录成功
  - [ ] 10分钟视频转录成功（< 3分钟）
  - [ ] 人工验证转录准确率 >= 80%（检查5-10个句子）
  - [ ] 验证时间戳精度（误差 < 0.5秒）
  - [ ] 验证 confidence 字段存在

- [ ] 边界测试：
  - [ ] 25MB 限制测试（Whisper API 限制）
  - [ ] 空音频测试
  - [ ] 无效音频格式测试

- [ ] 快速失败机制：
  - [ ] API 超时检测（> 2分钟）并记录
  - [ ] API 限流检测（429状态码）并记录
  - [ ] 准备本地 Whisper 备选方案记录

**输出物**：

- POC 目录：`./poc/day2/`
- 集成脚本：`poc/day2/whisper-test.ts`
- 转录结果：`poc/day2/transcriptions/`（JSON 格式）
- 准确率报告：`poc/day2/accuracy-report.md`

---

### Day 3: LangChain 集成验证 + POC 评估

**目标**：验证 LangChain + LLM 的内容匹配效果，并评估整体 POC 成果

**验收标准**：

- [ ] LangChain 集成：
  - [ ] 配置 LangChain OpenAI 客户端
  - [ ] 设计提示词模板（片段匹配提示词）
  - [ ] 实现内容匹配调用
  - [ ] 解析 LLM 响应为结构化 JSON

- [ ] 功能验证：
  - [ ] 使用转录文本 + 用户查询进行匹配
  - [ ] 验证输出格式符合 JSON Schema（segments 数组、confidence、description）
  - [ ] 人工验证匹配准确率 >= 75%（准备5个测试查询）
  - [ ] 验证 confidence 值合理性（0-1范围）
  - [ ] 验证 reasoning 字段存在

- [ ] 边界测试：
  - [ ] 空查询测试
  - [ ] 超长转录文本测试（token 限制）
  - [ ] 无匹配结果测试
  - [ ] API 超时测试（> 30秒）

- [ ] 快速失败机制：
  - [ ] LLM 响应格式错误检测
  - [ ] 备选 LLM Provider 记录（Claude）
  - [ ] 备选本地模型记录（Ollama）

- [ ] POC 综合评估：
  - [ ] 汇总所有验证结果
  - [ ] 评估技术栈可行性（通过/不通过）
  - [ ] 记录性能基线数据
  - [ ] 列出已知风险和备选方案
  - [ ] 提供是否进入正式开发的 Go/No-Go 决策

**输出物**：

- POC 目录：`./poc/day3/`
- 集成脚本：`poc/day3/langchain-test.ts`
- 匹配结果：`poc/day3/matches/`（JSON 格式）
- POC 评估报告：`poc/day3/poc-evaluation.md`（包含 Go/No-Go 决策）

---

### POC 成功标准

**Go/No-Go 决策矩阵**：

| 技术栈              | POC 成功指标               | 决策阈值 | 决策                                |
| ------------------- | -------------------------- | -------- | ----------------------------------- |
| **FFmpeg**          | 30秒视频音频提取成功       | ✓ 通过   | Go                                  |
|                     | 10分钟视频处理时间 < 2分钟 | ✓ 通过   | Go                                  |
|                     | 元数据准确率 100%          | ✓ 通过   | Go                                  |
| **Whisper API**     | 转录准确率 >= 80%          | ✓ 通过   | Go                                  |
|                     | 10分钟视频处理时间 < 3分钟 | ✓ 通过   | Go                                  |
|                     | 时间戳精度 < 0.5秒         | ✓ 通过   | Go                                  |
| **LangChain + LLM** | 匹配准确率 >= 75%          | ✓ 通过   | Go                                  |
|                     | 响应时间 < 30秒            | ✓ 通过   | Go                                  |
|                     | 输出格式符合 JSON Schema   | ✓ 通过   | Go                                  |
| **综合**            | 所有关键指标通过           | 3/3 通过 | Go                                  |
|                     | 任意关键指标不通过         | < 3 通过 | No-Go（需调整技术栈或增加备选方案） |

**No-Go 后续行动**：

- [ ] 重新评估技术选型
- [ ] 准备备选技术栈
- [ ] 更新项目时间表（考虑技术切换成本）

---

### POC 快速失败机制

**触发条件**：

1. **FFmpeg 兼容性问题**：
   - 如果测试的 3 种视频格式有 2 种不支持
   - **行动**：调研 FFmpeg 编译选项或备选视频处理库

2. **Whisper API 限流/费用超支**：
   - 如果 10分钟视频转录成本 > $0.50（单次）
   - 如果多次调用遭遇 429 限流
   - **行动**：准备本地 Whisper 或 FunASR 迁移计划

3. **LLM 响应不准确或超时**：
   - 如果匹配准确率 < 60%（远低于 75% 目标）
   - 如果响应时间持续 > 60秒
   - **行动**：调整提示词或切换到 Claude API

4. **性能基线不达标**：
   - 如果 10分钟视频处理时间 > 10分钟（远高于 5分钟目标）
   - **行动**：优化处理流程或增加并发

---

## 项目阶段划分

| 阶段                           | 目标                                                 |
| ------------------------------ | ---------------------------------------------------- |
| **Phase 0: 技术验证POC**       | FFmpeg验证、Whisper验证、LangChain验证、Go/No-Go决策 |
| **Phase 1: 基础架构**          | 项目初始化、类型定义、工具函数、单元测试（TDD）      |
| **Phase 2: 视频与音频处理**    | FFmpeg 集成、音频提取、单元测试（TDD）               |
| **Phase 3: 语音识别**          | Whisper 集成、转录功能、单元测试（TDD）              |
| **Phase 4: LLM 智能分析**      | LangChain 集成、内容匹配、单元测试（TDD）            |
| **Phase 5: 片段剪辑**          | 视频剪辑、字幕生成、单元测试（TDD）                  |
| **Phase 6: Electron 桌面应用** | Electron 框架、UI 界面、E2E 测试（TDD）              |
| **Phase 7: 集成测试与优化**    | 集成测试、E2E 测试、性能优化、可观测性               |
| **Phase 8: 文档与发布**        | 使用文档、架构文档、打包发布                         |
| **总工期（乐观）**             | 26天（包含10%缓冲时间）                              |
| **总工期（悲观）**             | 35天（包含更多缓冲时间）                             |

---

## 详细开发任务

> **说明**：基于 MVP 战略，Phase 0-5 属于 MVP v0.1 (CLI版本)，Phase 6 属于 MVP v1.0 (Electron应用)，Phase 7-8 属于优化与发布。

### Phase 1: 基础架构 (Day 4-5)

#### 任务 1.1: 项目初始化

**描述**：创建 TypeScript 项目结构
**验收标准**：

- [ ] 项目目录结构完整
- [ ] `package.json` 配置正确
- [ ] `tsconfig.json` 配置 TypeScript 5.x
- [ ] `.gitignore` 包含 node_modules, dist, temp
- [ ] `.env.example` 包含 API 密钥模板

---

#### 任务 1.2: 类型定义

**描述**：定义核心数据类型和接口
**验收标准**：

- [ ] `VideoFile` 类型：路径、格式、时长、分辨率
- [ ] `TranscriptionSegment` 类型：start, end, text, confidence
- [ ] `Clip` 类型：start, end, confidence, description
- [ ] `ExtractionResult` 类型：clips, metadata
- [ ] `Config` 类型：API 密钥、模型配置、输出路径

---

#### 任务 1.3: 工具函数

**描述**：创建通用工具函数
**验收标准**：

- [ ] `FileUtils`：确保目录、路径解析、文件验证
- [ ] `TimeUtils`：秒→时间码、时间码→秒、时长格式化
- [ ] `Logger`：分级日志、彩色输出
- [ ] `Validator`：输入验证、配置验证

---

#### 任务 1.4: 工具函数单元测试（TDD）

**描述**：为工具函数编写单元测试，遵循测试驱动开发原则
**验收标准**：

- [ ] 测试框架：Vitest 配置完成
- [ ] `TimeUtils.test.ts`：
  - 秒转时间码（如 125.5 → "02:05.500"）
  - 时间码转秒（如 "02:05.500" → 125.5）
  - 边界值：0秒、超过1小时
- [ ] `FileUtils.test.ts`：
  - 目录创建（递归）
  - 路径解析（跨平台兼容）
  - 文件存在性验证
- [ ] `Validator.test.ts`：
  - 配置对象结构验证
  - 输入参数合法性检查
- [ ] 所有测试用例在实现前编写（Red → Green → Refactor）
- [ ] 测试覆盖率目标：> 90%（工具函数模块）

---

### Phase 2: 视频与音频处理 (Day 6)

#### 任务 2.1: FFmpeg 封装

**描述**：封装 FFmpeg 命令调用
**验收标准**：

- [ ] `FFmpegVideoProcessor` 类创建
- [ ] `extractAudio(videoPath, outputPath)` 方法：提取音频为 WAV
- [ ] `getVideoInfo(videoPath)` 方法：获取时长、分辨率、帧率
- [ ] `clipVideo(videoPath, start, end, outputPath)` 方法：截取片段
- [ ] 错误处理：FFmpeg 失败时抛出友好错误

---

#### 任务 2.2: 视频信息获取

**描述**：实现视频元数据读取
**验收标准**：

- [ ] `VideoMetadata` 接口定义
- [ ] 提取：时长、分辨率、帧率、编码格式
- [ ] 验证：文件存在且格式支持
- [ ] 缓存：避免重复读取

---

#### 任务 2.3: 视频处理器单元测试（TDD）

**描述**：为视频处理模块编写单元测试，使用 Mock 隔离 FFmpeg 依赖
**验收标准**：

- [ ] `FFmpegVideoProcessor.test.ts`：
  - `extractAudio`：
    - 正常提取：验证输出路径、格式为 WAV
    - 无效输入路径：抛出 FileNotFoundError
    - FFmpeg 失败：抛出 FFmpegExecutionError
  - `getVideoInfo`：
    - 正常解析：验证返回对象包含 duration、width、height、fps
    - 损坏文件：抛出 InvalidVideoError
    - 缓存机制：相同路径第二次调用不执行 FFmpeg
  - `clipVideo`：
    - 正常剪辑：验证时间戳精确度、输出文件存在
    - 边界值：start=0、end=duration
    - 无效时间范围：抛出 ValidationError（end <= start）
- [ ] Mock 实现：
  - 使用 `vitest mock` 拦截 FFmpeg 命令执行
  - 提供预设的视频元数据响应模板
- [ ] 测试覆盖率目标：> 85%

---

### Phase 3: 语音识别 (Day 7-9)

#### 任务 3.1: 语音识别引擎选择

**描述**：调研并选择合适的语音识别方案
**可选方案**：

1. **OpenAI Whisper API**：高准确率，需要联网，按量付费
2. **FunASR (阿里)**：中文优化好，开源免费
3. **百度/讯飞/腾讯 API**：中文场景成熟，需申请

**决策建议**：

- **开发阶段**：使用 OpenAI Whisper API（快速验证）
- **生产部署**：迁移到本地 Whisper 或 FunASR（降低成本）

**验收标准**：

- [ ] 对比表格：准确率、速度、成本、隐私
- [ ] 推荐方案文档
- [ ] 集成接口设计（支持后续切换）

---

#### 任务 3.2: 语音识别封装

**描述**：封装语音识别服务
**验收标准**：

- [ ] `AudioTranscriber` 接口定义
- [ ] `WhisperTranscriber` 实现（API 版）
- [ ] `transcribe(audioPath)` 方法：返回带时间戳的文本数组
- [ ] 输出格式：`{start: number, end: number, text: string, confidence?: number}[]`
- [ ] 支持长音频分块处理（Whisper API 有 25MB 限制）
- [ ] 进度回调
- [ ] 错误处理：网络、超时、格式不支持

---

#### 任务 3.3: 转录结果存储

**描述**：实现转录结果的缓存与加载
**验收标准**：

- [ ] `TranscriptionCache` 类
- [ ] `save(videoPath, transcription)`：保存为 JSON
- [ ] `load(videoPath)`：读取缓存
- [ ] `isValid(videoPath)`：检查缓存是否过期（视频修改时间）
- [ ] 缓存路径：`./cache/transcriptions/{videoHash}.json`

---

#### 任务 3.4: 转录服务单元测试（TDD）

**描述**：为语音识别模块编写单元测试，Mock API 调用和文件系统
**验收标准**：

- [ ] `WhisperTranscriber.test.ts`：
  - `transcribe` 方法：
    - 正常转录：返回带时间戳的 segment 数组
    - 长音频自动分块：验证 25MB 分块逻辑
    - 进度回调：验证 progress 事件按 chunk 触发
    - 无效音频格式：抛出 UnsupportedFormatError
    - API 超时：触发重试机制（最多3次）
    - API 限流：优雅降级并提示用户
- [ ] `TranscriptionCache.test.ts`：
  - `save` 和 `load`：验证 JSON 序列化正确性
  - `isValid`：
    - 视频未修改：缓存有效
    - 视频已修改（mtime 不同）：缓存过期
    - 缓存文件不存在：返回 false
- [ ] `AudioTranscriber.interface.test.ts`：
  - 验证所有实现类符合接口契约
  - 测试工厂模式创建不同 provider 的实例
- [ ] Mock 实现：
  - 使用 `msw` 或 `vitest mock` 拦截 Whisper API 调用
  - 提供模拟的转录响应数据
  - Mock `fs` 模块的读写操作
- [ ] 测试覆盖率目标：> 80%

---

### Phase 4: LLM 智能分析 (Day 10-12)

#### 任务 4.1: LangChain 初始化

**描述**：配置 LangChain 和 LLM 客户端
**验收标准**：

- [ ] `LangChainClient` 类封装
- [ ] 支持多个 LLM Provider（OpenAI, Claude, 其他）
- [ ] 环境变量配置：API_KEY, MODEL, BASE_URL(可选)
- [ ] 重试机制：指数退避
- [ ] 错误处理：配额超限、网络超时、模型不可用

---

#### 任务 4.2: 提示词工程

**描述**：设计高效的提示词模板
**验收标准**：

- [ ] `PromptTemplates` 模块
- [ ] **片段匹配提示词**：
  - 输入：用户描述 + 转录文本（分块）
  - 输出：匹配的时间段数组
  - 要求：返回 JSON 格式，包含 confidence
- [ ] **内容理解提示词**：
  - 输入：转录文本
  - 输出：内容摘要、关键知识点、时间线
- [ ] 提示词版本管理
- [ ] A/B 测试框架（可选）

**示例输出格式**：

```json
{
  "segments": [
    {
      "start": 120.5,
      "end": 180.3,
      "confidence": 0.92,
      "description": "讲解 React Hooks 的基本概念"
    }
  ],
  "reasoning": "用户要求找到 React Hooks 的讲解，在 120-180 秒段落中讲师详细解释了 useState 和 useEffect 的用法。"
}
```

---

#### 任务 4.3: 内容匹配引擎

**描述**：实现智能内容匹配逻辑
**验收标准**：

- [ ] `ContentMatcher` 类
- [ ] **分块策略**：
  - 长视频分块处理（考虑 LLM token 限制）
  - 重叠窗口避免边界遗漏
  - 上下文保留
- [ ] **匹配算法**：
  - 调用 LLM 分析每个块
  - 聚合结果，去重
  - 合并相邻片段
- [ ] **置信度阈值**：
  - 可配置 threshold
  - 低于 threshold 的结果过滤
- [ ] 进度回调
- [ ] 错误处理：API 失败回退策略

---

#### 任务 4.4: 结果优化

**描述**：优化匹配结果，确保片段完整性
**验收标准**：

- [ ] `ResultOptimizer` 类
- [ ] **边界优化**：
  - 扩展片段边界到句子边界
  - 确保不截断知识点
- [ ] **去重合并**：
  - 合并高度重叠的片段
  - 保留最高置信度描述
- [ ] **排序输出**：
  - 按时间顺序排列
  - 或按置信度排序（可选）

---

#### 任务 4.5: 内容匹配引擎单元测试（TDD）

**描述**：为LLM智能分析模块编写单元测试，Mock LLM调用并验证提示词效果
**验收标准**：

- [ ] `LangChainClient.test.ts`：
  - 初始化：
    - 不同 provider（OpenAI/Claude）的配置验证
    - 环境变量缺失时抛出 ConfigurationError
    - 无效 API Key 时的认证错误处理
  - 重试机制：
    - 网络超时自动重试（指数退避）
    - 最大重试次数达到后抛出 MaxRetryExceededError
  - 错误处理：
    - 配额超限：友好的错误提示
    - 模型不可用：建议备选模型
- [ ] `PromptTemplates.test.ts`：
  - 片段匹配提示词：
    - 验证模板渲染包含用户描述和转录文本
    - 验证输出格式说明清晰（JSON Schema）
    - 测试边界情况：超长文本分块处理
  - 内容理解提示词：
    - 验证返回格式包含摘要、知识点、时间线
    - 测试不同长度输入的处理
  - 提示词版本管理：
    - 验证版本号正确嵌入
    - A/B 测试框架支持
- [ ] `ContentMatcher.test.ts`：
  - 分块策略：
    - 长视频正确分块（考虑 token 限制）
    - 重叠窗口避免边界遗漏
    - 上下文保留验证
  - 匹配算法：
    - Mock LLM 返回模拟匹配结果
    - 验证聚合逻辑正确去重
    - 相邻片段合并算法
  - 置信度阈值：
    - 低于 threshold 的片段被过滤
    - 可配置的 threshold 生效
    - 边界值测试（threshold = 0, 1）
  - 进度回调：
    - 验证按 chunk 触发进度更新
    - 进度值范围 0-100
  - 错误处理：
    - API 失败时的回退策略
    - 部分成功情况处理
- [ ] `ResultOptimizer.test.ts`：
  - 边界优化：
    - 验证扩展到句子边界
    - 知识点完整性检查
  - 去重合并：
    - 高度重叠片段正确合并
    - 保留最高置信度描述
  - 排序输出：
    - 时间顺序验证
    - 置信度排序验证
- [ ] Mock 实现：
  - 使用 `msw` Mock LLM API 请求和响应
  - 提供预设的匹配结果数据
  - 模拟 token 限制和分块场景
- [ ] 测试覆盖率目标：> 85%

---

### Phase 5: 片段剪辑 (Day 13-14)

#### 任务 5.1: 视频剪辑实现

**描述**：实现视频片段提取
**验收标准**：

- [ ] `ClipExtractor` 类
- [ ] `extractClips(videoPath, segments, outputDir)` 方法
- [ ] 支持批量剪辑
- [ ] 保持原视频编码（直接复制，不重新编码以提高速度）
- [ ] 输出命名：`{videoName}_clip_{index}_{start}_{end}.{ext}`
- [ ] 进度回调
- [ ] 错误处理：磁盘空间不足、权限问题

---

#### 任务 5.2: 字幕生成（可选功能）

**描述**：为片段添加字幕
**验收标准**：

- [ ] `SubtitleGenerator` 类
- [ ] `generateSubtitles(clipPath, transcription, outputPath)` 方法
- [ ] 字幕格式：SRT 或 ASS
- [ ] 字幕样式：字体、大小、颜色、位置（可配置）
- [ ] 字幕烧录：使用 FFmpeg 将字幕嵌入视频
- [ ] 支持批量处理

---

#### 任务 5.3: 结果输出

**描述**：整理输出文件和元数据
**验收标准**：

- [ ] 输出目录结构：`./output/{videoName}_{timestamp}/`
- [ ] 片段文件：`clips/` 目录
- [ ] 元数据：`metadata.json`
  ```json
  {
    "sourceVideo": "...",
    "userQuery": "...",
    "processingTime": 123.45,
    "segments": [...],
    "clips": [...]
  }
  ```
- [ ] 转录缓存：`transcription.json`（可选）
- [ ] 日志文件：`processing.log`

---

#### 任务 5.4: 片段剪辑单元测试（TDD）

**描述**：为视频剪辑模块编写单元测试，Mock FFmpeg 调用并验证剪辑逻辑
**验收标准**：

- [ ] `ClipExtractor.test.ts`：
  - `extractClips` 方法：
    - 正常批量剪辑：验证调用 FFmpeg 次数、输出路径格式
    - 保持原编码：验证使用 stream copy 模式（-c copy）
    - 输出命名：`{videoName}_clip_{index}_{start}_{end}.{ext}`
    - 进度回调：验证按片段触发 progress 更新
    - 空片段列表：抛出 ValidationError
    - 无效时间范围：抛出 ValidationError
  - 错误处理：
    - 磁盘空间不足：友好的错误提示
    - 权限问题：建议检查输出目录权限
    - FFmpeg 失败：保留日志便于调试
- [ ] `SubtitleGenerator.test.ts`（可选功能）：
  - `generateSubtitles` 方法：
    - SRT 格式生成：验证时间戳格式、字幕序号
    - ASS 格式生成：验证样式定义
    - 字幕烧录：验证 FFmpeg 滤镜链参数
  - 边界情况：
    - 空转录结果：生成空字幕文件
    - 超长文本：自动换行处理
- [ ] `ResultOutput.test.ts`：
  - 目录结构：
    - 验证创建 `./output/{videoName}_{timestamp}/`
    - 验证 `clips/` 子目录存在
  - 元数据文件：
    - `metadata.json`：验证 JSON 结构完整性
    - 必需字段：sourceVideo、userQuery、processingTime、segments、clips
    - 数据类型正确性
  - 缓存文件：
    - `transcription.json`：验证缓存格式
  - 日志文件：
    - `processing.log`：验证日志级别、时间戳格式
- [ ] Mock 实现：
  - 使用 `vitest mock` 拦截 FFmpeg 命令执行
  - 提供模拟的视频文件系统状态
  - Mock `fs` 模块的读写操作
  - 模拟磁盘空间不足等边界条件
- [ ] 测试覆盖率目标：> 85%

---

### Phase 6: Electron 桌面应用 (Day 15-20)

#### 任务 6.1: Electron 基础架构

**描述**：搭建 Electron 桌面应用基础框架
**验收标准**：

- [ ] Electron + Vite 集成配置
- [ ] 主进程 (Main Process) 架构：
  - 窗口管理
  - IPC 通信桥接
  - 核心服务调用
- [ ] 渲染进程 (Renderer Process)：
  - React 18+ 框架
  - UI 组件库集成 (shadcn-ui)
  - 状态管理 (Zustand)
- [ ] 开发环境：
  - HMR 热更新
  - 调试工具集成
  - 多平台构建脚本
- [ ] 应用配置：
  - 应用图标、名称
  - 窗口默认尺寸 (1200x800)
  - 最小窗口限制

---

#### 任务 6.2: 主窗口 UI 设计

**描述**：设计并实现主应用界面
**验收标准**：

- [ ] 布局结构：
  - 顶部：标题栏 + 全局操作按钮
  - 左侧：导航菜单（视频管理、设置、关于）
  - 主内容区：动态内容展示
  - 底部：状态栏（处理进度、系统状态）
- [ ] 视频导入区域：
  - 拖拽上传支持
  - 文件选择对话框
  - 视频列表展示（缩略图、文件名、时长、状态）
- [ ] 查询输入区域：
  - 多行文本输入框
  - 查询历史下拉
  - 示例查询快捷按钮
- [ ] 参数配置面板：
  - 可折叠的高级选项
  - 置信度阈值滑块
  - 字幕生成开关
  - 输出格式选择
- [ ] 响应式设计：
  - 适配不同窗口尺寸
  - 断点布局调整

---

#### 任务 6.3: 视频处理工作流界面

**描述**：实现视频处理流程的交互界面
**验收标准**：

- [ ] 处理流程可视化：
  - 步骤指示器（5 步流程）
  - 当前步骤高亮
  - 已完成步骤标记
  - 可跳转到特定步骤（需确认）
- [ ] 转录步骤界面：
  - 实时转录进度条
  - 转录文字预览（滚动展示）
  - 时间戳标记
  - 编辑按钮（支持手动修正）
- [ ] 分析步骤界面：
  - LLM 分析进度展示
  - 匹配的片段预览列表
  - 每个片段的置信度显示
  - 片段预览缩略图（时间戳处）
  - 排除/包含切换开关
- [ ] 剪辑步骤界面：
  - 批量剪辑进度展示
  - 片段列表（可重命名）
  - 片段时长统计
  - 预览播放按钮
- [ ] 结果展示界面：
  - 输出文件夹打开按钮
  - 片段列表（带播放按钮）
  - 处理统计信息
  - 重新开始/关闭应用选项
- [ ] 全局进度管理：
  - 可暂停/恢复处理
  - 错误时显示重试/跳过选项
  - 后台处理支持（最小化到托盘）

---

#### 任务 6.4: 设置与配置界面

**描述**：实现应用设置页面
**验收标准**：

- [ ] LLM 配置面板：
  - Provider 选择（下拉框）
  - API Key 输入（密码显示/隐藏切换）
  - 模型选择（动态加载可用模型）
  - Base URL 配置（可选，用于自定义端点）
  - 连接测试按钮
- [ ] 音频配置面板：
  - 默认语言选择
  - 语音识别引擎选择（Whisper API / 本地 Whisper）
  - 本地模型路径配置（如适用）
- [ ] 输出配置面板：
  - 默认输出目录选择
  - 片段命名格式模板
  - 默认置信度阈值
  - 字幕生成默认开关
- [ ] 高级设置：
  - 并发处理数量限制
  - 临时文件清理策略
  - 日志级别选择
  - 网络代理配置
- [ ] 数据管理：
  - 缓存清理按钮
  - 配置导入/导出
  - 恢复默认设置
- [ ] 界面设置：
  - 主题切换（明亮/暗黑）
  - 语言选择（中文/英文）
  - 字体大小调整

---

#### 任务 6.5: IPC 通信与核心服务集成

**描述**：实现主进程与渲染进程的通信，集成核心业务
**验收标准**：

- [ ] IPC 通道定义：
  - `video:import` - 导入视频
  - `video:getInfo` - 获取视频信息
  - `processing:start` - 开始处理
  - `processing:pause` - 暂停处理
  - `processing:resume` - 恢复处理
  - `processing:cancel` - 取消处理
  - `processing:progress` - 进度更新（事件）
  - `transcription:edit` - 编辑转录
  - `clips:update` - 更新片段列表
  - `config:get` - 获取配置
  - `config:set` - 设置配置
  - `dialog:openFile` - 打开文件对话框
  - `dialog:openDirectory` - 打开目录对话框
  - `shell:openPath` - 打开文件管理器
  - `shell:openExternal` - 打开外部链接
- [ ] 核心业务集成：
  - 复用 src/core/ 下的业务逻辑
  - 主进程中初始化 VideoProcessor、AudioTranscriber 等
  - 处理过程状态管理
- [ ] 进度事件系统：
  - 实时进度推送到渲染进程
  - 支持批量操作的聚合进度
  - 可取消/暂停的处理任务
- [ ] 错误处理：
  - 业务错误转换为用户友好的消息
  - 错误详情记录到日志
  - 提供重试/跳过/取消选项
- [ ] 后台处理：
  - 支持最小化到系统托盘继续处理
  - 处理完成时系统通知
  - 开机自启动选项（可选）

---

#### 任务 6.6: 打包与自动更新

**描述**：实现应用打包和自动更新机制
**验收标准**：

- [ ] 多平台构建配置：
  - electron-builder 配置
  - Windows: NSIS 安装程序 + 便携版
  - macOS: DMG + ZIP
- [ ] 应用签名：
  - Windows 代码签名证书
  - macOS 开发者证书
  - 自动签名流程
- [ ] 自动更新：
  - electron-updater 集成
  - 更新检查策略（启动时/定期检查）
  - 增量更新支持
  - 强制更新机制（关键修复）
  - 更新日志展示
- [ ] 安装程序优化：
  - 一键安装体验
  - 自定义安装路径
  - 开始菜单/桌面快捷方式选项
  - 文件关联（.mp4, .mov）可选
- [ ] 应用商店：
  - Microsoft Store 准备
  - Mac App Store 准备（沙盒限制评估）
- [ ] 发布流程：
  - GitHub Actions 自动构建
  - 版本号自动递增
  - Release Notes 自动生成
  - 多平台同步发布

---

### Phase 7: 集成测试与优化 (Day 21-23)

> **说明**：根据 TDD 原则，单元测试已在各开发阶段（Phase 1-5）完成。本阶段专注于更高层次的测试和系统优化。

#### 任务 7.1: 集成测试

**描述**：编写端到端集成测试，验证完整流程和各模块协作
**验收标准**：

- [ ] 测试框架：Vitest + 自定义测试工具
- [ ] 完整流程测试（Happy Path）：
  - 输入：准备测试视频（3种时长：30秒、10分钟、1小时）+ 标准查询
  - 流程：视频导入 → 音频提取 → 转录 → 分析 → 剪辑 → 输出
  - 验证：
    - 输出片段存在且可播放
    - 片段时长符合预期（与查询匹配）
    - metadata.json 完整准确
    - 处理日志无 ERROR 级别记录
- [ ] 模块协作测试：
  - VideoProcessor → AudioTranscriber：验证音频格式兼容性
  - AudioTranscriber → ContentMatcher：验证转录结果格式正确传递
  - ContentMatcher → ClipExtractor：验证时间戳精度无损传递
  - 缓存机制：验证各层缓存命中和失效逻辑
- [ ] 外部服务降级测试：
  - Whisper API 超时：验证自动重试和备用方案切换
  - LLM API 限流：验证优雅降级和用户提示
  - 网络中断：验证断点续传或安全退出
- [ ] 数据流验证：
  - 大文件处理：验证内存使用稳定，无泄漏
  - 并发请求：验证状态隔离，无数据竞争
- [ ] Mock 策略：
  - 使用真实 FFmpeg 调用（验证实际功能）
  - Mock 外部 API（Whisper/LLM）以控制响应和测试边界情况
  - 使用临时文件系统隔离测试数据
- [ ] 测试数据管理：
  - `tests/fixtures/videos/`：不同格式和时长的测试视频
  - `tests/fixtures/expected/`：预期输出（转录文本、片段信息等）
  - `tests/fixtures/mocks/`：API Mock 响应模板
- [ ] 测试执行策略：
  - 快速测试（< 1分钟）：使用 30 秒短视频，用于 CI
  - 完整测试（~ 10分钟）：使用 10 分钟视频，用于发布前验证
  - 压力测试（> 1小时）：使用 1 小时视频，用于性能基线

---

#### 任务 7.2: 端到端（E2E）测试

**描述**：编写端到端集成测试
**验收标准**：

- [ ] 完整流程测试：
  - 输入：测试视频 + 查询
  - 验证：输出片段存在且符合要求
- [ ] 边界情况：
  - 空查询
  - 无匹配结果
  - 超长视频
  - 低质量音频
- [ ] 性能测试：
  - 1 小时视频处理时间 < 10 分钟
  - 内存占用 < 4GB
- [ ] 测试视频准备：
  - 短片段（< 1 分钟）
  - 中等长度（10-30 分钟）
  - 长视频（1-2 小时）

---

#### 任务 7.3: 性能优化与基准测试

**描述**：优化处理速度和资源占用，建立性能基线
**验收标准**：

- [ ] 并行处理优化：
  - 多个视频并发处理（验证资源竞争处理）
  - 转录和剪辑流水线并行（数据流优化）
  - 线程池管理（避免过度并发）
- [ ] 缓存策略优化：
  - 转录结果持久化策略（失效策略、存储优化）
  - LLM 响应缓存（相同查询识别、命中率优化）
  - 视频元数据缓存（避免重复读取）
- [ ] 内存管理优化：
  - 大视频分块读取策略（chunk 大小优化）
  - 临时文件及时释放（生命周期管理）
  - 大对象垃圾回收优化
- [ ] 进度与用户体验优化：
  - 更细粒度的进度更新（平滑动画）
  - 预计剩余时间算法（基于历史数据）
  - 后台处理性能（最小化到托盘时的资源控制）
- [ ] 基准测试套件：
  - 建立性能基线（不同视频时长、硬件配置）
  - 优化前后对比（速度、内存、CPU 占用）
  - 回归测试：关键性能指标不可下降超过 5%
  - 测试数据：标准化测试视频集（30秒、10分钟、1小时）

---

#### 任务 7.4: 错误处理、日志系统与可观测性

**描述**：完善错误处理、日志系统和应用可观测性
**验收标准**：

- [ ] 错误分类体系：
  - **用户错误**（参数错误、文件不存在、格式不支持）
    - 错误码：USER_001 ~ USER_099
    - 友好提示 + 操作建议
  - **系统错误**（FFmpeg 失败、API 超时、资源不足）
    - 错误码：SYS_001 ~ SYS_099
    - 自动重试策略 + 降级方案
  - **外部错误**（LLM 服务不可用、网络中断、API 限流）
    - 错误码：EXT_001 ~ EXT_099
    - 指数退避重试 + 队列机制
- [ ] 错误处理机制：
  - 统一错误包装器（Error Wrapper）
  - 错误上报（可选：Sentry 集成）
  - 用户友好的错误页面/对话框
  - 一键复制错误信息（便于报告问题）
- [ ] 结构化日志系统：
  - 日志级别：DEBUG, INFO, WARN, ERROR, FATAL
  - 日志格式：JSON 结构化（便于解析和查询）
  - 日志文件轮转：
    - 路径：`.logs/YYYY-MM-DD.log`
    - 保留最近 30 天
    - 单文件大小限制 100MB
  - 控制台输出：开发环境彩色输出，生产环境简洁输出
  - 可配置的日志级别（运行时动态调整）
- [ ] 可观测性增强：
  - **指标收集（Metrics）**：
    - 处理视频数量、平均处理时长
    - API 调用次数、成功率、延迟分布
    - 内存/CPU 使用率
  - **链路追踪（Tracing）**：
    - 端到端处理流程追踪
    - 各阶段耗时分析
    - 性能瓶颈定位
  - **健康检查（Health Check）**：
    - FFmpeg 可用性
    - API 服务连通性
    - 磁盘空间检查
- [ ] 调试与诊断工具：
  - `--debug` 命令行标志：
    - 详细日志输出（DEBUG 级别）
    - 保留临时文件（不自动清理）
    - 显示性能计时信息
  - 诊断命令：
    - `diagnose:ffmpeg`：检查 FFmpeg 安装和版本
    - `diagnose:api`：测试 API 连通性和认证
    - `diagnose:system`：检查系统资源和限制
  - 日志导出功能：一键打包日志文件（便于问题报告）

---

### Phase 8: 文档与发布 (Day 24-26)

#### 任务 8.1: 使用文档

**描述**：编写用户文档
**验收标准**：

- [ ] README.md：
  - 项目简介
  - 功能特性
  - 安装步骤
  - 快速开始
  - 示例
- [ ] USAGE.md：
  - 详细使用说明
  - 命令参考
  - 配置说明
  - 常见问题
- [ ] EXAMPLES.md：
  - 典型使用场景
  - 实际示例
  - 最佳实践

---

#### 任务 8.2: 架构文档

**描述**：编写开发文档
**验收标准**：

- [ ] ARCHITECTURE.md：
  - 系统架构图
  - 模块说明
  - 数据流
  - 技术选型理由
- [ ] API.md：
  - 内部 API 文档
  - 接口说明
  - 类型定义
- [ ] CONTRIBUTING.md：
  - 开发指南
  - 代码规范
  - 提交规范
  - 测试要求

---

#### 任务 8.3: 打包与发布

**描述**：准备项目发布
**验收标准**：

- [ ] package.json 完善：
  - bin 入口
  - engines 要求
  - keywords, author, license
- [ ] 构建脚本：
  - build 命令
  - dist 目录
- [ ] 可执行文件：
  - pkg/nexe 打包（可选）
  - 或 npm link 全局安装
- [ ] 发布检查清单：
  - 版本号更新
  - CHANGELOG.md
  - Git Tag
  - npm publish（可选）

---

## TDD 工作流程（每个任务）

```
任务 X.Y: 功能开发
├── 1. 编写测试（Red）
│   └── 先写单元测试，定义接口和预期行为
├── 2. 实现功能（Green）
│   └── 写最少代码让测试通过
├── 3. 重构优化（Refactor）
│   └── 改进代码质量，保持测试通过
└── 4. 验证
    └── 运行测试，确保覆盖率达标
```

## 扩展性考虑

### 近期扩展（MVP 后 1-2 个月）

- [ ] 批量视频处理（队列系统）
- [ ] 转录结果编辑界面
- [ ] 片段预览功能
- [ ] 更多视频格式支持

### 中期扩展（3-6 个月）

- [ ] 说话人识别（diarization）
- [ ] 内容去重（去除重复知识点）
- [ ] 片段智能合并（关联知识点连续剪辑）
- [ ] 多语言支持
- [ ] 云端部署版本（Web 服务）

## 验收标准

### 功能验收

- [ ] 可以成功处理 MP4 和 MOV 格式的视频
- [ ] 转录结果准确率 >= 85%（中文）
- [ ] 根据自然语言描述正确提取相关片段（>= 80% 准确率）
- [ ] 片段完整，不截断知识点
- [ ] 输出视频保持原分辨率和格式
- [ ] 可选字幕生成功能正常工作

### 性能验收

- [ ] 10 分钟视频处理时间 < 5 分钟（在推荐配置下）
- [ ] 内存占用 < 4GB
- [ ] 支持 2 小时长视频处理
- [ ] API 调用支持流式处理，避免超时

### 质量验收

- [ ] 代码覆盖率 >= 70%
- [ ] 无高危安全漏洞
- [ ] 文档完整（README, API, 使用指南）
- [ ] 可安装运行（npm install && npm start）

---

## 附录

### A. 推荐技术资源

#### 学习资源

- **LangChain 官方文档**: https://js.langchain.com/
- **FFmpeg 文档**: https://ffmpeg.org/documentation.html
- **Electron 文档**: https://www.electronjs.org/docs

#### 参考项目

- **LangChain 示例**: https://github.com/langchain-ai/langchainjs/tree/main/examples
- **Electron Vite 模板**: https://github.com/electron-vite/electron-vite-react

**文档生成时间**: 2026-02-03
**文档版本**: 1.0.0-draft
**作者**: AI Assistant
