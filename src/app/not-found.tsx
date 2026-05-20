import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-black text-cyan-400">
            404
          </h1>

          <h2 className="text-3xl font-bold text-white mt-4">
            Page Not Found
          </h2>

          <p className="text-slate-400 mt-4 leading-relaxed">
            The page you are looking for does not exist
            or may have been moved.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <span className="text-4xl">
                🎧
              </span>
            </div>
          </div>

          <h3 className="text-white text-xl font-semibold">
            FluentPro AI
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Continue practicing spoken English with
            AI-powered conversations.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition-colors px-6 py-4 text-black font-semibold"
          >
            Go To Home
          </Link>

          <Link
            href="/practice"
            className="w-full rounded-2xl border border-slate-700 hover:border-cyan-500 transition-colors px-6 py-4 text-white font-medium bg-slate-900/40"
          >
            Start Practice
          </Link>
        </div>

        <div className="mt-10 text-slate-500 text-sm">
          Error Code:
          {" "}
          <span className="text-slate-300">
            FP-404
          </span>
        </div>
      </div>
    </main>
  );
}
