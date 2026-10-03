import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectOverview from './pages/ProjectOverview';
import DocumentManager from './pages/DocumentManager';
import CrossDocReasoning from './pages/CrossDocReasoning';
import ContextIntelligence from './pages/ContextIntelligence';
import ChatAndReport from './pages/ChatAndReport';

export default function App() {
  const [activeProject, setActiveProject] = useState(null);

  const handleUpdateActiveProject = (proj) => {
    setActiveProject(proj);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <Layout
                  activeProject={activeProject}
                  onUpdateProject={handleUpdateActiveProject}
                />
              }
            >
              {/* Central Portfolio Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* 5 Core Feature Routes */}
              <Route path="/projects/:id/overview" element={<ProjectOverview />} />
              <Route path="/projects/:id/documents" element={<DocumentManager />} />
              <Route path="/projects/:id/reasoning" element={<CrossDocReasoning />} />
              <Route path="/projects/:id/context" element={<ContextIntelligence />} />
              <Route path="/projects/:id/handoff" element={<ChatAndReport />} />

              {/* Shorthand redirect */}
              <Route
                path="/projects/:id"
                element={<Navigate to="overview" replace />}
              />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
