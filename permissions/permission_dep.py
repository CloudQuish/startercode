from fastapi import HTTPException, status, Depends

from utils.oauth import get_current_user

async def admin_permission_right(current_user = Depends(get_current_user)):
    """
    This function is a dependency used to enforce admin-level permissions. It checks 
    if the current user is an admin. If the user is not an admin, it raises an HTTP 
    403 Forbidden error with a message informing the user that they do not have permission 
    to create an event. It suggests contacting the service provider in case this is a mistake.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have permssion to create event. If this is mistake please contact the service provider"
        )