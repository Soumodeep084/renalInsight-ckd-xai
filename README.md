# RenalInsight: An Explainable Machine Learning-Based System for Chronic Kidney Disease Prediction and Risk Analysis

[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.2.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6.1-F7931E?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![SHAP](https://img.shields.io/badge/SHAP-0.52.0-FF6F00?style=flat)](https://shap.readthedocs.io)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview

**RenalInsight** is an end-to-end, clinical-grade Explainable AI (XAI) academic prototype designed to predict the presence and risk of **Chronic Kidney Disease (CKD)** and demystify machine learning decisions for both clinicians and everyday non-medical users.

Rather than acting as an opaque "black-box" classifier, RenalInsight couples a validated machine learning pipeline (**Decision Tree Classifier**) trained on the standard **UCI Chronic Kidney Disease Dataset (UCI ID: 336)** with **Tree SHAP (SHapley Additive exPlanations)**. For every prediction, the platform delivers quantitative feature attribution alongside **Dual Explanations**:
1. **General Explanations:** Plain-language, jargon-free explanations designed for patients and non-specialists.
2. **Medical Explanations:** Clinically rigorous, KDIGO-aligned nephrology rationales accessible via expandable details for clinicians and researchers.

---

## 2. Problem Statement

Chronic Kidney Disease (CKD) is characterized by a gradual loss of renal function. Early detection is critical to prevent progression toward End-Stage Renal Disease (ESRD) and cardiovascular morbidity. However:
- Early-stage CKD is frequently asymptomatic.
- Traditional clinical workflows rely on manual threshold evaluations across numerous lab tests, urinalysis parameters, and comorbidities.
- Conventional AI/ML diagnostic tools often operate as "black boxes," offering high predictive accuracy without transparent interpretability, limiting trust, safety, and clinical adoption.

---

## 3. Objectives

- **Accurate Risk Assessment:** Train and validate an interpretable machine learning classifier to predict CKD presence with high sensitivity, specificity, and ROC-AUC.
- **24-Feature Validated Input Schema:** Evaluate across 24 standardized clinical biomarkers (14 continuous/discrete laboratory tests and 10 categorical/symptom indicators).
- **Local & Global Explainability:** Integrate Tree SHAP to quantify the exact marginal contribution of each patient biomarker toward the predicted outcome.
- **Accessible Dual-Tier Interpretation:** Bridge the clinical communication gap by generating beginner-friendly general explanations alongside detailed medical explanations.
- **Production-Ready Architecture:** Provide a decoupled FastAPI REST backend and a responsive, high-performance React + TypeScript frontend.

---

## 4. Key Features

- **24-Feature Validated Inference:** Evaluates exactly 24 standardized laboratory, urinalysis, hemodynamics, and symptom features (encoding into 34 one-hot transformed features).
- **Risk Stratification & Probability Score:** Computes calibrated continuous probability metrics (`0.00%` – `100.00%`) categorized into **Low**, **Moderate**, and **High** risk levels.
- **Tree SHAP Feature Attribution:** Calculates exact direction (*"Pushes toward CKD"* vs. *"Pushes toward Not CKD"*) and importance magnitude for every input factor.
- **Dual Explanation Engine:**
  - **General Mode:** Intuitive plain-English explanation visible by default.
  - **Medical Mode:** Detailed nephrological mechanism accessible via an expandable toggle.
- **Interactive 24-Feature & SHAP Guide (`/guide`):** Searchable, categorized dictionary of all 24 features with normal physiological ranges, units, and clinical significance.
- **Interactive Clinical Simulator:** Preloaded test presets (*High-Risk CKD*, *Healthy / Low Risk*, *Borderline Case*) for instant verification.
- **Responsive Clinical Dashboard:** Built with Tailwind CSS v4, Lucide icons, and Recharts interactive visualizations.

---

## 5. System Architecture & Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE (React)                        │
│   • Dashboard (/)        • Prediction Form (/predict)                  │
│   • Results (/results)   • 24-Feature & SHAP Guide (/guide)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP POST /predict (JSON Payload)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND SERVICE                         │
│   • Request Validation (Pydantic Schema across 24 features)            │
│   • Numeric / Categorical Parsing & Imputation Pipeline                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      PREPROCESSING PIPELINE                            │
│   • ColumnTransformer (34 output columns):                             │
│     - Numeric Features (14): SimpleImputer(median) + StandardScaler    │
│     - Categorical Features (10): SimpleImputer(mode) + OneHotEncoder   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Transformed Feature Matrix (34 dims)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        MACHINE LEARNING INFERENCE                      │
│   • DecisionTreeClassifier(max_depth=5, min_samples_leaf=2)            │
│   • Output: Prediction ("CKD" / "NOT CKD") + Probability (%)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         SHAP EXPLAINABILITY ENGINE                     │
│   • shap.TreeExplainer (Trained on Decision Tree)                      │
│   • Local feature attribution scores for positive class (CKD)          │
│   • Partition into Increasing Factors (+) and Decreasing Factors (-)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Structured Response JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND ENRICHMENT & PRESENTATION                 │
│   • Dual Explanation Engine (Plain English + Medical Nephrology)       │
│   • Influence Strength Mapping (Strong / Moderate / Mild)              │
│   • Dynamic Recharts Visualizations & Waterfall Attribution Cards      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Dataset

- **Source:** [UCI Machine Learning Repository](https://archive.ics.uci.edu)
- **Dataset ID:** `336`
- **Dataset Name:** *Chronic Kidney Disease Dataset* (Apollo Hospitals)
- **Size:** 400 patient records (250 CKD, 150 Not CKD).
- **Target Variable:** `class` (`ckd` / `notckd`).

---

## 7. Model Features (24 Raw Features)

The trained model utilizes exactly **24 raw clinical features** (14 numeric and 10 categorical):

### Demographics & Vitals (2 Features)
| Feature Key | Display Name | Type | Normal Range / Allowed Values | Unit |
|-------------|--------------|------|-------------------------------|------|
| `age` | Patient Age | Numeric | 1 – 100 | years |
| `bp` | Blood Pressure | Numeric | 60 – 120 (Normal) | mm Hg |

### Urinalysis & Kidney Function (7 Features)
| Feature Key | Display Name | Type | Normal Range / Allowed Values | Unit |
|-------------|--------------|------|-------------------------------|------|
| `sg` | Specific Gravity | Numeric | 1.005, 1.010, 1.015, 1.020, 1.025 | — |
| `al` | Albumin (Albuminuria) | Numeric | 0, 1, 2, 3, 4, 5 (0 = Normal) | scale 0–5 |
| `su` | Sugar (Glucosuria) | Numeric | 0, 1, 2, 3, 4, 5 (0 = Normal) | scale 0–5 |
| `rbc` | Red Blood Cells in Urine | Categorical | `normal`, `abnormal` | — |
| `pc` | Pus Cells in Urine | Categorical | `normal`, `abnormal` | — |
| `pcc` | Pus Cell Clumps | Categorical | `notpresent`, `present` | — |
| `ba` | Bacteria in Urine | Categorical | `notpresent`, `present` | — |

### Serum Blood Biochemistry & Hematology (9 Features)
| Feature Key | Display Name | Type | Normal Range / Allowed Values | Unit |
|-------------|--------------|------|-------------------------------|------|
| `bgr` | Blood Glucose Random | Numeric | 70 – 125 | mg/dL |
| `bu` | Blood Urea | Numeric | 10 – 50 | mg/dL |
| `sc` | Serum Creatinine | Numeric | 0.6 – 1.2 | mg/dL |
| `sod` | Serum Sodium | Numeric | 135 – 145 | mEq/L |
| `pot` | Serum Potassium | Numeric | 3.5 – 5.0 | mEq/L |
| `hemo` | Hemoglobin | Numeric | 12.0 – 17.5 | g/dL |
| `pcv` | Packed Cell Volume (Hematocrit) | Numeric | 36 – 50 | % |
| `wbcc` | White Blood Cell Count | Numeric | 4,000 – 11,000 | cells/cumm |
| `rbcc` | Red Blood Cell Count | Numeric | 4.2 – 5.9 | millions/cmm |

### Medical History & Clinical Symptoms (6 Features)
| Feature Key | Display Name | Type | Allowed Values |
|-------------|--------------|------|----------------|
| `htn` | Hypertension | Categorical | `no`, `yes` |
| `dm` | Diabetes Mellitus | Categorical | `no`, `yes` |
| `cad` | Coronary Artery Disease | Categorical | `no`, `yes` |
| `appet` | Appetite Status | Categorical | `good`, `poor` |
| `pe` | Pedal Edema | Categorical | `no`, `yes` |
| `ane` | Anemia | Categorical | `no`, `yes` |

---

## 8. Machine Learning & Model Performance

### Trained Model
- **Algorithm:** `DecisionTreeClassifier`
- **Hyperparameters:** `max_depth=5`, `min_samples_leaf=2`, `random_state=42`
- **Data Preprocessing:** Missing-value imputation (`median` for numeric, `most_frequent` for categorical), standard scaling, and one-hot encoding across 34 feature dimensions.

### Model Evaluation (Test Set: 80 Records)
| Metric | Value |
|:-------|:-----:|
| **Accuracy** | **0.9625 (96.25%)** |
| **Precision (CKD)** | **0.9630** |
| **Recall / Sensitivity (CKD)** | **0.9811** |
| **F1-Score (CKD)** | **0.9720** |
| **ROC-AUC** | **0.9535** |

---

## 9. Explainable AI (SHAP) Implementation

### Tree SHAP Mechanics
SHAP (**SHapley Additive exPlanations**) computes exact local game-theoretic contributions ($\phi_i$) for tree-based models:

$$\text{Model Output} = \phi_0 + \sum_{i=1}^{M} \phi_i$$

### Understanding SHAP Values
- **Positive SHAP ($\phi_i > 0$):** Pushes the prediction toward **CKD** (increases risk). Rendered with red/rose badges.
- **Negative SHAP ($\phi_i < 0$):** Pushes the prediction toward **Not CKD** (protective/healthy). Rendered with emerald/green badges.
- **Influence Strength:**
  - **Strong Influence:** $|\phi_i| \ge 0.15$
  - **Moderate Influence:** $0.04 \le |\phi_i| < 0.15$
  - **Mild Influence:** $|\phi_i| < 0.04$

### Dual-Tier Explanation Engine
1. **General Explanation (Default):**
   > *Example (Hemoglobin = 9.5 g/dL):* “Low hemoglobin (anemia) is common when kidneys cannot produce enough erythropoietin, so this factor increased CKD risk.”
2. **Medical Explanation (Expandable Toggle):**
   > *Example (Hemoglobin = 9.5 g/dL):* “Impaired renal peritubular capillary production of erythropoietin (EPO) induces normochromic normocytic anemia, a classic indicator of decreased functional nephron mass.”

---

## 10. Backend Architecture (FastAPI)

The backend is built with **FastAPI** (`Python 3.12+`) and uses strict Pydantic v2 schemas:

### Core API Endpoints

| Method | Endpoint | Description | Response Model |
|:-------|:---------|:------------|:---------------|
| `GET` | `/` | API status, root info, and interactive docs links | `ApiStatusResponse` |
| `GET` | `/health` | Server operational health & model load verification | `HealthResponse` |
| `GET` | `/model-info` | Metadata, test evaluation metrics, and feature list | `ModelInfoResponse` |
| `POST` | `/predict` | Primary inference and SHAP explainability endpoint | `PredictionResponse` |
| `GET` | `/docs` | Interactive Swagger UI API documentation | HTML |
| `GET` | `/redoc` | ReDoc API documentation | HTML |

---

## 11. Frontend Architecture (React + Vite)

The frontend is built with **React 19**, **TypeScript**, and **Tailwind CSS v4**:

### Application Pages & Routes

| Route | Page Component | Purpose |
|:------|:---------------|:--------|
| `/` | `DashboardPage.tsx` | Platform overview, quick stats, system architecture, and CTAs |
| `/predict` | `PredictionPage.tsx` | 24-feature structured input form with preset loader |
| `/results` | `ResultsPage.tsx` | Risk badge, probability meter, waterfall SHAP cards, and dual explanations |
| `/guide` | `GuidePage.tsx` | Beginner-friendly 24-feature directory and "How to Read SHAP" guide |
| `/about` | `AboutPage.tsx` | Research methodology, UCI dataset citation, and architecture notes |

---

## 12. Project Structure

```
renalInsight-ckd-xai/
├── README.md                               # Master project documentation
├── LICENSE                                 # MIT License
├── notebooks/
│   └── RenalInsight_Train_DecisionTree_UCI.ipynb  # Model training & validation notebook
├── backend/
│   ├── pyproject.toml                      # Python package configuration (uv / pip)
│   ├── uv.lock                             # Locked dependency graph
│   ├── models/                             # Serialized ML artifacts
│   │   ├── final_model.joblib              # Scikit-learn Pipeline (Preprocessor + DecisionTree)
│   │   ├── shap_explainer.joblib           # Serialized TreeExplainer instance
│   │   ├── feature_names.joblib            # Encoded feature column list (34 features)
│   │   └── model_metadata.json             # Training metrics & parameter metadata
│   └── app/
│       ├── main.py                         # FastAPI application entry & route definitions
│       ├── config.py                       # Pydantic BaseSettings and environment config
│       ├── schemas.py                      # Pydantic request/response validation models (24 features)
│       └── prediction.py                   # Inference pipeline & Tree SHAP factor generation
└── frontend/
    ├── package.json                        # Node.js dependencies & scripts
    ├── vite.config.ts                      # Vite build configuration
    ├── index.html                          # HTML root template
    └── src/
        ├── App.tsx                         # Main React Router setup
        ├── main.tsx                        # React DOM root mounting
        ├── index.css                       # Global styles & Tailwind CSS directives
        ├── types/
        │   └── ckd.ts                      # TypeScript interfaces (24 features, SHAP factors)
        ├── services/
        │   └── predictionService.ts        # REST API client & response normalizer
        ├── data/
        │   ├── featureGuideData.ts         # 24-feature dictionary & Dual Explanation logic
        │   ├── formOptions.ts              # Input options & range helpers
        │   └── patientPresets.ts           # Clinical demo presets (CKD, Healthy, Borderline)
        ├── components/
        │   ├── common/                     # Header, Sidebar, Footer, Layout, Toast
        │   ├── form/                       # 24-feature clinical input components (4 sections)
        │   ├── result/                     # PredictionCard, ShapExplanation, MetricCard
        │   └── guide/                      # CkdGuideSection accordion & SHAP tutorial
        └── pages/
            ├── DashboardPage.tsx           # Landing & Overview page
            ├── PredictionPage.tsx          # Clinical input form page
            ├── ResultsPage.tsx             # Detailed XAI results page
            ├── GuidePage.tsx               # Standalone 24-Feature & SHAP Guide
            └── AboutPage.tsx               # Model methodology & citations
```

---

## 13. Installation & Setup

### Prerequisites
- **Python:** `3.12+` (with [`uv`](https://docs.astral.sh/uv/) recommended)
- **Node.js:** `18.0+` or `20.0+` (with `npm`)

### 1. Clone the Repository
```bash
git clone https://github.com/Soumodeep084/renalInsight-ckd-xai.git
cd renalInsight-ckd-xai
```

### 2. Backend Setup
Using `uv` (recommended):
```bash
cd backend
uv sync
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 14. Running the Project

### Start Backend API Server
```bash
cd backend
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

### Start Frontend Development Server
In a new terminal:
```bash
cd frontend
npm run dev
```
- Web Application URL: `http://localhost:3000`

---

## 15. API Usage

### Endpoint: `POST /predict`

#### Sample Request Body (24 Raw Features):
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

#### Sample Response Body:
```json
{
  "prediction": "CKD",
  "probability": 100.0,
  "not_ckd_probability": 0.0,
  "risk_level": "High",
  "model_name": "Decision Tree (XAI-Enabled)",
  "explainability_method": "Tree SHAP (SHapley Additive exPlanations)",
  "timestamp": "2026-09-29T21:00:00.000Z",
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

## 16. Model Files & Runtime Artifacts

The application loads 4 runtime model artifacts on startup from `backend/models/`:

1. `final_model.joblib`: Complete trained Scikit-Learn `Pipeline` containing `ColumnTransformer` (SimpleImputer + StandardScaler + OneHotEncoder) and tuned `DecisionTreeClassifier`.
2. `shap_explainer.joblib`: Pre-initialized `TreeExplainer` fitted on the trained Decision Tree.
3. `feature_names.joblib`: List of 34 transformed encoded feature names for exact attribution alignment.
4. `model_metadata.json`: JSON metadata recording training accuracy, ROC-AUC, sample size, and feature dimensions.

---

## 17. Limitations

- **Sample Size:** The UCI 336 dataset comprises 400 patient instances; evaluation on larger multi-institutional cohorts is advised prior to clinical deployment.
- **Cross-Sectional Nature:** Features capture single-encounter laboratory snapshots rather than longitudinal trends over time.
- **Academic Scope:** The tool is designed strictly as an academic research and explainability demonstration prototype.

---

## 18. Academic Disclaimer

> **IMPORTANT:**  
> **RenalInsight is an academic research prototype. It is NOT a certified medical device and does NOT provide clinical diagnosis, medical decision support, or disease progression staging.** Predictions and SHAP explanations generated by this system are designed strictly for educational and algorithmic transparency demonstration.

---

## 19. References & Dataset Citation

1. **UCI Machine Learning Repository:**  
   *Chronic Kidney Disease Dataset* (Dataset ID: 336).  
   URL: [https://archive.ics.uci.edu/dataset/336/chronic_kidney_disease](https://archive.ics.uci.edu/dataset/336/chronic_kidney_disease)
2. **SHAP (SHapley Additive exPlanations):**  
   Lundberg, S. M., & Lee, S.-I. (2017). *A Unified Approach to Interpreting Model Predictions.* Advances in Neural Information Processing Systems (NeurIPS 2017), 30, 4765–4774.
