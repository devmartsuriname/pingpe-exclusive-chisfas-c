# Backend Architecture

## Overview
This project uses **Supabase** as the backend platform, providing PostgreSQL database, authentication, storage, and Row-Level Security (RLS).

---

## Database Schema

### Core Tables

#### **profiles**
Stores additional user information beyond auth.users.
- `id` (uuid, PK)
- `user_id` (uuid, references auth.users) - The authenticated user
- `full_name` (text)
- `avatar_url` (text)
- `bio` (text)
- `phone` (text)
- `created_at`, `updated_at` (timestamp)

**Relationships:**
- One-to-one with auth.users
- One-to-many with properties (as host)
- One-to-many with bookings (as guest)

---

#### **user_roles**
Multi-role system for access control.
- `id` (uuid, PK)
- `user_id` (uuid, references auth.users)
- `role` (app_role enum: 'admin', 'host', 'guest')
- `created_at` (timestamp)

**Important:** Users can have multiple roles simultaneously.

---

#### **properties**
Accommodation listings managed by hosts.
- `id` (uuid, PK)
- `host_id` (uuid, references profiles)
- `title`, `description` (text)
- `property_type` (enum: 'apartment', 'house', 'villa', etc.)
- `address`, `city`, `country` (text)
- `latitude`, `longitude` (numeric)
- `guests`, `bedrooms`, `bathrooms`, `beds` (integer)
- `price_per_night` (numeric)
- `images` (text[])
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamp)

---

#### **experiences**
Activity listings managed by hosts.
- `id` (uuid, PK)
- `host_id` (uuid)
- `title`, `description` (text)
- `price_per_person` (numeric)
- `duration_hours` (numeric)
- `max_participants`, `min_participants` (integer)
- `difficulty_level`, `age_restriction` (text/integer)
- `meeting_point`, `latitude`, `longitude` (text/numeric)
- `includes`, `what_to_bring`, `language` (text[])
- `images` (text[])
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamp)

---

#### **events**
Scheduled events with fixed dates.
- `id` (uuid, PK)
- `organizer_id` (uuid)
- `title`, `description`, `category` (text)
- `event_date` (timestamp)
- `duration_hours` (numeric)
- `price_per_person` (numeric)
- `max_attendees` (integer)
- `location`, `latitude`, `longitude` (text/numeric)
- `includes` (text[])
- `images` (text[])
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamp)

---

#### **transport**
Transportation services.
- `id` (uuid, PK)
- `provider_id` (uuid)
- `title`, `description` (text)
- `vehicle_type` (text)
- `route_from`, `route_to` (text)
- `price_per_person`, `price_per_group` (numeric)
- `capacity` (integer)
- `duration_hours` (numeric)
- `luggage_allowance` (text)
- `amenities` (text[])
- `images` (text[])
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamp)

---

#### **packages**
Multi-day itineraries combining multiple inventory types.
- `id` (uuid, PK)
- `creator_id` (uuid)
- `title`, `description` (text)
- `duration_days` (integer)
- `price_total` (numeric)
- `discount_percentage` (numeric)
- `max_participants` (integer)
- `includes_summary` (text[])
- `images` (text[])
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamp)

**Related:** `package_items` (many-to-many with inventory)

---

#### **bookings**
Customer reservations.
- `id` (uuid, PK)
- `guest_id` (uuid, references profiles)
- `property_id` (uuid, references properties)
- `inventory_id` (uuid) - Generic reference to any inventory type
- `inventory_type` (enum: 'stay', 'experience', 'event', 'transport', 'package')
- `check_in`, `check_out` (date)
- `guests` (integer)
- `total_price` (numeric)
- `status` (enum: 'pending', 'confirmed', 'completed', 'cancelled')
- `created_at`, `updated_at` (timestamp)

**Related:**
- `booking_items` - Individual items within a booking
- `payments` - Payment records
- `refunds` - Refund requests

---

#### **availability**
Dynamic inventory availability and pricing.
- `id` (uuid, PK)
- `inventory_id` (uuid)
- `inventory_type` (enum)
- `date` (date)
- `capacity` (integer)
- `booked` (integer)
- `price_override` (numeric) - Optional daily price override
- `is_blocked` (boolean)
- `notes` (text)
- `created_at` (timestamp)

---

#### **price_rules**
Dynamic pricing and promotions.
- `id` (uuid, PK)
- `inventory_id` (uuid)
- `inventory_type` (enum)
- `rule_name`, `rule_type` (text)
- `date_start`, `date_end` (date)
- `day_of_week` (integer[])
- `min_participants`, `max_participants` (integer)
- `discount_percentage`, `discount_fixed` (numeric)
- `price_multiplier` (numeric)
- `promo_code` (text)
- `priority` (integer)
- `is_active` (boolean)
- `created_at` (timestamp)

---

#### **reviews**
Customer feedback for properties and experiences.
- `id` (uuid, PK)
- `reviewer_id` (uuid, references profiles)
- `property_id` (uuid, references properties)
- `booking_id` (uuid, references bookings)
- `rating` (integer, 1-5)
- `comment` (text)
- `created_at` (timestamp)

---

#### **partners**
External partners for commissions.
- `id` (uuid, PK)
- `name`, `contact_name`, `contact_email`, `contact_phone` (text)
- `address` (text)
- `commission_rate` (numeric)
- `payment_terms` (text)
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamp)

**Related:** `partner_bookings` - Commission tracking

---

#### **settings**
Platform-wide configuration (key-value store).
- `key` (text, PK)
- `value` (jsonb)
- `description` (text)
- `updated_by` (uuid)
- `updated_at` (timestamp)

**Available Settings Keys:**
- `platform_name` - Site name
- `contact_email`, `contact_phone` - Contact info
- `default_currency` - Currency code (e.g., "USD")
- `date_format` - Date display format
- `commission_percentage` - Platform commission
- `min_lead_time_days`, `max_lead_time_days` - Booking lead time
- `default_cancellation_policy` - Policy type
- `refund_processing_time_days` - Refund timeframe
- `auto_approve_bookings` - Auto-approval toggle
- `require_host_approval` - Manual approval toggle
- `notification_*` - Email/SMS notification preferences

---

## Row-Level Security (RLS)

### Security Model
All tables have RLS enabled. Access is controlled by:
1. **User authentication** via `auth.uid()`
2. **Role-based permissions** via `has_role()` function
3. **Ownership checks** (e.g., host_id = auth.uid())

### The `has_role()` Function
Security definer function to check user roles without recursive RLS issues:

```sql
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;
```

### Common RLS Patterns

#### Public Read
```sql
CREATE POLICY "Public read access"
ON public.properties
FOR SELECT
USING (is_active = true);
```

#### Owner Write
```sql
CREATE POLICY "Hosts manage their properties"
ON public.properties
FOR ALL
USING (host_id = auth.uid() OR has_role(auth.uid(), 'admin'));
```

#### Admin Override
```sql
CREATE POLICY "Admins can manage all"
ON public.partners
FOR ALL
USING (has_role(auth.uid(), 'admin'));
```

---

## Authentication

### Multi-Role Architecture
Users can have multiple roles stored in `user_roles` table:
- **Guest** - Default role, can book
- **Host** - Can create inventory
- **Admin** - Full platform access

### User Registration Flow
1. User signs up via Supabase Auth
2. Trigger `handle_new_user()` creates profile
3. Trigger `assign_default_role()` assigns 'guest' role
4. Additional roles can be granted by admins

### Auth Context
The frontend uses `AuthContext` to:
- Track authentication state
- Cache user profile and roles
- Provide `hasRole()` helper function

---

## Storage

### Buckets
- **inventory_images** - Public bucket for property/experience images

### Upload Workflow
1. Client uploads to Supabase Storage
2. Storage URL returned
3. URL stored in `images` array on inventory record

### RLS Policies
- Public read access for all images
- Authenticated users can upload to their folder
- Hosts/admins can manage their inventory images

---

#### **blog_posts**
Blog articles and content.
- `id` (uuid, PK)
- `author_id` (uuid, references profiles)
- `category_id` (uuid, references blog_categories)
- `title`, `slug` (text)
- `excerpt`, `body` (text)
- `featured_image` (text)
- `status` (text: 'draft', 'published')
- `published_at` (timestamp)
- `seo_meta` (jsonb) - Title, description, keywords
- `created_at`, `updated_at` (timestamp)

**Related:** `blog_categories`, `blog_tags`, `blog_post_tags`

---

#### **pages**
Dynamic custom pages.
- `id` (uuid, PK)
- `created_by` (uuid)
- `title`, `slug` (text)
- `status` (text: 'draft', 'published')
- `seo_meta` (jsonb)
- `created_at`, `updated_at` (timestamp)

**Related:** `page_sections` - Content blocks for each page

---

#### **media_library**
Centralized media management.
- `id` (uuid, PK)
- `uploaded_by` (uuid)
- `name`, `folder` (text)
- `url`, `thumbnail_url`, `webp_url`, `avif_url` (text)
- `file_type`, `file_size` (text/integer)
- `width`, `height` (integer)
- `alt_text` (text)
- `tags` (text[])
- `srcset` (jsonb)
- `created_at`, `updated_at` (timestamp)

---

## Edge Functions

### Payment Processing

#### `/functions/v1/create-payment-intent`
Initializes Stripe payment for a booking.

**Input:**
```json
{
  "booking_id": "uuid",
  "amount": 250.00
}
```

**Output:**
```json
{
  "client_secret": "pi_xxx_secret_xxx",
  "payment_intent_id": "pi_xxx"
}
```

#### `/functions/v1/confirm-payment`
Confirms and finalizes payment.

**Input:**
```json
{
  "payment_intent_id": "pi_xxx",
  "booking_id": "uuid"
}
```

**Output:**
```json
{
  "success": true,
  "booking_status": "confirmed"
}
```

### Email Notifications

#### `/functions/v1/send-email`
Sends transactional emails via Resend.

**Input:**
```json
{
  "type": "booking-confirmation",
  "to": "guest@example.com",
  "data": {
    "booking_id": "uuid",
    "guest_name": "John Doe",
    "property_title": "Jungle Lodge",
    "check_in": "2025-11-01",
    "check_out": "2025-11-04"
  }
}
```

**Templates:**
- `booking-confirmation` - New booking created
- `payment-receipt` - Payment completed
- `cancellation-notice` - Booking cancelled
- `reminder` - Upcoming booking reminder

---

## Database Functions & Triggers

### `handle_new_user()`
Automatically creates a profile when a user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, user_id, full_name)
  VALUES (gen_random_uuid(), NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$function$
```

**Trigger:**
```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### `assign_default_role()`
Assigns the default 'guest' role to new users:

```sql
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'guest'::app_role);
  RETURN NEW;
END;
$function$
```

---

### `update_updated_at_column()`
Automatically updates `updated_at` timestamps:

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
```

Applied to: `profiles`, `properties`, `experiences`, `transport`, `packages`, `bookings`, `blog_posts`, `pages`, `media_library`

---

### `update_blog_updated_at()`
Similar to above, specifically for blog posts:

```sql
CREATE OR REPLACE FUNCTION public.update_blog_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
```

---

## Query Patterns

### Fetching User with Roles
```typescript
const { data } = await supabase
  .from('profiles')
  .select('*, user_roles(role)')
  .eq('user_id', userId)
  .single();
```

### Checking Admin Access
```typescript
const isAdmin = await supabase
  .rpc('has_role', { _user_id: userId, _role: 'admin' });
```

### Fetching Bookings with Details
```typescript
const { data } = await supabase
  .from('bookings')
  .select(`
    *,
    properties(title, images),
    profiles!guest_id(full_name, avatar_url),
    booking_items(*)
  `)
  .eq('guest_id', userId);
```

---

---

## Performance Optimization

### Indexes
Critical indexes for query performance:
- `properties.host_id` - Host property lookups
- `bookings.guest_id` - Guest booking history
- `bookings.property_id` - Property bookings
- `user_roles.user_id` - Role checks
- `availability.inventory_id, availability.date` - Availability queries
- `blog_posts.slug` - SEO-friendly URL lookups
- `pages.slug` - Page routing

### Caching Strategy
- **TanStack Query** on frontend for data caching
- Cache invalidation on mutations
- Prefetch related data (bookings + properties + profiles)
- Optimistic updates for better UX

### Pagination
Use `.range()` for large datasets:
```typescript
const { data } = await supabase
  .from('bookings')
  .select('*')
  .range(0, 9); // First 10 items
```

### Rate Limiting
- Edge Functions have built-in rate limiting
- API requests limited per Supabase plan tier
- Consider implementing request throttling for public endpoints

---

## Security Best Practices

1. **Never reference auth.users directly** - Use profiles table
2. **Always use RLS** - Never disable for convenience
3. **Use security definer functions** - Avoid recursive RLS
4. **Validate on both sides** - Client + database constraints
5. **Use transactions** - For multi-step operations
6. **Index foreign keys** - For query performance
7. **Use enums** - For consistent status values
8. **Store dates as timestamps** - Include timezone info
9. **Encrypt sensitive data** - Store API keys in settings table
10. **Validate email templates** - Prevent injection attacks
11. **Sanitize user input** - Especially in rich text editors
12. **Use prepared statements** - Prevent SQL injection

---

## Entity Relationship Overview

### Primary Relationships
- **User → Profiles** (1:1)
- **User → User Roles** (1:many)
- **Host → Properties/Experiences/Transport** (1:many)
- **Guest → Bookings** (1:many)
- **Booking → Booking Items** (1:many)
- **Package → Package Items** (many:many with inventory)
- **Property → Amenities** (many:many)
- **Blog Post → Categories/Tags** (many:many)
- **Page → Page Sections** (1:many)

### Inventory Polymorphism
The system uses a polymorphic `inventory_type` + `inventory_id` pattern for:
- Bookings (can reference any inventory type)
- Availability (applies to all inventory)
- Price Rules (applies to all inventory)
- Package Items (combines multiple inventory types)

**Schema Diagram:** Export ERD from Supabase Dashboard → Database → Schema Visualizer

---

## Common Queries

### Grant Admin Role
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### Create Setting
```sql
INSERT INTO public.settings (key, value, description)
VALUES ('platform_name', '"My Platform"', 'The name of the platform');
```

### Check All Roles for User
```sql
SELECT role FROM public.user_roles WHERE user_id = 'user-uuid-here';
```
