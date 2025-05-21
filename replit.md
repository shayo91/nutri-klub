# Nutritionist Website Project Guide

## Overview

This is a full-stack web application for a professional nutritionist's website. The application is built with React on the frontend and Express.js on the backend, using a PostgreSQL database with Drizzle ORM for data management. The site includes features such as a blog, testimonials, BMI calculator, contact form, and various informational sections about the nutritionist's services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React**: The client-side application is built using React.
- **React Router**: Routing is handled via Wouter (lightweight React router).
- **State Management**: Uses React Query for server-state management and React hooks for local state.
- **UI Framework**: Utilizes Shadcn UI components based on Radix UI primitives.
- **Styling**: Tailwind CSS for styling with a custom theme defined in the configuration.
- **Animation**: Framer Motion for page and component animations.

### Backend Architecture
- **Express.js**: The server is built on Express.js running on Node.js.
- **API Routes**: RESTful API endpoints for blog posts, testimonials, and contact form submissions.
- **Validation**: Uses Zod for input validation and type safety.
- **Database ORM**: Drizzle ORM for database interactions, with schemas defined in TypeScript.

### Data Storage
- **PostgreSQL**: Primary database for storing all application data.
- **Schema**: Well-defined tables for users, blog posts, and testimonials.
- **Connection**: Uses NeonDB serverless PostgreSQL connection.

## Key Components

### Frontend Components
1. **Layout**: Wrapper component that includes Header and Footer, maintaining consistent structure across pages.
2. **Header**: Navigation bar with links to different sections of the website.
3. **Footer**: Contains additional links, contact information, and social media links.
4. **Homepage Sections**:
   - HeroSection: Main banner with call-to-action buttons.
   - AboutSection: Information about the nutritionist.
   - ServicesSection: Details about offered services.
   - BMICalculator: Interactive tool for users to calculate their BMI.
   - ProcessSection: Steps in the nutritionist's process.
   - TestimonialsSection: Client reviews and feedback.
   - BlogSection: Latest blog posts.
   - ContactSection: Contact form for inquiries.

### Backend Components
1. **Server**: Express.js server with middleware for logging, body parsing, and error handling.
2. **Storage Layer**: Interface for database operations with implementation for in-memory and PostgreSQL storage.
3. **Routes**: API endpoints for retrieving blog posts, testimonials, and handling contact form submissions.
4. **Schema**: Drizzle ORM schema definitions for database tables and relationships.

### Shared Components
1. **Types**: Shared TypeScript interfaces between frontend and backend.
2. **Validation Schemas**: Zod schemas for validating form inputs on both client and server.

## Data Flow

1. **API Requests**: 
   - The frontend makes requests to API endpoints using React Query.
   - These requests are processed by the Express server.
   
2. **Database Interactions**:
   - The server uses the storage interface to interact with the database.
   - Data is returned as JSON responses to the client.

3. **Form Submissions**:
   - User input is validated using Zod schemas.
   - Validated data is sent to the server via API requests.
   - The server processes the data and returns a confirmation response.

4. **Static Content**:
   - The frontend serves static content like the about section, services, and process information.
   - Images and assets are included in the application bundle.

## External Dependencies

### Frontend
- **@radix-ui/***: Collection of accessible UI primitives.
- **@tanstack/react-query**: Data fetching and caching.
- **framer-motion**: Animation library for React.
- **wouter**: Lightweight routing.
- **tailwindcss**: Utility-first CSS framework.
- **class-variance-authority**: Creating variant styles for UI components.

### Backend
- **express**: Web server framework.
- **drizzle-orm**: TypeScript ORM for PostgreSQL.
- **@neondatabase/serverless**: Serverless PostgreSQL driver.
- **zod**: Schema validation library.

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development Mode**:
   - Run `npm run dev` to start the application in development mode.
   - Vite handles hot module replacement for the frontend.
   - The Express server serves the frontend through a middleware.

2. **Production Build**:
   - Run `npm run build` to create a production build.
   - Frontend assets are built using Vite and placed in `dist/public`.
   - Server code is bundled using esbuild into `dist/index.js`.

3. **Production Start**:
   - Run `npm run start` to start the production server.
   - The server serves static files from the built assets.

4. **Database Management**:
   - Run `npm run db:push` to apply schema changes to the database.
   - The application requires a PostgreSQL database connection string in `DATABASE_URL` environment variable.

## Getting Started

1. **Setting up the environment**:
   - Ensure the `DATABASE_URL` environment variable is set.
   - Run `npm install` to install dependencies.

2. **Development workflow**:
   - Run `npm run dev` to start the development server.
   - Navigate to http://localhost:5000 to view the application.

3. **Adding new features**:
   - Frontend: Add new React components in `client/src/components`.
   - Backend: Add new API routes in `server/routes.ts`.
   - Database: Add new schemas in `shared/schema.ts`.

4. **Deployment**:
   - The application is configured to deploy automatically on Replit.
   - The build process is defined in the `.replit` configuration file.