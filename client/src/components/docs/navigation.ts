import {
  BookOpen,
  Zap,
  Layers,
  Workflow,
  Network,
  FileWarning,
  GitBranch,
  FileCode,
  FolderTree,
  Settings,
  Shield,
  Code2,
  Terminal,
  AlertTriangle,
  Boxes,
} from 'lucide-react';

export const navigation = [
  {
    title: 'Getting Started',
    items: [
      { id: 'introduction', label: 'Introduction', icon: BookOpen },
      { id: 'quick-start', label: 'Quick Start', icon: Zap },
      { id: 'features', label: 'Features', icon: Layers },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { id: 'how-it-works', label: 'How It Works', icon: Workflow },
      { id: 'dependency-analysis', label: 'Dependency Analysis', icon: Network },
      { id: 'orphan-detection', label: 'Orphan Detection', icon: FileWarning },
      { id: 'entry-points', label: 'Entry Points', icon: GitBranch },
    ],
  },
  {
    title: 'File Detection',
    items: [
      { id: 'supported-frameworks', label: 'Supported Frameworks', icon: Boxes },
      { id: 'supported-files', label: 'Supported Files', icon: FileCode },
      { id: 'import-resolution', label: 'Import Resolution', icon: FolderTree },
      { id: 'config-files', label: 'Config Files', icon: Settings },
      { id: 'special-cases', label: 'Special Cases', icon: Shield },
    ],
  },
  {
    title: 'Technical Details',
    items: [
      { id: 'architecture', label: 'Architecture', icon: Code2 },
      { id: 'api-reference', label: 'API Reference', icon: Terminal },
      { id: 'limitations', label: 'Limitations', icon: AlertTriangle },
    ],
  },
];

export type NavigationItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};
