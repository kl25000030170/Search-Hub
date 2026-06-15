import requests
from fastapi import APIRouter, HTTPException, Query, Request, Response

router = APIRouter()

NODE_JS_URL = "http://localhost:5001"


def get_forward_headers(request: Request):
    headers = {}
    auth_header = request.headers.get("Authorization")
    if auth_header:
        headers["Authorization"] = auth_header
    return headers


@router.post("/search")
async def log_search(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    try:
        resp = requests.post(
            f"{NODE_JS_URL}/api/search",
            json=body,
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.get("/search/history/{user_id}")
def get_search_history(user_id: str, request: Request):
    try:
        resp = requests.get(
            f"{NODE_JS_URL}/api/search/history/{user_id}",
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.get("/search/recent/{user_id}")
def get_recent_searches(user_id: str, request: Request):
    try:
        resp = requests.get(
            f"{NODE_JS_URL}/api/search/recent/{user_id}",
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.get("/search/trending")
def get_trending_keywords(request: Request):
    try:
        resp = requests.get(
            f"{NODE_JS_URL}/api/search/trending",
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.get("/search/categories")
def get_popular_categories(request: Request):
    try:
        resp = requests.get(
            f"{NODE_JS_URL}/api/search/categories",
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.get("/search/suggestions")
def get_search_suggestions(q: str = Query(...), request: Request = None):
    try:
        resp = requests.get(
            f"{NODE_JS_URL}/api/search/suggestions",
            params={"q": q},
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.get("/admin/dashboard")
def get_admin_dashboard(request: Request):
    try:
        resp = requests.get(
            f"{NODE_JS_URL}/api/admin/dashboard",
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.delete("/search/history/{history_id}")
def delete_search_history_item(history_id: str, request: Request):
    try:
        resp = requests.delete(
            f"{NODE_JS_URL}/api/search/history/{history_id}",
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.delete("/search/history/user/{user_id}")
def delete_user_search_history(user_id: str, request: Request):
    try:
        resp = requests.delete(
            f"{NODE_JS_URL}/api/search/history/user/{user_id}",
            headers=get_forward_headers(request)
        )
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.get("/test")
def test_analytics(request: Request):
    try:
        resp = requests.get(f"{NODE_JS_URL}/api/test")
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")


@router.get("/test/db")
def test_analytics_db(request: Request):
    try:
        resp = requests.get(f"{NODE_JS_URL}/api/test/db")
        return Response(content=resp.content, status_code=resp.status_code, media_type="application/json")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Analytics service unavailable: {str(e)}")
