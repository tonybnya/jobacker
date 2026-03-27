"""
Script Name  : __init__.py
Description  : Initialize the schemas package
Author       : @tonybnya
"""

from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.schemas.job import (
    JobApplicationCreate,
    JobApplicationResponse,
    JobApplicationUpdate,
)

__all__ = [
    "UserCreate",
    "UserResponse",
    "UserLogin",
    "JobApplicationCreate",
    "JobApplicationResponse",
    "JobApplicationUpdate",
]
