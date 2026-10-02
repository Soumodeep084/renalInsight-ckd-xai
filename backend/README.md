# RenalInsight CKD Prediction & Explainable AI (XAI) Backend

Production-ready FastAPI backend for Chronic Kidney Disease (CKD) risk evaluation and local biomarker attribution powered by Tree SHAP (SHapley Additive exPlanations) and a Decision Tree Classifier trained on the UCI 336 Dataset (400 records, 24 raw features).

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.12+
- [`uv`](https://docs.astral.sh/uv/) package manager

### 2. Run the API Server
```bash
# Navigate to backend directory
cd backend

# Start development server with hot-reload
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The server will start at `http://127.0.0.1:8000`.

### 3. Interactive Documentation
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **OpenAPI Schema**: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status, metadata & navigation links |
| `GET` | `/health` | Application health and model readiness check |
| `GET` | `/model-info` | Model metadata, evaluation metrics, and feature lists |
| `POST` | `/predict` | Machine learning inference + Tree SHAP local explanations |

---

## 🔬 Sample Prediction Request (`POST /predict`)

```json
{
  "age": 48.0,
  "bp": 80.0,
  "sg": 1.020,
  "al": 1.0,
  "su": 0.0,
  "rbc": "normal",
  "pc": "normal",
  "pcc": "notpresent",
  "ba": "notpresent",
  "bgr": 121.0,
  "bu": 36.0,
  "sc": 1.2,
  "sod": 138.0,
  "pot": 4.4,
  "hemo": 15.4,
  "pcv": 44.0,
  "wbcc": 7800.0,
  "rbcc": 5.2,
  "htn": "yes",
  "dm": "yes",
  "cad": "no",
  "appet": "good",
  "pe": "no",
  "ane": "no"
}
```

### Sample Prediction Response
```json
{
  "prediction": "CKD",
  "probability": 100.0,
  "not_ckd_probability": 0.0,
  "risk_level": "High",
  "model_name": "Decision Tree (XAI-Enabled)",
  "explainability_method": "Tree SHAP (SHapley Additive exPlanations)",
  "timestamp": "2026-10-02T16:15:11.834000Z",
  "increasing_factors": [
    {
      "feature": "al",
      "display_feature": "Albumin: 1.0 (al_1.0)",
      "value": "1.0",
      "shap_value": 0.38,
      "direction": "increasing",
      "category": "Kidney",
      "plain_explanation": "Detectable protein in the urine indicates early filtration stress.",
      "medical_explanation": "Albuminuria signifies compromised podocyte slit diaphragm integrity.",
      "unit": "scale 0-5"
    }
  ],
  "decreasing_factors": [],
  "all_factors": []
}
```

---

## 🧪 Running Tests

```bash
uv run python tests/test_endpoints.py
```

---

## 📂 Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py       # App configuration and CORS
│   ├── schemas.py      # Pydantic validation (24 features) & response models
│   ├── prediction.py   # Model loading, inference & Tree SHAP explainability
│   └── main.py         # FastAPI application, routes, and lifespan
├── models/
│   ├── final_model.joblib          # Trained Decision Tree Pipeline
│   ├── shap_explainer.joblib       # Serialized TreeExplainer
│   ├── feature_names.joblib        # 34 Encoded feature column list
│   └── model_metadata.json         # Evaluation metrics (96.25% test accuracy)
├── tests/
│   └── test_endpoints.py
├── pyproject.toml
└── README.md
```
