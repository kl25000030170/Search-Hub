import requests
from fastapi import APIRouter, HTTPException
from typing import List

from models.schemas import (
    Category,
    CategoryCreate
)

router = APIRouter()

SPRING_BOOT_URL = "http://localhost:8080"


def to_frontend_category(sb_cat):
    return {
        "id": sb_cat.get("id"),
        "name": sb_cat.get("categoryName"),
        "description": ""
    }


@router.get("/", response_model=List[Category])
def get_categories():
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/categories")
        if response.status_code == 200:
            return [to_frontend_category(c) for c in response.json()]
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch categories"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.get("/{category_id}", response_model=Category)
def get_category(category_id: int):
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/categories/{category_id}")
        if response.status_code == 200:
            return to_frontend_category(response.json())
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Category not found"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.post("/", response_model=Category)
def create_category(category: CategoryCreate):
    payload = {
        "categoryName": category.name
    }
    try:
        response = requests.post(f"{SPRING_BOOT_URL}/categories", json=payload)
        if response.status_code in [200, 201]:
            return to_frontend_category(response.json())
        else:
            try:
                detail = response.json().get("message", "Failed to create category")
            except Exception:
                detail = response.text or "Failed to create category"
            raise HTTPException(status_code=response.status_code, detail=detail)
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.put("/{category_id}", response_model=Category)
def update_category(
    category_id: int,
    updated_category: CategoryCreate
):
    payload = {
        "categoryName": updated_category.name
    }
    try:
        response = requests.put(
            f"{SPRING_BOOT_URL}/categories/{category_id}",
            json=payload
        )
        if response.status_code == 200:
            return to_frontend_category(response.json())
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Category not found"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.delete("/{category_id}")
def delete_category(category_id: int):
    try:
        # First check if it exists so we can return the deleted object
        check_resp = requests.get(f"{SPRING_BOOT_URL}/categories/{category_id}")
        if check_resp.status_code != 200:
            raise HTTPException(status_code=404, detail="Category not found")
        deleted_cat = to_frontend_category(check_resp.json())

        response = requests.delete(f"{SPRING_BOOT_URL}/categories/{category_id}")
        if response.status_code in [200, 204]:
            return {
                "message": "Category Deleted",
                "deleted": deleted_cat
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to delete category"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )