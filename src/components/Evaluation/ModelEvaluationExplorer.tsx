/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Genuine Model Evaluation Dashboard using Recharts
 */

import React, { useState, useEffect } from 'react';
import {
  fetchModelsPerformance,
  fetchDatasetSummary,
  EvaluationResults,
  DatasetSummary,
} from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  Zap,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export const ModelEvaluationExplorer: React.FC = () => {
  const [evalData, setEvalData] = useState<EvaluationResults | null>(null);
  const [datasetSummary, setDatasetSummary] = useState<DatasetSummary | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('random_forest');
  const [cmThreshold, setCmThreshold] = useState<'0.50' | '0.35'>('0.35');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([fetchModelsPerformance(), fetchDatasetSummary()])
      .then(([perf, summ]) => {
        setEvalData(perf);
        setDatasetSummary(summ);
      })
      .catch((err) => {
        console.error('Error fetching evaluation data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !evalData) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading genuine Scikit-Learn evaluation results from backend...</span>
      </div>
    );
  }

  const activeModel = evalData.models[selectedModelId] || evalData.models['random_forest'];

  // Prepare data for model comparison chart
  const comparisonChartData = Object.values(evalData.models).map((m) => ({
    name: m.name.split(' (')[0],
    id: m.id,
    ROC_AUC: Number((m.test_metrics_default_tau.roc_auc * 100).toFixed(1)),
    Recall_035: Number((m.test_metrics_recommended_tau.recall * 100).toFixed(1)),
    Recall_050: Number((m.test_metrics_default_tau.recall * 100).toFixed(1)),
    Accuracy: Number((m.test_metrics_default_tau.accuracy * 100).toFixed(1)),
    Precision: Number((m.test_metrics_default_tau.precision * 100).toFixed(1)),
  }));

  // Prepare ROC curve data
  const rocCurveData = activeModel.roc_curve.map((pt) => ({
    fpr: Number((pt.fpr * 100).toFixed(1)),
    tpr: Number((pt.tpr * 100).toFixed(1)),
    chance: Number((pt.fpr * 100).toFixed(1)), // diagonal line
  }));

  // Prepare Precision-Recall curve data
  const prCurveData = activeModel.pr_curve.map((pt) => ({
    recall: Number((pt.recall * 100).toFixed(1)),
    precision: Number((pt.precision * 100).toFixed(1)),
  }));

  // Prepare Feature Importance chart data
  const featureImpData = activeModel.feature_importances.map((f) => ({
    feature: f.feature,
    importance: Number((f.importance * 100).toFixed(1)),
  }));

  // Active confusion matrix
  const cm =
    cmThreshold === '0.35'
      ? activeModel.test_metrics_recommended_tau.confusion_matrix
      : activeModel.test_metrics_default_tau.confusion_matrix;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header & Core Finding */}
      <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                Mandatory Assignment Question
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs">
                Held-Out Test Set (N = {evalData.split_info.test_samples}: {evalData.split_info.test_positives} Diabetics, {evalData.split_info.test_negatives} Non-Diabetics)
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              "Is recall more important than precision for screening? What threshold would you recommend and why?"
            </h2>

            <div className="text-xs md:text-sm text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>1. Why Recall Trumps Precision in Clinical Screening:</strong> In medical screening, misclassification costs are fundamentally asymmetric. Missing an active diabetic patient (<strong>False Negative</strong>) allows silent, progressive microvascular damage leading to retinopathy (blindness), nephropathy (dialysis), and stroke. In contrast, a <strong>False Positive</strong> merely incurs a harmless, inexpensive confirmatory Fasting Blood Glucose lab test (~KES 300).
              </p>
              <p>
                <strong>2. Recommended Threshold (tau = 0.35):</strong> Under the conventional threshold of tau = 0.50, our champion Random Forest model achieves { (evalData.models['random_forest'].test_metrics_default_tau.recall * 100).toFixed(1) }% recall. Calibrating the operating threshold to <strong>tau = 0.35</strong> elevates test sensitivity to <strong>{ (evalData.models['random_forest'].test_metrics_recommended_tau.recall * 100).toFixed(1) }%</strong>, intercepting {evalData.models['random_forest'].test_metrics_recommended_tau.confusion_matrix.tp} out of {evalData.split_info.test_positives} diabetic patients with an F2-score of <strong>{evalData.models['random_forest'].test_metrics_recommended_tau.f2_score.toFixed(3)}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Model Comparison Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Multi-Algorithm Test Performance Benchmark (Genuine Scikit-Learn Metrics)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Notice how lowering threshold to tau=0.35 (dark emerald) drastically boosts recall across all classifiers
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Test Split: 154 Patients (Never used in training/tuning)
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Recall_035" name="Recall (tau = 0.35 Recommended)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recall_050" name="Recall (tau = 0.50 Standard)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ROC_AUC" name="ROC-AUC Score (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Accuracy" name="Test Accuracy (%)" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Selector Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl flex-wrap gap-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Select Model to Inspect Curves &amp; Confusion Matrix:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.values(evalData.models).map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedModelId === m.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Analysis Grid: ROC Curve, PR Curve, Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROC Curve with Recharts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>ROC Curve: {activeModel.name}</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                True Positive Rate vs False Positive Rate
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-purple-400 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20">
              AUC: {activeModel.test_metrics_default_tau.roc_auc.toFixed(3)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fpr" name="FPR (%)" stroke="#94a3b8" unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="tpr" name="TPR (%)" stroke="#94a3b8" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="tpr" name="Classifier TPR" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="chance" name="Chance Baseline" stroke="#64748b" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Precision-Recall Curve with Recharts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>Precision-Recall Curve: {activeModel.name}</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tradeoff for Imbalanced Outcome (34.9% positive)
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-sky-400 px-2 py-1 rounded bg-sky-500/10 border border-sky-500/20">
              PR-AUC: {activeModel.test_metrics_default_tau.pr_auc.toFixed(3)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="recall" name="Recall (%)" stroke="#94a3b8" unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="precision" name="Precision (%)" stroke="#94a3b8" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="precision" name="Precision vs Recall" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Shift & Feature Importances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Confusion Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Held-Out Test Set Confusion Matrix</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeModel.name} (N = 154)
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCmThreshold('0.50')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  cmThreshold === '0.50'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                tau = 0.50
              </button>
              <button
                onClick={() => setCmThreshold('0.35')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  cmThreshold === '0.35'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ★ tau = 0.35
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">True Negatives (TN)</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{cm.tn}</div>
              <div className="text-[10px] text-slate-500 mt-1">Healthy Cleared</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">False Positives (FP)</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{cm.fp}</div>
              <div className="text-[10px] text-slate-500 mt-1">Referred for Lab Test</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
              <div className="text-xs text-rose-400 font-semibold">
                False Negatives (FN - MISSED!)
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-500 mt-1">{cm.fn}</div>
              <div className="text-[10px] text-rose-400/80 mt-1">
                {cmThreshold === '0.35' ? 'Only few missed!' : 'High missed count!'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">True Positives (TP)</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{cm.tp}</div>
              <div className="text-[10px] text-slate-500 mt-1">Diabetics Caught</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>
              Test Recall @ tau = {cmThreshold}:{' '}
              <strong className="text-emerald-400 font-mono">
                {((cm.tp / (cm.tp + cm.fn || 1)) * 100).toFixed(1)}%
              </strong>
            </span>
            <span>
              Test Precision: <strong className="text-sky-400 font-mono">{((cm.tp / (cm.tp + cm.fp || 1)) * 100).toFixed(1)}%</strong>
            </span>
          </div>
        </div>

        {/* Feature Importance / Coefficients with Recharts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Global Feature Importance: {activeModel.name}</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Gini impurity reduction or standardized coefficient magnitude
            </p>
          </div>

          {featureImpData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImpData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#94a3b8" unit="%" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Bar dataKey="importance" name="Relative Weight (%)" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              This model does not supply intrinsic tree importances (non-parametric or kernel method).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
