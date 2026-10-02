import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.prediction import model_service
from app.schemas import (
    ApiStatusResponse,
    HealthResponse,
    ModelInfoResponse,
    PatientInputSchema,
    PredictionResponse,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger("renalinsight.api")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan context manager for startup artifact loading and graceful shutdown."""
    logger.info("Initializing RenalInsight backend service...")
    try:
        model_service.load_artifacts()
        logger.info("ML model and SHAP explainer ready for inference.")
    except Exception as e:
        logger.critical(f"Fatal error loading model artifacts: {e}", exc_info=True)
        raise e
    yield
    logger.info("Shutting down RenalInsight backend service...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX if settings.CORS_ORIGIN_REGEX else None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Exception Handlers
# ---------------------------------------------------------------------------

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Provides clear, formatted error messages for payload validation failures."""
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        errors.append({"field": field, "message": msg})

    logger.warning(f"Request validation failure on {request.url.path}: {errors}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "The input data failed clinical schema validation.",
            "details": errors,
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Standardizes HTTP error responses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Error",
            "status_code": exc.status_code,
            "message": exc.detail,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catches unhandled errors gracefully without crashing the server."""
    logger.error(f"Unhandled server error at {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred during prediction processing.",
            "detail": str(exc),
        },
    )


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get(
    "/",
    response_model=ApiStatusResponse,
    summary="API Status",
    description="Returns the status of the RenalInsight API service with quick links.",
    tags=["General"],
)
async def root(request: Request) -> ApiStatusResponse:
    base_url = str(request.base_url).rstrip("/")
    return ApiStatusResponse(
        name=settings.PROJECT_NAME,
        version=settings.VERSION,
        status="active",
        docs_url=f"{base_url}/docs",
        health_url=f"{base_url}/health",
        model_info_url=f"{base_url}/model-info",
        predict_url=f"{base_url}/predict",
    )


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health & Model Status",
    description="Reports the operational health of the application, ML pipeline, and SHAP explainer.",
    tags=["System"],
)
async def health_check() -> HealthResponse:
    is_ready = model_service.is_ready and model_service.model is not None and model_service.explainer is not None
    return HealthResponse(
        status="healthy" if is_ready else "degraded",
        model_loaded=model_service.model is not None,
        shap_loaded=model_service.explainer is not None,
        version=settings.VERSION,
    )


@app.get(
    "/model-info",
    response_model=ModelInfoResponse,
    summary="Model Metadata & Performance",
    description="Returns trained model metadata, validation metrics (Accuracy, ROC-AUC, F1), and feature mappings.",
    tags=["Model"],
)
async def get_model_info() -> ModelInfoResponse:
    if not model_service.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model service is currently unavailable or still initializing.",
        )
    try:
        return model_service.get_model_info()
    except Exception as e:
        logger.error(f"Error retrieving model info: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve model info: {str(e)}",
        )


@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict CKD Risk & Generate SHAP Explanations",
    description=(
        "Performs machine learning inference on clinical patient parameters and calculates "
        "local SHAP explainability factors indicating risk-increasing and risk-decreasing biomarkers."
    ),
    tags=["Inference & XAI"],
    status_code=status.HTTP_200_OK,
)
async def predict_ckd(patient_data: PatientInputSchema) -> PredictionResponse:
    if not model_service.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model service is not loaded.",
        )

    try:
        result = model_service.predict(patient_data)
        return result
    except Exception as e:
        logger.error(f"Prediction inference failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
