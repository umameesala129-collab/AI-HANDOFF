import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  PlayCircle,
  LogOut,
  FolderGit2,
  Tv
} from 'lucide-react';

export default function Navbar({ activeProject, onOpenPresentation }) {
  const { user, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleLaunchDemo = async () => {
    await loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-200 bg-slate-50/95 px-3 py-2 backdrop-blur-md md:px-6 no-print">
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="brand-mark flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#285d4a] shadow-sm transition-transform group-hover:scale-[1.03]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              AI Handoff
            </span>
            <p className="hidden text-[10px] text-slate-500 sm:block">Project context, clearly handed over</p>
          </div>
        </Link>

        {activeProject && (
          <div className="hidden min-w-0 items-center gap-2 border-l border-slate-200 pl-4 lg:flex">
            <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span className="max-w-56 truncate text-xs font-medium text-slate-700">{activeProject.name}</span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {onOpenPresentation && (
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3"
            title="Launch 9-Step Stakeholder Walkthrough"
          >
            <Tv className="h-3.5 w-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Presentation Mode</span>
          </button>
        )}

        <button
          onClick={handleLaunchDemo}
            className="flex items-center gap-1.5 rounded-md border border-[#bfd3c5] bg-[#edf4ed] px-2 py-2 text-xs font-medium text-[#315c4d] transition hover:bg-[#e2ede3] sm:px-3"
          title="Load SmartClinic Demo Project"
        >
            <PlayCircle className="h-3.5 w-3.5 text-emerald-700" />
          <span className="hidden sm:inline">Try Demo Project</span>
        </button>

        {user ? (
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2 sm:gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c8d7cc] bg-[#e8f0e8] text-xs font-bold text-[#315c4d]">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-tight text-slate-800">{user.name}</p>
                <p className="text-[10px] leading-tight text-slate-500">{user.role || 'Project Member'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="ml-1 rounded-md p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-[#285d4a] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1f4a3b]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
