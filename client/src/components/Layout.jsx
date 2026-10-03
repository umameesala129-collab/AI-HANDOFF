import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import PresentationModeModal from './PresentationModeModal';
import SourceViewerModal from './SourceViewerModal';

export default function Layout({ activeProject, onUpdateProject }) {
  const { id } = useParams();
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [sourceViewerData, setSourceViewerData] = useState(null);

  const openSourceInspector = (sourceInfo) => {
    setSourceViewerData(sourceInfo);
  };

  const closeSourceInspector = () => {
    setSourceViewerData(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900">
      <Navbar
        activeProject={activeProject}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <Sidebar
          projectId={id}
          onOpenPresentation={() => setIsPresentationOpen(true)}
        />

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-8">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ openSourceInspector, activeProject, onUpdateProject }} />
          </div>
        </main>
      </div>

      <PresentationModeModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        projectData={activeProject}
      />

      <SourceViewerModal
        isOpen={!!sourceViewerData}
        onClose={closeSourceInspector}
        sourceInfo={sourceViewerData}
      />
    </div>
  );
}
