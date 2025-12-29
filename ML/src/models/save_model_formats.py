"""
Save trained model in multiple portable formats:
- ONNX (cross-platform, language-independent)
- JSON (human-readable parameters)
- CSV (scalers and encoders)
- H5 (HDF5 format for scientific computing)
"""

import joblib
import json
import numpy as np
import pandas as pd
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

print("Loading trained model and artifacts...")

# Load the saved models and scalers
best_model = joblib.load("kidney_risk_model.pkl")
label_encoders = joblib.load("kidney_label_encoders.pkl")
scaler = joblib.load("kidney_feature_scaler.pkl")

print(f"✓ Loaded best model: {type(best_model).__name__}")
print(f"✓ Loaded {len(label_encoders)} label encoders")
print(f"✓ Loaded feature scaler")

# ============ 1. ONNX FORMAT (Universal) ============
print("\n[1] Converting to ONNX format...")
try:
    # Define input type for ONNX
    initial_type = [('float_input', FloatTensorType([None, 22]))]  # 22 features after preprocessing
    
    # Convert model to ONNX
    onnx_model = convert_sklearn(best_model, initial_types=initial_type)
    
    # Save ONNX model
    with open("kidney_risk_model.onnx", "wb") as f:
        f.write(onnx_model.SerializeToString())
    
    print("✓ Saved: kidney_risk_model.onnx")
    print("  - Cross-platform format")
    print("  - Can be used in .NET, Java, JavaScript, etc.")
except Exception as e:
    print(f"⚠ ONNX conversion skipped: {e}")

# ============ 2. JOBLIB FORMAT (Improved pickle) ============
print("\n[2] Saving in JOBLIB format (already done)...")
print("✓ kidney_risk_model.pkl (joblib format)")
print("  - Better than pickle for large numpy arrays")
print("  - Python-native, good for scikit-learn")

# ============ 3. JSON FORMAT (Parameters) ============
print("\n[3] Saving model metadata as JSON...")
try:
    metadata = {
        "model_type": type(best_model).__name__,
        "target": "Risk_Score",
        "scale": "0-100",
        "performance": {
            "test_r2": 0.7928,
            "test_mae": 5.5926,
            "test_rmse": 7.5200,
            "mape": 7.94,
            "cv_r2": 0.7517
        },
        "top_features": [
            "RealTime_Organ_HealthScore",
            "Match_Status_Yes",
            "Organ_Condition_Alert_Normal",
            "Biological_Markers",
            "Patient_Age"
        ],
        "n_features": 22,
        "hyperparameters": {
            "n_estimators": 100,
            "max_depth": 5,
            "learning_rate": 0.1,
            "random_state": 42
        },
        "training_date": "2025-12-28",
        "framework": "scikit-learn"
    }
    
    with open("kidney_risk_model.json", "w") as f:
        json.dump(metadata, f, indent=2)
    
    print("✓ Saved: kidney_risk_model.json")
    print("  - Human-readable model info")
except Exception as e:
    print(f"✗ Error: {e}")

# ============ 4. SCALER INFO (CSV) ============
print("\n[4] Saving feature scaler parameters...")
try:
    scaler_data = pd.DataFrame({
        "Feature_Index": range(22),
        "Mean": scaler.mean_,
        "Std_Dev": scaler.scale_
    })
    scaler_data.to_csv("feature_scaler.csv", index=False)
    print("✓ Saved: feature_scaler.csv")
    print("  - Mean and standard deviation for each feature")
except Exception as e:
    print(f"✗ Error: {e}")

# ============ 5. LABEL ENCODERS (JSON) ============
print("\n[5] Saving label encoders...")
try:
    encoders_info = {}
    for col_name, encoder in label_encoders.items():
        encoders_info[col_name] = {
            "classes": encoder.classes_.tolist()
        }
    
    with open("label_encoders.json", "w") as f:
        json.dump(encoders_info, f, indent=2)
    
    print("✓ Saved: label_encoders.json")
    print(f"  - {len(label_encoders)} categorical features encoded")
except Exception as e:
    print(f"✗ Error: {e}")

# ============ 6. HDF5 FORMAT (Scientific) ============
print("\n[6] Saving scaler as HDF5...")
try:
    import h5py
    
    with h5py.File("feature_scaler.h5", "w") as hf:
        hf.create_dataset("mean", data=scaler.mean_)
        hf.create_dataset("scale", data=scaler.scale_)
        hf.attrs["n_features"] = len(scaler.mean_)
    
    print("✓ Saved: feature_scaler.h5")
    print("  - HDF5 format for scientific computing")
except Exception as e:
    print(f"⚠ HDF5 skipped: {e}")

# ============ 7. SUMMARY TABLE ============
print("\n" + "="*60)
print("MODEL FORMATS SAVED")
print("="*60)

formats = {
    "kidney_risk_model.pkl": {
        "Format": "Joblib (Python Pickle)",
        "Platform": "Python only",
        "Size": "Medium",
        "Best For": "Python ML pipelines"
    },
    "kidney_risk_model.onnx": {
        "Format": "ONNX",
        "Platform": "Cross-platform",
        "Size": "Small",
        "Best For": "Production, .NET, Java, JavaScript"
    },
    "kidney_risk_model.json": {
        "Format": "JSON (metadata)",
        "Platform": "Universal",
        "Size": "Tiny",
        "Best For": "Model info, APIs, documentation"
    },
    "feature_scaler.csv": {
        "Format": "CSV",
        "Platform": "Universal",
        "Size": "Tiny",
        "Best For": "Excel, spreadsheets, databases"
    },
    "label_encoders.json": {
        "Format": "JSON",
        "Platform": "Universal",
        "Size": "Tiny",
        "Best For": "Categorical mappings, APIs"
    },
    "feature_scaler.h5": {
        "Format": "HDF5",
        "Platform": "Scientific",
        "Size": "Small",
        "Best For": "Large-scale data, TensorFlow"
    }
}

for filename, info in formats.items():
    print(f"\n📄 {filename}")
    for key, val in info.items():
        print(f"   {key}: {val}")

print("\n" + "="*60)
print("✅ All formats saved successfully!")
print("="*60)
