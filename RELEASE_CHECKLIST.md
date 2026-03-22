# 🚀 NPM 发布检查清单

## ✅ 发布前检查

### 1. 代码质量
- [ ] 代码已通过 TypeScript 编译 (`npm run build`)
- [ ] 所有命令正常工作
- [ ] 错误处理完善
- [ ] 代码注释清晰

### 2. 文档完善
- [ ] README.md 更新
- [ ] USAGE.md 更新
- [ ] QUICKSTART.md 创建
- [ ] PUBLISH.md 创建

### 3. Package.json 配置
- [ ] 包名称唯一 (`@delta1035/ccs-cli`)
- [ ] 版本号正确 (1.0.0)
- [ ] 描述清晰
- [ ] 作者信息完整
- [ ] 仓库链接正确
- [ ] 关键词准确
- [ ] 许可证正确 (ISC)

### 4. 发布配置
- [ ] .npmignore 文件存在
- [ ] files 字段配置正确
- [ ] prepublishOnly 脚本存在
- [ ] 引擎要求合理 (node >= 18.0.0)

## 📝 发布步骤

### 步骤 1: 准备环境
```bash
# 登录 NPM
npm login

# 检查包名是否可用
npm search @delta1035/ccs-cli
```

### 步骤 2: 本地测试
```bash
# 构建项目
npm run build

# 本地安装测试
npm install -g .
ccs --help
ccs provider list
```

### 步骤 3: 发布到 NPM
```bash
# 方法 1: 使用脚本
./scripts/publish.sh

# 方法 2: 手动发布
npm publish --access public
```

### 步骤 4: 验证发布
```bash
# 检查包信息
npm view @delta1035/ccs-cli

# 测试安装
npm install -g @delta1035/ccs-cli
ccs --help
```

## 🎯 发布后操作

### 1. GitHub Release
- [ ] 创建新的 Release
- [ ] 添加 Release Notes
- [ ] 上传编译后的文件

### 2. 文档更新
- [ ] 更新 README 安装说明
- [ ] 添加版本 badges
- [ ] 更新快速开始指南

### 3. 社交媒体
- [ ] Twitter / X 发布
- [ ] Reddit 分享
- [ ] Dev.to 文章
- [ ] LinkedIn 分享

## 📊 监控指标

发布后关注以下指标：

- [ ] 下载量增长
- [ ] GitHub Stars
- [ ] Issue 反馈
- [ ] PR 贡献

## 🔄 版本更新流程

当需要发布新版本时：

1. 修改代码
2. 更新版本号
   - 使用脚本（推荐）: `./scripts/bump-version.sh patch/minor/major`
   - 或手动: `npm version patch/minor/major`
3. 提交更改
4. 推送到 GitHub
5. 发布到 NPM

## 🆘 紧急情况处理

### 如果发布错误
```bash
# 撤销发布（24小时内）
npm unpublish @delta1035/ccs-cli@1.0.0

# 或标记为废弃
npm deprecate @delta1035/ccs-cli@1.0.0 "Deprecated version"
```

### 如果包名冲突
1. 修改 package.json 中的 name
2. 重新发布

## 📝 许可证

ISC License
