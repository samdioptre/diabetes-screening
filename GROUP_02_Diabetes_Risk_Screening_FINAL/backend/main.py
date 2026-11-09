"""
Meru University of Science and Technology (MUST)
Department of Computer Science - CDS 3301 Machine Learning
Group 2: FastAPI REST API Microservice for Diabetes Risk Screening
"""

import os
import sys
import json
from typing import Dict, Any, Optional

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from predict import predict_patient, FEATURE_NAMES
import train

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

app = FastAPI(
    title="MUST CDS 3301 Diabetes Risk Screening API",
    description="Machine Learning Microservice by Group 2 for Diabetes Classification on Pima Indians Database.",
    version="1.0.0"
)

# Configure CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientMeasurementInput(BaseModel):
    pregnancies: float = Field(..., ge=0, le=25, description="Number of pregnancies")
    glucose: float = Field(..., ge=0, le=300, description="Plasma glucose concentration (mg/dL)")
    bloodPressure: float = Field(..., ge=0, le=200, description="Diastolic blood pressure (mm Hg)")
    skinThickness: float = Field(..., ge=0, le=120, description="Triceps skin fold thickness (mm)")
    insulin: float = Field(..., ge=0, le=900, description="2-Hour serum insulin (mu U/ml)")
    bmi: float = Field(..., ge=0, le=80, description="Body Mass Index (kg/m^2)")
    diabetesPedigree: float = Field(..., ge=0, le=3.0, description="Diabetes pedigree function score")
    age: float = Field(..., ge=1, le=120, description="Age in years")
    model_id: Optional[str] = Field("random_forest", description="Model algorithm to use")
    threshold: Optional[float] = Field(0.35, ge=0.01, le=0.99, description="Clinical screening decision threshold")


@app.get("/health")
def health_check():
    """Returns service health status and loaded model availability."""
    models_available = []
    if os.path.exists(MODELS_DIR):
        for f in os.listdir(MODELS_DIR):
            if f.endswith('.joblib') and f != 'preprocessor.joblib':
                models_available.append(f.replace('.joblib', ''))

    return {
        "status": "healthy",
        "service": "MUST CDS 3301 Group 2 Diabetes Risk Screening API",
        "institution": "Meru University of Science and Technology",
        "department": "Department of Computer Science",
        "lecturer": "Dr. Amos Chege Kirongo",
        "models_count": len(models_available),
        "available_models": sorted(models_available)
    }


@app.get("/api/models")
def get_available_models():
    """Returns list and metadata of all trained classifier algorithms."""
    eval_path = os.path.join(MODELS_DIR, 'evaluation_results.json')
    if not os.path.exists(eval_path):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Models not trained yet. Run train.py first."
        )

    with open(eval_path) as f:
        data = json.load(f)

    models_list = []
    for mid, mdata in data['models'].items():
        models_list.append({
            "id": mid,
            "name": mdata['name'],
            "type": mdata['type'],
            "description": mdata['description'],
            "best_params": mdata.get('best_params', {}),
            "test_roc_auc": mdata['test_metrics_default_tau']['roc_auc'],
            "test_accuracy": mdata['test_metrics_default_tau']['accuracy'],
            "test_recall_default": mdata['test_metrics_default_tau']['recall'],
            "test_recall_recommended": mdata['test_metrics_recommended_tau']['recall'],
        })

    return {
        "models": models_list,
        "recommended_champion": "random_forest",
        "recommended_screening_threshold": 0.35
    }


@app.get("/api/dataset/summary")
def get_dataset_summary():
    """Returns genuine Pima Indians Dataset descriptive statistics, zero audit, and correlation matrix."""
    summary_path = os.path.join(MODELS_DIR, 'dataset_summary.json')
    if not os.path.exists(summary_path):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Dataset summary not found. Run train.py first."
        )

    with open(summary_path) as f:
        summary = json.load(f)

    return summary


@app.get("/api/models/performance")
def get_models_performance():
    """Returns authentic test-set evaluation results, confusion matrices, ROC and PR curves."""
    eval_path = os.path.join(MODELS_DIR, 'evaluation_results.json')
    if not os.path.exists(eval_path):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Evaluation results not found. Run train.py first."
        )

    with open(eval_path) as f:
        eval_data = json.load(f)

    return eval_data


@app.post("/api/predict")
def predict_risk(payload: PatientMeasurementInput):
    """
    Screens patient measurements using the requested trained Scikit-learn model
    and returns genuine prediction, probability, risk tier, and feature explainability.
    """
    patient_dict = {
        'Pregnancies': payload.pregnancies,
        'Glucose': payload.glucose,
        'BloodPressure': payload.bloodPressure,
        'SkinThickness': payload.skinThickness,
        'Insulin': payload.insulin,
        'BMI': payload.bmi,
        'DiabetesPedigreeFunction': payload.diabetesPedigree,
        'Age': payload.age
    }

    try:
        result = predict_patient(
            patient_data=patient_dict,
            model_id=payload.model_id or 'random_forest',
            threshold=payload.threshold if payload.threshold is not None else 0.35
        )
        return result
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(fnf))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Prediction error: {str(e)}")


@app.post("/api/retrain")
def retrain_models():
    """Triggers retraining of all 6 models on the Pima dataset."""
    try:
        results = train.train_and_evaluate_all()
        return {
            "status": "success",
            "message": "All models successfully retrained and saved to disk.",
            "models_trained": list(results['models'].keys())
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Retraining failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
