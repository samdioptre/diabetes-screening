#!/usr/bin/env python3
"""
Create the official final submission structure and zip archive.
Packaging:
- GROUP_02_Diabetes_Risk_Screening_Report.docx
- GROUP_02_Diabetes_Risk_Screening_Report.pdf
- GROUP_02_Diabetes_Risk_Screening_Notebook.ipynb
- GROUP_02_Diabetes_Risk_Screening_Slides.pptx
- GROUP_02_Contribution_Statement.docx
- README.md
- dataset/
- backend/
- reports/
- src/
"""

import os
import shutil
import zipfile

def build_archive():
    target_dir = "GROUP_02_Diabetes_Risk_Screening_FINAL"
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.makedirs(target_dir, exist_ok=True)

    # Copy top-level deliverables
    top_files = [
        "GROUP_02_Diabetes_Risk_Screening_Report.docx",
        "GROUP_02_Diabetes_Risk_Screening_Report.pdf",
        "GROUP_02_Diabetes_Risk_Screening_Notebook.ipynb",
        "GROUP_02_Diabetes_Risk_Screening_Slides.pptx",
        "GROUP_02_Contribution_Statement.docx",
        "README.md",
        "package.json",
        "tsconfig.json",
        "vite.config.ts",
        "index.html",
        "metadata.json"
    ]
    for tf in top_files:
        if os.path.exists(tf):
            shutil.copy2(tf, os.path.join(target_dir, tf))

    # Copy directories (skip node_modules, dist, __pycache__)
    dirs_to_copy = ["dataset", "backend", "reports", "src", "public"]
    for d in dirs_to_copy:
        if os.path.exists(d):
            dest = os.path.join(target_dir, d)
            shutil.copytree(d, dest, ignore=shutil.ignore_patterns('__pycache__', '*.pyc', 'node_modules', 'dist'))

    # Build zip file
    zip_root = "GROUP_02_Diabetes_Risk_Screening_Prototype.zip"
    zip_pub = "public/GROUP_02_Diabetes_Risk_Screening_Prototype.zip"

    with zipfile.ZipFile(zip_root, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(target_dir):
            for file in files:
                full_path = os.path.join(root, file)
                arcname = os.path.relpath(full_path, ".")
                z.write(full_path, arcname=arcname)

    shutil.copy2(zip_root, zip_pub)
    print(f"Archive successfully created: {zip_root} ({os.path.getsize(zip_root)} bytes) and copied to {zip_pub}")

if __name__ == "__main__":
    build_archive()
