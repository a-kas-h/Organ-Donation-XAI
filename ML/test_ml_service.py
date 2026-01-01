import requests
import json

url = "http://127.0.0.1:8000/predict-match"

payload = {
    "donor": {
        "Donor_Age": 35,
        "Donor_Weight": 70.5
    },
    "recipient": {
        "Patient_Age": 40,
        "Patient_BMI": 25.0,
        "Patient_Weight": 75.0,
        "Biological_Markers": 5.0,
        "RealTime_Organ_HealthScore": 8.5,
        "Risk_Score": 2.0
    }
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
