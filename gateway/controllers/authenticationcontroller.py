import requests
from fastapi import APIRouter, HTTPException, status, Request
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
            resp_data = response.json()
            return {
                "message": "Login Successful",
                "token": resp_data.get("token"),
                "user": resp_data.get("user")
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
def get_profile(request: Request):
    headers = {}
    auth_header = request.headers.get("Authorization")
    if auth_header:
        headers["Authorization"] = auth_header
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/users/profile", headers=headers)
        if response.status_code == 200:
            return {
                "message": "Profile fetched successfully",
                "user": response.json()
            }
        else:
            try:
                detail = response.json().get("detail") or response.json().get("message")
            except Exception:
                detail = "Failed to fetch profile"
            raise HTTPException(status_code=response.status_code, detail=detail)
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )