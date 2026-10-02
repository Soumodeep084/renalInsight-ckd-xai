from datetime import datetime
from typing import Dict, List, Literal, Optional, Union
from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Patient Input Schemas (UCI 336 - 24 Final Predictors)
# ---------------------------------------------------------------------------

class PatientInputSchema(BaseModel):
    """
    Patient Clinical Input Schema for Chronic Kidney Disease (CKD) prediction.
    Corresponds to the 24 predictors used in the UCI 336 Decision Tree pipeline.
    """
    # --- Demographics & Vitals (2 features) ---
    age: Optional[float] = Field(
        default=48.0,
        ge=1.0,
        le=120.0,
        description="Patient age in years (e.g. 48)",
        examples=[48.0, 65.0]
    )
    bp: Optional[float] = Field(
        default=80.0,
        ge=40.0,
        le=250.0,
        description="Blood pressure in mm Hg (e.g. 80)",
        examples=[80.0, 90.0]
    )

    # --- Urinalysis & Kidney Function (7 features) ---
    sg: Optional[float] = Field(
        default=1.020,
        ge=1.000,
        le=1.040,
        description="Urine specific gravity (e.g. 1.005, 1.010, 1.015, 1.020, 1.025)",
        examples=[1.020, 1.010]
    )
    al: Optional[float] = Field(
        default=0.0,
        ge=0.0,
        le=5.0,
        description="Albuminuria level on a 0–5 scale (0=None, 1=Trace/1+, 2=2+, 3=3+, 4=4+, 5=5+)",
        examples=[0.0, 1.0, 3.0]
    )
    su: Optional[float] = Field(
        default=0.0,
        ge=0.0,
        le=5.0,
        description="Urinary glucose level on a 0–5 scale (0=None, 1=1+, 2=2+, 3=3+, 4=4+, 5=5+)",
        examples=[0.0, 2.0]
    )
    rbc: Optional[str] = Field(
        default="normal",
        description="Red blood cells in urine sediment ('normal' or 'abnormal')",
        examples=["normal", "abnormal"]
    )
    pc: Optional[str] = Field(
        default="normal",
        description="Pus cells (pyuria) in urine sediment ('normal' or 'abnormal')",
        examples=["normal", "abnormal"]
    )
    pcc: Optional[str] = Field(
        default="notpresent",
        description="Pus cell clumps in urine ('notpresent' or 'present')",
        examples=["notpresent", "present"]
    )
    ba: Optional[str] = Field(
        default="notpresent",
        description="Bacteria presence in urine ('notpresent' or 'present')",
        examples=["notpresent", "present"]
    )

    # --- Blood Chemistry & Hematology (9 features) ---
    bgr: Optional[float] = Field(
        default=121.0,
        ge=30.0,
        le=600.0,
        description="Random blood glucose level in mg/dL (e.g. 121)",
        examples=[121.0, 220.0]
    )
    bu: Optional[float] = Field(
        default=36.0,
        ge=1.0,
        le=500.0,
        description="Blood urea level in mg/dL (e.g. 36)",
        examples=[36.0, 75.0]
    )
    sc: Optional[float] = Field(
        default=1.2,
        ge=0.1,
        le=50.0,
        description="Serum creatinine level in mg/dL (e.g. 1.2)",
        examples=[1.2, 4.5]
    )
    sod: Optional[float] = Field(
        default=137.0,
        ge=80.0,
        le=200.0,
        description="Serum sodium level in mEq/L (e.g. 137)",
        examples=[137.0, 128.0]
    )
    pot: Optional[float] = Field(
        default=4.4,
        ge=1.0,
        le=15.0,
        description="Serum potassium level in mEq/L (e.g. 4.4)",
        examples=[4.4, 5.8]
    )
    hemo: Optional[float] = Field(
        default=15.4,
        ge=2.0,
        le=25.0,
        description="Hemoglobin level in g/dL (e.g. 15.4)",
        examples=[15.4, 8.5]
    )
    pcv: Optional[float] = Field(
        default=44.0,
        ge=10.0,
        le=70.0,
        description="Packed cell volume / Hematocrit percentage (e.g. 44)",
        examples=[44.0, 28.0]
    )
    wbcc: Optional[float] = Field(
        default=7800.0,
        ge=1000.0,
        le=50000.0,
        description="White blood cell count in cells/cumm (e.g. 7800)",
        examples=[7800.0, 12500.0]
    )
    rbcc: Optional[float] = Field(
        default=5.2,
        ge=1.0,
        le=10.0,
        description="Red blood cell count in millions/cmm (e.g. 5.2)",
        examples=[5.2, 3.1]
    )

    # --- Comorbidities & Clinical Symptoms (6 features) ---
    htn: Optional[str] = Field(
        default="no",
        description="Hypertension diagnosis ('no' or 'yes')",
        examples=["no", "yes"]
    )
    dm: Optional[str] = Field(
        default="no",
        description="Diabetes mellitus diagnosis ('no' or 'yes')",
        examples=["no", "yes"]
    )
    cad: Optional[str] = Field(
        default="no",
        description="Coronary artery disease history ('no' or 'yes')",
        examples=["no", "yes"]
    )
    appet: Optional[str] = Field(
        default="good",
        description="Appetite status ('good' or 'poor')",
        examples=["good", "poor"]
    )
    pe: Optional[str] = Field(
        default="no",
        description="Pedal edema swelling ('no' or 'yes')",
        examples=["no", "yes"]
    )
    ane: Optional[str] = Field(
        default="no",
        description="Clinical anemia ('no' or 'yes')",
        examples=["no", "yes"]
    )

    model_config = ConfigDict(
        populate_by_name=True,
        extra="allow",
        json_schema_extra={
            "example": {
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
                "sod": 137.0,
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
        }
    )


# ---------------------------------------------------------------------------
# Explainability & Response Schemas
# ---------------------------------------------------------------------------

class ShapFactor(BaseModel):
    """Individual SHAP explainability contribution factor."""
    feature: str = Field(..., description="Raw feature identifier (e.g. 'hemo', 'htn')")
    encoded_feature: str = Field(
        ...,
        alias="encodedFeature",
        serialization_alias="encoded_feature",
        description="Transformed column name seen by the model (e.g. 'num__hemo', 'cat__htn_yes')"
    )
    display_feature: str = Field(
        ...,
        alias="displayFeature",
        serialization_alias="display_feature",
        description="Human-readable feature name with observed value and unit"
    )
    value: Union[str, float, int] = Field(..., description="Observed input value")
    unit: str = Field("", description="Measurement unit (e.g. 'g/dL', 'mg/dL', 'mm Hg')")
    shap_value: float = Field(
        ...,
        alias="shapValue",
        serialization_alias="shap_value",
        description="SHAP impact score (contribution toward positive class)"
    )
    direction: Literal["increasing", "decreasing"] = Field(
        ...,
        description="'increasing' pushes toward higher CKD prediction, 'decreasing' pushes toward lower CKD prediction"
    )
    category: Literal["Demographic", "Kidney", "Blood", "Symptom"] = Field(
        ...,
        description="Clinical domain category of the feature"
    )
    plain_explanation: str = Field(
        ...,
        alias="plainExplanation",
        serialization_alias="plain_explanation",
        description="Simple, non-medical explanation of the factor's contribution"
    )
    medical_explanation: str = Field(
        ...,
        alias="medicalExplanation",
        serialization_alias="medical_explanation",
        description="Concise technical/pathophysiological rationale for academic understanding"
    )
    description: Optional[str] = Field(None, description="Short summary description")

    model_config = ConfigDict(populate_by_name=True)


class FeatureImportance(BaseModel):
    """Global feature importance metric."""
    feature: str = Field(..., description="Feature identifier")
    display_feature: str = Field(
        ...,
        alias="displayFeature",
        serialization_alias="display_feature",
        description="Feature display label"
    )
    importance: float = Field(..., description="Mean absolute SHAP value or importance score")
    rank: int = Field(..., description="Importance ranking order")
    description: str = Field(..., description="Clinical importance description")

    model_config = ConfigDict(populate_by_name=True)


class PredictionResponse(BaseModel):
    """Prediction outcome and comprehensive XAI report."""
    prediction: Literal["CKD", "NOT CKD"] = Field(..., description="Predicted classification")
    probability: float = Field(..., description="Predicted probability percentage for CKD (0.00 - 100.00 %)")
    not_ckd_probability: float = Field(
        ...,
        alias="notCkdProbability",
        serialization_alias="not_ckd_probability",
        description="Predicted probability percentage for NOT CKD (0.00 - 100.00 %)"
    )
    risk_level: Literal["Low", "Moderate", "High"] = Field(
        ...,
        alias="riskLevel",
        serialization_alias="risk_level",
        description="Stratified probability category"
    )
    model_name: str = Field(
        default="Decision Tree (UCI 336)",
        alias="modelName",
        serialization_alias="model_name",
        description="Classifier architecture name"
    )
    explainability_method: str = Field(
        default="Tree SHAP (TreeExplainer)",
        alias="explainabilityMethod",
        serialization_alias="explainability_method",
        description="XAI algorithm utilized for feature attribution"
    )
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().isoformat() + "Z",
        description="UTC timestamp of the prediction evaluation"
    )
    increasing_factors: List[ShapFactor] = Field(
        default_factory=list,
        alias="increasingFactors",
        serialization_alias="increasing_factors",
        description="Features that pushed the model toward a higher CKD prediction"
    )
    decreasing_factors: List[ShapFactor] = Field(
        default_factory=list,
        alias="decreasingFactors",
        serialization_alias="decreasing_factors",
        description="Features that pushed the model toward a lower CKD prediction"
    )
    all_factors: List[ShapFactor] = Field(
        default_factory=list,
        alias="allFactors",
        serialization_alias="all_factors",
        description="All evaluated SHAP factors sorted by absolute magnitude of impact"
    )
    global_feature_importance: Optional[List[FeatureImportance]] = Field(
        default=None,
        alias="globalFeatureImportance",
        serialization_alias="global_feature_importance",
        description="Global feature rankings"
    )

    model_config = ConfigDict(populate_by_name=True)


# ---------------------------------------------------------------------------
# Health & Status Schemas
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    """API health status and component readiness."""
    status: str = Field("healthy", description="Overall health status")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    model_loaded: bool = Field(
        ...,
        alias="modelLoaded",
        serialization_alias="model_loaded",
        description="Whether the ML pipeline is loaded and ready"
    )
    shap_loaded: bool = Field(
        ...,
        alias="shapLoaded",
        serialization_alias="shap_loaded",
        description="Whether the SHAP explainer is initialized"
    )
    version: str = Field(..., description="API Version")

    model_config = ConfigDict(populate_by_name=True)


class ModelInfoResponse(BaseModel):
    """Detailed metadata and evaluation metrics for the trained model."""
    project: str = Field("RenalInsight", description="Project name")
    dataset: str = Field("UCI 336 Chronic Kidney Disease", description="Dataset identifier")
    model_type: str = Field(..., alias="modelType", serialization_alias="model_type")
    model_key: str = Field("dtree", alias="modelKey", serialization_alias="model_key")
    target: str = Field("class")
    positive_class: str = Field("CKD", alias="positiveClass", serialization_alias="positive_class")
    negative_class: str = Field("Not CKD", alias="negativeClass", serialization_alias="negative_class")
    dataset_rows: int = Field(..., alias="datasetRows", serialization_alias="dataset_rows")
    dataset_features: int = Field(..., alias="datasetFeatures", serialization_alias="dataset_features")
    test_accuracy: float = Field(..., alias="testAccuracy", serialization_alias="test_accuracy")
    test_precision: float = Field(..., alias="testPrecision", serialization_alias="test_precision")
    test_recall: float = Field(..., alias="testRecall", serialization_alias="test_recall")
    test_specificity: float = Field(1.0, alias="testSpecificity", serialization_alias="test_specificity")
    test_f1: float = Field(..., alias="testF1", serialization_alias="test_f1")
    test_roc_auc: float = Field(..., alias="testRocAuc", serialization_alias="test_roc_auc")
    shap_enabled: bool = Field(True, alias="shapEnabled", serialization_alias="shap_enabled")
    input_feature_count: int = Field(..., alias="inputFeatureCount", serialization_alias="input_feature_count")
    input_features: List[str] = Field(..., alias="inputFeatures", serialization_alias="input_features")
    numeric_features: List[str] = Field(..., alias="numericFeatures", serialization_alias="numeric_features")
    categorical_features: List[str] = Field(..., alias="categoricalFeatures", serialization_alias="categorical_features")
    transformed_feature_count: int = Field(..., alias="encodedFeatureCount", serialization_alias="encoded_feature_count")

    model_config = ConfigDict(populate_by_name=True)


class ApiStatusResponse(BaseModel):
    """Root endpoint API status and quick links."""
    name: str
    version: str
    status: str
    docs_url: str = Field(..., alias="docsUrl", serialization_alias="docs_url")
    health_url: str = Field(..., alias="healthUrl", serialization_alias="health_url")
    model_info_url: str = Field(..., alias="modelInfoUrl", serialization_alias="model_info_url")
    predict_url: str = Field(..., alias="predictUrl", serialization_alias="predict_url")

    model_config = ConfigDict(populate_by_name=True)
