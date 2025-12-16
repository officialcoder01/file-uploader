# File Uploader

Brief, self-hosted file uploader built with Node.js and Express.

## Overview

This project is a simple file-management web application that supports user authentication, file and folder CRUD, and file storage both on-disk and via Cloudinary. It follows a Model-View-Controller (MVC) architecture layered with a clear separation between routing, controllers, queries (data access), and views.

## Key Technologies

- **Express**: HTTP server and routing.
- **Prisma**: ORM used to model and access the PostgreSQL database and manage migrations.
- **PostgreSQL**: Relational database for persisting users, files, folders, and sessions.
- **passport.js**: Authentication middleware (local strategies) for user sign up / sign in flows.

Additional utilities used in the project include Cloudinary for optional cloud storage, EJS for server-side views, and middleware for file upload handling and sessions.

## Architecture

The project uses a layered MVC architecture:

- Models: Defined via `schema.prisma` and accessed through `queries/` helper modules.
- Views: EJS templates rendered from the `views/` directory.
- Controllers: Business logic lives in `controllers/` and is invoked by route handlers in `routes/`.
- Routes: Express routers group related endpoints (`authRouter`, `fileRouter`, `folderRouter`).
- Services/Integrations: External services (Cloudinary, file-system storage) are encapsulated behind small modules in `config/` and `controllers/`.

This clear separation makes the app easy to reason about, test, and extend.

## Project Structure (high level)

- `app.js` — App entry point and middleware setup.
- `controllers/` — Request handlers and business logic.
- `routes/` — Express routers connecting endpoints to controllers.
- `queries/` — Prisma-based data access helpers.
- `views/` — EJS templates for server-rendered pages.
- `public/` — Static assets (CSS).
- `uploads/` — Local file storage (fallback/primary depending on config).
- `prisma/` — Prisma schema and migrations.

## Quick Start

1. Install dependencies:

```
npm install
```

2. Set required environment variables (example):

- `DATABASE_URL` — PostgreSQL connection string
- `CLOUDINARY_URL` / Cloudinary creds (optional)
- `SESSION_SECRET` — secret for session signing

3. Run migrations and start the app:

```
npx prisma migrate deploy
npm run dev
```

## Notes

- Authentication is handled with `passport.js` (local strategy). Adjust or add OAuth strategies as needed.
- Prisma manages schema and migrations; Postgres is the production-grade persistence layer.
- The layered MVC approach keeps controllers thin and data access encapsulated for easier maintenance. 
