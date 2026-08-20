# SCNA backend setup

1. Copy `.env.example` to `.env`.
2. Put your MongoDB Atlas connection string in `MONGODB_URI`.
3. Keep `MONGODB_DB=scna`.
4. Run `npm install`, then `npm run dev`.
5. Open `/api/health` to verify the app server. After MongoDB is configured, resource GET endpoints seed the original demo dataset on first read.

## API
- POST `/api/auth/login`
- GET `/api/dashboard`
- GET/POST `/api/researchers`
- GET/POST `/api/projects`
- GET/POST `/api/publications`
- GET/POST `/api/conferences`
- DELETE `/api/<resource>/<id>`

The original SCNA visual UI is intentionally preserved. The login page keeps its original navy/blue theme, layout, buttons and styling; only the submit action is wired to the backend.
