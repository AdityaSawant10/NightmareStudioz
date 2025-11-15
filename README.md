# CineAI - Movie Booking System

A modern movie booking system with React frontend and Express.js backend using SQLite database.

## Features

- 🎬 Browse movies with clean card-based UI
- 🪑 Interactive seat selection
- 🎫 Booking confirmation with ticket details
- 🌙 Dark mode toggle
- 📱 Responsive design
- 💾 SQLite database for data persistence

## Tech Stack

- **Frontend**: React, React Router, Vite
- **Backend**: Express.js, SQLite (better-sqlite3)
- **Styling**: CSS with custom properties for theming

## Local Development

1. Install dependencies:
```bash
npm install
cd client && npm install
```

2. Build the frontend:
```bash
cd client && npm run build
```

3. Run the application:
```bash
npm run server
```

The app will be available at http://localhost:3000

## Development Mode (with hot reload)

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend (development):
```bash
cd client && npm run dev
```

Frontend dev server: http://localhost:5000
Backend API: http://localhost:3000

## Deployment

### Replit Deployment (Recommended for SQLite)
This app is designed to work perfectly with Replit's built-in deployment:
1. Click the "Deploy" button in Replit
2. Your app will be deployed with persistent SQLite storage
3. The database will persist across deployments

### Windows Local Deployment
Works perfectly on Windows:
1. Install Node.js
2. Run `npm install` and `cd client && npm install`
3. Run `npm run server`
4. Access at http://localhost:3000

### Important: Vercel Deployment Limitation
**Note**: Vercel's serverless platform does NOT support SQLite persistence because:
- Serverless functions are stateless and ephemeral
- The SQLite database file cannot persist between function invocations
- Each request would reset the database

If you need to deploy to Vercel, you would need to switch to PostgreSQL or another cloud database.

## API Endpoints

- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/:id/seats` - Get seats for a movie
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking details

## Adding Custom Movie Images

Place your movie images in the `server/public/images/` directory and update the movie data in the database.

## Database

The app uses SQLite (cinema.db) with three tables:
- `movies` - Movie information
- `seats` - Seat availability for each movie
- `bookings` - Customer bookings

The database is automatically initialized with sample movies and seats on first run.

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── main.jsx     # Entry point
│   └── package.json
├── server/              # Express backend
│   ├── index.js         # Server entry point
│   └── public/          # Static assets
├── cinema.db            # SQLite database (auto-generated)
└── README.md
```
