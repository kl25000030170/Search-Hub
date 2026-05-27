from pydantic import BaseModel


class UserSignup(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class CategoryCreate(BaseModel):
    name: str
    description: str


class Category(CategoryCreate):
    id: int


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    rating: float
    imageUrl: str = None


class Product(ProductCreate):
    id: int


class CourseCreate(BaseModel):
    title: str
    description: str
    difficulty: str = "Beginner"
    category: str
    imageUrl: str = None


class Course(CourseCreate):
    id: int

