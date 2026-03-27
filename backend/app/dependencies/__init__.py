"""
Script Name  : __init__.py
Description  : Initialize the dependencies package
Author       : @tonybnya
"""

from app.dependencies.auth import get_current_user
from app.dependencies.rate_limit import rate_limiter

__all__ = ["get_current_user", "rate_limiter"]
