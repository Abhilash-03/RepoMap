# RepoMap 🗺️

GitHub Repository File Dependency Analyzer - A zero-setup, web-based visual dependency analyzer.

## Features

- 📊 **Interactive Dependency Graph** - Visualize which files import which files using React Flow
- 🔴 **Orphan File Detection** - Identify files that exist but are never imported anywhere
- 🔍 **GitHub Integration** - Just paste a repo URL and analyze
- 📁 **JS/TS Support** - Analyzes import/require/export statements

## Tech Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express
- **Visualization:** React Flow
- **GitHub API:** Octokit
- **Parsing:** Regex-based import/export detection

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token (for higher API rate limits)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/repomap.git
cd repomap
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Create environment file for server:
```bash
cd server
cp .env.example .env
# Add your GitHub token to .env
```

4. Start development servers:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Usage

1. Open the app in your browser
2. Paste a GitHub repository URL (e.g., `https://github.com/facebook/react`)
3. Click "Analyze"
4. Explore the interactive dependency graph
5. Check the orphan files list for unused files

## API Endpoints

- `POST /api/analyze` - Analyze a GitHub repository
  ```json
  { "repoUrl": "https://github.com/owner/repo" }
  ```

