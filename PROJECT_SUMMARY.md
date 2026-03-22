# CC Switch CLI 项目总结

## 项目概述

基于 [farion1231/cc-switch](https://github.com/farion1231/cc-switch) 项目创建的命令行版本 AI CLI 工具管理器。

## 实现的功能

### ✅ 核心功能
1. **提供商管理**
   - 添加、删除、列出提供商
   - 切换提供商
   - 查看当前启用的提供商

2. **预设管理**
   - 7 个常用预设（Claude, Codex, Gemini）
   - 一键导入预设
   - 支持自定义 API Key

3. **配置管理**
   - 查看配置目录
   - 导出/导入配置
   - 重置配置

4. **会话管理**
   - 列出会话
   - 查看会话详情
   - 删除会话
   - 清空所有会话

5. **MCP 配置管理**
   - 添加 MCP 配置
   - 列出 MCP 配置
   - 删除 MCP 配置

6. **使用统计**
   - 查看使用统计
   - 查看总成本
   - 重置使用统计

### ✅ 技术实现
- **数据存储**: JSON 文件存储（避免 SQLite 原生模块编译问题）
- **命令行框架**: Commander.js
- **交互提示**: Inquirer.js
- **终端输出**: Chalk + Ora
- **类型安全**: TypeScript

## 项目结构

```
cc-switch-cli/
├── src/
│   ├── commands/          # 命令实现
│   │   ├── providerCommands.ts
│   │   ├── presetCommands.ts
│   │   ├── configCommands.ts
│   │   ├── sessionCommands.ts
│   │   ├── mcpCommands.ts
│   │   └── usageCommands.ts
│   ├── core/              # 核心业务逻辑
│   │   └── providerService.ts
│   ├── database/          # 数据存储
│   │   └── db.ts
│   ├── types/             # 类型定义
│   │   └── index.ts
│   └── index.ts           # 主入口
├── examples/              # 使用示例
├── dist/                  # 构建输出
├── package.json
├── tsconfig.json
└── README.md
```

## 使用示例

```bash
# 查看帮助
cc-switch --help

# 列出预设
cc-switch preset list

# 导入预设
cc-switch preset import

# 列出提供商
cc-switch provider list

# 切换提供商
cc-switch provider switch

# 查看当前提供商
cc-switch provider current
```

## 配置文件位置

- 数据文件: `~/.cc-switch/data.json`
- 配置文件: `~/.cc-switch/configs/`
- 备份文件: `~/.cc-switch/backups/`

## 与原版区别

| 特性 | 原版 CC Switch | CC Switch CLI |
|------|----------------|---------------|
| 界面 | 桌面应用 (Tauri) | 命令行工具 |
| 数据存储 | SQLite | JSON 文件 |
| 平台支持 | Windows, macOS, Linux | 所有 Node.js 平台 |
| 复杂度 | 高 | 低 |
| 依赖 | Rust, Tauri | Node.js |

## 开发状态

✅ **已完成**
- 项目框架搭建
- 提供商管理功能
- 预设管理功能
- 配置管理功能
- 会话管理功能
- MCP 配置功能
- 使用统计功能

🔄 **待完善**
- 代理和故障转移功能
- 云同步功能
- 更多预设提供商
- 单元测试
- 文档完善

## 安装和运行

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试
node test-demo.js

# 使用命令行工具
node dist/index.js provider list
```

## 许可证

ISC
