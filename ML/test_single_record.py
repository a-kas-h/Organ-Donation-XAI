import pandas as pd
import numpy as np
import joblib

# Load model, scaler, and features
model = joblib.load("models/kidney_model.pkl")
scaler = joblib.load("models/scaler.pkl")
features = joblib.load("models/features.pkl")

# Load dataset
df = pd.read_csv("data/kidney_dataset.csv")

# 1️⃣ Feature engineering (same as training)
df["Age_Difference"] = abs(df["Patient_Age"] - df["Donor_Age"])
df["Weight_Difference"] = abs(df["Patient_Weight"] - df["Donor_Weight"])
df["BMI_Age_Interaction"] = df["Patient_BMI"] * df["Patient_Age"]
df["Health_Donor_Score"] = df["RealTime_Organ_HealthScore"] * (1 - df["Biological_Markers"]/10)
df["Age_Risk_Interaction"] = df["Patient_Age"] * df["Risk_Score"]

X = df[features]

# 2️⃣ Custom input
custom_input = pd.DataFrame({
    "Patient_Age": [45],
    "Patient_BMI": [25.5],
    "Patient_Weight": [75],
    "Biological_Markers": [3.5],
    "Donor_Age": [28],
    "Donor_Weight": [70],
    "RealTime_Organ_HealthScore": [0.85],
    "Risk_Score": [15],
    "Age_Difference": [abs(45 - 28)],
    "Weight_Difference": [abs(75 - 70)],
    "BMI_Age_Interaction": [25.5 * 45],
    "Health_Donor_Score": [0.85 * (1 - 3.5/10)],
    "Age_Risk_Interaction": [45 * 15]
})

# 3️⃣ Scale and predict
custom_input_scaled = scaler.transform(custom_input)
predicted_survival = model.predict(custom_input_scaled)[0]

print("🧪 Single Record Prediction")
print("="*60)
print(f"Patient Age: 45 years")
print(f"Patient BMI: 25.5")
print(f"Patient Weight: 75 kg")
print(f"Biological Markers: 3.5")
print(f"Donor Age: 28 years")
print(f"Donor Weight: 70 kg")
print(f"Organ Health Score: 0.85")
print(f"Risk Score: 15")
print("="*60)
print(f"\n✅ Predicted Survival Chance: {predicted_survival:.2f}%\n")

# 4️⃣ Test on dataset records
print("="*70)
print("Testing with multiple dataset records:")
print("="*70)

errors = []

for i in range(min(10, len(df))):
    test_data = X.iloc[i:i+1]
    test_data_scaled = scaler.transform(test_data)
    pred = model.predict(test_data_scaled)[0]
    actual = df.iloc[i]["Predicted_Survival_Chance"]
    error = abs(pred - actual)
    errors.append(error)
    
    print(f"\nRecord {i+1}:")
    print(f"  Predicted: {pred:.2f}% | Actual: {actual:.2f}% | Error: {error:.2f}%")

mae = np.mean(errors)
rmse = np.sqrt(np.mean(np.array(errors)**2))

print(f"\n{'='*70}")
print(f"📊 Performance Metrics:")
print(f"  Mean Absolute Error (MAE): {mae:.2f}%")
print(f"  Root Mean Squared Error (RMSE): {rmse:.2f}%")
print(f"{'='*70}")
