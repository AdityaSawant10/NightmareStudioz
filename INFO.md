# Nightmare Studioz - Cinema Booking Platform

## Project Overview

Nightmare Studioz is a full-stack cinema booking application that enables users to browse movies, select seats interactively, and book tickets seamlessly. The platform features AI-generated movie posters, a modern responsive UI with dark/light theme support, and real-time seat availability tracking.

---

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Styling**: CSS with CSS Variables (Custom Properties)
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: SQLite (sql.js) - In-memory database with file persistence
- **Middleware**: CORS, Express JSON parser

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Deployment Platform**: Replit

---

## Architecture

### Application Structure

```
nightmare-studioz/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx    # Navigation bar with theme toggle
│   │   │   └── Navbar.css
│   │   ├── pages/            # Route-based page components
│   │   │   ├── MovieList.jsx       # Movie catalog page
│   │   │   ├── BookingPage.jsx     # Seat selection page
│   │   │   ├── ConfirmationPage.jsx # Booking confirmation
│   │   │   └── *.css
│   │   ├── App.jsx           # Root component with routing
│   │   ├── main.jsx          # Application entry point
│   │   └── index.css         # Global styles & theme variables
│   ├── public/               # Static assets
│   │   └── images/           # AI-generated movie posters
│   ├── dist/                 # Production build output
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
├── server/
│   └── index.js              # Express server & database logic
├── cinema.db                 # SQLite database file
├── package.json              # Root dependencies
├── replit.md                 # Project documentation
└── INFO.md                   # This file
```

---

## How It Works

### 1. Application Flow

```
User visits site → MovieList page loads
    ↓
Fetches movies from /api/movies
    ↓
User selects a movie → Navigate to BookingPage
    ↓
Fetches movie details & seat availability
    ↓
User selects seats + enters details → Submit booking
    ↓
POST request to /api/bookings
    ↓
Database updated → Navigate to ConfirmationPage
    ↓
Display booking confirmation
```

### 2. Frontend Architecture

#### Component Hierarchy
```
App (Router)
├── Navbar (theme toggle, navigation)
└── Routes
    ├── MovieList (displays all movies)
    ├── BookingPage (seat selection UI)
    └── ConfirmationPage (booking details)
```

#### Theme System
- CSS variables defined in `:root` and `[data-theme="dark"]`
- Theme state managed in App.jsx with localStorage persistence
- Toggle switch in Navbar updates the `data-theme` attribute on document root
- All components reference CSS variables for colors

#### State Management
- **Local State**: Each component manages its own state with React hooks
- **API Integration**: Fetch API for server communication
- **Persistence**: Theme preference stored in browser localStorage

### 3. Backend Architecture

#### Server Setup
```javascript
Express App
├── CORS middleware (allows cross-origin requests)
├── JSON parser middleware
├── Static file serving (React build from client/dist)
└── API routes
```

#### Database Schema

**movies** table:
| Column      | Type    | Description                    |
|-------------|---------|--------------------------------|
| id          | INTEGER | Primary key (auto-increment)   |
| title       | TEXT    | Movie title                    |
| image       | TEXT    | Path to poster image           |
| price       | REAL    | Ticket price in Indian Rupees  |
| description | TEXT    | Movie description              |
| duration    | TEXT    | Movie runtime                  |

**seats** table:
| Column      | Type    | Description                    |
|-------------|---------|--------------------------------|
| id          | INTEGER | Primary key (auto-increment)   |
| movie_id    | INTEGER | Foreign key → movies(id)       |
| seat_number | TEXT    | Seat identifier (e.g., A1, B5) |
| is_booked   | INTEGER | Boolean (0=available, 1=booked)|

**bookings** table:
| Column         | Type     | Description                     |
|----------------|----------|---------------------------------|
| id             | INTEGER  | Primary key (auto-increment)    |
| movie_id       | INTEGER  | Foreign key → movies(id)        |
| seats          | TEXT     | Comma-separated seat numbers    |
| customer_name  | TEXT     | Customer name                   |
| customer_email | TEXT     | Customer email                  |
| total_price    | REAL     | Total booking amount            |
| booking_date   | DATETIME | Timestamp of booking            |

#### Data Initialization
- On first run, database auto-seeds with 6 movies
- Each movie gets 48 seats (rows A-F, 8 seats per row)
- Database persisted to `cinema.db` file

### 4. API Endpoints

| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | `/api/movies`           | Get all movies                     |
| GET    | `/api/movies/:id`       | Get specific movie details         |
| GET    | `/api/movies/:id/seats` | Get seat availability for a movie  |
| POST   | `/api/bookings`         | Create a new booking               |
| GET    | `/api/bookings/:id`     | Get booking confirmation details   |

### 5. Seat Booking Logic

1. **Seat Selection**: User clicks available seats on BookingPage
2. **Validation**: Frontend checks if seat is already booked (disabled if true)
3. **Booking Request**: POST to `/api/bookings` with:
   ```json
   {
     "movie_id": 1,
     "seats": ["A1", "A2"],
     "customer_name": "John Doe",
     "customer_email": "john@example.com"
   }
   ```
   **Note**: Both `customer_name` and `customer_email` are required fields with validation.
4. **Backend Processing**:
   - Validates movie exists
   - Validates customer name is provided and not empty
   - Validates customer email is provided and in valid format
   - Checks all seats are available
   - Calculates total price (ticket_price × number_of_seats)
   - Creates booking record
   - Updates seats to `is_booked = 1`
   - Persists database to file
5. **Response**: Returns booking confirmation with booking ID
6. **Navigation**: Redirects to `/confirmation/:bookingId`

---

## Key Features

### 1. AI-Generated Movie Posters
- Custom-generated cinematic poster images for each movie
- Stored in `client/public/images/`
- Loaded via `/images/` static route

### 2. Interactive Seat Map
- Visual grid showing all seats (A1-F8)
- Color coding:
  - **Available**: Default background
  - **Selected**: Highlighted (user's selection)
  - **Booked**: Disabled & grayed out
- Real-time seat selection updates

### 3. Theme Toggle
- Standard toggle switch in navbar
- Persists preference in localStorage
- Smooth CSS transitions between themes
- Light mode: bright background, dark text
- Dark mode: dark background, light text

### 4. Responsive Design
- Mobile-first CSS approach
- Flexbox & Grid layouts
- Viewport-responsive font sizes
- Touch-friendly UI elements

---

## Development Workflow

### Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   cd client && npm install
   ```

2. **Build Frontend**:
   ```bash
   cd client && npm run build
   ```

3. **Start Server**:
   ```bash
   node server/index.js
   ```
   Server runs on `http://localhost:5000`

### Production Build
- Vite builds optimized production assets to `client/dist/`
- Express serves static files from this directory
- All API routes prefixed with `/api/` to avoid conflicts

### Replit Deployment
- **Workflow**: "CineAI Server" runs `node server/index.js`
- **Port**: 5000 (configured for Replit webview)
- **Host**: 0.0.0.0 (accepts external connections)
- **Output Type**: webview (displays web preview)

---

## Data Models

### Movie Object
```javascript
{
  id: 1,
  title: "The Dark Knight",
  image: "/images/The_Dark_Knight_poster_7a6cd56a.png",
  price: 1079,
  description: "When the menace known as the Joker wreaks havoc on Gotham",
  duration: "2h 32min"
}
```

### Seat Object
```javascript
{
  id: 1,
  movie_id: 1,
  seat_number: "A1",
  is_booked: 0
}
```

### Booking Object
```javascript
{
  id: 1,
  movie_id: 1,
  seats: ["A1", "A2", "A3"],
  customer_name: "Guest",
  customer_email: "user@example.com",
  total_price: 3237,
  booking_date: "2025-11-11 12:30:00",
  movie_title: "The Dark Knight",
  movie_image: "/images/The_Dark_Knight_poster_7a6cd56a.png"
}
```

---

## Configuration

### Vite Configuration (`client/vite.config.js`)
```javascript
{
  server: {
    host: '0.0.0.0',      // Listen on all interfaces
    port: 5000,            // Dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',        // Output directory
    emptyOutDir: true      // Clean before build
  }
}
```

### Express Configuration
```javascript
PORT: 5000                  // Server port
Static: client/dist         // Serve React build
CORS: enabled               // Allow cross-origin
```

---

## Future Enhancements

Potential features for future development:
- User authentication & login
- Payment gateway integration
- Email booking confirmations
- Movie showtime scheduling
- Admin panel for managing movies
- PostgreSQL migration for scalability
- User booking history
- Seat reservation with timeout
- Movie ratings & reviews

---

## Credits

**AI-Generated Assets**: All movie posters generated using AI image generation
**Framework**: Built with React + Express
**Platform**: Deployed on Replit

---

## License

This project is part of Nightmare Studioz portfolio.

---

**Last Updated**: November 11, 2025
