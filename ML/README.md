Project layout (recommended)

- data/: raw and processed CSVs (keep `feature_scaler.csv`, `kidney dataset.csv` here)
- src/: Python package and scripts
  - src/models/: model training and inference modules (place `kidney_model.py`, `save_model_formats.py` or refactor into modules)
  - src/utils/: helper functions
- models/: serialized model artifacts (move `kidney_risk_model.json`, `kidney_risk_model.onnx`, `label_encoders.json` here)
- notebooks/: exploratory notebooks
- scripts/: small CLI scripts (e.g., `generate_risk_score.py`)
- tests/: unit and integration tests
- configs/: configuration files
- outputs/: generated outputs and reports

Recommended next steps

1. Move CSVs into `data/` and model artifacts into `models/`.
2. Move or refactor scripts into `src/` and `scripts/` as appropriate.
3. Update imports to use `src` package paths (e.g., `from src.models.kidney_model import ...`).

Example PowerShell move commands:

```powershell
Move-Item "feature_scaler.csv" "data/"
Move-Item "kidney dataset.csv" "data/"
Move-Item "kidney_risk_model.json" "models/"
Move-Item "kidney_risk_model.onnx" "models/"
Move-Item "label_encoders.json" "models/"
Move-Item "generate_risk_score.py" "scripts/"
Move-Item "kidney_model.py" "src/models/"
Move-Item "save_model_formats.py" "src/models/"
```

If you want, I can move the files and update imports for you.