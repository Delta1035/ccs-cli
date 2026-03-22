# CCS CLI

🤖 AI CLI Tool Manager - Switch between Claude, Codex, Gemini, and more

[![npm version](https://badge.fury.io/js/ccs-cli.svg)](https://badge.fury.io/js/ccs-cli)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## ✨ Features

- **Multi-Provider Support**: Manage Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw
- **One-Click Switching**: Instantly switch between different AI providers
- **50+ Provider Presets**: AWS Bedrock, NVIDIA NIM, OpenRouter, and more
- **Unified Configuration**: Manage MCP, Prompts, and Skills across all apps
- **Usage Tracking**: Monitor API calls and costs
- **Session Management**: Browse and restore conversation history

## 🚀 Installation

```bash
# Install globally via npm
npm install -g ccs-cli

# Or using yarn
yarn global add ccs-cli
```

## 📖 Usage

### Basic Commands

```bash
# Show help
ccs --help

# Show version
ccs --version
```

### Provider Management

```bash
# List all providers
ccs provider list

# Add a new provider
ccs provider add

# Switch to a provider (by number, name, or ID)
ccs provider switch 1
ccs provider switch claude
ccs provider switch bd065723

# Remove a provider
ccs provider remove 1

# Show current provider
ccs provider current
```

### Preset Management

```bash
# List available presets
ccs preset list

# Import a preset
ccs preset import
```

### Configuration Management

```bash
# Show config directory
ccs config dir

# Export configuration
ccs config export

# Import configuration
ccs config import

# Reset configuration
ccs config reset
```

### Session Management

```bash
# List sessions
ccs session list

# View session details
ccs session view

# Delete a session
ccs session delete

# Clear all sessions
ccs session clear
```

### MCP Configuration

```bash
# List MCP configurations
ccs mcp list

# Add MCP configuration
ccs mcp add

# Remove MCP configuration
ccs mcp remove
```

### Usage Statistics

```bash
# View usage statistics
ccs usage stats

# Show total cost
ccs usage cost

# Reset usage statistics
ccs usage reset
```

## 📁 Configuration Files

Configuration files are stored in `~/.cc-switch/`:

- `data.json` - Main data file
- `configs/` - AI tool configuration files
- `backups/` - Configuration backups

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/your-username/ccs-cli.git
cd ccs-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Test the CLI
node dist/index.js --help
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC © [Your Name](https://github.com/your-username)

## 🙏 Acknowledgments

- Based on [farion1231/cc-switch](https://github.com/farion1231/cc-switch)
- Built with [Commander.js](https://github.com/tj/commander.js)
- Interactive prompts by [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
