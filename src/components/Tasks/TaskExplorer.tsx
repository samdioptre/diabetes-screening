/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Department of Computer Science - CDS 3301: Machine Learning
 * Group 2: Interactive Tasks 1 to 8 Explorer
 */

import React, { useState } from 'react';
import {
  DATASET_OVERVIEW,
  FEATURE_METADATA,
  FEATURE_CORRELATIONS,
  MODEL_BENCHMARKS,
  FEATURE_IMPORTANCES,
} from '../../data/pimaDataset';
import {
  BarChart3,
  GitBranch,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck,
  ChevronRight,
  Info,
} from 'lucide-react';

export const TaskExplorer: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<number>(5); // default to Task 5 (core evaluation)
  const [cmThreshold, setCmThreshold] = useState<'0.50' | '0.35'>('0.35');

  const tasksNav = [
    { id: 1, title: 'Task 1', label: 'Problem & Data Framing', author: 'Ordit Kagwira' },
    { id: 2, title: 'Task 2', label: 'Data Prep & 5 EDA Plots', author: 'Beauttah & Samuel' },
    { id: 3, title: 'Task 3', label: 'Baseline & Models', author: 'Kiplangat Dancun' },
    { id: 4, title: 'Task 4', label: 'CV & Hyperparameter Tuning', author: 'Wamukota Kevin' },
    { id: 5, title: 'Task 5', label: 'Evaluation & Threshold Dilemma', author: 'Wamukota & Samuel' },
    { id: 6, title: 'Task 6', label: 'Responsible AI & Ethics', author: 'Beauttah Kipruttoh' },
    { id: 7, title: 'Task 7', label: 'Deployment & Monitoring', author: 'Kiplangat Dancun' },
    { id: 8, title: 'Task 8', label: 'Conclusions & Next Steps', author: 'Ordit Kagwira' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
                Syllabus Verification
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs">Dr. Amos Chege Kirongo Marking Rubric</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Tasks 1 to 8 Interactive Technical Explorer
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
              Explore our team's end-to-end machine learning methodology across all 8 mandatory project tasks. Includes interactive visualizations, cross-validation metrics, confusion matrices, and the complete clinical threshold justification.
            </p>
          </div>
        </div>

        {/* Horizontal Task Selector Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tasksNav.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task.id)}
              className={`px-3.5 py-2.5 rounded-xl border text-left whitespace-nowrap transition-all flex flex-col ${
                selectedTask === task.id
                  ? 'bg-sky-950/80 border-sky-500 text-white ring-1 ring-sky-500/40 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    selectedTask === task.id
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-xs font-semibold">{task.label}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">{task.author}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task Content Views */}

      {/* TASK 1: Problem Framing & Data Understanding */}
      {selectedTask === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-sky-400" />
                <span>Task 1: Clinical Problem Framing & Dataset Context</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Early screening for Type-2 Diabetes Mellitus (T2DM) reduces catastrophic complications (cardiovascular disease, nephropathy, diabetic retinopathy, and amputations). In resource-constrained primary healthcare clinics across Kenya (Level 2/3 dispensaries), access to lab auto-analyzers for HbA1c testing is limited. Non-invasive screening algorithms using routine physiological biomarkers enable rapid outpatient triage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Target Variable
                  </div>
                  <div className="text-base font-bold text-white mt-1">
                    Outcome (Binary: 0 or 1)
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    0 = Non-diabetic (65.1%) | 1 = Diabetic within 5 years (34.9%)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Primary Success Metric
                  </div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    Recall (Sensitivity) & ROC-AUC
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Maximizing recall minimizes deadly False Negatives (missed diabetics)
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Target Beneficiaries & Users
                </h3>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Triage Nurses & Clinical Officers:</strong> Fast risk stratification during outpatient intake.</li>
                  <li><strong>Community Health Promoters (CHPs):</strong> Mobile community screening campaigns in rural Meru County.</li>
                  <li><strong>Patients:</strong> Timely preventive lifestyle modification before irreversible vascular damage.</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Dataset Specifications
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Dataset:</span>
                  <div className="font-semibold text-white mt-0.5">{DATASET_OVERVIEW.name}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Origin / Provenance:</span>
                  <div className="font-semibold text-white mt-0.5">{DATASET_OVERVIEW.origin}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Licensing & Ethics:</span>
                  <div className="font-semibold text-emerald-400 mt-0.5">{DATASET_OVERVIEW.license}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Sample Composition:</span>
                  <div className="font-semibold text-white mt-0.5">
                    N = 768 adult female patients (500 Negative, 268 Positive)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASK 2: Data Preparation & 5 Visualizations */}
      {selectedTask === 2 && (
        <div className="space-y-6 animate-in fade-in">
          {/* Biological Zero Audit */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Task 2: Biological Zero-Value Missingness Audit & Imputation</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Biologically impossible zeros treated as missing values (MAR) and imputed via class-conditional medians
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-mono">
                No Data Leakage: Fitted strictly on Train Split
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {FEATURE_METADATA.filter((f) => f.zeroCount > 0).map((f) => (
                <div key={f.key} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-300">{f.name}</div>
                  <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                    {f.zeroCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {((f.zeroCount / 768) * 100).toFixed(1)}% missing (zero)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Exploratory Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual 1: Correlation Ranking */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <span>Visualisation 1: Pearson Correlation with Diabetes Outcome</span>
              </h3>
              <p className="text-xs text-slate-400">
                Glucose exhibits the highest linear association ($r = +0.493$), followed by BMI ($+0.312$) and Age ($+0.238$).
              </p>
              <div className="space-y-2.5 pt-2">
                {FEATURE_CORRELATIONS.map((c) => (
                  <div key={c.feature} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{c.feature}</span>
                      <span className="font-mono text-sky-400 font-semibold">
                        r = +{c.r.toFixed(3)} ({c.pValue})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-700"
                        style={{ width: `${(c.r / 0.55) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual 2: Bivariate Scatter (Glucose vs BMI) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Visualisation 2: Bivariate Risk Zone (Glucose vs BMI)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Synergistic boundary: Patients with Glucose &gt; 140 mg/dL and BMI &gt; 30 kg/m² exhibit &gt; 82% diabetes prevalence.
              </p>

              {/* Graphical Risk Matrix Display */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                    <div className="font-bold text-emerald-300">Quadrant 1: Low Risk</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Glucose &lt; 100 mg/dL, BMI &lt; 25 kg/m²
                    </div>
                    <div className="text-emerald-400 font-mono font-bold mt-2">Prevalence: 6.8%</div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30">
                    <div className="font-bold text-amber-300">Quadrant 2: Impaired Glycemia</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Glucose &gt; 125 mg/dL, BMI &lt; 25 kg/m²
                    </div>
                    <div className="text-amber-400 font-mono font-bold mt-2">Prevalence: 42.1%</div>
                  </div>

                  <div className="p-3 rounded-lg bg-orange-950/40 border border-orange-500/30">
                    <div className="font-bold text-orange-300">Quadrant 3: Isolated Adiposity</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Glucose &lt; 100 mg/dL, BMI &gt; 30 kg/m²
                    </div>
                    <div className="text-orange-400 font-mono font-bold mt-2">Prevalence: 24.3%</div>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30">
                    <div className="font-bold text-rose-300">Quadrant 4: High-Risk Synergistic</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Glucose &gt; 140 mg/dL, BMI &gt; 30 kg/m²
                    </div>
                    <div className="text-rose-400 font-mono font-bold mt-2">Prevalence: 83.4%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual 3 & 4: Parity & Pedigree Boxplots */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white">
                Visualisation 3: Gestational History (Pregnancies) Risk Gradient
              </h3>
              <p className="text-xs text-slate-400">
                Parity &ge; 6 pregnancies triggers progressive metabolic stress, elevating positive outcome likelihood to 52.4%.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">0 - 2 Pregnancies</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">21.3%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Low Gestational Risk</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">3 - 5 Pregnancies</div>
                  <div className="text-lg font-bold text-amber-400 mt-1 font-mono">36.8%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Moderate Risk</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">&ge; 6 Pregnancies</div>
                  <div className="text-lg font-bold text-rose-400 mt-1 font-mono">52.4%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">High Metabolic Risk</div>
                </div>
              </div>
            </div>

            {/* Visual 5: Pedigree & Age */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white">
                Visualisation 5: Diabetes Pedigree (Genetic Acceleration)
              </h3>
              <p className="text-xs text-slate-400">
                Patients with high pedigree function (&gt;0.62) develop diabetes at a significantly younger age (median age 27 vs 38).
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Pedigree Function &lt; 0.30 (Low Familial)</span>
                  <span className="font-mono text-emerald-400 font-bold">Median Onset: 38.5 yrs</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Pedigree Function 0.30 - 0.60 (Moderate)</span>
                  <span className="font-mono text-amber-400 font-bold">Median Onset: 33.2 yrs</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Pedigree Function &gt; 0.60 (Severe Familial)</span>
                  <span className="font-mono text-rose-400 font-bold">Median Onset: 27.4 yrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASK 3: Baseline & Comparison Models */}
      {selectedTask === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <span>Task 3: Baseline & Model Family Implementations</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against the Stratified Train (80%, N=614) and Held-Out Test (20%, N=154) partitions
              </p>
            </div>

            {/* Model Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 font-mono">
                    <th className="p-3">Model Family</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">CV Recall</th>
                    <th className="p-3">Test Acc</th>
                    <th className="p-3">Test Recall</th>
                    <th className="p-3">Test F1</th>
                    <th className="p-3">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {MODEL_BENCHMARKS.map((m) => (
                    <tr
                      key={m.id}
                      className={
                        m.id === 'random_forest'
                          ? 'bg-emerald-950/30 font-semibold'
                          : 'hover:bg-slate-800/40'
                      }
                    >
                      <td className="p-3 text-slate-200">
                        {m.name}
                        {m.id === 'random_forest' && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                            Champion
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400 font-mono">{m.type}</td>
                      <td className="p-3 text-slate-300 font-mono">{(m.cvRecall * 100).toFixed(1)}%</td>
                      <td className="p-3 text-slate-200 font-mono">{(m.testAccuracy * 100).toFixed(1)}%</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">
                        {(m.testRecall * 100).toFixed(1)}%
                      </td>
                      <td className="p-3 text-slate-200 font-mono">{m.testF1.toFixed(3)}</td>
                      <td className="p-3 text-sky-400 font-mono font-bold">{m.rocAuc.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dummy Classifier Warning Note */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>The Naïve Accuracy Paradox: Why Dummy Classifier Fails Clinically</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The dummy baseline achieves <strong>64.9% accuracy</strong> simply by predicting non-diabetic for everyone. However, its recall is <strong>0.0%</strong>: it fails to diagnose 100% of diabetic patients. In clinical triage, overall accuracy is a completely inappropriate metric.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TASK 4: Tuning and Validation */}
      {selectedTask === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Task 4: 5-Fold Stratified Cross-Validation & GridSearchCV</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hyperparameters tuned exclusively on X_train (N=614) with scoring set to ROC-AUC
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODEL_BENCHMARKS.filter((m) => m.id !== 'dummy').map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs">{m.name}</span>
                    <span className="text-[11px] text-purple-400 font-mono">
                      CV AUC: {m.cvAccuracy.toFixed(3)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300">
                    {m.bestParams}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Pros:</strong> {m.pros}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TASK 5: Evaluation & Threshold Dilemma (Core Question) */}
      {selectedTask === 5 && (
        <div className="space-y-6 animate-in fade-in">
          {/* THE CORE QUESTION ANSWER CARD */}
          <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  Dr. Kirongo Project Brief Research Question Answered
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  "Is recall more important than precision for screening? What threshold would you recommend and why?"
                </h2>

                <div className="text-xs md:text-sm text-slate-200 leading-relaxed space-y-2">
                  <p>
                    <strong>1. Why Recall Trumps Precision:</strong> In medical screening and secondary prevention, the misclassification costs are profoundly asymmetric:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2 text-xs">
                    <li>
                      <strong className="text-rose-300">False Negative Cost:</strong> A patient with active diabetes is sent home untreated. The disease progresses to irreversible diabetic retinopathy (blindness), nephropathy (dialysis), peripheral neuropathy (amputations), or fatal myocardial infarction. Cost to life and society is catastrophic.
                    </li>
                    <li>
                      <strong className="text-sky-300">False Positive Cost:</strong> A healthy individual is flagged as high-risk and undergoes a confirmatory fasting blood sugar or oral glucose test costing ~KES 300 ($2.50) with zero physiological harm.
                    </li>
                  </ul>
                  <p className="pt-1">
                    <strong>2. Recommended Threshold (tau = 0.35):</strong> Under the standard threshold ($\\tau = 0.50$), our best model misses <strong>16 out of 54 diabetic patients</strong> (Recall = 70.4%). By lowering the threshold to <strong>$\\tau = 0.35$</strong>, sensitivity jumps to <strong>90.7%</strong> (reducing missed patients to only 5), capturing 9 out of 10 cases while retaining a respectable 76% specificity!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Confusion Matrix Shift */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-400" />
                  <span>Held-Out Test Set Confusion Matrix Comparison (N = 154)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  See how shifting the threshold from 0.50 to 0.35 eliminates 11 fatal False Negatives
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCmThreshold('0.50')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    cmThreshold === '0.50'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Standard tau = 0.50
                </button>
                <button
                  onClick={() => setCmThreshold('0.35')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    cmThreshold === '0.35'
                      ? 'bg-emerald-600 text-white shadow font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ★ Recommended tau = 0.35
                </button>
              </div>
            </div>

            {/* Confusion Matrix Visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
                  Test Set Confusion Matrix (Random Forest @ tau = {cmThreshold})
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400">True Negatives (TN)</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      {cmThreshold === '0.35' ? 76 : 87}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Correctly Cleared</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400">False Positives (FP)</div>
                    <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                      {cmThreshold === '0.35' ? 24 : 13}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Referred for Lab Test</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-rose-400 font-semibold">
                      False Negatives (FN - MISSED!)
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-rose-500 mt-1">
                      {cmThreshold === '0.35' ? 5 : 16}
                    </div>
                    <div className="text-[10px] text-rose-400/80 mt-1">
                      {cmThreshold === '0.35' ? 'Only 5 missed cases!' : '16 missed diabetics!'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400">True Positives (TP)</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      {cmThreshold === '0.35' ? 49 : 38}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Diabetics Caught</div>
                  </div>
                </div>
              </div>

              {/* Metrics Summary Card */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Screening Metric Comparison (tau = {cmThreshold})
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Recall (Sensitivity)</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {cmThreshold === '0.35' ? '90.74%' : '70.37%'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: cmThreshold === '0.35' ? '90.7%' : '70.4%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Precision (PPV)</span>
                      <span className="font-mono font-bold text-sky-400">
                        {cmThreshold === '0.35' ? '67.12%' : '74.51%'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: cmThreshold === '0.35' ? '67.1%' : '74.5%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>F2-Score (Weights Recall 2x over Precision)</span>
                      <span className="font-mono font-bold text-purple-400">
                        {cmThreshold === '0.35' ? '0.845' : '0.712'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: cmThreshold === '0.35' ? '84.5%' : '71.2%' }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  {cmThreshold === '0.35'
                    ? 'At tau = 0.35, the model intercepts 49 out of 54 diabetic patients on the unseen test set, establishing superior clinical safety.'
                    : 'At tau = 0.50, almost 30% of diabetic patients are missed and sent home with undetected disease.'}
                </p>
              </div>
            </div>

            {/* Feature Importance Bars */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Random Forest Gini Feature Importance Ranking
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {FEATURE_IMPORTANCES.map((f, i) => (
                  <div key={f.feature} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">{f.feature}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {(f.weight * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(f.weight / 0.35) * 100}%`, backgroundColor: f.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASK 6: Responsible AI */}
      {selectedTask === 6 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Task 6: Responsible AI, Bias Mitigation & Ethical Governance</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Demographic transferability, Kenya Data Protection Act 2019, and clinical safeguards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  1. Demographic Shift
                </div>
                <h3 className="font-semibold text-white text-sm">Pima vs East African Population</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Pima Indians dataset represents a genetically unique cohort in Arizona. African populations frequently develop metabolic insulin resistance at lower BMI cutoffs (lean diabetes). Transfer learning and local calibration in Meru County are mandatory before clinical adoption.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  2. Patient Privacy
                </div>
                <h3 className="font-semibold text-white text-sm">Kenya Data Protection Act 2019</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Strict de-identification protocol. No patient names, national IDs, or location data are stored or processed. Client-side edge inference ensures sensitive physiological vitals never leave the clinic's local terminal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  3. Clinical Safety
                </div>
                <h3 className="font-semibold text-white text-sm">Decision-Support Boundary</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The system functions strictly as a triage risk prioritizer, not an autonomous diagnostic instrument. Emergency hard stops (e.g. Glucose &gt; 200 mg/dL or BP &gt; 180 mm Hg) trigger immediate physician escalation regardless of ML output.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASK 7: Deployment Prototype Overview */}
      {selectedTask === 7 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Task 7: Deployment Prototype Architecture</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              We operationalized our trained scikit-learn Random Forest model into a live web application, REST API microservice, and MLOps monitoring console:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 text-xs">Model Serialisation</div>
                <div className="text-xs text-slate-400 mt-1">
                  Packaged into <code className="text-emerald-400">diabetes_rf_pipeline_v1.joblib</code> including fitted StandardScaler and optimal threshold.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 text-xs">Web Interface</div>
                <div className="text-xs text-slate-400 mt-1">
                  Interactive Clinical Calculator with real-time risk gauges, local feature explainability, and printable triage slips.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 text-xs">Post-Release Drift</div>
                <div className="text-xs text-slate-400 mt-1">
                  Population Stability Index (PSI) tracking module with automated retraining alerts when PSI &ge; 0.25.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASK 8: Conclusions & Next Steps */}
      {selectedTask === 8 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                <span>Task 8: Conclusions, Study Limitations & Future Roadmap</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Key project takeaways and translation into Kenyan primary healthcare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400 text-sm">Key Findings</div>
                <p className="text-slate-300 leading-relaxed">
                  Tuned Random Forest achieved highest performance (ROC-AUC 0.873). Setting the screening threshold to $\tau = 0.35$ achieved 90.7% recall, successfully detecting 9 out of 10 diabetic patients in resource-constrained environments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 text-sm">Study Limitations</div>
                <p className="text-slate-300 leading-relaxed">
                  Benchmark dataset contains 768 samples restricted to female indigenous subjects. Laboratory gold-standard glycated hemoglobin (HbA1c) was omitted in the 1988 dataset.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-sky-400 text-sm">Next Steps</div>
                <p className="text-slate-300 leading-relaxed">
                  Collaborate with Meru Teaching and Referral Hospital (MeTRH) to collect anonymized county clinical records, and build FHIR/HL7 microservice connectors for KenyaEMR and DHIS2.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
