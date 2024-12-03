# from typing import List
#
# from fastapi import Depends
#
# from app.auth.auth import get_current_user
# from app.custom_exception import NotAuthorized, UserNotVerified
# from app.models import User
#
#
# class RoleChecker:
#     """
#     Checks the role of user
#     """
#
#     def __init__(self, allowed_roles: List[str]):
#         self.allowed_roles = allowed_roles
#
#     def __call__(self, current_user: User = Depends(get_current_user)):
#         if not current_user.is_verified:
#             raise UserNotVerified
#         if current_user.role not in self.allowed_roles:
#             raise NotAuthorized
#         return True
