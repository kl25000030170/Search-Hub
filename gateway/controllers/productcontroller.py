import requests
from fastapi import APIRouter, HTTPException
from typing import List

from models.schemas import (
    Product,
    ProductCreate
)

router = APIRouter()

SPRING_BOOT_URL = "http://localhost:8080"


def to_frontend_product(sb_prod):
    return {
        "id": sb_prod.get("id"),
        "name": sb_prod.get("name"),
        "description": sb_prod.get("description"),
        "price": sb_prod.get("price"),
        "category": sb_prod.get("category"),
        "rating": sb_prod.get("rating", 0.0) or 0.0,
        "imageUrl": sb_prod.get("imageUrl")
    }


@router.get("/", response_model=List[Product])
def get_products():
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/products")
        if response.status_code == 200:
            return [to_frontend_product(p) for p in response.json()]
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch products"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int):
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/products/{product_id}")
        if response.status_code == 200:
            return to_frontend_product(response.json())
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Product not found"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.post("/", response_model=Product)
def create_product(product: ProductCreate):
    try:
        response = requests.post(
            f"{SPRING_BOOT_URL}/products",
            json=product.dict()
        )
        if response.status_code in [200, 201]:
            return to_frontend_product(response.json())
        else:
            try:
                detail = response.json().get("message", "Failed to create product")
            except Exception:
                detail = response.text or "Failed to create product"
            raise HTTPException(status_code=response.status_code, detail=detail)
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    updated_product: ProductCreate
):
    try:
        response = requests.put(
            f"{SPRING_BOOT_URL}/products/{product_id}",
            json=updated_product.dict()
        )
        if response.status_code == 200:
            return to_frontend_product(response.json())
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Product not found"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.delete("/{product_id}")
def delete_product(product_id: int):
    try:
        # Check if exists first to return deleted metadata
        check_resp = requests.get(f"{SPRING_BOOT_URL}/products/{product_id}")
        if check_resp.status_code != 200:
            raise HTTPException(status_code=404, detail="Product not found")
        deleted_prod = to_frontend_product(check_resp.json())

        response = requests.delete(f"{SPRING_BOOT_URL}/products/{product_id}")
        if response.status_code in [200, 204]:
            return {
                "message": "Product Deleted",
                "deleted": deleted_prod
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to delete product"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )