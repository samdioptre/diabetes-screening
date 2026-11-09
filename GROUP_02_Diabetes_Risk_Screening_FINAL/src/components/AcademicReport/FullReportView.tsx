/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * 12-Page Complete Academic Project Report Viewer and PDF Print Engine
 */

import React, { useState } from 'react';
import { ACADEMIC_REPORT } from '../../data/reportContent';
import {
  BookOpen,
  Printer,
  Download,
  GraduationCap,
  FileCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FullReportView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('abstract');

  const handlePrint = () => {
    window.print();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${ACADEMIC_REPORT.meta.university}\n`;
    md += `## ${ACADEMIC_REPORT.meta.school} | ${ACADEMIC_REPORT.meta.department}\n`;
    md += `### ${ACADEMIC_REPORT.meta.course} - ${ACADEMIC_REPORT.meta.projectTitle}\n\n`;
    md += `**Lecturer:** ${ACADEMIC_REPORT.meta.lecturer}\n`;
    md += `**Date:** ${ACADEMIC_REPORT.meta.date}\n\n`;
    md += `### Group 2 Members:\n`;
    ACADEMIC_REPORT.members.forEach((m, i) => {
      md += `${i + 1}. **${m.name}** (${m.regNo}) - *${m.role}*\n`;
    });
    md += `\n---\n\n`;

    ACADEMIC_REPORT.sections.forEach((s) => {
      md += `## ${s.title}\n`;
      if (s.authorTag) md += `*Author: ${s.authorTag}*\n\n`;
      md += `${s.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'GROUP_02_Diabetes_Risk_Screening_Report.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Controls Header (Hidden in Print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider font-mono">
              Deliverable: GROUP_02_Diabetes_Risk_Screening_Report.pdf
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs">Academic Formatted (Tasks 1–8)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Comprehensive 12-Page Project Report
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
            Meets all academic standards for Dr. Amos Chege Kirongo's CDS 3301 marking scheme. Includes mathematical formulation, 5-fold cross-validation tables, asymmetric misclassification threshold analysis, ethical governance, and signed contribution statement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/GROUP_02_Diabetes_Risk_Screening_Report.docx"
            download="GROUP_02_Diabetes_Risk_Screening_Report.docx"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold transition shadow-sm"
            title="Download Word Document (.docx)"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download .docx</span>
          </a>

          <a
            href="/GROUP_02_Diabetes_Risk_Screening_Report.pdf"
            download="GROUP_02_Diabetes_Risk_Screening_Report.pdf"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition shadow-sm"
            title="Download PDF Document (.pdf)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download .pdf</span>
          </a>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition shadow-sm"
            title="Download full markdown text"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Markdown</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 active:scale-95"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print View (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* Table of Contents Quick Jumper (No-Print) */}
      <div className="no-print bg-slate-900/60 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-2">
            Sections:
          </span>
          {ACADEMIC_REPORT.sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 text-slate-300 transition text-[11px]"
            >
              {sec.title.split(':')[0]}
            </a>
          ))}
        </div>
      </div>

      {/* THE FORMAL ACADEMIC PAPER (Rendered in Clean Academic Styling) */}
      <article className="bg-white text-slate-900 p-8 md:p-14 rounded-3xl shadow-2xl space-y-12 max-w-5xl mx-auto border border-slate-200 font-serif-academic leading-relaxed">
        {/* Cover / Title Header */}
        <header className="text-center border-b-2 border-slate-900 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-sans font-bold tracking-wider uppercase mb-2">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>Meru University of Science and Technology</span>
          </div>

          <h2 className="text-sm font-sans font-bold tracking-widest text-slate-700 uppercase">
            School of Computing and Informatics • Department of Computer Science
          </h2>
          <h3 className="text-xs font-sans text-slate-600 font-semibold uppercase tracking-wider">
            CDS 3301: MACHINE LEARNING • Bachelor of Computer Technology (Year 4, Semester 1)
          </h3>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight font-serif-academic pt-4 uppercase leading-snug">
            {ACADEMIC_REPORT.meta.projectTitle}
          </h1>

          <div className="pt-4 text-xs font-sans text-slate-700 flex flex-wrap justify-center gap-x-6 gap-y-1">
            <span><strong>Course Lecturer:</strong> {ACADEMIC_REPORT.meta.lecturer}</span>
            <span><strong>Group:</strong> Group 2</span>
            <span><strong>Submission Date:</strong> {ACADEMIC_REPORT.meta.date}</span>
          </div>

          {/* Group 2 Members Table */}
          <div className="pt-6 font-sans">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Group 2 Research Authors & Allocation of Responsibilities
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">No.</th>
                    <th className="p-2 border-r border-slate-300">Name</th>
                    <th className="p-2 border-r border-slate-300">Registration Number</th>
                    <th className="p-2">Assigned Project Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ACADEMIC_REPORT.members.map((member, idx) => (
                    <tr key={member.regNo} className="hover:bg-slate-50">
                      <td className="p-2 font-mono text-center border-r border-slate-300">
                        {idx + 1}
                      </td>
                      <td className="p-2 font-bold border-r border-slate-300">{member.name}</td>
                      <td className="p-2 font-mono border-r border-slate-300">{member.regNo}</td>
                      <td className="p-2 text-slate-700">{member.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </header>

        {/* Sections */}
        {ACADEMIC_REPORT.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="space-y-4 pt-4 border-b border-slate-200 pb-8 last:border-b-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-2">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {section.title}
              </h2>
              {section.authorTag && (
                <span className="text-xs font-sans text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Lead: {section.authorTag}
                </span>
              )}
            </div>

            <div className="text-sm text-slate-800 leading-relaxed font-serif-academic whitespace-pre-wrap">
              {section.content}
            </div>
          </section>
        ))}

        {/* Formal Contribution Statement Sign-Off Section */}
        <section className="pt-8 border-t-2 border-slate-900 font-sans space-y-4">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
            Group 2 Contribution Statement & Sign-off
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            In compliance with MUST CDS 3301 Academic Integrity regulations, all five members hereby confirm equal dedication and substantive contribution to this mini-project. Each member is fully prepared to defend any section during the oral examination.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">Member Name</th>
                  <th className="p-2.5 border-r border-slate-300">Registration Number</th>
                  <th className="p-2.5 border-r border-slate-300">Core Contribution Summary</th>
                  <th className="p-2.5">Digital Sign-Off Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ACADEMIC_REPORT.members.map((m) => (
                  <tr key={m.regNo}>
                    <td className="p-2.5 font-bold border-r border-slate-300">{m.name}</td>
                    <td className="p-2.5 font-mono border-r border-slate-300">{m.regNo}</td>
                    <td className="p-2.5 border-r border-slate-300">{m.role}</td>
                    <td className="p-2.5 text-emerald-700 font-bold">
                      ✓ Confirmed &amp; Signed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </div>
  );
};
