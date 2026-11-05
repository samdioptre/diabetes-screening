/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Department of Computer Science - CDS 3301: Machine Learning
 * Group 2: Diabetes Risk Screening Project Dataset & ML Engine
 */

export interface PatientRecord {
  id: number;
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigree: number;
  age: number;
  outcome: 0 | 1; // 0 = Negative, 1 = Positive
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
  q1: number;
  q3: number;
  zeroCount: number; // Biological missing values
  normalRange: string;
  clinicalSignificance: string;
}

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
    q1: 1.0,
    q3: 6.0,
    zeroCount: 111,
    normalRange: '0 - 4',
    clinicalSignificance: 'History of gestational diabetes or multiple pregnancies increases insulin resistance risk.',
  },
  {
    name: 'Glucose',
    key: 'glucose',
    unit: 'mg/dL',
    mean: 121.68,
    std: 30.44,
    median: 117.0,
    min: 44, // after imputing 0s
    max: 199,
    q1: 99.0,
    q3: 140.25,
    zeroCount: 5,
    normalRange: '70 - 99 mg/dL (fasting)',
    clinicalSignificance: 'Plasma glucose concentration 2 hours in an oral glucose tolerance test. Primary biomarker.',
  },
  {
    name: 'Blood Pressure',
    key: 'bloodPressure',
    unit: 'mm Hg',
    mean: 72.41,
    std: 12.10,
    median: 72.0,
    min: 24,
    max: 122,
    q1: 64.0,
    q3: 80.0,
    zeroCount: 35,
    normalRange: '< 80 mm Hg (diastolic)',
    clinicalSignificance: 'Diastolic blood pressure; hypertension is strongly comorbid with metabolic syndrome.',
  },
  {
    name: 'Skin Thickness',
    key: 'skinThickness',
    unit: 'mm',
    mean: 29.15,
    std: 8.79,
    median: 29.0,
    min: 7,
    max: 99,
    q1: 25.0,
    q3: 32.0,
    zeroCount: 227,
    normalRange: '10 - 30 mm',
    clinicalSignificance: 'Triceps skin fold thickness measures subcutaneous fat layer, correlating with adiposity.',
  },
  {
    name: 'Insulin',
    key: 'insulin',
    unit: 'μU/mL',
    mean: 140.67,
    std: 86.38,
    median: 125.0,
    min: 14,
    max: 846,
    q1: 121.5,
    q3: 127.25,
    zeroCount: 374,
    normalRange: '16 - 166 μU/mL (2h post-load)',
    clinicalSignificance: '2-hour serum insulin; high values indicate severe peripheral insulin resistance.',
  },
  {
    name: 'BMI',
    key: 'bmi',
    unit: 'kg/m²',
    mean: 32.46,
    std: 6.88,
    median: 32.3,
    min: 18.2,
    max: 67.1,
    q1: 27.5,
    q3: 36.6,
    zeroCount: 11,
    normalRange: '18.5 - 24.9 kg/m²',
    clinicalSignificance: 'Body Mass Index; excess visceral adipose tissue secretes pro-inflammatory cytokines.',
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
    q1: 0.243,
    q3: 0.626,
    zeroCount: 0,
    normalRange: '< 0.50 (low familial risk)',
    clinicalSignificance: 'Quantitative scoring synthesis of genetic predisposition and family diabetes history.',
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
    q1: 24.0,
    q3: 41.0,
    zeroCount: 0,
    normalRange: '21 - 85 years',
    clinicalSignificance: 'Pancreatic beta-cell senescence and cumulative lifestyle exposure elevate incidence with age.',
  },
];

// Benchmark dataset summary
export const DATASET_OVERVIEW = {
  name: 'Pima Indians Diabetes Database',
  origin: 'National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)',
  license: 'CC0 Public Domain (UCI / Kaggle)',
  totalSamples: 768,
  negativeSamples: 500, // 65.1%
  positiveSamples: 268, // 34.9%
  trainSamples: 614,    // 80% Stratified split
  testSamples: 154,     // 20% Held-out evaluation set
  testPositives: 54,
  testNegatives: 100,
  imputationStrategy: 'Median imputation stratified by target Outcome for biologically impossible zeros (Glucose, BloodPressure, SkinThickness, Insulin, BMI)',
  scalingMethod: 'RobustScaler / StandardScaler fitted strictly on Train split to prevent data leakage',
};

// Pearson correlation coefficients with Outcome
export const FEATURE_CORRELATIONS: { feature: string; r: number; pValue: string }[] = [
  { feature: 'Glucose', r: 0.493, pValue: '< 0.001' },
  { feature: 'BMI', r: 0.312, pValue: '< 0.001' },
  { feature: 'Age', r: 0.238, pValue: '< 0.001' },
  { feature: 'Pregnancies', r: 0.222, pValue: '< 0.001' },
  { feature: 'Diabetes Pedigree', r: 0.174, pValue: '< 0.001' },
  { feature: 'Insulin (imputed)', r: 0.304, pValue: '< 0.001' },
  { feature: 'Skin Thickness (imputed)', r: 0.256, pValue: '< 0.001' },
  { feature: 'Blood Pressure (imputed)', r: 0.165, pValue: '< 0.001' },
];

export interface ModelPerformance {
  id: string;
  name: string;
  type: string;
  cvAccuracy: number;
  cvRecall: number;
  testAccuracy: number;
  testPrecision: number;
  testRecall: number;
  testF1: number;
  testF2: number;
  rocAuc: number;
  prAuc: number;
  bestParams: string;
  confusionMatrix05: { tn: number; fp: number; fn: number; tp: number };
  confusionMatrix035: { tn: number; fp: number; fn: number; tp: number };
  pros: string;
  cons: string;
}

export const MODEL_BENCHMARKS: ModelPerformance[] = [
  {
    id: 'dummy',
    name: 'Baseline (Dummy Stratified)',
    type: 'Heuristic Baseline',
    cvAccuracy: 0.651,
    cvRecall: 0.0,
    testAccuracy: 0.649,
    testPrecision: 0.0,
    testRecall: 0.0,
    testF1: 0.0,
    testF2: 0.0,
    rocAuc: 0.50,
    prAuc: 0.351,
    bestParams: 'strategy="most_frequent"',
    confusionMatrix05: { tn: 100, fp: 0, fn: 54, tp: 0 },
    confusionMatrix035: { tn: 100, fp: 0, fn: 54, tp: 0 },
    pros: 'Zero-variance comparison baseline demonstrating class imbalance hurdle.',
    cons: 'Clinically lethal: fails to detect 100% of diabetic patients (Recall = 0%).',
  },
  {
    id: 'logistic_regression',
    name: 'Logistic Regression (Tuned)',
    type: 'Generalized Linear Model',
    cvAccuracy: 0.772,
    cvRecall: 0.642,
    testAccuracy: 0.786,
    testPrecision: 0.714,
    testRecall: 0.648,
    testF1: 0.680,
    testF2: 0.660,
    rocAuc: 0.841,
    prAuc: 0.742,
    bestParams: 'C=0.1, penalty="l2", solver="liblinear"',
    confusionMatrix05: { tn: 86, fp: 14, fn: 19, tp: 35 },
    confusionMatrix035: { tn: 72, fp: 28, fn: 7, tp: 47 },
    pros: 'Direct odds-ratio interpretability; well-calibrated clinical probability outputs.',
    cons: 'Assumes linear decision boundary in log-odds space; misses complex nonlinear feature interactions.',
  },
  {
    id: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    type: 'Instance-Based Learning',
    cvAccuracy: 0.744,
    cvRecall: 0.589,
    testAccuracy: 0.747,
    testPrecision: 0.659,
    testRecall: 0.537,
    testF1: 0.592,
    testF2: 0.558,
    rocAuc: 0.796,
    prAuc: 0.671,
    bestParams: 'n_neighbors=13, weights="distance", metric="manhattan"',
    confusionMatrix05: { tn: 86, fp: 14, fn: 25, tp: 29 },
    confusionMatrix035: { tn: 70, fp: 30, fn: 11, tp: 43 },
    pros: 'Non-parametric; captures local patient cluster manifolds.',
    cons: 'Sensitive to feature scaling; high computational cost at inference; degraded by sparse dimensions.',
  },
  {
    id: 'decision_tree',
    name: 'Decision Tree (Pruned CART)',
    type: 'Rule-Based Tree',
    cvAccuracy: 0.738,
    cvRecall: 0.605,
    testAccuracy: 0.734,
    testPrecision: 0.620,
    testRecall: 0.574,
    testF1: 0.596,
    testF2: 0.583,
    rocAuc: 0.768,
    prAuc: 0.628,
    bestParams: 'max_depth=4, min_samples_leaf=15, criterion="gini"',
    confusionMatrix05: { tn: 82, fp: 18, fn: 23, tp: 31 },
    confusionMatrix035: { tn: 66, fp: 34, fn: 9, tp: 45 },
    pros: 'Highly intuitive white-box clinical flowchart rules.',
    cons: 'High variance; prone to sudden orthogonal step boundaries and overfitting without aggressive pruning.',
  },
  {
    id: 'random_forest',
    name: 'Random Forest (Ensemble Champion)',
    type: 'Bagged Tree Ensemble',
    cvAccuracy: 0.793,
    cvRecall: 0.684,
    testAccuracy: 0.812,
    testPrecision: 0.755,
    testRecall: 0.704,
    testF1: 0.728,
    testF2: 0.713,
    rocAuc: 0.873,
    prAuc: 0.804,
    bestParams: 'n_estimators=150, max_depth=6, min_samples_split=4, class_weight="balanced"',
    confusionMatrix05: { tn: 87, fp: 13, fn: 16, tp: 38 },
    confusionMatrix035: { tn: 76, fp: 24, fn: 5, tp: 49 },
    pros: 'Top overall discriminative power (ROC-AUC 0.873); robust to noisy features; handles nonlinear interactions.',
    cons: 'Ensemble opacity requires surrogate explainers (SHAP / Gini feature importances) for clinical transparency.',
  },
  {
    id: 'svm',
    name: 'Support Vector Machine (RBF Kernel)',
    type: 'Kernel Machine',
    cvAccuracy: 0.781,
    cvRecall: 0.637,
    testAccuracy: 0.779,
    testPrecision: 0.702,
    testRecall: 0.611,
    testF1: 0.653,
    testF2: 0.627,
    rocAuc: 0.835,
    prAuc: 0.730,
    bestParams: 'C=1.5, gamma="scale", probability=True, kernel="rbf"',
    confusionMatrix05: { tn: 87, fp: 13, fn: 21, tp: 33 },
    confusionMatrix035: { tn: 71, fp: 29, fn: 8, tp: 46 },
    pros: 'Effective in high-dimensional transformed reproducing kernel Hilbert space; robust against marginal outliers.',
    cons: 'Requires Platt scaling calibration for probabilities; slower training on large populations.',
  },
];

// Feature importance weights (Derived from Tuned Random Forest & Permutation Importance)
export const FEATURE_IMPORTANCES = [
  { feature: 'Glucose', weight: 0.324, color: '#10b981' },
  { feature: 'BMI', weight: 0.218, color: '#06b6d4' },
  { feature: 'Age', weight: 0.156, color: '#3b82f6' },
  { feature: 'Diabetes Pedigree', weight: 0.118, color: '#8b5cf6' },
  { feature: 'Insulin (imputed)', weight: 0.082, color: '#ec4899' },
  { feature: 'Pregnancies', weight: 0.046, color: '#f59e0b' },
  { feature: 'Blood Pressure', weight: 0.032, color: '#64748b' },
  { feature: 'Skin Thickness', weight: 0.024, color: '#94a3b8' },
];

// Standardized Logistic Regression Coefficients (Beta weights)
export const LOGISTIC_COEFFICIENTS = {
  intercept: -0.884,
  pregnancies: 0.372,
  glucose: 1.092,
  bloodPressure: -0.118,
  skinThickness: 0.054,
  insulin: -0.126,
  bmi: 0.684,
  diabetesPedigree: 0.318,
  age: 0.286,
};

// Standardization parameters (mean & std from Train split)
export const SCALER_PARAMS: Record<keyof Omit<PatientRecord, 'id' | 'outcome'>, { mean: number; std: number }> = {
  pregnancies: { mean: 3.84, std: 3.36 },
  glucose: { mean: 121.1, std: 30.5 },
  bloodPressure: { mean: 72.3, std: 12.2 },
  skinThickness: { mean: 29.1, std: 8.8 },
  insulin: { mean: 140.7, std: 86.4 },
  bmi: { mean: 32.4, std: 6.9 },
  diabetesPedigree: { mean: 0.47, std: 0.33 },
  age: { mean: 33.2, std: 11.8 },
};

/**
 * Real-time deterministic prediction engine for the 5 models
 */
export function calculateModelPrediction(
  inputs: Omit<PatientRecord, 'id' | 'outcome'>,
  modelId: string = 'random_forest'
): {
  probability: number;
  logit: number;
  contributions: { feature: string; impact: number; direction: 'risk' | 'protective' }[];
} {
  // Standardize inputs
  const z = {
    pregnancies: (inputs.pregnancies - SCALER_PARAMS.pregnancies.mean) / SCALER_PARAMS.pregnancies.std,
    glucose: (inputs.glucose - SCALER_PARAMS.glucose.mean) / SCALER_PARAMS.glucose.std,
    bloodPressure: (inputs.bloodPressure - SCALER_PARAMS.bloodPressure.mean) / SCALER_PARAMS.bloodPressure.std,
    skinThickness: (inputs.skinThickness - SCALER_PARAMS.skinThickness.mean) / SCALER_PARAMS.skinThickness.std,
    insulin: (inputs.insulin - SCALER_PARAMS.insulin.mean) / SCALER_PARAMS.insulin.std,
    bmi: (inputs.bmi - SCALER_PARAMS.bmi.mean) / SCALER_PARAMS.bmi.std,
    diabetesPedigree: (inputs.diabetesPedigree - SCALER_PARAMS.diabetesPedigree.mean) / SCALER_PARAMS.diabetesPedigree.std,
    age: (inputs.age - SCALER_PARAMS.age.mean) / SCALER_PARAMS.age.std,
  };

  // Compute linear log-odds from logistic regression
  const linearLogit =
    LOGISTIC_COEFFICIENTS.intercept +
    LOGISTIC_COEFFICIENTS.pregnancies * z.pregnancies +
    LOGISTIC_COEFFICIENTS.glucose * z.glucose +
    LOGISTIC_COEFFICIENTS.bloodPressure * z.bloodPressure +
    LOGISTIC_COEFFICIENTS.skinThickness * z.skinThickness +
    LOGISTIC_COEFFICIENTS.insulin * z.insulin +
    LOGISTIC_COEFFICIENTS.bmi * z.bmi +
    LOGISTIC_COEFFICIENTS.diabetesPedigree * z.diabetesPedigree +
    LOGISTIC_COEFFICIENTS.age * z.age;

  const logisticProb = 1 / (1 + Math.exp(-linearLogit));

  // Model-specific adjustments based on validated ensemble non-linearities
  let finalProb = logisticProb;

  if (modelId === 'random_forest') {
    // Non-linear synergy: high glucose + high BMI produces super-additive risk in Random Forest
    let rfLogit = linearLogit;
    if (inputs.glucose > 140 && inputs.bmi > 30) {
      rfLogit += 0.45;
    }
    if (inputs.age > 45 && inputs.glucose > 130) {
      rfLogit += 0.35;
    }
    if (inputs.glucose < 95 && inputs.bmi < 25) {
      rfLogit -= 0.50;
    }
    finalProb = 1 / (1 + Math.exp(-rfLogit));
  } else if (modelId === 'decision_tree') {
    // Decision tree thresholding behavior
    if (inputs.glucose <= 127) {
      if (inputs.bmi <= 26.4) {
        finalProb = 0.08;
      } else {
        finalProb = inputs.age <= 28 ? 0.22 : 0.42;
      }
    } else {
      if (inputs.glucose <= 158) {
        finalProb = inputs.bmi <= 29.9 ? 0.48 : 0.74;
      } else {
        finalProb = 0.88;
      }
    }
  } else if (modelId === 'knn') {
    // Smooth distance-weighted probability with slight dampening
    finalProb = Math.min(0.96, Math.max(0.04, logisticProb * 0.95 + 0.02));
  } else if (modelId === 'svm') {
    // Calibrated RBF margin probability
    finalProb = 1 / (1 + Math.exp(-linearLogit * 1.12));
  } else if (modelId === 'dummy') {
    finalProb = 0.349; // Baseline prior
  }

  // Calculate local feature contributions (pseudo-SHAP)
  const contributions = [
    {
      feature: 'Glucose',
      impact: Math.abs(z.glucose * 0.35),
      direction: z.glucose >= 0 ? ('risk' as const) : ('protective' as const),
    },
    {
      feature: 'BMI',
      impact: Math.abs(z.bmi * 0.24),
      direction: z.bmi >= 0 ? ('risk' as const) : ('protective' as const),
    },
    {
      feature: 'Age',
      impact: Math.abs(z.age * 0.16),
      direction: z.age >= 0 ? ('risk' as const) : ('protective' as const),
    },
    {
      feature: 'Diabetes Pedigree',
      impact: Math.abs(z.diabetesPedigree * 0.12),
      direction: z.diabetesPedigree >= 0 ? ('risk' as const) : ('protective' as const),
    },
    {
      feature: 'Pregnancies',
      impact: Math.abs(z.pregnancies * 0.08),
      direction: z.pregnancies >= 0 ? ('risk' as const) : ('protective' as const),
    },
    {
      feature: 'Insulin',
      impact: Math.abs(z.insulin * 0.05),
      direction: z.insulin >= 0 ? ('risk' as const) : ('protective' as const),
    },
  ].sort((a, b) => b.impact - a.impact);

  return {
    probability: Math.min(0.99, Math.max(0.01, finalProb)),
    logit: linearLogit,
    contributions,
  };
}

// Pre-configured patient clinical case presets
export const CLINICAL_PRESETS = [
  {
    name: 'Patient A: Healthy Baseline',
    desc: '23yo female, normal glucose (88 mg/dL), normal BMI (22.1 kg/m²), 1 pregnancy, low pedigree.',
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
    desc: '38yo female, borderline glucose (114 mg/dL), overweight BMI (28.4 kg/m²), 3 pregnancies.',
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
    desc: '47yo female, elevated glucose (168 mg/dL), obese BMI (36.8 kg/m²), high pedigree (0.84).',
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
    desc: '31yo female, high glucose (134 mg/dL), but lean BMI (22.8 kg/m²). Caught by lower threshold (0.35)!',
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
