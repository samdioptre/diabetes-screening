# MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY (MUST)
## Department of Computer Science — CDS 3301: Machine Learning
### Group 2: Diabetes Risk Screening System (Classification)

**Course Lecturer:** Dr. Amos Chege Kirongo (`akirongo@must.ac.ke`)  
**Group 2 Members:**
1. Ordit Kagwira (CT202/114188/23) — Project Coordinator & Report Integration
2. Beauttah Kipruttoh (CT202/113636/23) — Data Acquisition, Cleaning & Imputation
3. Atitwa Samuel Makokha (CT202/113631/23) — Exploratory Data Analysis & Visualisations
4. Kiplangat Dancun (CT202/113622/23) — Model Building & Deployment Prototype
5. Wamukota Kevin (CT202/106143/21) — Hyperparameter Tuning & Evaluation

---

## 1. Project Overview & Architecture

This system is an academic-grade clinical decision-support application developed on the **Pima Indians Diabetes Database** ($N=768$). It features an authentic Machine Learning pipeline built with Python, Scikit-learn, and FastAPI, connected to a modern React + TypeScript + Recharts web interface.

### Tech Stack:
- **Backend:** Python 3.10+, FastAPI, Scikit-learn 1.4+, Pandas, NumPy, Joblib, Uvicorn.
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons.
- **Trained Models (Scikit-Learn):**
  1. Baseline: `DummyClassifier(strategy="most_frequent")`
  2. `LogisticRegression` (L1/L2 tuned)
  3. `KNeighborsClassifier` (Distance-weighted)
  4. `DecisionTreeClassifier` (Pruned CART)
  5. `RandomForestClassifier` (150 trees, balanced weights)
  6. `SupportVectorMachine` (RBF kernel, Platt probability calibration)

---

## 2. Directory Structure

```
diabetes-screening/
│
├── dataset/
│   └── diabetes.csv                     # Authentic Pima Indians Diabetes dataset
│
├── backend/
│   ├── main.py                          # FastAPI REST API application & endpoints
│   ├── train.py                         # Full ML training, 5-fold CV & evaluation pipeline
│   ├── predict.py                       # Inference engine with model explainability
│   ├── preprocessing.py                 # Biological zero handling, imputation & scaling
│   ├── test_pipeline.py                 # Automated unit tests for data, models & API
│   ├── requirements.txt                 # Python dependencies
│   └── models/                          # Serialized .joblib artifacts & genuine JSON metrics
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
├── frontend/ (or root src/)
│   ├── src/                             # React TypeScript source code
│   ├── components/                      # Clinical Calculator, EDA, Reports, Slides
│   ├── package.json                     # Node.js dependencies
│   └── vite.config.ts                   # Vite configuration & API proxying
│
├── notebooks/
│   └── diabetes_analysis.ipynb          # Runnable Jupyter notebook
│
├── reports/
│   └── project_report.md                # Full 12-page equivalent academic report
│
└── README.md                            # Complete setup, testing and deployment guide
```

---

## 3. Local Installation & Running Instructions

### Step 1: Clone or Unzip the Project
```bash
git clone <repository_url>
cd diabetes-screening
```

### Step 2: Set Up Python Backend
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r backend/requirements.txt
```

### Step 3: Train the Machine Learning Pipeline
Train all 6 classifiers, perform 5-fold stratified cross-validation, and evaluate on the test set:
```bash
python3 backend/train.py
```

### Step 4: Run Automated Pipeline Tests
Verify that dataset loading, zero-imputation, model saving/loading, and API endpoints are 100% operational:
```bash
python3 backend/test_pipeline.py
```

### Step 5: Start the FastAPI Backend
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI interactive Swagger documentation is available at:  
👉 `http://localhost:8000/docs`

### Step 6: Start the React Frontend
In a new terminal window:
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 4. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health check and count of loaded models |
| `GET` | `/api/models` | List of available models and summary metadata |
| `GET` | `/api/dataset/summary` | Real descriptive statistics, zero audit, and correlation matrix |
| `GET` | `/api/models/performance` | Real test-set metrics, confusion matrices, ROC and PR curves |
| `POST` | `/api/predict` | Executes prediction on 8 patient biomarkers with explainability |
| `POST` | `/api/retrain` | Triggers retraining of all models on dataset |

### Sample Prediction Payload (`POST /api/predict`):
```json
{
  "pregnancies": 3,
  "glucose": 145,
  "bloodPressure": 76,
  "skinThickness": 30,
  "insulin": 160,
  "bmi": 32.5,
  "diabetesPedigree": 0.62,
  "age": 44,
  "model_id": "random_forest",
  "threshold": 0.35
}
```

---

## 5. Render Cloud Deployment Instructions

Deploy the application as two separate services on Render:

### A. Python Backend (Render Web Service)
1. On [Render.com](https://render.com), click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure settings:
   - **Name:** `must-group2-diabetes-api`
   - **Environment:** `Python 3`
   - **Root Directory:** leave blank (or `backend`)
   - **Build Command:** `pip install -r backend/requirements.txt && python3 backend/train.py`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Deploy service. Copy the resulting backend URL (e.g. `https://must-group2-diabetes-api.onrender.com`).

### B. React Frontend (Render Static Site)
1. Click **New +** → **Static Site**.
2. Connect the same Git repository.
3. Configure settings:
   - **Name:** `must-group2-diabetes-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - Add `VITE_API_URL` with value `https://must-group2-diabetes-api.onrender.com`
4. Deploy the frontend static site.

---

## 6. Academic Integrity & Verification
- All models are trained using authentic Scikit-learn algorithms on the genuine Pima dataset.
- Zero data leakage: Preprocessing transformers (median imputer and standard scaler) are fitted exclusively on the 80% training partition.
- Model performance metrics (accuracy, precision, recall, F1, F2, ROC-AUC) are derived directly from predictions on the 154 unseen test samples.
