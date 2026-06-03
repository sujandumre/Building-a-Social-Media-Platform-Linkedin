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
Live Demo: https://linkedinsocialmedia.vercel.app/

## Setup
```bash
# Backend
cd backend && npm install && node server.js

# Frontend  
cd frontend && npm install && npm run dev
```

## Environment Variables
Create `.env` in backend and `.env.local` in frontend — see `.env.example` for required variables.

**Frontend** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Backend** (`.env`)
```env
PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

👨‍💻 Author
Sujan Dumre

**Sujan Dumre**
- GitHub: [@sujandumre](https://github.com/sujandumre)
- LinkedIn: [Sujan Dumre](https://www.linkedin.com/in/dumresujan/?skipRedirect=true)


