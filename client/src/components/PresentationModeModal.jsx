import React, { useState } from 'react';
import Modal from './Modal';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileQuestion,
  Files,
  Cpu,
  Compass,
  Calendar,
  Layers,
  AlertTriangle,
  ArrowRightCircle,
  FileCheck
} from 'lucide-react';

export default function PresentationModeModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'The Challenge: The Context Recovery Problem',
      step: '1. The Problem',
      icon: <FileQuestion className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="max-w-3xl text-base leading-relaxed text-slate-600">
            Project knowledge gets scattered across notes, task lists, client messages, and technical files.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="mb-1 text-sm font-semibold text-rose-700">Lost time</h4>
              <p className="text-xs text-slate-600">New teammates have to piece the story together from scratch.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="mb-1 text-sm font-semibold text-amber-700">Mixed signals</h4>
              <p className="text-xs text-slate-600">Older notes can conflict with newer decisions.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="mb-1 text-sm font-semibold text-cyan-700">Missing reasons</h4>
              <p className="text-xs text-slate-600">Important choices lose meaning when the source is hard to find.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Scattered Information: Multi-Format Document Ingestion',
      step: '2. Scattered Information',
      icon: <Files className="w-8 h-8 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <p className="max-w-3xl text-base leading-relaxed text-slate-600">
            Add common project files. Their text and source details stay together for review.
          </p>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 font-mono">
              <span>DOCUMENT SOURCE</span>
              <span>TYPE & PURPOSE</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-white font-medium">Sprint_24_Meeting_Notes.txt</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Meeting Notes</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-white font-medium">Project_Tasks_Backlog.csv</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Task List</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-white font-medium">Client_Direct_Approval.docx</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Client Communication</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-white font-medium">Architecture_Handoff_Spec.pdf</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Technical Documentation</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Cross-Document AI Reasoning & Conflict Detection',
      step: '3. AI Analysis',
      icon: <Cpu className="w-8 h-8 text-cyan-400" />,
      content: (
        <div className="space-y-4">
          <p className="max-w-3xl text-base leading-relaxed text-slate-600">
            Compare updates over time to see what changed and which source takes precedence.
          </p>
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/50 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> How the update resolves an earlier blocker
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-semibold block mb-1">Doc 1: Sprint 24</span>
                "Payment integration is blocked until client confirms provider."
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-semibold block mb-1">Doc 3: Client Memo</span>
                "Stripe has been approved as payment provider for all clinics."
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/30">
                <span className="text-cyan-400 font-semibold block mb-1">AI Synthesis</span>
                "Blocker resolved: provider confirmed. Payment integration is actionable."
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Reconstructed Project Context & Health',
      step: '4. Reconstructed Context',
      icon: <Compass className="w-8 h-8 text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <p className="max-w-3xl text-base leading-relaxed text-slate-600">
            Bring current status, readiness, and supporting evidence into one overview.
          </p>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Current Situation</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                On Track
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Payment gateway integration is actively underway unblocked by Stripe approval. Next critical milestone is end-to-end webhook validation before Nov 15.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              <div>
                <span className="text-xs text-slate-400">Readiness Score</span>
                <p className="text-lg font-bold text-indigo-400">88%</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Tasks Verified</span>
                <p className="text-lg font-bold text-emerald-400">5 Items</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Sources Linked</span>
                <p className="text-lg font-bold text-cyan-400">100%</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Chronological Context Timeline with Evidence',
      step: '5. Timeline',
      icon: <Calendar className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-3">
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
            Follow key events in order and open the source behind each one.
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-800/80 border-l-4 border-indigo-500 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Oct 10: PostgreSQL Migration Complete</p>
                <span className="text-slate-400">Source: Architecture_Handoff_Spec.pdf</span>
              </div>
              <span className="text-slate-400">Verified</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border-l-4 border-rose-500 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Oct 24: Payment Blocker Raised</p>
                <span className="text-slate-400">Source: Sprint_24_Meeting_Notes.txt</span>
              </div>
              <span className="text-rose-400">Sprint 24</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border-l-4 border-emerald-500 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Oct 28: Stripe Approved by Client CMIO</p>
                <span className="text-slate-400">Source: Client_Direct_Approval.docx</span>
              </div>
              <span className="text-emerald-400">Resolved</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Important Decisions & "Why Was This Made?"',
      step: '6. Decisions',
      icon: <Layers className="w-8 h-8 text-purple-400" />,
      content: (
        <div className="space-y-4">
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
            Keep the reasoning behind important project choices easy to find.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
            <h4 className="font-semibold text-white text-sm">Decision: Adopt Stripe as Primary Healthcare Payment Gateway</h4>
            <p className="text-xs text-slate-300"><strong className="text-purple-400">Reason:</strong> Client confirmed the Business Associate Agreement (BAA) meets HIPAA compliance standards.</p>
            <p className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded">
              "Dr. Harrison confirmed the Business Associate Agreement (BAA) meets our strict HIPAA guidelines." — Client_Direct_Approval.docx (Page 1)
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Known Issues, Blockers & Suggested Actions',
      step: '7. Issues & Blockers',
      icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
      content: (
        <div className="space-y-4">
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
            Make active blockers visible, with a practical next step beside each one.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400">Medium Severity • Open</span>
              <span className="text-xs text-slate-400">Detected: Oct 24, 2026</span>
            </div>
            <h4 className="font-semibold text-white text-sm">Missing SureScripts Sandbox API Credentials</h4>
            <p className="text-xs text-slate-300">
              <strong className="text-emerald-400">Suggested Action:</strong> Contact Dr. Harrison and clinic IT lead to obtain OAuth sandbox keys prior to sprint kickoff.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Recommended Next Actions for Incoming Owners',
      step: '8. Next Actions',
      icon: <ArrowRightCircle className="w-8 h-8 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
            Give the next owner a short list of work, people, and dates to pick up.
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
              <p className="font-semibold text-indigo-200">1. Execute Stripe Live Webhook Handlers</p>
              <p className="text-slate-400">Priority: Immediate • Owner: Alex Rivers • Target: Nov 15, 2026</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <p className="font-semibold text-slate-200">2. Obtain SureScripts Pharmacy Sandbox Keys</p>
              <p className="text-slate-400">Priority: High • Owner: Elena Rostova / Incoming PM</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Downloadable & Printable Handoff Report',
      step: '9. Handoff Report',
      icon: <FileCheck className="w-8 h-8 text-emerald-400" />,
      content: (
        <div className="space-y-4 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <FileCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h4 className="text-lg font-bold text-white">Full Structured Handoff Package Generated</h4>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-600">
            Bring project status, decisions, sources, and next steps into one shareable report.
          </p>
          <div className="pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium text-white transition shadow-lg shadow-indigo-600/30 text-sm"
            >
              Open the workspace
            </button>
          </div>
        </div>
      )
    }
  ];

  const slide = slides[currentSlide];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project walkthrough"
      subtitle={`Step ${String(currentSlide + 1).padStart(2, '0')} of 09`}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5 sm:space-y-6">
        {/* Stepper bar */}
        <nav aria-label="Presentation steps" className="flex items-center gap-1 overflow-x-auto pb-1">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to step ${idx + 1}: ${s.step}`}
              aria-current={idx === currentSlide ? 'step' : undefined}
              title={s.step}
              className={`flex h-7 min-w-7 flex-1 items-center justify-center rounded-md border text-[9px] font-semibold transition-colors ${
                idx === currentSlide
                  ? 'border-[#285d4a] bg-[#285d4a] text-white'
                  : idx < currentSlide
                  ? 'border-[#bfd3c5] bg-[#e6efe6] text-[#315c4d]'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {String(idx + 1).padStart(2, '0')}
            </button>
          ))}
        </nav>

        {/* Slide Header */}
        <div className="flex items-start gap-3 border-b border-slate-200 pb-4 sm:items-center sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100 sm:h-12 sm:w-12">
            {slide.icon}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b6840]">{slide.step.replace(/^\d+\.\s*/, '')}</span>
            <h3 className="mt-0.5 font-serif text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">{slide.title}</h3>
          </div>
        </div>

        {/* Slide Content */}
        <div key={currentSlide} className="min-h-[180px] max-h-[32vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-1 duration-200 sm:max-h-[42vh]">
          {slide.content}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition ${
              currentSlide === 0
                ? 'cursor-not-allowed border-slate-200 text-slate-400 opacity-60'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <span aria-live="polite" className="text-xs tabular-nums text-slate-500">{currentSlide + 1} / {slides.length}</span>

          <button
            onClick={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide(prev => prev + 1);
              } else {
                onClose();
              }
            }}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-[#285d4a] px-4 text-xs font-semibold text-white transition hover:bg-[#1f4a3b]"
          >
            {currentSlide < slides.length - 1 ? (
              <>
                Next <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              'Finish Walkthrough'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
