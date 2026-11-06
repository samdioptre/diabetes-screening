/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Department of Computer Science - CDS 3301: Machine Learning
 * Group 2: Diabetes Risk Screening Project Dataset & Benchmarks
 */

export interface PatientRecord {
  id?: number;
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigree: number;
  age: number;
  outcome?: 0 | 1;
}

export interface FeatureStats {
  name: string;
  key: keyof Omit<PatientRecord, 'id' | 'outcome'>;
  unit: string;
  mean: number;
  std: number;
  median: number;
  min: number;
  max: number;
  zeroCount: number;
  zeroPercentage: number;
  normalRange: string;
  clinicalSignificance: string;
}

// Authentic statistical distribution from the genuine dataset (N=768)
export const FEATURE_METADATA: FeatureStats[] = [
  {
    name: 'Pregnancies',
    key: 'pregnancies',
    unit: 'count',
    mean: 3.85,
    std: 3.37,
    median: 3.0,
    min: 0,
    max: 17,
    zeroCount: 111,
    zeroPercentage: 14.45,
    normalRange: '0 - 4',
    clinicalSignificance: 'Gravidity count; gestational metabolic stress increases insulin resistance risk.',
  },
  {
    name: 'Glucose',
    key: 'glucose',
    unit: 'mg/dL',
    mean: 120.89,
    std: 31.97,
    median: 117.0,
    min: 0, // 5 biological zeros
    max: 199,
    zeroCount: 5,
    zeroPercentage: 0.65,
    normalRange: '70 - 99 mg/dL (fasting)',
    clinicalSignificance: 'Plasma glucose concentration 2 hours post-oral challenge. Primary diagnostic biomarker.',
  },
  {
    name: 'Blood Pressure',
    key: 'bloodPressure',
    unit: 'mm Hg',
    mean: 69.11,
    std: 19.36,
    median: 72.0,
    min: 0, // 35 biological zeros
    max: 122,
    zeroCount: 35,
    zeroPercentage: 4.56,
    normalRange: '< 80 mm Hg (diastolic)',
    clinicalSignificance: 'Diastolic blood pressure; essential hypertension is comorbid with metabolic syndrome.',
  },
  {
    name: 'Skin Thickness',
    key: 'skinThickness',
    unit: 'mm',
    mean: 20.54,
    std: 15.95,
    median: 23.0,
    min: 0, // 227 biological zeros
    max: 99,
    zeroCount: 227,
    zeroPercentage: 29.56,
    normalRange: '10 - 30 mm',
    clinicalSignificance: 'Triceps skin fold caliper measurement assessing subcutaneous adiposity.',
  },
  {
    name: 'Insulin',
    key: 'insulin',
    unit: 'μU/mL',
    mean: 79.80,
    std: 115.24,
    median: 30.5,
    min: 0, // 374 biological zeros
    max: 846,
    zeroCount: 374,
    zeroPercentage: 48.70,
    normalRange: '16 - 166 μU/mL',
    clinicalSignificance: '2-hour serum insulin; elevated levels indicate peripheral insulin resistance.',
  },
  {
    name: 'BMI',
    key: 'bmi',
    unit: 'kg/m²',
    mean: 31.99,
    std: 7.88,
    median: 32.0,
    min: 0, // 11 biological zeros
    max: 67.1,
    zeroCount: 11,
    zeroPercentage: 1.43,
    normalRange: '18.5 - 24.9 kg/m²',
    clinicalSignificance: 'Body Mass Index; visceral adipose tissue secretes pro-inflammatory cytokines.',
  },
  {
    name: 'Diabetes Pedigree',
    key: 'diabetesPedigree',
    unit: 'score',
    mean: 0.472,
    std: 0.331,
    median: 0.372,
    min: 0.078,
    max: 2.42,
    zeroCount: 0,
    zeroPercentage: 0.0,
    normalRange: '< 0.50 (low familial)',
    clinicalSignificance: 'Synthesis of diabetes genetic history across first and second-degree relatives.',
  },
  {
    name: 'Age',
    key: 'age',
    unit: 'years',
    mean: 33.24,
    std: 11.76,
    median: 29.0,
    min: 21,
    max: 81,
    zeroCount: 0,
    zeroPercentage: 0.0,
    normalRange: '21 - 85 years',
    clinicalSignificance: 'Pancreatic beta-cell senescence and cumulative metabolic exposure.',
  },
];

// Authentic dataset overview
export const DATASET_OVERVIEW = {
  name: 'Pima Indians Diabetes Database',
  origin: 'National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)',
  license: 'CC0 Public Domain (UCI Repository)',
  totalSamples: 768,
  negativeSamples: 500, // 65.1%
  positiveSamples: 268, // 34.9%
  trainSamples: 614,    // 80% Stratified split
  testSamples: 154,     // 20% Held-out evaluation set
  testPositives: 54,
  testNegatives: 100,
  zeroImputation: 'Biological zero replacement with NaN + Median Imputation fitted exclusively on Train',
  scaling: 'StandardScaler fitted strictly on Train split (no data leakage)',
};

// Authentic Model Benchmarks from Scikit-Learn evaluation_results.json
export const MODEL_BENCHMARKS = [
  {
    id: 'dummy',
    name: 'Baseline (Dummy Classifier)',
    type: 'Heuristic Baseline',
    cvAccuracy: 0.651,
    cvRecall: 0.0,
    testAccuracy: 0.649,
    testPrecision: 0.0,
    testRecall: 0.0,
    testRecallRecommended: 0.0,
    testF1: 0.0,
    testF2: 0.0,
    rocAuc: 0.500,
    bestParams: 'strategy="most_frequent"',
    confusionMatrix05: { tn: 100, fp: 0, fn: 54, tp: 0 },
    confusionMatrix035: { tn: 100, fp: 0, fn: 54, tp: 0 },
    pros: 'Establishes majority-class lower bound.',
    cons: 'Clinically disastrous: misses 100% of diabetic patients (Recall = 0.0%).',
  },
  {
    id: 'logistic_regression',
    name: 'Logistic Regression',
    type: 'Generalized Linear Model',
    cvAccuracy: 0.767,
    cvRecall: 0.542,
    testAccuracy: 0.701,
    testPrecision: 0.583,
    testRecall: 0.519,
    testRecallRecommended: 0.759,
    testF1: 0.549,
    testF2: 0.717,
    rocAuc: 0.810,
    bestParams: 'C=1.0, penalty="l2", solver="liblinear"',
    confusionMatrix05: { tn: 80, fp: 20, fn: 26, tp: 28 },
    confusionMatrix035: { tn: 71, fp: 29, fn: 13, tp: 41 },
    pros: 'Direct log-odds coefficient interpretability and calibrated probabilities.',
    cons: 'Assumes linear decision boundary in logit space.',
  },
  {
    id: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    type: 'Instance-Based Learner',
    cvAccuracy: 0.749,
    cvRecall: 0.547,
    testAccuracy: 0.747,
    testPrecision: 0.667,
    testRecall: 0.556,
    testRecallRecommended: 0.759,
    testF1: 0.606,
    testF2: 0.719,
    rocAuc: 0.807,
    bestParams: 'n_neighbors=13, weights="distance", metric="manhattan"',
    confusionMatrix05: { tn: 85, fp: 15, fn: 24, tp: 30 },
    confusionMatrix035: { tn: 72, fp: 28, fn: 13, tp: 41 },
    pros: 'Non-parametric local metric clustering.',
    cons: 'High computational cost on large cohorts.',
  },
  {
    id: 'decision_tree',
    name: 'Decision Tree (CART)',
    type: 'Rule-Based Tree',
    cvAccuracy: 0.752,
    cvRecall: 0.584,
    testAccuracy: 0.721,
    testPrecision: 0.617,
    testRecall: 0.537,
    testRecallRecommended: 0.815,
    testF1: 0.574,
    testF2: 0.775,
    rocAuc: 0.823,
    bestParams: 'max_depth=4, min_samples_leaf=10, criterion="gini"',
    confusionMatrix05: { tn: 82, fp: 18, fn: 25, tp: 29 },
    confusionMatrix035: { tn: 76, fp: 24, fn: 10, tp: 44 },
    pros: 'Transparent clinical decision flowcharts.',
    cons: 'Step-boundary orthogonal splits prone to variance without pruning.',
  },
  {
    id: 'random_forest',
    name: 'Random Forest (Champion Ensemble)',
    type: 'Bagged Tree Ensemble',
    cvAccuracy: 0.770,
    cvRecall: 0.701,
    testAccuracy: 0.740,
    testPrecision: 0.606,
    testRecall: 0.741,
    testRecallRecommended: 0.907,
    testF1: 0.667,
    testF2: 0.798,
    rocAuc: 0.820,
    bestParams: 'n_estimators=150, max_depth=6, class_weight="balanced"',
    confusionMatrix05: { tn: 74, fp: 26, fn: 14, tp: 40 },
    confusionMatrix035: { tn: 58, fp: 42, fn: 5, tp: 49 },
    pros: 'Highest screening sensitivity (90.7% recall at tau=0.35, only 5 missed cases).',
    cons: 'Ensemble opacity requires Gini/SHAP surrogate explainability.',
  },
  {
    id: 'svm',
    name: 'Support Vector Machine (RBF Kernel)',
    type: 'Kernel Machine',
    cvAccuracy: 0.767,
    cvRecall: 0.533,
    testAccuracy: 0.727,
    testPrecision: 0.630,
    testRecall: 0.537,
    testRecallRecommended: 0.704,
    testF1: 0.580,
    testF2: 0.686,
    rocAuc: 0.811,
    bestParams: 'C=1.0, gamma="scale", kernel="rbf", probability=True',
    confusionMatrix05: { tn: 83, fp: 17, fn: 25, tp: 29 },
    confusionMatrix035: { tn: 77, fp: 23, fn: 16, tp: 38 },
    pros: 'Effective in transformed reproducing kernel Hilbert space.',
    cons: 'Requires Platt scaling calibration for probability estimates.',
  },
];

// Feature Importances derived from Tuned Scikit-Learn Random Forest
export const FEATURE_IMPORTANCES = [
  { feature: 'Glucose', weight: 0.3602, color: '#10b981' },
  { feature: 'BMI', weight: 0.1779, color: '#06b6d4' },
  { feature: 'Insulin', weight: 0.1239, color: '#ec4899' },
  { feature: 'Age', weight: 0.1131, color: '#3b82f6' },
  { feature: 'DiabetesPedigree', weight: 0.0750, color: '#8b5cf6' },
  { feature: 'Pregnancies', weight: 0.0723, color: '#f59e0b' },
  { feature: 'SkinThickness', weight: 0.0431, color: '#64748b' },
  { feature: 'BloodPressure', weight: 0.0345, color: '#94a3b8' },
];

export const FEATURE_CORRELATIONS: { feature: string; r: number; pValue: string }[] = [
  { feature: 'Glucose', r: 0.467, pValue: '< 0.001' },
  { feature: 'BMI', r: 0.293, pValue: '< 0.001' },
  { feature: 'Age', r: 0.238, pValue: '< 0.001' },
  { feature: 'Pregnancies', r: 0.222, pValue: '< 0.001' },
  { feature: 'Diabetes Pedigree', r: 0.174, pValue: '< 0.001' },
  { feature: 'Insulin', r: 0.131, pValue: '< 0.001' },
  { feature: 'Skin Thickness', r: 0.075, pValue: '0.038' },
  { feature: 'Blood Pressure', r: 0.065, pValue: '0.071' },
];

export const CLINICAL_PRESETS = [
  {
    name: 'Patient A: Healthy Baseline',
    desc: '23yo female, normal glucose (88 mg/dL), normal BMI (22.1 kg/m²), 1 pregnancy.',
    data: {
      pregnancies: 1,
      glucose: 88,
      bloodPressure: 68,
      skinThickness: 20,
      insulin: 85,
      bmi: 22.1,
      diabetesPedigree: 0.19,
      age: 23,
    },
  },
  {
    name: 'Patient B: Impaired Fasting (Borderline)',
    desc: '38yo female, borderline glucose (114 mg/dL), overweight BMI (28.4 kg/m²).',
    data: {
      pregnancies: 3,
      glucose: 114,
      bloodPressure: 74,
      skinThickness: 28,
      insulin: 130,
      bmi: 28.4,
      diabetesPedigree: 0.42,
      age: 38,
    },
  },
  {
    name: 'Patient C: Metabolic Syndrome (High Risk)',
    desc: '47yo female, elevated glucose (168 mg/dL), obese BMI (36.8 kg/m²), high pedigree.',
    data: {
      pregnancies: 6,
      glucose: 168,
      bloodPressure: 86,
      skinThickness: 38,
      insulin: 240,
      bmi: 36.8,
      diabetesPedigree: 0.84,
      age: 47,
    },
  },
  {
    name: 'Patient D: Elderly High Risk',
    desc: '62yo female, glucose 152 mg/dL, stage 1 hypertension (88 mm Hg), BMI 31.5 kg/m².',
    data: {
      pregnancies: 8,
      glucose: 152,
      bloodPressure: 88,
      skinThickness: 32,
      insulin: 180,
      bmi: 31.5,
      diabetesPedigree: 0.65,
      age: 62,
    },
  },
  {
    name: 'Patient E: False Negative Risk Trap',
    desc: '31yo female, high glucose (134 mg/dL), lean BMI (22.8 kg/m²). Caught by tau = 0.35!',
    data: {
      pregnancies: 2,
      glucose: 134,
      bloodPressure: 70,
      skinThickness: 18,
      insulin: 110,
      bmi: 22.8,
      diabetesPedigree: 0.55,
      age: 31,
    },
  },
];
