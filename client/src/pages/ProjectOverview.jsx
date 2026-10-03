import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { HealthBarChart, TaskDistributionPie } from '../components/Charts';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  PlayCircle,
  FileCheck2,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Tv
} from 'lucide-react';

export default function ProjectOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onUpdateProject } = useOutletContext();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatusMessage, setAnalysisStatusMessage] = useState('');

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      if (res.data?.success) {
        setProject(res.data.data);
        if (onUpdateProject) {
          onUpdateProject(res.data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching project:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      setAnalysisStatusMessage('Extracting text and chunking project documents...');
      await new Promise(r => setTimeout(r, 400));
      setAnalysisStatusMessage('Connecting cross-document context & detecting conflicts...');

      const res = await api.post(`/projects/${id}/analyze`);
      if (res.data?.success) {
        setAnalysisStatusMessage('Analysis complete! Refreshing reconstructed context...');
        await fetchProject();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Analysis failed. Please ensure at least one document is uploaded.');
    } finally {
      setAnalyzing(false);
      setAnalysisStatusMessage('');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Track':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'At Risk':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Blocked':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Completed':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <Loader message="Loading project context & health calculations..." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Project not found.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const health = project.healthBreakdown;
  const readiness = project.handoffReadiness || { score: 65, status: 'Needs Review', missingContext: [] };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Project overview
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(project.status)}`}>
              {project.status}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1.5">{project.name}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{project.description}</p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>{analyzing ? 'Updating project context...' : 'Update project context'}</span>
          </button>

          <button
            onClick={() => navigate(`/projects/${id}/handoff`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Handoff Report</span>
          </button>
        </div>
      </div>

      {analyzing && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center animate-pulse">
          <Loader message={analysisStatusMessage} subtext="Checking the updated project context..." />
        </div>
      )}

      {/* Row 1: Situation & Reconstructed Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Situation Report */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Current situation</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Updated {new Date(project.updatedAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-200 leading-relaxed">
            {project.currentSituation || 'Awaiting initial document ingestion to extract current project situation.'}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Project summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {project.summary || 'Upload project documents to reconstruct executive summary.'}
            </p>
          </div>

          {/* Progress Bar with Milestones */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Overall progress</span>
              <span className="text-indigo-400 font-bold">{project.progress || 0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Handoff Readiness Assessment Card (FR12) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Handoff Readiness</h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  readiness.status === 'Ready'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {readiness.status}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-white">{readiness.score}%</span>
                <span className="text-xs text-slate-400">Handoff readiness</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              AI assessment verifies whether enough verified information exists to safely hand over the project.
            </p>

            {/* Missing Context breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                Details to confirm
              </span>
              {readiness.missingContext?.length > 0 ? (
                <ul className="space-y-1.5">
                  {readiness.missingContext.map((item, idx) => (
                    <li key={idx} className="text-xs text-amber-300/90 flex items-start gap-1.5 bg-amber-500/5 p-2 rounded-lg border border-amber-500/15">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All critical requirements and decisions documented with sources.</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(`/projects/${id}/handoff`)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <span>View Full Handoff Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: AI Health Indicators & Radar (FR5: labeled as AI estimate with basis explained) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Project health</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                Estimated from project activity
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated across tasks, deadlines, issues, documentation, and context completeness
            </p>
          </div>
        </div>

        {health && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Visual Bar Chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Health Index Comparison</h3>
              <HealthBarChart healthData={health} />
            </div>

            {/* Task Health Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Tasks Health</span>
                  <span className="text-sm font-bold text-indigo-400">{health.taskHealth?.score}%</span>
                </div>
                <p className="text-xs text-white font-medium">{health.taskHealth?.label}</p>
                <p className="text-[11px] text-slate-400 mt-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">Basis:</strong> {health.taskHealth?.basis}
                </p>
              </div>

              <button
                onClick={() => navigate(`/projects/${id}/context`)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium pt-2"
              >
                <span>Inspect Tasks</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Deadlines Health Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Deadlines & Velocity</span>
                  <span className="text-sm font-bold text-cyan-400">{health.deadlineHealth?.score}%</span>
                </div>
                <p className="text-xs text-white font-medium">{health.deadlineHealth?.label}</p>
                <p className="text-[11px] text-slate-400 mt-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">Basis:</strong> {health.deadlineHealth?.basis}
                </p>
              </div>

              <button
                onClick={() => navigate(`/projects/${id}/context`)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium pt-2"
              >
                <span>View Timeline</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Issues & Blockers Health */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Issues & Blockers</span>
                  <span className="text-sm font-bold text-emerald-400">{health.issueHealth?.score}%</span>
                </div>
                <p className="text-xs text-white font-medium">{health.issueHealth?.label}</p>
                <p className="text-[11px] text-slate-400 mt-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">Basis:</strong> {health.issueHealth?.basis}
                </p>
              </div>

              <button
                onClick={() => navigate(`/projects/${id}/context`)}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium pt-2"
              >
                <span>Inspect Blockers</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Documentation Coverage */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Documentation Coverage</span>
                  <span className="text-sm font-bold text-purple-400">{health.documentationHealth?.score}%</span>
                </div>
                <p className="text-xs text-white font-medium">{health.documentationHealth?.label}</p>
                <p className="text-[11px] text-slate-400 mt-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">Basis:</strong> {health.documentationHealth?.basis}
                </p>
              </div>

              <button
                onClick={() => navigate(`/projects/${id}/documents`)}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium pt-2"
              >
                <span>Manage Ingested Documents</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Context Connections */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Context Completeness</span>
                  <span className="text-sm font-bold text-amber-400">{health.contextCompleteness?.score}%</span>
                </div>
                <p className="text-xs text-white font-medium">{health.contextCompleteness?.label}</p>
                <p className="text-[11px] text-slate-400 mt-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">Basis:</strong> {health.contextCompleteness?.basis}
                </p>
              </div>

              <button
                onClick={() => navigate(`/projects/${id}/reasoning`)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium pt-2"
              >
                <span>Examine Reasoning & Conflicts</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
