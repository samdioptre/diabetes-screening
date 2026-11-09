# MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY (MUST)
## School of Computing and Informatics | Department of Computer Science
### CDS 3301: Machine Learning — Group 2 Mini-Project Final Deliverables

**Course Unit:** CDS 3301: Machine Learning (BCT Year 4, Semester 1)  
**Project Theme:** Diabetes Risk Screening (Supervised Binary Classification)  
**Course Lecturer:** Dr. Amos Chege Kirongo (`akirongo@must.ac.ke`)  
**Submission Date:** Friday, 4 December 2026, 5:00 PM (EAT)

---

### Group 2 Project Team & Core Responsibilities

| No. | Member Name | Registration Number | Project Roles & Tasks |
|---|---|---|---|
| 1 | **Ordit Kagwira** (Coordinator) | `CT202/114188/23` | Task 1 Problem Framing, Task 8 Conclusions & Full Report Integration |
| 2 | **Beauttah Kipruttoh** | `CT202/113636/23` | Task 2 Data Acquisition, Biological Zero-Value Audit & Task 6 Responsible AI |
| 3 | **Atitwa Samuel Makokha** | `CT202/113631/23` | Task 2 Exploratory Visualisations & Task 5 Gini Feature Importance |
| 4 | **Kiplangat Dancun** | `CT202/113622/23` | Task 3 Model Architecture, Task 7 Full-Stack FastAPI & React Deployment |
| 5 | **Wamukota Kevin** | `CT202/106143/21` | Task 4 5-Fold Stratified GridSearchCV Tuning, Task 5 Threshold Calibration (\tau=0.35) |

---

## 1. Project Overview & Clinical Research Question

Early clinical screening for diabetes can dramatically reduce fatal microvascular and macrovascular complications in healthcare facilities with limited clinical laboratory infrastructure. This system implements an empirical Machine Learning clinical decision support pipeline on the **Pima Indians Diabetes Database** ($N=768$).

### The Core Research Question:
> **"Is recall more important than precision for screening? What threshold would you recommend and why?"**

* **Answer:** **Yes, Recall is paramount over Precision in medical screening.**
  * **False Negative (FN):** A diabetic patient is told they are healthy. Untreated hyperglycemia silently progresses over 3–5 years into retinopathy (blindness), nephropathy (kidney failure), or ketoacidosis. The clinical and human cost is lethal.
  * **False Positive (FP):** A non-diabetic patient is flagged for laboratory triage. They undergo an inexpensive ($\sim\text{KES }300$) confirmatory fasting plasma glucose assay. Status is resolved harmlessly within 24 hours.
* **Recommended Threshold:** Calibrating decision threshold from $\tau = 0.50$ to **$\tau = 0.35$** on our top-performing Random Forest classifier catapulted recall from **74.07% to 90.74%**, catching **49 out of 54 diabetic patients** on held-out test data (slashing missed diabetics from 14 down to only 5) and maximizing the clinical $F_2$-score to **0.798**.

---

## 2. Directory Structure & Verified Deliverables

```
GROUP_02_Diabetes_Risk_Screening_FINAL/
│
├── GROUP_02_Diabetes_Risk_Screening_Report.docx       # Complete 12-page Word Report (Tasks 1-8)
├── GROUP_02_Diabetes_Risk_Screening_Report.pdf        # Publication-grade PDF Report with embedded figures
├── GROUP_02_Diabetes_Risk_Screening_Notebook.ipynb    # Executed Jupyter Notebook (with all outputs saved)
├── GROUP_02_Diabetes_Risk_Screening_Slides.pptx       # 18-Slide 16:9 PowerPoint Defense & Demo Script
├── GROUP_02_Contribution_Statement.docx               # 1-Page Official Signed Contribution Statement
├── README.md                                          # This comprehensive guide
│
├── dataset/
│   └── diabetes.csv                                   # Authentic Pima Indians Diabetes dataset (N=768)
│
├── backend/
│   ├── main.py                                        # FastAPI REST service
│   ├── train.py                                       # 5-Fold Stratified CV & Model Training Pipeline
│   ├── predict.py                                     # Real-time inference engine with explainability
│   ├── preprocessing.py                               # Biological zero handling, imputation & scaling
│   ├── test_pipeline.py                               # Automated 5/5 unit test suite
│   ├── requirements.txt                               # Python dependencies
│   └── models/                                        # Serialized .joblib artifacts & JSON metrics
│       ├── preprocessor.joblib
│       ├── random_forest.joblib
│       ├── logistic_regression.joblib
│       ├── knn.joblib
│       ├── decision_tree.joblib
│       ├── svm.joblib
│       ├── dummy.joblib
│       ├── evaluation_results.json
│       └── dataset_summary.json
│
├── reports/
│   ├── figures/                                       # 10 Generated high-res PNG charts (DPI 300)
│   └── screenshots/                                   # Prototype UI screenshots
│
└── GROUP_02_Diabetes_Risk_Screening_Prototype.zip     # Complete reproducible standalone bundle
```

---

## 3. Local Installation & Running Instructions

### Step 1: Python Environment Setup
```bash
# Ensure Python 3.10+ is installed
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r backend/requirements.txt
```

### Step 2: Run Machine Learning Training & Tuning Pipeline
```bash
# Trains all 6 model families with 5-fold Stratified CV, GridSearchCV, and test evaluation
python3 backend/train.py
```

### Step 3: Run Automated Pipeline Tests
```bash
# Executes 5 test suites (data loading, biological zero handling, latency, predictions, threshold)
python3 backend/test_pipeline.py
```

### Step 4: Execute the Jupyter Notebook
```bash
# Execute top-to-bottom and preserve all outputs
python3 -m nbconvert --to notebook --execute --inplace GROUP_02_Diabetes_Risk_Screening_Notebook.ipynb
```

### Step 5: Start the FastAPI Backend Microservice
```bash
# Starts backend service on port 8001
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8001
```
* Interactive Swagger API documentation: `http://127.0.0.1:8001/docs`
* Health Check: `http://127.0.0.1:8001/health`

### Step 6: Start the React Frontend Application
```bash
# In another terminal window:
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 4. REST API Endpoint Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Microservice health status, loaded model count, and lecturer metadata |
| `GET` | `/api/models` | List of available models and summary specifications |
| `GET` | `/api/dataset/summary` | Descriptive statistics, zero-value audit, and Pearson correlation matrix |
| `GET` | `/api/models/performance` | Held-out test set metrics, confusion matrices, ROC and PR curves |
| `POST` | `/api/predict` | Executes prediction on 8 patient biomarkers with local explainability |
| `POST` | `/api/retrain` | Triggers background model retraining pipeline |

### Example Prediction Request (`POST /api/predict`):
```json
{
  "pregnancies": 2,
  "glucose": 130,
  "bloodPressure": 70,
  "skinThickness": 28,
  "insulin": 110,
  "bmi": 28.5,
  "diabetesPedigree": 0.45,
  "age": 32,
  "modelName": "random_forest",
  "threshold": 0.35
}
```

### Example Prediction Response:
```json
{
  "model_id": "random_forest",
  "probability": 0.4404,
  "probability_percentage": "44.04%",
  "threshold": 0.35,
  "prediction": 1,
  "is_positive": true,
  "risk_tier": "SCREENING_WATCH",
  "risk_label": "Screening Watch (Flagged at tau = 0.35)",
  "clinical_recommendation": "Flagged by clinical screening sensitivity threshold (tau = 0.35). Rule out early impaired fasting glucose via primary care laboratory follow-up."
}
```

---

## 5. Deployment Guide (Render & Cloud Services)

### Backend (Render Web Service)
1. Repository Root or `backend/` directory.
2. Build Command: `pip install -r backend/requirements.txt && python3 backend/train.py`
3. Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Render Static Site)
1. Build Command: `npm install && npm run build`
2. Publish Directory: `dist`
3. Environment Variable: `VITE_API_URL` pointing to backend deployment URL.

---

## 6. Academic Integrity & Responsible AI Declaration

* All models are strictly trained on authentic data from the NIDDK Pima Indians Diabetes Database ($N=768$).
* Preprocessing transformers are fitted exclusively within training partitions to eliminate data leakage.
* Complies with the **Kenya Data Protection Act (2019)**: ephemeral in-memory inference with zero storage of personally identifiable information.
* Clinical Safety Overrides: Hardcoded safety rules trigger an emergency triage alert for Fasting Glucose $\ge 200\text{ mg/dL}$ or Blood Pressure $\ge 180\text{ mmHg}$, regardless of statistical output.
