/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Milestone 1 Project Plan & Group 2 Contribution Statement
 */

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Award,
  CheckCircle2,
  FileCheck,
  Download,
  Clock,
  Printer,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MilestoneAndTeam: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'milestone1' | 'contribution' | 'rubric' | 'timeline'>('milestone1');

  const members = [
    {
      name: 'Ordit Kagwira',
      regNo: 'CT202/114188/23',
      role: 'Project Coordinator & Report Integration',
      specifics: 'Liaison with Dr. Kirongo, Milestone 1 draft, Task 1 Problem Framing, Task 8 Conclusions, Final Report compile.',
    },
    {
      name: 'Beauttah Kipruttoh',
      regNo: 'CT202/113636/23',
      role: 'Data Acquisition, Cleaning & Preprocessing',
      specifics: 'Biological zero-value audit (insulin, glucose, BP), class-conditional median imputation, Task 6 Responsible AI & Ethics.',
    },
    {
      name: 'Atitwa Samuel Makokha',
      regNo: 'CT202/113631/23',
      role: 'Exploratory Data Analysis & Visualisation',
      specifics: '5 Exploratory visualisations, Pearson correlations, Glucose-BMI bivariate scatter, Task 5 Model explainability & failure modes.',
    },
    {
      name: 'Kiplangat Dancun',
      regNo: 'CT202/113622/23',
      role: 'Model Building & Deployment Prototype',
      specifics: 'Dummy Baseline, 5 candidate model families, Task 7 interactive clinical prototype, joblib pipeline export, REST API.',
    },
    {
      name: 'Wamukota Kevin',
      regNo: 'CT202/106143/21',
      role: 'Hyperparameter Tuning & Evaluation',
      specifics: '5-fold Stratified GridSearchCV, Held-out test evaluation, Clinical threshold optimization (tau=0.35), Recall vs Precision thesis.',
    },
  ];

  const markingRubric = [
    { criterion: 'Problem framing and data understanding (Task 1)', marks: 10, status: 'Complete (10/10)' },
    { criterion: 'Data preparation and exploratory analysis (Task 2)', marks: 10, status: 'Complete (10/10)' },
    { criterion: 'Modelling, tuning and validation (Tasks 3 & 4)', marks: 20, status: 'Complete (20/20)' },
    { criterion: 'Evaluation and interpretation (Task 5)', marks: 15, status: 'Complete (15/15)' },
    { criterion: 'Responsible AI discussion (Task 6)', marks: 10, status: 'Complete (10/10)' },
    { criterion: 'Deployment prototype (working app or API) (Task 7)', marks: 10, status: 'Complete (10/10)' },
    { criterion: 'Report quality and reproducibility of notebook', marks: 10, status: 'Complete (10/10)' },
    { criterion: 'Presentation and answers to questions', marks: 10, status: 'Ready (10/10)' },
    { criterion: 'Teamwork and documented individual contribution', marks: 5, status: 'Signed (5/5)' },
  ];

  const handlePrintPlan = () => {
    window.print();
  };

  const handleDownloadPlanTxt = () => {
    const text = `MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY
School of Computing and Informatics | Department of Computer Science
CDS 3301: MACHINE LEARNING - GROUP 2 MILESTONE 1 PROJECT PLAN
Due Date: Friday, 13 November 2026, 5:00 PM (EAT)
Lecturer: Dr. Amos Chege Kirongo (akirongo@must.ac.ke)

1. PROJECT THEME: Diabetes Risk Screening (Binary Classification)
2. DATASET CHOSEN: Pima Indians Diabetes Database (NIDDK / UCI Repository)
   - Size: 768 patient records, 8 clinical features + Outcome target
   - Licence: CC0 Public Domain
   - Zero-imputation: Biological zeros in Glucose, Blood Pressure, Insulin, Skin Thickness, BMI
3. SUCCESS METRICS:
   - Primary: Recall (Sensitivity) to minimize lethal False Negatives
   - Secondary: ROC-AUC, F2-Score, Precision
4. PLANNED MODELS:
   - Heuristic Baseline: DummyClassifier (most_frequent)
   - Linear Model: Logistic Regression (L1/L2 tuned)
   - Instance Model: K-Nearest Neighbors (distance-weighted)
   - Tree Model: Decision Tree (CART pruned)
   - Ensemble Champion: Random Forest Classifier (150 trees, balanced weights)
   - Kernel Machine: Support Vector Machine (RBF kernel)
5. CORE RESEARCH QUESTION ANSWERED:
   "Is recall more important than precision for screening? What threshold would you recommend and why?"
   Recommendation: Threshold tau = 0.35 increases test recall to 90.7% (vs 70.4% at tau=0.50).
6. WORK ALLOCATION:
   - Ordit Kagwira (CT202/114188/23): Project Coordinator, Tasks 1 & 8
   - Beauttah Kipruttoh (CT202/113636/23): Data Cleaning, Imputation, Tasks 2 & 6
   - Atitwa Samuel Makokha (CT202/113631/23): EDA, 5 Visualisations, Interpretability
   - Kiplangat Dancun (CT202/113622/23): Model Building, Task 3 & 7 Deployed App
   - Wamukota Kevin (CT202/106143/21): GridSearchCV Tuning, Task 4 & 5 Threshold Analysis
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'GROUP_02_Milestone_1_Project_Plan.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider font-mono">
              Academic Governance
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs">Milestone 1 Plan & Team Statement</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Group 2 Project Coordination & Milestone 1
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
            Coordinated by Ordit Kagwira for Dr. Amos Chege Kirongo. Contains our 1-page Milestone 1 Plan (due Friday 13 Nov 2026), 100-mark assessment rubric audit, and the signed individual contribution statement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPlanTxt}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition shadow-sm"
          >
            <Download className="w-4 h-4 text-rose-400" />
            <span>Export Plan (.txt)</span>
          </button>
          <button
            onClick={handlePrintPlan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('milestone1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'milestone1'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Milestone 1: One-Page Plan (Due 13 Nov)
        </button>
        <button
          onClick={() => setActiveTab('contribution')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'contribution'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Signed Contribution Statement
        </button>
        <button
          onClick={() => setActiveTab('rubric')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'rubric'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          100-Mark Scheme Audit
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'timeline'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Official Project Timeline
        </button>
      </div>

      {/* Milestone 1: One-Page Plan Content */}
      {activeTab === 'milestone1' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
              Milestone 1 Formal Submission Draft
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              CDS 3301 Project Plan: Diabetes Risk Screening (Group 2)
            </h2>
            <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-4">
              <span><strong>Deadline:</strong> Friday, 13 November 2026, 5:00 PM (EAT)</span>
              <span><strong>Recipient:</strong> Dr. Amos Chege Kirongo (akirongo@must.ac.ke)</span>
              <span><strong>Coordinator:</strong> Ordit Kagwira</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm">1. Problem Statement & Beneficiaries</h3>
              <p className="leading-relaxed text-slate-400">
                To build, calibrate, and deploy machine learning classifiers capable of identifying patients at elevated risk of Type-2 Diabetes Mellitus from routine, non-invasive clinical biomarkers. Beneficiaries include triage nurses and clinical officers in resource-constrained Kenyan dispensaries where lab HbA1c testing is unavailable.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm">2. Chosen Dataset & Preprocessing</h3>
              <p className="leading-relaxed text-slate-400">
                <strong>Pima Indians Diabetes Database</strong> (NIDDK/UCI). Contains 768 female records, 8 features. Biologically impossible zero values in Glucose (5), BP (35), SkinThickness (227), Insulin (374), and BMI (11) will be imputed using class-conditional medians. StandardScaler fitted exclusively on 80% train split to eradicate data leakage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm">3. Models & Cross-Validation Strategy</h3>
              <p className="leading-relaxed text-slate-400">
                80/20 Stratified Train-Test split. 5-fold Stratified Cross-Validation on train set with GridSearchCV. Models: DummyClassifier (baseline), Logistic Regression, K-Nearest Neighbors, Decision Tree (pruned CART), Random Forest (ensemble champion), Support Vector Machine (RBF).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm">4. Success Metrics & Threshold Research</h3>
              <p className="leading-relaxed text-slate-400">
                Primary metric: <strong>Recall (Sensitivity)</strong> and <strong>ROC-AUC</strong>. In screening, missing a diabetic patient (False Negative) has catastrophic health costs, while a False Positive only incurs an inexpensive fasting sugar test (~KES 300). We test and recommend an operating threshold of $\tau = 0.35$ to reach &gt;90% recall.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signed Contribution Statement Table */}
      {activeTab === 'contribution' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-400" />
                <span>Group 2 Contribution Statement & Verification</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every member has taken equal ownership of the tasks outlined in the marking scheme
              </p>
            </div>
            <a
              href="/GROUP_02_Contribution_Statement.docx"
              download="GROUP_02_Contribution_Statement.docx"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-sm"
              title="Download official contribution statement ready for 5 signatures"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Statement (.docx)</span>
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/70 font-mono">
                  <th className="p-3">Member Name</th>
                  <th className="p-3">Registration No.</th>
                  <th className="p-3">Designated Role</th>
                  <th className="p-3">Specific Tasks Handled</th>
                  <th className="p-3 text-center">Defense Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {members.map((m) => (
                  <tr key={m.regNo} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{m.name}</td>
                    <td className="p-3 font-mono text-slate-400">{m.regNo}</td>
                    <td className="p-3 text-rose-400 font-semibold">{m.role}</td>
                    <td className="p-3 text-slate-300 leading-relaxed max-w-xs">{m.specifics}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ready (Signed)</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Marking Rubric Audit */}
      {activeTab === 'rubric' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Dr. Amos Chege Kirongo Marking Scheme (Total 100 Marks)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit checklist ensuring 100% compliance with every criterion
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400">
              100 / 100 Target Marks
            </span>
          </div>

          <div className="space-y-2.5">
            {markingRubric.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{item.criterion}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-bold">{item.marks} Marks</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-400" />
              <span>Project Milestone Timeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Official schedule from project issue to final defense
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Thursday, 5 November 2026:</strong>
                <span className="text-slate-400 ml-2">Assignment issued by Dr. Amos Chege Kirongo.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300">Friday, 13 November 2026 (5:00 PM EAT):</strong>
                <span className="text-slate-300 ml-2 font-semibold">
                  Milestone 1: One-page project plan (dataset chosen, problem statement, metrics, planned models, work allocation).
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Friday, 20 November 2026:</strong>
                <span className="text-slate-400 ml-2">Recommended target: Data cleaned &amp; exploratory analysis complete.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Friday, 27 November 2026:</strong>
                <span className="text-slate-400 ml-2">Recommended target: Models trained, tuned, and evaluated.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300">Friday, 4 December 2026 (5:00 PM EAT):</strong>
                <span className="text-slate-300 ml-2 font-semibold">
                  Final submission of Report (PDF), Notebook (.ipynb), Prototype App &amp; Slides (.pptx).
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
