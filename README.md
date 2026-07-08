# Time-Bank / Skill-Swap Network

A barter economy platform where users trade services using "time credits" — no money involved.

## Features
- User registration and login with JWT authentication
- Create and manage service offers/requests
- Escrow-based transaction system
- Rating system for completed trades
- User dashboard with credits and history
- Real-time notifications

## Tech Stack
- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS
- **Authentication**: JWT, bcrypt
- **Logging**: Winston

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL

### Backend
```bash
cd backend
npm install
# Create .env file with database credentials
cmd /c "npm run dev"
Frontend
bash
cd frontend
npm install
cmd /c "npm run dev"
Database
bash
psql -U postgres -c "CREATE DATABASE timebank;"
psql -U postgres -d timebank -f database/schema.sql
Environment Variables
text
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=timebank
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
API Endpoints
POST /api/auth/register - Register user

POST /api/auth/login - Login user

GET /api/auth/me - Get profile

POST /api/offers - Create offer

GET /api/offers - Get all offers

GET /api/offers/my - Get user's offers

POST /api/transactions - Create transaction

GET /api/transactions - Get user's transactions

PATCH /api/transactions/:id/confirm - Confirm completion

POST /api/ratings - Create rating

GET /api/notifications - Get notifications

Database Schema
Tables: users, offers, transactions, ratings, notifications
Schema file: database/schema.sql


        programmed and implemented by: - Bedemariyam Tamirat Ali 