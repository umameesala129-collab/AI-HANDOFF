import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, PlayCircle, AlertCircle, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async () => {
    setSubmitting(true);
    await loginAsDemo();
    setSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f2f4ee] px-5 py-6 text-[#24352d] sm:px-8 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col">
        <Link to="/" className="inline-flex w-fit items-center gap-2.5">
          <span className="brand-mark flex h-9 w-9 items-center justify-center rounded-lg bg-[#285d4a]"><Sparkles className="h-4 w-4 text-white" /></span>
          <span className="text-sm font-bold">AI Handoff</span>
        </Link>

        <div className="grid flex-1 items-center gap-10 py-10 md:grid-cols-[1fr_.85fr] md:gap-16">
          <div className="max-w-lg">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b6840]">Welcome back</span>
            <h1 className="mt-3 font-serif text-4xl font-medium leading-tight text-[#1b2925] sm:text-5xl">Pick up where the project left off.</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#66736c]">Return to your portfolio, review the latest context, and keep the next handoff moving.</p>
            <div className="mt-8 border-t border-[#d8e0d8] pt-4 text-xs text-[#66736c]"><span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-[#397354]" /> Project information stays organized by workspace.</span></div>
          </div>

          <div className="w-full max-w-md md:justify-self-end">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#d5ddd5] pb-4">
              <div><h2 className="font-serif text-2xl font-semibold text-[#1b2925]">Sign in</h2><p className="mt-1 text-xs text-[#738177]">Use your account details to continue.</p></div>
              <button type="button" onClick={handleDemoLogin} disabled={submitting} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#bfd3c5] bg-[#edf4ed] px-3 text-xs font-semibold text-[#315c4d] transition hover:bg-[#e2ede3] disabled:opacity-50"><PlayCircle className="h-3.5 w-3.5" /> Demo</button>
            </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-md border border-slate-300 bg-[#fbfcf8] py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-slate-300 bg-[#fbfcf8] py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#285d4a] text-sm font-semibold text-white transition hover:bg-[#1f4a3b]"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 border-t border-[#d8e0d8] pt-4 text-center text-xs text-[#738177]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#315c4d] hover:text-[#1f4a3b]">
              Create an account
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
