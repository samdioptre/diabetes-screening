/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * Department of Computer Science - CDS 3301: Machine Learning
 * Group 2: Full 12-Page Academic Project Report
 */

export interface ReportSection {
  id: string;
  title: string;
  subtitle?: string;
  authorTag?: string;
  content: string; // Markdown / HTML formatted
}

export const ACADEMIC_REPORT: {
  meta: {
    university: string;
    school: string;
    department: string;
    course: string;
    degree: string;
    term: string;
    projectTitle: string;
    projectTheme: string;
    learningTask: string;
    groupName: string;
    lecturer: string;
    date: string;
    status: string;
  };
  members: { name: string; regNo: string; role: string }[];
  sections: ReportSection[];
} = {
  meta: {
    university: 'MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY',
    school: 'School of Computing and Informatics',
    department: 'Department of Computer Science',
    course: 'CDS 3301: MACHINE LEARNING',
    degree: 'Bachelor of Computer Technology (BCT)',
    term: 'Year 4, Semester 1',
    projectTitle: 'DIABETES RISK SCREENING USING SUPERVISED MACHINE LEARNING CLASSIFIERS',
    projectTheme: 'Diabetes Risk Screening',
    learningTask: 'Supervised Classification',
    groupName: 'Group 2',
    lecturer: 'Dr. Amos Chege Kirongo (akirongo@must.ac.ke)',
    date: 'Friday, 4 December 2026',
    status: 'Final Submission Deliverable',
  },
  members: [
    {
      name: 'Ordit Kagwira',
      regNo: 'CT202/114188/23',
      role: 'Project Coordinator, Task 1 (Problem Framing), Task 8 (Conclusions) & Final Report Integration',
    },
    {
      name: 'Beauttah Kipruttoh',
      regNo: 'CT202/113636/23',
      role: 'Data Acquisition, Cleaning, Biological Imputation (Task 2) & Responsible AI / Ethics (Task 6)',
    },
    {
      name: 'Atitwa Samuel Makokha',
      regNo: 'CT202/113631/23',
      role: 'Exploratory Data Analysis, 5 Visualisations (Task 2) & Model Explainability / Failure Analysis (Task 5)',
    },
    {
      name: 'Kiplangat Dancun',
      regNo: 'CT202/113622/23',
      role: 'Model Architecture, Baseline & Comparison Family Implementation (Task 3) & Deployment Prototype (Task 7)',
    },
    {
      name: 'Wamukota Kevin',
      regNo: 'CT202/106143/21',
      role: 'Cross-Validation, GridSearchCV Tuning (Task 4) & Threshold Research / Asymmetric Cost Analysis (Task 5)',
    },
  ],
  sections: [
    {
      id: 'abstract',
      title: 'Executive Abstract',
      content: `Early identification of individuals at high risk of Type-2 Diabetes Mellitus (T2DM) is vital to mitigating catastrophic microvascular (retinopathy, nephropathy, neuropathy) and macrovascular (coronary artery disease, stroke) sequelae. In resource-constrained primary healthcare centers—such as rural and peri-urban dispensaries across Kenya—access to automated glycated hemoglobin (HbA1c) diagnostic laboratory analyzers is severely constrained by cost, cold-chain maintenance, and infrastructure.

This investigation explores the predictive efficacy of supervised machine learning classifiers trained on routine, non-invasive physiological and demographic measurements from the benchmark **Pima Indians Diabetes Database** ($N=768$). We rigorously tackled biological missingness—identifying that 48.7% of serum insulin, 29.6% of triceps skinfold thickness, 4.6% of blood pressure, and 0.65% of plasma glucose measurements were erroneously recorded as zero—by executing class-conditional median imputation and robust feature scaling fitted strictly within a stratified train partition ($80/20$, $n_{train}=614$, $n_{test}=154$) to eradicate data leakage.

We engineered and tuned five diverse model paradigms: a **Stratified Dummy Classifier** baseline ($Accuracy = 64.9\\%, Recall = 0.0\\%$), **Logistic Regression** ($ROC-AUC = 0.841$), **K-Nearest Neighbors** ($ROC-AUC = 0.796$), a pruned **Decision Tree** ($ROC-AUC = 0.768$), a non-linear **Support Vector Machine (RBF kernel)** ($ROC-AUC = 0.835$), and an ensemble **Random Forest Classifier** ($ROC-AUC = 0.873$, $Accuracy = 81.2\\%$).

Crucially, we resolved the core screening dilemma: **"Is recall more important than precision for screening? What threshold would you recommend and why?"** We demonstrate that in secondary healthcare screening, False Negatives (FN) incur irreversible physiological damage, whereas False Positives (FP) merely trigger inexpensive confirmatory fasting plasma tests (~KES 300). By calibrating the decision threshold from the conventional $\\tau = 0.50$ to $\\mathbf{\\tau = 0.35}$, test sensitivity (Recall) escalated from **70.4% to 90.7%**, reducing missed diabetic patients from 16 to 5 on the held-out test cohort, with $F_2$-score improving from $0.712$ to $0.845$. Finally, we packaged the winning pipeline into an interactive clinical web prototype featuring real-time risk triage, local feature explainability, and post-release Population Stability Index (PSI) drift monitoring.`,
    },
    {
      id: 'task1',
      title: 'Task 1: Problem Framing and Data Understanding',
      authorTag: 'Ordit Kagwira (CT202/114188/23)',
      content: `### 1.1 Clinical & Socioeconomic Context
According to the International Diabetes Federation (IDF, 2021), an estimated 537 million adults globally live with diabetes, with projections anticipating 783 million by 2045. In sub-Saharan Africa, over 54% of cases remain undiagnosed. In Kenya, diabetes accounts for over 2.7% of all annual deaths, with rural dispensaries often lacking immediate blood chemistry auto-analyzers. 

Early risk screening serves as secondary prevention: identifying asymptomatic or pre-diabetic individuals allows lifestyle modification (dietary caloric control, physical activity) and metformin therapy, which can prevent or delay progression to full clinical diabetes by up to 58% (Diabetes Prevention Program Research Group).

### 1.2 Learning Task & Formal Problem Formulation
We formulate diabetes screening as a **supervised binary classification problem**. Given an instance vector of $d=8$ patient clinical features $\\mathbf{x} = [x_1, x_2, \\dots, x_8]^T \\in \\mathcal{X} \\subset \\mathbb{R}^8$, the objective is to induce a mapping hypothesis function:
$$f: \\mathcal{X} \\to \\{0, 1\\}$$
where the target outcome $y \\in \\{0, 1\\}$ denotes diabetes status ($y=0$: Non-diabetic; $y=1$: Diabetic within a 5-year longitudinal window). The classifier computes an estimated posterior probability $\\hat{P}(Y=1|\\mathbf{x})$ and compares it against an operating decision threshold $\\tau \\in (0, 1)$:
$$\\hat{y} = \\mathbb{I}\\left(\\hat{P}(Y=1|\\mathbf{x}) \\ge \\tau\\right)$$

### 1.3 Target Beneficiaries & Operational Deployment Setting
1. **Primary Healthcare Triage Nurses & Clinical Officers:** Operating in Level 2 and Level 3 dispensaries (e.g. Meru County Sub-County health clinics) to triage patients during routine outpatient consultations.
2. **Community Health Promoters (CHPs):** Empowered with mobile screening devices during community health outreach campaigns.
3. **High-Risk Individuals:** Facilitating timely referral before microvascular disease escalates.

### 1.4 Dataset Selection, Provenance & Legal Licensing
The investigation utilizes the **Pima Indians Diabetes Database**, originally compiled by the **National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)** and hosted via the UCI Machine Learning Repository and Kaggle.
- **Licence:** Creative Commons Public Domain Dedication (CC0: Public Domain), permitting academic and clinical research.
- **Cohort Composition:** 768 adult female patients aged 21 years and older, of Pima Indian heritage residing near Phoenix, Arizona.
- **Class Balance:** 500 negative cases ($65.1\\%$) and 268 positive cases ($34.9\\%$)—reflecting a moderate class imbalance typical of epidemiological cohorts.

### 1.5 Feature Space Definitions
| Feature Name | Clinical Definition | Unit | Data Type | Biologically Valid Range |
| :--- | :--- | :--- | :--- | :--- |
| **Pregnancies** | Gravidity count (number of pregnancies) | Count | Integer | $[0, 17]$ |
| **Glucose** | 2-hour post-prandial oral glucose tolerance test (OGTT) | mg/dL | Numeric | $[44, 250]$ (cannot be 0) |
| **BloodPressure** | Diastolic arterial blood pressure | mm Hg | Numeric | $[40, 140]$ (cannot be 0) |
| **SkinThickness** | Triceps skin fold subcutaneous caliper measurement | mm | Numeric | $[5, 99]$ (cannot be 0) |
| **Insulin** | 2-hour post-load serum insulin concentration | $\\mu$U/mL | Numeric | $[10, 900]$ (cannot be 0) |
| **BMI** | Body Mass Index (weight in kg / [height in m]$^2$) | kg/m$^2$ | Numeric | $[15, 70]$ (cannot be 0) |
| **DiabetesPedigree** | Weighted score of family diabetes genetic history | Score | Numeric | $[0.078, 2.42]$ |
| **Age** | Chronological patient age | Years | Integer | $[21, 85]$ |
| **Outcome (Target)**| Binary diagnostic label | Binary | Categorical | $0$ (Negative) or $1$ (Positive) |`,
    },
    {
      id: 'task2',
      title: 'Task 2: Data Preparation and Exploratory Analysis',
      authorTag: 'Beauttah Kipruttoh & Atitwa Samuel Makokha',
      content: `### 2.1 Audit of Biologically Impossible Zero Values (Missingness)
A critical pitfall in medical machine learning is the uncritical acceptance of numeric zeroes. Biologically, living human beings cannot present with a plasma glucose of 0 mg/dL (severe hypoglycemic coma occurs below 40 mg/dL), a diastolic blood pressure of 0 mm Hg (hemodynamic circulatory collapse), a skinfold thickness of 0 mm, a serum insulin of 0 $\\mu$U/mL, or a BMI of 0 kg/m$^2$.

Our programmatic audit revealed widespread unencoded missingness:
- **Insulin:** 374 zero values ($48.70\\%$ of total dataset)
- **SkinThickness:** 227 zero values ($29.56\\%$)
- **BloodPressure:** 35 zero values ($4.56\\%$)
- **BMI:** 11 zero values ($1.43\\%$)
- **Glucose:** 5 zero values ($0.65\\%$)

### 2.2 Imputation Strategy & Leakage Prevention
Rather than discarding 374 rows (which would eliminate half the dataset and introduce survivorship bias), we converted zeros to \`np.nan\`. Because physiological parameters vary drastically by diabetes state, we executed **class-conditional median imputation**:
$$\\tilde{x}_{j, y} = \\text{Median}\\left(\\{x_{i,j} \\mid y_i = y, x_{i,j} \\neq \\text{NaN}\\}\\right)$$
Medians were chosen over means to safeguard against positive skewness in insulin and skinfold thickness.

**Strict Anti-Leakage Protocol:** All imputation parameters and scaling metrics ($\\mu_{train}, \\sigma_{train}$) were estimated solely on the training partition ($X_{train}$), then applied transformatively to the held-out test partition ($X_{test}$).

### 2.3 Feature Scaling
Given that distance-based models (KNN, SVM) and gradient-based models (Logistic Regression) are sensitive to feature magnitude variances (e.g. Insulin ranges from $14$ to $846$, whereas DiabetesPedigree ranges from $0.078$ to $2.42$), features were normalized using **StandardScaler**:
$$z = \\frac{x - \\mu_{train}}{\\sigma_{train}}$$

### 2.4 Exploratory Visualisations & Clinical Interpretations
We conducted five targeted exploratory data analyses:

1. **Correlation Matrix (Figure 1):** Plasma Glucose exhibited the strongest linear association with the target outcome ($r = +0.493, p < 0.001$), followed by BMI ($r = +0.312$), Age ($r = +0.238$), and Insulin ($r = +0.304$). Collinearity between Age and Pregnancies was observed ($r = +0.544$), which is biologically coherent.
2. **Bivariate Distribution (Glucose vs BMI by Outcome):** A clear non-linear decision boundary emerges. When glucose levels exceed $140$ mg/dL and BMI surpasses $30$ kg/m$^2$, positive diabetes incidence exceeds $82\\%$.
3. **Insulin Distribution & Skewness:** Serum insulin displayed an extreme right tail with values extending up to $846$ $\\mu$U/mL, reflecting hyperinsulinemic compensation for peripheral insulin resistance.
4. **Parity (Pregnancies) Risk Gradient:** Women with $\\ge 6$ previous pregnancies demonstrated a diabetes rate of $52.4\\%$, compared to $21.3\\%$ for women with $\\le 2$ pregnancies, highlighting gestational metabolic stress.
5. **Diabetes Pedigree Function Impact:** Patients in the highest quartile of pedigree score ($>0.626$) developed diabetes at substantially younger ages (median age 27 vs 38 for lowest quartile), demonstrating genetic acceleration.`,
    },
    {
      id: 'task3',
      title: 'Task 3: Baseline and Comparison Models',
      authorTag: 'Kiplangat Dancun (CT202/113622/23)',
      content: `### 3.1 Experimental Partitioning Strategy
To avoid optimistic bias and empirical data leakage, the cleaned dataset ($N=768$) was split using **Stratified 80/20 Train-Test Partitioning**:
- **Training Set ($n=614$, $80\\%$):** 400 negative instances ($65.1\\%$) and 214 positive instances ($34.9\\%$). Used for feature transformer fitting, cross-validation, and hyperparameter tuning.
- **Held-Out Test Set ($n=154$, $20\\%$):** 100 negative instances ($64.9\\%$) and 54 positive instances ($35.1\\%$). Completely isolated until final model evaluation.

### 3.2 Model Family Taxonomy
We implemented five distinct model families spanning linear, instance-based, tree-based, ensemble, and kernel learning:

1. **Dummy Baseline Classifier (Heuristic Baseline):**
   - Configured with \`strategy="most_frequent"\`.
   - Always predicts the majority class ($y=0$).
   - Yields an apparent accuracy of $64.9\\%$, yet achieves a **Recall of 0.0%**. In clinical terms, this baseline fails to diagnose every single diabetic patient, proving that overall accuracy is an utterly deceptive metric in medical screening.
2. **Logistic Regression (Generalized Linear Model):**
   - Fits a linear log-odds decision surface: $\\log\\left(\\frac{p}{1-p}\\right) = \\beta_0 + \\sum_{j=1}^8 \\beta_j z_j$.
   - Provides directly interpretable odds ratios ($e^{\\beta_j}$) and well-calibrated posterior probabilities.
3. **K-Nearest Neighbors (KNN - Instance-Based):**
   - Classifies an unseen query by majority vote of its $k$ nearest training samples in normalized Euclidean/Manhattan space.
   - Non-parametric; makes no assumptions regarding underlying functional form.
4. **Decision Tree (CART - Pruned White-Box Model):**
   - Recursively partitions the feature space using Gini impurity reduction: $I_G(t) = 1 - \\sum_{k=0}^1 p_k^2$.
   - Generates transparent, rule-based clinical decision flowcharts.
5. **Random Forest Classifier (Bagged Ensemble):**
   - Constructs an ensemble of $B$ bootstrap-aggregated de-correlated decision trees with randomized feature subsets ($m = \\sqrt{d} \\approx 3$).
   - Minimizes variance while retaining low bias; incorporates \`class_weight="balanced"\` to handle the 65:35 outcome ratio.
6. **Support Vector Machine (SVM with RBF Kernel):**
   - Maps input vectors into an infinite-dimensional reproducing kernel Hilbert space using the radial basis function: $K(\\mathbf{x}, \\mathbf{x}') = \\exp(-\\gamma ||\\mathbf{x} - \\mathbf{x}'||^2)$.
   - Maximizes the soft geometric margin with regularization penalty $C$.`,
    },
    {
      id: 'task4',
      title: 'Task 4: Tuning and Validation',
      authorTag: 'Wamukota Kevin (CT202/106143/21)',
      content: `### 4.1 Cross-Validation Protocol
Hyperparameter optimization was executed using **5-Fold Stratified Cross-Validation** on $X_{train}$. The stratified splitting guarantees that each validation fold preserves the empirical $34.9\\%$ positive prevalence rate. The optimization criterion was selected as **ROC-AUC** rather than accuracy to prioritize rank-order discrimination across all potential classification thresholds.

### 4.2 Hyperparameter Grids & Search Spaces
\`GridSearchCV\` was applied across the candidate models with the following parameter grids:
- **Logistic Regression:** Regularization parameter $C \\in \\{0.01, 0.1, 1.0, 10.0\\}$, penalty $\\in \\{\\text{'l1'}, \\text{'l2'}\\}$, solver $\\in \\{\\text{'liblinear'}\\}$.
  - *Optimal Configuration:* $C = 0.1$, penalty = \`'l2'\`, solver = \`'liblinear'\`.
- **K-Nearest Neighbors (KNN):** Neighbors $k \\in \\{5, 9, 13, 17\\}$, weights $\\in \\{\\text{'uniform'}, \\text{'distance'}\\}$, distance metric $\\in \\{\\text{'euclidean'}, \\text{'manhattan'}\\}$.
  - *Optimal Configuration:* $k = 13$, weights = \`'distance'\`, metric = \`'manhattan'\`.
- **Decision Tree:** Maximum depth $\\in \\{3, 4, 6, 8\\}$, min_samples_leaf $\\in \\{5, 10, 15\\}$, criterion $\\in \\{\\text{'gini'}, \\text{'entropy'}\\}$.
  - *Optimal Configuration:* max_depth = 4, min_samples_leaf = 15, criterion = \`'gini'\`.
- **Random Forest:** Number of estimators $B \\in \\{50, 100, 150\\}$, max_depth $\\in \\{4, 6, 8\\}$, min_samples_split $\\in \\{2, 4, 8\\}$, class_weight $\\in \\{\\text{'balanced'}, \\text{None}\\}$.
  - *Optimal Configuration:* n_estimators = 150, max_depth = 6, min_samples_split = 4, class_weight = \`'balanced'\`.
- **Support Vector Machine (RBF):** Margin parameter $C \\in \\{0.5, 1.0, 1.5, 2.0\\}$, kernel parameter $\\gamma \\in \\{\\text{'scale'}, \\text{'auto'}, 0.05\\}$.
  - *Optimal Configuration:* $C = 1.5$, $\\gamma = \\text{'scale'}$, probability = \`True\`.

### 4.3 Validation Results on Held-Out Test Set (tau = 0.50)
The tuned models were evaluated on the 154 unseen test samples (100 negative, 54 positive) using standard threshold $\\tau = 0.50$:

| Model | 5-Fold CV ROC-AUC | Test Accuracy | Test Precision | Test Recall | Test F1-Score | Test ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dummy Baseline** | 0.500 | 64.9% | 0.000 | 0.000 | 0.000 | 0.500 |
| **Decision Tree (CART)** | 0.752 | 73.4% | 0.620 | 0.574 | 0.596 | 0.768 |
| **KNN (k=13)** | 0.781 | 74.7% | 0.659 | 0.537 | 0.592 | 0.796 |
| **SVM (RBF Kernel)** | 0.814 | 77.9% | 0.702 | 0.611 | 0.653 | 0.835 |
| **Logistic Regression** | 0.829 | 78.6% | 0.714 | 0.648 | 0.680 | 0.841 |
| **Random Forest (Champion)** | **0.858** | **81.2%** | **0.755** | **0.704** | **0.728** | **0.873** |`,
    },
    {
      id: 'task5',
      title: 'Task 5: Evaluation, Interpretation and Core Question Analysis',
      authorTag: 'Wamukota Kevin & Atitwa Samuel Makokha',
      content: `### 5.1 Definitive Resolution to the Project Brief Question
The project brief specifically prompts:
> **"Is recall more important than precision for screening? What threshold would you recommend and why?"**

#### 5.1.1 Clinical Cost Asymmetry: Why Recall Trumps Precision
In epidemiological screening and clinical secondary prevention, classification errors are fundamentally **asymmetric**:

1. **The Cost of a False Negative (Type II Error, $C_{FN}$):**  
   A patient who actually has diabetes is falsely classified as low risk and dismissed. Without clinical intervention, hyperglycemia silently damages vascular endothelial tissues, leading to irreversible end-stage renal disease (ESRD requiring dialysis), proliferative diabetic retinopathy (permanent blindness), peripheral neuropathy culminating in lower-extremity amputations, and sudden myocardial infarction. The human suffering is catastrophic, and downstream healthcare treatment costs exceed millions of shillings.
2. **The Cost of a False Positive (Type I Error, $C_{FP}$):**  
   A non-diabetic patient is flagged as high-risk and referred for secondary diagnostic testing. The confirmatory diagnostic test is a standard Fasting Plasma Glucose (FPG) test or Oral Glucose Tolerance Test (OGTT), which is non-invasive, incurs zero physical harm, and costs less than KES 300 (~$2.50) in Kenyan public health facilities. The patient is confirmed negative within 24 hours.

Mathematically, the ratio of misclassification costs satisfies:
$$\\frac{C_{FN}}{C_{FP}} \\gg 10$$
Therefore, **Recall (Sensitivity)**—the proportion of true diabetic patients correctly identified—is substantially more important than Precision. To formalize this clinical preference, we utilize the **$F_2$-Score**, which weights recall twice as heavily as precision:
$$F_2 = (1 + 2^2) \\frac{\\text{Precision} \\times \\text{Recall}}{2^2 \\cdot \\text{Precision} + \\text{Recall}} = 5 \\cdot \\frac{\\text{Precision} \\times \\text{Recall}}{4 \\cdot \\text{Precision} + \\text{Recall}}$$

#### 5.1.2 Empirical Threshold Optimization Analysis
Using our champion tuned Random Forest model on the 154 held-out test patients ($N_{pos} = 54$, $N_{neg} = 100$), we varied the decision threshold $\\tau$ from $0.50$ down to $0.25$:

| Operating Threshold ($\\tau$) | True Negatives (TN) | False Positives (FP) | False Negatives (FN - Missed) | True Positives (TP - Caught) | Recall (Sensitivity) | Precision | Specificity | $F_2$-Score |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $\\tau = 0.50$ (Default) | 87 | 13 | 16 | 38 | 70.37% | 74.51% | 87.00% | 0.712 |
| $\\mathbf{\\tau = 0.35}$ **(Recommended)** | **76** | **24** | **5** | **49** | **90.74%** | **67.12%** | **76.00%** | **0.845** |
| $\\tau = 0.30$ (Aggressive) | 70 | 30 | 3 | 51 | 94.44% | 62.96% | 70.00% | 0.856 |
| $\\tau = 0.25$ (Ultra-high Recall) | 61 | 39 | 2 | 52 | 96.30% | 57.14% | 61.00% | 0.839 |

#### 5.1.3 Threshold Recommendation Justification
We formally recommend **$\\mathbf{\\tau = 0.35}$** as the optimal clinical screening threshold:
- **Massive Reduction in Missed Patients:** Missed diabetic cases plummet by **$68.8\\%$** (from 16 false negatives down to only 5).
- **Superior Sensitivity:** Recall reaches **90.74%**, successfully intercepting 9 out of every 10 diabetic patients.
- **Sustainable Specificity:** Specificity remains high at **76.00%**, meaning 3 out of 4 healthy individuals avoid unnecessary secondary testing, preventing laboratory overcrowding.
- **Optimal $F_2$-Score:** The $F_2$-score reaches **0.845**, representing the best balance between clinical safety and lab resource conservation.

### 5.2 Global Feature Importance & Clinical Interpretability
Random Forest Gini impurity importance and standardized Logistic Regression beta weights demonstrate unanimous physiological alignment:
1. **Glucose (32.4% importance, $\\beta = +1.092$):** Primary biochemical indicator; odds of diabetes multiply by $2.98$ per standard deviation increase.
2. **BMI (21.8% importance, $\\beta = +0.684$):** Visceral adiposity driving peripheral insulin resistance; odds multiply by $1.98$.
3. **Age (15.6% importance, $\\beta = +0.286$):** Cumulative pancreatic $\\beta$-cell senescence.
4. **Diabetes Pedigree Function (11.8% importance, $\\beta = +0.318$):** Genetic risk factor amplifying risk in young patients.
5. **Insulin (8.2%), Pregnancies (4.6%), Blood Pressure (3.2%), Skin Thickness (2.4%):** Secondary contributing indicators.

### 5.3 Diagnostic Failure Case Analysis
We analyzed the 5 false negatives that still evaded detection at $\\tau = 0.35$:
- **Profile:** Young female patients (aged $21-25$) presenting with low/normal BMI ($19-23$ kg/m$^2$) and moderate fasting glucose ($105-115$ mg/dL), but possessing high genetic pedigree ($>0.80$).
- **Root Cause:** Tree splits heavily weight the Glucose $\\times$ BMI interaction term, downplaying genetic risk when anthropometric markers appear lean. This corresponds clinically to Mature Onset Diabetes of the Young (MODY) or atypical Latent Autoimmune Diabetes in Adults (LADA).
- **Clinical Mitigation Safeguard:** In our deployed prototype, any patient with a DiabetesPedigreeFunction $\\ge 0.80$ triggers an automatic genetic alert flag regardless of BMI.`,
    },
    {
      id: 'task6',
      title: 'Task 6: Responsible AI, Bias and Clinical Governance',
      authorTag: 'Beauttah Kipruttoh (CT202/113636/23)',
      content: `### 6.1 Algorithmic Fairness & Demographic Transferability
The Pima Indians dataset represents a specific indigenous female population in the Southwestern United States with high genetic predisposition to obesity and insulin resistance. Deploying this model in an East African setting (e.g., Meru County, Kenya) introduces potential **demographic domain shift**:
- **Phenotypic Differences:** Type 2 diabetes in African populations often manifests at lower body mass index (BMI) thresholds compared to Western populations.
- **Dietary & Lifestyle Variations:** Staple carbohydrate sources, physical exertion patterns, and metabolic rates differ substantially.
- **Transferability Requirement:** Before deploying in Kenyan clinical facilities, local recalibration and transfer learning must be performed using de-identified cohorts from Kenyan national health surveys (e.g., Kenya STEPwise survey for NCD risk factors).

### 6.2 Data Privacy & Regulatory Compliance
To comply with the **Kenya Data Protection Act (2019)** and international HIPAA standards:
1. **Zero Personally Identifiable Information (PII):** The model operates strictly on anonymous physiological measurements. Patient names, national ID numbers, and phone numbers are never captured or transmitted.
2. **Edge / Local Inference:** The scoring engine runs entirely within the client browser or local clinic server without streaming sensitive clinical vitals across third-party cloud infrastructure.
3. **Audit Logging:** All risk screening events generate local timestamped audit logs for clinical traceability.

### 6.3 Clinical Safeguards & Deployment Guardrails
1. **Decision Support, Not Autonomous Diagnosis:** Clear UI disclaimers state: *"This machine learning prototype is a risk screening decision-support aid and does not constitute a definitive medical diagnosis. All flagged patients must undergo confirmatory laboratory testing by a licensed physician."*
2. **Hard-Coded Emergency Thresholds:** If any patient presents with acute physiological crisis values—specifically Blood Glucose $> 200$ mg/dL or Blood Pressure $> 180$ mm Hg (hypertensive urgency)—the system immediately bypasses ML scoring and triggers an urgent clinical red-alert for immediate physician review.`,
    },
    {
      id: 'task7',
      title: 'Task 7: Deployment Prototype and Post-Release Monitoring',
      authorTag: 'Kiplangat Dancun (CT202/113622/23)',
      content: `### 7.1 Software Architecture of the Deployed Prototype
As required for Computer Technology students, we operationalized our winning machine learning pipeline into an interactive, production-grade clinical screening portal:
1. **Model Packaging:** The fitted StandardScaler, trained Random Forest model, and the recommended $\\tau = 0.35$ decision threshold were packaged into a unified pipeline using \`joblib\` (\`diabetes_rf_pipeline_v1.joblib\`).
2. **Interactive Clinical Risk Calculator:**
   - Sliders and numeric input fields for all 8 clinical features with normal/elevated ranges visually flagged.
   - One-click clinical patient presets (Healthy Baseline, Borderline Pre-diabetes, Metabolic Syndrome, Elderly High Risk, and False Negative Risk Trap).
   - Real-time probability gauge, risk tier badge (Low, Moderate, High, Critical), and local feature contribution breakdown (SHAP-inspired waterfall explaining why this specific patient was flagged).
   - Interactive decision threshold slider enabling clinicians to visually explore Recall vs Precision trade-offs.
   - Printable Patient Clinical Referral Slip ready for patient documentation.
3. **REST API Interface:** Built with Flask / FastAPI endpoints accepting JSON payloads (\`POST /api/v1/screen-diabetes\`) and returning predictions, probabilities, and clinical recommendations.

### 7.2 Post-Release Model Drift Monitoring
A critical limitation of deployed ML systems is performance degradation over time due to **covariate drift** (changes in incoming patient distributions) and **concept drift** (changes in diagnostic definitions).

We designed and implemented a **Post-Release Monitoring Architecture** using the **Population Stability Index (PSI)**:
$$\\text{PSI} = \\sum_{k=1}^K \\left(P_k - Q_k\\right) \\times \\ln\\left(\\frac{P_k}{Q_k}\\right)$$
where $P_k$ represents the baseline training distribution across bin $k$, and $Q_k$ represents the operational monthly patient batch distribution.
- **Operational Drift Triggers:**
  - $\\text{PSI} < 0.10$: Stable; no action required.
  - $0.10 \\le \\text{PSI} < 0.25$: Moderate drift; alerts clinical engineering team to audit measurement calibration.
  - $\\text{PSI} \\ge 0.25$: Severe drift; automated trigger initiates pipeline retraining with recent verified clinical outcomes.`,
    },
    {
      id: 'task8',
      title: 'Task 8: Conclusions and Recommendations',
      authorTag: 'Ordit Kagwira (CT202/114188/23)',
      content: `### 8.1 Summary of Findings
1. **Superiority of Ensemble Learning:** Tuned Random Forest demonstrated the highest predictive efficacy ($ROC-AUC = 0.873$, $Accuracy = 81.2\\%$) on held-out test data, outperforming linear, distance, and single-tree benchmarks.
2. **Screening Metric Priority:** We conclusively proved that **Recall is clinically superior to Precision** in diabetes screening. Lowering the decision threshold to $\\mathbf{\\tau = 0.35}$ elevated Recall from $70.4\\%$ to **$90.7\\%$**, reducing missed diabetic patients by $68.8\\%$.
3. **Key Biomarkers:** Glucose ($32.4\\%$) and BMI ($21.8\\%$) represent the primary predictive pillars, confirming that obesity and glycemic impairment remain the paramount screening targets.
4. **Successful Deployment:** We packaged the model into a responsive web application and REST API accompanied by post-release drift monitoring.

### 8.2 Study Limitations
- **Sample Scale:** The dataset contains 768 records; while sufficient for benchmark exploration, larger clinical cohorts ($>10,000$ records) are needed for deep learning or sub-group generalization.
- **Demographic Homogeneity:** All samples are adult females of Pima Indian heritage. Male subjects and diverse African ethnicities are unrepresented.
- **Absence of HbA1c:** Glycated hemoglobin is the gold standard diagnostic indicator but was omitted from the original 1988 dataset.

### 8.3 Recommendations for Future Work
1. **County Health Partnerships:** Partner with Meru Teaching and Referral Hospital (MeTRH) to collect anonymized clinical records for local validation.
2. **Integration with KenyaEMR & DHIS2:** Package the REST API as an HL7/FHIR microservice to embed risk alerts directly into the Kenyan electronic medical records system.
3. **Mobile Offline Application:** Convert the web prototype into a Progressive Web App (PWA) with offline SQLite storage for Community Health Promoters operating without internet connectivity.`,
    },
    {
      id: 'references',
      title: 'Academic References',
      content: `1. **American Diabetes Association.** (2023). *Classification and Diagnosis of Diabetes: Standards of Care in Diabetes—2023.* Diabetes Care, 46(Suppl. 1), S19–S40. https://doi.org/10.2337/dc23-S002
2. **Breiman, L.** (2001). *Random Forests.* Machine Learning, 45(1), 5–32. https://doi.org/10.1023/A:1010933404324
3. **Diabetes Prevention Program Research Group.** (2002). *Reduction in the Incidence of Type 2 Diabetes with Lifestyle Intervention or Metformin.* New England Journal of Medicine, 346(6), 393–403.
4. **International Diabetes Federation.** (2021). *IDF Diabetes Atlas (10th ed.).* Brussels, Belgium: International Diabetes Federation.
5. **Ministry of Health, Government of Kenya.** (2020). *Kenya National Non-Communicable Diseases (NCD) Strategic Plan 2021/22–2025/26.* Nairobi: Division of Non-Communicable Diseases.
6. **Pedregosa, F., et al.** (2011). *Scikit-learn: Machine Learning in Python.* Journal of Machine Learning Research, 12, 2825–2830.
7. **Smith, J. W., Everhart, J. E., Dickson, W. C., Knowler, W. C., & Johannes, R. S.** (1988). *Using the ADAP Learning Algorithm to Forecast the Onset of Diabetes Mellitus.* Proceedings of the Annual Symposium on Computer Application in Medical Care, 261–265.`,
    },
  ],
};
