import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import joblib
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from shap import TreeExplainer

from app.config import settings
from app.schemas import (
    FeatureImportance,
    ModelInfoResponse,
    PatientInputSchema,
    PredictionResponse,
    ShapFactor,
)

logger = logging.getLogger("renalinsight.prediction")

# ---------------------------------------------------------------------------
# Feature Metadata Mappings for UCI 336 (24 Predictors)
# ---------------------------------------------------------------------------

FEATURE_CATEGORY_MAP: Dict[str, str] = {
    "age": "Demographic",
    "bp": "Demographic",
    "sg": "Kidney",
    "al": "Kidney",
    "su": "Kidney",
    "rbc": "Kidney",
    "pc": "Kidney",
    "pcc": "Kidney",
    "ba": "Kidney",
    "bgr": "Blood",
    "bu": "Blood",
    "sc": "Blood",
    "sod": "Blood",
    "pot": "Blood",
    "hemo": "Blood",
    "pcv": "Blood",
    "wbcc": "Blood",
    "rbcc": "Blood",
    "htn": "Symptom",
    "dm": "Symptom",
    "cad": "Symptom",
    "appet": "Symptom",
    "pe": "Symptom",
    "ane": "Symptom",
}

FEATURE_DISPLAY_NAMES: Dict[str, str] = {
    "age": "Age",
    "bp": "Blood Pressure",
    "sg": "Specific Gravity",
    "al": "Albumin",
    "su": "Sugar",
    "rbc": "Red Blood Cells (Urine)",
    "pc": "Pus Cell (Urine)",
    "pcc": "Pus Cell Clumps",
    "ba": "Bacteria (Urine)",
    "bgr": "Blood Glucose (Random)",
    "bu": "Blood Urea",
    "sc": "Serum Creatinine",
    "sod": "Sodium",
    "pot": "Potassium",
    "hemo": "Hemoglobin",
    "pcv": "Packed Cell Volume (Hematocrit)",
    "wbcc": "White Blood Cell Count",
    "rbcc": "Red Blood Cell Count",
    "htn": "Hypertension",
    "dm": "Diabetes Mellitus",
    "cad": "Coronary Artery Disease",
    "appet": "Appetite",
    "pe": "Pedal Edema",
    "ane": "Anemia",
}

FEATURE_UNITS: Dict[str, str] = {
    "age": "years",
    "bp": "mm Hg",
    "sg": "",
    "al": "scale (0-5)",
    "su": "scale (0-5)",
    "rbc": "",
    "pc": "",
    "pcc": "",
    "ba": "",
    "bgr": "mg/dL",
    "bu": "mg/dL",
    "sc": "mg/dL",
    "sod": "mEq/L",
    "pot": "mEq/L",
    "hemo": "g/dL",
    "pcv": "%",
    "wbcc": "cells/cumm",
    "rbcc": "M/cmm",
    "htn": "",
    "dm": "",
    "cad": "",
    "appet": "",
    "pe": "",
    "ane": "",
}

# Plain-English and Technical Nephrology Explanations
EXPLANATION_TEMPLATES: Dict[str, Dict[str, Dict[str, str]]] = {
    "hemo": {
        "increasing": {
            "plain": "Lower hemoglobin level pushed the model toward a higher CKD prediction, as low blood counts commonly accompany kidney filtration issues.",
            "medical": "Decreased hemoglobin indicates impaired renal parenchymal erythropoietin production, a hallmark sign of chronic kidney dysfunction."
        },
        "decreasing": {
            "plain": "Healthy hemoglobin level pushed the model toward a lower CKD prediction.",
            "medical": "Preserved hemoglobin concentrations suggest intact endocrine synthesis of erythropoietin by renal peritubular capillary cells."
        }
    },
    "sc": {
        "increasing": {
            "plain": "Elevated serum creatinine level pushed the model toward a higher CKD prediction, as creatinine builds up when kidneys filter less efficiently.",
            "medical": "Elevated serum creatinine reflects compromised glomerular clearance and declining glomerular filtration rate (GFR)."
        },
        "decreasing": {
            "plain": "Normal serum creatinine level pushed the model toward a lower CKD prediction, reflecting healthy waste clearance.",
            "medical": "Physiological serum creatinine concentrations correlate with adequate renal clearance and normal baseline glomerular filtration."
        }
    },
    "sg": {
        "increasing": {
            "plain": "Abnormal urine specific gravity pushed the model toward a higher CKD prediction, suggesting impaired urine concentration.",
            "medical": "Isosthenuria or reduced urine specific gravity reflects loss of renal medullary concentration gradient and tubular reabsorptive capability."
        },
        "decreasing": {
            "plain": "Normal urine specific gravity pushed the model toward a lower CKD prediction, showing normal urine concentrating ability.",
            "medical": "Physiological urinary specific gravity confirms intact renal tubular concentrating mechanisms and osmoregulation."
        }
    },
    "al": {
        "increasing": {
            "plain": "Presence of albumin in urine pushed the model toward a higher CKD prediction, indicating protein leakage through kidney filters.",
            "medical": "Albuminuria signifies disrupted glomerular filtration barrier integrity and podocyte slit diaphragm compromise."
        },
        "decreasing": {
            "plain": "Absence of albumin in urine pushed the model toward a lower CKD prediction.",
            "medical": "Negative albuminuria confirms preservation of glomerular basement membrane barrier selectivity."
        }
    },
    "su": {
        "increasing": {
            "plain": "Presence of sugar in urine pushed the model toward a higher CKD prediction.",
            "medical": "Glucosuria reflects tubular transport saturation or underlying metabolic dysregulation that strains renal microvasculature."
        },
        "decreasing": {
            "plain": "Absence of sugar in urine pushed the model toward a lower CKD prediction.",
            "medical": "Absence of glucosuria indicates intact tubular glucose reabsorption without excessive glycemic filter load."
        }
    },
    "rbcc": {
        "increasing": {
            "plain": "Reduced red blood cell count pushed the model toward a higher CKD prediction.",
            "medical": "Erythrocytopenia correlates with diminished renal endocrine stimulation and functional nephron loss."
        },
        "decreasing": {
            "plain": "Normal red blood cell count pushed the model toward a lower CKD prediction.",
            "medical": "Adequate circulating erythrocyte count reflects preserved renal hormonal axis and physiological hematopoiesis."
        }
    },
    "pcv": {
        "increasing": {
            "plain": "Lower packed cell volume (hematocrit) pushed the model toward a higher CKD prediction.",
            "medical": "Reduced hematocrit reflects normocytic normochromic anemia secondary to chronic renal parenchymal impairment."
        },
        "decreasing": {
            "plain": "Healthy packed cell volume pushed the model toward a lower CKD prediction.",
            "medical": "Normal hematocrit levels indicate preserved circulating red cell mass and kidney hormonal homeostasis."
        }
    },
    "bu": {
        "increasing": {
            "plain": "Elevated blood urea pushed the model toward a higher CKD prediction, reflecting retained nitrogen waste.",
            "medical": "Elevated blood urea nitrogen reflects decreased renal clearance of nitrogenous protein catabolites."
        },
        "decreasing": {
            "plain": "Normal blood urea level pushed the model toward a lower CKD prediction.",
            "medical": "Preserved blood urea levels confirm adequate glomerular clearance and nitrogen waste excretion."
        }
    },
    "bgr": {
        "increasing": {
            "plain": "Elevated blood glucose pushed the model toward a higher CKD prediction.",
            "medical": "Hyperglycemia induces advanced glycation end-products and glomerular hyperfiltration injury."
        },
        "decreasing": {
            "plain": "Normal blood glucose pushed the model toward a lower CKD prediction.",
            "medical": "Normoglycemia reduces microvascular stress and preserves renal capillary endothelium."
        }
    },
    "sod": {
        "increasing": {
            "plain": "Altered serum sodium pushed the model toward a higher CKD prediction, pointing to electrolyte imbalance.",
            "medical": "Dysnatremia reflects impaired tubular sodium handling and disrupted renal fluid homeostasis."
        },
        "decreasing": {
            "plain": "Normal serum sodium pushed the model toward a lower CKD prediction.",
            "medical": "Physiological serum sodium confirms intact renal electrolyte transport and volume regulation."
        }
    },
    "pot": {
        "increasing": {
            "plain": "Abnormal serum potassium pushed the model toward a higher CKD prediction.",
            "medical": "Hyperkalemia or electrolyte dysregulation occurs with diminished distal nephron potassium secretion."
        },
        "decreasing": {
            "plain": "Normal serum potassium pushed the model toward a lower CKD prediction.",
            "medical": "Preserved potassium homeostasis indicates functional tubular secretion and aldosterone-mediated clearance."
        }
    },
    "wbcc": {
        "increasing": {
            "plain": "Elevated white blood cell count pushed the model toward a higher CKD prediction, suggesting inflammation.",
            "medical": "Leukocytosis correlates with chronic systemic inflammation or active tubulointerstitial stress."
        },
        "decreasing": {
            "plain": "Normal white blood cell count pushed the model toward a lower CKD prediction.",
            "medical": "Physiological leukocyte levels indicate absence of acute systemic inflammatory response."
        }
    },
    "htn": {
        "increasing": {
            "plain": "Hypertension (high blood pressure) pushed the model toward a higher CKD prediction.",
            "medical": "Chronic systemic hypertension transmits elevated pressure to glomerular capillaries, promoting nephrosclerosis."
        },
        "decreasing": {
            "plain": "Absence of hypertension pushed the model toward a lower CKD prediction.",
            "medical": "Normotensive status protects renal microvasculature from barotrauma and arteriolar hyalinosis."
        }
    },
    "dm": {
        "increasing": {
            "plain": "Diabetes history pushed the model toward a higher CKD prediction.",
            "medical": "Diabetic microangiopathy causes glomerular basement membrane thickening and progressive mesangial expansion."
        },
        "decreasing": {
            "plain": "Absence of diabetes pushed the model toward a lower CKD prediction.",
            "medical": "Absence of chronic hyperglycemia significantly lowers the baseline risk of diabetic nephropathy."
        }
    },
    "cad": {
        "increasing": {
            "plain": "History of coronary artery disease pushed the model toward a higher CKD prediction.",
            "medical": "Cardiovascular disease shares common microvascular and atherosclerotic disease pathways with renal dysfunction."
        },
        "decreasing": {
            "plain": "Absence of coronary artery disease pushed the model toward a lower CKD prediction.",
            "medical": "Lack of overt systemic atherosclerosis correlates with preserved renal vascular perfusion."
        }
    },
    "appet": {
        "increasing": {
            "plain": "Poor appetite pushed the model toward a higher CKD prediction.",
            "medical": "Anorexia and uremic gastrointestinal symptoms reflect circulating uremic waste retention."
        },
        "decreasing": {
            "plain": "Good appetite pushed the model toward a lower CKD prediction.",
            "medical": "Preserved appetite indicates low circulating uremic toxin load and nutritional stability."
        }
    },
    "pe": {
        "increasing": {
            "plain": "Presence of pedal edema (leg swelling) pushed the model toward a higher CKD prediction.",
            "medical": "Peripheral pedal edema reflects impaired renal sodium excretion and extracellular fluid volume expansion."
        },
        "decreasing": {
            "plain": "Absence of pedal edema pushed the model toward a lower CKD prediction.",
            "medical": "Absence of dependent edema indicates effective volume regulation and sodium balance."
        }
    },
    "ane": {
        "increasing": {
            "plain": "Clinical anemia pushed the model toward a higher CKD prediction.",
            "medical": "Clinical anemia reflects diminished functional renal parenchyma and inadequate erythropoietin synthesis."
        },
        "decreasing": {
            "plain": "Absence of anemia pushed the model toward a lower CKD prediction.",
            "medical": "Normal red cell status indicates adequate endocrine signaling from functional renal interstitial cells."
        }
    },
    "rbc": {
        "increasing": {
            "plain": "Abnormal red blood cells in urine pushed the model toward a higher CKD prediction.",
            "medical": "Microscopic hematuria indicates mechanical disruption of the glomerular filtration barrier."
        },
        "decreasing": {
            "plain": "Normal red blood cell status in urine pushed the model toward a lower CKD prediction.",
            "medical": "Absence of urinary erythrocytes confirms intact glomerular basement membrane integrity."
        }
    },
    "pc": {
        "increasing": {
            "plain": "Abnormal pus cells in urine pushed the model toward a higher CKD prediction, suggesting urinary tract inflammation.",
            "medical": "Pyuria signifies active inflammation within the urinary tract or interstitial nephritis."
        },
        "decreasing": {
            "plain": "Normal pus cell levels in urine pushed the model toward a lower CKD prediction.",
            "medical": "Absence of pyuria indicates lack of active inflammatory cell recruitment into the renal tract."
        }
    },
    "pcc": {
        "increasing": {
            "plain": "Presence of pus cell clumps in urine pushed the model toward a higher CKD prediction.",
            "medical": "Pus cell clumping indicates concentrated inflammatory exudate within the renal collecting system."
        },
        "decreasing": {
            "plain": "Absence of pus cell clumps pushed the model toward a lower CKD prediction.",
            "medical": "Absence of leukocytic casts or clumps confirms non-inflammatory urinary sediment."
        }
    },
    "ba": {
        "increasing": {
            "plain": "Presence of bacteria in urine pushed the model toward a higher CKD prediction.",
            "medical": "Bacteriuria indicates microbial colonization and risk of ascending upper urinary tract involvement."
        },
        "decreasing": {
            "plain": "Absence of bacteria in urine pushed the model toward a lower CKD prediction.",
            "medical": "Sterile urinary sediment indicates absence of active bacterial infection."
        }
    },
    "age": {
        "increasing": {
            "plain": "Patient age profile pushed the model toward a higher CKD prediction.",
            "medical": "Advancing age is physiologically associated with progressive nephrosclerosis and gradual nephron loss."
        },
        "decreasing": {
            "plain": "Patient age profile pushed the model toward a lower CKD prediction.",
            "medical": "Younger age is associated with preserved total functional nephron mass and higher renal reserve."
        }
    },
    "bp": {
        "increasing": {
            "plain": "Elevated blood pressure pushed the model toward a higher CKD prediction.",
            "medical": "Elevated systolic/diastolic blood pressure increases intraglomerular hydrostatic pressure."
        },
        "decreasing": {
            "plain": "Normal blood pressure pushed the model toward a lower CKD prediction.",
            "medical": "Normotensive hemodynamics reduce vascular strain across the afferent and efferent glomerular arterioles."
        }
    }
}


class ModelService:
    """Production ML Inference & Tree SHAP Explainability Service for RenalInsight (UCI 336)."""

    def __init__(self) -> None:
        self.model: Optional[Pipeline] = None
        self.explainer: Optional[TreeExplainer] = None
        self.feature_names: Optional[List[str]] = None
        self.metadata: Optional[Dict[str, Any]] = None
        self.input_features: List[str] = []
        self.numeric_features: List[str] = []
        self.categorical_features: List[str] = []
        self.is_ready: bool = False

    def load_artifacts(self, models_dir: Optional[Path] = None) -> None:
        """Loads trained Decision Tree pipeline, SHAP explainer, feature names, and metadata."""
        if models_dir is None:
            models_dir = settings.MODELS_DIR

        logger.info(f"Loading model artifacts from {models_dir}...")

        final_model_path = models_dir / "final_model.joblib"
        explainer_path = models_dir / "shap_explainer.joblib"
        feature_names_path = models_dir / "feature_names.joblib"
        metadata_path = models_dir / "model_metadata.json"

        if not final_model_path.exists():
            raise FileNotFoundError(f"Model artifact not found at {final_model_path}")
        if not explainer_path.exists():
            raise FileNotFoundError(f"SHAP explainer not found at {explainer_path}")
        if not feature_names_path.exists():
            raise FileNotFoundError(f"Feature names artifact not found at {feature_names_path}")
        if not metadata_path.exists():
            raise FileNotFoundError(f"Metadata artifact not found at {metadata_path}")

        self.model = joblib.load(final_model_path)
        self.explainer = joblib.load(explainer_path)
        self.feature_names = list(joblib.load(feature_names_path))

        with open(metadata_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        self.input_features = self.metadata.get("input_features", [
            "age", "bp", "sg", "al", "su", "rbc", "pc", "pcc", "ba", "bgr",
            "bu", "sc", "sod", "pot", "hemo", "pcv", "wbcc", "rbcc",
            "htn", "dm", "cad", "appet", "pe", "ane"
        ])
        self.numeric_features = self.metadata.get("numeric_features", [
            "age", "bp", "sg", "al", "su", "bgr", "bu", "sc", "sod", "pot",
            "hemo", "pcv", "wbcc", "rbcc"
        ])
        self.categorical_features = self.metadata.get("categorical_features", [
            "rbc", "pc", "pcc", "ba", "htn", "dm", "cad", "appet", "pe", "ane"
        ])

        self.is_ready = True
        logger.info(
            f"Successfully loaded {self.metadata.get('final_model', 'Decision Tree')} pipeline "
            f"with {len(self.input_features)} input features and {len(self.feature_names)} encoded features."
        )

    def _clean_categorical(self, feat: str, val: Any) -> str:
        """Normalizes categorical string inputs to match UCI 336 clean format."""
        if val is None or pd.isna(val):
            return "no" if feat in ("htn", "dm", "cad", "pe", "ane") else ("good" if feat == "appet" else ("normal" if feat in ("rbc", "pc") else "notpresent"))

        s = str(val).strip().lower().replace(" ", "").replace("_", "").replace("-", "")

        if feat in ("rbc", "pc"):
            return "abnormal" if any(k in s for k in ("abnormal", "abn", "1", "yes", "positive")) else "normal"

        if feat in ("pcc", "ba"):
            return "present" if any(k in s for k in ("present", "pres", "1", "yes", "positive")) else "notpresent"

        if feat in ("htn", "dm", "cad", "pe", "ane"):
            return "yes" if any(k in s for k in ("yes", "y", "1", "true", "present", "positive")) else "no"

        if feat == "appet":
            return "poor" if any(k in s for k in ("poor", "bad", "loss", "low", "1")) else "good"

        return str(val).strip().lower()

    def _clean_numeric(self, feat: str, val: Any) -> Optional[float]:
        """Safely coerces numeric values to float."""
        if val is None or val == "" or pd.isna(val):
            return np.nan
        try:
            return float(val)
        except (ValueError, TypeError):
            # Attempt to parse leading numeric string
            s = str(val).strip()
            num_str = ""
            for ch in s:
                if ch.isdigit() or ch == ".":
                    num_str += ch
                elif num_str:
                    break
            try:
                return float(num_str) if num_str else np.nan
            except ValueError:
                return np.nan

    def prepare_dataframe(self, input_data: Union[PatientInputSchema, Dict[str, Any]]) -> pd.DataFrame:
        """Converts input payload into a single-row DataFrame matching the 24 input features."""
        if isinstance(input_data, PatientInputSchema):
            data_dict = input_data.model_dump(by_alias=True)
        else:
            data_dict = dict(input_data)

        row: Dict[str, Any] = {}

        # 14 Numeric features
        for num_col in self.numeric_features:
            val = data_dict.get(num_col)
            row[num_col] = self._clean_numeric(num_col, val)

        # 10 Categorical features
        for cat_col in self.categorical_features:
            val = data_dict.get(cat_col)
            row[cat_col] = self._clean_categorical(cat_col, val)

        # Construct DataFrame in exact feature order
        df = pd.DataFrame([row])
        ordered_cols = [c for c in self.input_features if c in df.columns]
        return df[ordered_cols]

    def _extract_shap_values(self, x_transformed: np.ndarray) -> np.ndarray:
        """Extracts 1D SHAP values for the positive class (CKD = 1)."""
        try:
            shap_res = self.explainer(x_transformed)
            arr = np.asarray(shap_res.values)
            if arr.ndim == 3:
                # Shape (1, 34, 2) -> take class 1
                return arr[0, :, 1]
            elif arr.ndim == 2:
                # Shape (1, 34)
                return arr[0]
            return arr.reshape(-1)
        except Exception:
            # Fallback to shap_values method
            shap_raw = self.explainer.shap_values(x_transformed)
            if isinstance(shap_raw, list) and len(shap_raw) > 1:
                return np.asarray(shap_raw[1])[0]
            elif isinstance(shap_raw, np.ndarray) and shap_raw.ndim == 3:
                return shap_raw[0, :, 1]
            elif isinstance(shap_raw, np.ndarray) and shap_raw.ndim == 2:
                return shap_raw[0]
            return np.asarray(shap_raw).reshape(-1)

    def predict(self, input_data: Union[PatientInputSchema, Dict[str, Any]]) -> PredictionResponse:
        """
        Executes prediction and computes local Tree SHAP explanations for the provided patient data.
        """
        if not self.is_ready or self.model is None or self.explainer is None:
            raise RuntimeError("ModelService is not ready. Call load_artifacts() first.")

        # 1. Prepare clean DataFrame
        df = self.prepare_dataframe(input_data)

        # 2. Run model inference
        pred_class = int(self.model.predict(df)[0])
        probabilities = self.model.predict_proba(df)[0]
        prob_not_ckd = float(probabilities[0])
        prob_ckd = float(probabilities[1])

        ckd_percent = round(prob_ckd * 100, 2)
        not_ckd_percent = round(prob_not_ckd * 100, 2)

        prediction_label = "CKD" if pred_class == 1 else "NOT CKD"

        # Risk classification
        if ckd_percent >= 70.0:
            risk_level = "High"
        elif ckd_percent >= 30.0:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        # 3. Compute Tree SHAP feature attribution
        preprocessor = self.model.named_steps["preprocessor"]
        x_transformed = preprocessor.transform(df)
        sample_shap = self._extract_shap_values(x_transformed)

        # 4. Extract factors and pair with dual explanations
        increasing_factors: List[ShapFactor] = []
        decreasing_factors: List[ShapFactor] = []
        all_factors: List[ShapFactor] = []

        patient_dict = input_data.model_dump() if isinstance(input_data, PatientInputSchema) else dict(input_data)

        for idx, feat_encoded in enumerate(self.feature_names):
            val_shap = float(sample_shap[idx]) if idx < len(sample_shap) else 0.0

            # Determine base feature and observed value
            if feat_encoded.startswith("num__"):
                base_feat = feat_encoded.replace("num__", "")
                raw_val = patient_dict.get(base_feat, df[base_feat].iloc[0] if base_feat in df else None)
                val_display = round(float(raw_val), 2) if raw_val is not None and not pd.isna(raw_val) else "N/A"
            elif feat_encoded.startswith("cat__"):
                parts = feat_encoded.replace("cat__", "").split("_", 1)
                base_feat = parts[0]
                category_level = parts[1] if len(parts) > 1 else ""
                raw_val = patient_dict.get(base_feat, df[base_feat].iloc[0] if base_feat in df else None)
                val_display = str(raw_val).capitalize() if raw_val is not None else category_level
            else:
                base_feat = feat_encoded
                raw_val = patient_dict.get(base_feat, "")
                val_display = str(raw_val)

            unit = FEATURE_UNITS.get(base_feat, "")
            display_base = FEATURE_DISPLAY_NAMES.get(base_feat, base_feat.upper())
            display_str = f"{display_base}: {val_display} {unit}".strip()
            category = FEATURE_CATEGORY_MAP.get(base_feat, "Kidney")
            direction = "increasing" if val_shap > 0 else "decreasing"

            # Dual explanations
            templates = EXPLANATION_TEMPLATES.get(base_feat, {})
            direction_key = "increasing" if val_shap > 0 else "decreasing"
            plain_expl = templates.get(direction_key, {}).get(
                "plain",
                f"This factor pushed the model toward a {'higher' if val_shap > 0 else 'lower'} CKD prediction."
            )
            med_expl = templates.get(direction_key, {}).get(
                "medical",
                f"Observed biomarker state contributes {val_shap:+.4f} toward the tree classification margin."
            )

            factor = ShapFactor(
                feature=base_feat,
                encoded_feature=feat_encoded,
                display_feature=display_str,
                value=val_display,
                unit=unit,
                shap_value=round(val_shap, 4),
                direction=direction,
                category=category,
                plain_explanation=plain_expl,
                medical_explanation=med_expl,
                description=plain_expl,
            )

            all_factors.append(factor)
            if abs(val_shap) > 1e-4:
                if direction == "increasing":
                    increasing_factors.append(factor)
                else:
                    decreasing_factors.append(factor)

        # Sort factors by absolute impact
        all_factors.sort(key=lambda x: abs(x.shap_value), reverse=True)
        increasing_factors.sort(key=lambda x: abs(x.shap_value), reverse=True)
        decreasing_factors.sort(key=lambda x: abs(x.shap_value), reverse=True)

        return PredictionResponse(
            prediction=prediction_label,
            probability=ckd_percent,
            not_ckd_probability=not_ckd_percent,
            risk_level=risk_level,
            model_name=f"{self.metadata.get('final_model', 'Decision Tree')} (UCI 336)",
            explainability_method="Tree SHAP (TreeExplainer)",
            timestamp=datetime.utcnow().isoformat() + "Z",
            increasing_factors=increasing_factors,
            decreasing_factors=decreasing_factors,
            all_factors=all_factors,
        )

    def get_model_info(self) -> ModelInfoResponse:
        """Returns metadata, performance metrics, and feature list for the model."""
        if not self.is_ready or self.metadata is None:
            raise RuntimeError("ModelService is not ready. Call load_artifacts() first.")

        test_metrics = self.metadata.get("test_metrics", {})
        return ModelInfoResponse(
            project=self.metadata.get("project", "RenalInsight"),
            dataset=self.metadata.get("dataset", "UCI 336 Chronic Kidney Disease"),
            model_type=self.metadata.get("final_model", "Decision Tree"),
            model_key=self.metadata.get("model_key", "dtree"),
            target=self.metadata.get("target", "class"),
            positive_class="CKD",
            negative_class="Not CKD",
            dataset_rows=400,
            dataset_features=len(self.input_features),
            test_accuracy=test_metrics.get("Accuracy", 0.9625),
            test_precision=test_metrics.get("Precision", 1.0),
            test_recall=test_metrics.get("Recall (Sensitivity)", 0.94),
            test_specificity=test_metrics.get("Specificity", 1.0),
            test_f1=test_metrics.get("F1", 0.9691),
            test_roc_auc=test_metrics.get("ROC-AUC", 0.989),
            shap_enabled=True,
            input_feature_count=len(self.input_features),
            input_features=self.input_features,
            numeric_features=self.numeric_features,
            categorical_features=self.categorical_features,
            transformed_feature_count=len(self.feature_names or []),
        )


# Global singleton instance
model_service = ModelService()
