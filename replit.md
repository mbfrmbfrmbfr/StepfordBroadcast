# Replit.md

## Overview

This is a full-stack news website application for the Stepford Broadcasting Corporation (SBC). It's built with a modern tech stack featuring Express.js backend, React frontend, and PostgreSQL database. The application allows users to view published news articles and provides an admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with structured error handling
- **Middleware**: Custom logging and error handling middleware
- **Development**: Hot reload with Vite integration

### Database Architecture
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Relational design with users, articles, categories, and departments
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Data Models
- **Users**: Authentication and authorization with role-based access
- **Articles**: Main content with rich metadata (title, content, summary, images)
- **Categories**: Content classification (politics, business, technology, etc.)
- **Departments**: Special SBC departments (SBC Verify, SBC Declassify, etc.)

### Authentication System
- Simple email/password authentication
- Role-based access control (admin, editor roles)
- Client-side session management
- Protected routes for admin dashboard

### Content Management
- Article creation and editing interface
- Category and department management
- Breaking news system with ticker display
- Publication status control

### UI Components
- Responsive design with mobile-first approach
- SBC-branded color scheme (blues, reds, corporate colors)
- Reusable component library built on Radix UI
- Toast notifications for user feedback

## Data Flow

1. **Public Content**: Users can browse published articles on the home page
2. **Authentication**: Admin users login through dedicated login page
3. **Content Creation**: Authenticated users can create/edit articles via dashboard
4. **Publication**: Articles can be marked as published and optionally as breaking news
5. **Breaking News**: Special breaking news ticker displays across the site

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form handling
- **zod**: Runtime type validation
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **vite**: Development server and build tool
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Development
- Uses Vite dev server with hot module replacement
- Express server runs on Node.js with tsx for TypeScript execution
- Database migrations managed through Drizzle Kit
- Environment variables for database configuration

### Production Build
- Frontend built with Vite into static assets
- Backend bundled with esbuild for Node.js runtime
- Database requires PostgreSQL connection string
- Static assets served through Express in production

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment specification (development/production)
- Tailwind CSS configured for client-side assets
- TypeScript paths configured for clean imports

### Database Setup
- Run `npm run db:push` to apply schema changes
- Drizzle generates migrations in `./migrations` directory
- Schema defined in `./shared/schema.ts`
- Supports both development and production database instances