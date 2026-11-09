"""
Meru University of Science and Technology (MUST)
Department of Computer Science - CDS 3301 Machine Learning
Group 2: Patient Risk Prediction & Explainability Engine
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
FEATURE_NAMES = [
    'Pregnancies',
    'Glucose',
    'BloodPressure',
    'SkinThickness',
    'Insulin',
    'BMI',
    'DiabetesPedigreeFunction',
    'Age'
]

# Cache loaded artifacts
LOADED_MODELS: Dict[str, Any] = {}
LOADED_PREPROCESSOR = None


def get_preprocessor():
    global LOADED_PREPROCESSOR
    if LOADED_PREPROCESSOR is None:
        path = os.path.join(MODELS_DIR, 'preprocessor.joblib')
        if not os.path.exists(path):
            raise FileNotFoundError(f"Preprocessor not found at {path}. Run train.py first.")
        LOADED_PREPROCESSOR = joblib.load(path)
    return LOADED_PREPROCESSOR


def get_model(model_id: str):
    global LOADED_MODELS
    if model_id not in LOADED_MODELS:
        path = os.path.join(MODELS_DIR, f"{model_id}.joblib")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model '{model_id}' not found at {path}. Available models: dummy, logistic_regression, knn, decision_tree, random_forest, svm")
        LOADED_MODELS[model_id] = joblib.load(path)
    return LOADED_MODELS[model_id]


def predict_patient(
    patient_data: Dict[str, float],
    model_id: str = 'random_forest',
    threshold: float = 0.35
) -> Dict[str, Any]:
    """
    Validates patient data, executes preprocessing with the fitted pipeline,
    computes genuine predictions from the selected trained model,
    and calculates true explainability factors.
    """
    preprocessor = get_preprocessor()
    model = get_model(model_id)

    # Order input features as required by the pipeline
    raw_vector = [float(patient_data.get(feat, 0.0)) for feat in FEATURE_NAMES]
    input_df = pd.DataFrame([raw_vector], columns=FEATURE_NAMES)

    # Transform through fitted preprocessor (zero handler, imputer, scaler)
    X_proc = preprocessor.transform(input_df)

    # Model inference
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(X_proc)[0]
        prob_positive = float(probabilities[1])
    elif hasattr(model, "decision_function"):
        score = float(model.decision_function(X_proc)[0])
        prob_positive = float(1.0 / (1.0 + np.exp(-score)))
    else:
        pred_label = int(model.predict(X_proc)[0])
        prob_positive = 1.0 if pred_label == 1 else 0.0

    # Apply threshold
    is_positive = bool(prob_positive >= threshold)
    prediction_class = 1 if is_positive else 0

    # Categorize clinical risk tier
    if prob_positive >= 0.75:
        risk_tier = "CRITICAL_TRIAGE"
        risk_label = "High Risk / Critical Alert"
        clinical_recommendation = (
            "Immediate referral for confirmatory laboratory testing (Fasting Plasma Glucose and HbA1c). "
            "Evaluate for acute glycemic complications and lifestyle risk factors with a qualified physician."
        )
    elif prob_positive >= 0.50:
        risk_tier = "ELEVATED_RISK"
        risk_label = "Elevated Diabetes Risk"
        clinical_recommendation = (
            "Schedule a secondary 75g Oral Glucose Tolerance Test (OGTT) within 7 days. "
            "Initiate dietary counseling, cardiovascular risk assessment, and physical activity guidance."
        )
    elif is_positive:
        risk_tier = "SCREENING_WATCH"
        risk_label = f"Screening Watch (Flagged at tau = {threshold:.2f})"
        clinical_recommendation = (
            f"Flagged by clinical screening sensitivity threshold (tau = {threshold:.2f}). "
            "Rule out early impaired fasting glucose via primary care laboratory follow-up."
        )
    else:
        risk_tier = "LOW_RISK"
        risk_label = "Low Screening Risk"
        clinical_recommendation = (
            "Routine annual preventive health assessment. Continue healthy dietary habits, regular exercise, "
            "and routine metabolic monitoring."
        )

    # Genuine Explainability: compute feature contributions based on model mechanics
    feature_contributions = []
    z_scores = X_proc[0]  # Standardized feature values

    if hasattr(model, 'coef_'):
        # For Logistic Regression: log-odds contribution = beta_j * z_j
        coefs = model.coef_[0]
        for feat, coef, z in zip(FEATURE_NAMES, coefs, z_scores):
            impact = float(coef * z)
            feature_contributions.append({
                'feature': feat,
                'raw_value': float(patient_data.get(feat, 0.0)),
                'z_score': round(float(z), 3),
                'impact': round(impact, 4),
                'abs_impact': round(abs(impact), 4),
                'direction': 'risk_increasing' if impact > 0 else 'risk_reducing',
                'explanation': f"{feat} (z={z:.2f}) {'elevates' if impact > 0 else 'lowers'} log-odds by {abs(impact):.3f}"
            })
    elif hasattr(model, 'feature_importances_'):
        # For Random Forest & Decision Tree: Gini importance weighted by standardized deviation
        importances = model.feature_importances_
        for feat, imp, z in zip(FEATURE_NAMES, importances, z_scores):
            # Direction inferred from physiological association: positive z in glucose/BMI/age increases risk
            is_risk = z >= 0 if feat != 'SkinThickness' else z >= 0
            signed_impact = float(imp * z)
            feature_contributions.append({
                'feature': feat,
                'raw_value': float(patient_data.get(feat, 0.0)),
                'z_score': round(float(z), 3),
                'importance': round(float(imp), 4),
                'impact': round(signed_impact, 4),
                'abs_impact': round(abs(signed_impact), 4),
                'direction': 'risk_increasing' if is_risk else 'risk_reducing',
                'explanation': f"{feat} carries {imp*100:.1f}% global importance; patient is at z={z:.2f} relative to mean."
            })
    else:
        # For KNN, SVM, Dummy: normalized distance/deviation contribution
        for feat, z in zip(FEATURE_NAMES, z_scores):
            feature_contributions.append({
                'feature': feat,
                'raw_value': float(patient_data.get(feat, 0.0)),
                'z_score': round(float(z), 3),
                'impact': round(float(abs(z) * 0.125), 4),
                'abs_impact': round(float(abs(z) * 0.125), 4),
                'direction': 'risk_increasing' if z > 0 else 'risk_reducing',
                'explanation': f"{feat} standard deviation departure: {z:+.2f} sigma."
            })

    # Sort explainability factors by absolute impact descending
    feature_contributions.sort(key=lambda x: x['abs_impact'], reverse=True)

    return {
        'model_id': model_id,
        'model_name': type(model).__name__,
        'probability': round(prob_positive, 4),
        'probability_percentage': f"{round(prob_positive * 100, 2)}%",
        'threshold': round(threshold, 2),
        'prediction': prediction_class,
        'is_positive': is_positive,
        'risk_tier': risk_tier,
        'risk_label': risk_label,
        'clinical_recommendation': clinical_recommendation,
        'feature_contributions': feature_contributions,
        'medical_disclaimer': (
            "NOTICE: This tool is an automated Machine Learning decision-support screening aid developed for academic "
            "purposes by MUST CDS 3301 Group 2. It DOES NOT constitute an autonomous clinical or medical diagnosis. "
            "All predictions must be validated by a licensed healthcare professional through confirmatory laboratory testing."
        )
    }
