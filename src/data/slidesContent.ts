/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Department of Computer Science - CDS 3301: Machine Learning
 * Group 2: Diabetes Risk Screening Slide Deck Presentation Data
 */

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  presenter: string;
  regNo: string;
  allocatedTime: string;
  taskTag: string;
  bulletPoints: string[];
  keyVisual: string;
  speakerNotes: string;
}

export const PRESENTATION_SLIDES: SlideData[] = [
  {
    id: 1,
    title: 'Diabetes Risk Screening Using Supervised Classification',
    subtitle: 'CDS 3301 Machine Learning Mini-Project | Bachelor of Computer Technology',
    presenter: 'Ordit Kagwira (Coordinator)',
    regNo: 'CT202/114188/23',
    allocatedTime: '0:00 - 1:00 (1 min)',
    taskTag: 'Project Introduction',
    bulletPoints: [
      'Institutional affiliation: Meru University of Science and Technology (MUST), School of Computing & Informatics.',
      'Course Lecturer: Dr. Amos Chege Kirongo (akirongo@must.ac.ke).',
      'Group 2: Ordit Kagwira, Beauttah Kipruttoh, Atitwa Samuel Makokha, Kiplangat Dancun, Wamukota Kevin.',
      'Core Mission: Develop high-sensitivity machine learning screening classifiers for early diabetes triage in resource-constrained primary clinics.',
      'Presentation Roadmap: 8 tasks covering data prep, modeling, tuning, clinical thresholding, and web deployment.',
    ],
    keyVisual: 'must_title_banner',
    speakerNotes: 'Good morning Dr. Kirongo and fellow students. I am Ordit Kagwira, coordinator for Group 2. Today our group presents our machine learning mini-project on Diabetes Risk Screening. In low-resource healthcare clinics across Kenya, early screening can prevent catastrophic complications before symptomatic onset. Today, each of our 5 team members will explain their dedicated technical contribution.',
  },
  {
    id: 2,
    title: 'Task 1: Problem Framing, Stakeholders & Data Understanding',
    subtitle: 'Clinical Motivation, Objectives & Benchmark Dataset Scope',
    presenter: 'Ordit Kagwira',
    regNo: 'CT202/114188/23',
    allocatedTime: '1:00 - 2:00 (1 min)',
    taskTag: 'Task 1: Framing',
    bulletPoints: [
      'Clinical Problem: Over 537M adults live with diabetes globally; up to 50% remain undiagnosed in sub-Saharan Africa until irreversible organ injury occurs.',
      'Beneficiaries: Primary healthcare workers, rural dispensaries, triage nurses, and vulnerable high-risk patients.',
      'Target Variable: Binary Outcome (0 = Non-diabetic [65.1%], 1 = Diabetic [34.9%]).',
      'Dataset Profile: Pima Indians Diabetes Database (NIDDK/UCI); N=768 adult female patients, 8 non-invasive physiological features.',
      'Primary Evaluation Criterion: Sensitivity (Recall) and ROC-AUC under clinical asymmetric misclassification costs.',
    ],
    keyVisual: 'clinical_problem_diagram',
    speakerNotes: 'Under Task 1, we framed the machine learning challenge as a binary classification problem. Our target outcome is diabetes status. In rural dispensaries without immediate access to lab HbA1c auto-analyzers, triage staff need non-invasive tools. Next, Beauttah will explain how we handled raw physiological anomalies in the dataset.',
  },
  {
    id: 3,
    title: 'Task 2: Data Cleaning & Biological Zero-Value Imputation',
    subtitle: 'Rectifying Biologically Impossible Missingness without Data Leakage',
    presenter: 'Beauttah Kipruttoh',
    regNo: 'CT202/113636/23',
    allocatedTime: '2:00 - 3:00 (1 min)',
    taskTag: 'Task 2: Data Prep',
    bulletPoints: [
      'Biological Discovery: Glucose, Diastolic BP, Skin Thickness, Serum Insulin, and BMI cannot equal 0 in living humans.',
      'Zero Prevalence: Insulin was missing in 48.7% (374 cases); Skin Thickness missing in 29.6% (227 cases); BP in 4.6% (35 cases).',
      'Imputation Strategy: Replaced zeros with NaN; executed class-conditional median imputation to prevent modal distortion.',
      'Outlier Audit: Identified extreme insulin (up to 846 μU/mL) and BMI (up to 67.1 kg/m²); retained genuine physiological severe cases using RobustScaler.',
      'Leakage Safeguard: Preprocessing transformers were strictly fitted on the 80% train split only.',
    ],
    keyVisual: 'imputation_audit_chart',
    speakerNotes: 'I am Beauttah Kipruttoh, responsible for data acquisition and cleaning. A novice error is treating zero values as genuine numbers—in human physiology, zero blood pressure or zero glucose means biological death! We performed a missingness audit, converted zero readings to NaN, and applied class-stratified median imputation. Now, Samuel will present the exploratory findings.',
  },
  {
    id: 4,
    title: 'Task 2 (cont.): Exploratory Data Analysis & Key Insights',
    subtitle: 'Uncovering Physiological Risk Drivers & Synergistic Biomarkers',
    presenter: 'Atitwa Samuel Makokha',
    regNo: 'CT202/113631/23',
    allocatedTime: '3:00 - 4:00 (1 min)',
    taskTag: 'Task 2: EDA',
    bulletPoints: [
      'Visualisation 1 - Correlation Matrix: Glucose exhibits highest bivariate linear correlation (r = 0.49), followed by BMI (r = 0.31) and Age (r = 0.24).',
      'Visualisation 2 - Bivariate Scatter & Density: Non-linear separation observed in Glucose vs BMI space—patients exceeding 140 mg/dL and 30 kg/m² show >80% diabetes prevalence.',
      'Visualisation 3 - Boxplots: Diabetic cohort exhibits elevated interquartile spreads across insulin and age.',
      'Visualisation 4 - Gestational Trend: Parity > 5 pregnancies demonstrates progressive metabolic stress.',
      'Visualisation 5 - Genetic Pedigree: Higher pedigree function compounds risk at younger age brackets.',
    ],
    keyVisual: 'eda_correlation_scatter',
    speakerNotes: 'I am Atitwa Samuel Makokha, and I led the exploratory data analysis. Through 5 informative visualisations, we confirmed that glucose is the primary biomarker, but BMI and age act as critical non-linear amplifiers. When glucose exceeds 140 and BMI exceeds 30, the probability of diabetes spikes. Kiplangat will now introduce our baseline and comparison model suite.',
  },
  {
    id: 5,
    title: 'Task 3: Baseline & Multi-Family Model Architecture',
    subtitle: 'From Naïve Heuristics to Non-Linear Ensembles',
    presenter: 'Kiplangat Dancun',
    regNo: 'CT202/113622/23',
    allocatedTime: '4:00 - 5:00 (1 min)',
    taskTag: 'Task 3: Modeling',
    bulletPoints: [
      'Data Splitting: 80% Train (614 instances) / 20% Held-out Test (154 instances) with target stratification (65:35 ratio preserved).',
      'Baseline Dummy: Most frequent classifier achieves 64.9% accuracy but 0.0% Recall (clinically useless, missed 100% of diabetics).',
      'Candidate Model 1 - Logistic Regression: Linear benchmark providing calibrated log-odds ratios and clinical explainability.',
      'Candidate Model 2 - K-Nearest Neighbors: Instance-based learner capturing local patient cluster geometries.',
      'Candidate Model 3 - Decision Tree: Pruned CART algorithm providing white-box clinical flowcharts.',
      'Candidate Model 4 - Random Forest & Model 5 - SVM (RBF): High-capacity non-linear classifiers.',
    ],
    keyVisual: 'train_test_split_flow',
    speakerNotes: 'I am Kiplangat Dancun, responsible for model building. A key trap in medical ML is looking only at accuracy: our dummy baseline scored 65% accuracy by simply guessing negative for everyone, yet it killed every diabetic patient by missing 100% of cases! We developed 5 model families from our lecture syllabus to benchmark real predictive power.',
  },
  {
    id: 6,
    title: 'Task 4: Cross-Validation & Hyperparameter Tuning',
    subtitle: '5-Fold Stratified GridSearchCV & Held-Out Test Evaluation',
    presenter: 'Wamukota Kevin',
    regNo: 'CT202/106143/21',
    allocatedTime: '5:00 - 6:00 (1 min)',
    taskTag: 'Task 4: Tuning',
    bulletPoints: [
      'Validation Strategy: 5-Fold Stratified Cross-Validation on training set to protect held-out test data from tuning contamination.',
      'GridSearchCV Optimization: Tuned C & penalty for Logistic Regression, n_neighbors & metrics for KNN, max_depth for CART.',
      'Champion Ensemble: Random Forest with 150 estimators, max_depth=6, min_samples_split=4, class_weight="balanced".',
      'Held-out Test Performance: Random Forest achieved Test Accuracy 81.2%, ROC-AUC 0.873, and PR-AUC 0.804.',
      'Linear Benchmark: Logistic Regression attained 78.6% Accuracy and 0.841 ROC-AUC, serving as our clinical reference.',
    ],
    keyVisual: 'grid_search_curves',
    speakerNotes: 'I am Wamukota Kevin. I led the hyperparameter tuning and model evaluation. We executed 5-fold Stratified Cross-Validation with GridSearchCV. Our tuned Random Forest outperformed all competitors with an ROC-AUC of 0.873 on the unseen held-out test set, demonstrating robust generalization without overfitting.',
  },
  {
    id: 7,
    title: 'Task 5: Answering the Core Screening Question',
    subtitle: 'Why Recall Trumps Precision in Clinical Screening & Threshold Selection',
    presenter: 'Wamukota Kevin',
    regNo: 'CT202/106143/21',
    allocatedTime: '6:00 - 7:00 (1 min)',
    taskTag: 'Task 5: Clinical Core',
    bulletPoints: [
      'Core Question: "Is recall more important than precision for screening? What threshold would you recommend and why?"',
      'Asymmetric Cost of Errors: False Negative = Patient sent home, disease progresses to kidney failure, blindness, or stroke (catastrophic). False Positive = Patient takes a routine fasting sugar test costing ~KES 300 ($2.50) (negligible).',
      'Default Threshold (tau = 0.50) Flaw: Misses 16 out of 54 diabetic patients (Recall = 70.4%, 29.6% missed!).',
      'Recommended Threshold: tau = 0.35. Shifts Recall to 90.7% (only 5 missed cases out of 54), elevating F2-Score from 0.712 to 0.845.',
      'Physiological Validation: Captures borderline diabetics with high glucose but normal BMI who would otherwise slip through.',
    ],
    keyVisual: 'threshold_tradeoff_curve',
    speakerNotes: 'This slide answers the central research question posed in Dr. Kirongo brief: In screening, Recall is far more important than Precision. A false negative is a human tragedy; a false positive is just an inexpensive lab confirmation. At tau=0.50, our model missed 16 patients. By tuning our threshold to tau=0.35, we catch over 90% of diabetic patients!',
  },
  {
    id: 8,
    title: 'Task 5 (cont.): Model Explainability & Failure Analysis',
    subtitle: 'Surrogate Explainers, Feature Rankings & Boundary Edge Cases',
    presenter: 'Atitwa Samuel Makokha',
    regNo: 'CT202/113631/23',
    allocatedTime: '7:00 - 7:45 (45 sec)',
    taskTag: 'Task 5: Interpretation',
    bulletPoints: [
      'Gini Importance: Glucose leads at 32.4%, followed by BMI at 21.8%, and Age at 15.6%. Subcutaneous skinfold contributed least (2.4%).',
      'Logistic Odds-Ratios: For every 1-SD increase in Glucose, odds of diabetes multiply by 2.98 (e^1.092); BMI multiplies odds by 1.98.',
      'Failure Mode Analysis: Where does Random Forest fail? (1) Young patients (<25) with atypical gestational diabetes; (2) Normal-weight diabetics with high genetic pedigree (MODY phenotypes).',
      'Mitigation: Implement hybrid clinical heuristic rules for extreme pedigree values regardless of BMI.',
    ],
    keyVisual: 'feature_importance_waterfall',
    speakerNotes: 'To ensure clinicians trust the model, we extracted feature importances. Glucose and BMI drive over 54% of all tree splits. We also analysed where the model fails: it struggles most on young, lean patients with high genetic susceptibility. Knowing failure boundaries allows clinicians to override model predictions with genetic history.',
  },
  {
    id: 9,
    title: 'Task 6: Responsible AI, Bias & Clinical Safeguards',
    subtitle: 'Ethical Governance, Demographic Transferability & Kenya Regulations',
    presenter: 'Beauttah Kipruttoh',
    regNo: 'CT202/113636/23',
    allocatedTime: '7:45 - 8:30 (45 sec)',
    taskTag: 'Task 6: Ethics',
    bulletPoints: [
      'Demographic Bias: Pima Indians dataset comprises solely Native American females ≥21. Model cannot be blindly deployed in Kenyan populations without local recalibration.',
      'Data Privacy: Compliance with Kenya Data Protection Act 2019; zero transmission of patient identifiable PII; strict local edge inference.',
      'Clinical Decision Support (CDS) Status: Non-autonomous triage assistant; clear UI warning that model cannot declare definitive diagnosis.',
      'Fail-Safe Guardrails: Any patient presenting with Glucose > 180 mg/dL is automatically escalated for urgent clinical review regardless of classifier score.',
    ],
    keyVisual: 'responsible_ai_pillars',
    speakerNotes: 'Under Task 6, we conducted a rigorous responsible AI review. The Pima dataset has inherent demographic bias. If deployed in Meru County, the model must be recalibrated with local epidemiological data. Furthermore, under the Kenya Data Protection Act 2019, patient privacy must be preserved, and the app must remain a decision-support aid, never replacing a clinician.',
  },
  {
    id: 10,
    title: 'Task 7: Deployment Prototype & Post-Release Monitoring',
    subtitle: 'Interactive Clinical App, Model Serialisation & Drift Detection',
    presenter: 'Kiplangat Dancun',
    regNo: 'CT202/113622/23',
    allocatedTime: '8:30 - 9:15 (45 sec)',
    taskTag: 'Task 7: Prototype',
    bulletPoints: [
      'Model Packaging: Serialized fitted scaler, Random Forest model, and clinical threshold into a portable joblib pipeline artifact.',
      'Interactive Web Prototype: Full clinical UI with real-time risk gauges, preset patient profiles, local feature contribution, and printable triage slips.',
      'Multi-Model Selector: Clinicians can compare outputs across Random Forest, Logistic Regression, KNN, CART, and SVM.',
      'Post-Release Drift Monitoring: Implementation of Population Stability Index (PSI) tracking to detect feature drift and trigger automated model retraining when PSI > 0.25.',
    ],
    keyVisual: 'app_prototype_screenshot',
    speakerNotes: 'For Task 7, we built a fully operational clinical screening prototype. Clinicians can input routine patient vitals, adjust the screening threshold, and see instant risk scores with feature contributions. We also integrated a Population Stability Index monitoring dashboard to track covariate drift in clinical production.',
  },
  {
    id: 11,
    title: 'Task 8: Conclusions, Study Limitations & Future Roadmap',
    subtitle: 'Summary of Key Findings & Pathways to County Health Deployment',
    presenter: 'Ordit Kagwira',
    regNo: 'CT202/114188/23',
    allocatedTime: '9:15 - 9:45 (30 sec)',
    taskTag: 'Task 8: Conclusions',
    bulletPoints: [
      'Core Milestone Achieved: Tuned Random Forest + tau=0.35 screening threshold delivers 90.7% recall and 0.873 ROC-AUC.',
      'Limitations: Small sample size (N=768); absence of longitudinal HbA1c; lack of male cohort data in the benchmark dataset.',
      'Next Steps: Partner with Meru Teaching & Referral Hospital (MeTRH) to acquire anonymized local clinical datasets.',
      'EHR Integration: Build HL7/FHIR microservices to embed risk scoring inside KenyaEMR and DHIS2.',
    ],
    keyVisual: 'future_roadmap_milestones',
    speakerNotes: 'In conclusion, our mini-project proves that machine learning can provide rapid, low-cost diabetes risk screening. With an optimized threshold of 0.35, our model identifies 9 out of 10 at-risk patients. Our next step is partnering with Meru Level 5 hospital to evaluate local demographic generalization.',
  },
  {
    id: 12,
    title: 'Team Contributions & Q&A Session',
    subtitle: 'Meru University of Science and Technology | Group 2 Defense',
    presenter: 'All Group 2 Members',
    regNo: 'Group 2 Cohort',
    allocatedTime: '9:45 - 10:00 (15 sec + Q&A)',
    taskTag: 'Deliverables & Defense',
    bulletPoints: [
      'Ordit Kagwira (CT202/114188/23): Coordination, Task 1 & 8, Report Integration.',
      'Beauttah Kipruttoh (CT202/113636/23): Data Cleaning, Imputation, Task 2 & 6.',
      'Atitwa Samuel Makokha (CT202/113631/23): Exploratory Analysis, Visualisations, Interpretability.',
      'Kiplangat Dancun (CT202/113622/23): Model Building, Baseline, Deployment Prototype (Task 3 & 7).',
      'Wamukota Kevin (CT202/106143/21): Hyperparameter Tuning, Evaluation, Threshold Research (Task 4 & 5).',
      'Submitted Artifacts: 12-page Report (PDF), Runnable Jupyter Notebook (.ipynb), Prototype App & Slide Deck.',
    ],
    keyVisual: 'team_contribution_table',
    speakerNotes: 'Here is our signed contribution statement. Every member took full ownership of their respective tasks and is ready to defend our methodology and results. We now welcome questions from Dr. Kirongo and the class. Thank you!',
  },
];
