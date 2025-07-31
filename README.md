# MCP-Utils 🛠️

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-6.17.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![MCP](https://img.shields.io/badge/model_context_protocol-compliant-purple.svg)](https://modelcontextprotocol.io/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io/)
[![Claude Desktop](https://img.shields.io/badge/Claude%20Desktop-Integrated-orange.svg)](https://claude.ai/)

Essential TypeScript utility library for **Model Context Protocol (MCP) server development** with **Claude Desktop integration**. This production-ready utility package provides comprehensive tools for
building robust MCP servers with MongoDB connectivity, encryption, cross-platform configuration management, and more.

## 🚀 Features

- **🔧 MCP Server Utilities**: Core utilities for building Model Context Protocol servers
- **🗄️ MongoDB Integration**: Simplified database connectivity with error handling
- **🔐 AES-256-GCM Encryption**: Secure token encryption and decryption
- **⚙️ Claude Configuration**: Automatic Claude Desktop config updates across platforms
- **🔌 Port Management**: Smart port killing and process management
- **📝 Logging & Error Handling**: Structured console logging and error reporting
- **🌐 Cross-Platform**: Full support for macOS, Windows, and Linux
- **📦 TypeScript Ready**: Full TypeScript support with type definitions

## 📦 Installation

```bash
# Install from GitHub
npm install github:pdas9647/MCP-Utils#master

# Or add to package.json
"mcp-utils": "github:pdas9647/MCP-Utils#master"
```

## 🎯 Usage

### Import Utilities

```typescript
import {
    connect,                    // MongoDB connection
    encryptToken, decryptToken, // Encryption utilities
    addOrUpdateMCPServer,       // Claude config management
    killPortOnLaunch,          // Port management
    printInConsole,            // Console logging
    sendError                  // Error handling
} from 'mcp-utils/utils';
```

### MongoDB Connection

```typescript
import {connect} from 'mcp-utils/utils';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
const MONGODB_URI = process.env.MONGODB_URI;
const db = await connect(transport, MONGODB_URI, 'your-database-name');
```

### Encryption & Decryption

```typescript
import {encryptToken, decryptToken} from 'mcp-utils/utils';

const TOKEN_SECRET = 'your-32-byte-hex-secret';
const plainText = 'sensitive-data';

// Encrypt
const encrypted = encryptToken(TOKEN_SECRET, plainText);
console.log(encrypted); // { iv: '...', content: '...', tag: '...' }

// Decrypt
const decrypted = decryptToken(TOKEN_SECRET, encrypted);
console.log(decrypted); // 'sensitive-data'
```

### Claude Desktop Configuration

```typescript
import {addOrUpdateMCPServer, setEntry} from 'mcp-utils/utils';

// Create server entry
const {entry} = setEntry('your-project-name');

// Add/update MCP server in Claude Desktop config
await addOrUpdateMCPServer('server-name', entry);
```

### Port Management

```typescript
import {killPortOnLaunch, freezePortOnQuit} from 'mcp-utils/utils';

// Kill processes using a specific port
await killPortOnLaunch(3000);

// Monitor parent process and exit when it dies
freezePortOnQuit();
```

### Console Logging & Error Handling

```typescript
import {printInConsole, sendError} from 'mcp-utils/utils';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();

// Log messages to console
await printInConsole(transport, 'Server started successfully');

// Send structured errors
try {
    // Some operation
} catch (error) {
    sendError(transport, error instanceof Error ? error : new Error(String(error)), 'operation-context');
}
```

## 🏗️ Architecture

### Core Utilities

| Utility                 | Purpose              | Key Features                          |
|-------------------------|----------------------|---------------------------------------|
| `db.ts`                 | MongoDB connectivity | Connection management, error handling |
| `encryption.ts`         | Token security       | AES-256-GCM encryption/decryption     |
| `updateClaudeConfig.ts` | Claude integration   | Cross-platform config management      |
| `killPortOnLaunch.ts`   | Process management   | Port killing, process monitoring      |
| `printInConsole.ts`     | Logging              | Structured console output             |
| `sendError.ts`          | Error handling       | JSON-RPC error reporting              |
| `directory.ts`          | Path utilities       | Cross-platform directory resolution   |

### Cross-Platform Support

The library provides full cross-platform support for:

- **macOS**: `~/Library/Application Support/Claude/`
- **Windows**: `%APPDATA%\Claude\`
- **Linux**: `~/.config/Claude/`

## 🔨 Used By

This utility library powers several production MCP servers:

### 1. [GitHub-MCP](https://github.com/chayan-1906/GitHub-MCP)

Complete GitHub integration with repository management, issue tracking, and collaboration features.

```typescript
// Usage example from GitHub-MCP
import {addOrUpdateMCPServer, freezePortOnQuit, killPortOnLaunch, printInConsole, setEntry} from "mcp-utils/utils";

await killPortOnLaunch(PORT);
const {entry} = setEntry('') as any;
await addOrUpdateMCPServer('github', entry);
```

### 2. [Google-Workspace-MCP](https://github.com/chayan-1906/Google-Workspace-MCP)

Google Drive, Sheets, and Docs integration for comprehensive workspace management.

### 3. [FS-MCP](https://github.com/chayan-1906/FS-MCP)

Local file system operations with cross-platform support for macOS, Windows & Linux.

## 🛡️ Security Features

- **AES-256-GCM Encryption**: Industry-standard encryption for sensitive data
- **Secure Token Management**: Proper IV generation and authentication tags
- **Error Context Isolation**: Structured error handling without exposing sensitive information
- **Development/Production Modes**: Stack traces only in development environment

## 🔧 Development

### Prerequisites

- Node.js 18+
- TypeScript 5.8+
- MongoDB (for database utilities)

### Build

```bash
npm run build    # Compile TypeScript
npm run dev      # Development mode
```

### Project Structure

```
mcp-utils/
├── src/
│   └── server.ts           # Example server
├── utils/
│   ├── index.ts           # Main exports
│   ├── db.ts              # MongoDB utilities
│   ├── encryption.ts      # Crypto utilities
│   ├── updateClaudeConfig.ts # Claude config
│   ├── killPortOnLaunch.ts   # Port management
│   ├── printInConsole.ts     # Logging
│   ├── sendError.ts          # Error handling
│   └── directory.ts          # Path utilities
├── package.json
└── tsconfig.json
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP documentation
- [Claude Desktop](https://claude.ai/) - Anthropic's Claude Desktop application
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - Official MCP SDK

## 📊 Stats

- **Language**: TypeScript
- **Dependencies**: 2 (crypto-js, mongodb)
- **Zero Runtime Dependencies**: Core utilities with minimal footprint
- **Cross-Platform**: macOS, Windows, Linux support
- **Production Ready**: Used in multiple production MCP servers

---

<div align="center">

**Built with ❤️ for the MCP ecosystem**

[Report Bug](https://github.com/pdas9647/MCP-Utils/issues) · [Request Feature](https://github.com/pdas9647/MCP-Utils/issues) · [Documentation](https://github.com/pdas9647/MCP-Utils#readme)

</div>
