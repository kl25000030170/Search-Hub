import requests
from fastapi import APIRouter, HTTPException, Request

router = APIRouter()

SPRING_BOOT_URL = "http://localhost:8080"


def get_forward_headers(request: Request):
    headers = {}
    auth_header = request.headers.get("Authorization")
    if auth_header:
        headers["Authorization"] = auth_header
    return headers


@router.get("/analytics")
def get_dashboard_analytics(request: Request):
    try:
        response = requests.get(
            f"{SPRING_BOOT_URL}/dashboard/analytics",
            headers=get_forward_headers(request)
        )
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch dashboard statistics"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )
