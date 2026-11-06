"""
Meru University of Science and Technology (MUST)
Department of Computer Science - CDS 3301 Machine Learning
Group 2: Data Preprocessing & Leakage-Free Pipeline
"""

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

FEATURE_NAMES = [
    'Pregnancies',
    'Glucose',
    'BloodPressure',
    'SkinThickness',
    'Insulin',
    'BMI',
    'DiabetesPedigreeFunction',
    'Age'
]

# Features where 0 is biologically invalid in living humans
BIOLOGICAL_ZERO_COLUMNS = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']


class BiologicalZeroHandler(BaseEstimator, TransformerMixin):
    """
    Replaces biologically impossible zeros with NaN in specified features.
    In physiological measurements, 0 blood glucose, blood pressure, skin fold,
    insulin, or BMI represents missing data (MAR), not true zero.
    """
    def __init__(self, zero_columns=None):
        self.zero_columns = zero_columns or BIOLOGICAL_ZERO_COLUMNS

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if isinstance(X, pd.DataFrame):
            X_copy = X.copy()
            for col in self.zero_columns:
                if col in X_copy.columns:
                    X_copy[col] = X_copy[col].replace(0, np.nan)
            return X_copy.values
        else:
            X_arr = np.array(X, dtype=float).copy()
            # Map column indices based on standard feature ordering
            for col in self.zero_columns:
                idx = FEATURE_NAMES.index(col)
                X_arr[:, idx] = np.where(X_arr[:, idx] == 0, np.nan, X_arr[:, idx])
            return X_arr


def build_preprocessor_pipeline():
    """
    Constructs a complete preprocessing pipeline:
    1. Replaces biological zeroes with NaN.
    2. Imputes missing values with the median (fitted solely on training data).
    3. Normalizes features using StandardScaler (fitted solely on training data).
    """
    return Pipeline([
        ('zero_handler', BiologicalZeroHandler()),
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
