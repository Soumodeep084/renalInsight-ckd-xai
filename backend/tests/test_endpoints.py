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
        assert resp.json()["model_type"] == "Logistic Regression"
        assert resp.json()["input_feature_count"] == 25
        assert resp.json()["encoded_feature_count"] == 108

        # 4. Test POST /predict (Low Risk Patient)
        low_risk_payload = {
            "age": "35 - 43",
            "bp_diastolic": 76.0,
            "bp_limit": "70 - 80",
            "sg": "1.020",
            "al": "Normal",
            "su": "Normal",
            "rbc": "Normal",
            "pc": "Normal",
            "pcc": "Not Present",
            "ba": "Not Present",
            "bgr": "< 112",
            "bu": "< 34",
            "sod": "138 - 143",
            "sc": "< 1.2",
            "pot": "3.5 - 4.5",
            "hemo": "13.9 - 15.2",
            "pcv": "41.3 - 45.2",
            "rbcc": "5.05 - 5.64",
            "wbcc": "4980 - 7360",
            "gfr": "≥ 90",
            "htn": "No",
            "dm": "No",
            "cad": "No",
            "appet": "Good",
            "pe": "No",
            "ane": "No",
            "stage": "Stage 1"
        }
        resp = client.post("/predict", json=low_risk_payload)
        print("\n=== POST /predict (Low Risk) ===")
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

        # 5. Test POST /predict (High Risk Patient)
        high_risk_payload = {
            "age": "≥ 74",
            "bp_diastolic": 96.0,
            "bp_limit": "≥ 90",
            "sg": "< 1.007",
            "al": "≥ 4",
            "su": "≥ 4",
            "rbc": "Abnormal",
            "pc": "Abnormal",
            "pcc": "Present",
            "ba": "Present",
            "bgr": "≥ 448",
            "bu": "≥ 160",
            "sod": "< 118",
            "sc": "≥ 7.1",
            "pot": "≥ 5.5",
            "hemo": "< 6.1",
            "pcv": "< 17.9",
            "rbcc": "< 2.69",
            "wbcc": "≥ 12120",
            "gfr": "< 15",
            "htn": "Yes",
            "dm": "Yes",
            "cad": "Yes",
            "appet": "Poor",
            "pe": "Yes",
            "ane": "Yes",
            "stage": "Stage 5"
        }
        resp = client.post("/predict", json=high_risk_payload)
        print("\n=== POST /predict (High Risk) ===")
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
        resp = client.post("/predict", json={"age": {"nested": "invalid"}})
        print("\n=== POST /predict (Invalid Payload) ===")
        print("Status:", resp.status_code)
        assert resp.status_code == 422
        print("Validation response:", resp.json())

    print("\n=======================================================")
    print("ALL API ENDPOINTS TESTED AND PASSED SUCCESSFULLY!")
    print("=======================================================")

if __name__ == "__main__":
    test_api_suite()
