# SentinelAI - VS Code Extension

<div align="center">

[![VS Code](https://img.shields.io/badge/VS%20Code-v1.110+-007ACC?style=flat-square&logo=visual-studio-code)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-ISC-blue?style=flat-square)](LICENSE)
[![Install](https://img.shields.io/badge/marketplace-install-brightgreen?style=flat-square&logo=visual-studio-code)](https://marketplace.visualstudio.com/)

**🛡️ AI-Powered Security Analysis for Developers**

Integrated security scanning directly in your VS Code editor. Detect vulnerabilities, security issues, and code quality problems in real-time with AI-powered recommendations.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Settings](#-extension-settings) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

**SentinelAI** is an intelligent security scanner extension for VS Code that helps developers identify and fix security vulnerabilities before they reach production. Powered by AI analysis and multiple specialized security tools, it provides real-time feedback and actionable recommendations.

## ✨ Features

### 🔍 Intelligent Code Scanning
- **Multi-Scanner Support**: ESLint, Bandit, Semgrep integration
- **Real-time Analysis**: Scan on-demand or on file save
- **Multiple Languages**: JavaScript, TypeScript, Python support
- **Pattern Detection**: Advanced vulnerability pattern recognition
- **Secrets Detection**: Identify hardcoded credentials and API keys

### 🤖 AI-Powered Insights
- **Smart Recommendations**: AI-generated fix suggestions
- **Context-Aware Analysis**: Understands code context for better accuracy
- **Learning from Patterns**: Learns common vulnerability patterns
- **Natural Language Explanations**: Human-readable vulnerability descriptions

### 🛡️ Security Features
- **Vulnerability Severity Levels**: Critical, High, Medium, Low classification
- **Detailed Reports**: Comprehensive security analysis reports
- **Quick Fixes**: One-click suggestions for common issues
- **Offline Mode**: Works with local Ollama instance (optional)

### 🔧 Developer Experience
- **Interactive Panel**: Beautiful, intuitive results panel
- **Attack Sandbox**: Test exploit scenarios safely
- **Project Scanning**: Scan entire projects with one command
- **Status Indicators**: Quick visual feedback on security status

## 📋 Requirements

- **VS Code**: Version 1.110.0 or higher
- **Node.js**: 18+ (for backend connection)
- **Backend Server**: SentinelAI backend (running locally or remote)
- **Optional**: Ollama (for AI analysis features)

## 🚀 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "SentinelAI" or "secure-dev-tool"
4. Click **Install**

### From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/sentinelai.git
cd sentinelai/SentialAi

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Package for local testing
npm run package
```

## 🎮 Usage

### Basic Workflow

#### 1. Scan Current Project
```
Press: Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (Mac)
Type: SentinelAI: Scan Project
```

#### 2. View Results
Results appear in the SentinelAI panel showing:
- Vulnerability count by severity
- Detailed issue list with location
- AI-generated recommendations
- Quick fix suggestions

#### 3. Run Attack Sandbox
```
Command: SentinelAI: Run Attack Sandbox
```

Test potential attack scenarios in an isolated environment.

#### 4. Open Report
```
Command: SentinelAI: Open Report
```

View comprehensive HTML report with all findings.

### Command Palette Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `SentinelAI: Scan Project` | — | Scan entire project |
| `SentinelAI: Open Report` | — | View detailed report |
| `SentinelAI: Run Attack Sandbox` | — | Test exploits safely |

### Keyboard Shortcuts

- **Ctrl+Shift+S** (Windows/Linux) / **Cmd+Shift+S** (Mac): Quick scan current file

## ⚙️ Extension Settings

Configure SentinelAI behavior through VS Code settings:

```json
{
  // Backend Server Configuration
  "sentinelai.backendUrl": "http://localhost:3000",
  "sentinelai.backendTimeout": 30000,

  // Scanning Configuration
  "sentinelai.autoScan": false,
  "sentinelai.scanOnSave": false,
  "sentinelai.excludePatterns": ["node_modules", ".git", "dist", "build"],

  // LLM Configuration
  "sentinelai.enableAIAnalysis": true,
  "sentinelai.ollamaUrl": "http://localhost:11434",
  "sentinelai.ollamaModel": "mistral",

  // Display Settings
  "sentinelai.showSeverityIndicators": true,
  "sentinelai.groupByFile": true,
  "sentinelai.minimumSeverity": "medium"
}
```

### Configuration Details

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `backendUrl` | string | `http://localhost:3000` | Backend server URL |
| `autoScan` | boolean | `false` | Auto-scan on file open |
| `scanOnSave` | boolean | `false` | Scan on file save |
| `enableAIAnalysis` | boolean | `true` | Enable LLM analysis |
| `showSeverityIndicators` | boolean | `true` | Show inline severity |

## 📊 Results Panel

The Results Panel displays:

```
SentinelAI Security Report
├── Summary
│   ├── Critical: 2
│   ├── High: 5
│   ├── Medium: 12
│   └── Low: 8
├── Issues by File
│   ├── src/api.js (3 issues)
│   ├── src/auth.ts (2 issues)
│   └── src/db.py (1 issue)
└── Recommendations
    ├── AI-generated fixes
    └── External references
```

## 🔗 Backend Integration

### Setting Up Backend

```bash
# In another terminal, start the backend
cd sentinelai/backend
npm install
npm start

# Backend runs on http://localhost:3000
```

### Backend Configuration

Update extension settings to point to your backend:

```json
{
  "sentinelai.backendUrl": "http://localhost:3000"
}
```

For remote backend (e.g., cloud server):

```json
{
  "sentinelai.backendUrl": "https://api.example.com:3000"
}
```

## 🤖 AI Analysis Setup (Optional)

For AI-powered recommendations, install Ollama:

1. **Download Ollama** from https://ollama.ai
2. **Install** and start the service
3. **Pull a model**: `ollama pull mistral`
4. **Enable in extension settings**:
   ```json
   {
     "sentinelai.enableAIAnalysis": true,
     "sentinelai.ollamaUrl": "http://localhost:11434",
     "sentinelai.ollamaModel": "mistral"
   }
   ```

## 🐛 Troubleshooting

### Extension not activating

1. Check VS Code version (must be 1.110.0+)
2. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
3. Check extension logs (View → Output → SentinelAI)

### Backend connection fails

```
Error: Cannot connect to backend at http://localhost:3000

Solution:
1. Ensure backend is running: cd backend && npm start
2. Check backend URL in settings
3. Verify network connectivity
4. Check firewall settings
```

### No scan results

1. Verify project contains supported files (.js, .ts, .py)
2. Check extension output for errors
3. Ensure backend is responding
4. Try with a known vulnerable project

### AI analysis not working

1. Check Ollama is installed and running
2. Verify model is available: `ollama list`
3. Check OLLAMA_HOST setting matches
4. Review extension logs for detailed errors

## 📁 Project Structure

```
SentialAi/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── services.ts           # Backend communication
│   ├── types.ts              # TypeScript interfaces
│   └── webview.ts            # Results panel UI
├── package.json              # Extension metadata
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

### Key Files

- **extension.ts**: Extension initialization and command registration
- **services.ts**: Communication with backend API
- **webview.ts**: React/HTML panel for displaying results
- **types.ts**: Type definitions for shared data structures

## 🏗️ Architecture

### System Architecture

```
┌────────────────────────────────────────────────────────────┐
│             VS Code Editor                                 │
│ ┌──────────────────────────────────────────────────────┐   │
│ │  SentinelAI Extension                                │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │  ┌──────────────┐  ┌──────────────┐                 │   │
│ │  │ extension.ts │  │  services.ts │                 │   │
│ │  │ (Commands)   │  │ (HTTP Client)│                 │   │
│ │  └──────┬───────┘  └──────┬───────┘                 │   │
│ │         │                  │                        │   │
│ │  ┌──────▼──────────────────▼──────┐                 │   │
│ │  │      WebView Panel              │                 │   │
│ │  │  (Results Display UI)           │                 │   │
│ │  └──────────────────────────────────┘                 │   │
│ └──────────────┬───────────────────────────────────────┘   │
│                │                                            │
└────────────────┼────────────────────────────────────────────┘
                 │ HTTP/REST
                 │ (JSON)
         ┌───────▼────────┐
         │ Backend Server │
         │ (Node.js/      │
         │  Express)      │
         └───────┬────────┘
                 │
    ┌────────────┼────────────┬─────────────┐
    │            │            │             │
┌───▼──┐  ┌─────▼────┐  ┌────▼────┐  ┌───▼──┐
│ESLint│  │  Bandit  │  │ Semgrep │  │Ollama│
│      │  │          │  │         │  │(LLM) │
└──────┘  └──────────┘  └─────────┘  └──────┘
    │            │            │
    └────────────┼────────────┘
                 │
         ┌───────▼────────┐
         │  Rules Engine  │
         │  + Analysis    │
         └────────────────┘
```

### Data Flow

1. **User Action**: Command triggered via Command Palette or keyboard shortcut
2. **Extension Processing**: `extension.ts` processes command
3. **API Request**: `services.ts` sends HTTP request to backend
4. **Backend Analysis**: Backend executes scanners (ESLint, Bandit, Semgrep)
5. **AI Analysis**: Optional Ollama LLM analysis for recommendations
6. **Response**: Backend returns structured vulnerability data
7. **UI Display**: WebView renders results in interactive panel
8. **User Interaction**: User clicks on issues to see details and fixes

### Component Interaction

```
┌─────────────────────────────────────────┐
│  extension.ts (Extension Host)          │
│  - Registers commands                   │
│  - Manages extension lifecycle          │
│  - Calls services layer                 │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  services.ts (Communication Layer)      │
│  - HTTP client with axios               │
│  - Error handling & retry logic         │
│  - Response parsing & validation        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  webview.ts (UI Layer)                  │
│  - Renders results panel                │
│  - Handles user interactions            │
│  - Updates display state                │
└─────────────────────────────────────────┘
```

## 🔒 Security & Privacy

- **Local Analysis**: Default configuration uses local backend
- **No Telemetry**: User data is not collected
- **Open Source**: Full transparency in code
- **Secure Communication**: HTTPS support for remote backends
- **Privacy Settings**: Users control what gets scanned

## 🛠️ Development

### Building from Source

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package extension
npm run vscode:prepublish
```

### Running in Development

1. Open project in VS Code
2. Press F5 to start debug session
3. Extension loads in new VS Code window
4. Make code changes and reload to test

### Testing

```bash
# Run tests (when configured)
npm test

# Manual testing checklist
- [ ] Scan command works
- [ ] Results display correctly
- [ ] AI analysis functions
- [ ] Backend connection works
- [ ] Settings apply correctly
```

## 📚 API Reference

### Backend Communication

```typescript
// Scan endpoint
POST /api/scan
{
  "projectPath": string,
  "language": "javascript" | "python" | "all",
  "scanners": string[]
}

// Analysis endpoint
POST /api/analyze
{
  "code": string,
  "language": "javascript" | "python"
}
```

### Extension Events

```typescript
// Listening for scan completion
vscode.extensions.getExtension('sentinelai.sentinelai')
  ?.exports?.onScanComplete
  ?.subscribe((results) => { ... })
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-feature`)
3. **Commit** changes (`git commit -m 'Add new feature'`)
4. **Push** to branch (`git push origin feature/new-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure compilation succeeds: `npm run compile`
- Test in VS Code before submitting

### Reporting Issues

Found a bug? Please report it:

1. Check existing issues first
2. Include VS Code version
3. Include extension version
4. Provide reproduction steps
5. Share relevant logs (View → Output → SentinelAI)

## 🐛 Known Issues

- Large projects (1000+ files) may take longer to scan
- AI analysis requires external Ollama instance
- Some Python 2 patterns may not be detected
- Results panel may not update immediately on rapid rescans

## 📈 Roadmap

- [ ] GitLab integration
- [ ] Inline code decorations
- [ ] Custom rule creation UI
- [ ] Historical analysis tracking
- [ ] Team collaboration features
- [ ] Custom SIEM integration
- [ ] Database performance audit

## 📄 License

Licensed under the ISC License - see [LICENSE](LICENSE) for details.

## 🙋 Support & Community

- 📖 [Documentation](https://github.com/yourusername/sentinelai/wiki)
- 🐛 [Report Bug](https://github.com/yourusername/sentinelai/issues)
- 💡 [Request Feature](https://github.com/yourusername/sentinelai/issues)
- 💬 [Discussions](https://github.com/yourusername/sentinelai/discussions)
- 🐦 [Twitter](https://twitter.com/sentinelai)

## 🤖 About SentinelAI

SentinelAI is an open-source project dedicated to making developer security accessible and integrated into the development workflow. We believe security should be:

- **Easy**: No complex setup required
- **Integrated**: Works where developers code
- **Intelligent**: AI-powered for better insights
- **Open**: Transparent and community-driven

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

<div align="center">

### Made with ❤️ for Secure Development

[⬆ Back to top](#sentinelai---vs-code-extension)

**[Report Issues](https://github.com/yourusername/sentinelai/issues) • [Request Features](https://github.com/yourusername/sentinelai/issues) • [Star the Repo](https://github.com/yourusername/sentinelai)** ⭐

</div>
