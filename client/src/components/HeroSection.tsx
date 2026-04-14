function HeroSection() {
  return (
    <div className="text-center mb-8 sm:mb-12 pt-4 sm:pt-8">
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-200/50 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
        </span>
        <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          Zero-setup dependency analysis
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 px-2">
        Visualize Your Code<br />
        <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Dependencies
        </span>
      </h2>
      <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
        Paste a GitHub repository URL and instantly see an interactive map of file 
        dependencies and discover orphan files.
      </p>
    </div>
  );
}

export default HeroSection;
