import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import {
  GitCompare,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileText,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Layers,
  HelpCircle,
  Lightbulb,
  FileCheck2
} from 'lucide-react';

export default function CrossDocReasoning() {
  const { id } = useParams();
  const { openSourceInspector } = useOutletContext();

  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, ContextConnection, Conflict, Fact, Recommendation

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}/insights`);
      if (res.data?.success) {
        setInsights(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load insights:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [id]);

  const filteredInsights = insights.filter((item) => {
    if (filter === 'ALL') return true;
    return item.insightType === filter;
  });

  const getInsightTypeBadge = (type) => {
    switch (type) {
      case 'ContextConnection':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Conflict':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Fact':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Inference':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Recommendation':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Project reasoning
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">
            Connections & conflicts
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            See how newer updates connect to earlier notes, and where project sources still disagree.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'ALL', label: 'Everything' },
          { id: 'ContextConnection', label: 'Connections' },
          { id: 'Conflict', label: 'Conflicts' },
          { id: 'Fact', label: 'Verified facts' },
          { id: 'Recommendation', label: 'Recommendations' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12">
          <Loader message="Running cross-document conflict check & synthesizing evidence chains..." />
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <GitCompare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No items found for this filter</h3>
          <p className="text-xs text-slate-400">
            Re-run AI Analysis from the Project Overview page or try the SmartClinic demo to see multi-document reasoning.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInsights.map((insight) => {
            const inId = insight._id || insight.id;

            // Render Conflict Card
            if (insight.insightType === 'Conflict' && insight.conflictDetails) {
              const conflict = insight.conflictDetails;
              return (
                <div
                  key={inId}
                  className="rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-900/90 p-6 space-y-4 shadow-lg shadow-rose-950/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                        <ShieldAlert className="w-4 h-4" />
                      </span>
                      <h3 className="text-base font-bold text-white">{insight.content}</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 self-start sm:self-auto">
                      {conflict.conflictType || 'Status Divergence'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {conflict.description}
                  </p>

                  {/* Conflicting Sources Side-by-Side (Figure 7 HLD) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {conflict.conflictingSources?.map((src, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          i === 1
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            {src.documentName}
                          </span>
                          <span className="text-slate-400">{src.date}</span>
                        </div>
                        <div className="font-semibold text-white">{src.claim}</div>
                        <div className="p-2 rounded bg-slate-100 text-[11px] font-mono italic text-slate-700">
                          "{src.excerpt}"
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Latest Resolution */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-400 block">
                      What changed
                    </span>
                    <p>{conflict.latestResolution}</p>
                  </div>
                </div>
              );
            }

            // Render Context Connection Card (Evidence -> Interpretation -> Current Context)
            if (insight.insightType === 'ContextConnection' && insight.evidenceChain) {
              const chain = insight.evidenceChain;
              return (
                <div
                  key={inId}
                  className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-6 space-y-5 shadow-lg shadow-indigo-950/10"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <h3 className="text-base font-bold text-white">{insight.content}</h3>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {insight.confidence}% AI Confidence
                    </span>
                  </div>

                  {/* 3-Step Evidence Chain Flow */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Step 1: Evidence */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        1. Multi-Document Evidence
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono">
                        {chain.evidence || 'No supporting source found.'}
                      </p>
                    </div>

                    {/* Step 2: Interpretation */}
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        2. AI Interpretation
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {chain.interpretation}
                      </p>
                    </div>

                    {/* Step 3: Current Context */}
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        3. Current Project Context
                      </span>
                      <p className="text-xs text-emerald-200 leading-relaxed">
                        {chain.currentContext}
                      </p>
                    </div>
                  </div>

                  {/* Actionable Step & Source Chips */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span><strong className="text-white">Action:</strong> {chain.actionableStep}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {insight.sourceReferences?.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => openSourceInspector(src)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 text-[11px] transition"
                          title="Inspect Source Text Excerpt"
                        >
                          <FileText className="w-3 h-3 text-indigo-400" />
                          <span>{src.documentName}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            // Render Standard Fact, Inference, or Recommendation Card
            return (
              <div
                key={inId}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getInsightTypeBadge(insight.insightType)}`}>
                    {insight.insightType}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Confidence: {insight.confidence}%
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {insight.content}
                </p>

                {insight.evidenceChain?.actionableStep && (
                  <p className="text-xs text-slate-400">
                    <strong className="text-indigo-400">Recommended Action:</strong> {insight.evidenceChain.actionableStep}
                  </p>
                )}

                {/* Source chips */}
                {insight.sourceReferences?.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                    {insight.sourceReferences.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => openSourceInspector(src)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 border border-slate-800 text-[11px] hover:border-indigo-500/40 transition"
                      >
                        <FileText className="w-3 h-3 text-indigo-400" />
                        <span>{src.documentName}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
