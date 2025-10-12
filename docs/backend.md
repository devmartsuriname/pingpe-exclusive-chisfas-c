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

## Edge Functions
None currently implemented, but can be added for:
- Payment processing webhooks
- Email notifications
- Third-party API integrations
- Complex business logic

---

## Database Functions

### `update_updated_at_column()`
Trigger function to auto-update `updated_at` timestamps:

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

Applied to tables with `updated_at` columns.

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

## Best Practices

1. **Never reference auth.users directly** - Use profiles table
2. **Always use RLS** - Never disable for convenience
3. **Use security definer functions** - Avoid recursive RLS
4. **Validate on both sides** - Client + database constraints
5. **Use transactions** - For multi-step operations
6. **Index foreign keys** - For query performance
7. **Use enums** - For consistent status values
8. **Store dates as timestamps** - Include timezone info

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
