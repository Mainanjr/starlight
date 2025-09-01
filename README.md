# Role-Based Access Control (RBAC) Application

A complete role-based access control system for contribution management with separate interfaces for members and treasurers.

## Features

- **User Authentication**: Login/register system with JWT tokens
- **Role-Based Access**: Two roles - "member" and "treasurer"
- **Contribution Management**: Members can create contributions
- **Treasurer Panel**: Treasurers can approve/decline pending contributions
- **Protected Routes**: Role-based access control on both frontend and backend

## Architecture

### Backend (Node.js + Express + MongoDB)
- User model with role field
- Contribution model with approval workflow
- Protected routes for treasurer-only operations
- JWT-based authentication
- Role-based middleware

### Frontend (React)
- Role-aware dashboard
- Conditional rendering based on user role
- Treasurer panel (only visible to treasurers)
- Member panel (visible to all members)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string and JWT secret.

5. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Contributions
- `GET /api/contributions/my-contributions` - Get user's contributions
- `POST /api/contributions` - Create new contribution
- `GET /api/contributions/pending` - Get pending contributions (treasurer only)
- `PUT /api/contributions/:id/approve` - Approve contribution (treasurer only)
- `PUT /api/contributions/:id/decline` - Decline contribution (treasurer only)
- `GET /api/contributions/stats` - Get contribution statistics (treasurer only)

## User Roles

### Member
- Can create contributions
- Can view their own contributions
- Cannot access approval functionality

### Treasurer
- Has all member capabilities
- Can view all pending contributions
- Can approve or decline contributions
- Can view contribution statistics
- Has access to the Treasurer Panel

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based route protection
- Protected API endpoints
- Frontend role-based UI rendering

## Testing the System

1. Start both backend and frontend servers
2. Register a new user (defaults to "member" role)
3. Create some contributions
4. To test treasurer functionality, manually update a user's role in the database:
   ```javascript
   // In MongoDB shell or MongoDB Compass
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { role: "treasurer" } }
   )
   ```
5. Log out and log back in to see the treasurer panel

## File Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Contribution.js
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **Security**: bcrypt password hashing, role-based middleware
