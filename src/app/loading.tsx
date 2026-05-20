export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20" />

          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
        </div>

        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">
            FluentPro AI
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Loading your AI English learning experience...
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-2/3 bg-cyan-400 animate-pulse rounded-full" />
          </div>

          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/2 bg-cyan-400/70 animate-pulse rounded-full" />
          </div>

          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-3/4 bg-cyan-400/50 animate-pulse rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />

          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-100" />

          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-200" />
        </div>
      </div>
    </main>
  );
}
