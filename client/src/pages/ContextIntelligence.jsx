import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  HelpCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function ContextIntelligence() {
  const { id } = useParams();
  const { openSourceInspector } = useOutletContext();

  const [activeTab, setActiveTab] = useState('tasks'); // tasks, decisions, issues, timeline
  const [tasks, setTasks] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [issues, setIssues] = useState([]);
  const [timeline, setTimeline] = useState({ events: [], milestones: [] });
  const [loading, setLoading] = useState(true);

  // "Why was this decision made?" modal
  const [activeDecision, setActiveDecision] = useState(null);

  // Timeline Event detail modal
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState(null);

  const fetchContextData = async () => {
    try {
      setLoading(true);
      const [tRes, dRes, iRes, timeRes] = await Promise.all([
        api.get(`/projects/${id}/tasks`),
        api.get(`/projects/${id}/decisions`),
        api.get(`/projects/${id}/issues`),
        api.get(`/projects/${id}/timeline`)
      ]);

      if (tRes.data?.success) setTasks(tRes.data.data);
      if (dRes.data?.success) setDecisions(dRes.data.data);
      if (iRes.data?.success) setIssues(iRes.data.data);
      if (timeRes.data?.success) setTimeline(timeRes.data.data);
    } catch (err) {
      console.error('Failed to load context intelligence:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContextData();
  }, [id]);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      if (res.data?.success) {
        setTasks((prev) =>
          prev.map((t) => ((t._id || t.id) === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error('Failed to update task status:', err.message);
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    try {
      const res = await api.patch(`/issues/${issueId}/status`, { status: newStatus });
      if (res.data?.success) {
        setIssues((prev) =>
          prev.map((i) => ((i._id || i.id) === issueId ? { ...i, status: newStatus } : i))
        );
      }
    } catch (err) {
      console.error('Failed to update issue status:', err.message);
    }
  };

  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Medium':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Low':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getTimelineTypeColor = (type) => {
    switch (type) {
      case 'Milestone':
        return 'bg-cyan-500 text-cyan-950 border-cyan-400';
      case 'Decision':
        return 'bg-purple-500 text-purple-950 border-purple-400';
      case 'Task Completed':
        return 'bg-emerald-500 text-emerald-950 border-emerald-400';
      case 'Blocker Raised':
        return 'bg-rose-500 text-rose-950 border-rose-400';
      case 'Blocker Resolved':
        return 'bg-emerald-400 text-emerald-950 border-emerald-300';
      default:
        return 'bg-indigo-500 text-indigo-950 border-indigo-400';
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <Loader message="Synthesizing tasks, decisions, issues, and chronological timeline..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Project work
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">
            Tasks, decisions & timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Follow active work, revisit important decisions, and keep an eye on upcoming milestones.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'tasks', label: `Tasks (${tasks.length})`, icon: <ListTodo className="w-4 h-4" /> },
          { id: 'decisions', label: `Decisions (${decisions.length})`, icon: <Layers className="w-4 h-4" /> },
          { id: 'issues', label: `Issues (${issues.length})`, icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'timeline', label: `Timeline (${timeline.events?.length || 0})`, icon: <Calendar className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: TASKS MATRIX (FR6) */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Pending Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Pending Deliverables & Work in Progress</span>
                <span className="text-xs text-slate-400 font-normal">({pendingTasks.length})</span>
              </h2>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                No pending tasks found. All extracted tasks have been completed.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => {
                  const tId = task._id || task.id;
                  return (
                    <div
                      key={tId}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                              {task.priority} Priority
                            </span>
                            <h3 className="text-sm font-bold text-white">{task.title}</h3>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>
                        </div>

                        {/* Interactive Status Selector (SRS FR6) */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-400">Status:</span>
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(tId, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 font-medium"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Blocked">Blocked</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      {/* Metadata & Source Chips */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                        <div className="flex flex-wrap items-center gap-3">
                          <span>
                            Assignee: <strong className="text-slate-200">{task.assignee}</strong>
                          </span>
                          <span>
                            Deadline: <strong className="text-indigo-300">{task.deadline || 'Unscheduled'}</strong>
                          </span>
                          {task.dependencies?.length > 0 && (
                            <span className="flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                              <Tag className="w-3 h-3 text-slate-400" />
                              Dep: {task.dependencies.join(', ')}
                            </span>
                          )}
                        </div>

                        {task.sourceDocumentName && (
                          <button
                            onClick={() =>
                              openSourceInspector({
                                documentName: task.sourceDocumentName,
                                excerpt: task.sourceExcerpt || task.title,
                                page: task.pageNumber || 1,
                                section: task.section || 'Deliverables'
                              })
                            }
                            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Source: {task.sourceDocumentName}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed Work Section */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Completed Deliverables</span>
              <span className="text-xs text-slate-400 font-normal">({completedTasks.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedTasks.map((task) => {
                const tId = task._id || task.id;
                return (
                  <div
                    key={tId}
                    className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-200">{task.title}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        Completed
                      </span>
                    </div>
                    <p className="text-slate-400">{task.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span>Owner: <strong className="text-slate-300">{task.assignee}</strong></span>
                      <span>Finished: {task.completedDate || 'Earlier sprint'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DECISIONS & RATIONALE (FR6) */}
      {activeTab === 'decisions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Preserved architectural and vendor decisions with "Why was this decision made?" source evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decisions.map((dec) => {
              const dId = dec._id || dec.id;
              return (
                <div
                  key={dId}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        {dec.decisionDate || 'Approved Decision'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        By {dec.decisionMaker || 'Architecture Team'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{dec.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-purple-300">Reason:</strong> {dec.reason}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setActiveDecision(dec)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Why was this decision made?</span>
                    </button>

                    {dec.sourceDocumentName && (
                      <span className="text-[11px] text-slate-400">
                        Source: {dec.sourceDocumentName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ISSUES & BLOCKERS (FR6) */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Automated blocker tracking highlighting severity, related deliverables, and recommended resolution paths.
          </p>

          <div className="space-y-3">
            {issues.map((issue) => {
              const iId = issue._id || issue.id;
              return (
                <div
                  key={iId}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity} Severity
                      </span>
                      <h3 className="text-sm font-bold text-white">{issue.title}</h3>
                    </div>

                    {/* Interactive Issue Status Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Status:</span>
                      <select
                        value={issue.status}
                        onChange={(e) => handleUpdateIssueStatus(iId, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>

                  {/* Suggested Action Box */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-emerald-400 uppercase text-[10px] block">
                      AI Suggested Action
                    </span>
                    <p className="text-slate-200">{issue.suggestedAction}</p>
                  </div>

                  {/* Footer metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Related Task: <strong className="text-slate-300">{issue.relatedTask || 'None'}</strong></span>
                    {issue.sourceDocumentName && (
                      <button
                        onClick={() =>
                          openSourceInspector({
                            documentName: issue.sourceDocumentName,
                            excerpt: issue.sourceExcerpt || issue.title,
                            page: issue.pageNumber || 1,
                            section: 'Issues'
                          })
                        }
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Source: {issue.sourceDocumentName}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CHRONOLOGICAL TIMELINE (FR7) */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-400">
            Click on any timeline event to inspect related documents, connected tasks, and AI explanations.
          </p>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {timeline.events?.map((evt, idx) => {
              const eId = evt._id || evt.id || idx;
              return (
                <div
                  key={eId}
                  onClick={() => setSelectedTimelineEvent(evt)}
                  className="relative group cursor-pointer"
                >
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${getTimelineTypeColor(
                      evt.eventType
                    )} shadow-md`}
                  />

                  {/* Event Card */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 group-hover:border-indigo-500/40 group-hover:shadow-lg transition space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-400 font-mono">
                          {evt.eventDate}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {evt.eventType}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {evt.description}
                    </p>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span>Source: <strong className="text-slate-300">{evt.sourceDocumentName}</strong></span>
                      {evt.relatedTask && (
                        <span>Task: <strong className="text-slate-300">{evt.relatedTask}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* "Why was this decision made?" Modal (FR6) */}
      {activeDecision && (
        <Modal
          isOpen={!!activeDecision}
          onClose={() => setActiveDecision(null)}
          title={`Decision Rationale: ${activeDecision.title}`}
          subtitle={`Recorded on ${activeDecision.decisionDate} by ${activeDecision.decisionMaker}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs space-y-1">
              <span className="font-bold uppercase text-[10px] text-purple-400 block">
                Primary Justification
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">{activeDecision.reason}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Supporting Source Excerpts
              </span>
              <div className="space-y-2">
                {activeDecision.whyMadeExcerpts?.map((ex, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono italic">
                    "{ex}"
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDecision(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
              >
                Close Rationale
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Timeline Event Inspection Modal (FR7) */}
      {selectedTimelineEvent && (
        <Modal
          isOpen={!!selectedTimelineEvent}
          onClose={() => setSelectedTimelineEvent(null)}
          title={selectedTimelineEvent.title}
          subtitle={`Event Date: ${selectedTimelineEvent.eventDate} • Type: ${selectedTimelineEvent.eventType}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-200 leading-relaxed">{selectedTimelineEvent.description}</p>

            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                AI Temporal Explanation
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedTimelineEvent.aiExplanation || 'Event sequence reconciled across project milestones.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Related Task</span>
                <span className="font-semibold text-slate-200">{selectedTimelineEvent.relatedTask || 'General Milestone'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Source Document</span>
                <span className="font-semibold text-slate-200">{selectedTimelineEvent.sourceDocumentName}</span>
              </div>
            </div>

            {selectedTimelineEvent.sourceExcerpt && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono italic">
                "{selectedTimelineEvent.sourceExcerpt}"
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTimelineEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
