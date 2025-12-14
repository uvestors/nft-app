const ArtPlaceholder = ({ type, color }: { type: string; color: string }) => {
  const baseClasses = `w-full h-full bg-gradient-to-br ${color} relative overflow-hidden flex items-center justify-center`;

  return (
    <div className={baseClasses}>
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      {type === "cube" && (
        <div className="relative w-24 h-24 transform rotate-12">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl transform translate-z-10"></div>
          <div className="absolute inset-0 bg-white/5 rounded-lg transform -translate-x-4 -translate-y-4"></div>
          <div className="absolute inset-0 bg-white/5 rounded-lg transform translate-x-4 translate-y-4"></div>
        </div>
      )}
      {type === "wave" && (
        <>
          <div className="absolute w-[150%] h-[150%] bg-white/10 rounded-full blur-3xl -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-full h-full bg-pink-500/20 rounded-full blur-2xl bottom-0 right-0"></div>
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 50 Q 25 20 50 50 T 100 50 L 100 100 L 0 100 Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </>
      )}
      {type === "prism" && (
        <div className="w-0 h-0 border-l-10 border-r-10 border-b-70 border-l-transparent border-r-transparent border-b-white/20 backdrop-blur-sm transform rotate-6 shadow-[0_0_30px_rgba(255,255,255,0.3)]"></div>
      )}
      {type === "gradient" && (
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent transform rotate-45 scale-150"></div>
      )}
      {type === "circle" && (
        <div className="w-24 h-24 rounded-full bg-linear-to-tr from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-inner"></div>
      )}
      {type === "dark" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-purple-500/50 blur-sm"></div>
          <div className="absolute w-px h-full bg-purple-500/50 blur-sm"></div>
        </div>
      )}
    </div>
  );
};

export default ArtPlaceholder;
