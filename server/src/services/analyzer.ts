import { RepoFile, FileDependency, ImportInfo } from '../types/index.js';
import path from 'path';

export class DependencyAnalyzer {
  // Common entry point patterns - files that are typically referenced externally
  private readonly ENTRY_PATTERNS = [
    // main.tsx/ts anywhere in a src folder (client/src/main.tsx, packages/app/src/main.ts, etc.)
    /\/src\/main\.(js|jsx|ts|tsx|mjs)$/i,
    // index files directly inside src folders (entry points, not nested index files)
    /\/src\/index\.(js|jsx|ts|tsx|mjs)$/i,
    // Root level entry points (main.ts, index.js at repo root)
    /^(main|index)\.(js|jsx|ts|tsx|mjs)$/i,
    // CLI/bin entry points
    /\/bin\//i,
    /\/cli\.(js|ts|mjs)$/i,
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

    // If it imports other files but nothing imports it
    const hasImports = dep.imports.length > 0;

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

    // Otherwise, it's likely a true orphan
    return { 
      isOrphan: true, 
      reason: hasImports 
        ? 'Orphan: imports files but nothing imports this file' 
        : 'Orphan: no imports and not imported by any file'
    };
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

  // Check if file is a script or worker
  private isScriptOrWorker(filePath: string): boolean {
    const patterns = [
      /worker\.(js|ts|mjs)$/i,
      /sw\.(js|ts|mjs)$/i,
      /service-worker\.(js|ts|mjs)$/i,
      /serviceWorker\.(js|ts|mjs)$/i,
      /script\.(js|ts|mjs)$/i,
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

  // Extract all imports from file content
  private extractImports(content: string, filePath: string): ImportInfo[] {
    const imports: ImportInfo[] = [];

    // ES6 import patterns
    const importPatterns = [
      // import X from 'module'
      // import { X } from 'module'
      // import * as X from 'module'
      /import\s+(?:(?:\*\s+as\s+\w+)|(?:{\s*[^}]+\s*})|(?:\w+))?\s*,?\s*(?:(?:\*\s+as\s+\w+)|(?:{\s*[^}]+\s*})|(?:\w+))?\s*from\s+['"]([^'"]+)['"]/g,
      
      // import 'module' (side-effect imports)
      /import\s+['"]([^'"]+)['"]/g,
      
      // Dynamic import()
      /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      
      // require('module')
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      
      // export { X } from 'module'
      /export\s+(?:\*|{[^}]*})\s+from\s+['"]([^'"]+)['"]/g,
    ];

    for (const pattern of importPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const source = match[1];
        // Track local imports (., /) and path aliases (@/, ~/, #/)
        if (source.startsWith('.') || source.startsWith('/') || source.startsWith('@/') || source.startsWith('~/') || source.startsWith('#/')) {
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
    } else {
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
