import requests
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

SPRING_BOOT_URL = "http://localhost:8080"


class SemanticSearchRequest(BaseModel):
    query: str


def fetch_all_items():
    items = []
    # 1. Fetch products
    try:
        prod_resp = requests.get(f"{SPRING_BOOT_URL}/products")
        if prod_resp.status_code == 200:
            for p in prod_resp.json():
                # Derive brand/tags to resemble original mock data
                name = p.get("name", "")
                brand = "Generic"
                if "Speaker" in name or "Earbuds" in name:
                    brand = "SoundWave"
                elif "Watch" in name:
                    brand = "PulseTech"
                elif "Book" in name:
                    brand = "TechPress"
                elif "Keyboard" in name or "Mouse" in name:
                    brand = "KeyPro"

                items.append({
                    "id": p.get("id"),
                    "title": name,
                    "name": name,
                    "description": p.get("description", ""),
                    "category": p.get("category", ""),
                    "brand": brand,
                    "price": p.get("price", 0.0),
                    "rating": p.get("rating", 0.0) or 4.5,
                    "imageUrl": p.get("imageUrl"),
                    "image": p.get("imageUrl"),
                    "inStock": True,
                    "difficulty": "Beginner",
                    "tags": ["electronics"] if p.get("category") == "Electronics" else []
                })
    except Exception:
        pass

    # 2. Fetch courses
    try:
        course_resp = requests.get(f"{SPRING_BOOT_URL}/courses")
        if course_resp.status_code == 200:
            for c in course_resp.json():
                name = c.get("courseName", "")
                brand = "EduSphere"
                if "Python" in name or "Bootcamp" in name:
                    brand = "CodeAcademy Plus"
                elif "React" in name:
                    brand = "ReactPros"

                items.append({
                    "id": c.get("id") + 1000, # Avoid ID collision
                    "title": name,
                    "name": name,
                    "description": c.get("description", ""),
                    "category": c.get("category", ""),
                    "brand": brand,
                    "price": 49.0 if "Beginner" in name else 89.0,
                    "rating": 4.8,
                    "imageUrl": c.get("imageUrl"),
                    "image": c.get("imageUrl"),
                    "inStock": True,
                    "difficulty": c.get("difficulty", "Beginner") or "Beginner",
                    "tags": ["programming"] if c.get("category") == "Courses" else []
                })
    except Exception:
        pass

    return items


@router.get("/search")
def search_items(
    q: Optional[str] = None,
    categories: Optional[str] = None,
    brands: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    rating: Optional[float] = None,
    difficulty: Optional[str] = None
):
    all_items = fetch_all_items()
    filtered = all_items

    # Text search
    if q and q.strip():
        term = q.strip().lower()
        filtered = [
            i for i in filtered
            if term in i["title"].lower() or
               term in i["description"].lower() or
               term in i["brand"].lower()
        ]

    # Categories filter
    if categories:
        cat_list = [c.strip().lower() for c in categories.split(",") if c.strip()]
        if cat_list:
            filtered = [i for i in filtered if i["category"].lower() in cat_list]

    # Brands filter
    if brands:
        brand_list = [b.strip().lower() for b in brands.split(",") if b.strip()]
        if brand_list:
            filtered = [i for i in filtered if i["brand"].lower() in brand_list]

    # Price filter
    if minPrice is not None:
        filtered = [i for i in filtered if i["price"] >= minPrice]
    if maxPrice is not None:
        filtered = [i for i in filtered if i["price"] <= maxPrice]

    # Rating filter
    if rating is not None:
        filtered = [i for i in filtered if i["rating"] >= rating]

    # Difficulty filter
    if difficulty:
        diff_list = [d.strip().lower() for d in difficulty.split(",") if d.strip()]
        if diff_list:
            filtered = [i for i in filtered if i["difficulty"].lower() in diff_list]

    return {
        "items": filtered,
        "results": filtered,
        "hasMore": False
    }


@router.post("/semantic-search")
def semantic_search(request: SemanticSearchRequest):
    # Mock semantic search using standard search
    return search_items(q=request.query)


@router.get("/filters")
def get_filters():
    all_items = fetch_all_items()
    # Extract unique brands
    brands = list(set(i["brand"] for i in all_items))
    if not brands:
        brands = ["SoundWave", "CodeAcademy Plus", "TechPress", "PulseTech", "LearnStack", "EduSphere", "AudioPro"]

    # Extract categories
    categories = list(set(i["category"] for i in all_items))
    if not categories:
        categories = ["Electronics", "Education", "Books", "Courses", "Learning Resources", "Technology Tools"]

    return {
        "categories": categories,
        "brands": brands,
        "tags": ["wireless", "programming", "education", "audio", "fitness", "cloud", "beginner", "study"],
        "difficulties": ["Beginner", "Intermediate", "Advanced"],
        "attributes": ["Brand", "Difficulty Level", "Price", "Rating"]
    }
