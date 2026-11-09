/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Task 7: Post-Release MLOps Drift & Performance Monitoring Dashboard
 */

import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  BellRing,
  Cpu,
  Layers,
} from 'lucide-react';

interface MonthlyDrift {
  month: string;
  quarter: string;
  totalScreened: number;
  psiGlucose: number;
  psiBmi: number;
  psiOverall: number;
  empiricalPositiveRate: number;
  estimatedRecall: number;
  status: 'stable' | 'moderate' | 'retrain';
}

const HISTORICAL_DRIFT_DATA: MonthlyDrift[] = [
  { month: 'Jan 2027', quarter: 'Q1', totalScreened: 340, psiGlucose: 0.04, psiBmi: 0.03, psiOverall: 0.035, empiricalPositiveRate: 0.352, estimatedRecall: 0.906, status: 'stable' },
  { month: 'Feb 2027', quarter: 'Q1', totalScreened: 410, psiGlucose: 0.05, psiBmi: 0.04, psiOverall: 0.045, empiricalPositiveRate: 0.348, estimatedRecall: 0.908, status: 'stable' },
  { month: 'Mar 2027', quarter: 'Q1', totalScreened: 480, psiGlucose: 0.06, psiBmi: 0.05, psiOverall: 0.055, empiricalPositiveRate: 0.355, estimatedRecall: 0.902, status: 'stable' },
  { month: 'Apr 2027', quarter: 'Q2', totalScreened: 520, psiGlucose: 0.08, psiBmi: 0.07, psiOverall: 0.075, empiricalPositiveRate: 0.362, estimatedRecall: 0.898, status: 'stable' },
  { month: 'May 2027', quarter: 'Q2', totalScreened: 590, psiGlucose: 0.11, psiBmi: 0.09, psiOverall: 0.100, empiricalPositiveRate: 0.370, estimatedRecall: 0.887, status: 'moderate' },
  { month: 'Jun 2027', quarter: 'Q2', totalScreened: 630, psiGlucose: 0.14, psiBmi: 0.12, psiOverall: 0.130, empiricalPositiveRate: 0.378, estimatedRecall: 0.875, status: 'moderate' },
  { month: 'Jul 2027', quarter: 'Q3', totalScreened: 670, psiGlucose: 0.16, psiBmi: 0.15, psiOverall: 0.155, empiricalPositiveRate: 0.385, estimatedRecall: 0.864, status: 'moderate' },
  { month: 'Aug 2027', quarter: 'Q3', totalScreened: 710, psiGlucose: 0.19, psiBmi: 0.18, psiOverall: 0.185, empiricalPositiveRate: 0.392, estimatedRecall: 0.851, status: 'moderate' },
  { month: 'Sep 2027', quarter: 'Q3', totalScreened: 760, psiGlucose: 0.23, psiBmi: 0.21, psiOverall: 0.220, empiricalPositiveRate: 0.404, estimatedRecall: 0.840, status: 'moderate' },
  { month: 'Oct 2027', quarter: 'Q4', totalScreened: 820, psiGlucose: 0.27, psiBmi: 0.24, psiOverall: 0.255, empiricalPositiveRate: 0.418, estimatedRecall: 0.822, status: 'retrain' },
  { month: 'Nov 2027', quarter: 'Q4', totalScreened: 890, psiGlucose: 0.29, psiBmi: 0.26, psiOverall: 0.275, empiricalPositiveRate: 0.426, estimatedRecall: 0.810, status: 'retrain' },
  { month: 'Dec 2027', quarter: 'Q4', totalScreened: 940, psiGlucose: 0.31, psiBmi: 0.28, psiOverall: 0.295, empiricalPositiveRate: 0.435, estimatedRecall: 0.798, status: 'retrain' },
];

export const ModelMonitoring: React.FC = () => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(9); // Month showing trigger
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainSuccess, setRetrainSuccess] = useState<boolean>(false);

  const current = HISTORICAL_DRIFT_DATA[selectedMonthIndex];

  const handleTriggerRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 5000);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider">
                Task 7 Requirement: Post-Release Monitoring
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs">MLOps Quality Assurance</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Model Covariate Drift & Population Stability Monitoring
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
              Once deployed in county clinics, clinical ML models degrade due to seasonal epidemiological changes, new patient demographics, or measurement equipment variance. This dashboard tracks monthly Population Stability Index (PSI) and triggers automated retraining when PSI exceeds 0.25.
            </p>
          </div>

          <button
            onClick={handleTriggerRetrain}
            disabled={isRetraining}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining Pipeline...' : 'Trigger Automated Retraining'}</span>
          </button>
        </div>

        {retrainSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Pipeline Retrained Successfully:</strong> Random Forest model re-calibrated on the latest 2,400 clinical cases. PSI reset to 0.02, restoring sensitivity to 91.2%.
            </span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Active Monitoring Period</div>
          <div className="text-xl font-bold text-white mt-1 font-mono">{current.month}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {current.totalScreened.toLocaleString()} patients screened to date
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Population Stability Index (PSI)</div>
          <div className="text-xl font-bold mt-1 font-mono flex items-center gap-2">
            <span
              className={
                current.psiOverall >= 0.25
                  ? 'text-rose-400'
                  : current.psiOverall >= 0.10
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }
            >
              {current.psiOverall.toFixed(3)}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-sans font-semibold uppercase ${
                current.status === 'retrain'
                  ? 'bg-rose-500/20 text-rose-300'
                  : current.status === 'moderate'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {current.status}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Threshold: Safe &lt; 0.10 | Alert &gt; 0.25</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Empirical Screening Rate</div>
          <div className="text-xl font-bold text-sky-400 mt-1 font-mono">
            {(current.empiricalPositiveRate * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Baseline prevalence: 34.9%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Estimated Operational Sensitivity</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {(current.estimatedRecall * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Target benchmark: &gt; 85.0%
          </div>
        </div>
      </div>

      {/* Monthly Timeline Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>12-Month Longitudinal Drift Trajectory</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select a month to inspect biomarker distribution shifts
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            PSI Formula: Σ (Actual% - Expected%) × ln(Actual% / Expected%)
          </span>
        </div>

        {/* Month Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {HISTORICAL_DRIFT_DATA.map((item, idx) => (
            <button
              key={item.month}
              onClick={() => setSelectedMonthIndex(idx)}
              className={`p-2 rounded-xl text-xs font-mono border transition-all text-center ${
                selectedMonthIndex === idx
                  ? 'bg-teal-950/80 border-teal-500 text-teal-200 ring-1 ring-teal-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-[10px] text-slate-500">{item.month.split(' ')[0]}</div>
              <div
                className={`font-bold mt-0.5 ${
                  item.psiOverall >= 0.25
                    ? 'text-rose-400'
                    : item.psiOverall >= 0.10
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {item.psiOverall.toFixed(2)}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Month Detail Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Biomarker Drift Audit ({current.month})</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span>Glucose PSI</span>
                  <span className="font-mono font-bold text-amber-400">
                    {current.psiGlucose.toFixed(3)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, (current.psiGlucose / 0.35) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Driven by seasonal dietary changes (increased maize consumption in cohort)
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span>BMI PSI</span>
                  <span className="font-mono font-bold text-sky-400">
                    {current.psiBmi.toFixed(3)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${Math.min(100, (current.psiBmi / 0.35) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Shift in age demographic towards younger outpatient visits
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              <span>Automated Governance Rules</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>PSI &lt; 0.10:</strong> Stable population baseline. Daily inference proceeds without manual intervention.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300 flex items-start gap-2">
                <BellRing className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>0.10 ≤ PSI &lt; 0.25:</strong> Moderate covariate drift. Automatic notification dispatched to clinic coordinator.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>PSI ≥ 0.25:</strong> Significant distribution departure. Model triggers retrain pipeline with ground truth labels.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
