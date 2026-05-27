import requests
from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()

SPRING_BOOT_URL = "http://localhost:8080"


@router.post("/")
def create_user(user_data: dict):
    try:
        response = requests.post(
            f"{SPRING_BOOT_URL}/users",
            json=user_data
        )
        if response.status_code in [200, 201]:
            return response.json()
        else:
            try:
                detail = response.json().get("detail") or response.json().get("message")
            except Exception:
                detail = None
            raise HTTPException(
                status_code=response.status_code,
                detail=detail or "Failed to create user"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.get("/")
def get_users():
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/users")
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch users"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.get("/{user_id}")
def get_user(user_id: int):
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/users/{user_id}")
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="User not found"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.put("/{user_id}")
def update_user(user_id: int, user_data: dict):
    try:
        response = requests.put(
            f"{SPRING_BOOT_URL}/users/{user_id}",
            json=user_data
        )
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to update user"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.delete("/{user_id}")
def delete_user(user_id: int):
    try:
        response = requests.delete(f"{SPRING_BOOT_URL}/users/{user_id}")
        if response.status_code in [200, 204]:
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to delete user"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )
