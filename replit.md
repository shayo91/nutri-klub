# Nutritionist Website Project Guide

## Overview

This is a full-stack web application for a professional nutritionist's website. The application uses a **hybrid data storage approach**:
- **Notion CMS**: Manages content (blog posts, testimonials, announcements, ebooks, videos, podcasts, social media)
- **SQLite/PostgreSQL**: Stores user data (authentication, subscriptions, preferences, favorites, contact messages)

The application is built with React on the frontend and Express.js on the backend, using Drizzle ORM for database management.

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

### Data Storage (Hybrid Approach)

#### Notion CMS (Content Management)
- **Blog Posts**: Managed in Notion database "Blog Posts"
- **Testimonials**: Managed in Notion database "Testimonials"
- **Announcements**: Managed in Notion database "Announcements"
- **Ebooks**: Managed in Notion database "Ebooks"
- **Videos**: Managed in Notion database "Videos"
- **Podcasts**: Managed in Notion database "Podcasts"
- **Social Media**: Managed in Notion database "SocialMedia"

**Notion Integration:**
- Uses Notion API to fetch content
- Content is managed through Notion interface (no database migrations needed)
- Environment variables: `NOTION_INTEGRATION_SECRET`, `NOTION_PAGE_URL`

#### Database (User Data)
- **SQLite** (Local Development): File-based database (`local.db`) - no setup required
- **PostgreSQL** (Production): Uses NeonDB serverless PostgreSQL or any PostgreSQL instance

**Database Tables:**
- `users`: Authentication and user management
- `user_preferences`: Allergies, dietary restrictions, goals
- `subscriptions`: Stripe subscriptions and one-time purchases
- `user_favorites`: Saved recipes
- `contact_messages`: Contact form submissions
- `newsletter_subscriptions`: Newsletter signups
- `products`, `cart_items`, `orders`, `order_items`: E-commerce (if needed)

**Database Selection:**
- Automatically uses SQLite if `DATABASE_TYPE=sqlite` or if `DATABASE_URL` is not set in development
- Uses PostgreSQL if `DATABASE_URL` is set (production)

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
   - TestimonialsSection: Client reviews and feedback (from Notion).
   - BlogSection: Latest blog posts (from Notion).
   - ContactSection: Contact form for inquiries.

### Backend Components
1. **Server**: Express.js server with middleware for logging, body parsing, and error handling.
2. **Storage Layer**: 
   - `server/db-storage.ts`: Database storage for user data (uses Drizzle ORM)
   - `server/notion.ts`: Notion API integration for CMS content
3. **Routes**: API endpoints for retrieving blog posts, testimonials, and handling contact form submissions.
4. **Schema**: Drizzle ORM schema definitions for database tables (`shared/schema.ts`).

### Shared Components
1. **Types**: Shared TypeScript interfaces between frontend and backend.
2. **Validation Schemas**: Zod schemas for validating form inputs on both client and server.

## Data Flow

1. **CMS Content (Notion)**:
   - Frontend requests content (blog posts, testimonials, etc.)
   - Backend fetches from Notion API
   - Data is returned as JSON to the client
   - No database storage needed for CMS content

2. **User Data (Database)**:
   - User registration, authentication, preferences stored in SQLite/PostgreSQL
   - Contact form submissions saved to database
   - Subscriptions and purchases tracked in database
   - Favorites and user-specific data stored in database

3. **API Requests**: 
   - The frontend makes requests to API endpoints using React Query.
   - These requests are processed by the Express server.
   - CMS content comes from Notion, user data comes from database.

4. **Form Submissions**:
   - User input is validated using Zod schemas.
   - Validated data is sent to the server via API requests.
   - User data is saved to database, CMS content is managed in Notion.

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
- **drizzle-orm**: TypeScript ORM for database interactions.
- **better-sqlite3**: SQLite driver for local development.
- **@neondatabase/serverless**: Serverless PostgreSQL driver for production.
- **@notionhq/client**: Notion API client for CMS integration.
- **zod**: Schema validation library.

## Local Development Setup

1. **Setting up the environment**:
   ```bash
   # Copy .env.example to .env (if exists) or create .env file
   # Add Notion credentials (required)
   NOTION_INTEGRATION_SECRET=your_notion_secret
   NOTION_PAGE_URL=https://www.notion.so/your-page-url
   
   # For local development, SQLite will be used automatically
   # No DATABASE_URL needed for local development
   
   # For production, add PostgreSQL connection string
   # DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize database** (SQLite for local):
   ```bash
   npm run db:push
   ```
   This will create `local.db` file in the project root.

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Navigate to http://localhost:5000 to view the application.

## Database Management

### Local Development (SQLite)
- Database file: `local.db` (created automatically)
- No setup required - just run `npm run db:push`
- Database is file-based, easy to reset by deleting `local.db`

### Production (PostgreSQL)
- Set `DATABASE_URL` environment variable
- Run `npm run db:push` to apply schema changes
- Uses NeonDB serverless PostgreSQL or any PostgreSQL instance

### Available Commands
- `npm run db:push` - Push schema changes to database (creates/updates tables)
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Notion CMS Setup

1. **Create Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Create new integration
   - Copy the integration secret

2. **Share Notion Page with Integration**:
   - Open your Notion page
   - Click "..." menu → "Add connections"
   - Select your integration

3. **Set Environment Variables**:
   - `NOTION_INTEGRATION_SECRET`: Your integration secret
   - `NOTION_PAGE_URL`: URL of your Notion page

4. **Create Notion Databases** (optional - can be created via script):
   - Blog Posts
   - Testimonials
   - Announcements
   - Ebooks
   - Videos
   - Podcasts
   - SocialMedia

   Or run setup script:
   ```bash
   npx tsx server/setup-notion.ts
   ```

## Adding New Features

1. **Frontend**: Add new React components in `client/src/components`
2. **Backend**: Add new API routes in `server/routes.ts`
3. **Database**: Add new schemas in `shared/schema.ts`, then run `npm run db:push`
4. **CMS Content**: Add new Notion databases and update `server/notion.ts`

## Deployment

### Production Environment Variables
- `NODE_ENV=production`
- `DATABASE_URL`: PostgreSQL connection string
- `NOTION_INTEGRATION_SECRET`: Notion integration secret
- `NOTION_PAGE_URL`: Notion page URL
- `JWT_SECRET`: Secret for JWT tokens (for auth)
- `STRIPE_SECRET_KEY`: Stripe secret key (for payments)

### Build Process
1. Run `npm run build` to create production build
2. Frontend assets are built using Vite and placed in `dist/public`
3. Server code is bundled using esbuild into `dist/index.js`
4. Run `npm run start` to start the production server

## Architecture Benefits

### Why Hybrid Approach?
- **Notion CMS**: Easy content management without database migrations, non-technical users can manage content
- **Database**: Secure storage for user data, authentication, transactions
- **Flexibility**: Content changes don't require code deployments
- **Scalability**: Database handles user data efficiently, Notion handles content management

### Best Practices
- Keep CMS content in Notion (blog, testimonials, etc.)
- Keep user-specific data in database (auth, preferences, subscriptions)
- Use database for transactional data (orders, payments)
- Use Notion for marketing/content data
