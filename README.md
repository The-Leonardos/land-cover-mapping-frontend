# Land Cover Mapping Frontend

This project is a Next.js application for land cover mapping, using PostgreSQL for data storage and Prisma as the ORM.

## Setup Instructions

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Environment Configuration (local development)

Create a `.env` file in the root directory and add the following database configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/thesis_db"
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=thesis_db
```

### 3. Install Dependencies

Install the required node modules using pnpm:

```bash
pnpm install
```

### 4. Start the Database (Docker)

This project uses a local PostgreSQL instance running in a Docker container.

1. Ensure **Docker Desktop** is running.
2. Start the database container:

```bash
pnpm db:start
# or directly using docker compose:
# docker compose up -d
```

### 5. Database Setup (Prisma)

Once the database is running, sync the Prisma schema and seed the initial data:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to the database
npx prisma db push

# (Only run once) Seed the database
pnpm db:seed

# View the database
pnpm db:studio
```

### 6. Run the Development Server

Start the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `pnpm dev`: Runs the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm db:start`: Starts the PostgreSQL Docker container.
- `pnpm db:stop`: Stops the PostgreSQL Docker container.
- `pnpm db:seed`: Seeds the database using Prisma.
- `pnpm db:studio`: Views the database.
- `pnpm lint`: Runs ESLint for code quality checks.
