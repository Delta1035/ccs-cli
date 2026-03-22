# CC Switch CLI

命令行版本的 CC Switch - AI CLI 工具管理器。

基于 [farion1231/cc-switch](https://github.com/farion1231/cc-switch) 项目创建，使用 Node.js + TypeScript 实现。

## 功能特性

- **多 AI 工具支持**: Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw
- **50+ 预设提供商**: AWS Bedrock, NVIDIA NIM, OpenRouter 等
- **一键切换**: 快速切换不同 AI 提供商
- **统一配置管理**: MCP, Prompts, Skills 统一管理
- **使用量跟踪**: 统计 API 调用和成本
- **会话管理**: 浏览和恢复对话历史

## 安装

```bash
# 克隆项目
git clone <repository-url>
cd cc-switch-cli

# 安装依赖
npm install

# 构建项目
npm run build

# 全局安装（可选）
npm install -g .
```

## 使用方法

### 基本命令

```bash
# 显示帮助
cc-switch --help

# 查看版本
cc-switch --version
```

### 提供商管理

```bash
# 列出所有提供商
cc-switch provider list

# 添加提供商
cc-switch provider add

# 切换提供商
cc-switch provider switch

# 删除提供商
cc-switch provider remove

# 查看当前提供商
cc-switch provider current
```

### 预设管理

```bash
# 列出所有预设
cc-switch preset list

# 导入预设
cc-switch preset import
```

### 配置管理

```bash
# 查看配置目录
cc-switch config dir

# 导出配置
cc-switch config export

# 导入配置
cc-switch config import

# 重置配置
cc-switch config reset
```

### 会话管理

```bash
# 列出会话
cc-switch session list

# 查看会话详情
cc-switch session view

# 删除会话
cc-switch session delete

# 清空所有会话
cc-switch session clear
```

### MCP 配置管理

```bash
# 列出 MCP 配置
cc-switch mcp list

# 添加 MCP 配置
cc-switch mcp add

# 删除 MCP 配置
cc-switch mcp remove
```

### 使用统计

```bash
# 查看使用统计
cc-switch usage stats

# 查看总成本
cc-switch usage cost

# 重置使用统计
cc-switch usage reset
```

## 配置文件

配置文件存储在 `~/.cc-switch/` 目录下：

- `data.json` - 主数据文件
- `configs/` - 各 AI 工具的配置文件
- `backups/` - 配置备份

## 技术栈

- **Node.js**: 运行时环境
- **TypeScript**: 类型安全的 JavaScript
- **Commander**: 命令行参数解析
- **Inquirer**: 交互式命令行提示
- **Chalk**: 终端颜色输出
- **Ora**: 加载动画

## 开发

```bash
# 开发模式运行
npm run dev

# 构建项目
npm run build

# 运行构建后的项目
npm start
```

## 与原版 CC Switch 的区别

1. **命令行界面**: 原版是桌面应用，本项目是命令行工具
2. **数据存储**: 使用 JSON 文件而非 SQLite（避免原生模块编译问题）
3. **简化功能**: 聚焦核心功能，移除了部分高级特性
4. **跨平台**: 基于 Node.js，支持所有主流操作系统

## 许可证

ISC
