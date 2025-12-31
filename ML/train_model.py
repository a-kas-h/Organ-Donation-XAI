import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostRegressor
import joblib
import warnings
warnings.filterwarnings("ignore")

# 1️⃣ Load dataset
df = pd.read_csv("data/kidney_dataset.csv")

# 2️⃣ Feature selection
base_features = [
    "Patient_Age",
    "Patient_BMI",
    "Patient_Weight",
    "Biological_Markers",
    "Donor_Age",
    "Donor_Weight",
    "RealTime_Organ_HealthScore",
    "Risk_Score"
]

# 3️⃣ Feature engineering
df["Age_Difference"] = abs(df["Patient_Age"] - df["Donor_Age"])
df["Weight_Difference"] = abs(df["Patient_Weight"] - df["Donor_Weight"])
df["BMI_Age_Interaction"] = df["Patient_BMI"] * df["Patient_Age"]
df["Health_Donor_Score"] = df["RealTime_Organ_HealthScore"] * (1 - df["Biological_Markers"]/10)
df["Age_Risk_Interaction"] = df["Patient_Age"] * df["Risk_Score"]

engineered_features = [
    "Age_Difference",
    "Weight_Difference",
    "BMI_Age_Interaction",
    "Health_Donor_Score",
    "Age_Risk_Interaction"
]

features = base_features + engineered_features
target = "Predicted_Survival_Chance"

X = df[features]
y = df[target]

# 4️⃣ Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_scaled = pd.DataFrame(X_scaled, columns=features)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

print("\n🔍 Training 7 Different Regressors with Optimization\n")

# 5️⃣ Model definitions with tuned parameters
models_dict = {}

# GradientBoosting (best so far)
print("Training GradientBoosting...")
gb_model = GradientBoostingRegressor(
    n_estimators=150,
    learning_rate=0.01,
    max_depth=3,
    min_samples_split=7,
    min_samples_leaf=3,
    subsample=0.9,
    random_state=42
)
models_dict["GradientBoosting"] = gb_model

# RandomForest
print("Training RandomForest...")
rf_model = RandomForestRegressor(
    n_estimators=200,
    max_depth=12,
    max_features='log2',
    min_samples_leaf=4,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)
models_dict["RandomForest"] = rf_model

# ExtraTrees
print("Training ExtraTrees...")
et_model = ExtraTreesRegressor(
    n_estimators=250,
    max_depth=15,
    min_samples_leaf=2,
    min_samples_split=3,
    random_state=42,
    n_jobs=-1
)
models_dict["ExtraTrees"] = et_model

# XGBoost ⭐ NEW
print("Training XGBoost...")
xgb_model = xgb.XGBRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=5,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    n_jobs=-1,
    verbosity=0
)
models_dict["XGBoost"] = xgb_model

# LightGBM ⭐ NEW
print("Training LightGBM...")
lgb_model = lgb.LGBMRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=5,
    num_leaves=31,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    n_jobs=-1,
    verbose=-1
)
models_dict["LightGBM"] = lgb_model

# CatBoost ⭐ NEW
print("Training CatBoost...")
cat_model = CatBoostRegressor(
    iterations=200,
    learning_rate=0.05,
    depth=5,
    subsample=0.8,
    random_state=42,
    verbose=0
)
models_dict["CatBoost"] = cat_model

# 6️⃣ Evaluation function
def evaluate_model(model, name):
    model.fit(X_train, y_train)

    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    r2_train = r2_score(y_train, y_pred_train)
    r2_test = r2_score(y_test, y_pred_test)
    mae = mean_absolute_error(y_test, y_pred_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))

    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')

    print(f"\n📊 {name}:")
    print(f"  Train R²: {r2_train:.4f}")
    print(f"  Test R² : {r2_test:.4f} ⭐")
    print(f"  MAE     : {mae:.2f}%")
    print(f"  RMSE    : {rmse:.2f}%")
    print(f"  CV R² Mean: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    return {'model': model, 'r2': r2_test, 'mae': mae, 'rmse': rmse, 'name': name}

results = []
for name, model in models_dict.items():
    results.append(evaluate_model(model, name))

# 7️⃣ Compare and select best model
print("\n" + "="*70)
print("🏆 MODEL COMPARISON (Ranked by Test R²):")
print("="*70)

sorted_results = sorted(results, key=lambda x: x['r2'], reverse=True)
for rank, result in enumerate(sorted_results, 1):
    print(f"{rank}. {result['name']:20s} | R²: {result['r2']:.4f} | MAE: {result['mae']:.2f}% | RMSE: {result['rmse']:.2f}%")

best_result = sorted_results[0]
best_model = best_result['model']
best_name = best_result['name']

print(f"\n✅ Best Model: {best_name} (R² = {best_result['r2']:.4f})")

# 8️⃣ Feature importance (if available)
try:
    feature_importance = pd.DataFrame({
        "Feature": features,
        "Importance": best_model.feature_importances_
    }).sort_values("Importance", ascending=False)

    print("\n🎯 Top 10 Most Important Features:")
    print(feature_importance.head(10).to_string(index=False))
except:
    print("\n⚠️ Feature importance not available for this model type")

# 9️⃣ Save best model
joblib.dump(best_model, "models/kidney_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")
joblib.dump(features, "models/features.pkl")

print("\n💾 Best model saved successfully")

# 🔟 Test prediction
test_record = X.iloc[0].values.reshape(1, -1)
test_record_scaled = scaler.transform(test_record)
predicted_survival = best_model.predict(test_record_scaled)[0]

print("\n🧪 Test Record Prediction")
print(f"Predicted Survival Chance: {predicted_survival:.2f}%")
