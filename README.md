# OS Chat

[![Visit OS Chat](https://img.shields.io/badge/Visit-oschat-blue)](https://oschat.ai)

**OS Chat** is a free, open-source AI personal assistant that combines 50+ language models with powerful automation capabilities. Deploy background agents, connect your favorite services (Gmail, Calendar, Notion, GitHub), and get things done through natural conversation.

![OS Chat — Open-source AI chat app (oschat.ai)](./public/opengraph-image.png)

## 🚀 Why OS Chat?

- **🔓 Open Source T3 Chat Alternative** - Get all the speed and multi-model access of T3 Chat, but open source, self-hostable, and enhanced with background agents and service integrations
- **🤖 Your AI Personal Assistant** - More than chat - deploy background agents, automate workflows, and manage your digital life
- **🔗 Connect Everything** - Direct integration with Gmail, Calendar, Notion, GitHub, Slack, and 10+ more services via Composio
- **⏰ Smart Automation** - Deploy background agents with email notifications - let your assistant work while you sleep
- **🧠 50+ AI Models** - Access the latest from OpenAI, Anthropic, Google, Meta, and more in one interface
- **🎯 Truly Personal** - Customize personality traits, personal context, and preferences for tailored interactions
- **🔒 Privacy-First** - Open source, self-hostable, with encrypted API key storage

## ✨ Features

### ⏰ Background Agents & Automation

- **Smart Background Agents** - Deploy AI agents to run one-time, daily, or weekly with timezone awareness
- **Email Notifications** - Get notified when your background agents complete successfully
- **Automated Workflows** - Let your AI assistant handle routine work while you focus on what matters
- **Execution History** - Track and monitor all your background agent runs with detailed logs

### 🔗 Service Connectors & Integrations (via Composio)

- **Gmail Integration** - Access, read, and manage your email messages directly through chat
- **Google Calendar** - View, create, and schedule calendar events seamlessly
- **Google Drive & Docs** - Access files, create documents, and collaborate on projects
- **Notion Workspace** - Read and write to your Notion pages and databases
- **GitHub Management** - Manage repositories, issues, and pull requests
- **Slack, Linear, X (Twitter)** - And 10+ more services

### 🤖 AI & Models

- **50+ AI Models** - Access OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, xAI, Moonshot, Z.AI, MiniMax, and Qwen models
- **Multi-modal Support** - Text, images, and reasoning across all supported models
- **Image Generation** - Create high-quality images with GPT Image 1.5, Nano Banana Pro, Imagen 4, and Flux Schnell
- **Reasoning Models** - View AI thinking process with o3, Claude 4, Gemini Thinking, and DeepSeek R1
- **Web Search Integration** - Real-time internet search using Exa, Tavily, and Brave APIs

### 💬 Chat Management

- **Smart Organization** - Automatic grouping by Today, Yesterday, Last 7 Days, etc.
- **Pinned Chats** - Keep important conversations at the top
- **Chat Branching** - Create alternative conversation paths from any assistant message
- **Advanced Search** - Full-text search across chat history with content snippets
- **Data Portability** - Export/import chat history with full data control

### 🎨 Interface & Experience

- **Responsive Design** - Beautiful interface that works on desktop and mobile
- **Theme System** - Beautiful light and dark modes with smooth transitions
- **Keyboard Shortcuts** - Quick access with ⌘+K (search), ⌘+Shift+O (new chat), ⌘+B (toggle sidebar)
- **Real-time Streaming** - Instant message streaming for immediate responses

## 🤖 Available Models

### 💬 Text & Chat Models

- **OpenAI**: GPT-5.2, GPT-5.2 Pro, GPT-5.1, GPT-5, GPT-5 Mini/Nano, GPT OSS 20B/120B, o3, o4 Mini
- **Anthropic**: Claude 4.5 Opus, Claude 4.5 Sonnet, Claude 4.5 Haiku (with reasoning)
- **Google**: Gemini 3 Pro/Flash, Gemini 2.5 Pro/Flash (with thinking)
- **Meta**: Llama 4 Maverick, Llama 4 Scout
- **DeepSeek**: V3.2, V3.1, R1 (with reasoning variants)
- **xAI**: Grok 4.1 Fast, Grok 4, Grok 3
- **Moonshot**: Kimi K2, Kimi K2 Thinking
- **Z.AI**: GLM 4.7, GLM 4.6, GLM 4.5 (with thinking)
- **MiniMax**: M2.1, M2
- **Qwen**: Qwen3 Coder, Qwen3 235B

### 🎨 Image Generation

- **OpenAI**: GPT Image 1.5
- **Google**: Nano Banana Pro, Nano Banana, Imagen 4, Imagen 4 Ultra
- **Fal**: Flux Schnell

## 🛠️ Built with

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework with SSR
- [TanStack Router](https://tanstack.com/router) - Type-safe file-based routing
- [TanStack Query](https://tanstack.com/query) - Powerful data fetching and caching
- [Vite](https://vite.dev) - Next-generation frontend tooling
- [Nitro](https://nitro.build) - Universal server engine
- [React 19](https://react.dev) - UI library with latest features
- [t3-env](https://env.t3.gg) - Type-safe environment variables with Zod
- [Vercel AI SDK v5](https://vercel.com/blog/introducing-the-vercel-ai-sdk) - Model integration and streaming
- [Convex](https://convex.dev) - Real-time backend, authentication, and database
- [Composio](https://composio.dev) - Service integrations (Gmail, Calendar, Notion, GitHub, etc.)
- [shadcn/ui](https://ui.shadcn.com) - Modern component library for UI
- [Framer Motion](https://motion.dev) - Smooth animations and transitions
- [Zustand](https://zustand.docs.pmnd.rs) - Lightweight state management
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - Object storage for file attachments
- [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS framework
- [Ultracite](https://ultracite.io) - Lightning-fast linting with Biome

## 🚀 Getting Started

See the **[Installation Guide](./docs/installation.md)** for complete setup instructions.

### Quick Start

```bash
# Clone and install
git clone https://github.com/ajanraj/OpenChat.git
cd OpenChat && bun install

# Set up Convex backend
bunx convex login && bunx convex dev --once

# Configure environment
cp .env.example .env

# Run development server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to see OS Chat running locally!

## 📜 Development Commands

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `bun dev`           | Start development server on port 3000  |
| `bun build`         | Build for production                   |
| `bun test`          | Run tests with Vitest                  |
| `bun run lint`      | Run Ultracite linter                   |
| `bun run typecheck` | Run TypeScript type checking with tsgo |
| `bunx convex dev`   | Run Convex development server          |

## 🗺️ Roadmap

- **Projects & Workspaces** - Organize your chats into projects and workspaces
- **MCP integration** - Model Context Protocol support for enhanced AI capabilities
- **Stream Resuming** - Resume interrupted streams using Redis

## 🤝 Contributing

We welcome contributions! See the [Installation Guide](./docs/installation.md) to set up your development environment.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run `bun run lint` and `bun run format` before committing
4. Push to the branch and open a Pull Request

### Areas We'd Love Help With

- Stream resuming using Redis
- Performance optimizations
- MCP integration
- Additional service connectors

## ⚠️ Notes

**Current Status**: Beta Release - OS Chat is actively developed with regular feature updates.

**Compatibility**: Built with TanStack Start, Vite, and Nitro for modern full-stack React architecture.

**Privacy**: All data is processed securely with user control over exports, imports, and data management.

---

Copyright 2025 Ajan Raj. Licensed under the Apache License 2.0.
