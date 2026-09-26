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

- **Authentication** — register (protected by Cloudflare Turnstile), login, httpOnly-cookie JWT sessions, email verification, resend verification, forgot/reset password

- **Profile** — update username, change password, delete account (password-confirmed)

- **Dark Mode** — system-aware with manual toggle

- **Responsive** — mobile sidebar/table view + desktop layout

---

## Tech Stack

Fullstack **Next.js** — the old separate React (Vite) frontend and Express backend have been merged into a single Next.js app; API routes replace Express entirely.

- **Framework**: Next.js 16 (App Router), React 19

- **UI**: Tailwind CSS v4, shadcn/ui, next-themes, lucide-react

- **API**: Next.js Route Handlers (`src/app/api`), custom `proxy.js` middleware for auth guarding

- **Auth**: JWT (`jsonwebtoken`) in httpOnly cookies, bcryptjs, Cloudflare Turnstile (bot protection)

- **Database**: PostgreSQL (Neon), Prisma ORM 7 with `@prisma/adapter-pg`

- **Email**: Resend (transactional email)

- **Deployment**: Vercel · Domain: Hostinger

---

## Project Structure

```
jobtrack/
├── .github/
│   └── workflows/
│       └── ci.yml
├── screenshots/
└── web/
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── public/
    └── src/
        ├── app/
        │   ├── (protected)/       # dashboard, jobs, profile — cookie-guarded layout
        │   ├── api/
        │   │   ├── auth/          # register, login, logout, verify-email, resend, forgot/reset password
        │   │   ├── jobs/
        │   │   └── users/
        │   ├── login/
        │   ├── register/
        │   ├── forgot-password/
        │   ├── reset-password/
        │   └── verify-email/
        ├── components/
        ├── config/
        ├── constants/
        ├── context/               # AuthContext, AuthProvider
        ├── hooks/                 # useJobs (search/filter/sort)
        ├── lib/                   # prisma client, auth helpers, email, AppError
        ├── services/              # fetch-based API client
        ├── utils/
        └── proxy.js                # auth guard for /api/jobs and /api/users
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database
- [Resend](https://resend.com) account (for email)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) site + secret key

### 1. Clone the repo

```bash
git clone https://github.com/jejejullian/jobtrack.git
cd jobtrack/web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `web/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/jobtracker
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

### 4. Run migrations and start

```bash
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

### Auth

| Method | Endpoint                        | Description                             |
| ------ | ------------------------------- | --------------------------------------- |
| POST   | `/api/auth/register`            | Register new user (Turnstile-protected) |
| POST   | `/api/auth/login`               | Login                                   |
| POST   | `/api/auth/logout`              | Logout                                  |
| GET    | `/api/auth/verify-email`        | Verify email                            |
| POST   | `/api/auth/resend-verification` | Resend verification email               |
| POST   | `/api/auth/forgot-password`     | Request password reset                  |
| POST   | `/api/auth/reset-password`      | Reset password                          |

### Jobs _(requires auth)_

| Method | Endpoint        | Description   |
| ------ | --------------- | ------------- |
| GET    | `/api/jobs`     | Get all jobs  |
| POST   | `/api/jobs`     | Create job    |
| GET    | `/api/jobs/:id` | Get job by ID |
| PUT    | `/api/jobs/:id` | Update job    |
| DELETE | `/api/jobs/:id` | Delete job    |

### Users _(requires auth)_

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/api/users/me`       | Get profile                        |
| PATCH  | `/api/users/me`       | Update username                    |
| DELETE | `/api/users/me`       | Delete account (requires password) |
| PATCH  | `/api/users/password` | Change password                    |

---

## Environment Variables

| Variable                         | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`                   | PostgreSQL connection string                               |
| `JWT_SECRET`                     | Secret key for JWT signing                                 |
| `RESEND_API_KEY`                 | Resend API key                                             |
| `FROM_EMAIL`                     | Sender email address                                       |
| `FRONTEND_URL`                   | App URL (used in email links)                              |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (client-side)                |
| `TURNSTILE_SECRET_KEY`           | Cloudflare Turnstile secret key (server-side verification) |

---

## CI/CD

GitHub Actions runs on every push and pull request to `main`.

---

## License

MIT
