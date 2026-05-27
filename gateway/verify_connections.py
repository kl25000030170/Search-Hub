import requests
import json
import time

SPRING_BOOT_URL = "http://localhost:8080"
GATEWAY_URL = "http://localhost:8000/api"

print("=" * 60)
print("TESTING SPRING BOOT ENDPOINTS")
print("=" * 60)

try:
    # 1. Test get all users
    resp = requests.get(f"{SPRING_BOOT_URL}/users")
    print(f"GET /users: Status {resp.status_code}")
    print(f"Users found: {[u['email'] for u in resp.json()]}")

    # 2. Test get products
    resp = requests.get(f"{SPRING_BOOT_URL}/products")
    print(f"GET /products: Status {resp.status_code}")
    print(f"Products count: {len(resp.json())}")

except Exception as e:
    print(f"Spring Boot connection failed: {e}")

print("\n" + "=" * 60)
print("TESTING FASTAPI GATEWAY ENDPOINTS (REGISTRATION & ROLES)")
print("=" * 60)

try:
    # 1. Test registration with name/email/password matching frontend
    test_email = f"test_user_{int(time.time())}@gmail.com"
    reg_payload = {
        "name": "Frontend Test User",
        "email": test_email,
        "password": "password123"
    }
    resp = requests.post(f"{GATEWAY_URL}/auth/register", json=reg_payload)
    print(f"POST /auth/register: Status {resp.status_code}")
    print(f"Reg Response: {json.dumps(resp.json(), indent=2)}")
    
    # 2. Test getting all users from the new FastAPI /api/users endpoint
    resp = requests.get(f"{GATEWAY_URL}/users")
    print(f"GET /users: Status {resp.status_code}")
    users = resp.json()
    print(f"Users list: {[{'id': u['id'], 'email': u['email'], 'role': u['role']} for u in users]}")
    
    # Find our registered test user
    target_user = None
    for u in users:
        if u["email"] == test_email:
            target_user = u
            break
            
    if target_user:
        print(f"\nFound test user with ID {target_user['id']}. Changing role to ADMIN...")
        
        # 3. Test changing role using PUT /api/users/{id}
        update_payload = {
            "id": target_user["id"],
            "name": target_user["name"],
            "email": target_user["email"],
            "role": "ADMIN"
        }
        resp = requests.put(f"{GATEWAY_URL}/users/{target_user['id']}", json=update_payload)
        print(f"PUT /users/{target_user['id']}: Status {resp.status_code}")
        print(f"Updated user role in response: {resp.json().get('role')}")
        
        # 4. Verify again from database using Spring Boot directly
        resp = requests.get(f"{SPRING_BOOT_URL}/users/{target_user['id']}")
        print(f"Spring Boot GET /users/{target_user['id']}: Status {resp.status_code}")
        print(f"Role in Database: {resp.json().get('role')}")
    else:
        print("Test user not found in user list.")

except Exception as e:
    print(f"FastAPI Gateway connection failed: {e}")
