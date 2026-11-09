#!/usr/bin/env python3
"""
Generate publication-quality 18-slide PowerPoint presentation (.pptx)
Widescreen 16:9 layout with embedded matplotlib figures, speaker notes, and member assignments.
Required filename: GROUP_02_Diabetes_Risk_Screening_Slides.pptx
"""

import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def generate_slides():
    print("Building 18-Slide PowerPoint Presentation with embedded figures...")
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def create_slide(title, subtitle, presenter, notes, image_path=None, bullets=None):
        slide = prs.slides.add_slide(blank_layout)
        
        # Header banner
        header = slide.shapes.add_shape(pptx.enum.shapes.MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(1.15))
        header.fill.solid()
        header.fill.fore_color.rgb = RGBColor(14, 116, 144)
        header.line.color.rgb = RGBColor(14, 116, 144)

        tf = header.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.8)
        tf.margin_top = Inches(0.15)
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255)
        
        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.size = Pt(11)
            p2.font.color.rgb = RGBColor(207, 250, 254)

        # Presenter badge
        if presenter:
            badge = slide.shapes.add_textbox(Inches(8.5), Inches(0.25), Inches(4.3), Inches(0.6))
            p_b = badge.text_frame.paragraphs[0]
            p_b.text = f"Presenter: {presenter}"
            p_b.alignment = PP_ALIGN.RIGHT
            p_b.font.size = Pt(11)
            p_b.font.bold = True
            p_b.font.color.rgb = RGBColor(254, 240, 138)

        # Content layout: with image or text-only
        if image_path and os.path.exists(image_path) and bullets:
            # Left bullets, right image
            tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(5.8), Inches(5.3))
            tf_b = tb.text_frame
            tf_b.word_wrap = True
            for i, b in enumerate(bullets):
                p_c = tf_b.add_paragraph() if i > 0 else tf_b.paragraphs[0]
                p_c.text = b
                p_c.font.size = Pt(13.5)
                p_c.font.color.rgb = RGBColor(30, 41, 59)
                p_c.space_after = Pt(10)
            
            # Right image
            slide.shapes.add_picture(image_path, Inches(6.8), Inches(1.5), width=Inches(5.7))

        elif image_path and os.path.exists(image_path):
            slide.shapes.add_picture(image_path, Inches(2.2), Inches(1.4), width=Inches(8.9))

        elif bullets:
            tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(5.2))
            tf_b = tb.text_frame
            tf_b.word_wrap = True
            for i, b in enumerate(bullets):
                p_c = tf_b.add_paragraph() if i > 0 else tf_b.paragraphs[0]
                p_c.text = b
                p_c.font.size = Pt(14.5)
                p_c.font.color.rgb = RGBColor(30, 41, 59)
                p_c.space_after = Pt(14)

        # Footer
        footer = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.7), Inches(0.35))
        p_f = footer.text_frame.paragraphs[0]
        p_f.text = "Meru University of Science and Technology | CDS 3301: Machine Learning | Group 2"
        p_f.font.size = Pt(9)
        p_f.font.color.rgb = RGBColor(148, 163, 184)

        if notes:
            slide.notes_slide.notes_text_frame.text = notes

        return slide

    # Slide 1: Title Slide
    s1 = prs.slides.add_slide(blank_layout)
    bg = s1.shapes.add_shape(pptx.enum.shapes.MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = RGBColor(15, 23, 42)
    bg.line.color.rgb = RGBColor(15, 23, 42)

    tb = s1.shapes.add_textbox(Inches(1.0), Inches(1.0), Inches(11.3), Inches(3.0))
    tf = tb.text_frame
    p1 = tf.paragraphs[0]
    p1.text = "MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY"
    p1.font.size = Pt(14)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(14, 116, 144)
    
    p2 = tf.add_paragraph()
    p2.text = "School of Computing & Informatics | Department of Computer Science | CDS 3301"
    p2.font.size = Pt(11)
    p2.font.color.rgb = RGBColor(148, 163, 184)
    p2.space_after = Pt(20)

    p3 = tf.add_paragraph()
    p3.text = "DIABETES RISK SCREENING SYSTEM"
    p3.font.size = Pt(36)
    p3.font.bold = True
    p3.font.color.rgb = RGBColor(255, 255, 255)

    p4 = tf.add_paragraph()
    p4.text = "Comparative Classification, Threshold Calibration (Recall > Precision), and Deployment Prototype"
    p4.font.size = Pt(15)
    p4.font.color.rgb = RGBColor(56, 189, 248)

    tb_team = s1.shapes.add_textbox(Inches(1.0), Inches(4.5), Inches(11.3), Inches(2.2))
    tf_team = tb_team.text_frame
    p_h = tf_team.paragraphs[0]
    p_h.text = "GROUP 2 PROJECT DEFENSE (10-MINUTE PRESENTATION + 2-MINUTE DEMO):"
    p_h.font.size = Pt(11)
    p_h.font.bold = True
    p_h.font.color.rgb = RGBColor(254, 240, 138)

    members = [
        "1. Ordit Kagwira (CT202/114188/23) - Project Coordinator",
        "2. Beauttah Kipruttoh (CT202/113636/23) - Preprocessing & Responsible AI",
        "3. Atitwa Samuel Makokha (CT202/113631/23) - Exploratory Analysis & Feature Importance",
        "4. Kiplangat Dancun (CT202/113622/23) - Model Building & Web Prototype",
        "5. Wamukota Kevin (CT202/106143/21) - Hyperparameter Tuning & Evaluation",
        "Course Lecturer: Dr. Amos Chege Kirongo (akirongo@must.ac.ke)"
    ]
    for m in members:
        p = tf_team.add_paragraph()
        p.text = m
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(203, 213, 225)

    s1.notes_slide.notes_text_frame.text = (
        "Good morning Dr. Amos Chege Kirongo and fellow students. We are Group 2, presenting our machine learning "
        "diabetes risk screening project for CDS 3301. Our defense is divided into a 10-minute presentation covering all "
        "eight project tasks followed by a 2-minute live prototype demonstration."
    )

    # Slide 2: Group Members & Allocation
    create_slide(
        "2. Group Members & Task Allocation",
        "Verified individual contributions for university assessment",
        "Ordit Kagwira",
        "Each member was assigned specific phases of the pipeline according to the marking scheme.",
        bullets=[
            "• Ordit Kagwira (CT202/114188/23): Overall Project Coordination, Task 1 Problem Framing, Task 8 Conclusions & Report Integration.",
            "• Beauttah Kipruttoh (CT202/113636/23): Task 2 Data Acquisition, Biological Zero-Value Audit, Imputation Pipeline & Task 6 Responsible AI.",
            "• Atitwa Samuel Makokha (CT202/113631/23): Task 2 Exploratory Visualisations, Statistical Bivariate Analysis & Task 5 Feature Importance.",
            "• Kiplangat Dancun (CT202/113622/23): Task 3 Baseline & Model Training, Task 7 Full-Stack FastAPI & React Prototype.",
            "• Wamukota Kevin (CT202/106143/21): Task 4 5-Fold Stratified GridSearchCV Tuning, Task 5 Threshold Calibration (tau=0.35) & Evaluation."
        ]
    )

    # Slide 3: Background & Problem Statement
    create_slide(
        "3. Background & Problem Statement",
        "The Diabetes Crisis in Rural Kenyan Healthcare",
        "Ordit Kagwira (Min 0:00 - 1:15)",
        "Over 54% of diabetic patients in sub-Saharan Africa remain undiagnosed due to lack of diagnostic labs.",
        bullets=[
            "• Sub-Saharan Reality: 54% of adults with diabetes are undiagnosed (IDF Diabetes Atlas, 10th Ed.).",
            "• Rural Constraints: Primary health facilities across Meru, Embu, and Machakos lack automated clinical chemistry and HbA1c assays.",
            "• Complications: Patients often present only after developing irreversible microvascular damage (nephropathy, retinopathy, foot amputations).",
            "• Clinical Need: An empirical, low-cost screening tool utilizing routine physical indicators to triage patients needing laboratory confirmation."
        ]
    )

    # Slide 4: Project Objectives
    create_slide(
        "4. Project Objectives",
        "Translating Machine Learning into Clinical Decision Support",
        "Ordit Kagwira (Min 1:15 - 2:00)",
        "Our core goal is to build a reliable classifier that maximizes recall while preserving acceptable precision.",
        bullets=[
            "• Primary Objective: Develop and benchmark machine learning classifiers that predict diabetes status from routine clinical measurements.",
            "• Data Quality Objective: Identify and address biologically impossible zero-values without introducing data leakage.",
            "• Clinical Optimization Objective: Answer the lecturer's core research question: 'Is recall more important than precision for screening? What threshold would you recommend and why?'",
            "• Deployment Objective: Operationalize the optimal model into a production FastAPI backend and interactive clinical web application."
        ]
    )

    # Slide 5: Dataset Description & Provenance
    create_slide(
        "5. Dataset Description & Provenance",
        "Pima Indians Diabetes Database (NIDDK / UCI Repository)",
        "Beauttah Kipruttoh (Min 2:00 - 3:00)",
        "The Pima dataset contains 768 records with 8 features and a binary outcome.",
        bullets=[
            "• Source & Licence: NIDDK, UCI Machine Learning Repository (Smith et al., 1988); CC0 Public Domain Licence.",
            "• Cohort Size: N = 768 female patients aged 21 years and older.",
            "• 8 Clinical Features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age.",
            "• Target: Binary Outcome (500 Non-diabetic [65.1%] vs 268 Diabetic [34.9%]).",
            "• Limitations: Exclusively female subjects of indigenous Pima heritage; requires local calibration when deploying in Kenya."
        ]
    )

    # Slide 6: Data Preparation & Leakage Prevention
    create_slide(
        "6. Data Preparation & Leakage Prevention",
        "Handling Biological Zeros via Stratified Pipeline Architecture",
        "Beauttah Kipruttoh (Min 3:00 - 4:00)",
        "Values of 0 in insulin or glucose are missing data, not living human measurements.",
        image_path="reports/figures/fig6_missing_values_audit.png",
        bullets=[
            "• The Biological Zero Problem: 0 mg/dL blood glucose or 0 mm skin thickness is impossible in living humans.",
            "• Audit Results: Insulin missing 48.70% (374), SkinThickness missing 29.56% (227), BloodPressure missing 4.56% (35).",
            "• Leak-Free Preprocessing: Imputation medians and scaling parameters fitted strictly on 80% training split (n=614).",
            "• Zero Test Leakage: The 20% held-out test split (n=154) was isolated until final model evaluation."
        ]
    )

    # Slide 7: Exploratory Visualisations
    create_slide(
        "7. Exploratory Analysis: Distributions & Correlations",
        "Key physiological biomarker patterns",
        "Atitwa Samuel Makokha (Min 4:00 - 5:00)",
        "Notice the marked divergence in glucose above 140 mg/dL, matching the WHO impaired glucose cutoff.",
        image_path="reports/figures/fig3_glucose_distribution.png",
        bullets=[
            "• Figure 3 (Glucose KDE): Sharp bimodal separation. Diabetic density peaks above 140 mg/dL (WHO diagnostic cutoff).",
            "• Figure 4 (BMI KDE): Diabetic cohort exhibits median BMI of 34.3 kg/m², significantly exceeding obesity cutoff (30 kg/m²).",
            "• Figure 5 (Correlations): Glucose has strongest correlation with diabetes (r = +0.47, p < 0.001), followed by BMI (r = +0.29).",
            "• Synergistic Non-Linear Risk: Patients aged >30 with BMI >30 kg/m² exhibit a 72% diabetes incidence."
        ]
    )

    # Slide 8: Machine Learning Model Families
    create_slide(
        "8. Machine Learning Model Families",
        "Benchmarking Diverse Classifiers from Simple Linear to Ensemble",
        "Kiplangat Dancun (Min 5:00 - 6:00)",
        "We tested 6 algorithms representing diverse inductive biases.",
        bullets=[
            "• 1. Dummy Classifier: Majority class baseline. Yields 64.9% accuracy with 0.0% recall, highlighting the accuracy paradox.",
            "• 2. Logistic Regression: Generalized linear model; outputs log-odds coefficients and calibrated probabilities (C=0.1, L2).",
            "• 3. K-Nearest Neighbors (KNN): Non-parametric instance classifier based on Euclidean distance in scaled biomarker space (k=17).",
            "• 4. Decision Tree (CART): Interpretable hierarchical rules. Pruned (max_depth=4) to prevent leaf overfitting.",
            "• 5. Random Forest: Ensemble of 150 bagging trees. Reduces variance and handles missing feature interactions effectively.",
            "• 6. Support Vector Machine (SVM): RBF kernel mapping non-linear interactions into high-dimensional hyperplane (C=1.0)."
        ]
    )

    # Slide 9: Hyperparameter Tuning Strategy
    create_slide(
        "9. Hyperparameter Tuning & Cross-Validation",
        "5-Fold Stratified K-Fold and Exhaustive GridSearchCV",
        "Wamukota Kevin (Min 6:00 - 6:45)",
        "Stratification ensured 34.9% positive prevalence across all five cross-validation folds.",
        bullets=[
            "• Validation Strategy: 5-Fold Stratified K-Fold cross-validation to maintain identical class ratios across every split.",
            "• Optimization Metric: GridSearchCV optimized for ROC-AUC to balance discrimination across all decision thresholds.",
            "• Tuned Hyperparameters:",
            "   - Logistic Regression: C=0.1, solver='liblinear', penalty='l2' (CV ROC-AUC: 0.844).",
            "   - Random Forest: n_estimators=150, max_depth=6, min_samples_split=5 (CV ROC-AUC: 0.835).",
            "   - KNN: n_neighbors=17, weights='distance', metric='euclidean' (CV ROC-AUC: 0.807).",
            "   - SVM: C=1.0, kernel='rbf', gamma='scale' (CV ROC-AUC: 0.811)."
        ]
    )

    # Slide 10: Model Comparison on Held-Out Test Set
    create_slide(
        "10. Model Comparison on Held-Out Test Set (n=154)",
        "Unseen Patient Evaluation Across 6 Machine Learning Algorithms",
        "Wamukota Kevin (Min 6:45 - 7:30)",
        "Random forest clearly demonstrated superior probabilistic calibration and recall.",
        image_path="reports/figures/fig7_model_comparison_bar.png",
        bullets=[
            "• Dummy Baseline: Accuracy = 64.9%, Recall = 0.0%, ROC-AUC = 0.500.",
            "• Logistic Regression: Accuracy = 70.1%, Recall(0.50) = 51.9%, ROC-AUC = 0.810.",
            "• K-Nearest Neighbors: Accuracy = 74.7%, Recall(0.50) = 55.6%, ROC-AUC = 0.807.",
            "• Decision Tree: Accuracy = 72.1%, Recall(0.50) = 53.7%, ROC-AUC = 0.823.",
            "• Tuned Random Forest (CHAMPION): Accuracy = 74.0%, Recall(0.50) = 74.1%, Recall(0.35) = 90.74%, ROC-AUC = 0.820.",
            "• SVM (RBF): Accuracy = 72.7%, Recall(0.50) = 53.7%, ROC-AUC = 0.811."
        ]
    )

    # Slide 11: The Core Question: Recall vs Precision
    create_slide(
        "11. Core Question: Why Recall Trumps Precision",
        "The Asymmetric Cost of Medical Errors in Clinical Screening",
        "Wamukota Kevin (Min 7:30 - 8:15)",
        "Dr. Kirongo asked if recall is more important. Our clinical error analysis proves it conclusively.",
        bullets=[
            "• False Negative (FN) Cost: CATASTROPHIC & IRREVERSIBLE.",
            "   - Diabetic patient sent home under false assurance.",
            "   - 3-5 years of untreated hyperglycemia causes diabetic retinopathy, end-stage renal failure, or ketoacidosis.",
            "• False Positive (FP) Cost: LOW & TEMPORARY.",
            "   - Non-diabetic flagged for follow-up testing.",
            "   - Incurs a harmless KES 300 fasting venous blood glucose test that resolves status within 24 hours.",
            "• Clinical Verdict: Medical screening mandates MAXIMIZING RECALL over precision."
        ]
    )

    # Slide 12: Threshold Selection (tau = 0.35) & Confusion Matrices
    create_slide(
        "12. Threshold Calibration: Standard \u03c4=0.50 vs Screening \u03c4=0.35",
        "Catching 49 out of 54 diabetic patients on unseen test data",
        "Wamukota Kevin (Min 8:15 - 9:00)",
        "By lowering threshold to 0.35, we slash false negatives from 14 down to 5.",
        image_path="reports/figures/fig8_confusion_matrices.png",
        bullets=[
            "• Default Threshold (τ = 0.50):",
            "   - True Positives = 40, False Negatives = 14.",
            "   - Misses 25.9% of all diabetic patients (Recall: 74.07%).",
            "• Calibrated Screening Threshold (τ = 0.35):",
            "   - True Positives = 49, False Negatives = 5.",
            "   - Catches 90.74% of all diabetic patients!",
            "   - Slashes missed cases by 64.3% (from 14 down to 5).",
            "   - Maximizes screening F2-score to 0.798 (β = 2.0)."
        ]
    )

    # Slide 13: Feature Importance & Clinical Interpretability
    create_slide(
        "13. Feature Importance & Interpretability",
        "Gini Impurity Ranking & Physiological Rationale",
        "Atitwa Samuel Makokha (Min 9:00 - 9:30)",
        "Glucose, BMI, and Age account for >62% of the decision tree split impurity.",
        image_path="reports/figures/fig10_feature_importance.png",
        bullets=[
            "• 1. Glucose (31.8%): Direct marker of endocrine dysregulation.",
            "• 2. BMI (17.4%): Physical proxy for insulin resistance.",
            "• 3. Age (13.6%): Quantifies cumulative beta-cell apoptosis.",
            "• 4. Pedigree Function (12.2%): Polygenic familial risk score.",
            "• 5. Insulin (8.9%), BloodPressure (6.1%), Pregnancies (5.2%), SkinThickness (4.8%).",
            "• Local Explainability: Prototype provides patient-level z-score deviations explaining exactly why risk is elevated."
        ]
    )

    # Slide 14: Responsible AI, Ethics, & Privacy
    create_slide(
        "14. Responsible AI, Ethics, and Governance",
        "Kenya Data Protection Act (2019) & Clinical Safety Boundaries",
        "Beauttah Kipruttoh (Min 9:30 - 10:00)",
        "Zero patient identifiers are stored, and hardcoded emergency rules override machine learning.",
        bullets=[
            "• Kenya Data Protection Act (2019): Zero patient identifiers collected. Inference is ephemeral in server RAM over encrypted TLS 1.3.",
            "• Demographic Fairness: Recognizes Pima indigenous bias; flags uncertainty bands (30-45%) for human clinician review.",
            "• Clinical Decision Support (CDS) Boundaries: Functions strictly as a first-line triage aid, never an autonomous prescriber.",
            "• Hardcoded Emergency Fail-Safes: Overrides ML if Fasting Glucose ≥ 200 mg/dL or BP ≥ 180 mmHg, issuing immediate emergency alert."
        ]
    )

    # Slide 15: Deployment Prototype & Architecture
    create_slide(
        "15. Deployment Prototype Architecture",
        "Production FastAPI Backend + React 19 / Tailwind CSS Frontend",
        "Kiplangat Dancun (Transition to Demo)",
        "Let us examine how the system operates in real time.",
        image_path="reports/screenshots/prototype_screener.png",
        bullets=[
            "• Python Backend: FastAPI microservice serving REST endpoints (/health, /api/models, /api/predict) with serialized Scikit-learn pipelines.",
            "• Frontend: React 19, TypeScript, Lucide icons, and Recharts. Real-time inference latency < 15ms.",
            "• Clinical Preset Profiles: 5 real clinical archetypes for rapid nurse assessment.",
            "• Dynamic Threshold Slider: Demonstrates sensitivity enhancement between τ = 0.50 and τ = 0.35 in real time."
        ]
    )

    # Slide 16: Two-Minute Prototype Demonstration Plan
    create_slide(
        "16. Prototype Demonstration Plan (2 Minutes)",
        "Live Clinical Scenarios for Examination",
        "Kiplangat Dancun (Demo: 2 Minutes)",
        "I will now switch to the live web interface to demonstrate these 4 exact clinical workflows.",
        bullets=[
            "• Scenario 1: Healthy Athlete Preset (Glucose 85, BMI 21.5, Age 24) -> Probability = 8.4% (Low Risk, no triage required).",
            "• Scenario 2: Metabolic Syndrome Borderline (Glucose 130, BMI 28.5, Age 32) -> Probability = 44.04% (Flagged at τ=0.35, proving sensitivity boost!).",
            "• Scenario 3: Emergency Critical Patient (Glucose 240, BP 190) -> Triggers immediate red clinical fail-safe alert banner.",
            "• Scenario 4: Live Model Switching -> Compare Random Forest vs Logistic Regression vs KNN probabilities in real time."
        ]
    )

    # Slide 17: Conclusions & Recommendations
    create_slide(
        "17. Conclusions & Institutional Recommendations",
        "Actionable Next Steps for MUST & Ministry of Health",
        "Ordit Kagwira (Concluding Remarks)",
        "Tuned Random Forest with tau = 0.35 is clinically proven to save lives by catching 90.7% of diabetic patients.",
        bullets=[
            "• Core Finding: Tuned Random Forest at τ = 0.35 achieves 90.74% Recall and 0.820 ROC-AUC, providing an optimal screening tool.",
            "• Recommendation 1: 6-month prospective validation pilot at Meru Teaching and Referral Hospital (MeTRH) outpatient clinic.",
            "• Recommendation 2: Expose FHIR-compliant REST API endpoints for KenyaEMR and national DHIS2 health surveillance integration.",
            "• Recommendation 3: Retrain and recalibrate prior distributions with indigenous East African clinical cohort data."
        ]
    )

    # Slide 18: References & Acknowledgements
    create_slide(
        "18. References & Acknowledgements",
        "Verified Academic Sources & Project Governance",
        "All 5 Group Members (Q&A)",
        "Thank you Dr. Kirongo. We are now ready to take your questions regarding any part of our pipeline or deliverables.",
        bullets=[
            "• Smith, J.W., et al. (1988). Using ADAP learning algorithm to forecast diabetes mellitus. IEEE Proc. CAMC, 261-265.",
            "• International Diabetes Federation. (2021). IDF Diabetes Atlas (10th ed.). Brussels, Belgium.",
            "• Republic of Kenya. (2019). Data Protection Act, 2019. Kenya Gazette Supplement No. 181.",
            "• World Health Organization. (2019). Classification of Diabetes Mellitus. Geneva: WHO.",
            "• Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. JMLR, 12, 2825-2830.",
            "• Meru University of Science and Technology. (2026). CDS 3301 Course Outline and Project Rubric.",
            "• Sincere gratitude to Dr. Amos Chege Kirongo for guidance throughout CDS 3301."
        ]
    )

    out_root = "GROUP_02_Diabetes_Risk_Screening_Slides.pptx"
    out_pub = "public/GROUP_02_Diabetes_Risk_Screening_Slides.pptx"
    prs.save(out_root)
    prs.save(out_pub)
    print(f"PowerPoint Presentation saved successfully to {out_root} and {out_pub}")

if __name__ == "__main__":
    generate_slides()
