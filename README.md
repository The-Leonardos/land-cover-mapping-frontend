# Land Cover Mapping Frontend

This project is a Next.js application for land cover mapping, using PostgreSQL for data storage and Prisma as the ORM.

## Setup Instructions

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/) (recommended, for running predefined tasks)

### 2. Environment Configuration (local development)

Create a `.env` file in the root directory and add the following database configuration:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/thesis_database?schema=public"
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=thesis_db
```

### 3. Install Dependencies

Install the required node modules using pnpm:

```bash
pnpm install
```

### 4. Generate the Prisma Client

```bash
npx prisma generate
```

## Running the Project

This project provides predefined VS Code tasks (see `.vscode/tasks.json`) so you don't have to type the commands manually. **For every step below**, run the task by following these instructions:

1. Press `Ctrl + Shift + P` to open the Command Palette.
2. Type and select **`Tasks: Run Task`**.
3. Pick the task name listed in the step (e.g., `🐳 Docker Compose: Up (Persisted)`).
4. If prompted with **`Continue without scanning the task output`**, click it to proceed.

> If you are not using VS Code, you can run the equivalent terminal command shown next to each task.

### Step 1: Make Sure Docker Desktop Is Running

Open **Docker Desktop** and make sure it is fully started before running any task.

### Step 2: Start the Database Container

Run task: **`🐳 Docker Compose: Up (Persisted)`**

Equivalent command:
```bash
docker compose -f docker-compose-persisted.yml up -d
```

Once the container is up, push the Prisma schema to the database:

```bash
npx prisma db push
```

### Step 3: Seed the Database

Pick **one** of the following depending on the data you want:

- Run task: **`🌱 Seed Data (Actual Data)`** — seeds the actual project data.
  ```bash
  npx prisma db seed actual_data
  ```
- Run task: **`🌿 Seed Data (Dynamic Model Demo)`** — seeds demo data for the dynamic model.
  ```bash
  npx prisma db seed dynamic_model_demo
  ```

### Step 4: Clear the Database (Optional)

Run task: **`🗑️ Clear All Data`**

Equivalent command:
```bash
npx prisma db seed clear_all_data
```

### Step 5: Mark Models as Trained for 2027 (Optional)

Run task: **`✅ Mark Models as Trained for 2027`**

Equivalent command:
```bash
npx tsx prisma/magic.ts 2027
```

### Step 6: Run the Development Server

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
