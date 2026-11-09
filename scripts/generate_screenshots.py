#!/usr/bin/env python3
"""
Generate high-fidelity UI visual summaries for reports/screenshots/
"""

import matplotlib.pyplot as plt
import os

os.makedirs('reports/screenshots', exist_ok=True)

# Screenshot 1: Screener UI Diagram
fig, ax = plt.subplots(figsize=(10, 6), dpi=200)
ax.set_facecolor('#0f172a')
fig.patch.set_facecolor('#020617')

# Draw simulated UI card
rect = plt.Rectangle((0.05, 0.05), 0.9, 0.9, facecolor='#1e293b', edgecolor='#334155', transform=ax.transAxes, zorder=1)
ax.add_patch(rect)

ax.text(0.1, 0.85, 'MUST CDS 3301 CLINICAL DIABETES RISK SCREENER (GROUP 2)', transform=ax.transAxes, color='#38bdf8', fontsize=12, fontweight='bold')
ax.text(0.1, 0.80, 'FastAPI Microservice (Port 8001) • Stratified Random Forest Pipeline (τ = 0.35)', transform=ax.transAxes, color='#94a3b8', fontsize=9)

# Biomarker boxes
boxes = [
    ('Pregnancies: 2', 0.1, 0.68), ('Glucose: 130 mg/dL', 0.38, 0.68), ('Blood Pressure: 70 mmHg', 0.66, 0.68),
    ('Skin Thickness: 28 mm', 0.1, 0.56), ('Insulin: 110 μU/mL', 0.38, 0.56), ('BMI: 28.5 kg/m²', 0.66, 0.56),
    ('Pedigree Func: 0.45', 0.1, 0.44), ('Age: 32 Years', 0.38, 0.44), ('Threshold: τ = 0.35', 0.66, 0.44)
]
for text, x, y in boxes:
    b = plt.Rectangle((x, y), 0.25, 0.08, facecolor='#0f172a', edgecolor='#475569', transform=ax.transAxes, zorder=2)
    ax.add_patch(b)
    ax.text(x + 0.02, y + 0.025, text, transform=ax.transAxes, color='#f1f5f9', fontsize=8.5, fontweight='bold', zorder=3)

# Result Box
res_box = plt.Rectangle((0.1, 0.12), 0.8, 0.26, facecolor='#134e4a', edgecolor='#14b8a6', transform=ax.transAxes, zorder=2)
ax.add_patch(res_box)
ax.text(0.14, 0.30, 'PREDICTION: POSITIVE (DIABETES RISK SCREENING WATCH)', transform=ax.transAxes, color='#2dd4bf', fontsize=11, fontweight='bold', zorder=3)
ax.text(0.14, 0.24, 'Calculated Risk Probability: 44.04% | Decision Cutoff: τ = 0.35 | Risk Tier: Screening Watch', transform=ax.transAxes, color='#ccfbf1', fontsize=9, zorder=3)
ax.text(0.14, 0.17, 'Clinical Action: Patient exceeds screening threshold (0.35). Schedule fasting venous plasma glucose assay.', transform=ax.transAxes, color='#99f6e4', fontsize=8.5, zorder=3)

ax.axis('off')
plt.tight_layout()
fig.savefig('reports/screenshots/prototype_screener.png')
plt.close(fig)

print("Prototype screenshot generated successfully in reports/screenshots/!")
