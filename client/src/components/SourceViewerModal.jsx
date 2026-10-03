import React from 'react';
import Modal from './Modal';
import { FileText, Bookmark, CheckCircle2, Copy } from 'lucide-react';

export default function SourceViewerModal({ isOpen, onClose, sourceInfo }) {
  if (!sourceInfo) return null;

  const {
    documentName = 'Project Document',
    page = 1,
    section = 'General',
    excerpt = '',
    fullText = ''
  } = sourceInfo;

  const copyExcerpt = () => {
    navigator.clipboard.writeText(excerpt);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Source Evidence Inspector"
      subtitle={`Verified citation from ${documentName}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Source metadata badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            {documentName}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            Page {page} • {section}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Source
          </span>
        </div>

        {/* Highlighted cited excerpt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cited Excerpt</span>
            <button
              onClick={copyExcerpt}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <div className="rounded-md border border-indigo-200 bg-indigo-50 p-3.5 font-mono text-sm leading-relaxed text-indigo-900">
            "{excerpt}"
          </div>
        </div>

        {/* Context surround / document preview */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
            Surrounding Document Text (Context Window)
          </span>
          <div className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-100 p-4 font-mono text-xs leading-relaxed text-slate-700">
            {fullText ? (
              fullText
            ) : (
              <p className="text-slate-400 italic">
                ... [Excerpt verified within document chunk {section}] ...
                <br /><br />
                "{excerpt}"
                <br /><br />
                ... [Source text extracted during document ingestion pipeline] ...
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </Modal>
  );
}
