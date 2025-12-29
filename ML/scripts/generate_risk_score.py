"""
Generate Risk_Score for kidney transplant dataset based on medical heuristics.
Risk factors include: age, BMI, organ health, match status, biological markers, etc.
"""

import pandas as pd
import numpy as np

# Load the existing dataset
df = pd.read_csv("kidney dataset.csv")

print("Generating Risk_Score based on medical heuristics...")
print(f"Dataset size: {len(df)} rows")

# Initialize Risk_Score (0-100 scale)
risk_scores = []

for idx, row in df.iterrows():
    risk = 50.0  # Start at baseline of 50
    
    # ============ PATIENT FACTORS ============
    patient_age = row['Patient_Age']
    patient_bmi = row['Patient_BMI']
    patient_blood = row['Patient_BloodType']
    diagnosis = row['Diagnosis_Result']
    bio_markers = row['Biological_Markers']
    
    # Age risk: Older patients have higher risk
    if patient_age < 18:
        risk -= 10  # Very low risk for young
    elif patient_age < 35:
        risk -= 5   # Low risk
    elif patient_age < 50:
        risk += 5   # Moderate risk
    elif patient_age < 65:
        risk += 15  # High risk
    else:
        risk += 25  # Very high risk for 65+
    
    # BMI risk: Extreme BMI increases risk
    if patient_bmi < 18.5:
        risk += 10  # Underweight risk
    elif patient_bmi < 25:
        risk -= 5   # Normal weight (lower risk)
    elif patient_bmi < 30:
        risk += 5   # Overweight
    elif patient_bmi < 35:
        risk += 15  # Obese class I
    else:
        risk += 25  # Obese class II+
    
    # Diagnosis severity risk
    if diagnosis == "CKD Stage 4":
        risk += 10
    elif diagnosis == "CKD Stage 5":
        risk += 20
    elif diagnosis == "ESRD":
        risk += 30
    
    # Biological markers (metabolic/immunological)
    # Higher markers indicate worse kidney function
    if bio_markers < 2:
        risk -= 5
    elif bio_markers < 4:
        risk += 0
    elif bio_markers < 6:
        risk += 10
    elif bio_markers < 8:
        risk += 15
    else:
        risk += 25
    
    # Blood type compatibility (ABO match advantage)
    if patient_blood == "O":
        risk -= 5  # O is universal donor-recipient advantage
    elif patient_blood == "AB":
        risk += 10  # AB has narrower compatibility
    
    # ============ DONOR FACTORS ============
    donor_age = row['Donor_Age']
    donor_bmi = row['Donor_Weight'] / ((row['Donor_Height'] / 100) ** 2) if 'Donor_Height' in df.columns else row['Donor_Weight'] / 70  # Estimate
    donor_blood = row['Donor_BloodType']
    organ_health = row['RealTime_Organ_HealthScore']
    organ_alert = row['Organ_Condition_Alert']
    
    # Donor age risk
    if donor_age > 65:
        risk += 15  # Older donors have higher transplant risk
    elif donor_age > 50:
        risk += 10
    
    # Organ health: Lower health score = higher risk
    organ_health = float(organ_health)
    if organ_health < 0.6:
        risk += 30  # Critical organ
    elif organ_health < 0.75:
        risk += 20  # Poor organ health
    elif organ_health < 0.85:
        risk += 10  # Fair organ health
    else:
        risk -= 5   # Good organ health
    
    # Organ alert status
    if organ_alert == "Critical":
        risk += 15
    elif organ_alert == "Normal":
        risk -= 10
    
    # ============ MATCH FACTORS ============
    match_status = row['Match_Status']
    donor_medical = row['Donor_Medical_Approval']
    
    # Blood type match
    if patient_blood == donor_blood:
        risk -= 10  # Perfect match
    elif patient_blood == "AB" or donor_blood == "O":
        risk -= 5   # Good match
    else:
        risk += 5   # Moderate match
    
    # Donor medical approval
    if donor_medical == "Yes":
        risk -= 5  # Medically cleared donor
    else:
        risk += 10  # Medical concerns
    
    # Overall match status
    if match_status == "Yes":
        risk -= 15  # Confirmed match
    else:
        risk += 10  # Unconfirmed/pending
    
    # ============ ORGAN STATUS ============
    organ_status = row['Organ_Status']
    
    if organ_status == "Transplanted":
        risk -= 10  # Successful transplant indicator
    elif organ_status == "Matched":
        risk += 5
    elif organ_status == "Pending":
        risk += 15
    
    # Clamp risk to 0-100 range
    risk = max(0, min(100, risk))
    
    # Add some realistic variance based on survival prediction
    survival_chance = row['Predicted_Survival_Chance']
    if survival_chance > 90:
        risk -= 5
    elif survival_chance < 70:
        risk += 10
    
    # Final clamp
    risk = max(0, min(100, risk))
    risk_scores.append(risk)

# Add Risk_Score column to dataframe
df['Risk_Score'] = risk_scores

# Reorder columns to put Risk_Score near the front
cols = df.columns.tolist()
if 'Risk_Score' in cols:
    cols.remove('Risk_Score')
cols.insert(9, 'Risk_Score')  # Insert after Organ_Status
df = df[cols]

# Save enhanced dataset
df.to_csv("kidney dataset.csv", index=False)

print(f"\n✓ Risk_Score generated successfully!")
print(f"Risk_Score statistics:")
print(f"  Min:  {df['Risk_Score'].min():.2f}")
print(f"  Max:  {df['Risk_Score'].max():.2f}")
print(f"  Mean: {df['Risk_Score'].mean():.2f}")
print(f"  Std:  {df['Risk_Score'].std():.2f}")
print(f"\nDataset saved with {len(df)} rows and {len(df.columns)} columns")
print(f"Columns: {list(df.columns)}")
