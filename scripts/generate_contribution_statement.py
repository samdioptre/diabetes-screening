#!/usr/bin/env python3
"""
Generate the official separate 1-page Group 2 Contribution Statement document.
Required filename: GROUP_02_Contribution_Statement.docx
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def generate_contribution_statement():
    doc = docx.Document()
    
    # 0.8 inch margins for neat 1-page fit
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Institution Header
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    r_uni = p_header.add_run("MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY\n")
    r_uni.font.name = "Calibri"
    r_uni.font.size = Pt(13)
    r_uni.font.bold = True
    r_uni.font.color.rgb = RGBColor(15, 23, 42)

    r_sch = p_header.add_run("School of Computing and Informatics | Department of Computer Science\n")
    r_sch.font.name = "Calibri"
    r_sch.font.size = Pt(10)
    r_sch.font.color.rgb = RGBColor(71, 85, 105)

    r_crs = p_header.add_run("CDS 3301: MACHINE LEARNING — MINI-PROJECT (2026)\n")
    r_crs.font.name = "Calibri"
    r_crs.font.size = Pt(11)
    r_crs.font.bold = True
    r_crs.font.color.rgb = RGBColor(14, 116, 144)

    r_title = p_header.add_run("GROUP WORK AND INDIVIDUAL CONTRIBUTION STATEMENT\n")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(14)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42)

    # Metadata Table
    meta_table = doc.add_table(rows=3, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_info = [
        ("Group Identity:", "Group 2 (5 Members) — Bachelor of Computer Technology"),
        ("Project Theme & Title:", "Diabetes Risk Screening System (Classification)"),
        ("Course Lecturer:", "Dr. Amos Chege Kirongo (akirongo@must.ac.ke)")
    ]
    for idx, (label, val) in enumerate(meta_info):
        row = meta_table.rows[idx]
        row.cells[0].text = label
        row.cells[1].text = val
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[0].paragraphs[0].runs[0].font.size = Pt(9.5)
        row.cells[1].paragraphs[0].runs[0].font.size = Pt(9.5)
        row.cells[0].width = Inches(2.0)
        row.cells[1].width = Inches(4.9)
        set_cell_background(row.cells[0], "F1F5F9")
        set_cell_background(row.cells[1], "FFFFFF")

    doc.add_paragraph("\n")

    # Preamble text
    p_preamble = doc.add_paragraph(
        "In accordance with the project guidelines issued by Dr. Amos Chege Kirongo for CDS 3301, all group members "
        "must contribute equitably to the problem formulation, exploratory analysis, model development, tuning, evaluation, "
        "report compilation, and prototype demonstration. Below is the official record of each member's verified tasks and "
        "contribution percentage, followed by individual signature declaration blocks."
    )
    p_preamble.runs[0].font.size = Pt(9.5)

    # Detailed Members Table with Signature Block
    table = doc.add_table(rows=6, cols=5)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["No.", "Student Name", "Reg. Number", "Documented Contributions", "Signature & Date"]
    for i, h in enumerate(headers):
        c = table.rows[0].cells[i]
        c.text = h
        c.paragraphs[0].runs[0].font.bold = True
        c.paragraphs[0].runs[0].font.size = Pt(9)
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(c, "0F172A")

    members_data = [
        (
            "1",
            "Ordit Kagwira\n(Coordinator)",
            "CT202/114188/23",
            "• Overall project coordination and lecturer communication.\n• Task 1 Problem Framing & Task 8 Conclusions.\n• Integration of the 12-page academic report.",
            "Sign: __________________\nDate: __________________\n(Ready for signature)"
        ),
        (
            "2",
            "Beauttah Kipruttoh",
            "CT202/113636/23",
            "• Task 2 Data ingestion and zero-value audit.\n• Median-imputation transformer preventing data leakage.\n• Task 6 Responsible AI & Data Protection Act 2019.",
            "Sign: __________________\nDate: __________________\n(Ready for signature)"
        ),
        (
            "3",
            "Atitwa Samuel Makokha",
            "CT202/113631/23",
            "• Task 2 Five exploratory visualisations & interpretations.\n• Inter-feature correlation and bivariate risk analysis.\n• Task 5 Random Forest Gini feature ranking.",
            "Sign: __________________\nDate: __________________\n(Ready for signature)"
        ),
        (
            "4",
            "Kiplangat Dancun",
            "CT202/113622/23",
            "• Task 3 Baseline Dummy and candidate model training.\n• Task 7 Full-stack FastAPI & React deployment.\n• Pipeline joblib serialization and REST endpoint tests.",
            "Sign: __________________\nDate: __________________\n(Ready for signature)"
        ),
        (
            "5",
            "Wamukota Kevin",
            "CT202/106143/21",
            "• Task 4 5-Fold Stratified GridSearchCV tuning.\n• Task 5 Threshold calibration (tau = 0.35).\n• Recall vs Precision clinical screening justification.",
            "Sign: __________________\nDate: __________________\n(Ready for signature)"
        ),
    ]

    for r_idx, row in enumerate(members_data, start=1):
        t_row = table.rows[r_idx]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            cell = t_row.cells[c_idx]
            cell.text = val
            p = cell.paragraphs[0]
            if len(p.runs) > 0:
                p.runs[0].font.size = Pt(8.5)
            set_cell_background(cell, bg)

    table.rows[0].cells[0].width = Inches(0.35)
    table.rows[0].cells[1].width = Inches(1.3)
    table.rows[0].cells[2].width = Inches(1.1)
    table.rows[0].cells[3].width = Inches(2.6)
    table.rows[0].cells[4].width = Inches(1.55)

    doc.add_paragraph("\n")

    # Joint Declaration
    p_decl = doc.add_paragraph()
    r_decl_title = p_decl.add_run("DECLARATION OF INDIVIDUAL CONTRIBUTION AND ACADEMIC INTEGRITY:\n")
    r_decl_title.bold = True
    r_decl_title.font.size = Pt(9.5)
    r_decl_text = p_decl.add_run(
        "We, the undersigned members of Group 2, hereby certify that each member has contributed actively and equitably "
        "to the tasks described above. We further declare that all models were trained on the real Pima Indians Diabetes dataset, "
        "all reported metrics were experimentally generated, and all deliverables represent genuine group work. We confirm our "
        "readiness to individually defend any part of this machine learning pipeline during presentation sessions."
    )
    r_decl_text.font.size = Pt(9)

    out_root = "GROUP_02_Contribution_Statement.docx"
    out_pub = "public/GROUP_02_Contribution_Statement.docx"
    doc.save(out_root)
    doc.save(out_pub)
    print(f"Contribution statement successfully generated at {out_root} and {out_pub}")

if __name__ == "__main__":
    generate_contribution_statement()
