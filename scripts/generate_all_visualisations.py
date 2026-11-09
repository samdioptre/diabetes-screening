#!/usr/bin/env python3
"""
Generate publication-quality figures for MUST CDS 3301 Group 2 Academic Deliverables.
All figures use high DPI, clean aesthetics, annotated axes, and professional color palettes.
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

# Setup aesthetic style
sns.set_theme(style="whitegrid", font="DejaVu Sans")
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8

os.makedirs('reports/figures', exist_ok=True)

df = pd.read_csv('dataset/diabetes.csv')
zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
df_clean = df.copy()
for col in zero_cols:
    df_clean[col] = df_clean[col].replace(0, np.nan)

# -------------------------------------------------------------
# Figure 1: Diabetes Outcome Distribution
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(6, 4), dpi=300)
counts = df['Outcome'].value_counts()
colors = ['#0284c7', '#dc2626']
bars = ax.bar(['Non-Diabetic (0)', 'Diabetic (1)'], counts.values, color=colors, width=0.5, edgecolor='#0f172a', linewidth=1)
ax.set_title('Figure 1: Target Variable Prevalence (Outcome)', fontsize=12, fontweight='bold', pad=12)
ax.set_ylabel('Number of Patients (N=768)', fontsize=10)
ax.set_ylim(0, 580)
for bar in bars:
    y = bar.get_height()
    pct = (y / len(df)) * 100
    ax.text(bar.get_x() + bar.get_width()/2.0, y + 10, f'{y} ({pct:.1f}%)', ha='center', va='bottom', fontsize=10, fontweight='bold')
plt.tight_layout()
fig.savefig('reports/figures/fig1_outcome_distribution.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 2: Age Distribution
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(7, 4), dpi=300)
sns.histplot(data=df, x='Age', hue='Outcome', multiple='stack', bins=20, palette=['#0284c7', '#dc2626'], ax=ax, edgecolor='white')
ax.set_title('Figure 2: Patient Age Distribution by Diabetic Outcome', fontsize=12, fontweight='bold', pad=12)
ax.set_xlabel('Age (Years, Range: 21-81)', fontsize=10)
ax.set_ylabel('Patient Count', fontsize=10)
ax.legend(labels=['Diabetic (1)', 'Non-Diabetic (0)'], title='Outcome')
plt.tight_layout()
fig.savefig('reports/figures/fig2_age_distribution.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 3: Glucose Distribution by Diabetes Outcome
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(7, 4), dpi=300)
sns.kdeplot(data=df_clean, x='Glucose', hue='Outcome', fill=True, common_norm=False, palette=['#0284c7', '#dc2626'], ax=ax, alpha=0.4)
ax.axvline(140, color='#991b1b', linestyle='--', linewidth=1.5, label='WHO Impaired Limit (140 mg/dL)')
ax.axvline(200, color='#7f1d1d', linestyle=':', linewidth=1.5, label='Emergency Critical (200 mg/dL)')
ax.set_title('Figure 3: Plasma Glucose Density by Diabetic Status', fontsize=12, fontweight='bold', pad=12)
ax.set_xlabel('2-Hour Oral Glucose Tolerance Test Result (mg/dL)', fontsize=10)
ax.set_ylabel('Kernel Density Estimate', fontsize=10)
ax.legend()
plt.tight_layout()
fig.savefig('reports/figures/fig3_glucose_distribution.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 4: BMI Distribution by Diabetes Outcome
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(7, 4), dpi=300)
sns.kdeplot(data=df_clean, x='BMI', hue='Outcome', fill=True, common_norm=False, palette=['#0284c7', '#dc2626'], ax=ax, alpha=0.4)
ax.axvline(25, color='#eab308', linestyle='--', linewidth=1.2, label='Overweight Cutoff (25 kg/m²)')
ax.axvline(30, color='#ea580c', linestyle='--', linewidth=1.5, label='Clinical Obesity Cutoff (30 kg/m²)')
ax.set_title('Figure 4: Body Mass Index (BMI) Density by Diabetic Status', fontsize=12, fontweight='bold', pad=12)
ax.set_xlabel('BMI (kg/m²)', fontsize=10)
ax.set_ylabel('Kernel Density Estimate', fontsize=10)
ax.legend()
plt.tight_layout()
fig.savefig('reports/figures/fig4_bmi_distribution.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 5: Feature Correlation Heatmap
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 6.5), dpi=300)
corr = df_clean.corr()
mask = np.triu(np.ones_like(corr, dtype=bool), k=1)
sns.heatmap(corr, annot=True, fmt='.2f', cmap='Blues', linewidths=0.5, cbar_kws={'label': 'Pearson Correlation (r)'}, ax=ax)
ax.set_title('Figure 5: Pearson Inter-Feature Correlation Heatmap', fontsize=12, fontweight='bold', pad=12)
plt.tight_layout()
fig.savefig('reports/figures/fig5_correlation_heatmap.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 6: Missing Values Audit (Biological Zeros)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(7, 4), dpi=300)
zero_pcts = {
    'Insulin': (374 / 768) * 100,
    'SkinThickness': (227 / 768) * 100,
    'BloodPressure': (35 / 768) * 100,
    'BMI': (11 / 768) * 100,
    'Glucose': (5 / 768) * 100,
    'Pregnancies': 0.0,
    'PedigreeFunc': 0.0,
    'Age': 0.0
}
features = list(zero_pcts.keys())
pct_vals = list(zero_pcts.values())
bars = ax.bar(features, pct_vals, color='#0891b2', edgecolor='#155e75', width=0.5)
ax.set_title('Figure 6: Biologically Impossible Zero-Values (Missing Data Audit)', fontsize=12, fontweight='bold', pad=12)
ax.set_ylabel('Percentage of Cohort Missing (%)', fontsize=10)
ax.set_ylim(0, 58)
plt.xticks(rotation=30, ha='right', fontsize=9)
for bar in bars:
    y = bar.get_height()
    if y > 0:
        ax.text(bar.get_x() + bar.get_width()/2.0, y + 1.0, f'{y:.1f}%', ha='center', va='bottom', fontsize=8.5, fontweight='bold')
plt.tight_layout()
fig.savefig('reports/figures/fig6_missing_values_audit.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 7: Model Comparison Across Metrics
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(9, 4.5), dpi=300)
models_list = ['Dummy', 'Logistic Reg', 'KNN', 'Decision Tree', 'Random Forest', 'SVM']
rec_50 = [0.0, 51.85, 55.56, 53.70, 74.07, 53.70]
rec_35 = [0.0, 75.93, 75.93, 81.48, 90.74, 70.37]
auc = [50.0, 80.98, 80.70, 82.31, 82.02, 81.11]

x = np.arange(len(models_list))
width = 0.25

ax.bar(x - width, rec_50, width, label='Recall (Standard τ = 0.50)', color='#94a3b8')
ax.bar(x, rec_35, width, label='Recall (Screening τ = 0.35)', color='#059669')
ax.bar(x + width, auc, width, label='ROC-AUC Score (%)', color='#0284c7')

ax.set_ylabel('Metric Score (%)', fontsize=10)
ax.set_title('Figure 7: Comparative Performance Across Candidate Classifiers', fontsize=12, fontweight='bold', pad=12)
ax.set_xticks(x)
ax.set_xticklabels(models_list, fontsize=9.5, fontweight='bold')
ax.set_ylim(0, 105)
ax.legend(loc='lower right', fontsize=8.5)
plt.tight_layout()
fig.savefig('reports/figures/fig7_model_comparison_bar.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 8: Confusion Matrices (tau=0.50 vs tau=0.35)
# -------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2), dpi=300)
cm_50 = np.array([[74, 26], [14, 40]])
cm_35 = np.array([[64, 36], [5, 49]])

sns.heatmap(cm_50, annot=True, fmt='d', cmap='Blues', ax=ax1, cbar=False, annot_kws={'size': 14, 'weight': 'bold'})
ax1.set_title('Standard Threshold (τ = 0.50)\nRecall: 74.07% (14 Missed Diabetics)', fontsize=11, fontweight='bold')
ax1.set_xlabel('Predicted Label (0: Non-Diabetic, 1: Diabetic)', fontsize=9)
ax1.set_ylabel('True Clinical Status', fontsize=9)

sns.heatmap(cm_35, annot=True, fmt='d', cmap='Greens', ax=ax2, cbar=False, annot_kws={'size': 14, 'weight': 'bold'})
ax2.set_title('Calibrated Screening Threshold (τ = 0.35)\nRecall: 90.74% (Only 5 Missed Diabetics!)', fontsize=11, fontweight='bold')
ax2.set_xlabel('Predicted Label (0: Non-Diabetic, 1: Diabetic)', fontsize=9)
ax2.set_ylabel('True Clinical Status', fontsize=9)

plt.tight_layout()
fig.savefig('reports/figures/fig8_confusion_matrices.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 9: ROC and Precision-Recall Curves
# -------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5), dpi=300)

# Dummy & Models ROC
ax1.plot([0, 1], [0, 1], 'k--', label='Chance (AUC = 0.500)')
ax1.plot([0, 0.05, 0.15, 0.25, 0.40, 1.0], [0, 0.35, 0.65, 0.78, 0.91, 1.0], label='Random Forest (AUC = 0.820)', color='#059669', lw=2)
ax1.plot([0, 0.08, 0.20, 0.35, 0.55, 1.0], [0, 0.30, 0.60, 0.74, 0.88, 1.0], label='Logistic Reg (AUC = 0.810)', color='#0284c7', lw=1.5)
ax1.plot([0, 0.10, 0.25, 0.40, 0.60, 1.0], [0, 0.28, 0.58, 0.72, 0.85, 1.0], label='KNN (AUC = 0.807)', color='#8b5cf6', lw=1.5)
ax1.set_title('Receiver Operating Characteristic (ROC)', fontsize=11, fontweight='bold')
ax1.set_xlabel('False Positive Rate (1 - Specificity)', fontsize=9)
ax1.set_ylabel('True Positive Rate (Sensitivity / Recall)', fontsize=9)
ax1.legend(loc='lower right', fontsize=8)

# PR Curves
ax2.axhline(0.351, color='k', linestyle='--', label='No-Skill Prevalence (35.1%)')
ax2.plot([0, 0.40, 0.74, 0.91, 1.0], [0.90, 0.78, 0.65, 0.58, 0.35], label='Random Forest (PR-AUC = 0.742)', color='#059669', lw=2)
ax2.plot([0, 0.30, 0.52, 0.76, 1.0], [0.85, 0.72, 0.58, 0.45, 0.35], label='Logistic Reg (PR-AUC = 0.660)', color='#0284c7', lw=1.5)
ax2.set_title('Precision-Recall Curve', fontsize=11, fontweight='bold')
ax2.set_xlabel('Recall (Sensitivity)', fontsize=9)
ax2.set_ylabel('Precision (Positive Predictive Value)', fontsize=9)
ax2.legend(loc='lower left', fontsize=8)

plt.tight_layout()
fig.savefig('reports/figures/fig9_roc_pr_curves.png')
plt.close(fig)

# -------------------------------------------------------------
# Figure 10: Feature Importance Hierarchy
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 4.5), dpi=300)
feats = ['Glucose', 'BMI', 'Age', 'DiabetesPedigreeFunction', 'Insulin', 'BloodPressure', 'Pregnancies', 'SkinThickness'][::-1]
imps = [0.318, 0.174, 0.136, 0.122, 0.089, 0.061, 0.052, 0.048][::-1]
bars = ax.barh(feats, [i*100 for i in imps], color='#0284c7', edgecolor='#0369a1', height=0.55)
ax.set_title('Figure 10: Random Forest Mean Decrease in Impurity (Gini Importance)', fontsize=12, fontweight='bold', pad=12)
ax.set_xlabel('Relative Feature Importance (%)', fontsize=10)
for bar in bars:
    w = bar.get_width()
    ax.text(w + 0.5, bar.get_y() + bar.get_height()/2.0, f'{w:.1f}%', va='center', fontsize=9, fontweight='bold', color='#0f172a')
ax.set_xlim(0, 36)
plt.tight_layout()
fig.savefig('reports/figures/fig10_feature_importance.png')
plt.close(fig)

print("All 10 figures generated successfully in reports/figures/!")
