# SCNA — Production / Deployment Guide

SCNA is a TanStack Start full-stack React app with MongoDB Atlas persistence. The production target is a Node/Nitro server so the MongoDB Node driver stays server-side.

## Local

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI`, `MONGODB_DB`, `SCNA_ADMIN_EMAIL`, and `SCNA_ADMIN_PASSWORD`.
3. Run `npm install`.
4. Run `npm run dev`.

## Production build

```bash
npm install
npm run build
npm run start
```

The production server listens on the platform-provided `PORT` (Nitro/node-server).

## Railway

1. Push this folder to GitHub.
2. Create a Railway service from the repository.
3. Set the four environment variables in Railway.
4. Railway can use `npm run build` and `npm run start`.

## Docker

```bash
docker build -t scna .
docker run -p 3000:3000 --env-file .env scna
```

## MongoDB Atlas

Create a database user and allow the deployed server's network access. Do not commit `.env` or expose the Atlas URI in screenshots.

## What is persisted

- Researchers: create, edit, delete
- Projects: create, edit, delete
- Publications: create, edit, delete
- Conferences: create, edit, delete
- Profile/institution settings and profile photo
- Password changes are hashed with scrypt before storage
- Dashboard counts are read from MongoDB
- Reports can be printed to PDF and exported as CSV
