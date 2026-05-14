<div align="center">
  <h1>🌌 EchoNet</h1>
  <p>A modern, full-stack social media platform designed for seamless content sharing, user interaction, and real-time engagement.</p>
  
  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 🚀 Tech Stack

### ⚙️ Backend
- **Framework:** NestJS (v11)
- **Database:** PostgreSQL with Prisma ORM (v7)
- **Caching & Background Jobs:** Redis, BullMQ (Queue processing for stories & posts)
- **Real-Time:** Socket.io (Event Gateway for Live Chat & Online Status)
- **Storage:** Cloudinary (Images & Videos)
- **Auth & Security:** JWT (Access/Refresh), bcrypt, Nodemailer (OTP Verification)

### 🎨 Frontend
- **Framework:** Next.js (v16 App Router) & React 19
- **Styling:** Tailwind CSS v4, shadcn/ui, Radix UI
- **State Management:** Zustand (Global State), TanStack Query v5 (Server State)
- **Forms & Validation:** React Hook Form + Zod
- **Real-Time Client:** Socket.io-client

---

## ✨ Features

### 🔐 Authentication & Security
- Complete registration and login flows with email-based OTP verification (Nodemailer).
- Secure JWT-based session management utilizing Access & Refresh tokens.

### 👤 Profile & Social Graph
- Distinct `User` (auth-focused) and `Profile` (social-focused) architecture.
- Self-referential follow system mapping out complex Followers/Following relationships.
- Modular profile dashboards utilizing Next.js parallel routes (`@posts`, `@reels`, `@savedPosts`).
- Advanced caching and invalidation strategies utilizing Redis for high-performance profile and feed fetching.

### 📸 Content & Media
- **Posts & Reels:** Image and video upload capabilities with rich captions.
- **Stories:** Expiring media with views tracking. Processed reliably using background BullMQ workers.
- **Polymorphic Interactions:** Seamless Like and Commenting architecture across Posts, Reels, and Stories. Includes nested commenting (threading & replies).
- **Bookmarking:** Save and organize favorite posts.

### 💬 Real-Time Messaging & Presence
- **Live Chat:** Direct one-on-one (Private) and Group chats built on Socket.io.
- **Real-Time Presence:** Online status tracking and live event broadcasting.
- **Message Tracking:** Read receipts and structured message views.

### 🔔 Notifications
- Event-driven notifications schema tracking interactions (Likes, Follows, Comments, and New Chats).

---

## 🚧 Work in Progress (Upcoming Features)

* **Infinite Feed & Timeline:** Infinite scrolling implementation on the frontend to consume aggregated Post, Reel, and Story APIs.
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
│   │   ├── like/           # Polymorphic interactions
│   │   ├── chat/           # Real-Time Messaging logic
│   │   └── event/          # Socket.io Event Gateway
│   └── ...
└── frontend/               # Next.js Application
    ├── app/                # App Router (Parallel & Intercepted routes)
    ├── components/         # UI components (shadcn/ui)
    ├── features/           # Feature-specific logic
    ├── hooks/              # Custom React hooks (e.g., useAuth)
    ├── stores/             # Zustand state stores
    ├── service/            # Axios API integration & Query keys
    ├── validations/        # Zod schemas for forms
    └── pages/              # Additional component structuring
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis Server
- Cloudinary Account
- SMTP Server (for emails)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` variables. Create a `.env` file and add the following keys:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="your_jwt_secret"
   CLOUDINARY_URL="cloudinary://..."
   SMTP_HOST="smtp.example.com"
   # Add other necessary keys...
   ```
4. Run migrations to sync your schema:
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
3. Configure your `.env.local` variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---
<div align="center">
  <p>Built with ❤️</p>
</div>
