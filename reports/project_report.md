# MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY (MUST)
## School of Computing and Informatics | Department of Computer Science
### CDS 3301: MACHINE LEARNING | Bachelor of Computer Technology (Year 4, Semester 1)
**GROUP 2 MINI-PROJECT: DIABETES RISK SCREENING SYSTEM**

- **Course Lecturer:** Dr. Amos Chege Kirongo (`akirongo@must.ac.ke`)
- **Group:** Group 2 (5 Members)
- **Date Issued:** Thursday, 5 November 2026
- **Submission Date:** Friday, 4 December 2026, 5:00 PM (EAT)

---

## 1. Group Members & Documented Contributions

| No. | Member Name | Registration Number | Designated Role |
| :--- | :--- | :--- | :--- |
| 1 | **Ordit Kagwira** | CT202/114188/23 | Project Coordinator, Task 1 Problem Framing, Task 8 Integration |
| 2 | **Beauttah Kipruttoh** | CT202/113636/23 | Data Acquisition, Biological Imputation (Task 2), Ethics (Task 6) |
| 3 | **Atitwa Samuel Makokha** | CT202/113631/23 | Exploratory Data Analysis, 5 Visualisations, Feature Importance |
| 4 | **Kiplangat Dancun** | CT202/113622/23 | Baseline & Comparison Models (Task 3), FastAPI Deployment (Task 7) |
| 5 | **Wamukota Kevin** | CT202/106143/21 | Hyperparameter Tuning (Task 4), Evaluation & Threshold Optimization (Task 5) |

---

## 2. Executive Summary & Core Research Question Resolution

### Problem Statement:
Diabetes Mellitus is an escalating public health crisis in sub-Saharan Africa. In rural Kenyan health dispensaries (e.g. Meru County Sub-County facilities), laboratory HbA1c auto-analyzers are rarely accessible due to cold-chain and reagent costs. The objective of this project is to develop and deploy a machine learning decision-support tool that flags high-risk patients using eight routine, non-invasive physiological measurements.

### Core Question:
> *"Is recall more important than precision for screening? What threshold would you recommend and why?"*

**Empirical & Clinical Resolution:**
1. **Asymmetric Misclassification Costs:**
   - **Cost of a False Negative (FN):** Catastrophic. An undiagnosed patient is discharged without medical intervention, allowing persistent hyperglycemia to cause diabetic retinopathy (blindness), nephropathy (dialysis), peripheral neuropathy (amputations), or fatal myocardial infarction.
   - **Cost of a False Positive (FP):** Negligible. A flagged patient is simply scheduled for a low-cost confirmatory Fasting Blood Glucose test (~KES 300) with zero physiological harm.
2. **Optimal Threshold ($\tau = 0.35$):**
   - At the standard threshold of $\tau = 0.50$, our champion Random Forest model leaves **14 out of 54 diabetic patients undetected** ($Recall = 74.1\%$).
   - By recalibrating the decision threshold to **$\tau = 0.35$**, sensitivity increases to **$90.7\%$** (capturing 49 out of 54 diabetic cases), dramatically reducing missed diagnoses while maintaining an acceptable false-positive workload. The $F_2$-score, which weights recall twice as heavily as precision, reaches its peak at **$0.798$**.

---

## 3. Real Dataset & Leakage-Free Preprocessing

### Dataset Profile:
- **Source:** Pima Indians Diabetes Database (National Institute of Diabetes and Digestive and Kidney Diseases - NIDDK / UCI Repository).
- **Scale:** 768 adult female patients, 8 clinical features, 1 binary target (`Outcome`: 500 negative [65.1%], 268 positive [34.9%]).
- **Licence:** CC0 Public Domain.

### Biological Zero-Value Audit & Imputation:
In physiological science, physiological attributes cannot be zero in living subjects:
- **Insulin:** 374 zeros ($48.70\%$)
- **SkinThickness:** 227 zeros ($29.56\%$)
- **BloodPressure:** 35 zeros ($4.56\%$)
- **BMI:** 11 zeros ($1.43\%$)
- **Glucose:** 5 zeros ($0.65\%$)

**Data Leakage Prevention:**
All zeros were converted to `NaN`. A `SimpleImputer(strategy='median')` and `StandardScaler` were assembled into a Scikit-learn `Pipeline` and fitted strictly on the 80% training partition ($n=614$), then transformatively applied to the held-out 20% test partition ($n=154$).

---

## 4. Model Training & Stratified Cross-Validation

Six classifiers were trained and tuned using 5-fold Stratified Cross-Validation on the training set:
1. **Dummy Baseline:** `DummyClassifier(strategy="most_frequent")` ($Accuracy = 64.9\%$, $Recall = 0.0\%$).
2. **Logistic Regression:** Tuned with L1/L2 regularization via `liblinear`.
3. **K-Nearest Neighbors (KNN):** Distance-weighted local neighborhood search.
4. **Decision Tree (CART):** Pruned recursive orthogonal partitioner.
5. **Random Forest Classifier:** Bootstrap-aggregated ensemble with balanced class weighting.
6. **Support Vector Machine (SVM):** Radial Basis Function (RBF) kernel with Platt probability calibration.

---

## 5. Authentic Test-Set Performance Evaluation

All metrics calculated on the 154 unseen test samples (100 negative, 54 positive):

| Model Family | Test Accuracy | Precision ($\tau=0.50$) | Recall ($\tau=0.50$) | Recall ($\mathbf{\tau=0.35}$) | $F_2$-Score ($\tau=0.35$) | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dummy Baseline** | 64.9% | 0.000 | 0.0% | 0.0% | 0.000 | 0.500 |
| **Decision Tree (CART)** | 72.1% | 0.617 | 53.7% | 81.5% | 0.775 | 0.823 |
| **KNN (k=13)** | 74.7% | 0.667 | 55.6% | 75.9% | 0.719 | 0.807 |
| **SVM (RBF Kernel)** | 72.7% | 0.630 | 53.7% | 70.4% | 0.686 | 0.811 |
| **Logistic Regression** | 70.1% | 0.583 | 51.9% | 75.9% | 0.717 | 0.810 |
| **Random Forest (Champion)** | **74.0%** | **0.606** | **74.1%** | **90.7%** | **0.798** | **0.820** |

---

## 6. System Architecture & Deployment

The application features a decoupled production architecture:
1. **Backend:** Python 3 + FastAPI running Scikit-learn inference pipeline on port 8000.
2. **Frontend:** React + TypeScript + Vite + Tailwind CSS + Recharts communicating via REST API (`/api/predict`, `/api/models/performance`, `/api/dataset/summary`).
3. **Local & Cloud Deployability:** Direct configuration for local execution and dual-service deployment on Render.
