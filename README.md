# Building-a-Social-Media-Platform-Linkedin

A full-stack social networking platform built with Next.js, React, Redux Toolkit, Node.js, and MongoDB.

## Features
- JWT authentication + Google OAuth login
- User profiles with work history and education
- Post feed with like/unlike and comments
- Connection system (send, accept, reject)
- Responsive mobile-first design

## Tech Stack
**Frontend:** Next.js, React, Redux Toolkit, CSS Modules  
**Backend:** Node.js, Express.js, MongoDB, JWT, Cloudinary

## Live Demo
- Frontend: [Vercel](https://building-a-social-media-platform-li.vercel.app)
- Backend: [Render](https://linkedin-clone-backend-nqks.onrender.com)

## Setup
```bash
# Backend
cd backend && npm install && node server.js

# Frontend  
cd frontend && npm install && npm run dev
```

## Environment Variables
Create `.env` in backend and `.env.local` in frontend — see `.env.example` for required variables.