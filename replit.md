# Overview

This is a full-stack React application built with Express.js backend, featuring a 60-day workout progress tracker. The app uses a modern tech stack with TypeScript, shadcn/ui components, and is designed to run on Replit with development-optimized tooling.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Storage**: localStorage for workout progress persistence

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **API Pattern**: RESTful API with /api prefix routing
- **Development**: Hot reload with tsx and custom Vite middleware

## Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema migrations
- **Session Store**: PostgreSQL-backed sessions
- **Client Storage**: localStorage for workout progress tracking

## Authentication and Authorization
- **Session-based**: Express sessions with PostgreSQL storage
- **Schema**: User table with username/password fields
- **Validation**: Zod schemas for type validation
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations

## Development and Build System
- **Build Tool**: Vite with React plugin and TypeScript support
- **Development**: Custom Express middleware integrating Vite dev server
- **TypeScript**: Strict configuration with path mapping for imports
- **Hot Reload**: Full-stack hot reload in development
- **Error Handling**: Replit-specific error overlay and logging

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database queries and migrations

## UI and Component Libraries
- **Radix UI**: Comprehensive primitive component library
- **shadcn/ui**: Pre-built accessible component system
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Development Tools
- **Replit Integration**: Cartographer plugin and runtime error handling
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire stack

## State Management
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management with validation

## Build and Deployment
- **ESBuild**: Production bundling for server code
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Deployment**: Optimized for Replit hosting environment