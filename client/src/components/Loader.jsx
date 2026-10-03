import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function Loader({ message = 'Analyzing documents & connecting project context...', subtext = '' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 animate-pulse">
          <Sparkles className="h-6 w-6 text-emerald-700 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute -inset-1 -z-10 rounded-lg bg-emerald-100 blur-sm animate-ping" style={{ animationDuration: '2s' }} />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-800">{message}</p>
        {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
      </div>

      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 animate-pulse" />
      </div>
    </div>
  );
}
