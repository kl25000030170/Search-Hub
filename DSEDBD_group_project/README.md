# SearchHub — Multi-Category Search & Filter Platform

React + Vite frontend for searching and filtering resources across multiple categories (Electronics, Education, Books, Courses, Learning Resources, Technology Tools).

## Features

- Global search with category, price, and rating filters
- Faceted search results with attributes and smart filtering UI
- Role-based access: **USER** (search/browse) and **ADMIN** (manage categories, items, attributes, analytics)
- JWT authentication (FastAPI gateway) with local mock fallback

## API Endpoints

Configure `VITE_API_URL` (default: `http://localhost:8080/api`):

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/search` | Search items with filters |
| GET | `/categories` | List categories |
| GET | `/items` | List items |
| POST | `/items` | Create item |
| PUT | `/items/{id}` | Update item |
| DELETE | `/items/{id}` | Delete item |
| POST | `/auth/login` | Login (JWT) |
| POST | `/auth/register` | Register |

## Demo Accounts

- **User:** `user@example.com` / `password123` — search, products, user dashboard with courses
- **Admin:** `admin@example.com` / `admin123` — full admin panel at `/admin`

### Admin Panel (`/admin`)

- Dashboard stats (users, products, courses, categories, queries, views)
- User analytics table with search, filters, pagination
- Products & courses management with modals and image upload preview
- Category cards with add/delete
- Query analytics charts (frontend demo data)

Admin changes sync instantly to user-facing pages via `useCatalogStore` (no backend).

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
```
