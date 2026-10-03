import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileUp,
  GitCompare,
  ListTodo,
  MessageSquare,
  Sparkles,
  FileCheck
} from 'lucide-react';

export default function Sidebar({ projectId, onOpenPresentation }) {
  const params = useParams();
  const currentProjectId = projectId || params.id;

  const baseLinks = [
    {
      label: 'Portfolio',
      to: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    }
  ];

  const projectLinks = currentProjectId
    ? [
        {
          label: 'Overview',
          to: `/projects/${currentProjectId}/overview`,
          icon: <Compass className="w-4 h-4" />,
          desc: 'Project health and next steps'
        },
        {
          label: 'Documents',
          to: `/projects/${currentProjectId}/documents`,
          icon: <FileUp className="w-4 h-4" />,
          desc: 'Sources and uploads'
        },
        {
          label: 'Reasoning',
          to: `/projects/${currentProjectId}/reasoning`,
          icon: <GitCompare className="w-4 h-4" />,
          desc: 'Connections and conflicts'
        },
        {
          label: 'Tasks & timeline',
          to: `/projects/${currentProjectId}/context`,
          icon: <ListTodo className="w-4 h-4" />,
          desc: 'Tasks, decisions and events'
        },
        {
          label: 'Chat & handoff',
          to: `/projects/${currentProjectId}/handoff`,
          icon: <MessageSquare className="w-4 h-4" />,
          desc: 'Ask questions and prepare handoff'
        }
      ]
    : [];

  return (
    <>
    <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-slate-50/80 p-3 md:flex no-print">
      <div className="space-y-6">
        <div>
          <span className="mb-2 block px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Workspace
          </span>
          <nav className="space-y-1">
            {baseLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#e3ece4] text-[#285d4a]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {currentProjectId && (
          <div>
            <div className="mb-2 flex items-center justify-between px-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Project
              </span>
            </div>
            <nav className="space-y-1">
              {projectLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col gap-0.5 rounded-md px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? 'bg-[#e3ece4] text-[#285d4a]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="pl-6 text-[10px] text-slate-500">{item.desc}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-slate-200 pt-4">
        {onOpenPresentation && (
          <button
            onClick={onOpenPresentation}
            className="flex w-full items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>Presentation Mode</span>
          </button>
        )}
        <div className="px-3 text-[10px] text-slate-500">
          AI Handoff <span className="px-1 text-slate-300">/</span> Project workspace
        </div>
      </div>
    </aside>
    <nav aria-label="Project navigation" className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-3 py-2 md:hidden no-print">
      {[...baseLinks, ...projectLinks].map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          title={item.label}
          className={({ isActive }) => `flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition ${isActive ? 'bg-[#e3ece4] text-[#285d4a]' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
    </>
  );
}
