# kidney_risk_rf_train.py
# Random Forest model to predict Risk_Score for Kidney Transplant Dataset

import os
import sys
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# =========================
# 1. Load Dataset
# =========================
DATA_PATH = os.path.join(os.path.dirname(__file__), "kidney dataset.csv")

if not os.path.exists(DATA_PATH):
    print(f"Data file not found at: {DATA_PATH}")
    print("Make sure 'kidney dataset.csv' is located in the same folder as this script.")
    sys.exit(1)

df = pd.read_csv(DATA_PATH)
print("Dataset loaded successfully")
print(df.head())


# =========================
# 2. Encode Categorical Features
# =========================
categorical_columns = [
    "Patient_BloodType",
    "Organ_Required",
    "Diagnosis_Result",
    "Biological_Markers",
    "Organ_Status"
]

label_encoders = {}

for col in categorical_columns:
    if col not in df.columns:
        continue
    # Only encode object (string) types; skip numeric columns
    if df[col].dtype == object or df[col].dtype.name == 'category':
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le

print("\nCategorical columns encoded")


# =========================
# 3. Define Features & Target
# =========================
# Determine target column
if "Risk_Score" in df.columns:
    TARGET = "Risk_Score"
elif "Predicted_Survival_Chance" in df.columns:
    TARGET = "Predicted_Survival_Chance"
    print("Warning: 'Risk_Score' not found — using 'Predicted_Survival_Chance' as target.")
elif "RealTime_Organ_HealthScore" in df.columns:
    TARGET = "RealTime_Organ_HealthScore"
    print("Warning: 'Risk_Score' not found — using 'RealTime_Organ_HealthScore' as target.")
else:
    print("Target column 'Risk_Score' not found. Available columns:")
    print(list(df.columns))
    sys.exit(1)

drop_cols = [c for c in ["Patient_ID", "Donor_ID"] if c in df.columns]
X = df.drop(columns=drop_cols + [TARGET])

# Remove identifier and timestamp columns from features
drop_extra = [c for c in X.columns if ("ID" in c and c.lower().find('organ_tracking')==-1) or "Timestamp" in c or c.lower().endswith("_id")]
drop_extra = [c for c in X.columns if ("ID" in c or "Timestamp" in c or c.lower().endswith("_id"))]
for c in drop_extra:
    if c in X.columns:
        X = X.drop(columns=[c])

# Convert remaining categorical/string columns to numeric via one-hot encoding
X = pd.get_dummies(X, drop_first=True)

y = df[TARGET]

print("\nFeatures used for training:")
print(X.columns)


# =========================
# 4. Feature Scaling
# =========================
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("\nFeatures scaled")

# =========================
# 5. Train-Test Split
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.2,
    random_state=42
)

print("Train-test split completed")


# =========================
# 6. Hyperparameter Tuning with GridSearchCV
# =========================
print("\nTuning Random Forest hyperparameters (this may take a moment)...")

rf_params = {
    'n_estimators': [100, 150],
    'max_depth': [5, 7, 10],
    'min_samples_leaf': [2, 5, 10],
    'min_samples_split': [2, 5]
}

rf_base = RandomForestRegressor(random_state=42, n_jobs=-1)
grid_search_rf = GridSearchCV(rf_base, rf_params, cv=3, scoring='r2', n_jobs=-1, verbose=0)
grid_search_rf.fit(X_train, y_train)
rf_model = grid_search_rf.best_estimator_

print(f"Best RF params: {grid_search_rf.best_params_}")
print(f"Best CV R²: {grid_search_rf.best_score_:.4f}")

# =========================
# 7. Train Alternative Models
# =========================
print("\nTraining alternative models...")

ridge_model = Ridge(alpha=1.0)
ridge_model.fit(X_train, y_train)

gb_model = GradientBoostingRegressor(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    random_state=42
)
gb_model.fit(X_train, y_train)

print("Alternative models trained")


# =========================
# 8. Model Evaluation
# =========================
from sklearn.model_selection import cross_val_score

# Evaluate all models
models = {
    'Random Forest (Tuned)': rf_model,
    'Ridge Regression': ridge_model,
    'Gradient Boosting': gb_model
}

results = {}

print("\n" + "="*70)
print("MODEL COMPARISON")
print("="*70)

for model_name, model in models.items():
    y_pred = model.predict(X_test)
    y_pred_train = model.predict(X_train)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    mae_train = mean_absolute_error(y_train, y_pred_train)
    r2_train = r2_score(y_train, y_pred_train)
    
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100 if np.all(y_test != 0) else np.inf
    
    # Cross-validation
    cv_r2 = cross_val_score(model, X_train, y_train, cv=5, scoring='r2').mean()
    
    results[model_name] = {
        'test_r2': r2,
        'test_mae': mae,
        'test_rmse': rmse,
        'test_mape': mape,
        'train_r2': r2_train,
        'cv_r2': cv_r2,
        'model': model
    }
    
    print(f"\n{model_name}:")
    print(f"  Test  R²:    {r2:.4f} | MAE: {mae:.4f} | RMSE: {rmse:.4f}")
    print(f"  Train R²:    {r2_train:.4f}")
    print(f"  CV R² (5x):  {cv_r2:.4f}")
    print(f"  MAPE:        {mape:.2f}%")
    print(f"  Overfit gap: {abs(r2_train - r2):.4f}")

# Select best model
best_model_name = max(results, key=lambda x: results[x]['test_r2'])
best_model = results[best_model_name]['model']

print(f"\n{'='*70}")
print(f"Best Model: {best_model_name}")
print(f"{'='*70}")

# Detailed evaluation of best model
y_pred = best_model.predict(X_test)
y_pred_train = best_model.predict(X_train)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

mae_train = mean_absolute_error(y_train, y_pred_train)
rmse_train = np.sqrt(mean_squared_error(y_train, y_pred_train))
r2_train = r2_score(y_train, y_pred_train)

mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

cv_r2_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='r2')
cv_mae_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='neg_mean_absolute_error')

print("\n--- Test Set Metrics ---")
print(f"MAE  : {mae:.4f}")
print(f"RMSE : {rmse:.4f}")
print(f"R²   : {r2:.4f}")
print(f"MAPE : {mape:.2f}%")

print("\n--- Train Set Metrics ---")
print(f"MAE  : {mae_train:.4f}")
print(f"RMSE : {rmse_train:.4f}")
print(f"R²   : {r2_train:.4f}")

print("\n--- Cross-Validation (5-Fold) ---")
print(f"R² scores   : {[f'{s:.4f}' for s in cv_r2_scores]}")
print(f"R² mean     : {cv_r2_scores.mean():.4f} (+/- {cv_r2_scores.std():.4f})")
print(f"MAE scores  : {[f'{-s:.4f}' for s in cv_mae_scores]}")
print(f"MAE mean    : {-cv_mae_scores.mean():.4f} (+/- {-cv_mae_scores.std():.4f})")

print("\n--- Prediction Analysis ---")
print(f"Min predicted: {y_pred.min():.2f}")
print(f"Max predicted: {y_pred.max():.2f}")
print(f"Mean predicted: {y_pred.mean():.2f}")
print(f"\nMin actual: {y_test.min():.2f}")
print(f"Max actual: {y_test.max():.2f}")
print(f"Mean actual: {y_test.mean():.2f}")

residuals = y_test - y_pred
print(f"\nResidual stats:")
print(f"Mean error: {residuals.mean():.4f}")
print(f"Std error: {residuals.std():.4f}")
print(f"Min error: {residuals.min():.4f}")
print(f"Max error: {residuals.max():.4f}")


# =========================
# 9. Feature Importance
# =========================
if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        "Feature": X.columns,
        "Importance": best_model.feature_importances_
    }).sort_values(by="Importance", ascending=False)

    print("\nTop 10 Feature Importance:")
    print(feature_importance.head(10).to_string(index=False))
else:
    print("\nFeature importance not available for this model type.")


# =========================
# 10. Save Model & Encoders
# =========================
joblib.dump(best_model, "kidney_risk_model.pkl")
joblib.dump(label_encoders, "kidney_label_encoders.pkl")
joblib.dump(scaler, "kidney_feature_scaler.pkl")

print("\nModel and encoders saved successfully")
print("Files created:")
print(" - kidney_risk_model.pkl")
print(" - kidney_label_encoders.pkl")
print(" - kidney_feature_scaler.pkl")


# =========================
# 11. Sample Prediction (Optional Check)
# =========================
sample_input = X_test[:1]
sample_prediction = best_model.predict(sample_input)

print("\nSample Prediction:")
print(f"Predicted: {sample_prediction[0]:.2f}")
print(f"Actual: {y_test.iloc[0]:.2f}")
print(f"Error: {abs(sample_prediction[0] - y_test.iloc[0]):.2f}")
