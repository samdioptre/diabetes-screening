/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Genuine Dataset Explorer using Recharts & Real Pima Statistics
 */

import React, { useState, useEffect } from 'react';
import { fetchDatasetSummary, DatasetSummary } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Database,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Table,
  Layers,
  Info,
} from 'lucide-react';

export const DatasetExplorer: React.FC = () => {
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDatasetSummary()
      .then((data) => setSummary(data))
      .catch((err) => console.error('Failed to load dataset summary:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !summary) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading authentic Pima Indians dataset statistics...</span>
      </div>
    );
  }

  // Zero-value audit chart data
  const zeroAuditData = Object.entries(summary.zero_audit)
    .filter(([_, val]) => val.is_biological_missing)
    .map(([feat, val]) => ({
      feature: feat,
      zero_count: val.zero_count,
      zero_percentage: val.zero_percentage,
    }))
    .sort((a, b) => b.zero_count - a.zero_count);

  // Correlation with Outcome chart data
  const corrData = Object.entries(summary.correlation_matrix['Outcome'] || {})
    .filter(([feat]) => feat !== 'Outcome')
    .map(([feat, r]) => ({
      feature: feat,
      correlation: Number((r * 100).toFixed(1)),
      raw_r: r,
    }))
    .sort((a, b) => b.raw_r - a.raw_r);

  // Target class balance data for pie chart
  const targetPieData = [
    { name: 'Non-Diabetic (0)', value: summary.target_summary.negative_count, color: '#38bdf8' },
    { name: 'Diabetic (1)', value: summary.target_summary.positive_count, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Dataset Provenance</span>
          </div>
          <div className="text-lg font-bold text-white mt-2">Pima Indians Database</div>
          <div className="text-xs text-slate-400 mt-1">National Institute of Diabetes (NIDDK)</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Patient Records
          </div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {summary.total_rows} Samples
          </div>
          <div className="text-xs text-slate-400 mt-1">8 Physiological Features + Target</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Target Outcome Balance
          </div>
          <div className="text-2xl font-extrabold text-sky-400 mt-1 font-mono">
            65.1% vs 34.9%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {summary.target_summary.negative_count} Negative / {summary.target_summary.positive_count} Positive
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Highest Biological Missingness
          </div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1 font-mono">
            48.7% (Insulin)
          </div>
          <div className="text-xs text-slate-400 mt-1">374 zeros imputed via median</div>
        </div>
      </div>

      {/* Zero Value Missingness Audit with Recharts */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Biologically Impossible Zero-Value Audit (Real Missingness Analysis)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              In human physiology, fasting plasma glucose, blood pressure, insulin, skin thickness, and BMI cannot equal zero in living patients
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Pipeline: Replaced with NaN → Median Imputed
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zeroAuditData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="feature" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" unit="%" domain={[0, 60]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.zero_count} rows)`, 'Missing Percentage']}
              />
              <Bar dataKey="zero_percentage" name="Missing / Zero Percentage" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                {zeroAuditData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : index === 1 ? '#fb923c' : '#38bdf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pearson Correlation with Outcome with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>Pearson Correlation with Diabetes Outcome</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Glucose exhibits highest bivariate correlation (r = +0.467), followed by BMI (r = +0.293)
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={corrData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" unit="%" tick={{ fontSize: 11 }} domain={[0, 60]} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  formatter={(val: any) => [`+${(val/100).toFixed(3)}`, 'Pearson r']}
                />
                <Bar dataKey="correlation" fill="#38bdf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Imbalance Visual */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Outcome Class Distribution &amp; Stratification</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Stratified splitting ensures 65:35 ratio is preserved in both 80% train and 20% test splits
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={targetPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {targetPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Complete Descriptive Statistics Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-400" />
            <span>Authentic Feature Descriptive Statistics (N = 768)</span>
          </h4>
          <span className="text-xs text-slate-400 font-mono">Calculated via Pandas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/70 font-mono">
                <th className="p-3">Feature Name</th>
                <th className="p-3">Mean</th>
                <th className="p-3">Std Dev</th>
                <th className="p-3">Min</th>
                <th className="p-3">25% (Q1)</th>
                <th className="p-3">Median (50%)</th>
                <th className="p-3">75% (Q3)</th>
                <th className="p-3">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {summary.features.map((feat) => {
                const s = summary.descriptive_stats[feat];
                if (!s) return null;
                return (
                  <tr key={feat} className="hover:bg-slate-800/40">
                    <td className="p-3 font-sans font-semibold text-slate-200">{feat}</td>
                    <td className="p-3 text-slate-300">{s['mean']?.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">{s['std']?.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">{s['min']?.toFixed(1)}</td>
                    <td className="p-3 text-slate-400">{s['25%']?.toFixed(1)}</td>
                    <td className="p-3 text-emerald-400 font-bold">{s['50%']?.toFixed(1)}</td>
                    <td className="p-3 text-slate-400">{s['75%']?.toFixed(1)}</td>
                    <td className="p-3 text-slate-300">{s['max']?.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
