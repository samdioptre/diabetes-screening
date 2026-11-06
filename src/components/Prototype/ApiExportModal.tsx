/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Task 7: REST API & Render Deployment Code Exporter
 */

import React, { useState } from 'react';
import { X, Check, Copy, Terminal, Code2, Download, ExternalLink } from 'lucide-react';

interface ApiExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiExportModal: React.FC<ApiExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'fastapi' | 'curl' | 'render' | 'pipeline'>('fastapi');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const codeSnippets = {
    fastapi: `"""
Meru University of Science and Technology (MUST)
Department of Computer Science - CDS 3301 Machine Learning
Group 2: FastAPI Production Microservice (backend/main.py)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from predict import predict_patient

app = FastAPI(
    title="MUST CDS 3301 Diabetes Risk Screening API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientMeasurementInput(BaseModel):
    pregnancies: float = Field(..., ge=0, le=25)
    glucose: float = Field(..., ge=0, le=300)
    bloodPressure: float = Field(..., ge=0, le=200)
    skinThickness: float = Field(..., ge=0, le=120)
    insulin: float = Field(..., ge=0, le=900)
    bmi: float = Field(..., ge=0, le=80)
    diabetesPedigree: float = Field(..., ge=0, le=3.0)
    age: float = Field(..., ge=1, le=120)
    model_id: str = "random_forest"
    threshold: float = 0.35

@app.get("/health")
def health():
    return {"status": "healthy", "service": "MUST CDS 3301 Diabetes Screener"}

@app.post("/api/predict")
def predict_risk(payload: PatientMeasurementInput):
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
    return predict_patient(patient_dict, payload.model_id, payload.threshold)
`,
    curl: `# 1. Health Check
curl -X GET http://localhost:8001/health

# 2. Get All Model Architectures & Performance
curl -X GET http://localhost:8001/api/models

# 3. Get Dataset Summary & Descriptive Statistics
curl -X GET http://localhost:8001/api/dataset/summary

# 4. Predict Patient Risk (Authentic Scikit-Learn Model)
curl -X POST http://localhost:8001/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{
    "pregnancies": 3,
    "glucose": 158,
    "bloodPressure": 80,
    "skinThickness": 32,
    "insulin": 180,
    "bmi": 34.5,
    "diabetesPedigree": 0.65,
    "age": 48,
    "model_id": "random_forest",
    "threshold": 0.35
  }'
`,
    render: `# RENDER DEPLOYMENT CONFIGURATION

# Service 1: Python Web Service (Backend)
# - Name: must-group2-diabetes-api
# - Environment: Python 3
# - Build Command: pip install -r backend/requirements.txt && python3 backend/train.py
# - Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT

# Service 2: Static Site (Frontend)
# - Name: must-group2-diabetes-frontend
# - Build Command: npm install && npm run build
# - Publish Directory: dist
# - Environment Variable: VITE_API_URL=https://must-group2-diabetes-api.onrender.com
`,
    pipeline: `# RUNNING LOCAL PIPELINE COMMANDS

# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Run training pipeline & evaluate on test set
python3 backend/train.py

# 3. Run automated tests
python3 backend/test_pipeline.py

# 4. Start backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Task 7 Production REST API &amp; Render Cloud Deployment
              </h3>
              <p className="text-slate-400 text-xs">
                Real Python FastAPI source code, cURL commands, and Render deployment specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('fastapi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'fastapi'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FastAPI (main.py)
            </button>
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'curl'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              cURL Requests
            </button>
            <button
              onClick={() => setActiveTab('render')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'render'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Render Cloud Setup
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'pipeline'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pipeline Commands
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content View */}
        <div className="p-5 flex-1 overflow-y-auto">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300/90 leading-relaxed overflow-x-auto selection:bg-emerald-500/30">
            <code>{codeSnippets[activeTab]}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <a
            href="/diabetes-risk-screening-must-group2.zip"
            download="diabetes-risk-screening-must-group2.zip"
            className="text-amber-400 font-bold hover:underline flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download All Code &amp; Dataset (ZIP Archive)</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
