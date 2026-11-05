/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Task 7: Deployed Clinical Screening Risk Calculator Prototype
 */

import React, { useState } from 'react';
import {
  PatientRecord,
  FEATURE_METADATA,
  CLINICAL_PRESETS,
  calculateModelPrediction,
  MODEL_BENCHMARKS,
} from '../../data/pimaDataset';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sliders,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Printer,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClinicalCalculator: React.FC = () => {
  // Clinical Input State
  const [inputs, setInputs] = useState<Omit<PatientRecord, 'id' | 'outcome'>>({
    pregnancies: 3,
    glucose: 142,
    bloodPressure: 78,
    skinThickness: 30,
    insulin: 145,
    bmi: 31.8,
    diabetesPedigree: 0.54,
    age: 42,
  });

  // Selected Model & Operating Decision Threshold
  const [selectedModel, setSelectedModel] = useState<string>('random_forest');
  const [threshold, setThreshold] = useState<number>(0.35); // Recommended threshold
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  // Compute prediction
  const prediction = calculateModelPrediction(inputs, selectedModel);
  const isHighRisk = prediction.probability >= threshold;

  // Categorize Risk Tier
  let riskTier = {
    label: 'Low Risk',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    gaugeColor: '#10b981',
    clinicalAction: 'Routine annual preventive health assessment. Maintain balanced nutrition and active lifestyle.',
  };

  if (prediction.probability >= 0.75) {
    riskTier = {
      label: 'Critical / High Triage Alert',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      gaugeColor: '#f43f5e',
      clinicalAction: 'Immediate referral for diagnostic Fasting Blood Glucose (FBG) and HbA1c testing. Assess for acute metabolic complications.',
    };
  } else if (prediction.probability >= 0.50) {
    riskTier = {
      label: 'Elevated Clinical Risk',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      gaugeColor: '#f59e0b',
      clinicalAction: 'Recommend 75g Oral Glucose Tolerance Test (OGTT) within 7 days. Initiate nutritional counseling and physical activity prescription.',
    };
  } else if (prediction.probability >= threshold) {
    riskTier = {
      label: 'Screening Watch (Above tau = 0.35)',
      badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      gaugeColor: '#fb923c',
      clinicalAction: 'Flagged by enhanced sensitivity screening threshold. Patient warrants secondary lab glucose confirmation to rule out early insulin resistance.',
    };
  }

  const handleInputChange = (key: keyof typeof inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setActivePresetIndex(null);
  };

  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    setInputs(CLINICAL_PRESETS[idx].data);
    if (idx === 0) {
      // celebrate healthy baseline
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
    }
  };

  const handlePrintReferral = () => {
    window.print();
  };

  const activeModelMeta = MODEL_BENCHMARKS.find((m) => m.id === selectedModel) || MODEL_BENCHMARKS[4];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Intro & Academic Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                Task 7 Deliverable: Deployed Prototype
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs">Pima Indians Trained ML Pipeline</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Clinical Diabetes Risk Screening Tool
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Designed for primary healthcare clinicians and triage officers in resource-constrained settings (e.g. rural Kenyan health dispensaries). Input routine non-invasive clinical biomarkers to generate calibrated risk probability, feature-level risk drivers, and triage recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handlePrintReferral}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition shadow-sm"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Triage Slip</span>
            </button>
            <button
              onClick={() => handleSelectPreset(1)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Borderline Case</span>
            </button>
          </div>
        </div>

        {/* Clinical Case Presets */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clinical Test Presets (Click to Load Real Patient Scenarios)</span>
            </span>
            <span className="text-xs text-slate-500">5 Case Scenarios</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {CLINICAL_PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(idx)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                  activePresetIndex === idx
                    ? 'bg-emerald-950/60 border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-200 truncate flex items-center justify-between">
                  <span>{preset.name.split(':')[0]}</span>
                  {activePresetIndex === idx && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {preset.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Clinical Inputs (Left) & Risk Output / Explainability (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 8 Biomarker Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Routine Patient Biomarkers</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust measurements to evaluate real-time posterior probability
                </p>
              </div>
              <button
                onClick={() => {
                  setInputs({
                    pregnancies: 3,
                    glucose: 120,
                    bloodPressure: 72,
                    skinThickness: 29,
                    insulin: 125,
                    bmi: 32.3,
                    diabetesPedigree: 0.47,
                    age: 33,
                  });
                  setActivePresetIndex(null);
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
                title="Reset to dataset population median"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Median</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FEATURE_METADATA.map((feat) => {
                const val = inputs[feat.key];
                const isAbnormal =
                  (feat.key === 'glucose' && val >= 126) ||
                  (feat.key === 'bmi' && val >= 30) ||
                  (feat.key === 'bloodPressure' && val >= 90) ||
                  (feat.key === 'diabetesPedigree' && val >= 0.70);

                return (
                  <div
                    key={feat.key}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-200">
                        {feat.name}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          {feat.key === 'diabetesPedigree' ? val.toFixed(2) : val}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {feat.unit}
                        </span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={feat.min}
                      max={feat.max}
                      step={feat.key === 'diabetesPedigree' ? 0.01 : feat.key === 'bmi' ? 0.1 : 1}
                      value={val}
                      onChange={(e) =>
                        handleInputChange(feat.key, parseFloat(e.target.value))
                      }
                      className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                    />

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">
                        Normal: {feat.normalRange}
                      </span>
                      {isAbnormal && (
                        <span className="text-amber-400 flex items-center gap-1 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Elevated</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Model Architecture & Threshold Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-6">
              {/* Model Family Switcher */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Classifier Algorithm (Model Family)
                  </label>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    ROC-AUC: {activeModelMeta.rocAuc.toFixed(3)}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MODEL_BENCHMARKS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        selectedModel === m.id
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="font-semibold truncate">{m.name.split(' (')[0]}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {m.id === 'random_forest' ? 'Champion (81.2% Acc)' : m.type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Threshold Calibration Slider (Core Screening Question) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Screening Decision Threshold (tau)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                        tau = {threshold.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Adjusts sensitivity (recall) vs specificity tradeoff for clinical triage
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setThreshold(0.35)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                        threshold === 0.35
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title="Recommended by Group 2: 90.7% Recall (only 5 missed cases)"
                    >
                      ★ Recommended (0.35)
                    </button>
                    <button
                      onClick={() => setThreshold(0.50)}
                      className={`px-2.5 py-1 rounded text-[11px] transition ${
                        threshold === 0.50
                          ? 'bg-slate-200 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                      title="Standard default threshold (misses 16 diabetics)"
                    >
                      Standard (0.50)
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="0.10"
                  max="0.80"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-medium">
                    ← Lower tau: Ultra-High Sensitivity (Catch every diabetic)
                  </span>
                  <span className="text-sky-400 font-medium">
                    Higher tau: High Specificity (Fewer false alarms) →
                  </span>
                </div>

                {threshold === 0.35 && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-emerald-300">
                        Why tau = 0.35 is clinically optimal:
                      </strong>{' '}
                      On our test set of 154 patients, lowering tau to 0.35 increases Recall from 70.4% to <strong>90.7%</strong>, slashing undetected diabetics from 16 to 5 while maintaining a 76% specificity rate.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prediction Score Gauge, Explainability & Triage Advice */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Risk Prediction Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Screening Assessment
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${riskTier.badgeClass}`}
              >
                {riskTier.label}
              </span>
            </div>

            {/* Circular Gauge / Probability Display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Radial Gauge */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#1e293b"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke={riskTier.gaugeColor}
                    strokeWidth="10"
                    strokeDasharray={264}
                    strokeDashoffset={264 - 264 * prediction.probability}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                    {(prediction.probability * 100).toFixed(1)}%
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Risk Probability
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Cutoff: {(threshold * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Triage Alert Message */}
              <div className="mt-4 w-full">
                {isHighRisk ? (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-300">
                        FLAGGED: HIGH RISK PATIENT
                      </div>
                      <div className="text-[11px] text-rose-200/90 mt-0.5">
                        Calculated probability ({(prediction.probability * 100).toFixed(1)}%) exceeds the screening threshold of {(threshold * 100).toFixed(0)}%.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-300">
                        NORMAL / LOW RISK PATIENT
                      </div>
                      <div className="text-[11px] text-emerald-200/90 mt-0.5">
                        Patient score is below the {(threshold * 100).toFixed(0)}% triage cutoff. Continue routine health monitoring.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clinical Action Plan */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recommended Clinical Action Plan</span>
              </span>
              <p className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {riskTier.clinicalAction}
              </p>
            </div>

            {/* Feature Contribution Waterfall (SHAP-inspired Local Explainability) */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Patient Risk Drivers (Explainability)
                </span>
                <span className="text-[10px] text-slate-500">Local Impact Score</span>
              </div>

              <div className="space-y-2">
                {prediction.contributions.map((c) => {
                  const maxImpact = 1.2;
                  const pct = Math.min(100, (c.impact / maxImpact) * 100);
                  const isRisk = c.direction === 'risk';

                  return (
                    <div key={c.feature} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">
                          {c.feature}
                        </span>
                        <span
                          className={`font-mono text-[11px] ${
                            isRisk ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {isRisk ? '+' : '-'}
                          {c.impact.toFixed(2)} ({isRisk ? 'Risk Factor' : 'Protective'})
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isRisk ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Model Specification Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-xs space-y-3">
            <div className="font-bold text-slate-200 flex items-center justify-between">
              <span>Active Model Specs: {activeModelMeta.name}</span>
              <span className="text-emerald-400 font-mono">Test F1: {activeModelMeta.testF1}</span>
            </div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              <strong className="text-slate-300">Tuned Parameters:</strong> {activeModelMeta.bestParams}
            </div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              <strong className="text-slate-300">Clinical Rationale:</strong> {activeModelMeta.pros}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Printable Clinical Referral Slip (Shows when window.print() is called) */}
      <div className="hidden print:block print-only p-8 bg-white text-black font-serif-academic">
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="text-center">
            <h1 className="text-xl font-bold uppercase tracking-wider">
              Meru University of Science and Technology
            </h1>
            <h2 className="text-sm font-semibold">
              School of Computing & Informatics • Department of Computer Science
            </h2>
            <h3 className="text-xs text-gray-700">
              CDS 3301 Machine Learning Mini-Project • Group 2 Clinical Triage Slip
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs mb-6">
          <div>
            <p><strong>Patient Date of Assessment:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Age:</strong> {inputs.age} years</p>
            <p><strong>Gravidity (Pregnancies):</strong> {inputs.pregnancies}</p>
            <p><strong>Family Pedigree Function:</strong> {inputs.diabetesPedigree.toFixed(2)}</p>
          </div>
          <div>
            <p><strong>Plasma Glucose (OGTT):</strong> {inputs.glucose} mg/dL</p>
            <p><strong>Blood Pressure (Diastolic):</strong> {inputs.bloodPressure} mm Hg</p>
            <p><strong>Body Mass Index (BMI):</strong> {inputs.bmi.toFixed(1)} kg/m²</p>
            <p><strong>Serum Insulin:</strong> {inputs.insulin} μU/mL</p>
          </div>
        </div>

        <div className="border border-black p-4 rounded mb-6 text-xs">
          <p className="font-bold text-sm uppercase">Machine Learning Risk Classification Result:</p>
          <p className="mt-1">
            <strong>Model:</strong> {activeModelMeta.name} (ROC-AUC {activeModelMeta.rocAuc})
          </p>
          <p>
            <strong>Calculated Diabetes Probability:</strong> {(prediction.probability * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Operating Threshold Applied:</strong> tau = {threshold.toFixed(2)}
          </p>
          <p className="mt-2 text-sm font-bold">
            <strong>Triage Status:</strong> {riskTier.label.toUpperCase()}
          </p>
          <p className="mt-1">
            <strong>Recommended Clinical Action:</strong> {riskTier.clinicalAction}
          </p>
        </div>

        <div className="text-xs border-t border-gray-400 pt-4 text-gray-600">
          <p><em>Disclaimer: This assessment is an automated machine learning screening aid designed by MUST Group 2 under Dr. Amos Chege Kirongo. It does not replace a licensed clinical diagnosis.</em></p>
          <div className="mt-8 flex justify-between">
            <span>Triage Officer Signature: ___________________________</span>
            <span>Date: ___________________________</span>
          </div>
        </div>
      </div>
    </div>
  );
};
