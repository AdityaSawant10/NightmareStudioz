# CineAI - Movie Booking System

## Overview

CineAI (Nightmare Studioz) is a full-stack cinema booking platform that enables users to browse movies, select seats interactively, and book tickets. The application features a modern React frontend with dark mode support and an Express.js backend using SQLite for data persistence. The platform provides a complete movie theater experience with theater selection, showtime management, and seat reservation functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Choice: React 18 with Vite**
- **Problem**: Need for fast development with modern React features and optimal build performance
- **Solution**: React 18 with Vite as the build tool
- **Rationale**: Vite provides instant hot module replacement (HMR) and significantly faster builds compared to traditional webpack-based setups. React 18 offers concurrent features and improved performance.

**Routing Strategy: React Router DOM v6**
- **Problem**: Client-side navigation between movie listing, booking, and confirmation pages
- **Solution**: React Router DOM for declarative routing
- **Key Routes**:
  - Movie catalog page (MovieList)
  - Seat selection page (BookingPage)
  - Booking confirmation page (ConfirmationPage)

**State Management: React Hooks**
- **Problem**: Managing component state and side effects
- **Solution**: Built-in React hooks (useState, useEffect) without external state management libraries
- **Rationale**: Application complexity doesn't warrant Redux or similar libraries; component-level state is sufficient

**Styling Approach: CSS with CSS Variables**
- **Problem**: Theming support (dark/light mode) and maintainable styles
- **Solution**: Native CSS with CSS Custom Properties for theme variables
- **Benefits**: No CSS-in-JS overhead, excellent browser support, simple theme switching via data attributes
- **Theme Variables**: Colors, spacing, and component styles defined in CSS variables that change based on `[data-theme="dark"]` attribute

### Backend Architecture

**Server Framework: Express.js 5**
- **Problem**: Need for robust HTTP server with middleware support
- **Solution**: Express.js latest version (5.x)
- **Features**: JSON parsing, CORS support, static file serving for production builds

**Database Solution: SQLite with sql.js**
- **Problem**: Need for relational data storage with file persistence in a Replit environment
- **Solution**: SQLite via sql.js library with file-based persistence
- **Rationale**: Serverless database that works well in constrained environments, no separate database server required
- **Data Models**:
  - Movies (title, image, price, description, duration)
  - Theaters (name, address, area, city)
  - Showtimes (movie-theater-time relationships)
  - Bookings (user reservations with seat selections)

**API Architecture: RESTful Endpoints**
- **Pattern**: RESTful API design with `/api/*` prefix
- **Database Persistence**: In-memory SQLite database saved to `cinema.db` file
- **Initialization**: Database schema created on startup if not exists

### Build and Deployment Strategy

**Development Workflow**
- **Frontend Dev Server**: Vite dev server on port 5000 with HMR
- **Backend Server**: Express server serving API and static files
- **Dual-mode Support**: Can run in development (separate servers) or production (single server)

**Production Build Process**
1. Frontend assets built to `client/dist` directory via Vite
2. Express serves static files from `client/dist`
3. API routes handled by Express on `/api/*` paths
4. SPA routing handled by catch-all route serving `index.html`

**Deployment Targets**
- **Primary**: Replit (configured via scripts)
- **Alternative**: Vercel (configured via `vercel.json`)
- **Strategy**: Build frontend during postinstall, serve static files in production

### Component Architecture

**Reusable Components**
- **Navbar**: Persistent navigation with theme toggle functionality
- **Page Components**: Route-based components for different views

**Responsive Design**
- Mobile-first approach with CSS Grid and Flexbox
- Breakpoints defined for tablet and desktop layouts
- Grid template adjustments via media queries (e.g., `@media (max-width: 968px)`)

## External Dependencies

### Frontend Dependencies
- **react** & **react-dom** (^18.2.0): Core UI library
- **react-router-dom** (^6.20.0): Client-side routing
- **@vitejs/plugin-react** (^4.2.1): Vite React plugin for JSX and Fast Refresh
- **vite** (^5.0.8): Build tool and development server

### Backend Dependencies
- **express** (^5.1.0): Web application framework
- **cors** (^2.8.5): Cross-Origin Resource Sharing middleware
- **sql.js** (^1.13.0): SQLite database compiled to JavaScript
- **pg** (^8.16.3): PostgreSQL client (included but not currently used; may be integrated later)

### Database
- **Type**: SQLite (file-based, serverless)
- **Location**: `cinema.db` in project root
- **Access Pattern**: In-memory database loaded from file, persisted on changes
- **Note**: While `pg` package is present, the application currently uses SQLite. PostgreSQL may be integrated in future iterations.

### Third-party Services
- **None**: Application is self-contained with no external API integrations
- **Potential Integrations**: Payment gateways, movie data APIs, or email notification services could be added

### Development Environment
- **Platform**: Replit (primary) with Vercel deployment option
- **Node.js Runtime**: Version compatibility with Express 5 and Vite 5 (Node 18+)
- **Package Manager**: npm