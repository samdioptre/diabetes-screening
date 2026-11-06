/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Frontend REST API Client connecting to Python FastAPI backend
 */

export interface PatientMeasurementPayload {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigree: number;
  age: number;
  model_id?: string;
  threshold?: number;
}

export interface FeatureContribution {
  feature: string;
  raw_value: number;
  z_score: number;
  importance?: number;
  impact: number;
  abs_impact: number;
  direction: 'risk_increasing' | 'risk_reducing';
  explanation: string;
}

export interface PredictionResponse {
  model_id: string;
  model_name: string;
  probability: number;
  probability_percentage: string;
  threshold: number;
  prediction: 0 | 1;
  is_positive: boolean;
  risk_tier: 'LOW_RISK' | 'SCREENING_WATCH' | 'ELEVATED_RISK' | 'CRITICAL_TRIAGE';
  risk_label: string;
  clinical_recommendation: string;
  feature_contributions: FeatureContribution[];
  medical_disclaimer: string;
}

export interface ModelMetadata {
  id: string;
  name: string;
  type: string;
  description: string;
  best_params: Record<string, any>;
  test_roc_auc: number;
  test_accuracy: number;
  test_recall_default: number;
  test_recall_recommended: number;
}

export interface DatasetSummary {
  total_rows: number;
  features: string[];
  target: string;
  target_summary: {
    negative_count: number;
    positive_count: number;
    negative_percentage: number;
    positive_percentage: number;
  };
  zero_audit: Record<
    string,
    {
      zero_count: number;
      zero_percentage: number;
      is_biological_missing: boolean;
    }
  >;
  descriptive_stats: Record<string, Record<string, number>>;
  correlation_matrix: Record<string, Record<string, number>>;
}

export interface EvaluationResults {
  split_info: {
    total_samples: number;
    train_samples: number;
    test_samples: number;
    test_positives: number;
    test_negatives: number;
  };
  recommended_threshold: number;
  models: Record<
    string,
    {
      id: string;
      name: string;
      type: string;
      description: string;
      best_params: Record<string, any>;
      cv_metrics: {
        accuracy_mean: number;
        accuracy_std: number;
        recall_mean: number;
        precision_mean: number;
        roc_auc_mean: number;
      };
      test_metrics_default_tau: {
        threshold: number;
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
        f2_score: number;
        roc_auc: number;
        pr_auc: number;
        confusion_matrix: { tn: number; fp: number; fn: number; tp: number };
      };
      test_metrics_recommended_tau: {
        threshold: number;
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
        f2_score: number;
        confusion_matrix: { tn: number; fp: number; fn: number; tp: number };
      };
      roc_curve: { fpr: number; tpr: number; threshold: number }[];
      pr_curve: { recall: number; precision: number }[];
      feature_importances: {
        feature: string;
        importance: number;
        type: string;
        coefficient?: number;
      }[];
    }
  >;
}

// In development or when using proxy, empty string calls relative /api or /health
// If VITE_API_URL is configured (e.g. Render production backend), it prefixes the host
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function checkBackendHealth(): Promise<{
  status: string;
  models_count: number;
  available_models: string[];
}> {
  const resp = await fetch(`${API_BASE_URL}/health`);
  if (!resp.ok) {
    throw new Error(`Backend health check failed: ${resp.statusText}`);
  }
  return resp.json();
}

export async function fetchAvailableModels(): Promise<{
  models: ModelMetadata[];
  recommended_champion: string;
  recommended_screening_threshold: number;
}> {
  const resp = await fetch(`${API_BASE_URL}/api/models`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch models: ${resp.statusText}`);
  }
  return resp.json();
}

export async function fetchDatasetSummary(): Promise<DatasetSummary> {
  const resp = await fetch(`${API_BASE_URL}/api/dataset/summary`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch dataset summary: ${resp.statusText}`);
  }
  return resp.json();
}

export async function fetchModelsPerformance(): Promise<EvaluationResults> {
  const resp = await fetch(`${API_BASE_URL}/api/models/performance`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch model performance: ${resp.statusText}`);
  }
  return resp.json();
}

export async function predictRisk(
  payload: PatientMeasurementPayload
): Promise<PredictionResponse> {
  const resp = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Prediction failed (${resp.status}): ${errorText}`);
  }

  return resp.json();
}
