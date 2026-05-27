# FastAPI & React Frontend Connection Guide

## Overview
Your application now has proper integration between the FastAPI backend (Gateway) and React frontend (DSEDBD_group_project copy).

## Backend Configuration Changes
✅ **FastAPI server configured to run on port 8080**
✅ **All routes now prefixed with `/api`**
✅ **CORS enabled for frontend communication**
✅ **Authentication endpoints updated** (signup → register)

### Backend API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Fetch user profile
- `GET/POST/PUT/DELETE /api/categories` - Category management
- `GET/POST/PUT/DELETE /api/items` - Item management (products)
- `GET/POST/PUT/DELETE /api/courses` - Course management

## Frontend Configuration Changes
✅ **Environment variables setup**
✅ **Vite proxy configured for development**
✅ **Axios instance pointing to `/api`**

## Setup Instructions

### 1. Install Backend Dependencies
```bash
cd Gateway
pip install -r requirements.txt
```

### 2. Run FastAPI Backend
```bash
cd Gateway
python run.py
```
The backend will start on `http://localhost:8080`

### 3. Install Frontend Dependencies
```bash
cd DSEDBD_group_project\ copy
npm install
```

### 4. Run React Frontend
```bash
cd DSEDBD_group_project\ copy
npm run dev
```
The frontend will typically start on `http://localhost:5173`

## API Integration Details

### Frontend API Files
All API calls are made through `src/api/` modules:
- `authApi.js` - Authentication endpoints
- `categoryApi.js` - Category operations
- `itemApi.js` - Item/Product operations
- `productApi.js` - Deprecated (redirects to itemApi)
- Others for dashboard, search, orders, payments

### Environment Variables
The frontend uses the `.env` file with:
```
VITE_API_URL=http://localhost:8080/api
```

For production, update this to your server URL.

## Next Steps
1. Update backend controllers to add actual business logic
2. Add authentication tokens (JWT) for secure API calls
3. Implement error handling in interceptors
4. Add validation for API requests/responses
5. Set up database connections in backend services

## Troubleshooting

### Port Already in Use
- Backend: Change port in `run.py`
- Frontend: Vite will use the next available port

### CORS Errors
- Backend CORS is already enabled for all origins (*)
- For production, update CORS to specific domains

### API Not Responding
- Ensure backend is running on port 8080
- Check that `.env` file has correct `VITE_API_URL`
- Check browser console for detailed errors
