import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application configuration and environment variables."""

    # Project metadata
    PROJECT_NAME: str = "RenalInsight CKD Prediction API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = (
        "Production-ready Explainable AI (XAI) backend for Chronic Kidney Disease "
        "risk assessment, clinical feature importance, and SHAP explanations."
    )
    API_V1_PREFIX: str = ""

    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    MODELS_DIR: Path = BASE_DIR / "models"

    FINAL_MODEL_PATH: Path = MODELS_DIR / "final_model.joblib"
    SHAP_EXPLAINER_PATH: Path = MODELS_DIR / "shap_explainer.joblib"
    FEATURE_NAMES_PATH: Path = MODELS_DIR / "feature_names.joblib"
    MODEL_METADATA_PATH: Path = MODELS_DIR / "model_metadata.json"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
