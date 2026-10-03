import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import {
  FolderGit2,
  Plus,
  PlayCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ArrowRight,
  TrendingUp,
  Compass
} from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingTasks: 0,
    openIssues: 0
  });
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    projectType: 'Web Application',
    teamMembers: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pRes, sRes] = await Promise.all([
        api.get('/projects'),
        api.get('/projects/dashboard-stats')
      ]);

      if (pRes.data?.success) {
        setProjects(pRes.data.data);
      }
      if (sRes.data?.success) {
        setStats(sRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLaunchDemo = async () => {
    try {
      setLoading(true);
      const res = await api.post('/projects/demo');
      if (res.data?.success) {
        const demo = res.data.data;
        navigate(`/projects/${demo._id || demo.id}/overview`);
      }
    } catch (err) {
      console.error('Failed to load demo:', err.message);
      fetchDashboardData();
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;

    try {
      setCreating(true);
      const res = await api.post('/projects', newProject);
      if (res.data?.success) {
        setIsCreateModalOpen(false);
        setNewProject({
          name: '',
          description: '',
          projectType: 'Web Application',
          teamMembers: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: ''
        });
        const createdId = res.data.data._id || res.data.data.id;
        navigate(`/projects/${createdId}/overview`);
      }
    } catch (err) {
      console.error('Failed to create project:', err.message);
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Track':
        return 'bg-[#e4f0e8] text-[#28634d] border-[#bfd8c9]';
      case 'At Risk':
        return 'bg-[#fbf0d8] text-[#8c641f] border-[#ead5a4]';
      case 'Blocked':
        return 'bg-[#f9e6e1] text-[#a44837] border-[#e9c1b8]';
      case 'Completed':
        return 'bg-[#e5eceb] text-[#48605c] border-[#c6d2cf]';
      default:
        return 'bg-[#e9ece7] text-[#59635f] border-[#d2d8d1]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#f1f3ed] py-20 text-[#1b2925]">
        <Loader message="Loading projects and computing cross-project statistics..." />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] space-y-8 bg-[#f1f3ed] px-5 py-6 text-[#1b2925] sm:px-8 sm:py-9">
      <header className="flex flex-col gap-6 border-b border-[#d5ddd5] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4c7568]">
            <Compass className="h-3.5 w-3.5" />
            <span>Portfolio / Overview</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold leading-tight text-[#1b2925] sm:text-4xl">
            Your work, in focus.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#66736c]">
            See what is moving, what needs attention, and where to pick up next.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLaunchDemo}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#9eb5aa] bg-transparent px-3.5 text-xs font-semibold text-[#315c4d] transition hover:bg-[#e4ebe4]"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Open demo</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#255c4b] px-3.5 text-xs font-semibold text-white transition hover:bg-[#1e4b3d]"
          >
            <Plus className="h-4 w-4" />
            <span>New project</span>
          </button>
        </div>
      </header>

      <section aria-label="Portfolio metrics" className="grid grid-cols-2 border-y border-[#d5ddd5] sm:grid-cols-4">
        <div className="border-b border-r border-[#d5ddd5] py-4 pr-4 sm:border-b-0 sm:py-5">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#68756f]"><FolderGit2 className="h-4 w-4 text-[#50796b]" /> Projects</div>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-[#1b2925]">{stats.totalProjects}</p>
          <span className="text-[11px] text-[#78837d]">In your portfolio</span>
        </div>
        <div className="border-b border-[#d5ddd5] py-4 pl-4 sm:border-b-0 sm:border-r sm:py-5 sm:pl-6">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#68756f]"><TrendingUp className="h-4 w-4 text-[#397354]" /> Active</div>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-[#397354]">{stats.activeProjects}</p>
          <span className="text-[11px] text-[#78837d]">Currently underway</span>
        </div>
        <div className="border-r border-[#d5ddd5] py-4 pr-4 sm:py-5 sm:pl-6">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#68756f]"><Clock className="h-4 w-4 text-[#a47422]" /> Pending tasks</div>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-[#a47422]">{stats.pendingTasks}</p>
          <span className="text-[11px] text-[#78837d]">Across all projects</span>
        </div>
        <div className="py-4 pl-4 sm:py-5 sm:pl-6">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#68756f]"><AlertTriangle className="h-4 w-4 text-[#b4513e]" /> Open issues</div>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-[#b4513e]">{stats.openIssues}</p>
          <span className="text-[11px] text-[#78837d]">Need a closer look</span>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3 pb-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b6840]">Workspace index</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#1b2925]">Projects <span className="font-sans text-sm font-medium text-[#7a857f]">{projects.length}</span></h2>
          </div>
          <span className="text-xs text-[#78837d]">Sorted by recent activity</span>
        </div>

        {projects.length === 0 ? (
          <div className="border-y border-dashed border-[#bdc9bf] py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e2ebe2] text-[#3b6f59]">
              <FolderGit2 className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl font-semibold text-[#1b2925]">Start with a project</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-[#6d7972]">
                Create a workspace or open the SmartClinic sample to explore the portfolio view.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                onClick={handleLaunchDemo}
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#255c4b] px-4 text-xs font-semibold text-white transition hover:bg-[#1e4b3d]"
              >
                <PlayCircle className="h-4 w-4" /> Open demo project
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#aebdb1] px-4 text-xs font-semibold text-[#315c4d] transition hover:bg-[#e4ebe4]"
              >
                <Plus className="h-4 w-4" /> Create project
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#d5ddd5] border-y border-[#d5ddd5]">
            {projects.map((project) => {
              const pId = project._id || project.id;
              const readiness = project.handoffReadiness || { score: 70, status: 'Needs Review' };

              return (
                <article
                  key={pId}
                  className="grid grid-cols-1 gap-5 bg-[#f7f8f3] px-4 py-5 transition-colors hover:bg-[#fbfcf8] sm:px-5 lg:grid-cols-[minmax(220px,1.35fr)_minmax(150px,.8fr)_minmax(230px,1.15fr)_auto] lg:items-center"
                >
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${getStatusBadge(project.status)}`}>
                        <CheckCircle2 className="h-3 w-3" /> {project.status}
                      </span>
                      {project.isDemo && <span className="rounded-sm bg-[#f3e9d6] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8b6840]">Sample</span>}
                    </div>
                    <h3 className="truncate text-base font-semibold text-[#20332c]">
                      {project.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#78837d]">
                      {project.description || project.projectType || 'No description provided.'}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between text-[10px] text-[#78837d]">
                      <span>Project progress</span><span className="font-semibold tabular-nums text-[#3b6152]">{project.progress || 0}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden bg-[#e0e7df]">
                      <div className="h-full bg-[#4c8068] transition-all duration-500" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#78837d]">
                      <FileText className="h-3.5 w-3.5" /> {project.stats?.docCount || 0} source documents
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-[#e1e6df] pt-3 text-[10px] sm:max-w-sm lg:border-0 lg:pt-0">
                    <div><span className="block text-[#89938d]">Pending</span><span className="mt-1 block text-sm font-semibold tabular-nums text-[#33463e]">{project.stats?.pendingTasks || 0} <span className="text-[10px] font-normal">tasks</span></span></div>
                    <div><span className="block text-[#89938d]">Issues</span><span className={`mt-1 block text-sm font-semibold tabular-nums ${project.stats?.openIssues > 0 ? 'text-[#b4513e]' : 'text-[#397354]'}`}>{project.stats?.openIssues || 0} <span className="text-[10px] font-normal">open</span></span></div>
                    <div><span className="block text-[#89938d]">Handoff</span><span className={`mt-1 block text-sm font-semibold tabular-nums ${readiness.status === 'Ready' ? 'text-[#397354]' : 'text-[#a47422]'}`}>{readiness.score || 0}%</span></div>
                  </div>

                  <button
                    onClick={() => navigate(`/projects/${pId}/overview`)}
                    className="inline-flex min-h-10 items-center justify-between gap-2 border-t border-[#e1e6df] pt-3 text-left text-xs font-semibold text-[#315c4d] transition hover:text-[#1e4b3d] sm:justify-self-start lg:min-h-0 lg:border-0 lg:pt-0"
                  >
                    <span>Open workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        subtitle="Initialize project context workspace for document ingestion"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="e.g. SmartClinic Management Platform"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Brief summary of the application and business goals..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Project Type</label>
              <select
                value={newProject.projectType}
                onChange={(e) => setNewProject({ ...newProject, projectType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Healthcare SaaS">Healthcare SaaS Platform</option>
                <option value="Web Application">Web Application</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI / ML Platform">AI / ML Platform</option>
                <option value="Enterprise ERP">Enterprise ERP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Team Members (comma separated)</label>
              <input
                type="text"
                value={newProject.teamMembers}
                onChange={(e) => setNewProject({ ...newProject, teamMembers: e.target.value })}
                placeholder="Alex, Sarah, Elena"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Expected End Date</label>
              <input
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm flex items-center gap-1.5"
            >
              {creating ? 'Creating...' : 'Create & Open'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
