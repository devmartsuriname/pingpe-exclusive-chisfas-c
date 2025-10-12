# Multi-Inventory Booking Platform

A comprehensive booking and inventory management platform built with React, TypeScript, and Supabase.

## Project info

**URL**: https://lovable.dev/projects/5a4cf1b6-ccd3-415d-a81b-8ac1ce534baa

## Features

- **Multi-Inventory System**: Properties, Experiences, Events, Transport, and Packages
- **Admin Dashboard**: Real-time analytics, reports, and management tools
- **Role-Based Access**: Guest, Host, and Admin roles with granular permissions
- **Dynamic Pricing**: Date-based pricing, promotions, and package discounts
- **Booking Management**: Status tracking, approvals, and refund processing
- **Partner System**: Commission tracking and partner management
- **Reports & Analytics**: Financial, booking, and performance reports with CSV export
- **Settings Management**: Platform configuration, notifications, and integrations

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5a4cf1b6-ccd3-415d-a81b-8ac1ce534baa) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui components
- TanStack Query (data fetching)
- React Router v6 (routing)
- React Hook Form + Zod (validation)
- Recharts (data visualization)

**Backend:**
- Supabase (PostgreSQL database)
- Row-Level Security (RLS)
- Supabase Auth (authentication)
- Supabase Storage (file uploads)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### 1. Clone and Install
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

### 2. Supabase Configuration
The project is already connected to Supabase. Connection details:
- **Project ID**: `kolzaqqfwldrksyrlwxx`
- **Supabase URL**: `https://kolzaqqfwldrksyrlwxx.supabase.co`
- **Anon Key**: Available in project code

### 3. Database Setup
The database schema is already deployed via migrations in `supabase/migrations/`.

### 4. Create Admin User

After signing up through the application, grant admin access:

```sql
-- 1. Get your user ID from the Supabase dashboard (Authentication > Users)
-- 2. Run this SQL in the Supabase SQL Editor:

INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

### 5. Seed Settings (Optional)

```sql
-- Platform settings
INSERT INTO public.settings (key, value, description) VALUES
  ('platform_name', '"My Booking Platform"', 'Platform name'),
  ('contact_email', '"admin@example.com"', 'Contact email'),
  ('default_currency', '"USD"', 'Default currency code'),
  ('commission_percentage', '10', 'Platform commission rate'),
  ('auto_approve_bookings', 'false', 'Auto-approve bookings'),
  ('require_host_approval', 'true', 'Require host approval for bookings');
```

### 6. Start Development Server
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Admin Access

### Login as Admin
1. Sign up via the application UI
2. Run the admin role SQL (see step 4 above)
3. Refresh the page
4. Access admin panel at `/admin/dashboard`

### Admin Routes
- `/admin/dashboard` - Overview and KPIs
- `/admin/users` - User management
- `/admin/properties` - Property management
- `/admin/experiences` - Experience management
- `/admin/bookings` - Booking management
- `/admin/partners` - Partner management
- `/admin/reports` - Analytics and reports
- `/admin/settings` - Platform settings

## Environment Variables

This project uses Supabase and does not require a `.env` file. All configuration is stored in:
- `src/integrations/supabase/client.ts` - Supabase connection

For integrations requiring secrets (Stripe, email services, etc.), use Supabase Edge Functions with environment variables configured in the Supabase dashboard.

## Documentation

Detailed documentation is available in the `/docs` folder:

- **[Backend Architecture](./docs/backend.md)** - Database schema, RLS policies, authentication
- **[Frontend Architecture](./docs/architecture.md)** - Component patterns, state management, routing

## Deployment

### Deploy to Production
1. Open [Lovable](https://lovable.dev/projects/5a4cf1b6-ccd3-415d-a81b-8ac1ce534baa)
2. Click **Share → Publish**
3. Your app will be deployed to `yourproject.lovable.app`

### Custom Domain
Navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Development Workflow

### Code Editing
- **Lovable IDE**: Edit directly at [lovable.dev](https://lovable.dev/projects/5a4cf1b6-ccd3-415d-a81b-8ac1ce534baa)
- **Local IDE**: Clone repo and push changes
- **GitHub Codespaces**: Edit in browser via GitHub

### Database Migrations
Migrations are stored in `supabase/migrations/`. Run new migrations via Supabase CLI or dashboard.

### Adding Admin Users
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid', 'admin');
```

### Adding Host Role
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid', 'host');
```

## Security Considerations

⚠️ **Important Security Notes:**
1. All tables use Row-Level Security (RLS)
2. Admin access is role-based via `user_roles` table
3. Never store roles in client-side storage
4. Use `has_role()` function for permission checks
5. All file uploads go through Supabase Storage with RLS

## Support & Resources

- **Lovable Docs**: [docs.lovable.dev](https://docs.lovable.dev/)
- **Lovable Discord**: [Join Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

## License

This project is built with [Lovable](https://lovable.dev).
