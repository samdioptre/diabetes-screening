/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Task 7: REST API & Python Prototype Code Exporter
 */

import React, { useState } from 'react';
import { X, Check, Copy, Terminal, Code2, Download } from 'lucide-react';

interface ApiExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiExportModal: React.FC<ApiExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'flask' | 'streamlit' | 'curl' | 'joblib'>('flask');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const codeSnippets = {
    flask: `"""
Meru University of Science and Technology (MUST)
Department of Computer Science - CDS 3301 Machine Learning
Group 2: Flask REST API Microservice for Diabetes Risk Screening
"""

from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load packaged scikit-learn pipeline (Task 7)
model_package = joblib.load('diabetes_rf_pipeline_v1.joblib')
scaler = model_package['scaler']
model = model_package['model']
RECOMMENDED_THRESHOLD = 0.35  # Clinically optimized threshold (90.7% Recall)

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "MUST CDS 3301 Diabetes Risk Screener",
        "group": "Group 2",
        "model_version": "1.0.0",
        "champion_model": "RandomForestClassifier",
        "operating_threshold": RECOMMENDED_THRESHOLD
    })

@app.route('/api/v1/screen-diabetes', methods=['POST'])
def screen_diabetes():
    data = request.get_json(force=True)
    
    # Required 8 clinical biomarkers
    features = [
        float(data.get('pregnancies', 0)),
        float(data.get('glucose', 120)),
        float(data.get('bloodPressure', 72)),
        float(data.get('skinThickness', 29)),
        float(data.get('insulin', 125)),
        float(data.get('bmi', 32.3)),
        float(data.get('diabetesPedigree', 0.47)),
        float(data.get('age', 33))
    ]
    
    # Preprocess & predict
    X = np.array([features])
    X_scaled = scaler.transform(X)
    prob = float(model.predict_proba(X_scaled)[0, 1])
    
    threshold = float(data.get('threshold', RECOMMENDED_THRESHOLD))
    is_high_risk = bool(prob >= threshold)
    
    # Clinical action logic
    if prob >= 0.75:
        tier = "CRITICAL_TRIAGE"
        action = "Urgent diagnostic Fasting Blood Glucose (FBG) and HbA1c required. Physician consult within 24h."
    elif prob >= 0.50:
        tier = "ELEVATED_RISK"
        action = "Recommend 75g Oral Glucose Tolerance Test (OGTT) within 7 days. Initiate dietary counseling."
    elif is_high_risk:
        tier = "SCREENING_WATCH"
        action = "Flagged by screening threshold (tau=0.35). Rule out early impaired fasting glucose with lab test."
    else:
        tier = "LOW_RISK"
        action = "Routine annual health checkup. Encourage balanced nutrition and physical activity."

    return jsonify({
        "calculated_probability": round(prob, 4),
        "percentage": f"{round(prob * 100, 2)}%",
        "operating_threshold": threshold,
        "is_flagged_for_referral": is_high_risk,
        "risk_tier": tier,
        "clinical_action_plan": action,
        "model_metadata": {
            "algorithm": "Tuned Random Forest",
            "test_roc_auc": 0.873,
            "test_recall_at_recommended_threshold": 0.9074
        }
    })

if __name__ == '__main__':
    print("Serving MUST Group 2 Diabetes Risk Screening API on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)
`,
    streamlit: `"""
Meru University of Science and Technology (MUST)
Group 2: Streamlit Interactive Clinical Screening Prototype
Run command: streamlit run streamlit_app.py
"""

import streamlit as st
import numpy as np
import joblib

st.set_page_config(page_title="MUST Group 2 - Diabetes Screener", layout="wide")

st.title("🩺 Diabetes Risk Screening Prototype")
st.caption("Meru University of Science and Technology | CDS 3301 Group 2 | Dr. Amos Chege Kirongo")

# Load model
@st.cache_resource
def load_model():
    return joblib.load('diabetes_rf_pipeline_v1.joblib')

pipeline = load_model()
scaler = pipeline['scaler']
model = pipeline['model']

col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("Patient Clinical Biomarkers")
    c1, c2 = st.columns(2)
    with c1:
        pregnancies = st.slider("Pregnancies", 0, 17, 2)
        glucose = st.slider("Glucose (2h OGTT, mg/dL)", 40, 200, 135)
        bp = st.slider("Blood Pressure (Diastolic, mm Hg)", 40, 130, 78)
        skin = st.slider("Skin Thickness (Triceps, mm)", 5, 99, 28)
    with c2:
        insulin = st.slider("Insulin (2h Serum, μU/mL)", 10, 800, 120)
        bmi = st.slider("Body Mass Index (BMI, kg/m²)", 15.0, 65.0, 31.4)
        pedigree = st.slider("Diabetes Pedigree Function", 0.05, 2.50, 0.52)
        age = st.slider("Age (Years)", 21, 85, 41)

    threshold = st.slider("Clinical Decision Threshold (tau)", 0.10, 0.90, 0.35, 0.05,
                          help="Group 2 recommends tau=0.35 for 90.7% screening sensitivity!")

with col2:
    st.subheader("Screening Assessment")
    features = np.array([[pregnancies, glucose, bp, skin, insulin, bmi, pedigree, age]])
    X_scaled = scaler.transform(features)
    prob = model.predict_proba(X_scaled)[0, 1]

    st.metric("Risk Probability", f"{prob*100:.1f}%")
    st.progress(float(prob))

    if prob >= threshold:
        st.error(f"🚨 FLAGGED: HIGH RISK (Above tau = {threshold:.2f})")
        st.write("**Action Plan:** Patient flagged for secondary lab glucose / HbA1c testing.")
    else:
        st.success(f"✅ LOW RISK (Below tau = {threshold:.2f})")
        st.write("**Action Plan:** Routine annual preventive assessment.")
`,
    curl: `# Health Check Endpoint
curl -X GET https://api.must-group2-diabetes.ke/api/v1/health

# Screen High-Risk Patient (JSON Payload)
curl -X POST https://api.must-group2-diabetes.ke/api/v1/screen-diabetes \\
  -H "Content-Type: application/json" \\
  -d '{
    "pregnancies": 3,
    "glucose": 158,
    "bloodPressure": 82,
    "skinThickness": 32,
    "insulin": 180,
    "bmi": 34.6,
    "diabetesPedigree": 0.67,
    "age": 45,
    "threshold": 0.35
  }'

# Expected JSON Response:
# {
#   "calculated_probability": 0.7842,
#   "percentage": "78.42%",
#   "is_flagged_for_referral": true,
#   "risk_tier": "CRITICAL_TRIAGE",
#   "clinical_action_plan": "Urgent diagnostic Fasting Blood Glucose (FBG) and HbA1c required."
# }
`,
    joblib: `# Model Packaging Python Script (Task 7 Deliverable)
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Package training pipeline
pipeline = {
    'scaler': scaler,
    'model': rf_best,
    'features': ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
                 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'],
    'recommended_threshold': 0.35,
    'model_metadata': {
        'institution': 'Meru University of Science and Technology',
        'course': 'CDS 3301 Machine Learning',
        'group': 'Group 2',
        'test_accuracy': 0.812,
        'test_roc_auc': 0.873,
        'test_recall': 0.9074
    }
}

joblib.dump(pipeline, 'diabetes_rf_pipeline_v1.joblib')
print("Model pipeline successfully serialized to 'diabetes_rf_pipeline_v1.joblib'")
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
                Task 7 Deployment Prototype Source Code & REST API
              </h3>
              <p className="text-slate-400 text-xs">
                Packaged model microservice & Streamlit code for computer technology review
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
              onClick={() => setActiveTab('flask')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'flask'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flask REST API (app.py)
            </button>
            <button
              onClick={() => setActiveTab('streamlit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'streamlit'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Streamlit Web App
            </button>
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'curl'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              cURL Request Tester
            </button>
            <button
              onClick={() => setActiveTab('joblib')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'joblib'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Joblib Export Script
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
          <span>
            Group 2 Milestone Deliverable • Meru University of Science & Technology
          </span>
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
