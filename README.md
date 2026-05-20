<div align="center">
  <h1>🌌 EchoNet</h1>
  <p><strong>A modern, full-stack social media platform designed for seamless content sharing, user interaction, and real-time engagement.</strong></p>
  
  <p>
    <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://redis.io/"><img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" /></a>
    <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  </p>
</div>

---

## 🚀 Overview

EchoNet is a highly scalable, feature-rich social media application that mirrors the complexity of modern platforms like Instagram and Twitter. Built with a powerful **NestJS backend** and a blazing-fast **Next.js 16 / React 19 frontend**, it leverages background job processing, real-time WebSockets, and advanced caching to deliver a premium user experience.

---

## 💻 Tech Stack

### ⚙️ Backend (NestJS v11)
- **Core Framework:** NestJS with modular architecture
- **Database:** PostgreSQL managed via Prisma ORM v7
- **Caching & Queues:** Redis & BullMQ (Background Workers & Flow Producers)
- **Real-Time:** Socket.io (Event Gateway for Messaging & Presence)
- **Media Storage:** Cloudinary (Images & Videos)
- **Authentication:** JWT (Access/Refresh), bcrypt, Nodemailer (OTP Verification)

### 🎨 Frontend (Next.js 16)
- **Framework:** Next.js (App Router, Parallel & Intercepted Routes) & React 19
- **Styling:** Tailwind CSS v4, shadcn/ui, Radix UI primitives
- **State Management:** Zustand (Client State), TanStack React Query v5 (Server State)
- **Forms & Validation:** React Hook Form + Zod
- **Real-Time Client:** Socket.io-client

---

## 🏗️ Architecture & Engineering Highlights

- **Advanced Background Processing (BullMQ) & Job Management**
  A sophisticated BullMQ job flow asynchronously processes story and reel media in background workers. It utilizes a dedicated `JobsService` where the frontend can poll a job's progress in real-time to display loading states. If a job fails, users are presented with options to explicitly retry the job, or cancel it entirely (which safely cleans up the aborted Post/Story from the database).
  
- **Multi-Profile System**
  One user account supports multiple profiles with header-based switching (`x-profile-id`), mirroring YouTube's channel model. Custom `ProfileGuard` and decorators handle ownership verification and inject the active profile directly into controller methods.

- **Custom NestJS Pipeline & Security**
  Global guard chain with decorator-based route protection. Typed pipes validate and fetch entities (users, posts, chats) before controllers receive them, ensuring secure and predictable data flow.

- **Hybrid Real-Time Messaging Architecture**
  Leverages HTTP POST for message persistence to PostgreSQL, while simultaneously broadcasting via Socket.io for sub-millisecond real-time delivery to recipient rooms. Includes Redis-backed online presence tracking with automatic TTL expiry.

- **Polymorphic Interactions**
  A unified `Likes` and `Comments` table architecture handles Posts, Reels, and Stories via nullable foreign keys with composite unique constraints, preventing duplicates at the database level and keeping queries incredibly fast.

- **High-Performance Redis Caching Layer**
  Pattern-based cache invalidation across auth, profile, feed, and follow layers. Cache-first reads with targeted TTL management drastically reduce database load on high-traffic endpoints.

- **Resilient Error Handling & Consistent API Contracts**
  A global `ResponseInterceptor` wraps all responses in a strictly typed envelope. A global `ExceptionFilter` catches all errors (including panics and timeouts), returning a consistent shape to the frontend and displaying user-friendly toast notifications.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Onboarding:** Complete registration and login flows with email-based OTP verification via Nodemailer.
- **Advanced Password Recovery:** Secure forgot-password pipeline utilizing stateless JWTs, combined with Redis caching to enforce OTP cooldowns, track retry limits, and securely manage verification state.
- **Session Management:** Secure JWT-based sessions utilizing HttpOnly cookies for Access & Refresh tokens.

### 👤 Profile & Social Graph
- **Dual Entity Model:** Distinct `User` (auth-focused) and `Profile` (social-focused) schemas.
- **Self-Referential Graph:** Follow system mapping out complex Followers/Following relationships with optimized Prisma queries.
- **Modular Dashboards:** Next.js parallel routes (`@posts`, `@reels`, `@savedPosts`) for highly interactive profile views.

### 📸 Content & Media
- **Rich Posts & Reels:** Image and video upload capabilities with metadata and captions.
- **Stories:** Expiring media (24h TTL) with view tracking, reliably processed via BullMQ workers.
- **Nested Commenting:** Robust commenting architecture supporting endless threading and replies.
- **Bookmarking:** Save and organize favorite posts into private collections.

### 💬 Real-Time Chat & Presence
- **Live Messaging:** Direct 1-on-1 and Group chats built on Socket.io.
- **Presence Engine:** Real-time online status tracking and live typing indicators.
- **Smart Queries:** Optimized querying to prevent duplicate private chats between identical participants.

---

## 🚧 Roadmap & Upcoming Features
- [ ] **Admin Dashboard:** Interfaces for content moderation, user management, and platform analytics based on existing `Role.ADMIN` schemas.
- [ ] **Reels Frontend:** Dedicated frontend interface and playback experience for short-form video Reels.

---

## 📂 Project Structure

```text
EchoNet/
├── backend/                # NestJS API Server
│   ├── prisma/             # Schema definitions and migrations
│   ├── src/
│   │   ├── auth/           # Auth, JWT, OTP pipelines
│   │   ├── user/           # User lifecycle management
│   │   ├── profile/        # Bios, Avatars, Social Graph
│   │   ├── posts/          # Image post handling
│   │   ├── reels/          # Video processing pipelines
│   │   ├── story/          # Expiring media & BullMQ Queues
│   │   ├── comment/        # Nested threading system
│   │   ├── like/           # Polymorphic interactions
│   │   ├── chat/           # Messaging persistence
│   │   └── event/          # Socket.io Real-time Gateway
│   └── ...
└── frontend/               # Next.js Web Client
    ├── app/                # App Router structure
    ├── components/         # Reusable shadcn/ui components
    ├── features/           # Domain-specific logic
    ├── hooks/              # Custom React hooks (e.g., useAuth)
    ├── stores/             # Zustand global state slices
    ├── service/            # Axios interceptors & TanStack Query keys
    ├── validations/        # Zod schemas for form safety
    └── pages/              # Additional structured views
```

---

## 🛠️ Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)
- [Redis](https://redis.io/) (Running locally or via Docker)
- A [Cloudinary](https://cloudinary.com/) account for media uploads
- An SMTP Server (e.g., Gmail App Passwords, Resend, SendGrid)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/echonet"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="your_super_secret_jwt_key"
   CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
   SMTP_HOST="smtp.example.com"
   SMTP_USER="your_email@example.com"
   SMTP_PASS="your_email_password"
   ```
4. Run migrations to sync the database schema:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

<div align="center">
  <p>Built with ❤️</p>
</div>
