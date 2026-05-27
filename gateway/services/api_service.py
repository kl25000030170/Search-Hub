from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from controllers.authenticationcontroller import router as auth_router
from controllers.categorycontroller import router as category_router
from controllers.productcontroller import router as product_router
from controllers.coursecontroller import router as course_router
from controllers.searchcontroller import router as search_router
from controllers.ordercontroller import router as order_router
from controllers.usercontroller import router as user_router

app = FastAPI(
    title="SearchHub Gateway",
    version="1.0.0"
)

@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    return RedirectResponse(url="/docs")


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

# =========================
# ROUTERS
# =========================

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    category_router,
    prefix="/api/categories",
    tags=["Categories"]
)

app.include_router(
    product_router,
    prefix="/api/items",
    tags=["Items"]
)

app.include_router(
    course_router,
    prefix="/api/courses",
    tags=["Courses"]
)

app.include_router(
    search_router,
    prefix="/api",
    tags=["Search & Filters"]
)

app.include_router(
    order_router,
    prefix="/api",
    tags=["Orders & Payments"]
)

app.include_router(
    user_router,
    prefix="/users",
    tags=["Users"]
)