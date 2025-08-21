# ASHURA Games Platform

## Overview

ASHURA Games is a cutting-edge web-based gaming platform featuring an extensive collection of HTML5 and WebGL games. The platform showcases advanced 3D games, particle effects, and modern graphics alongside classic arcade games. With over 20 games including WebGL-powered 3D experiences, the platform offers categories for action, puzzle, racing, arcade, and strategy games. Users can enjoy stunning visual effects, responsive controls for both desktop and mobile, and seamless gameplay through an embedded modal interface.

## Recent Changes (August 2025)

### Major WebGL Game Additions:
- **3D Cube Runner**: Advanced WebGL 3D obstacle course with real-time lighting
- **Particle Explosion WebGL**: Interactive particle system with mouse/touch controls
- **3D Racing WebGL**: Full 3D racing game with cars, track, and physics
- **3D Space Invaders**: Modern space shooter with 3D graphics and power-ups
- **Neon Maze 3D**: First-person 3D maze with ray-casting rendering
- **Neon Platformer WebGL**: Side-scrolling platformer with particle effects
- **Cyber Runner 3D**: Futuristic city runner with 3D perspective and lane switching
- **Quantum Shooter WebGL**: Advanced space shooter with quantum effects and multiple weapons
- **Galactic Defender 3D**: Full 3D space combat with multiple enemy types and power-ups
- **Crystal Caverns 3D**: Explore mystical crystal caves with 3D platforming and gem collection
- **Neural Network 3D**: AI-themed puzzle game with node connections and virus combat
- **Neon Maze 3D**: First-person 3D maze using ray-casting with target collection gameplay

### Enhanced Classic Games:
- **Flappy Bird Enhanced**: Upgraded with modern WebGL graphics and particle effects
- **Snake Enhanced Pro**: Added particle effects, special food, level progression
- **Tetris Enhanced Pro**: Gradient blocks, particle effects, level-up animations
- All games now feature improved graphics, particle systems, and mobile touch controls

### Platform Improvements:
- **Responsive Design**: Enhanced grid layout supporting 1-6 columns based on screen size
- **Mobile Optimization**: Improved touch controls and responsive UI across all games
- **Game Modal**: Better fullscreen support and mobile-friendly game interface

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing with support for home and admin pages
- **UI Framework**: Radix UI components with shadcn/ui for accessible, customizable interface elements
- **Styling**: Tailwind CSS with custom mint-themed color palette and glass morphism effects
- **State Management**: TanStack React Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **API Design**: RESTful API with endpoints for game CRUD operations, category filtering, search, and trending/new game queries
- **Development Setup**: TypeScript with tsx for development server and esbuild for production bundling
- **Data Storage**: In-memory storage implementation with interface for future database integration

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with schema definition in shared directory
- **Database**: PostgreSQL with Neon serverless connection for production deployment
- **Schema**: Games table with fields for title, description, thumbnail, game URL, category, play count, rating, and trending/new status flags
- **Migrations**: Drizzle migrations system for database schema versioning

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express session middleware with PostgreSQL session store configured but not actively used
- **Admin Access**: Basic admin panel for game management without authentication protection

### Component Architecture
- **Design System**: Comprehensive UI component library based on Radix primitives
- **Layout Components**: Header with search functionality, category filters, game grids, and footer
- **Game Display**: Card-based game presentation with modal overlay for gameplay
- **Responsive Design**: Mobile-first approach with adaptive layouts for different screen sizes

## External Dependencies

### Core Runtime Dependencies
- **Database**: Neon PostgreSQL serverless database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **UI Components**: Extensive Radix UI component library for accessible interface elements
- **State Management**: TanStack React Query for server state and caching
- **Validation**: Zod for runtime type validation and schema definition

### Development and Build Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript for static type checking across client, server, and shared code
- **Styling**: Tailwind CSS with PostCSS for utility-first styling approach
- **Development**: tsx for TypeScript execution and hot module replacement
- **Bundling**: esbuild for optimized production server bundling

### UI and Styling Libraries
- **Icons**: Lucide React for consistent iconography and React Icons for brand icons
- **Utilities**: clsx and tailwind-merge for conditional class name handling
- **Carousels**: Embla Carousel for smooth game browsing experiences
- **Date Handling**: date-fns for date formatting and manipulation
- **Form Handling**: React Hook Form with Hookform Resolvers for form validation

### Platform Integration
- **Replit**: Custom Replit plugins for development environment integration and error overlay
- **Font Loading**: Google Fonts integration for Inter font family
- **Asset Management**: Vite alias configuration for organized asset and component imports