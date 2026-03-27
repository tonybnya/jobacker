"""
Script Name  : main.py
Description  : FastAPI application entry point with API versioning,
               rate limiting, caching, and CORS configuration
Author       : @tonybnya
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base
from app.routers import auth_router, jobs_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifespan events.
    Create database tables on startup.
    """
    Base.metadata.create_all(bind=engine)
    yield


# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app with API versioning
app = FastAPI(
    title="JobPipeline API",
    description="A job application tracker API following 12 best practices",
    version="1.0.0",
    prefix="/api/v1",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
    expose_headers=[
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
        "X-Pagination-Next-Cursor",
        "X-Pagination-Has-More",
    ],
)


# Custom exception handler for standardized error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to return standardized error responses.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
                "action": "Please try again later or contact support",
            }
        },
    )


# Include routers with versioning
app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"],
)

app.include_router(
    jobs_router,
    prefix="/api/v1/jobs",
    tags=["Job Applications"],
)


@app.get("/")
async def root():
    """
    Root endpoint - redirects to API documentation.
    """
    return {
        "message": "Welcome to JobPipeline API",
        "documentation": "/docs",
        "version": "v1.0.0",
    }


@app.get("/api/v1/health")
async def health_check():
    """
    Health check endpoint for monitoring.
    """
    return {"status": "healthy", "version": "1.0.0"}
