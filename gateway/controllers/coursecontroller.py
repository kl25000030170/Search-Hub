import requests
from fastapi import APIRouter, HTTPException
from typing import List

from models.schemas import (
    Course,
    CourseCreate
)

router = APIRouter()

SPRING_BOOT_URL = "http://localhost:8080"


def to_frontend_course(sb_course):
    return {
        "id": sb_course.get("id"),
        "title": sb_course.get("courseName"),
        "description": sb_course.get("description"),
        "difficulty": sb_course.get("difficulty", "Beginner") or "Beginner",
        "category": sb_course.get("category"),
        "imageUrl": sb_course.get("imageUrl")
    }


def to_backend_course_payload(course: CourseCreate):
    return {
        "courseName": course.title,
        "description": course.description,
        "difficulty": course.difficulty,
        "category": course.category,
        "imageUrl": course.imageUrl
    }


@router.get("/", response_model=List[Course])
def get_courses():
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/courses")
        if response.status_code == 200:
            return [to_frontend_course(c) for c in response.json()]
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch courses"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.get("/{course_id}", response_model=Course)
def get_course(course_id: int):
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/courses/{course_id}")
        if response.status_code == 200:
            return to_frontend_course(response.json())
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Course not found"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.post("/", response_model=Course)
def create_course(course: CourseCreate):
    payload = to_backend_course_payload(course)
    try:
        response = requests.post(f"{SPRING_BOOT_URL}/courses", json=payload)
        if response.status_code in [200, 201]:
            return to_frontend_course(response.json())
        else:
            try:
                detail = response.json().get("message", "Failed to create course")
            except Exception:
                detail = response.text or "Failed to create course"
            raise HTTPException(status_code=response.status_code, detail=detail)
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.put("/{course_id}", response_model=Course)
def update_course(
    course_id: int,
    updated_course: CourseCreate
):
    payload = to_backend_course_payload(updated_course)
    try:
        response = requests.put(
            f"{SPRING_BOOT_URL}/courses/{course_id}",
            json=payload
        )
        if response.status_code == 200:
            return to_frontend_course(response.json())
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Course not found"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )


@router.delete("/{course_id}")
def delete_course(course_id: int):
    try:
        # Check if exists first to return deleted metadata
        check_resp = requests.get(f"{SPRING_BOOT_URL}/courses/{course_id}")
        if check_resp.status_code != 200:
            raise HTTPException(status_code=404, detail="Course not found")
        deleted_course = to_frontend_course(check_resp.json())

        response = requests.delete(f"{SPRING_BOOT_URL}/courses/{course_id}")
        if response.status_code in [200, 204]:
            return {
                "message": "Course Deleted",
                "deleted": deleted_course
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to delete course"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"Spring Boot backend unavailable: {str(e)}"
        )