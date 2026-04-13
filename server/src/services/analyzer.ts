import { RepoFile, FileDependency, ImportInfo } from '../types/index.js';
import path from 'path';

export class DependencyAnalyzer {
  // Common entry point patterns
  private readonly ENTRY_PATTERNS = [
    /^index\.(js|jsx|ts|tsx|mjs)$/,
    /^main\.(js|jsx|ts|tsx|mjs)$/,
    /^app\.(js|jsx|ts|tsx|mjs)$/,
    /^src\/index\.(js|jsx|ts|tsx|mjs)$/,
    /^src\/main\.(js|jsx|ts|tsx|mjs)$/,
    /^src\/App\.(js|jsx|ts|tsx|mjs)$/,
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

    // Determine orphan status
    for (const dep of dependencyMap.values()) {
      // A file is orphan if:
      // 1. It's not imported by any other file
      // 2. It's not an entry point
      // 3. It's not a test/spec file
      // 4. It's not a config file
      dep.isOrphan = dep.importedBy.length === 0 && 
                     !dep.isEntryPoint && 
                     !this.isTestFile(dep.path) &&
                     !this.isConfigFile(dep.path);
    }

    return Array.from(dependencyMap.values());
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
        // Only track local imports (starting with . or /)
        if (source.startsWith('.') || source.startsWith('/')) {
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
    let resolved = path.posix.join(fromDir, importSource);
    
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
    const configPatterns = [
      /\.config\.(js|ts|mjs)$/,
      /vite\.config/,
      /webpack\.config/,
      /jest\.config/,
      /eslint/,
      /prettier/,
      /babel\.config/,
      /tsconfig/,
      /tailwind\.config/,
    ];
    return configPatterns.some(pattern => pattern.test(filePath));
  }
}
