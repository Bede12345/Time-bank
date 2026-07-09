# Time-Bank / Skill-Swap Network

A barter economy platform where users trade services using "time credits" — no money involved. Users can post offers or requests, accept trades, log hours, and rate each other after completion.

## Features
- User registration and login with JWT authentication
- Create and manage service offers/requests
- Escrow-based transaction system (credits held until both parties confirm)
- Rating system for completed trades
- User dashboard with credits, offers, and transaction history
- Real-time notifications for trades and activities

## Tech Stack
- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React, Vite, Custom CSS (no frameworks)
- **Authentication**: JWT, bcrypt
- **Logging**: Winston

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL

### Backend Setup
```bash
cd backend
npm install
# Create .env file with database credentials
cmd /c "npm run dev"
Frontend Setup
bash
cd frontend
npm install
cmd /c "npm run dev -- --host"
Database Setup
bash
psql -U postgres -c "CREATE DATABASE timebank;"
psql -U postgres -d timebank -f database/schema.sql
Environment Variables
env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=timebank
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get current user profile
POST	/api/offers	Create a new offer/request
GET	/api/offers	Get all offers
GET	/api/offers/my	Get user's offers
PATCH	/api/offers/:id/status	Update offer status
POST	/api/transactions	Create a transaction
GET	/api/transactions	Get user's transactions
PATCH	/api/transactions/:id/confirm	Confirm transaction completion
POST	/api/ratings	Create a rating
GET	/api/notifications	Get user notifications
Extra Features (Beyond Course Scope)
Escrow-style dual-confirmation system — credits are held when a transaction is created and only transferred once both parties confirm completion

Custom error class hierarchy (AppError, ValidationError, AuthenticationError, etc.) with centralized error-handling middleware

Input validation and sanitization middleware (express-validator)

Custom CSS from scratch — no UI frameworks used (pure custom styling)

Database Schema
Tables: users, offers, transactions, ratings, notifications

Schema file: database/schema.sql

Project Structure
text
time-bank/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Data models (User, Offer, Transaction, Rating, Notification)
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication, validation, logging
│   │   ├── utils/          # Logger, error handlers
│   │   └── app.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components (Navbar)
│   │   ├── pages/          # Page components (Home, Login, Register, Dashboard, CreateOffer)
│   │   ├── services/       # API client
│   │   ├── context/        # Auth context
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css       # Custom CSS (no frameworks)
│   └── package.json
├── database/
│   └── schema.sql          # PostgreSQL DDL
└── README.md
Programmed and implemented by: Bedemariyam Tamirat Ali