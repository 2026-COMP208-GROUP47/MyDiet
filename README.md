# MyDiet — Personalized Diet & Nutrition Web App

<p align="center">
  <img src="frontend/public/vite.svg" alt="MyDiet" width="60" />
</p>

<p align="center">
  <strong>Meal planning, nutrition tracking, food identification, and community — in one place</strong>
</p>

<p align="center">
  <a href="https://comp208-group47-mydiet.netlify.app">Live demo</a>
</p>

---

## Overview

**MyDiet** is a full-stack web application for healthier eating. It helps users set goals, generate weekly meal plans from a large recipe database, track daily nutrition, explore community posts, and manage a personal profile.

## Features

- **Personalized meal plans** — Questionnaire-driven weekly breakfast / lunch / dinner suggestions aligned with goals (lose / gain / maintain weight).
- **Daily nutrition tracking** — Calories and macros with progress feedback on the dashboard.
- **Food identifier flow** — Upload or drag-and-drop food images and review nutrition-style results (UI workflow).
- **Community** — Posts, comments, likes, tags, and discovery patterns in the community views.
- **Profile & habits** — Health metrics, charts, streaks, and privacy-oriented controls in the UI.

## Routes (frontend)

| Route | Page |
|-------|------|
| `/landing` | Marketing landing |
| `/login`, `/signup` | Authentication |
| `/` | Homepage dashboard (calendar, macros, today’s meals) |
| `/plan` | Plan questionnaire & weekly plan |
| `/plan/day/:day` | Single-day meal detail & swaps |
| `/identifier` | Food photo upload & results |
| `/community` | Community feed & interactions |
| `/profile`, `/profile/:username` | Profile (self or by username) |

---

## Tech stack

### Frontend (`frontend/`)

| Area | Stack |
|------|--------|
| UI | React 19, TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router 7 |
| State | React Context + `localStorage` where used |
| Motion / charts / icons | Framer Motion, Recharts, Lucide React |
| Effects | Canvas Confetti |

### Backend (`backend/`)

| Area | Stack |
|------|--------|
| Runtime | Java 21, Spring Boot 3.2 |
| API | Spring Web, Spring Data JPA |
| Security | Spring Security, OAuth2 client (Google), bcrypt-style password handling |
| Databases | MySQL-compatible driver; dual datasources (primary app DB + nutrition/recipe DB) |
| Optional local DB | H2 (dependency present for tests / local use) |

Meal-plan generation in the SPA is wired through `frontend/src/api/mealPlanApi.ts` (defaults to a hosted API URL; point it to your own backend when developing locally).

---

## Prerequisites

- **Frontend:** Node.js ≥ 18, npm ≥ 9  
- **Backend:** JDK 21, Maven 3.9+ (or use the included `mvnw` / `mvnw.cmd` wrapper)  
- **Data:** MySQL- or TiDB-compatible instances if you run the full backend against real schemas (see `backend/schema.sql` and scripts under `Database table/`)

---

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** (default Vite port).

Production build:

```bash
npm run build
npm run preview   # optional: serve dist/
```

### Backend

```bash
cd backend
./mvnw spring-boot:run    # Linux / macOS
# or on Windows:
mvnw.cmd spring-boot:run
```

Default API port: **http://localhost:8080** (see `backend/src/main/resources/application.properties`).

**Important:** Configure datasource URLs, usernames, and passwords in `application.properties` (or externalized config) for your environment. Do **not** commit real production secrets to git.

---

## Repository layout

```
MyDiet/
├── frontend/                 # Vite + React SPA
│   ├── public/
│   ├── src/
│   │   ├── api/              # HTTP client for meal plans (backend DTOs)
│   │   ├── components/layout/
│   │   ├── context/          # App-wide state
│   │   ├── data/             # Static / mock nutrition helpers
│   │   ├── pages/            # Routed screens
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                  # Spring Boot API
│   ├── src/main/java/com/mydiet/backend/
│   │   ├── config/           # Security, dual datasource
│   │   ├── controller/       # Auth, users, posts
│   │   ├── nutrition/        # Meal plans, recipes, dietary reference
│   │   ├── entity/, repository/, service/, dto/
│   │   └── BackendApplication.java
│   ├── src/main/resources/application.properties
│   ├── schema.sql
│   ├── pom.xml
│   ├── Dockerfile
│   └── mvnw, mvnw.cmd
├── Database table/           # DB helper scripts (e.g. import / clean)
├── Technical documentation/  # Design notes (Chinese)
├── CA1 Demo Documentation/   # Course demo & user manual assets
├── UI/                       # Design sync assets (e.g. .pen, batch helpers)
├── import_recipes.py         # Root-level data import utility
└── fix_html_entities.py      # Small text cleanup utility
```

---

## Design notes

The UI uses a **glassmorphism** look: dark gradients, blurred translucent panels, and emerald → cyan accents, with motion layered via Framer Motion.

---

## 📄 License

MIT License

---

<p align="center">
  Made with ❤️ by COMP208 Group 47
</p>
