# Quick Hire Assessment – Backend

A REST API backend for a job board and application system. Built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** (Mongoose).

---

## Tech Stack

| Layer      | Technology   |
| ---------- | ------------ |
| Runtime    | Node.js      |
| Framework  | Express 5    |
| Language   | TypeScript   |
| Database   | MongoDB      |
| ODM        | Mongoose     |
| Env config | dotenv       |

---

## Project Structure

```
quick-hire-assessment-backend/
├── src/
│   ├── app.ts           # Express app, middleware, DB connection, routes
│   ├── server.ts        # Server entry – starts listening on PORT
│   ├── models/
│   │   ├── Job.ts       # Job schema & model
│   │   └── Application.ts  # Application schema & model
│   └── routes/
│       └── jobRoutes.ts # Job & Application API routes
├── .env                 # Environment variables (see below)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Environment Variables (`.env`)

Create a `.env` file in the project root with:

| Variable   | Description                    | Example |
| ---------- | ------------------------------ | ------- |
| `PORT`     | Server port (optional, default 5000) | `5000`  |
| `MONGO_URI`| MongoDB connection string (required) | See below |

**Example `.env`:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

- Replace `<username>`, `<password>`, `<dbname>` and cluster host with your MongoDB Atlas values.
- Never commit real credentials; keep `.env` in `.gitignore`.

---

## How to Run the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Set up `.env`

- Copy the example above into a file named `.env` in the project root.
- Fill in your real `MONGO_URI` (and optional `PORT`).

### 3. Run in development (with auto-reload)

```bash
npm run dev
```

- Uses `ts-node-dev`; server restarts on file changes.
- Default URL: **http://localhost:5000**

### 4. Build for production

```bash
npm run build
```

- Compiles TypeScript to `dist/`.

### 5. Run production build

```bash
npm start
```

- Runs `node dist/server.js` (uses compiled JS from `dist/`).

---

## API Overview

Base URL (local): **`http://localhost:5000`**

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/`                 | Health check – "API Running..." |
| GET    | `/api/jobs`         | List jobs (search, filter, paginate) |
| POST   | `/api/jobs`         | Create a job                   |
| GET    | `/api/jobs/:id`     | Get single job by ID           |
| DELETE | `/api/jobs/:id`     | Delete a job                   |
| POST   | `/api/applications` | Submit an application for a job |

---

## API Details

### Health check

- **GET** `/`
- **Response:** `"API Running..."`

---

### List jobs

- **GET** `/api/jobs`
- **Query params (optional):**
  - `search` – search in job title and company (case-insensitive)
  - `category` – filter by category (exact match)
  - `location` – filter by location (case-insensitive substring)
  - `page` – page number (default `1`), 20 items per page

**Example:**

```http
GET /api/jobs?search=developer&category=Engineering&page=1
```

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "title": "Senior Developer",
      "company": "Tech Co",
      "location": "Remote",
      "category": "Engineering",
      "short_description": "...",
      "main_description": "...",
      "created_at": "2025-03-04T..."
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### Create job

- **POST** `/api/jobs`
- **Body (JSON):** all fields required except `created_at`

| Field               | Type   | Required |
| ------------------- | ------ | -------- |
| `title`             | string | Yes      |
| `company`           | string | Yes      |
| `location`          | string | Yes      |
| `category`          | string | Yes      |
| `short_description` | string | Yes      |
| `main_description`  | string | Yes      |
| `created_at`        | string | No (default: current ISO time) |

**Example:**

```json
{
  "title": "Backend Developer",
  "company": "Quick Hire",
  "location": "Dhaka",
  "category": "Engineering",
  "short_description": "Build APIs and services.",
  "main_description": "Full job description here..."
}
```

**Response:** `201` with the created job object (including `_id`).

---

### Get single job

- **GET** `/api/jobs/:id`
- **Params:** `id` – MongoDB ObjectId of the job
- **Response:** Job object, or `404` with `{ "message": "Job not found" }`

---

### Delete job

- **DELETE** `/api/jobs/:id`
- **Params:** `id` – MongoDB ObjectId of the job
- **Response:** `{ "message": "Job deleted successfully" }`, or `404` if not found

---

### Submit application

- **POST** `/api/applications`
- **Body (JSON):** all fields required except `created_at`

| Field        | Type   | Required |
| ------------ | ------ | -------- |
| `job_id`     | string | Yes (valid job `_id`) |
| `name`       | string | Yes      |
| `email`      | string | Yes      |
| `resume_link`| string | Yes      |
| `cover_note` | string | Yes      |
| `created_at` | string | No (default: current ISO time) |

**Example:**

```json
{
  "job_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "resume_link": "https://example.com/resume.pdf",
  "cover_note": "I am interested in this role."
}
```

- If `job_id` is invalid or job doesn’t exist: `400` with `{ "message": "Invalid job_id" }`.
- **Response:** `201` with the saved application object (including `_id`).

---

## Data Models

### Job

| Field               | Type   |
| ------------------- | ------ |
| `title`             | String |
| `company`           | String |
| `location`          | String |
| `category`          | String |
| `short_description` | String |
| `main_description`  | String |
| `created_at`        | String |

### Application

| Field        | Type     |
| ------------ | -------- |
| `job_id`     | ObjectId (ref: Job) |
| `name`       | String   |
| `email`      | String   |
| `resume_link`| String   |
| `cover_note` | String   |
| `created_at` | String   |

---

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Start dev server with auto-reload    |
| `npm run build`| Compile TypeScript to `dist/`        |
| `npm start`    | Run production build (`dist/server.js`) |

---

## License

ISC
