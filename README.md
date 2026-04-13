# EchoNet

EchoNet is a modern, full-stack social media platform designed for seamless content sharing, user interaction, and real-time engagement. It features a robust NestJS backend and a highly responsive Next.js frontend.

## 🚀 Tech Stack

### Backend
* **Framework:** NestJS (v11)
* **Database:** PostgreSQL with Prisma ORM
* **Caching & Queues:** Redis, BullMQ (Background job processing for media)
* **Media Storage:** Cloudinary
* **Authentication:** JWT, bcrypt, Nodemailer (OTP Verification)

### Frontend
* **Framework:** Next.js (v16 App Router) & React 19
* **Styling:** Tailwind CSS v4, shadcn/ui
* **State Management:** Zustand (Global State), TanStack Query (Server State)
* **Form Handling:** React Hook Form + Zod

---

## ✨ Features (Currently Implemented)

### 🔐 Authentication & Security
* Complete user registration and login flow.
* Email-based OTP verification using Nodemailer.
* JWT-based session management (Access & Refresh tokens).

### 👤 Profile Management
* Distinct `User` and `Profile` entities.
* Cloudinary integration for avatar uploads.
* Self-referential follow system (Followers/Following).
* Modular profile dashboards utilizing Next.js parallel routes (`@posts`, `@reels`, `@savedPosts`).

### 📸 Content Modules
* **Posts & Reels:** Image and video upload capabilities with captions.
* **Stories:** Expiring media with view tracking. Processed via background BullMQ workers.

### 🤝 Interactions
* Polymorphic system for tracking Likes across Posts, Reels, and Stories.
* Deeply nested commenting system (threading & replies).
* Bookmarking functionality to save posts.

---

## 🚧 Work in Progress (Upcoming Features)

* **Feed & Timeline:** Infinite scrolling implementation on the frontend to consume aggregated Post, Reel, and Story APIs.
* **Real-Time Messaging:** WebRTC and WebSocket integration for direct user-to-user chat.
* **Notification System:** Frontend drawer and real-time alerts for likes, comments, and follows.
* **Admin Dashboard:** Interfaces for moderation and platform management based on existing `Role.ADMIN` schemas.

---

## 📂 Project Structure

```text
EchoNet/
├── backend/                # NestJS Application
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── auth/           # Authentication & OTP logic
│   │   ├── user/           # User management
│   │   ├── profile/        # Bios, Avatars, Follow logic
│   │   ├── posts/          # Image post handling
│   │   ├── reels/          # Video processing
│   │   ├── story/          # Expiring media & queues
│   │   ├── comment/        # Nested commenting system
│   │   └── like/           # Polymorphic interactions
│   └── ...
└── frontend/               # Next.js Application
    ├── app/                # App Router (Parallel & Intercepted routes)
    ├── components/         # UI components (shadcn/ui)
    ├── features/           # Feature-specific logic & components
    ├── hooks/              # Custom React hooks
    ├── stores/             # Zustand state stores
    ├── service/            # API integration & query keys
    └── validations/        # Zod schemas for forms
```

---

## 🛠️ Getting Started

### Prerequisites
* Node.js (v18+)
* PostgreSQL
* Redis
* Cloudinary Account

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Configure your `.env` variables (Database URL, Redis URL, JWT Secrets, Cloudinary keys, SMTP details).
4. Run migrations: `npx prisma migrate dev`
5. Start the server: `npm run start:dev`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Configure your `.env` variables (API Base URL).
4. Start the development server: `npm run dev`
