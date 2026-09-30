# 🏠 HouseHunt — House Rental Platform (MERN)

A full-stack rental marketplace: renters search and request homes; owners/agents list properties and approve requests.

**Stack:** HTML, CSS, JavaScript, React.js (Vite), Node.js, Express.js, MongoDB (Mongoose), JWT auth.

## Features
- Register/login as **Renter** or **Owner/Agent** (JWT + bcrypt)
- Search & filter: keyword, city, type, rent range, BHK, amenities, sort by price
- Property detail page with amenities, owner contact, virtual-tour link
- Renters send rental/visit requests; owners approve or reject (approved property becomes unavailable)
- Owner dashboard: add/delete listings, manage incoming requests
- Responsive UI

## Folder structure
```
HouseHunt/
├── server/   (Express API: config, models, middleware, routes, seed.js)
└── client/   (React app: pages, AuthContext, api helper, styles)
```

## Run locally
Prerequisites: Node 18+, MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. Backend
cd server
cp .env.example .env        # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed                # optional demo data
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```
Demo logins (after seeding, password `password123`): `owner@househunt.com`, `renter@househunt.com`.

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/properties?q&city&type&minRent&maxRent&bedrooms&amenity&sort | public |
| GET | /api/properties/:id | public |
| POST/PUT/DELETE | /api/properties(/:id) | owner |
| GET | /api/properties/mine/list | owner |
| POST | /api/bookings | renter |
| GET | /api/bookings/mine | renter |
| GET | /api/bookings/received | owner |
| PATCH | /api/bookings/:id | owner (approve/reject) |
