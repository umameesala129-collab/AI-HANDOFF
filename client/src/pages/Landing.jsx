import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  GitCompare,
  PlayCircle,
  FileText,
  Activity
} from 'lucide-react';

export default function Landing() {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleTryDemo = async () => {
    await loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f2f4ee] text-[#24352d]">
      <nav className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-[#d8e0d8] bg-[#f7f8f4]/95 px-4 backdrop-blur-md sm:px-7">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="brand-mark flex h-9 w-9 items-center justify-center rounded-lg bg-[#285d4a]"><Sparkles className="h-4 w-4 text-white" /></span>
          <span><strong className="block text-sm font-bold">AI Handoff</strong><span className="hidden text-[10px] text-[#738177] sm:block">Project context, clearly handed over</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handleTryDemo} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#c8d7cc] px-3 text-xs font-semibold text-[#315c4d] transition hover:bg-[#e8f0e8]"><PlayCircle className="h-4 w-4" /><span className="hidden sm:inline">Explore demo</span></button>
          {user ? <Link to="/dashboard" className="inline-flex min-h-10 items-center rounded-md bg-[#285d4a] px-4 text-xs font-semibold text-white">Open workspace</Link> : <Link to="/login" className="inline-flex min-h-10 items-center rounded-md bg-[#285d4a] px-4 text-xs font-semibold text-white">Sign in</Link>}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-12 sm:px-8">
        <section className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4c7568]"><span className="h-1.5 w-1.5 rounded-full bg-[#4c8068]" /> Project continuity workspace</span>
            <h1 className="mt-5 max-w-2xl font-serif text-4xl font-medium leading-[1.08] text-[#1b2925] sm:text-5xl lg:text-6xl">A clearer handoff starts with the full picture.</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#66736c]">Bring project notes, decisions, and deadlines into one calm workspace. Give the next person a useful starting point, not another pile of files.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={handleTryDemo} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#285d4a] px-5 text-sm font-semibold text-white transition hover:bg-[#1f4a3b]">View the SmartClinic demo <ArrowRight className="h-4 w-4" /></button>
              <Link to="/register" className="inline-flex min-h-11 items-center rounded-md border border-[#b9c8bc] px-5 text-sm font-semibold text-[#315c4d] transition hover:bg-[#e8f0e8]">Create an account</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#d8e0d8] pt-4 text-xs text-[#66736c]">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#397354]" /> Sources stay linked</span>
              <span className="inline-flex items-center gap-1.5"><GitCompare className="h-4 w-4 text-[#8b6840]" /> Conflicts stay visible</span>
              <span className="inline-flex items-center gap-1.5"><FileCheck2 className="h-4 w-4 text-[#537a9b]" /> Next steps stay clear</span>
            </div>
          </div>

          <div className="relative rounded-lg border border-[#cbd7cb] bg-[#fbfcf8] p-4 shadow-[0_16px_50px_-32px_rgba(37,76,57,0.3)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e1e7df] pb-4">
              <div><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#738177]">Example workspace</span><h2 className="mt-1 font-serif text-xl font-semibold text-[#24352d]">SmartClinic</h2></div>
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#bfd8c9] bg-[#e4f0e8] px-2 py-1 text-[10px] font-semibold text-[#28634d]"><span className="h-1.5 w-1.5 rounded-full bg-[#43805a]" /> On track</span>
            </div>
            <div className="grid grid-cols-3 gap-3 border-b border-[#e1e7df] py-4">
              <div><span className="block text-[10px] text-[#738177]">Progress</span><strong className="mt-1 block text-xl tabular-nums">68%</strong></div>
              <div><span className="block text-[10px] text-[#738177]">Readiness</span><strong className="mt-1 block text-xl tabular-nums text-[#397354]">88%</strong></div>
              <div><span className="block text-[10px] text-[#738177]">Sources</span><strong className="mt-1 block text-xl tabular-nums">4</strong></div>
            </div>
            <div className="py-4">
              <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-semibold">Latest context</h3><Activity className="h-4 w-4 text-[#4c7568]" /></div>
              <div className="border-l-2 border-[#76a183] pl-3"><p className="text-xs font-semibold text-[#33483d]">Payment provider approved</p><p className="mt-1 text-[11px] leading-relaxed text-[#738177]">Client approval clears the earlier blocker. Stripe integration is ready to continue.</p><span className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#8b6840]"><FileText className="h-3 w-3" /> Client approval · Oct 28</span></div>
            </div>
            <div className="flex items-center justify-between border-t border-[#e1e7df] pt-3 text-[10px] text-[#738177]"><span>Suggested next step</span><span className="font-semibold text-[#315c4d]">Validate payment webhooks</span></div>
          </div>
        </section>

        <section className="grid gap-0 border-y border-[#d5ddd5] sm:grid-cols-3">
          <div className="border-b border-[#d5ddd5] py-5 sm:border-b-0 sm:pr-6 sm:border-r"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b6840]">01 / Evidence</span><h2 className="mt-2 font-serif text-lg font-semibold">See where facts came from</h2><p className="mt-1.5 text-xs leading-relaxed text-[#738177]">Keep the source document close to every task, decision, and answer.</p></div>
          <div className="border-b border-[#d5ddd5] py-5 sm:px-6 sm:border-b-0 sm:border-r"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b6840]">02 / Context</span><h2 className="mt-2 font-serif text-lg font-semibold">Understand what changed</h2><p className="mt-1.5 text-xs leading-relaxed text-[#738177]">Connect older notes to newer approvals and make conflicts explicit.</p></div>
          <div className="py-5 sm:pl-6"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b6840]">03 / Continuity</span><h2 className="mt-2 font-serif text-lg font-semibold">Leave a useful next step</h2><p className="mt-1.5 text-xs leading-relaxed text-[#738177]">Give incoming teammates a clear view of owners, blockers, and deadlines.</p></div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[#d8e0d8] px-5 py-5 text-center text-[10px] text-[#738177] sm:px-8">AI Handoff <span className="px-1.5 text-[#b0bcb1]">/</span> Project context, kept together</footer>
    </div>
  );
}
