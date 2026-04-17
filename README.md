# RepoMap 🗺️

A powerful, zero-setup dependency visualization tool for JavaScript/TypeScript repositories. Simply paste a GitHub URL and instantly see an interactive map of file dependencies, discover orphan files, and identify entry points.

![RepoMap](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple)

## ✨ Features

### Core Analysis
- 📊 **Interactive Dependency Graph** - Zoomable, pannable graph with ELK layout algorithm
- 🔴 **Orphan File Detection** - Identify dead code and unused files
- 🟢 **Entry Point Detection** - Automatically identifies main entry files
- 🔗 **Bidirectional Tracking** - See both imports and imported-by relationships

### Framework Support
- ⚛️ **React / Vite** - Full support for standard React applications
- ⬛ **Next.js** - App Router & Pages Router, API routes, middleware
- 🎸 **Remix** - File-based routing, entry files
- 📦 **Node.js / Express** - Backend JS/TS projects

> **Note:** Vue (.vue), Svelte (.svelte), and Astro (.astro) single-file components are not yet analyzed. Only their companion JS/TS files are supported.

### Smart Detection
- 📁 **Path Alias Resolution** - Supports `@/`, `~/`, `#/` aliases
- 📝 **TypeScript ESM** - Resolves `.js` imports to `.ts` files
- ⚙️ **Config File Detection** - Recognizes `*.config.*`, `.*rc`, etc.
- 🧪 **Test File Detection** - Excludes test files from orphan detection
- 📚 **Storybook Support** - Recognizes `.stories.*` files

### User Experience
- 📱 **Mobile Responsive** - Full touch support with tap-to-view details
- 🌙 **Full Screen Mode** - Distraction-free graph exploration
- ⏳ **Progress Indicator** - Real-time analysis progress with step-by-step feedback
- 🔑 **GitHub Token Settings** - Configure API tokens with rate limit display
- 📖 **Comprehensive Docs** - Built-in documentation at `/docs`

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| UI Components | shadcn/ui, Lucide Icons |
| Visualization | React Flow, ELK.js Layout |
| Backend | Node.js, Express, TypeScript |
| GitHub API | Octokit |
| Routing | React Router DOM |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhilash-03/RepoMap.git
cd RepoMap

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

## 📖 Usage

1. **Open the app** in your browser at `http://localhost:5173`
2. **Paste a GitHub URL** (e.g., `https://github.com/pmndrs/zustand`)
3. **Click "Analyze"** and wait for the analysis to complete
4. **Explore the graph:**
   - 🟢 Green nodes = Entry points
   - 🔴 Red nodes = Orphan files
   - ⚪ Gray nodes = Regular files
5. **Tap/click nodes** to see detailed information
6. **Use controls** to zoom, pan, change layout direction, or go full screen

### GitHub API Rate Limits

| Type | Requests/Hour |
|------|---------------|
| Without Token | 60 |
| With Token | 5,000 |

Add your token via the ⚙️ Settings icon in the header.

## 📁 Project Structure

```
RepoMap/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── docs/       # Documentation page components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── lib/            # Utilities & ELK layout
│   │   └── types/          # TypeScript types
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Analysis logic
│   │   │   ├── analyzer.ts # Dependency analysis
│   │   │   ├── github.ts   # GitHub API client
│   │   │   └── graphBuilder.ts
│   │   └── types/
│   └── package.json
└── package.json            # Root package.json
```

## 🔌 API Reference

### Analyze Repository

```http
POST /api/analyze
Content-Type: application/json

{
  "repoUrl": "https://github.com/owner/repo",
  "githubToken": "optional_token"
}
```

**Response:**
```json
{
  "repoInfo": { "owner": "...", "repo": "..." },
  "totalFiles": 42,
  "entryPoints": ["src/main.tsx"],
  "orphanFiles": ["src/unused.ts"],
  "dependencies": [...],
  "nodes": [...],
  "edges": [...],
  "rateLimit": { "remaining": 4999, "limit": 5000 }
}
```

### Check Rate Limit

```http
GET /api/rate-limit
x-github-token: optional_token
```

**Response:**
```json
{
  "limit": 5000,
  "remaining": 4990,
  "reset": 1704067200,
  "used": 10
}
```

## 🎯 Supported File Types

| Extension | Description |
|-----------|-------------|
| `.js` | JavaScript |
| `.jsx` | JavaScript JSX |
| `.ts` | TypeScript |
| `.tsx` | TypeScript JSX |
| `.mjs` | ES Modules |
| `.cjs` | CommonJS |

## 🚫 Excluded Directories

The following directories are automatically skipped:
- `node_modules`, `dist`, `build`, `.git`
- `coverage`, `vendor`, `__pycache__`
- `.next`, `.nuxt`, `out`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) - Graph visualization
- [ELK.js](https://github.com/kieler/elkjs) - Layout algorithm
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Octokit](https://github.com/octokit/octokit.js) - GitHub API

---

Made with ❤️ for developers who love clean code

