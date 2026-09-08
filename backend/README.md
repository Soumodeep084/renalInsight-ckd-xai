# RenalInsight CKD Prediction & Explainable AI (XAI) Backend

Production-ready FastAPI backend for Chronic Kidney Disease (CKD) risk evaluation and local biomarker attribution powered by SHAP (SHapley Additive exPlanations).

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
uv run uvicorn app.main:app --reload
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
| `POST` | `/predict` | Machine learning inference + SHAP local explanations |

---

## 🔬 Sample Prediction Request (`POST /predict`)

```json
{
  "age": "59 - 66",
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
```

### Sample Prediction Response
```json
{
  "prediction": "NOT CKD",
  "probability": 12.41,
  "not_ckd_probability": 87.59,
  "risk_level": "Low",
  "model_name": "Logistic Regression (XAI-Enabled)",
  "explainability_method": "SHAP (SHapley Additive exPlanations)",
  "timestamp": "2026-09-07T16:15:11.834000Z",
  "increasing_factors": [ ... ],
  "decreasing_factors": [ ... ],
  "all_factors": [ ... ]
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
│   ├── schemas.py      # Pydantic validation & response models
│   ├── prediction.py   # Model loading, inference & SHAP explainability
│   └── main.py         # FastAPI application, routes, and lifespan
├── models/
│   ├── final_model.joblib
│   ├── shap_explainer.joblib
│   ├── feature_names.joblib
│   └── model_metadata.json
├── tests/
│   └── test_endpoints.py
├── pyproject.toml
└── README.md
```
