import {
  Network,
  FileWarning,
  GitBranch,
  Search,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Section from './Section';
import CodeBlock from './CodeBlock';
import Callout from './Callout';
import FeatureCard from './FeatureCard';

function DocsContent() {
  return (
    <main className="flex-1 w-full min-w-0 lg:ml-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Introduction */}
        <Section id="introduction" title="Introduction">
          <p className="text-lg text-slate-600 mb-6">
            <strong className="text-slate-900">RepoMap</strong> is a powerful dependency visualization tool that helps developers understand the structure and relationships within their codebase. Simply paste a GitHub repository URL and instantly get an interactive map of file dependencies, discover orphan files, and identify entry points.
          </p>

          <div className="grid md:grid-cols-3 gap-4 my-8">
            <FeatureCard
              icon={Network}
              title="Visual Graph"
              description="Interactive dependency graph with zoom, pan, and ELK layout algorithm"
            />
            <FeatureCard
              icon={FileWarning}
              title="Orphan Detection"
              description="Identify dead code and unused files in your codebase"
            />
            <FeatureCard
              icon={Zap}
              title="Zero Setup"
              description="No installation needed - just paste a GitHub URL"
            />
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Why RepoMap?</h3>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Understand New Codebases</strong> - Quickly grasp the architecture of unfamiliar projects</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Clean Up Dead Code</strong> - Find and remove orphan files that are no longer used</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Visualize Dependencies</strong> - See how files connect and depend on each other</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Identify Architecture Issues</strong> - Spot circular dependencies and tightly coupled modules</span>
            </li>
          </ul>
        </Section>

        {/* Quick Start */}
        <Section id="quick-start" title="Quick Start">
          <p className="text-slate-600 mb-6">
            Getting started with RepoMap takes less than 30 seconds. Follow these simple steps:
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 font-bold text-violet-600">1</div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Copy Repository URL</h4>
                <p className="text-slate-600 text-sm">Navigate to any public GitHub repository and copy its URL from the address bar.</p>
                <CodeBlock code="https://github.com/pmndrs/zustand" language="url" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 font-bold text-violet-600">2</div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Paste and Analyze</h4>
                <p className="text-slate-600 text-sm">Paste the URL into RepoMap's search bar and click "Analyze". The tool will fetch and analyze all JavaScript/TypeScript files.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 font-bold text-violet-600">3</div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Explore Results</h4>
                <p className="text-slate-600 text-sm">View the interactive dependency graph, check orphan files, and explore the codebase structure.</p>
              </div>
            </div>
          </div>

          <Callout type="info" title="GitHub API Rate Limits">
            Without authentication, you're limited to 60 requests/hour. Add your GitHub token in Settings to get 5,000 requests/hour.
          </Callout>
        </Section>

        {/* Features */}
        <Section id="features" title="Features">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <div className="h-12 w-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                <Network className="h-6 w-6 text-violet-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Interactive Dependency Graph</h4>
              <p className="text-slate-600 text-sm mb-4">
                Visualize your codebase as an interactive graph with full-screen mode, zoom, pan, and intelligent ELK layout algorithm for clean organization.
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-violet-500" />Full-screen immersive mode</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-violet-500" />Click nodes to see file details</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-violet-500" />Color-coded by file status</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                <FileWarning className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Orphan File Detection</h4>
              <p className="text-slate-600 text-sm mb-4">
                Automatically identify files that exist in your codebase but are never imported by any other file - potential dead code candidates.
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-red-500" />Smart detection avoiding false positives</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-red-500" />Excludes config and test files</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-red-500" />Status reasons for transparency</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Entry Point Detection</h4>
              <p className="text-slate-600 text-sm mb-4">
                Automatically identifies application entry points like main.tsx, index.ts, and other common patterns across various project structures.
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-emerald-500" />Works with monorepos</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-emerald-500" />Supports client/server structures</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-emerald-500" />Detects CLI and bin scripts</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Path Alias Resolution</h4>
              <p className="text-slate-600 text-sm mb-4">
                Understands common path alias patterns like @/, ~/, and #/ used in modern frameworks like Vite, Next.js, and create-react-app.
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-blue-500" />Automatic src folder detection</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-blue-500" />Works with nested structures</li>
                <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-blue-500" />No configuration needed</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* How It Works */}
        <Section id="how-it-works" title="How It Works">
          <p className="text-slate-600 mb-6">
            RepoMap uses a multi-step process to analyze repositories and build the dependency graph:
          </p>

          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            
            <div className="space-y-8">
              <div className="relative flex gap-3 sm:gap-6">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0 text-white font-bold text-xs sm:text-sm z-10">1</div>
                <div className="pb-8 min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">Repository Fetch</h4>
                  <p className="text-slate-600 text-sm">
                    Using the GitHub API, we fetch the repository's file tree and retrieve content for all supported JavaScript/TypeScript files. We skip common non-essential directories like node_modules, dist, and build.
                  </p>
                  <CodeBlock code={`// Supported extensions
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];

// Skipped directories
const SKIP = ['node_modules', 'dist', 'build', '.git', 'coverage'];`} />
                </div>
              </div>

              <div className="relative flex gap-3 sm:gap-6">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0 text-white font-bold text-xs sm:text-sm z-10">2</div>
                <div className="pb-8 min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">Import Extraction</h4>
                  <p className="text-slate-600 text-sm">
                    Each file is parsed to extract import statements. We support ES6 imports, CommonJS require, dynamic imports, and re-exports.
                  </p>
                  <CodeBlock code={`// All supported import patterns
import X from './module';           // ES6 default
import { X } from './module';       // ES6 named
import * as X from './module';      // ES6 namespace
import './module';                  // Side-effect
import('./module');                 // Dynamic
require('./module');                // CommonJS
export { X } from './module';       // Re-export`} />
                </div>
              </div>

              <div className="relative flex gap-3 sm:gap-6">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0 text-white font-bold text-xs sm:text-sm z-10">3</div>
                <div className="pb-8 min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">Path Resolution</h4>
                  <p className="text-slate-600 text-sm">
                    Import paths are resolved to actual file paths. This includes handling relative paths, path aliases (@/), extension inference, and index file resolution.
                  </p>
                  <CodeBlock code={`// Resolution examples
'./utils'        → './utils.ts' or './utils/index.ts'
'@/components/X' → 'src/components/X.tsx'
'../foo.js'      → '../foo.ts' (TypeScript ESM)`} />
                </div>
              </div>

              <div className="relative flex gap-3 sm:gap-6">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0 text-white font-bold text-xs sm:text-sm z-10">4</div>
                <div className="pb-8 min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">Graph Construction</h4>
                  <p className="text-slate-600 text-sm">
                    A directed graph is built where nodes are files and edges are import relationships. Each node is classified as an entry point, regular file, or orphan based on analysis rules.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-3 sm:gap-6">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0 text-white font-bold text-xs sm:text-sm z-10">5</div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">Visualization</h4>
                  <p className="text-slate-600 text-sm">
                    The graph is rendered using React Flow with ELK layout algorithm for automatic node positioning. The result is an interactive, zoomable visualization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Dependency Analysis */}
        <Section id="dependency-analysis" title="Dependency Analysis">
          <p className="text-slate-600 mb-6">
            The dependency analyzer builds a complete map of import/export relationships in your codebase.
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">What Gets Tracked</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 border-b">Metric</th>
                  <th className="text-left p-3 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b font-medium">imports</td>
                  <td className="p-3 border-b text-slate-600">List of files this file imports from</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">importedBy</td>
                  <td className="p-3 border-b text-slate-600">List of files that import this file</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">isOrphan</td>
                  <td className="p-3 border-b text-slate-600">Whether this file is a potential orphan</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">isEntryPoint</td>
                  <td className="p-3 border-b text-slate-600">Whether this file is an entry point</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">statusReason</td>
                  <td className="p-3 text-slate-600">Explanation for the file's classification</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="success" title="Bidirectional Tracking">
            For every import relationship A → B, we track both that A imports B AND that B is imported by A. This enables complete dependency analysis in both directions.
          </Callout>
        </Section>

        {/* Orphan Detection */}
        <Section id="orphan-detection" title="Orphan Detection">
          <p className="text-slate-600 mb-6">
            Orphan files are files that exist in your codebase but are never imported by any other file. They're potential dead code candidates that may be safe to remove.
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Detection Rules</h3>
          <p className="text-slate-600 mb-4">A file is considered an orphan if:</p>
          <ul className="space-y-2 text-slate-600 mb-6">
            <li className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              No other file imports it
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              It's not an entry point
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              It's not a config, test, or special file
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Files Excluded from Orphan Detection</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Entry Points
              </h4>
              <p className="text-sm text-slate-600">main.tsx, index.ts, app.ts inside src folders</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Config Files
              </h4>
              <p className="text-sm text-slate-600">*.config.js, .eslintrc, tsconfig.json, etc.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Test Files
              </h4>
              <p className="text-sm text-slate-600">*.test.ts, *.spec.ts, __tests__/* files</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Type Definitions
              </h4>
              <p className="text-sm text-slate-600">*.d.ts files, types/ directories</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Storybook Files
              </h4>
              <p className="text-sm text-slate-600">*.stories.tsx, .storybook/ files</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Static Assets
              </h4>
              <p className="text-sm text-slate-600">Files in public/, static/, assets/ folders</p>
            </div>
          </div>
        </Section>

        {/* Entry Points */}
        <Section id="entry-points" title="Entry Points">
          <p className="text-slate-600 mb-6">
            Entry points are files that serve as the starting point of your application. They're typically referenced by HTML files, build tools, or executed directly rather than imported by other files.
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Detection Patterns</h3>
          <CodeBlock code={`// Files matching these patterns are entry points

// Main files in src folders (any nesting level)
*/src/main.ts(x)      // client/src/main.tsx, packages/app/src/main.ts

// Index files directly in src (not nested)
*/src/index.ts(x)     // server/src/index.ts

// Root level entry points
main.ts               // At repository root
index.js              // At repository root

// CLI and bin scripts
*/bin/*               // Any file in bin folders
*/cli.ts              // CLI entry points`} />

          <Callout type="info" title="Why Entry Points Matter">
            Entry points are never marked as orphans because they're meant to be the "roots" of your dependency tree. Everything else should trace back to an entry point to be considered properly connected.
          </Callout>
        </Section>

        {/* Supported Files */}
        <Section id="supported-files" title="Supported Files">
          <p className="text-slate-600 mb-6">
            RepoMap focuses on JavaScript and TypeScript ecosystems. Here's what gets analyzed:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Supported Extensions</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'].map((ext) => (
              <Badge key={ext} variant="outline" className="text-sm px-3 py-1 font-mono">
                {ext}
              </Badge>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Skipped Directories</h3>
          <p className="text-slate-600 mb-4">These directories are automatically excluded from analysis:</p>
          <div className="flex flex-wrap gap-2">
            {['node_modules', 'dist', 'build', '.git', 'coverage', 'vendor', '__pycache__', '.next', '.nuxt', 'out'].map((dir) => (
              <Badge key={dir} variant="secondary" className="text-sm px-3 py-1 font-mono">
                {dir}/
              </Badge>
            ))}
          </div>
        </Section>

        {/* Import Resolution */}
        <Section id="import-resolution" title="Import Resolution">
          <p className="text-slate-600 mb-6">
            RepoMap resolves import paths to actual files using multiple strategies:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Resolution Strategies</h3>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">1. Exact Match</h4>
              <p className="text-sm text-slate-600 mb-2">If the import path matches a file exactly, use it.</p>
              <CodeBlock code={`import './utils.ts'  →  ./utils.ts`} />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">2. TypeScript ESM (.js → .ts)</h4>
              <p className="text-sm text-slate-600 mb-2">For TypeScript ESM projects that use .js extensions in imports:</p>
              <CodeBlock code={`import './utils.js'  →  ./utils.ts
import './component.jsx'  →  ./component.tsx`} />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">3. Extension Inference</h4>
              <p className="text-sm text-slate-600 mb-2">If no extension, try common JS/TS extensions:</p>
              <CodeBlock code={`import './utils'  →  ./utils.ts, ./utils.tsx, ./utils.js, ./utils.jsx`} />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">4. Index Resolution</h4>
              <p className="text-sm text-slate-600 mb-2">If path is a directory, look for index file:</p>
              <CodeBlock code={`import './components'  →  ./components/index.ts`} />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">5. Path Alias Resolution</h4>
              <p className="text-sm text-slate-600 mb-2">Handles @/, ~/, #/ aliases by finding the src folder:</p>
              <CodeBlock code={`// File: client/src/pages/Home.tsx
import '@/components/Button'  →  client/src/components/Button.tsx

// File: packages/web/src/App.tsx
import '@/utils'  →  packages/web/src/utils/index.ts`} />
            </div>
          </div>
        </Section>

        {/* Config Files */}
        <Section id="config-files" title="Config Files">
          <p className="text-slate-600 mb-6">
            Configuration files are loaded by build tools and frameworks, not imported directly. RepoMap recognizes them to avoid false orphan positives.
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Generic Patterns</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 border-b">Pattern</th>
                  <th className="text-left p-3 border-b">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b font-mono text-violet-600">*.config.*</td>
                  <td className="p-3 border-b text-slate-600">vite.config.ts, postcss.config.cjs, jest.config.mjs</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-mono text-violet-600">.*rc / .*rc.*</td>
                  <td className="p-3 border-b text-slate-600">.eslintrc, .prettierrc.json, .babelrc.cjs</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-mono text-violet-600">[tj]sconfig*.json</td>
                  <td className="p-3 border-b text-slate-600">tsconfig.json, jsconfig.json, tsconfig.build.json</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-mono text-violet-600">.env*</td>
                  <td className="p-3 border-b text-slate-600">.env, .env.local, .env.production</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-violet-600">Dotfiles</td>
                  <td className="p-3 text-slate-600">.gitignore, .npmrc, .nvmrc, .dockerignore</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="success" title="Future-Proof Design">
            By using generic patterns like *.config.*, new tools and frameworks are automatically supported without code changes.
          </Callout>
        </Section>

        {/* Special Cases */}
        <Section id="special-cases" title="Special Cases">
          <p className="text-slate-600 mb-6">
            Several file types receive special handling to avoid false positives:
          </p>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-700">Test Files</Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">Files matching test patterns are run by test frameworks, not imported:</p>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">*.test.ts, *.spec.ts, __tests__/*, test/*, tests/*</code>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-100 text-purple-700">Type Definitions</Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">TypeScript declaration files are used by the compiler:</p>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">*.d.ts, types/*, @types/*</code>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-pink-100 text-pink-700">Storybook</Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">Story files are loaded by Storybook's dev server:</p>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">*.stories.tsx, .storybook/*</code>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-100 text-amber-700">Workers</Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">Web workers and service workers are loaded at runtime:</p>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">*worker.ts, sw.ts, service-worker.ts</code>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-100 text-emerald-700">Static Assets</Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">Files in static directories are served via HTML:</p>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">public/*, static/*, assets/*</code>
            </div>
          </div>
        </Section>

        {/* Architecture */}
        <Section id="architecture" title="Architecture">
          <p className="text-slate-600 mb-6">
            RepoMap consists of a React frontend and Node.js/Express backend:
          </p>

          <CodeBlock code={`RepoMap/
├── client/                 # React Frontend (Vite)
│   └── src/
│       ├── components/     # UI Components
│       ├── services/       # API Client
│       ├── lib/            # Utilities
│       └── types/          # TypeScript Types
│
└── server/                 # Express Backend
    └── src/
        ├── routes/         # API Routes
        │   └── analyze.ts  # POST /api/analyze
        └── services/
            ├── github.ts       # GitHub API Client
            ├── analyzer.ts     # Dependency Analyzer
            └── graphBuilder.ts # Graph Construction`} language="text" />

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Data Flow</h3>
          <div className="bg-slate-50 rounded-lg p-6 my-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-white rounded border">User Input</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="px-3 py-1 bg-violet-100 rounded border border-violet-200">GitHub API</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="px-3 py-1 bg-violet-100 rounded border border-violet-200">Analyzer</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="px-3 py-1 bg-violet-100 rounded border border-violet-200">Graph Builder</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="px-3 py-1 bg-white rounded border">React Flow</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Key Technologies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'React 19', desc: 'UI Framework' },
              { name: 'TypeScript', desc: 'Type Safety' },
              { name: 'Vite', desc: 'Build Tool' },
              { name: 'Tailwind', desc: 'Styling' },
              { name: 'React Flow', desc: 'Graph Viz' },
              { name: 'ELK', desc: 'Layout Algorithm' },
              { name: 'Express', desc: 'API Server' },
              { name: 'Octokit', desc: 'GitHub Client' },
            ].map((tech) => (
              <div key={tech.name} className="text-center p-3 border rounded-lg">
                <div className="font-semibold text-slate-900">{tech.name}</div>
                <div className="text-xs text-slate-500">{tech.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* API Reference */}
        <Section id="api-reference" title="API Reference">
          <p className="text-slate-600 mb-6">
            The backend exposes a single endpoint for repository analysis:
          </p>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-slate-800 text-white p-4 flex items-center gap-3">
              <Badge className="bg-emerald-500">POST</Badge>
              <code className="font-mono">/api/analyze</code>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Request Body</h4>
              <CodeBlock code={`{
  "repoUrl": "https://github.com/owner/repo",
  "token": "ghp_xxxx"  // Optional: GitHub personal access token
}`} language="json" />

              <h4 className="font-semibold text-slate-900 mb-2 mt-6">Response</h4>
              <CodeBlock code={`{
  "repoInfo": {
    "owner": "facebook",
    "repo": "react"
  },
  "totalFiles": 150,
  "analyzedFiles": 150,
  "dependencies": [
    {
      "path": "src/index.ts",
      "imports": ["src/utils.ts", "src/types.ts"],
      "importedBy": [],
      "isOrphan": false,
      "isEntryPoint": true,
      "statusReason": "Entry point (main/index file)"
    }
    // ... more files
  ],
  "orphanFiles": ["src/unused.ts"],
  "entryPoints": ["src/index.ts", "src/main.tsx"],
  "nodes": [ /* React Flow nodes */ ],
  "edges": [ /* React Flow edges */ ],
  "rateLimit": {
    "limit": 5000,
    "remaining": 4990,
    "reset": "2024-01-01T00:00:00Z"
  }
}`} language="json" />
            </div>
          </div>
        </Section>

        {/* Limitations */}
        <Section id="limitations" title="Limitations">
          <p className="text-slate-600 mb-6">
            While RepoMap handles most common cases, there are some known limitations:
          </p>

          <div className="space-y-4">
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Dynamic Imports with Variables</h4>
              <p className="text-sm text-amber-700">
                Imports using variables cannot be statically analyzed:
              </p>
              <CodeBlock code={`const module = await import(\`./\${moduleName}\`); // Not detected`} />
            </div>

            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Non-Standard Path Aliases</h4>
              <p className="text-sm text-amber-700">
                Custom path aliases beyond @/, ~/, #/ require manual configuration (not yet supported).
              </p>
            </div>

            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Private Repositories</h4>
              <p className="text-sm text-amber-700">
                Private repos require a GitHub token with appropriate permissions.
              </p>
            </div>

            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Large Repositories</h4>
              <p className="text-sm text-amber-700 mb-2">
                Very large repos (500+ files) may hit API rate limits or timeout. Try smaller repos like:
              </p>
              <code className="text-xs bg-amber-100 px-2 py-1 rounded block">
                pmndrs/zustand, pacocoursey/cmdk, lukeed/clsx, ai/nanoid
              </code>
            </div>

            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Other Languages</h4>
              <p className="text-sm text-amber-700">
                Currently only JavaScript/TypeScript are supported. Python, Go, Rust, etc. are not analyzed.
              </p>
            </div>
          </div>

          <Callout type="info" title="Help Us Improve">
            Found an edge case we don't handle? Open an issue on GitHub and we'll look into adding support for it!
          </Callout>
        </Section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-center text-slate-500 text-sm">
          <p>Built with ❤️ for developers who love clean code</p>
          <p className="mt-2">
            <a href="https://github.com/Abhilash-03/RepoMap" className="text-violet-600 hover:underline">
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default DocsContent;
