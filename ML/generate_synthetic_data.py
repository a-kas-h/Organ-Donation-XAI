import pandas as pd
import numpy as np
import os

# Create data directory if it doesn't exist
if not os.path.exists('data'):
    os.makedirs('data')

def generate_synthetic_data(n_samples=5000):
    np.random.seed(42)

    # 1. Generate Basic Features
    patient_age = np.random.randint(18, 90, n_samples)
    patient_bmi = np.random.uniform(15, 40, n_samples)
    patient_weight = np.random.uniform(40, 150, n_samples)
    biological_markers = np.random.uniform(0, 10, n_samples)  # 0=Good, 10=Bad
    
    donor_age = np.random.randint(18, 80, n_samples)
    donor_weight = np.random.uniform(50, 120, n_samples)
    real_time_health_score = np.random.uniform(20, 100, n_samples) # 100=Great, 20=Poor
    risk_score = np.random.uniform(0, 10, n_samples) # 0=Low Risk, 10=High Risk

    # 2. Calculate Derived Metrics (logic mirror of training)
    age_diff = np.abs(patient_age - donor_age)
    weight_diff = np.abs(patient_weight - donor_weight)
    
    # 3. Calculate Survival Chance (Target) using explicit "Logic Rules" + Noise
    # Start with a base of 100%
    survival_chance = 100.0

    # Penalties
    # Age Difference: -0.5% for every year difference
    survival_chance -= (age_diff * 0.5)

    # Risk Score: -5% for every point of risk
    survival_chance -= (risk_score * 5.0)

    # Biological Markers: -3% for every point
    survival_chance -= (biological_markers * 3.0)

    # Donor Health: If health < 50, massive penalty
    # Map 20-100 score to a penalty
    # 100 -> 0 penalty, 20 -> -40 penalty
    health_penalty = (100 - real_time_health_score) * 0.5
    survival_chance -= health_penalty

    # BMI Penalty: If BMI > 30 or < 18, penalty
    bmi_penalty = np.where((patient_bmi > 30) | (patient_bmi < 18.5), 10, 0)
    survival_chance -= bmi_penalty

    # Weight Diff Penalty: -1% for every 10kg difference
    survival_chance -= (weight_diff / 10.0)

    # Add Random Noise (Gaussian)
    noise = np.random.normal(0, 5, n_samples)
    survival_chance += noise

    # Clip values to 0-100 range
    survival_chance = np.clip(survival_chance, 0, 100)

    # 4. Create DataFrame
    df = pd.DataFrame({
        "Patient_Age": patient_age,
        "Patient_BMI": patient_bmi,
        "Patient_Weight": patient_weight,
        "Biological_Markers": biological_markers,
        "Donor_Age": donor_age,
        "Donor_Weight": donor_weight,
        "RealTime_Organ_HealthScore": real_time_health_score,
        "Risk_Score": risk_score,
        "Predicted_Survival_Chance": survival_chance
    })

    # Save
    output_path = "data/improved_kidney_dataset.csv"
    df.to_csv(output_path, index=False)
    print(f"✅ Generated {n_samples} samples at {output_path}")
    
    # Show stats
    print("\nDataset Statistics:")
    print(df.describe())

if __name__ == "__main__":
    generate_synthetic_data()
