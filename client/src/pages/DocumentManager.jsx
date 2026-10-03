import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import {
  FileUp,
  FileText,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  UploadCloud,
  FileCheck,
  Sparkles
} from 'lucide-react';

export default function DocumentManager() {
  const { id } = useParams();
  const { openSourceInspector } = useOutletContext();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Manual paste or file upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('Meeting Notes');
  const [fileType, setFileType] = useState('TXT');
  const [dragActive, setDragActive] = useState(false);

  // View document text modal
  const [viewingDoc, setViewingDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}/documents`);
      if (res.data?.success) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load documents:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setFileName(file.name);
    const ext = file.name.split('.').pop().toUpperCase();
    if (['PDF', 'DOCX', 'TXT', 'CSV'].includes(ext)) {
      setFileType(ext);
    } else {
      setFileType('TXT');
    }
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('originalName', fileName || 'Document.txt');
      formData.append('category', category);
      formData.append('fileType', fileType);
      if (rawText) {
        formData.append('textContent', rawText);
      }

      const res = await api.post(`/projects/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setRawText('');
        setFileName('');
        await fetchDocuments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Document upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReprocess = async (docId) => {
    try {
      const res = await api.post(`/documents/${docId}/reprocess`);
      if (res.data?.success) {
        await fetchDocuments();
      }
    } catch (err) {
      console.error('Reprocess failed:', err.message);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await api.delete(`/documents/${docId}`);
      if (res.data?.success) {
        await fetchDocuments();
      }
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleDownloadOriginal = async (doc) => {
    try {
      const docId = doc._id || doc.id;
      const res = await api.get(`/documents/${docId}/file`, { responseType: 'blob' });
      const objectUrl = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      alert(err.response?.data?.message || 'Original file download failed');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Processing':
      case 'Analyzing':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse';
      case 'Uploading':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Failed':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Meeting Notes':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Task List':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Client Communication':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Technical Documentation':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Requirements':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Project Report':
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
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Documents
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5">
            Project documents
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep project notes, plans, and specifications together with their extracted text and source details.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedFile(null);
            setFileName('');
            setRawText('');
            setIsUploadModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/20 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Add document</span>
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-3 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Drop project files here</p>
          <p className="text-xs text-slate-400 mt-0.5">PDF, DOCX, TXT, or CSV | Up to 10 MB</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt,.csv"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* Ingested Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Your documents</span>
            <span className="text-xs font-normal text-slate-400">({documents.length})</span>
          </h2>
          <button
            onClick={fetchDocuments}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12">
            <Loader message="Fetching document catalog..." />
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
            No documents uploaded yet. Upload project documents or try the SmartClinic demo to see multi-format processing.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const dId = doc._id || doc.id;
              return (
                <div
                  key={dId}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-indigo-400">
                        {doc.fileType === 'CSV' ? (
                          <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm leading-tight break-all">
                          {doc.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getCategoryColor(doc.category)}`}>
                            {doc.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {doc.fileType} • {doc.fileSize || '3.4 KB'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getStatusBadge(doc.processingStatus)}`}>
                      {doc.processingStatus}
                    </span>
                  </div>

                  {/* Extraction Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-center">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Pages</span>
                      <span className="font-medium text-slate-200">{doc.pageCount || 1}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Lines</span>
                      <span className="font-medium text-slate-200">{doc.lineCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Chunks</span>
                      <span className="font-medium text-slate-200">{doc.chunks?.length || 1}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Text & Chunks</span>
                    </button>

                    {doc.hasOriginalFile ? (
                      <button
                        onClick={() => handleDownloadOriginal(doc)}
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Original file</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500">Original unavailable</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReprocess(dId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Reprocess Document"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(dId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload & Categorize Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Add a document"
        subtitle="Choose a source type and add the project file or text."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Document Name *</label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Sprint_25_Retro_Notes.txt"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Meeting Notes">Meeting Notes</option>
                <option value="Task List">Task List</option>
                <option value="Project Report">Project Report</option>
                <option value="Client Communication">Client Communication</option>
                <option value="Requirements">Requirements</option>
                <option value="Technical Documentation">Technical Documentation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">File Format</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="TXT">TXT (Plain Text)</option>
                <option value="CSV">CSV (Spreadsheet Backlog)</option>
                <option value="PDF">PDF (Document)</option>
                <option value="DOCX">DOCX (Word Document)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Document Text Content {selectedFile ? '(Optional text for analysis)' : '(Paste raw notes)'}
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste document text, meeting conclusions, task lists, or client emails here..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm flex items-center gap-1.5"
            >
              {uploading ? 'Processing Chunks...' : 'Ingest & Clean'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Extracted Text & Chunks Modal */}
      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title={`Extracted Content: ${viewingDoc.name}`}
          subtitle={`${viewingDoc.category} • ${viewingDoc.chunks?.length || 1} text chunks generated`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Extracted Text Chunks
              </span>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {['PDF', 'DOCX'].includes(viewingDoc.fileType) && !viewingDoc.hasOriginalFile ? (
                  <p className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200">
                    This document’s original file was not retained, so these stored chunks are not readable document text. Re-upload the file to make it available for download.
                  </p>
                ) : (
                  viewingDoc.chunks?.map((chunk, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono">
                        <span>Chunk #{i + 1} — Page {chunk.page || 1}</span>
                        <span>{chunk.section}</span>
                      </div>
                      <p className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                        {chunk.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {viewingDoc.hasOriginalFile ? (
                <button
                  onClick={() => handleDownloadOriginal(viewingDoc)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Original
                </button>
              ) : (
                <p className="text-xs text-amber-300">
                  Original file is unavailable. Re-upload it to enable download.
                </p>
              )}
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
