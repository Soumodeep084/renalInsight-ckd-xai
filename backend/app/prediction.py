import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import joblib
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from shap import Explainer

from app.config import settings
from app.schemas import (
    FeatureImportance,
    ModelInfoResponse,
    PatientInputSchema,
    PredictionResponse,
    ShapFactor,
)

logger = logging.getLogger("renalinsight.prediction")

# Clinical domain mapping for display & categorizations
FEATURE_CATEGORY_MAP: Dict[str, str] = {
    "sg": "Kidney",
    "al": "Kidney",
    "su": "Kidney",
    "rbc": "Kidney",
    "pc": "Kidney",
    "pcc": "Kidney",
    "ba": "Kidney",
    "gfr": "Kidney",
    "bgr": "Blood",
    "bu": "Blood",
    "sod": "Blood",
    "sc": "Blood",
    "pot": "Blood",
    "hemo": "Blood",
    "pcv": "Blood",
    "rbcc": "Blood",
    "wbcc": "Blood",
    "htn": "Symptom",
    "dm": "Symptom",
    "cad": "Symptom",
    "appet": "Symptom",
    "pe": "Symptom",
    "ane": "Symptom",
    "age": "Demographic",
    "bp (Diastolic)": "Demographic",
    "bp_diastolic": "Demographic",
    "bp limit": "Demographic",
    "bp_limit": "Demographic",
    "stage": "Demographic",
}

FEATURE_DISPLAY_NAMES: Dict[str, str] = {
    "bp (Diastolic)": "Diastolic Blood Pressure",
    "bp limit": "Blood Pressure Limit",
    "sg": "Specific Gravity",
    "al": "Albuminuria",
    "rbc": "Red Blood Cells (Urine)",
    "su": "Urinary Glucose",
    "pc": "Pus Cells (Pyuria)",
    "pcc": "Pus Cell Clumps",
    "ba": "Bacteria (Urine)",
    "bgr": "Random Blood Glucose",
    "bu": "Blood Urea",
    "sod": "Serum Sodium",
    "sc": "Serum Creatinine",
    "pot": "Serum Potassium",
    "hemo": "Hemoglobin",
    "pcv": "Packed Cell Volume (Hematocrit)",
    "rbcc": "RBC Count",
    "wbcc": "WBC Count",
    "htn": "Hypertension",
    "dm": "Diabetes Mellitus",
    "cad": "Coronary Artery Disease",
    "appet": "Appetite Status",
    "pe": "Pedal Edema",
    "ane": "Clinical Anemia",
    "age": "Patient Age",
    "gfr": "Glomerular Filtration Rate",
    "stage": "CKD Clinical Stage",
}

# Clinical descriptions for key biomarkers
CLINICAL_DESCRIPTIONS: Dict[str, Dict[str, str]] = {
    "htn": {
        "pos": "Systemic arterial hypertension increases glomerular capillary pressure and accelerates renal sclerosis.",
        "neg": "Normotensive profile preserves renal microvasculature.",
    },
    "dm": {
        "pos": "Diabetic microvascular pathology promotes diabetic glomerulosclerosis and tubular atrophy.",
        "neg": "Absence of diabetes mellitus significantly reduces nephropathy risk.",
    },
    "al": {
        "pos": "Elevated albuminuria reflects disrupted glomerular filtration barrier integrity.",
        "neg": "Normal urine albumin levels indicate intact podocyte slit diaphragms.",
    },
    "sc": {
        "pos": "Elevated serum creatinine indicates diminished glomerular clearance function.",
        "neg": "Serum creatinine within normal ranges indicates adequate renal clearance.",
    },
    "hemo": {
        "pos": "Decreased hemoglobin indicates renal anemia due to impaired erythropoietin production.",
        "neg": "Normal hemoglobin levels signify adequate erythropoietin endocrine function.",
    },
    "sg": {
        "pos": "Low urine specific gravity reflects impaired tubular urine concentrating capability.",
        "neg": "Physiological specific gravity confirms adequate renal concentrating ability.",
    },
    "bu": {
        "pos": "Elevated blood urea reflects decreased clearance of nitrogenous metabolic waste.",
        "neg": "Blood urea in physiological range signifies preserved urea excretion.",
    },
    "pe": {
        "pos": "Peripheral pedal edema reflects renal sodium retention and extracellular fluid expansion.",
        "neg": "Absence of edema indicates balanced sodium and fluid homeostasis.",
    },
    "pc": {
        "pos": "Elevated pus cells in urine sediment indicate urinary inflammation or interstitial nephritis.",
        "neg": "Normal pus cell levels signify absence of active pyuria.",
    },
    "appet": {
        "pos": "Poor appetite is a classic clinical manifestation of uremic retention.",
        "neg": "Preserved appetite correlates with low circulating uremic toxin burden.",
    },
    "ane": {
        "pos": "Clinical anemia correlates with diminished renal parenchymal function.",
        "neg": "Absence of clinical anemia is consistent with normal renal endocrine function.",
    },
}


class ModelService:
    """Production ML Inference & SHAP Explainability Service for RenalInsight."""

    def __init__(self) -> None:
        self.model: Optional[Pipeline] = None
        self.explainer: Optional[Explainer] = None
        self.feature_names: Optional[List[str]] = None
        self.metadata: Optional[Dict[str, Any]] = None
        self.input_features: List[str] = []
        self.is_ready: bool = False

    def load_artifacts(self, models_dir: Optional[Path] = None) -> None:
        """Loads model, explainer, feature names, and metadata from storage."""
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

        if hasattr(self.model, "feature_names_in_"):
            self.input_features = list(self.model.feature_names_in_)
        else:
            preprocessor = self.model.named_steps.get("preprocessor")
            if preprocessor and hasattr(preprocessor, "feature_names_in_"):
                self.input_features = list(preprocessor.feature_names_in_)
            else:
                self.input_features = [
                    "bp (Diastolic)", "bp limit", "sg", "al", "rbc", "su", "pc", "pcc",
                    "ba", "bgr", "bu", "sod", "sc", "pot", "hemo", "pcv", "rbcc",
                    "wbcc", "htn", "dm", "cad", "appet", "pe", "ane", "age"
                ]

        self.is_ready = True
        logger.info(
            f"Successfully loaded pipeline with {len(self.input_features)} input features "
            f"and {len(self.feature_names)} encoded features."
        )

    def _normalize_binary(self, val: Any, positive_values: Tuple[str, ...]) -> float:
        """Converts string/boolean/numeric values into 0.0 or 1.0 float."""
        if isinstance(val, (int, float)):
            return 1.0 if float(val) >= 0.5 else 0.0
        if isinstance(val, str):
            val_clean = val.strip().lower()
            if any(pos.lower() == val_clean for pos in positive_values):
                return 1.0
            return 0.0
        return 0.0

    def _normalize_category(self, feature: str, val: Any) -> str:
        """Ensures category value matches one-hot encoder categories or closest equivalent."""
        val_str = str(val).strip()

        # Specific normalization rules for frontend values
        if feature == "sg":
            if val_str in ("1.020", "1.02"):
                return "1.019 - 1.021"
            if val_str in ("1.015",):
                return "1.015 - 1.017"
            if val_str in ("1.010",):
                return "1.009 - 1.011"
            if val_str in ("1.005", "< 1.007"):
                return "< 1.007"
            if val_str in ("1.025", "≥ 1.023", ">= 1.023"):
                return "≥ 1.023"

        elif feature == "al":
            if val_str in ("Normal", "0", "< 0", "0.0"):
                return "< 0"
            if val_str in ("1", "1+", "1.0"):
                return "1"
            if val_str in ("2", "2+", "2.0"):
                return "2"
            if val_str in ("3", "3+", "3.0"):
                return "3"
            if val_str in ("4", "4+", "≥ 4", ">= 4", "5", "5+"):
                return "≥ 4"

        elif feature == "su":
            if val_str in ("Normal", "0", "< 0", "0.0"):
                return "< 0"
            if val_str in ("2", "2.0", "250 mg/dL", "1", "1+"):
                return "2"
            if val_str in ("3", "3.0", "500 mg/dL"):
                return "3"
            if val_str in ("4", "4.0", "1000 mg/dL"):
                return "4"
            if val_str in ("≥ 4", ">= 4", ">1000 mg/dL"):
                return "≥ 4"

        elif feature == "bgr":
            if val_str in ("< 112", "< 112 mg/dL", "Normal"):
                return "< 112"
            if "≥ 448" in val_str or ">= 448" in val_str or "≥ 238" in val_str:
                return "196 - 238" if "238" in val_str else "≥ 448"

        elif feature == "bu":
            if "< 34" in val_str or "< 48.1" in val_str or "Normal" in val_str:
                return "< 48.1"
            if "34 - 76" in val_str:
                return "48.1 - 86.2"
            if "76 - 118" in val_str:
                return "86.2 - 124.3"
            if "118 - 160" in val_str:
                return "124.3 - 162.4"
            if "≥ 160" in val_str or "≥ 352.9" in val_str or ">= 352.9" in val_str:
                return "≥ 352.9"

        elif feature == "sc":
            if "< 1.2" in val_str or "< 3.65" in val_str or "Normal" in val_str:
                return "< 3.65"
            if "1.2 - 2.5" in val_str:
                return "3.65 - 6.8"
            if "2.5 - 4.8" in val_str:
                return "6.8 - 9.95"
            if "4.8 - 7.1" in val_str:
                return "9.95 - 13.1"
            if "≥ 7.1" in val_str or "≥ 28.85" in val_str or ">= 28.85" in val_str:
                return "≥ 28.85"

        elif feature == "pot":
            if "< 3.5" in val_str or "3.5 - 4.5" in val_str or "4.5 - 5.5" in val_str or "< 7.31" in val_str:
                return "< 7.31"
            if "≥ 5.5" in val_str or "38.18 - 42.59" in val_str:
                return "38.18 - 42.59"

        elif feature == "hemo":
            if "< 11.3" in val_str:
                return "10 - 11.3"
            if "≥ 16.5" in val_str:
                return "≥ 16.5"
            if "< 6.1" in val_str:
                return "< 6.1"

        elif feature == "pcv":
            if "< 33.5" in val_str:
                return "29.6 - 33.5"
            if "≥ 49.1" in val_str:
                return "≥ 49.1"
            if "< 17.9" in val_str:
                return "< 17.9"

        elif feature == "rbcc":
            if "< 3.87" in val_str:
                return "3.28 - 3.87"
            if "≥ 6.23" in val_str:
                return "6.23 - 6.82"
            if "< 2.69" in val_str:
                return "< 2.69"
            if "≥ 7.41" in val_str:
                return "≥ 7.41"

        elif feature == "wbcc":
            if "≥ 12120" in val_str:
                return "12120 - 14500"

        elif feature == "age":
            if isinstance(val, (int, float)):
                age_num = float(val)
                if age_num < 12:
                    return "< 12"
                elif age_num <= 20:
                    return "12 - 20"
                elif age_num <= 27:
                    return "20 - 27"
                elif age_num <= 35:
                    return "27 - 35"
                elif age_num <= 43:
                    return "35 - 43"
                elif age_num <= 51:
                    return "43 - 51"
                elif age_num <= 59:
                    return "51 - 59"
                elif age_num <= 66:
                    return "59 - 66"
                elif age_num <= 74:
                    return "66 - 74"
                else:
                    return "≥ 74"

        return val_str

    def prepare_dataframe(self, input_data: Union[PatientInputSchema, Dict[str, Any]]) -> pd.DataFrame:
        """Converts validated schema/dict into a single-row DataFrame matching the model's exact input format."""
        if isinstance(input_data, PatientInputSchema):
            data_dict = input_data.model_dump(by_alias=True)
        else:
            data_dict = dict(input_data)

        # Helper getters for aliases
        def get_val(*keys: str, default: Any = 0.0) -> Any:
            for k in keys:
                if k in data_dict and data_dict[k] is not None:
                    return data_dict[k]
            return default

        row: Dict[str, Any] = {}

        # 1. bp (Diastolic)
        bp_val = get_val("bp (Diastolic)", "bp_diastolic", "bp", default=76.0)
        if isinstance(bp_val, (int, float)):
            # If standard mmHg (e.g. 76.0), map 0 (<=80) or 1 (>80) to match training distribution
            row["bp (Diastolic)"] = 1.0 if float(bp_val) > 80 else 0.0
        else:
            row["bp (Diastolic)"] = self._normalize_binary(bp_val, ("high", "elevated", "1", "yes"))

        # 2. bp limit
        bp_lim = get_val("bp limit", "bp_limit", default="70 - 80")
        if isinstance(bp_lim, (int, float)):
            row["bp limit"] = float(bp_lim)
        elif isinstance(bp_lim, str):
            if "< 70" in bp_lim or "low" in bp_lim.lower():
                row["bp limit"] = 0.0
            elif "70 - 80" in bp_lim or "normal" in bp_lim.lower():
                row["bp limit"] = 1.0
            elif "80 - 90" in bp_lim or "elevated" in bp_lim.lower():
                row["bp limit"] = 2.0
            else:
                row["bp limit"] = 3.0
        else:
            row["bp limit"] = 1.0

        # 3. rbc
        row["rbc"] = self._normalize_binary(get_val("rbc", default="Normal"), ("abnormal", "1", "present", "yes"))

        # 4. pc
        row["pc"] = self._normalize_binary(get_val("pc", default="Normal"), ("abnormal", "1", "present", "yes"))

        # 5. pcc
        row["pcc"] = self._normalize_binary(get_val("pcc", default="Not Present"), ("present", "1", "yes"))

        # 6. ba
        row["ba"] = self._normalize_binary(get_val("ba", default="Not Present"), ("present", "1", "yes"))

        # 7. htn
        row["htn"] = self._normalize_binary(get_val("htn", default="No"), ("yes", "1", "true", "present"))

        # 8. dm
        row["dm"] = self._normalize_binary(get_val("dm", default="No"), ("yes", "1", "true", "present"))

        # 9. cad
        row["cad"] = self._normalize_binary(get_val("cad", default="No"), ("yes", "1", "true", "present"))

        # 10. appet
        row["appet"] = self._normalize_binary(get_val("appet", default="Good"), ("poor", "1", "bad", "loss"))

        # 11. pe
        row["pe"] = self._normalize_binary(get_val("pe", default="No"), ("yes", "1", "true", "present"))

        # 12. ane
        row["ane"] = self._normalize_binary(get_val("ane", default="No"), ("yes", "1", "true", "present"))

        # Categorical features
        cat_features = ["sg", "al", "su", "bgr", "bu", "sod", "sc", "pot", "hemo", "pcv", "rbcc", "wbcc", "age"]
        for feat in cat_features:
            raw_val = get_val(feat, default="Normal" if feat in ("al", "su") else "")
            row[feat] = self._normalize_category(feat, raw_val)

        # Build DataFrame strictly with expected column order
        df = pd.DataFrame([row])
        ordered_cols = [c for c in self.input_features if c in df.columns]
        return df[ordered_cols]

    def predict(self, input_data: Union[PatientInputSchema, Dict[str, Any]]) -> PredictionResponse:
        """
        Executes prediction and computes local SHAP explanations for the provided patient data.
        """
        if not self.is_ready or self.model is None or self.explainer is None:
            raise RuntimeError("ModelService is not ready. Call load_artifacts() first.")

        # 1. Prepare formatted DataFrame
        df = self.prepare_dataframe(input_data)

        # 2. Run model inference
        pred_class = int(self.model.predict(df)[0])
        probabilities = self.model.predict_proba(df)[0]
        prob_not_ckd = float(probabilities[0])
        prob_ckd = float(probabilities[1])

        ckd_percent = round(prob_ckd * 100, 2)
        not_ckd_percent = round(prob_not_ckd * 100, 2)

        prediction_label = "CKD" if pred_class == 1 else "NOT CKD"

        # Risk stratification
        if ckd_percent >= 70.0:
            risk_level = "High"
        elif ckd_percent >= 30.0:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        # 3. Compute SHAP explanations
        preprocessor = self.model.named_steps["preprocessor"]
        x_transformed = preprocessor.transform(df)
        shap_values_raw = self.explainer.shap_values(x_transformed)

        if isinstance(shap_values_raw, list):
            sample_shap = shap_values_raw[1][0] if len(shap_values_raw) > 1 else shap_values_raw[0][0]
        else:
            sample_shap = shap_values_raw[0]

        # 4. Extract factors
        increasing_factors: List[ShapFactor] = []
        decreasing_factors: List[ShapFactor] = []
        all_factors: List[ShapFactor] = []

        # Find non-zero SHAP values (meaningful features)
        active_indices = np.where(np.abs(sample_shap) > 1e-4)[0]

        # Group factors by underlying clinical feature
        patient_dict = input_data.model_dump() if isinstance(input_data, PatientInputSchema) else dict(input_data)

        for idx in active_indices:
            feat_encoded = self.feature_names[idx]
            val_shap = float(sample_shap[idx])

            # Determine base feature
            if feat_encoded.startswith("num__"):
                base_feat = feat_encoded.replace("num__", "")
                cat_val = patient_dict.get(base_feat, patient_dict.get(base_feat.replace(" (Diastolic)", "_diastolic"), ""))
            elif feat_encoded.startswith("cat__"):
                parts = feat_encoded.replace("cat__", "").split("_", 1)
                base_feat = parts[0]
                cat_val = parts[1] if len(parts) > 1 else patient_dict.get(base_feat, "")
            else:
                base_feat = feat_encoded
                cat_val = patient_dict.get(base_feat, "")

            category = FEATURE_CATEGORY_MAP.get(base_feat, "Kidney")
            display_base = FEATURE_DISPLAY_NAMES.get(base_feat, base_feat.capitalize())
            display_feature = f"{display_base} ({cat_val})" if cat_val else display_base
            direction = "increasing" if val_shap > 0 else "decreasing"

            # Clinical description
            desc = None
            if base_feat in CLINICAL_DESCRIPTIONS:
                desc = CLINICAL_DESCRIPTIONS[base_feat]["pos" if val_shap > 0 else "neg"]

            factor = ShapFactor(
                feature=base_feat,
                display_feature=display_feature,
                value=cat_val if cat_val != "" else round(val_shap, 4),
                shap_value=round(val_shap, 4),
                direction=direction,
                category=category,
                description=desc,
            )

            all_factors.append(factor)
            if direction == "increasing":
                increasing_factors.append(factor)
            else:
                decreasing_factors.append(factor)

        # Sort factors by impact
        all_factors.sort(key=lambda x: abs(x.shap_value), reverse=True)
        increasing_factors.sort(key=lambda x: abs(x.shap_value), reverse=True)
        decreasing_factors.sort(key=lambda x: abs(x.shap_value), reverse=True)

        return PredictionResponse(
            prediction=prediction_label,
            probability=ckd_percent,
            not_ckd_probability=not_ckd_percent,
            risk_level=risk_level,
            model_name="Logistic Regression (XAI-Enabled)",
            explainability_method="SHAP (SHapley Additive exPlanations)",
            timestamp=datetime.utcnow().isoformat() + "Z",
            increasing_factors=increasing_factors,
            decreasing_factors=decreasing_factors,
            all_factors=all_factors,
        )

    def get_model_info(self) -> ModelInfoResponse:
        """Returns metadata, performance metrics, and feature list for the model."""
        if not self.is_ready or self.metadata is None:
            raise RuntimeError("ModelService is not ready. Call load_artifacts() first.")

        return ModelInfoResponse(
            model_type=self.metadata.get("model_type", "Logistic Regression"),
            target=self.metadata.get("target", "class"),
            positive_class=self.metadata.get("positive_class", "CKD"),
            negative_class=self.metadata.get("negative_class", "Not CKD"),
            dataset_rows=self.metadata.get("dataset_rows", 200),
            dataset_features=self.metadata.get("dataset_features", 28),
            cv_roc_auc=self.metadata.get("cv_roc_auc", 1.0),
            test_accuracy=self.metadata.get("test_accuracy", 1.0),
            test_precision=self.metadata.get("test_precision", 1.0),
            test_recall=self.metadata.get("test_recall", 1.0),
            test_f1=self.metadata.get("test_f1", 1.0),
            shap_enabled=self.metadata.get("shap_enabled", True),
            input_feature_count=len(self.input_features),
            input_features=self.input_features,
            encoded_feature_count=len(self.feature_names or []),
        )


# Global singleton instance
model_service = ModelService()
