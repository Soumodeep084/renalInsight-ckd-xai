from datetime import datetime
from typing import Dict, List, Literal, Optional, Union
from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Patient Input Schemas (Exact 25 Final Features)
# ---------------------------------------------------------------------------

class PatientInputSchema(BaseModel):
    """
    Patient Clinical Input Schema for Chronic Kidney Disease (CKD) risk evaluation.
    Supports exact model feature names, snake_case aliases, and frontend preset formats across 25 features.
    """
    # --- Demographics & Resting Hemodynamics (3 features) ---
    age: Union[str, int, float] = Field(
        default="59 - 66",
        description="Patient age or age group interval (e.g., '59 - 66', '35 - 43', '< 12', '≥ 74', or numeric)",
        examples=["59 - 66", 62]
    )
    bp_diastolic: Union[float, int] = Field(
        default=76.0,
        alias="bp (Diastolic)",
        description="Resting diastolic blood pressure in mmHg (e.g. 76, 80, 1.0/0.0 encoded)",
        examples=[76.0, 80]
    )
    bp_limit: Union[str, float, int] = Field(
        default="70 - 80",
        alias="bp limit",
        description="Categorical blood pressure limit category (e.g., '< 70', '70 - 80', '80 - 90', '≥ 90', or 0..3)",
        examples=["70 - 80", 1.0]
    )

    # --- Urinalysis & Kidney Function Markers (7 features) ---
    sg: str = Field(
        default="1.019 - 1.021",
        description="Urine Specific Gravity interval (e.g., '1.019 - 1.021', '1.015 - 1.017', '1.009 - 1.011', '< 1.007', '≥ 1.023')",
        examples=["1.019 - 1.021", "< 1.007"]
    )
    al: Union[str, int, float] = Field(
        default="< 0",
        description="Albuminuria level (e.g., '< 0', '1', '2', '3', '≥ 4')",
        examples=["< 0", "1", "3"]
    )
    su: Union[str, int, float] = Field(
        default="< 0",
        description="Urinary glucose / sugar level (e.g., '< 0', '2', '3', '4', '≥ 4')",
        examples=["< 0", "2"]
    )
    rbc: Union[str, float, int] = Field(
        default="Normal",
        description="Red blood cells in urine sediment (e.g., 'Normal', 'Abnormal', 0.0, 1.0)",
        examples=["Normal", "Abnormal", 0.0]
    )
    pc: Union[str, float, int] = Field(
        default="Normal",
        description="Pus cells (pyuria) in urine sediment (e.g., 'Normal', 'Abnormal', 0.0, 1.0)",
        examples=["Normal", "Abnormal", 0.0]
    )
    pcc: Union[str, float, int] = Field(
        default="Not Present",
        description="Pus cell clumps (e.g., 'Not Present', 'Present', 0.0, 1.0)",
        examples=["Not Present", "Present", 0.0]
    )
    ba: Union[str, float, int] = Field(
        default="Not Present",
        description="Bacteria presence in urine (e.g., 'Not Present', 'Present', 0.0, 1.0)",
        examples=["Not Present", "Present", 0.0]
    )

    # --- Blood Biochemistry & Hematology (9 features) ---
    bgr: str = Field(
        default="< 112",
        description="Random Blood Glucose level in mg/dL interval (e.g., '< 112', '112 - 154', '154 - 196', '≥ 448')",
        examples=["< 112", "112 - 154"]
    )
    bu: str = Field(
        default="< 48.1",
        description="Blood Urea level in mg/dL interval (e.g., '< 48.1', '48.1 - 86.2', '86.2 - 124.3', '≥ 352.9')",
        examples=["< 48.1", "48.1 - 86.2"]
    )
    sod: str = Field(
        default="138 - 143",
        description="Serum Sodium level in mEq/L interval (e.g., '138 - 143', '133 - 138', '< 118', '≥ 158')",
        examples=["138 - 143"]
    )
    sc: str = Field(
        default="< 3.65",
        description="Serum Creatinine level in mg/dL interval (e.g., '< 3.65', '3.65 - 6.8', '6.8 - 9.95', '≥ 28.85')",
        examples=["< 3.65", "3.65 - 6.8"]
    )
    pot: str = Field(
        default="< 7.31",
        description="Serum Potassium level in mEq/L interval (e.g., '< 7.31', '38.18 - 42.59')",
        examples=["< 7.31", "38.18 - 42.59"]
    )
    hemo: str = Field(
        default="13.9 - 15.2",
        description="Hemoglobin level in g/dL interval (e.g., '15.2 - 16.5', '13.9 - 15.2', '< 6.1', '≥ 16.5')",
        examples=["15.2 - 16.5", "13.9 - 15.2"]
    )
    pcv: str = Field(
        default="41.3 - 45.2",
        description="Packed Cell Volume (Hematocrit %) interval (e.g., '41.3 - 45.2', '< 17.9', '≥ 49.1')",
        examples=["41.3 - 45.2"]
    )
    rbcc: str = Field(
        default="5.05 - 5.64",
        description="Red Blood Cell Count in M/µL interval (e.g., '5.05 - 5.64', '< 2.69', '≥ 7.41')",
        examples=["5.05 - 5.64"]
    )
    wbcc: str = Field(
        default="4980 - 7360",
        description="White Blood Cell Count in cells/cumm interval (e.g., '4980 - 7360', '< 4980', '19260 - 21640')",
        examples=["4980 - 7360"]
    )

    # --- Comorbidities & Clinical Symptoms (6 features) ---
    htn: Union[str, float, int] = Field(
        default="No",
        description="Hypertension diagnosis (e.g., 'No', 'Yes', 0.0, 1.0)",
        examples=["No", "Yes", 0.0]
    )
    dm: Union[str, float, int] = Field(
        default="No",
        description="Diabetes Mellitus diagnosis (e.g., 'No', 'Yes', 0.0, 1.0)",
        examples=["No", "Yes", 0.0]
    )
    cad: Union[str, float, int] = Field(
        default="No",
        description="Coronary Artery Disease diagnosis (e.g., 'No', 'Yes', 0.0, 1.0)",
        examples=["No", "Yes", 0.0]
    )
    appet: Union[str, float, int] = Field(
        default="Good",
        description="Appetite status (e.g., 'Good', 'Poor', 0.0, 1.0)",
        examples=["Good", "Poor", 0.0]
    )
    pe: Union[str, float, int] = Field(
        default="No",
        description="Pedal Edema (e.g., 'No', 'Yes', 0.0, 1.0)",
        examples=["No", "Yes", 0.0]
    )
    ane: Union[str, float, int] = Field(
        default="No",
        description="Clinical Anemia (e.g., 'No', 'Yes', 0.0, 1.0)",
        examples=["No", "Yes", 0.0]
    )

    model_config = ConfigDict(
        populate_by_name=True,
        extra="allow",
        json_schema_extra={
            "example": {
                "age": "59 - 66",
                "bp_diastolic": 76.0,
                "bp_limit": "70 - 80",
                "sg": "1.019 - 1.021",
                "al": "< 0",
                "su": "< 0",
                "rbc": "Normal",
                "pc": "Normal",
                "pcc": "Not Present",
                "ba": "Not Present",
                "bgr": "< 112",
                "bu": "< 48.1",
                "sod": "138 - 143",
                "sc": "< 3.65",
                "pot": "< 7.31",
                "hemo": "13.9 - 15.2",
                "pcv": "41.3 - 45.2",
                "rbcc": "5.05 - 5.64",
                "wbcc": "4980 - 7360",
                "htn": "No",
                "dm": "No",
                "cad": "No",
                "appet": "Good",
                "pe": "No",
                "ane": "No"
            }
        }
    )


# ---------------------------------------------------------------------------
# Explainability & Response Schemas
# ---------------------------------------------------------------------------

class ShapFactor(BaseModel):
    """Individual SHAP explainability contribution factor."""
    feature: str = Field(..., description="Raw or encoded feature identifier")
    display_feature: str = Field(
        ...,
        alias="displayFeature",
        serialization_alias="display_feature",
        description="Human-readable feature name with value"
    )
    value: Union[str, float, int] = Field(..., description="Observed input value")
    shap_value: float = Field(
        ...,
        alias="shapValue",
        serialization_alias="shap_value",
        description="SHAP impact score (log-odds contribution)"
    )
    direction: Literal["increasing", "decreasing"] = Field(
        ...,
        description="'increasing' pushes toward CKD, 'decreasing' pushes toward Not CKD"
    )
    category: Literal["Kidney", "Blood", "Symptom", "Demographic"] = Field(
        ...,
        description="Clinical domain category of the feature"
    )
    description: Optional[str] = Field(None, description="Clinical interpretation of the factor's impact")

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
    importance: float = Field(..., description="Mean absolute SHAP value or coefficient magnitude")
    rank: int = Field(..., description="Importance ranking order")
    description: str = Field(..., description="Clinical importance description")

    model_config = ConfigDict(populate_by_name=True)


class PredictionResponse(BaseModel):
    """Prediction outcome and comprehensive XAI report."""
    prediction: Literal["CKD", "NOT CKD"] = Field(..., description="Predicted diagnosis classification")
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
        description="Stratified clinical risk category based on prediction probability"
    )
    model_name: str = Field(
        default="Logistic Regression (XAI-Enabled)",
        alias="modelName",
        serialization_alias="model_name",
        description="Classifier architecture name"
    )
    explainability_method: str = Field(
        default="SHAP (SHapley Additive exPlanations)",
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
        description="Features that increase the predicted risk of Chronic Kidney Disease"
    )
    decreasing_factors: List[ShapFactor] = Field(
        default_factory=list,
        alias="decreasingFactors",
        serialization_alias="decreasing_factors",
        description="Features that reduce the risk (protective factors towards Not CKD)"
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
    model_type: str = Field(..., alias="modelType", serialization_alias="model_type")
    target: str
    positive_class: str = Field(..., alias="positiveClass", serialization_alias="positive_class")
    negative_class: str = Field(..., alias="negativeClass", serialization_alias="negative_class")
    dataset_rows: int = Field(..., alias="datasetRows", serialization_alias="dataset_rows")
    dataset_features: int = Field(..., alias="datasetFeatures", serialization_alias="dataset_features")
    cv_roc_auc: float = Field(..., alias="cvRocAuc", serialization_alias="cv_roc_auc")
    test_accuracy: float = Field(..., alias="testAccuracy", serialization_alias="test_accuracy")
    test_precision: float = Field(..., alias="testPrecision", serialization_alias="test_precision")
    test_recall: float = Field(..., alias="testRecall", serialization_alias="test_recall")
    test_f1: float = Field(..., alias="testF1", serialization_alias="test_f1")
    shap_enabled: bool = Field(..., alias="shapEnabled", serialization_alias="shap_enabled")
    input_feature_count: int = Field(..., alias="inputFeatureCount", serialization_alias="input_feature_count")
    input_features: List[str] = Field(..., alias="inputFeatures", serialization_alias="input_features")
    encoded_feature_count: int = Field(..., alias="encodedFeatureCount", serialization_alias="encoded_feature_count")

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
