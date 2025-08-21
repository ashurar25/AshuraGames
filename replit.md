# ASHURA Games Platform

## Overview

ASHURA Games is a modern web-based gaming platform that provides users with access to a curated collection of HTML5 games. The platform features a sleek, responsive interface with categories for different game types including action, puzzle, racing, multiplayer, .IO, and strategy games. Users can browse games by category, search for specific titles, view trending and new releases, and play games directly within the platform through an embedded modal interface.

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