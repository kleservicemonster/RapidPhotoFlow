# RapidPhotoFlow

A lightweight **upload → processing → review** photo workflow application.

## Tech Stack

| Component           | Technology                                                                       |
| ------------------- | -------------------------------------------------------------------------------- |
| **Monorepo**        | [Turborepo](https://turborepo.com/)                                              |
| **Backend**         | [AdonisJS v6](https://docs.adonisjs.com/) (TypeScript)                           |
| **Frontend**        | [Next.js 16](https://nextjs.org/) (App Router, TypeScript)                       |
| **Database**        | PostgreSQL 16                                                                    |
| **Cache & Queue**   | Redis 7 via [@rlanz/bull-queue](https://github.com/RomainLanz/adonis-bull-queue) |
| **Package Manager** | Bun                                                                              |

## Project Structure

```
RapidPhotoFlow/
├── apps/
│   ├── backend/         # AdonisJS v6 API
│   │   ├── app/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   └── services/
│   │   ├── commands/    # Optional: separate worker command
│   │   ├── config/
│   │   ├── start/
│   │   └── database/migrations/
│   └── frontend/        # Next.js 16 App
│       └── src/
│           ├── app/     # Pages
│           ├── components/
│           └── lib/     # API client
├── packages/
│   └── shared/          # Shared types & constants
├── docker-compose.yml
└── turbo.json
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Docker](https://www.docker.com/) & Docker Compose

### Option 1: Full Docker Stack

```bash
docker-compose up --build
```

**URLs:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3333

### Option 2: Local Development

1. **Start infrastructure:**

```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. **Install dependencies:**

```bash
bun install
```

3. **Build shared package:**

```bash
cd packages/shared && bun run build && cd ../..
```

4. **Setup environment files:**

```bash
# Backend - copy and edit
cp apps/backend/.env.example apps/backend/.env

# Frontend - copy and edit
echo "NEXT_PUBLIC_API_URL=http://localhost:3333" > apps/frontend/.env.local
```

5. **Run migrations:**

```bash
bun run db:migrate
```

6. **Start development servers:**

```bash
# Terminal 1 - Backend
bun run dev:backend

# Terminal 2 - Frontend
bun run dev:frontend

# Terminal 3 - Worker
bun run dev:worker
```

## API Endpoints

### Photos

| Method  | Endpoint             | Description                                   |
| ------- | -------------------- | --------------------------------------------- |
| `POST`  | `/photos`            | Upload photos (multipart, field: `files`)     |
| `GET`   | `/photos`            | List photos (`?status=`, `?page=`, `?limit=`) |
| `GET`   | `/photos/:id`        | Get photo with events                         |
| `PATCH` | `/photos/:id/status` | Update status (internal)                      |
| `GET`   | `/photos/:id/file`   | Serve photo file                              |

### Events

| Method | Endpoint  | Description                                    |
| ------ | --------- | ---------------------------------------------- |
| `GET`  | `/events` | List events (`?photoId=`, `?page=`, `?limit=`) |

### Health

| Method | Endpoint  | Description  |
| ------ | --------- | ------------ |
| `GET`  | `/health` | Health check |

## Workflow

```
UPLOADED → QUEUED → PROCESSING → COMPLETED (90%)
                              → FAILED (10%)
```

## Scripts

| Command            | Description                 |
| ------------------ | --------------------------- |
| `bun dev`          | Run all apps in parallel    |
| `bun dev:backend`  | Run AdonisJS server         |
| `bun dev:frontend` | Run Next.js server          |
| `bun dev:worker`   | Run queue worker separately |
| `bun build`        | Build all apps              |
| `bun db:migrate`   | Run migrations              |
| `bun docker:up`    | Start Docker stack          |
| `bun docker:dev`   | Start infrastructure only   |

## Environment Variables

### Backend

```env
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=your-32-character-secret-key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=rapidphotoflow

# Redis (also used for Bull queue)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Queue Processing

Job queues are powered by [@rlanz/bull-queue](https://github.com/RomainLanz/adonis-bull-queue), which uses Redis as the backing store.

- **Development**: Run `bun run dev:worker` to process jobs
- **Production**: Docker Compose includes a separate worker service for scaling

## Created With

This project was initialized using:

- **Turborepo**: `bunx create-turbo@latest`
- **AdonisJS**: `bunx create-adonisjs@latest -K=api --db=postgres`
- **Next.js**: `bunx create-next-app@latest --typescript --tailwind --app --src-dir`

## License

MIT
