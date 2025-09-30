Backend Server (Express + MongoDB)
=================================

Prerequisites
-------------
- Node.js >= 18
- A MongoDB connection string

Environment Variables
---------------------
Create a `.env` file in `server/` based on the following:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=YOUR_MONGODB_URI
MONGODB_DBNAME=projectdb
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=7d
```

Install & Run
-------------
```
pnpm i   # or npm i
pnpm dev # or npm run dev
```

Scripts
-------
- `dev`: Run with nodemon
- `start`: Run in production mode
- `seed`: Seed initial data (admin and customer users)

Project Structure
-----------------
```
src/
  config/        # db connection, logger
  controllers/   # route handlers
  middleware/    # auth, validate, error handlers
  models/        # mongoose models
  routes/        # route modules
  seed/          # seeding scripts
  utils/         # helpers
  validation/    # request validation rules
  app.js         # express app
  index.js       # server entry
```

API
---
- `GET /api/health` health check
- `POST /api/auth/register` register
- `POST /api/auth/login` login
- `GET /api/auth/me` current user (requires Bearer token)
- Swagger docs: `GET /api/docs`

Notes
-----
- Follows REST best practices, security headers (helmet), sanitization, rate limiting, and structured logging.
- Add additional entities (Products, Shops, Orders) next with pagination/sort/filter.


