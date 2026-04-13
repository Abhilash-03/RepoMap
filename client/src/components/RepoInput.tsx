import { useState, FormEvent } from 'react';

interface RepoInputProps {
  onSubmit: (repoUrl: string) => void;
  isLoading: boolean;
}

export default function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          disabled={isLoading}
          className="flex-1 px-5 py-3 text-base border-2 border-slate-200 rounded-lg outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
        />
        <button 
          type="submit" 
          disabled={isLoading || !url.trim()}
          className="px-6 py-3 text-base font-semibold text-white bg-blue-500 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : (
            'Analyze Repository'
          )}
        </button>
      </div>
      <p className="text-center text-slate-500 text-sm mt-3">
        Enter a public GitHub repository URL to analyze its file dependencies
      </p>
    </form>
  );
}
