import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

def test_api_suite():
    with TestClient(app) as client:
        # 1. Test GET /
        resp = client.get("/")
        print("\n=== GET / ===")
        print("Status:", resp.status_code)
        print("Body:", resp.json())
        assert resp.status_code == 200
        assert resp.json()["status"] == "active"
        assert "docs_url" in resp.json()

        # 2. Test GET /health
        resp = client.get("/health")
        print("\n=== GET /health ===")
        print("Status:", resp.status_code)
        print("Body:", resp.json())
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"
        assert resp.json()["model_loaded"] is True
        assert resp.json()["shap_loaded"] is True

        # 3. Test GET /model-info
        resp = client.get("/model-info")
        print("\n=== GET /model-info ===")
        print("Status:", resp.status_code)
        print("Body:", resp.json())
        assert resp.status_code == 200
        assert resp.json()["model_type"] == "Decision Tree"
        assert resp.json()["input_feature_count"] == 24
        assert resp.json()["encoded_feature_count"] == 34

        # 4. Test POST /predict (Low Risk / Healthy Patient)
        low_risk_payload = {
            "age": 35.0,
            "bp": 70.0,
            "sg": 1.025,
            "al": 0.0,
            "su": 0.0,
            "rbc": "normal",
            "pc": "normal",
            "pcc": "notpresent",
            "ba": "notpresent",
            "bgr": 95.0,
            "bu": 25.0,
            "sc": 0.8,
            "sod": 140.0,
            "pot": 4.2,
            "hemo": 16.0,
            "pcv": 48.0,
            "wbcc": 6500.0,
            "rbcc": 5.4,
            "htn": "no",
            "dm": "no",
            "cad": "no",
            "appet": "good",
            "pe": "no",
            "ane": "no"
        }
        resp = client.post("/predict", json=low_risk_payload)
        print("\n=== POST /predict (Low Risk - 24 Features) ===")
        print("Status:", resp.status_code)
        data = resp.json()
        print("Prediction:", data["prediction"])
        print("CKD Probability:", data["probability"])
        print("Risk Level:", data["risk_level"])
        print("Top Increasing Factors Count:", len(data["increasing_factors"]))
        print("Top Decreasing Factors Count:", len(data["decreasing_factors"]))
        assert resp.status_code == 200
        assert data["prediction"] == "NOT CKD"
        assert data["risk_level"] == "Low"
        assert len(data["decreasing_factors"]) > 0

        # 5. Test POST /predict (High Risk / CKD Patient)
        high_risk_payload = {
            "age": 65.0,
            "bp": 90.0,
            "sg": 1.010,
            "al": 3.0,
            "su": 2.0,
            "rbc": "abnormal",
            "pc": "abnormal",
            "pcc": "present",
            "ba": "present",
            "bgr": 220.0,
            "bu": 75.0,
            "sc": 4.5,
            "sod": 128.0,
            "pot": 5.8,
            "hemo": 8.5,
            "pcv": 28.0,
            "wbcc": 12500.0,
            "rbcc": 3.1,
            "htn": "yes",
            "dm": "yes",
            "cad": "yes",
            "appet": "poor",
            "pe": "yes",
            "ane": "yes"
        }
        resp = client.post("/predict", json=high_risk_payload)
        print("\n=== POST /predict (High Risk - 24 Features) ===")
        print("Status:", resp.status_code)
        data = resp.json()
        print("Prediction:", data["prediction"])
        print("CKD Probability:", data["probability"])
        print("Risk Level:", data["risk_level"])
        print("Top Increasing Factors Count:", len(data["increasing_factors"]))
        print("Top Decreasing Factors Count:", len(data["decreasing_factors"]))
        assert resp.status_code == 200
        assert data["prediction"] == "CKD"
        assert data["risk_level"] == "High"
        assert len(data["increasing_factors"]) > 0

        # 6. Test Validation Error handling
        resp = client.post("/predict", json={"age": "invalid_string_that_cannot_be_float"})
        print("\n=== POST /predict (Invalid Payload) ===")
        print("Status:", resp.status_code)
        assert resp.status_code == 422

    print("\n=======================================================")
    print("ALL API ENDPOINTS TESTED AND PASSED SUCCESSFULLY!")
    print("=======================================================")

if __name__ == "__main__":
    test_api_suite()
