"""
Script Name  : __init__.py
Description  : Initialize the models package
Author       : @tonybnya
"""

from app.models.user import User
from app.models.job import JobApplication

__all__ = ["User", "JobApplication"]
