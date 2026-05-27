from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import time

router = APIRouter()

# In-memory database for orders
orders_db = []


class OrderCreateRequest(BaseModel):
    items: List[Dict[str, Any]]
    totalAmount: float
    shippingAddress: Dict[str, Any]
    paymentMethod: str


class PaymentProcessRequest(BaseModel):
    orderId: Optional = None
    cardNumber: str
    expiryDate: str
    cvv: str
    amount: float


@router.post("/orders")
def create_order(request: Dict[str, Any]):
    order_id = f"order-{int(time.time())}"
    new_order = {
        "id": order_id,
        "items": request.get("items", []),
        "totalAmount": request.get("totalAmount", 0.0),
        "shippingAddress": request.get("shippingAddress", {}),
        "paymentMethod": request.get("paymentMethod", "Credit Card"),
        "status": "Processing",
        "createdAt": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    orders_db.append(new_order)
    return {
        "success": True,
        "message": "Order created successfully",
        "order": new_order
    }


@router.get("/orders")
def get_orders():
    return orders_db


@router.get("/orders/{order_id}")
def get_order_details(order_id: str):
    for o in orders_db:
        if o["id"] == order_id:
            return o
    raise HTTPException(status_code=404, detail="Order not found")


@router.post("/orders/{order_id}/cancel")
def cancel_order(order_id: str):
    for o in orders_db:
        if o["id"] == order_id:
            o["status"] = "Cancelled"
            return {
                "success": True,
                "message": "Order cancelled successfully",
                "order": o
            }
    raise HTTPException(status_code=404, detail="Order not found")


@router.post("/payment/process")
def process_payment(request: Dict[str, Any]):
    # Mock payment processing
    return {
        "success": True,
        "transactionId": f"tx-{int(time.time())}",
        "message": "Payment processed successfully"
    }
