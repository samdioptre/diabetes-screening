"""
Meru University of Science and Technology (MUST)
Department of Computer Science - CDS 3301 Machine Learning
Group 2: Genuine Model Training & Validation Engine
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_validate
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, fbeta_score,
    roc_auc_score, roc_curve, precision_recall_curve, auc, confusion_matrix
)

from preprocessing import build_preprocessor_pipeline, FEATURE_NAMES, BIOLOGICAL_ZERO_COLUMNS

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'diabetes.csv')


def compute_dataset_summary(df: pd.DataFrame) -> dict:
    """Computes genuine descriptive statistics, missingness, and correlation matrix."""
    zero_counts = {}
    for col in df.columns:
        if col in BIOLOGICAL_ZERO_COLUMNS:
            count = int((df[col] == 0).sum())
            zero_counts[col] = {
                'zero_count': count,
                'zero_percentage': round((count / len(df)) * 100, 2),
                'is_biological_missing': True
            }
        else:
            zero_counts[col] = {
                'zero_count': int((df[col] == 0).sum()),
                'zero_percentage': round(((df[col] == 0).sum() / len(df)) * 100, 2),
                'is_biological_missing': False
            }

    desc = df.describe().to_dict()
    corr = df.corr().round(4).to_dict()

    target_counts = df['Outcome'].value_counts().to_dict()
    target_summary = {
        'negative_count': int(target_counts.get(0, 0)),
        'positive_count': int(target_counts.get(1, 0)),
        'negative_percentage': round(float(target_counts.get(0, 0)) / len(df) * 100, 2),
        'positive_percentage': round(float(target_counts.get(1, 0)) / len(df) * 100, 2),
    }

    return {
        'total_rows': int(len(df)),
        'features': FEATURE_NAMES,
        'target': 'Outcome',
        'target_summary': target_summary,
        'zero_audit': zero_counts,
        'descriptive_stats': desc,
        'correlation_matrix': corr
    }


def train_and_evaluate_all():
    os.makedirs(MODELS_DIR, exist_ok=True)

    print(f"Loading dataset from: {DATASET_PATH}")
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    # Save authentic dataset summary
    summary = compute_dataset_summary(df)
    summary_path = os.path.join(MODELS_DIR, 'dataset_summary.json')
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    print(f"Saved dataset summary to {summary_path}")

    X = df[FEATURE_NAMES]
    y = df['Outcome']

    # 80/20 Stratified Train-Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Train split: {X_train.shape[0]} samples | Test split: {X_test.shape[0]} samples")

    # Fit preprocessor strictly on train data to prevent data leakage
    preprocessor = build_preprocessor_pipeline()
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)

    # Save fitted preprocessor
    prep_path = os.path.join(MODELS_DIR, 'preprocessor.joblib')
    joblib.dump(preprocessor, prep_path)
    print(f"Saved preprocessor pipeline to {prep_path}")

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    model_definitions = {
        'dummy': {
            'name': 'Baseline (Dummy Classifier)',
            'type': 'Heuristic Baseline',
            'estimator': DummyClassifier(strategy='most_frequent'),
            'param_grid': {},
            'description': 'Predicts majority class (non-diabetic). Demonstrates class-imbalance accuracy trap.'
        },
        'logistic_regression': {
            'name': 'Logistic Regression',
            'type': 'Generalized Linear Model',
            'estimator': LogisticRegression(max_iter=1000, random_state=42),
            'param_grid': {
                'C': [0.01, 0.1, 0.5, 1.0, 5.0, 10.0],
                'penalty': ['l1', 'l2'],
                'solver': ['liblinear']
            },
            'description': 'Linear log-odds decision boundary providing calibrated probabilities and odds ratios.'
        },
        'knn': {
            'name': 'K-Nearest Neighbors (KNN)',
            'type': 'Instance-Based Learner',
            'estimator': KNeighborsClassifier(),
            'param_grid': {
                'n_neighbors': [3, 5, 9, 13, 17, 21],
                'weights': ['uniform', 'distance'],
                'metric': ['euclidean', 'manhattan']
            },
            'description': 'Non-parametric local metric classifier capturing patient feature clusters.'
        },
        'decision_tree': {
            'name': 'Decision Tree (CART)',
            'type': 'Rule-Based Tree',
            'estimator': DecisionTreeClassifier(random_state=42),
            'param_grid': {
                'max_depth': [3, 4, 5, 6, 8, None],
                'min_samples_leaf': [5, 10, 15, 20],
                'criterion': ['gini', 'entropy']
            },
            'description': 'White-box rule-based clinical flowchart using orthogonal recursive splits.'
        },
        'random_forest': {
            'name': 'Random Forest Classifier',
            'type': 'Bagged Tree Ensemble',
            'estimator': RandomForestClassifier(random_state=42),
            'param_grid': {
                'n_estimators': [50, 100, 150, 200],
                'max_depth': [4, 6, 8, None],
                'min_samples_split': [2, 4, 8],
                'class_weight': ['balanced', None]
            },
            'description': 'Ensemble of de-correlated decision trees with randomized feature subsets.'
        },
        'svm': {
            'name': 'Support Vector Machine (RBF)',
            'type': 'Kernel Machine',
            'estimator': SVC(probability=True, random_state=42),
            'param_grid': {
                'C': [0.5, 1.0, 1.5, 2.0, 5.0],
                'gamma': ['scale', 'auto', 0.05, 0.1],
                'kernel': ['rbf']
            },
            'description': 'Non-linear decision boundary in high-dimensional reproducing kernel Hilbert space.'
        }
    }

    evaluation_results = {
        'split_info': {
            'total_samples': len(df),
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'test_positives': int((y_test == 1).sum()),
            'test_negatives': int((y_test == 0).sum())
        },
        'recommended_threshold': 0.35,
        'models': {}
    }

    for model_id, config in model_definitions.items():
        print(f"\n---> Training {config['name']} ({model_id})...")

        if config['param_grid']:
            grid_search = GridSearchCV(
                estimator=config['estimator'],
                param_grid=config['param_grid'],
                cv=cv,
                scoring='roc_auc',
                n_jobs=-1
            )
            grid_search.fit(X_train_proc, y_train)
            best_model = grid_search.best_estimator_
            best_params = grid_search.best_params_
            best_cv_score = float(grid_search.best_score_)
        else:
            best_model = config['estimator']
            best_model.fit(X_train_proc, y_train)
            best_params = {}
            best_cv_score = 0.5

        # 5-Fold cross-validation metrics on training set
        cv_scores = cross_validate(
            best_model, X_train_proc, y_train, cv=cv,
            scoring=['accuracy', 'precision', 'recall', 'roc_auc'],
            n_jobs=-1
        )

        # Save model artifact
        model_save_path = os.path.join(MODELS_DIR, f"{model_id}.joblib")
        joblib.dump(best_model, model_save_path)
        print(f"Saved model to {model_save_path}")

        # Evaluate on the unseen held-out test set
        y_test_pred = best_model.predict(X_test_proc)

        if hasattr(best_model, "predict_proba"):
            y_test_proba = best_model.predict_proba(X_test_proc)[:, 1]
        elif hasattr(best_model, "decision_function"):
            df_vals = best_model.decision_function(X_test_proc)
            y_test_proba = 1 / (1 + np.exp(-df_vals))
        else:
            y_test_proba = y_test_pred.astype(float)

        # Metrics at default threshold tau = 0.50
        acc_05 = float(accuracy_score(y_test, y_test_pred))
        prec_05 = float(precision_score(y_test, y_test_pred, zero_division=0))
        rec_05 = float(recall_score(y_test, y_test_pred, zero_division=0))
        f1_05 = float(f1_score(y_test, y_test_pred, zero_division=0))
        f2_05 = float(fbeta_score(y_test, y_test_pred, beta=2, zero_division=0))

        # Metrics at recommended screening threshold tau = 0.35
        y_test_pred_035 = (y_test_proba >= 0.35).astype(int)
        acc_035 = float(accuracy_score(y_test, y_test_pred_035))
        prec_035 = float(precision_score(y_test, y_test_pred_035, zero_division=0))
        rec_035 = float(recall_score(y_test, y_test_pred_035, zero_division=0))
        f1_035 = float(f1_score(y_test, y_test_pred_035, zero_division=0))
        f2_035 = float(fbeta_score(y_test, y_test_pred_035, beta=2, zero_division=0))

        # ROC-AUC and PR-AUC
        try:
            roc_auc = float(roc_auc_score(y_test, y_test_proba))
        except Exception:
            roc_auc = 0.5

        prec_arr, rec_arr, _ = precision_recall_curve(y_test, y_test_proba)
        pr_auc = float(auc(rec_arr, prec_arr))

        # ROC Curve sample points for charting
        fpr, tpr, roc_thresh = roc_curve(y_test, y_test_proba)
        roc_points = []
        step = max(1, len(fpr) // 30)
        for i in range(0, len(fpr), step):
            t_val = float(roc_thresh[i]) if i < len(roc_thresh) else 0.0
            if np.isinf(t_val) or np.isnan(t_val) or t_val > 1.0:
                t_val = 1.0
            roc_points.append({
                'fpr': round(float(fpr[i]), 4),
                'tpr': round(float(tpr[i]), 4),
                'threshold': round(t_val, 4)
            })
        if roc_points[-1]['fpr'] != 1.0:
            roc_points.append({'fpr': 1.0, 'tpr': 1.0, 'threshold': 0.0})

        # Precision-Recall Curve sample points
        pr_points = []
        step_pr = max(1, len(rec_arr) // 30)
        for i in range(0, len(rec_arr), step_pr):
            pr_points.append({
                'recall': round(float(rec_arr[i]), 4),
                'precision': round(float(prec_arr[i]), 4)
            })

        # Confusion Matrices
        cm_05 = confusion_matrix(y_test, y_test_pred)
        cm_035 = confusion_matrix(y_test, y_test_pred_035)

        # Feature importances / coefficients
        feature_importance_list = []
        if hasattr(best_model, 'feature_importances_'):
            importances = best_model.feature_importances_
            for feat, imp in zip(FEATURE_NAMES, importances):
                feature_importance_list.append({
                    'feature': feat,
                    'importance': round(float(imp), 4),
                    'type': 'gini_importance'
                })
            feature_importance_list.sort(key=lambda x: x['importance'], reverse=True)
        elif hasattr(best_model, 'coef_'):
            coefs = best_model.coef_[0]
            for feat, coef in zip(FEATURE_NAMES, coefs):
                feature_importance_list.append({
                    'feature': feat,
                    'importance': round(abs(float(coef)), 4),
                    'coefficient': round(float(coef), 4),
                    'type': 'logistic_coefficient'
                })
            feature_importance_list.sort(key=lambda x: x['importance'], reverse=True)

        evaluation_results['models'][model_id] = {
            'id': model_id,
            'name': config['name'],
            'type': config['type'],
            'description': config['description'],
            'best_params': best_params,
            'cv_metrics': {
                'accuracy_mean': round(float(cv_scores['test_accuracy'].mean()), 4),
                'accuracy_std': round(float(cv_scores['test_accuracy'].std()), 4),
                'recall_mean': round(float(cv_scores['test_recall'].mean()), 4),
                'precision_mean': round(float(cv_scores['test_precision'].mean()), 4),
                'roc_auc_mean': round(float(cv_scores['test_roc_auc'].mean()), 4)
            },
            'test_metrics_default_tau': {
                'threshold': 0.50,
                'accuracy': round(acc_05, 4),
                'precision': round(prec_05, 4),
                'recall': round(rec_05, 4),
                'f1_score': round(f1_05, 4),
                'f2_score': round(f2_05, 4),
                'roc_auc': round(roc_auc, 4),
                'pr_auc': round(pr_auc, 4),
                'confusion_matrix': {
                    'tn': int(cm_05[0, 0]),
                    'fp': int(cm_05[0, 1]),
                    'fn': int(cm_05[1, 0]),
                    'tp': int(cm_05[1, 1])
                }
            },
            'test_metrics_recommended_tau': {
                'threshold': 0.35,
                'accuracy': round(acc_035, 4),
                'precision': round(prec_035, 4),
                'recall': round(rec_035, 4),
                'f1_score': round(f1_035, 4),
                'f2_score': round(f2_035, 4),
                'confusion_matrix': {
                    'tn': int(cm_035[0, 0]),
                    'fp': int(cm_035[0, 1]),
                    'fn': int(cm_035[1, 0]),
                    'tp': int(cm_035[1, 1])
                }
            },
            'roc_curve': roc_points,
            'pr_curve': pr_points,
            'feature_importances': feature_importance_list
        }

        print(f"Results for {model_id} (tau=0.50): Acc={acc_05:.3f}, Rec={rec_05:.3f}, Prec={prec_05:.3f}, AUC={roc_auc:.3f}")
        print(f"Results for {model_id} (tau=0.35): Acc={acc_035:.3f}, Rec={rec_035:.3f}, Prec={prec_035:.3f}, F2={f2_035:.3f}")

    eval_path = os.path.join(MODELS_DIR, 'evaluation_results.json')
    with open(eval_path, 'w') as f:
        json.dump(evaluation_results, f, indent=2)
    print(f"\nAll models trained and evaluated! Results written to {eval_path}")
    return evaluation_results


if __name__ == '__main__':
    train_and_evaluate_all()
