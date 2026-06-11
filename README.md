# Job Tracker

A full-stack web application for tracking job applications — add, update, filter, and monitor your job search progress. Includes a dashboard with stats and follow-up alerts.

## Screenshots

![Dashboard](./screenshots/dashboard.png)
![Jobs](./screenshots/jobs.png)
![Login](./screenshots/login.png)

## Live Demo

🌐 [https://jobtracker.my.id](https://jobtracker.my.id)

---

## Features

- **Dashboard** — stats overview (total, applied, interview, offer, rejected), recent applications, and follow-up alerts for stale applications (14+ days without update)
- **Job Management** — add, edit, delete, and update application status (Applied → Interview → Offer → Rejected)
- **Search, Filter & Sort** — search by company, position, or date (supports Indonesian month names); filter by status; sort newest/oldest
- **Authentication** — register, login, JWT sessions, email verification, forgot/reset password
- **Profile** — update username, change password, delete account
- **PWA** — installable on Android, iOS, and desktop (via Chrome/Safari)
- **Dark Mode** — system-aware with manual toggle
- **Responsive** — mobile card view + desktop table view

---

## Tech Stack

**Frontend**
- React 19, React Router v7
- Tailwind CSS v4, DaisyUI v5
- Vite 8, vite-plugin-pwa
- react-hot-toast, lucide-react

**Backend**
- Node.js, Express 5
- Prisma ORM with `@prisma/adapter-pg`
- JWT (`jsonwebtoken`), bcryptjs
- Resend (transactional email)

**Database**
- PostgreSQL (Neon)

**Deployment**
- Frontend: Vercel
- Backend: Render
- Domain: Hostinger

---

## Project Structure

```
jobtrack/
├── .github/
│   └── workflows/
│       └── ci.yml
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/      # fetch-based API client
│       ├── context/       # Auth context
│       ├── constants/
│       └── utils/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── lib/           # Prisma client, email
│       └── utils/
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database
- [Resend](https://resend.com) account (for email)

### 1. Clone the repo

```bash
git clone https://github.com/jejejullian/jobtrack.git
cd jobtrack
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/jobtracker
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Run migrations and start:

```bash
npx prisma migrate deploy
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Start dev server:

```bash
npm run dev
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/verify` | Verify email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/resend-verification` | Resend verification email |

### Jobs *(requires auth)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get job by ID |
| POST | `/api/jobs` | Create job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Users *(requires auth)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get profile |
| PATCH | `/api/users/me` | Update username |
| PATCH | `/api/users/password` | Change password |
| DELETE | `/api/users/me` | Delete account |

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `JWT_SECRET` | Backend | Secret key for JWT signing |
| `RESEND_API_KEY` | Backend | Resend API key |
| `FROM_EMAIL` | Backend | Sender email address |
| `FRONTEND_URL` | Backend | Frontend URL (used in email links) |
| `PORT` | Backend | Server port (default: 3000) |
| `VITE_API_URL` | Frontend | Backend API base URL |

---

## CI/CD

GitHub Actions runs on every push and pull request to `main`:

- **Frontend**: install → build
- **Backend**: install → prisma generate → syntax check

---

## License

MIT
