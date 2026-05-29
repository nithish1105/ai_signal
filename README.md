# UniFind - College Discovery & Decision-Making Platform MVP

UniFind is a production-grade full-stack MVP designed to help students discover colleges, compare them side-by-side, analyze placement graphs, read verified reviews, and bookmark their shortlist.

---

## 🚀 Tech Stack

*   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS (v4), Zustand, TanStack Query (React Query)
*   **Backend**: Node.js, Next.js API Routes, Next.js Edge Middleware
*   **Database & ORM**: PostgreSQL, Prisma ORM
*   **Security & Auth**: JWT (using cookie storage for session state, HTTP-only cookie for refresh token, middleware guards), password hashing with bcryptjs

---

## 📂 Project Architecture

```
src/
├── app/                  # Next.js App Router (Pages & API Endpoints)
│   ├── api/              # Backend APIs (Auth, Colleges, Comparisons, Bookmarks)
│   │   ├── auth/         # Signup, Login, Logout, and Session endpoints
│   │   ├── colleges/     # Paginated list query & individual profile details APIs
│   │   ├── compare/      # Side-by-side college details fetching API
│   │   └── saved-colleges# Bookmarked colleges GET, POST, and DELETE APIs
│   ├── auth/             # Signin & Registration pages
│   ├── colleges/         # Search & filter list page, and detail tab page
│   ├── compare/          # Dynamic side-by-side comparative table
│   ├── dashboard/        # Bookmarks management dashboard
│   ├── layout.tsx        # Global HTML wrapper (mounts header/footer)
│   └── page.tsx          # Premium landing page
├── components/           # Reusable UI Blocks
│   ├── college/          # CollegeCard, FilterPanel
│   ├── layout/           # Sticky Navbar, footer
│   ├── shared/           # Loading Skeletons, star rating visualizer, Toast Container
│   └── providers.tsx     # TanStack Query & Auth hydration providers wrapper
├── hooks/                # React Hooks
├── lib/                  # Shared helper scripts (Prisma client, JWT tokenizers)
├── store/                # Zustand stores (session authStore, compareStore, toastStore)
└── prisma/               # Prisma database schema definition and database seeding script (root level)
```

---

## 🛠️ Local Development Setup

Follow these steps to run the application locally:

### 1. Prerequisites
*   Node.js (v18.x or later)
*   Docker Desktop (for running the database container locally) or a PostgreSQL connection string (e.g. from Supabase / Neon)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of the workspace (a template is available in `.env.example`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collegedb?schema=public"
JWT_SECRET="your-development-access-token-key-2026"
JWT_REFRESH_SECRET="your-development-refresh-token-key-2026"
```

### 4. Spin up PostgreSQL DB using Docker
Run the following command to start the local PostgreSQL instance:
```bash
docker compose up -d
```
*If you are using a remote database (like Neon or Supabase), skip this step and paste your remote database URL into `DATABASE_URL`.*

### 5. Run Database Migrations
Create database tables using Prisma Migrate:
```bash
npx prisma db push
```

### 6. Seed the Database (100+ Colleges)
Populate the database with **105 highly realistic college profiles** spanning multiple states, courses, placement statistics (2023-2025), and verified student reviews:
```bash
npx prisma db seed
```

### 7. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📖 API Documentation

All API endpoints are fully typed and return JSON responses.

### Authentication Endpoints

#### `POST /api/auth/signup`
Creates a new student account.
*   **Request Body**:
    ```json
    {
      "name": "Rahul Sharma",
      "email": "student@gmail.com",
      "password": "Password123!"
    }
    ```
*   **Response (201)**:
    ```json
    {
      "message": "User registered successfully",
      "user": { "id": "...", "email": "student@gmail.com", "name": "Rahul Sharma" }
    }
    ```

#### `POST /api/auth/login`
Authenticates credentials and sets HTTP-Only cookies (`access_token`, `refresh_token`).
*   **Request Body**:
    ```json
    {
      "email": "student@gmail.com",
      "password": "Password123!"
    }
    ```
*   **Response (200)**:
    ```json
    {
      "message": "Logged in successfully",
      "user": { "id": "...", "email": "student@gmail.com", "name": "Rahul Sharma" }
    }
    ```

#### `POST /api/auth/logout`
Clears authentication cookies.
*   **Response (200)**:
    ```json
    { "message": "Logged out successfully" }
    ```

#### `GET /api/auth/me`
Retrieves details of the currently authenticated user session.
*   **Response (200)**:
    ```json
    {
      "user": { "id": "...", "email": "student@gmail.com", "name": "Rahul Sharma" }
    }
    ```

---

### Colleges & Search Endpoints

#### `GET /api/colleges`
Faceted search query endpoint with pagination and sorting.
*   **Query Parameters**:
    *   `q` (string): Text search matching name, city, state.
    *   `state` (string): Filter by state.
    *   `city` (string): Filter by city.
    *   `feesMin` / `feesMax` (number): Limit tuition fees.
    *   `rating` (number): Minimum star rating.
    *   `courseType` (string): Stream filter (e.g. `Engineering`, `Management`).
    *   `ownershipType` (string): `Public` or `Private`.
    *   `sortBy` (string): Sorting criterion (`rating`, `feesAsc`, `feesDesc`, `placements`).
    *   `page` (number): Pagination page index (default 1).
    *   `limit` (number): Page limit size.
*   **Response (200)**: Returns paginated lists of colleges, pagination counts, and unique filter options lists for states and cities.

#### `GET /api/colleges/[id]`
Retrieves full profile details for a college by ID or unique Slug. Returns complete nested courses, placements charts data, and student reviews.
*   **Response (200)**: Returns full college details and a rating summary including star-count percentage distributions.

---

### Comparison Endpoints

#### `POST /api/compare`
Side-by-side query compiler.
*   **Request Body**:
    ```json
    {
      "collegeIds": ["college-uuid-1", "college-uuid-2"]
    }
    ```
*   **Response (200)**:
    ```json
    {
      "colleges": [ ... ]
    }
    ```

---

### Bookmarks (Protected Endpoints)

#### `GET /api/saved-colleges`
Retrieves bookmarked colleges list for the logged-in user.
*   **Response (200)**: `{ "colleges": [ ... ] }`

#### `POST /api/saved-colleges`
Add college to bookmarks list.
*   **Request Body**: `{ "collegeId": "college-uuid" }`
*   **Response (201)**: Confirmation message and saved link record.

#### `DELETE /api/saved-colleges?collegeId=[id]`
Remove college from bookmarks list.
*   **Response (200)**: `{ "message": "College removed from bookmarks" }`

---

## ☁️ Deployment Instructions

### Database (Neon/Supabase)
1.  Create a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2.  Retrieve the Connection String.
3.  Assign it to `DATABASE_URL` in your configuration.

### Frontend & APIs (Vercel)
1.  Push your code to a GitHub repository.
2.  Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3.  Import the repository.
4.  Configure the **Environment Variables** (`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`).
5.  Click **Deploy**. Vercel will automatically build the Next.js App Router and edge function APIs.
6.  Run the seed script against your production DB:
    ```bash
    DATABASE_URL="your-production-postgres-url" npx prisma db push
    DATABASE_URL="your-production-postgres-url" npx prisma db seed
    ```
