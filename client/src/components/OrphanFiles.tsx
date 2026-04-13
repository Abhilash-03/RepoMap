interface OrphanFilesProps {
  orphanFiles: string[];
  onFileClick?: (filePath: string) => void;
}

export default function OrphanFiles({ orphanFiles, onFileClick }: OrphanFilesProps) {
  if (orphanFiles.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">🎉 No Orphan Files</h3>
        <p className="text-green-600 bg-green-50 p-4 rounded-lg">All files in this repository are properly connected!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">⚠️ Orphan Files ({orphanFiles.length})</h3>
      <p className="text-slate-500 mb-6">
        These files exist but are never imported by any other file in the codebase.
      </p>
      <ul className="space-y-2">
        {orphanFiles.map((file) => (
          <li 
            key={file} 
            className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer transition-transform hover:translate-x-1 hover:shadow-sm"
            onClick={() => onFileClick?.(file)}
          >
            <span className="text-xl">📄</span>
            <span className="font-mono text-sm text-red-600">{file}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
