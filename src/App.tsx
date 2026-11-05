/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * School of Computing and Informatics | Department of Computer Science
 * CDS 3301: Machine Learning - Group 2 Diabetes Risk Screening Portal
 */

import React, { useState } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { ClinicalCalculator } from './components/Prototype/ClinicalCalculator';
import { TaskExplorer } from './components/Tasks/TaskExplorer';
import { FullReportView } from './components/AcademicReport/FullReportView';
import { JupyterNotebookView } from './components/Notebook/JupyterNotebookView';
import { SlideDeckView } from './components/Presentation/SlideDeckView';
import { MilestoneAndTeam } from './components/Milestone/MilestoneAndTeam';
import { ModelMonitoring } from './components/Prototype/ModelMonitoring';
import { ApiExportModal } from './components/Prototype/ApiExportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('prototype');
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'prototype' && <ClinicalCalculator />}
        {activeTab === 'tasks' && <TaskExplorer />}
        {activeTab === 'report' && <FullReportView />}
        {activeTab === 'notebook' && <JupyterNotebookView />}
        {activeTab === 'slides' && <SlideDeckView />}
        {activeTab === 'milestone' && <MilestoneAndTeam />}
        {activeTab === 'monitoring' && <ModelMonitoring />}
      </main>

      {/* REST API & Python Code Modal */}
      <ApiExportModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-400">
            <span className="font-semibold text-slate-300">
              Meru University of Science and Technology (MUST)
            </span>
            <span>•</span>
            <span>School of Computing and Informatics</span>
            <span>•</span>
            <span>Department of Computer Science</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">CDS 3301: Machine Learning</span>
          </div>
          <div>
            Group 2: Ordit Kagwira (CT202/114188/23), Beauttah Kipruttoh (CT202/113636/23), Atitwa Samuel Makokha (CT202/113631/23), Kiplangat Dancun (CT202/113622/23), Wamukota Kevin (CT202/106143/21).
          </div>
          <div className="text-[11px] text-slate-600">
            Course Lecturer: Dr. Amos Chege Kirongo (<a href="mailto:akirongo@must.ac.ke" className="hover:text-emerald-400 transition">akirongo@must.ac.ke</a>) • All Deliverables Prepared for Milestone 1 &amp; Final Assessment.
          </div>
        </div>
      </footer>
    </div>
  );
}
