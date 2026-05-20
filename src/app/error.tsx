"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({
  error,
  reset
}: ErrorPageProps) {
  useEffect(() => {
    console.error(
      "Global app error:",
      error
    );
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="bg-slate-900/70 border border-red-500/20 rounded-3xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-5xl">
                ⚠️
              </span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">
              Something Went Wrong
            </h1>

            <p className="text-slate-400 mt-4 leading-relaxed">
              FluentPro AI encountered an unexpected
              error while loading the application.
            </p>
          </div>

          <div className="mt-8 bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <div className="text-sm text-slate-400 mb-2">
              Error Details
            </div>

            <div className="text-sm text-red-300 break-words">
              {error.message ||
                "Unknown application error."}
            </div>

            {error.digest && (
              <div className="mt-3 text-xs text-slate-500">
                Digest:
                {" "}
                {error.digest}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => reset()}
              className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition-colors px-6 py-4 text-black font-semibold"
            >
              Try Again
            </button>

            <button
              onClick={() => {
                window.location.href =
                  "/";
              }}
              className="w-full rounded-2xl border border-slate-700 hover:border-cyan-500 transition-colors px-6 py-4 text-white font-medium bg-slate-900/40"
            >
              Go To Home
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              If the problem continues, restart the app
              or check your internet connection.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
