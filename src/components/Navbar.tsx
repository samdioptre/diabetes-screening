/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Group 2 Header & Navigation Bar
 */

import React from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  FileCode2,
  Presentation,
  Users,
  Radio,
  Code2,
  GraduationCap,
} from 'lucide-react';

export type TabType =
  | 'prototype'
  | 'tasks'
  | 'report'
  | 'notebook'
  | 'slides'
  | 'milestone'
  | 'monitoring'
  | 'api';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenApiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiModal,
}) => {
  const tabs = [
    {
      id: 'prototype' as TabType,
      label: 'Clinical Prototype',
      icon: Activity,
      badge: 'Task 7 Deployed',
      color: 'text-emerald-400',
    },
    {
      id: 'tasks' as TabType,
      label: 'Tasks 1–8 Explorer',
      icon: BarChart3,
      badge: 'EDA & Models',
      color: 'text-sky-400',
    },
    {
      id: 'report' as TabType,
      label: '12-Page Report',
      icon: BookOpen,
      badge: 'PDF / Print',
      color: 'text-indigo-400',
    },
    {
      id: 'notebook' as TabType,
      label: 'Jupyter Notebook',
      icon: FileCode2,
      badge: '.ipynb Ready',
      color: 'text-amber-400',
    },
    {
      id: 'slides' as TabType,
      label: '10-Min Presentation',
      icon: Presentation,
      badge: '12 Slides',
      color: 'text-purple-400',
    },
    {
      id: 'milestone' as TabType,
      label: 'Milestone 1 & Team',
      icon: Users,
      badge: 'Group 2',
      color: 'text-rose-400',
    },
    {
      id: 'monitoring' as TabType,
      label: 'Drift Monitor',
      icon: Radio,
      badge: 'PSI / MLOps',
      color: 'text-teal-400',
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
                <span>School of Computing & Informatics</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">Department of Computer Science</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              CDS 3301: Machine Learning
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-semibold">
              Group 2 (5 Members)
            </span>
            <span className="text-slate-400 hidden md:inline">
              Lecturer: <span className="text-slate-200 font-medium">Dr. Amos Chege Kirongo</span>
            </span>
            <button
              onClick={onOpenApiModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition shadow-sm"
              title="View REST API specifications and code snippets"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>REST API</span>
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
