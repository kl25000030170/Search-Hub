import requests
from fastapi import APIRouter, HTTPException, status
from models.schemas import (
    UserSignup,
    UserLogin
)

router = APIRouter()

SPRING_BOOT_URL = "http://localhost:8080"


@router.post("/register")
def register(user: UserSignup):
    payload = {
        "name": user.name,
        "email": user.email,
        "password": user.password,
        "role": "USER"
    }
    try:
        response = requests.post(f"{SPRING_BOOT_URL}/users", json=payload)
        if response.status_code in [200, 201]:
            return {
                "message": "Registration Successful",
                "user": response.json()
            }
        else:
            try:
                detail = response.json().get("message", "Registration failed")
            except Exception:
                detail = response.text or "Registration failed"
            raise HTTPException(status_code=response.status_code, detail=detail)
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.post("/login")
def login(user: UserLogin):
    payload = {
        "email": user.email,
        "password": user.password
    }
    try:
        response = requests.post(f"{SPRING_BOOT_URL}/users/login", json=payload)
        if response.status_code == 200:
            user_data = response.json()
            # Generate a simple mock JWT token
            mock_token = f"mock-jwt-token-{user_data.get('id')}-{user_data.get('email')}"
            return {
                "message": "Login Successful",
                "token": mock_token,
                "user": user_data
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Invalid email or password"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.get("/profile")
def get_profile():
    return {
        "message": "Profile fetched successfully",
        "user": {}
    }