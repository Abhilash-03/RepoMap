import { RepoFile, FileDependency, ImportInfo } from '../types/index.js';
import path from 'path';

export class DependencyAnalyzer {
  // Common entry point patterns - files that are typically referenced externally
  private readonly ENTRY_PATTERNS = [
    // main.tsx/ts anywhere in a src folder (client/src/main.tsx, packages/app/src/main.ts, etc.)
    /(^|\/)src\/main\.(js|jsx|ts|tsx|mjs)$/i,
    // index files directly inside src folders (entry points, not nested index files)
    /(^|\/)src\/index\.(js|jsx|ts|tsx|mjs)$/i,
    // Root level entry points (main.ts, index.js at repo root)
    /^(main|index)\.(js|jsx|ts|tsx|mjs)$/i,
    // CLI/bin entry points
    /(^|\/)bin\//i,
    /(^|\/)cli\.(js|ts|mjs)$/i,
    
    // Next.js entry points
    // App Router: root layout is the entry point
    /(^|\/)app\/layout\.(js|jsx|ts|tsx)$/i,
    // Pages Router: _app is the entry point
    /(^|\/)pages\/_app\.(js|jsx|ts|tsx)$/i,
    // Home page as entry
    /(^|\/)app\/page\.(js|jsx|ts|tsx)$/i,
    /(^|\/)pages\/index\.(js|jsx|ts|tsx)$/i,
    
    // Nuxt.js entry points
    /(^|\/)app\.vue$/i,
    /(^|\/)pages\/index\.vue$/i,
    
    // Remix entry points
    /(^|\/)app\/root\.(js|jsx|ts|tsx)$/i,
    
    // SvelteKit entry points
    /(^|\/)src\/routes\/\+layout\.svelte$/i,
    
    // Astro entry points
    /(^|\/)src\/pages\/index\.(astro|md|mdx)$/i,
  ];

  // Next.js specific patterns (App Router and Pages Router)
  private readonly NEXTJS_PATTERNS = [
    // App Router (Next.js 13+) - handles both with and without leading slash
    // Nested routes: app/*/page.js, app/account-details/page.js, etc.
    /(^|\/)app\/.*\/(page|layout|loading|error|not-found|template|default)\.(js|jsx|ts|tsx)$/i,
    // Root app page: app/page.js
    /(^|\/)app\/(page|layout|loading|error|not-found|template|default)\.(js|jsx|ts|tsx)$/i,
    // API routes in app router: app/api/*/route.js, app/[...slug]/route.js (also support routes.js typo)
    /(^|\/)app\/.*\/routes?\.(js|ts)$/i,
    /(^|\/)app\/routes?\.(js|ts)$/i,
    // Pages Router (legacy)
    /(^|\/)pages\/.*\.(js|jsx|ts|tsx)$/i,  // All files in pages are routes
    /(^|\/)pages\/api\/.*\.(js|ts)$/i,     // API routes
    // Special Next.js files
    /(^|\/)(middleware|instrumentation)\.(js|ts)$/i,
    /(^|\/)_app\.(js|jsx|ts|tsx)$/i,
    /(^|\/)_document\.(js|jsx|ts|tsx)$/i,
    /(^|\/)_error\.(js|jsx|ts|tsx)$/i,
    // next.config
    /(^|\/)next\.config\.(js|mjs|ts)$/i,
  ];

  // Nuxt.js specific patterns
  private readonly NUXTJS_PATTERNS = [
    /(^|\/)pages\/.*\.vue$/i,
    /(^|\/)layouts\/.*\.vue$/i,
    /(^|\/)middleware\/.*\.(js|ts)$/i,
    /(^|\/)plugins\/.*\.(js|ts)$/i,
    /(^|\/)server\/(api|routes|middleware)\/.*\.(js|ts)$/i,
    /(^|\/)nuxt\.config\.(js|ts)$/i,
  ];

  // Remix specific patterns
  private readonly REMIX_PATTERNS = [
    /(^|\/)app\/routes\/.*\.(js|jsx|ts|tsx)$/i,
    /(^|\/)app\/root\.(js|jsx|ts|tsx)$/i,
    /(^|\/)app\/entry\.(client|server)\.(js|jsx|ts|tsx)$/i,
  ];

  // SvelteKit specific patterns
  private readonly SVELTEKIT_PATTERNS = [
    /(^|\/)src\/routes\/.*\+page\.svelte$/i,
    /(^|\/)src\/routes\/.*\+layout\.svelte$/i,
    /(^|\/)src\/routes\/.*\+server\.(js|ts)$/i,
    /(^|\/)src\/routes\/.*\+page\.(js|ts)$/i,
    /(^|\/)svelte\.config\.(js|ts)$/i,
  ];

  // Astro specific patterns
  private readonly ASTRO_PATTERNS = [
    /(^|\/)src\/pages\/.*\.(astro|md|mdx)$/i,
    /(^|\/)src\/layouts\/.*\.astro$/i,
    /(^|\/)astro\.config\.(js|ts|mjs)$/i,
  ];

  // Directories where files are typically served directly (not imported)
  private readonly STATIC_DIRS = [
    'public',
    'static',
    'assets',
    'dist',
    'build',
    'www',
    'web',
  ];

  // Analyze all files and build dependency map
  analyze(files: RepoFile[]): FileDependency[] {
    const filePaths = new Set(files.map(f => f.path));
    const dependencyMap = new Map<string, FileDependency>();

    // Initialize dependency entries for all files
    for (const file of files) {
      dependencyMap.set(file.path, {
        path: file.path,
        imports: [],
        importedBy: [],
        isOrphan: false,
        isEntryPoint: this.isEntryPoint(file.path),
      });
    }

    // Parse imports from each file
    for (const file of files) {
      const imports = this.extractImports(file.content, file.path);
      const dep = dependencyMap.get(file.path)!;

      for (const imp of imports) {
        const resolved = this.resolveImport(imp.source, file.path, filePaths);
        if (resolved) {
          dep.imports.push(resolved);
          
          // Update the importedBy for the resolved file
          const targetDep = dependencyMap.get(resolved);
          if (targetDep) {
            targetDep.importedBy.push(file.path);
          }
        }
      }
    }

    // Determine orphan status with smarter detection and explanation
    for (const dep of dependencyMap.values()) {
      const status = this.getOrphanStatus(dep);
      dep.isOrphan = status.isOrphan;
      dep.statusReason = status.reason;
    }

    return Array.from(dependencyMap.values());
  }

  // Smart orphan detection with reason - returns status and explanation
  private getOrphanStatus(dep: FileDependency): { isOrphan: boolean; reason: string } {
    // If it's imported by other files, NOT orphan
    if (dep.importedBy.length > 0) {
      return { isOrphan: false, reason: `Imported by ${dep.importedBy.length} file(s)` };
    }

    // If it imports other local files, it's part of the dependency graph, NOT orphan
    // This handles cases where a file might be imported via unresolved alias
    if (dep.imports.length > 0) {
      return { isOrphan: false, reason: `Connected: imports ${dep.imports.length} file(s)` };
    }

    // If it's an entry point, NOT orphan
    if (dep.isEntryPoint) {
      return { isOrphan: false, reason: 'Entry point (main/index file)' };
    }

    // If it's in a static/public directory (served via HTML), NOT orphan
    if (this.isInStaticDirectory(dep.path)) {
      return { isOrphan: false, reason: 'Static asset (served via HTML, not imports)' };
    }

    // If it's a test file, NOT orphan (tests are run separately)
    if (this.isTestFile(dep.path)) {
      return { isOrphan: false, reason: 'Test file (run by test framework)' };
    }

    // If it's a config file, NOT orphan
    if (this.isConfigFile(dep.path)) {
      return { isOrphan: false, reason: 'Config file (loaded by bundler/tooling)' };
    }

    // If it's a script/worker file, NOT orphan
    if (this.isScriptOrWorker(dep.path)) {
      return { isOrphan: false, reason: 'Worker/Script (loaded at runtime)' };
    }

    // If it's in the root directory (likely an entry point), NOT orphan
    if (this.isRootFile(dep.path)) {
      return { isOrphan: false, reason: 'Root-level file (likely external entry point)' };
    }

    // If it's a type definition file, NOT orphan
    if (this.isTypeDefinition(dep.path)) {
      return { isOrphan: false, reason: 'Type definition (used by TypeScript compiler)' };
    }

    // If it's a stories/storybook file, NOT orphan
    if (this.isStorybookFile(dep.path)) {
      return { isOrphan: false, reason: 'Storybook story (loaded by Storybook)' };
    }

    // If it's a framework-specific file (Next.js, Nuxt, Remix, etc.), NOT orphan
    const frameworkInfo = this.isFrameworkFile(dep.path);
    if (frameworkInfo) {
      return { isOrphan: false, reason: frameworkInfo };
    }

    // If it's a migration/seed file, NOT orphan
    if (this.isMigrationOrSeedFile(dep.path)) {
      return { isOrphan: false, reason: 'Migration/Seed file (run by ORM/CLI)' };
    }

    // If it's a serverless function, NOT orphan
    if (this.isServerlessFunction(dep.path)) {
      return { isOrphan: false, reason: 'Serverless function (loaded by platform)' };
    }

    // If it's in a scripts directory, NOT orphan
    if (this.isScriptFile(dep.path)) {
      return { isOrphan: false, reason: 'Script file (run via npm/CLI)' };
    }

    // If it's a database model/schema file, NOT orphan
    if (this.isDatabaseFile(dep.path)) {
      return { isOrphan: false, reason: 'Database model/schema (used by ORM)' };
    }

    // If it's a constants/config export file, NOT orphan
    if (this.isConstantsFile(dep.path)) {
      return { isOrphan: false, reason: 'Constants/config file (may be imported dynamically)' };
    }

    // Otherwise, it's likely a true orphan - completely disconnected
    return { 
      isOrphan: true, 
      reason: 'Orphan: no imports and not imported by any file'
    };
  }

  // Check if file is a migration or seed file
  private isMigrationOrSeedFile(filePath: string): boolean {
    const patterns = [
      /(^|\/)migrations?\//i,
      /(^|\/)seeds?\//i,
      /(^|\/)seeders?\//i,
      /(^|\/)fixtures?\//i,
      /\d{4,}_.*\.(js|ts)$/i,  // Timestamped migrations like 20240101_init.ts
      /migrate\.(js|ts)$/i,
    ];
    return patterns.some(pattern => pattern.test(filePath));
  }

  // Check if file is a serverless function
  private isServerlessFunction(filePath: string): boolean {
    const patterns = [
      // Vercel serverless functions (api folder at root, not in src)
      /^api\/.*\.(js|ts)$/i,
      // Vercel/generic functions folder
      /(^|\/)functions\/.*\.(js|ts)$/i,
      // Netlify functions
      /(^|\/)netlify\/functions\//i,
      // AWS Lambda
      /(^|\/)lambda\//i,
      // Edge functions
      /(^|\/)edge-functions?\//i,
      // Supabase functions
      /(^|\/)supabase\/functions\//i,
      // Firebase functions
      /(^|\/)firebase\/functions\//i,
    ];
    return patterns.some(pattern => pattern.test(filePath));
  }

  // Check if file is in scripts directory
  private isScriptFile(filePath: string): boolean {
    const patterns = [
      /(^|\/)scripts?\//i,
      /(^|\/)tools?\//i,
      /(^|\/)tasks?\//i,
      /(^|\/)build\//i,
      /scripts?\.(js|ts|mjs)$/i,
    ];
    return patterns.some(pattern => pattern.test(filePath));
  }

  // Check if file is a database schema/ORM file (loaded by ORM tools, not imports)
  private isDatabaseFile(filePath: string): boolean {
    const patterns = [
      // Prisma schema and migrations
      /(^|\/)prisma\//i,
      // Sequelize migrations/seeders
      /(^|\/)sequelize\//i,
      // TypeORM migrations
      /(^|\/)typeorm\//i,
      // Knex migrations
      /(^|\/)knex\//i,
      // Drizzle schema
      /\.schema\.(js|ts)$/i,
      // Entity files for TypeORM
      /\.entity\.(js|ts)$/i,
    ];
    return patterns.some(pattern => pattern.test(filePath));
  }

  // Check if file is an environment/config bootstrap file
  private isConstantsFile(filePath: string): boolean {
    const patterns = [
      // Environment setup files
      /(^|\/)env\.(js|ts)$/i,
      /env\.local\.(js|ts)$/i,
      /environment\.(js|ts)$/i,
      // i18n/locale files (loaded by i18n libraries)
      /(^|\/)locales?\//i,
      /(^|\/)i18n\//i,
      /(^|\/)translations?\//i,
      // Theme files
      /(^|\/)theme\.(js|ts)$/i,
      /(^|\/)themes?\//i,
    ];
    return patterns.some(pattern => pattern.test(filePath));
  }

  // Check if file is in a static/public directory
  private isInStaticDirectory(filePath: string): boolean {
    const normalizedPath = filePath.toLowerCase();
    return this.STATIC_DIRS.some(dir => 
      normalizedPath.startsWith(`${dir}/`) || 
      normalizedPath.includes(`/${dir}/`)
    );
  }

  // Check if file is in root directory (no subdirectories)
  private isRootFile(filePath: string): boolean {
    return !filePath.includes('/');
  }

  // Check if file is a web worker or service worker
  private isScriptOrWorker(filePath: string): boolean {
    const patterns = [
      /\.worker\.(js|ts|mjs)$/i,
      /worker\.(js|ts|mjs)$/i,
      /sw\.(js|ts|mjs)$/i,
      /service-worker\.(js|ts|mjs)$/i,
      /serviceWorker\.(js|ts|mjs)$/i,
      /worklet\.(js|ts|mjs)$/i,
      /(^|\/)workers?\//i,
      /loader\.(js|ts|mjs)$/i,
      /bootstrap\.(js|ts|mjs)$/i,
      /polyfill/i,
      /shim/i,
    ];
    return patterns.some(pattern => pattern.test(filePath));
  }

  // Check if file is a type definition
  private isTypeDefinition(filePath: string): boolean {
    return /\.d\.(ts|tsx)$/.test(filePath) || 
           filePath.includes('/types/') ||
           filePath.includes('/@types/');
  }

  // Check if file is a Storybook story
  private isStorybookFile(filePath: string): boolean {
    return /\.stories\.(js|jsx|ts|tsx)$/.test(filePath) ||
           filePath.includes('/.storybook/');
  }

  // Check if file is a framework-specific file (returns reason or null)
  private isFrameworkFile(filePath: string): string | null {
    // Next.js
    if (this.NEXTJS_PATTERNS.some(pattern => pattern.test(filePath))) {
      // API routes: app/*/route.js (or routes.js) or pages/api/*
      if (/(^|\/)app\/.*\/routes?\.(js|ts)$/i.test(filePath) || /(^|\/)pages\/api\//i.test(filePath)) {
        return 'Next.js API route (loaded by framework)';
      }
      // App Router files: page.js, layout.js, etc.
      if (/(page|layout|loading|error|not-found|template|default)\.(js|jsx|ts|tsx)$/i.test(filePath)) {
        return 'Next.js App Router file (loaded by framework)';
      }
      // Pages Router: pages/*.js
      if (/(^|\/)pages\/.*\.(js|jsx|ts|tsx)$/i.test(filePath)) {
        return 'Next.js page (loaded by framework router)';
      }
      // Middleware
      if (/(^|\/)(middleware|instrumentation)\.(js|ts)$/i.test(filePath)) {
        return 'Next.js middleware (loaded by framework)';
      }
      // Special files
      if (/(^|\/)(_app|_document|_error)\.(js|jsx|ts|tsx)$/i.test(filePath)) {
        return 'Next.js special file (loaded by framework)';
      }
      return 'Next.js framework file';
    }

    // Nuxt.js
    if (this.NUXTJS_PATTERNS.some(pattern => pattern.test(filePath))) {
      if (/(^|\/)server\/(api|routes)\//i.test(filePath)) {
        return 'Nuxt.js server route (loaded by framework)';
      }
      if (/(^|\/)pages\//i.test(filePath)) {
        return 'Nuxt.js page (loaded by framework router)';
      }
      return 'Nuxt.js framework file';
    }

    // Remix
    if (this.REMIX_PATTERNS.some(pattern => pattern.test(filePath))) {
      if (/(^|\/)app\/routes\//i.test(filePath)) {
        return 'Remix route (loaded by framework)';
      }
      return 'Remix framework file';
    }

    // SvelteKit
    if (this.SVELTEKIT_PATTERNS.some(pattern => pattern.test(filePath))) {
      if (/\+page\.svelte$/i.test(filePath)) {
        return 'SvelteKit page (loaded by framework)';
      }
      if (/\+server\.(js|ts)$/i.test(filePath)) {
        return 'SvelteKit API endpoint (loaded by framework)';
      }
      return 'SvelteKit framework file';
    }

    // Astro
    if (this.ASTRO_PATTERNS.some(pattern => pattern.test(filePath))) {
      if (/(^|\/)src\/pages\//i.test(filePath)) {
        return 'Astro page (loaded by framework)';
      }
      return 'Astro framework file';
    }

    return null;
  }

  // Extract all imports from file content
  private extractImports(content: string, filePath: string): ImportInfo[] {
    const imports: ImportInfo[] = [];

    // Remove comments to avoid false matches
    const cleanContent = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
      .replace(/\/\/.*$/gm, '');         // Single-line comments

    // ES6 import patterns - use [^;]* to avoid matching across statements
    const importPatterns = [
      // import X from 'module'
      // import { X } from 'module'
      // import * as X from 'module'
      // Handles multi-line imports by matching until 'from'
      /import\s+[^;]*?\s+from\s+['"]([^'"]+)['"]/g,
      
      // import 'module' (side-effect imports)
      /import\s+['"]([^'"]+)['"]/g,
      
      // Dynamic import()
      /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      
      // require('module')
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      
      // export { X } from 'module'
      /export\s+[^;]*?\s+from\s+['"]([^'"]+)['"]/g,
    ];

    for (const pattern of importPatterns) {
      let match;
      while ((match = pattern.exec(cleanContent)) !== null) {
        const source = match[1];
        // Track local imports (., /) and path aliases (@/, ~/, #/, @)
        // Also handle @components, @utils etc. without slash
        if (source.startsWith('.') || source.startsWith('/') || 
            source.startsWith('@/') || source.startsWith('~/') || source.startsWith('#/') ||
            /^@[a-zA-Z]/.test(source)) {
          imports.push({
            source,
            resolved: null,
            type: pattern.source.includes('require') ? 'require' : 
                  pattern.source.includes('import\\s*\\(') ? 'dynamic' : 'import',
          });
        }
      }
    }

    return imports;
  }

  // Resolve an import path to actual file path in repo
  private resolveImport(importSource: string, fromFile: string, allPaths: Set<string>): string | null {
    const fromDir = path.dirname(fromFile);
    let resolved: string;
    
    // Handle path aliases (@/, ~/, #/) - dynamically find the src folder
    if (importSource.startsWith('@/') || importSource.startsWith('~/') || importSource.startsWith('#/')) {
      // Find the src directory that contains the importing file
      // This handles: client/src/..., server/src/..., packages/app/src/..., or just src/...
      const srcFolder = this.findSrcFolder(fromFile, allPaths);
      if (srcFolder) {
        resolved = importSource.replace(/^[@~#]\//, srcFolder + '/');
      } else {
        // Fallback: try treating alias as relative to closest parent with src
        resolved = importSource.replace(/^[@~#]\//, 'src/');
      }
    } 
    // Handle aliases like @store, @components (without slash)
    else if (/^@[a-zA-Z]/.test(importSource)) {
      const srcFolder = this.findSrcFolder(fromFile, allPaths);
      // Convert @store/authStore to src/store/authStore
      const aliasPath = importSource.replace(/^@/, '');
      if (srcFolder) {
        resolved = srcFolder + '/' + aliasPath;
      } else {
        resolved = 'src/' + aliasPath;
      }
    }
    else {
      resolved = path.posix.join(fromDir, importSource);
    }
    
    // Normalize path separators
    resolved = resolved.replace(/\\/g, '/');
    
    // Remove leading ./
    if (resolved.startsWith('./')) {
      resolved = resolved.substring(2);
    }

    // Try exact match first
    if (allPaths.has(resolved)) {
      return resolved;
    }

    // Handle TypeScript ESM pattern: imports use .js but files are .ts
    // e.g., import from './foo.js' -> actual file is './foo.ts'
    if (resolved.endsWith('.js')) {
      const tsPath = resolved.replace(/\.js$/, '.ts');
      if (allPaths.has(tsPath)) {
        return tsPath;
      }
    }
    if (resolved.endsWith('.jsx')) {
      const tsxPath = resolved.replace(/\.jsx$/, '.tsx');
      if (allPaths.has(tsxPath)) {
        return tsxPath;
      }
    }

    // Try with various extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
    for (const ext of extensions) {
      if (allPaths.has(resolved + ext)) {
        return resolved + ext;
      }
    }

    // Try as directory with index file
    const indexNames = ['index.ts', 'index.tsx', 'index.js', 'index.jsx'];
    for (const indexName of indexNames) {
      const indexPath = path.posix.join(resolved, indexName);
      if (allPaths.has(indexPath)) {
        return indexPath;
      }
    }

    return null;
  }

  // Find the src folder that contains a file
  // Handles: client/src/..., server/src/..., packages/app/src/..., or just src/...
  private findSrcFolder(filePath: string, allPaths: Set<string>): string | null {
    const parts = filePath.split('/');
    
    // Walk backwards to find 'src' in the path
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i] === 'src') {
        // Return the path up to and including 'src'
        return parts.slice(0, i + 1).join('/');
      }
    }
    
    // If no src found in path, try to find a src folder at same level as the file's root
    // This handles monorepos where file might be at packages/foo/lib but src is at packages/foo/src
    for (let i = parts.length - 2; i >= 0; i--) {
      const potentialSrc = [...parts.slice(0, i + 1), 'src'].join('/');
      // Check if any file exists under this src folder
      for (const p of allPaths) {
        if (p.startsWith(potentialSrc + '/')) {
          return potentialSrc;
        }
      }
    }
    
    return null;
  }

  // Check if file is a likely entry point
  private isEntryPoint(filePath: string): boolean {
    return this.ENTRY_PATTERNS.some(pattern => pattern.test(filePath));
  }

  // Check if file is a test file
  private isTestFile(filePath: string): boolean {
    const testPatterns = [
      /\.test\.(js|jsx|ts|tsx)$/,
      /\.spec\.(js|jsx|ts|tsx)$/,
      /\/__tests__\//,
      /\/test\//,
      /\/tests\//,
    ];
    return testPatterns.some(pattern => pattern.test(filePath));
  }

  // Check if file is a config file
  private isConfigFile(filePath: string): boolean {
    const fileName = filePath.split('/').pop() || filePath;
    
    // Generic patterns that catch most config files
    const configPatterns = [
      // Any file with .config. in the name (vite.config.ts, postcss.config.cjs, etc.)
      /\.config\.(js|cjs|mjs|ts|json)$/i,
      // RC files (.eslintrc, .prettierrc, .babelrc, etc.)
      /\.[a-z]+rc(\.(js|cjs|mjs|ts|json|ya?ml))?$/i,
      // tsconfig, jsconfig files
      /[tj]sconfig(\.[a-z]+)?\.json$/i,
      // Environment files
      /\.env(\.[a-z]+)?$/i,
      // Lock files and manifests
      /package\.json$/,
      /package-lock\.json$/,
      /yarn\.lock$/,
      /pnpm-lock\.ya?ml$/,
      // Root dotfiles that are configs
      /^\.[a-z]/i,
    ];
    
    // Check patterns against full path and filename
    if (configPatterns.some(pattern => pattern.test(filePath) || pattern.test(fileName))) {
      return true;
    }
    
    // Common config file names (case-insensitive)
    const configNames = [
      'gulpfile', 'gruntfile', 'makefile', 'dockerfile',
      'manifest', 'vercel', 'netlify', 'railway',
    ];
    const lowerFileName = fileName.toLowerCase();
    if (configNames.some(name => lowerFileName.includes(name))) {
      return true;
    }
    
    return false;
  }
}
