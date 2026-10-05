import React, { useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import api from '../services/api';
import aiService from '../services/aiService';
import Card from '../components/Card';
import Loader from '../components/Loader';
import {
  MessageSquare,
  FileCheck2,
  Send,
  Sparkles,
  Printer,
  Download,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Tv,
  HelpCircle,
  Trash2
} from 'lucide-react';

const CHAT_HISTORY_KEY = 'aih_chat_history_v1';

const welcomeMessage = {
  sender: 'assistant',
  text: "Hello! I am your AI Project Handoff Assistant. Ask me anything about current status, tasks, blockers, decisions, or timelines grounded strictly in this project's uploaded documents.",
  sources: []
};
const initialChatMessages = [welcomeMessage];

function loadChatHistories() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

export default function ChatAndReport() {
  const { id } = useParams();
  const { openSourceInspector, activeProject } = useOutletContext();

  const [activeSubTab, setActiveSubTab] = useState('chat'); // chat, report
  const [chatHistories, setChatHistories] = useState(loadChatHistories);
  const messages = chatHistories[id] || initialChatMessages;
  const [inputQuery, setInputQuery] = useState('');
  const [sending, setSending] = useState(false);

  // Handoff Report state
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistories));
    } catch (err) {
      console.warn('Could not save chat history:', err.message);
    }
  }, [chatHistories]);

  const appendChatMessage = (message) => {
    setChatHistories((previous) => ({
      ...previous,
      [id]: [...(previous[id] || [welcomeMessage]), message]
    }));
  };

  const clearChatHistory = () => {
    setChatHistories((previous) => ({ ...previous, [id]: [welcomeMessage] }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHandoffReport = async () => {
    try {
      setLoadingReport(true);
      const res = await api.post(`/projects/${id}/generate-handoff`);
      if (res.data?.success) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error('Failed to generate report:', err.message);
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'report' && !report) {
      loadHandoffReport();
    }
  }, [activeSubTab, id]);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend || textToSend.trim() === '') return;

    const userMessage = { sender: 'user', text: textToSend, sources: [] };
    appendChatMessage(userMessage);
    setInputQuery('');
    setSending(true);

    try {
      // Primary backend grounded query
      const res = await api.post(`/projects/${id}/chat`, { message: textToSend });
      if (res.data?.success) {
        appendChatMessage({
          sender: 'assistant',
          text: res.data.data.message,
          sources: res.data.data.sources || []
        });
      }
    } catch (err) {
      // Client-side AI fallback simulation
      const fallbackAns = await aiService.answerProjectQuery(textToSend, activeProject);
      appendChatMessage({
        sender: 'assistant',
        text: fallbackAns.answer,
        sources: fallbackAns.sources || []
      });
    } finally {
      setSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.projectTitle?.replace(/\s+/g, '_')}_Handoff_Report.json`;
    a.click();
  };

  const quickPrompts = [
    'What is the current project situation?',
    'Why was Stripe selected as the payment provider?',
    'What blockers were raised and resolved in recent sprints?',
    'What are the pending deliverables and deadlines?'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 no-print">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Project assistant
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">
            Ask about this project
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Get answers from project sources, then prepare a concise handoff for the next owner.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask a question</span>
          </button>

          <button
            onClick={() => setActiveSubTab('report')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'report'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Handoff Report</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: GROUNDED AI CHAT (FR10) */}
      {activeSubTab === 'chat' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
                Try asking:
            </span>
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={sending}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition"
              >
                "{q}"
              </button>
            ))}
            </div>
            <button
              type="button"
              onClick={clearChatHistory}
              disabled={sending || messages.length <= 1}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              title="Clear this project's chat history"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear history</span>
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="h-[480px] rounded-2xl border border-slate-800 bg-slate-950/70 p-4 md:p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mb-1">
                    {msg.sender === 'user' ? (
                      <span className="text-indigo-200">You (Incoming Member)</span>
                    ) : (
                      <span className="text-cyan-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Project assistant
                      </span>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Cited Sources Chips (FR10) */}
                  {msg.sources?.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Verified Evidence Citations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <button
                            key={i}
                            onClick={() => openSourceInspector(src)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-indigo-500/30 text-[10px] hover:border-indigo-400 transition"
                            title="Inspect Excerpt"
                          >
                            <FileText className="w-2.5 h-2.5 text-indigo-400" />
                            <span>{src.documentName}</span>
                            <ExternalLink className="w-2 h-2 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-2 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span>Searching ingested project documents & verifying evidence...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about project history, blocker resolutions, decisions, or upcoming tasks..."
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
            <button
              type="submit"
              disabled={sending || !inputQuery.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-xs transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* SUBTAB 2: STRUCTURED HANDOFF REPORT (FR11) */}
      {activeSubTab === 'report' && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Generated for:</span>
              <span className="text-xs font-bold text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                {report?.projectTitle || 'Loading Report...'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>

          {loadingReport ? (
            <div className="py-20">
              <Loader message="Compiling executive handoff report with source traceability..." />
            </div>
          ) : !report ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Report not available. Try re-running AI analysis.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 space-y-8 shadow-2xl printable-document">
              {/* Report Header */}
              <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block mb-1">
                    AI HANDOFF REPORT • EXECUTIVE CONTEXT RECOVERY
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">{report.projectTitle}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{report.projectType} • Generated on {report.generatedDate}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Handoff Readiness</span>
                    <span className="text-base font-bold text-emerald-400">
                      {report.handoffReadiness?.score}% ({report.handoffReadiness?.status})
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Section 1: Executive Overview & Situation */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>1. Executive Situation & Summary</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p><strong className="text-white">Current Situation:</strong> {report.currentSituation}</p>
                  <p><strong className="text-white">Project Summary:</strong> {report.reconstructedSummary}</p>
                </div>
              </div>

              {/* Section 2: Recommended Next Actions (FR11: reason, related task, and evidence) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>2. Recommended Immediate Next Actions</span>
                </h3>
                <div className="space-y-2.5">
                  {report.recommendedNextActions?.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{act.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          {act.priority}
                        </span>
                      </div>
                      <p className="text-slate-300"><strong className="text-slate-200">Reason:</strong> {act.reason}</p>
                      <div className="p-2 rounded bg-black/40 text-[11px] font-mono text-slate-300 border border-slate-800">
                        <strong className="text-indigo-400">Evidence:</strong> "{act.evidence}" (Source: {act.sourceDocument})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Pending Tasks & Deliverables */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>3. Work in Progress & Pending Deliverables</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.pendingWork?.map((t, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{t.task}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-slate-400">{t.description}</p>
                      <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                        <span>Owner: {t.assignee}</span>
                        <span>Due: {t.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Decisions & Rationale */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  <span>4. Architectural & Strategic Decisions</span>
                </h3>
                <div className="space-y-2">
                  {report.importantDecisions?.map((d, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between text-[11px] text-purple-400 font-semibold">
                        <span>{d.title}</span>
                        <span>{d.decisionDate}</span>
                      </div>
                      <p className="text-slate-300"><strong className="text-white">Reason:</strong> {d.reason}</p>
                      <p className="text-[11px] text-slate-400 italic">Source: {d.source}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Known Issues & Blockers */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>5. Known Issues & Blockers Radar</span>
                </h3>
                <div className="space-y-2">
                  {report.knownIssuesAndBlockers?.map((i, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-rose-300">{i.title}</span>
                        <span className="text-slate-400">{i.severity} Severity • {i.status}</span>
                      </div>
                      <p className="text-slate-300">{i.description}</p>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        Recommended Action: {i.suggestedAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: Document Inventory with Citations */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>6. Ingested Document Inventory & Traceability</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {report.documentInventory?.map((doc, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                      <span className="font-semibold text-white block truncate">{doc.name}</span>
                      <span className="text-slate-400 block mt-0.5">{doc.category}</span>
                      <span className="text-[10px] text-indigo-400 font-mono">{doc.fileType} • {doc.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
