/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Group 2 Header & Navigation Bar
 */

import React from 'react';
import {
  Activity,
  Database,
  BarChart3,
  BookOpen,
  FileCode2,
  Presentation,
  Users,
  Radio,
  Code2,
  GraduationCap,
  Download,
  Server,
  CheckCircle2,
} from 'lucide-react';

export type TabType =
  | 'prototype'
  | 'dataset'
  | 'evaluation'
  | 'report'
  | 'notebook'
  | 'slides'
  | 'milestone'
  | 'monitoring';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenApiModal: () => void;
  onOpenChecklistModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiModal,
  onOpenChecklistModal,
}) => {
  const tabs = [
    {
      id: 'prototype' as TabType,
      label: 'Clinical Screener',
      icon: Activity,
      badge: 'Live FastAPI',
      color: 'text-emerald-400',
    },
    {
      id: 'dataset' as TabType,
      label: 'Dataset Explorer',
      icon: Database,
      badge: 'N=768 EDA',
      color: 'text-sky-400',
    },
    {
      id: 'evaluation' as TabType,
      label: 'Model Evaluation',
      icon: BarChart3,
      badge: 'ROC & PR Curves',
      color: 'text-purple-400',
    },
    {
      id: 'report' as TabType,
      label: 'Academic Report',
      icon: BookOpen,
      badge: 'PDF / Print',
      color: 'text-indigo-400',
    },
    {
      id: 'notebook' as TabType,
      label: 'ML Notebook',
      icon: FileCode2,
      badge: '.ipynb Ready',
      color: 'text-amber-400',
    },
    {
      id: 'slides' as TabType,
      label: '10-Min Defense',
      icon: Presentation,
      badge: '12 Slides',
      color: 'text-rose-400',
    },
    {
      id: 'milestone' as TabType,
      label: 'Team & Milestones',
      icon: Users,
      badge: 'Group 2',
      color: 'text-teal-400',
    },
    {
      id: 'monitoring' as TabType,
      label: 'MLOps Drift',
      icon: Radio,
      badge: 'PSI Alerts',
      color: 'text-cyan-400',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Institutional Header Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold tracking-wide text-slate-200">
                MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY
              </div>
              <div className="text-slate-400 text-[11px] flex items-center gap-2">
                <span>School of Computing &amp; Informatics</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">Department of Computer Science</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              CDS 3301: Machine Learning
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FastAPI Backend Active (Port 8001)</span>
            </span>

            <button
              onClick={onOpenChecklistModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm animate-pulse hover:animate-none"
              title="View Submission Correction Checklist (9 of 9 Completed - 100%)"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Checklist (9/9 • 100%)</span>
            </button>

            <a
              href="/GROUP_02_Diabetes_Risk_Screening_Prototype.zip"
              download="GROUP_02_Diabetes_Risk_Screening_Prototype.zip"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm"
              title="Download full project repository and deliverables as ZIP archive"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Project ZIP</span>
            </a>

            <button
              onClick={onOpenApiModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition shadow-sm"
              title="View REST API specifications and code snippets"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>API Specs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-inner border border-slate-700/80 ring-1 ring-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
