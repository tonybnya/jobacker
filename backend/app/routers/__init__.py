"""
Script Name  : __init__.py
Description  : Initialize the routers package
Author       : @tonybnya
"""

from app.routers.auth import router as auth_router
from app.routers.jobs import router as jobs_router

__all__ = ["auth_router", "jobs_router"]
