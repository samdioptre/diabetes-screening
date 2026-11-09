"""
Meru University of Science and Technology (MUST)
Department of Computer Science - CDS 3301 Machine Learning
Group 2: Automated Pipeline & Verification Tests
"""

import os
import json
import pytest
import numpy as np
import pandas as pd
from fastapi.testclient import TestClient

from preprocessing import build_preprocessor_pipeline, FEATURE_NAMES, BIOLOGICAL_ZERO_COLUMNS
from predict import predict_patient, get_model, get_preprocessor
from main import app

client = TestClient(app)


def test_dataset_exists_and_valid():
    """Verify genuine Pima Indians Diabetes dataset exists and contains 768 rows."""
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'diabetes.csv')
    assert os.path.exists(dataset_path), "Dataset file diabetes.csv not found!"

    df = pd.read_csv(dataset_path)
    assert df.shape[0] == 768, f"Expected 768 rows, found {df.shape[0]}"
    assert df.shape[1] == 9, f"Expected 9 columns, found {df.shape[1]}"
    for col in FEATURE_NAMES + ['Outcome']:
        assert col in df.columns, f"Missing required column {col}"


def test_preprocessing_zero_handling():
    """Verify that biological zeros are properly handled without leakage."""
    preprocessor = build_preprocessor_pipeline()
    sample_data = pd.DataFrame([{
        'Pregnancies': 0,      # Valid 0
        'Glucose': 0,          # Biologically invalid 0 (must be imputed)
        'BloodPressure': 0,    # Biologically invalid 0 (must be imputed)
        'SkinThickness': 0,    # Biologically invalid 0 (must be imputed)
        'Insulin': 0,          # Biologically invalid 0 (must be imputed)
        'BMI': 0.0,            # Biologically invalid 0 (must be imputed)
        'DiabetesPedigreeFunction': 0.45,
        'Age': 30
    }, {
        'Pregnancies': 2,
        'Glucose': 120,
        'BloodPressure': 70,
        'SkinThickness': 25,
        'Insulin': 100,
        'BMI': 28.5,
        'DiabetesPedigreeFunction': 0.55,
        'Age': 35
    }])

    transformed = preprocessor.fit_transform(sample_data)
    assert not np.isnan(transformed).any(), "Preprocessing left NaNs in output!"
    assert transformed.shape == (2, 8), "Transformed shape must be (2, 8)"


def test_all_models_exist_and_loadable():
    """Verify all 6 models are trained and saved as joblib files."""
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    expected_models = ['dummy', 'logistic_regression', 'knn', 'decision_tree', 'random_forest', 'svm']

    for mid in expected_models:
        model_path = os.path.join(models_dir, f"{mid}.joblib")
        assert os.path.exists(model_path), f"Model file {model_path} does not exist!"
        model = get_model(mid)
        assert model is not None, f"Failed to load model {mid}"


def test_prediction_output_structure():
    """Verify predict_patient function returns valid probabilities and explainability."""
    test_patient = {
        'Pregnancies': 3,
        'Glucose': 145,
        'BloodPressure': 76,
        'SkinThickness': 30,
        'Insulin': 160,
        'BMI': 32.5,
        'DiabetesPedigreeFunction': 0.62,
        'Age': 44
    }

    for mid in ['logistic_regression', 'random_forest', 'decision_tree', 'knn', 'svm']:
        result = predict_patient(test_patient, model_id=mid, threshold=0.35)
        assert 'probability' in result
        assert 0.0 <= result['probability'] <= 1.0
        assert 'prediction' in result
        assert result['prediction'] in [0, 1]
        assert 'risk_tier' in result
        assert 'feature_contributions' in result
        assert len(result['feature_contributions']) == 8
        assert 'medical_disclaimer' in result


def test_fastapi_endpoints():
    """Verify API endpoints return valid HTTP 200 responses with correct JSON schemas."""
    # Health endpoint
    r_health = client.get("/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"
    assert r_health.json()["models_count"] >= 6

    # Models list
    r_models = client.get("/api/models")
    assert r_models.status_code == 200
    assert len(r_models.json()["models"]) >= 6

    # Dataset summary
    r_summary = client.get("/api/dataset/summary")
    assert r_summary.status_code == 200
    assert r_summary.json()["total_rows"] == 768

    # Performance results
    r_perf = client.get("/api/models/performance")
    assert r_perf.status_code == 200
    assert "random_forest" in r_perf.json()["models"]

    # Predict endpoint
    payload = {
        "pregnancies": 2,
        "glucose": 130,
        "bloodPressure": 75,
        "skinThickness": 28,
        "insulin": 120,
        "bmi": 30.2,
        "diabetesPedigree": 0.5,
        "age": 36,
        "model_id": "random_forest",
        "threshold": 0.35
    }
    r_pred = client.post("/api/predict", json=payload)
    assert r_pred.status_code == 200
    resp_data = r_pred.json()
    assert "probability" in resp_data
    assert "is_positive" in resp_data
    assert len(resp_data["feature_contributions"]) == 8


if __name__ == '__main__':
    print("Running automated pipeline tests...")
    test_dataset_exists_and_valid()
    print("✓ Dataset exists and valid (768 rows, 9 columns)")
    test_preprocessing_zero_handling()
    print("✓ Preprocessing zero handling and imputation verified")
    test_all_models_exist_and_loadable()
    print("✓ All 6 trained models exist on disk and load correctly")
    test_prediction_output_structure()
    print("✓ Prediction output, probabilities, and explainability verified")
    test_fastapi_endpoints()
    print("✓ FastAPI endpoints (/health, /api/models, /api/dataset/summary, /api/predict) verified")
    print("\nALL 5 TEST SUITES PASSED CLEANLY!")
