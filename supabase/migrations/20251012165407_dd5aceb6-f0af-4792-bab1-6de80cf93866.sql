-- Add missing foreign key constraints
-- Use DO block to check existence before adding

DO $$ 
BEGIN
  -- Properties: host_id -> profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'properties_host_id_fkey'
  ) THEN
    ALTER TABLE public.properties
    ADD CONSTRAINT properties_host_id_fkey 
    FOREIGN KEY (host_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
  END IF;

  -- Experiences: host_id -> profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'experiences_host_id_fkey'
  ) THEN
    ALTER TABLE public.experiences
    ADD CONSTRAINT experiences_host_id_fkey 
    FOREIGN KEY (host_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
  END IF;

  -- Transport: provider_id -> profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transport_provider_id_fkey'
  ) THEN
    ALTER TABLE public.transport
    ADD CONSTRAINT transport_provider_id_fkey 
    FOREIGN KEY (provider_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
  END IF;

  -- Packages: creator_id -> profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'packages_creator_id_fkey'
  ) THEN
    ALTER TABLE public.packages
    ADD CONSTRAINT packages_creator_id_fkey 
    FOREIGN KEY (creator_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
  END IF;

  -- Events: organizer_id -> profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'events_organizer_id_fkey'
  ) THEN
    ALTER TABLE public.events
    ADD CONSTRAINT events_organizer_id_fkey 
    FOREIGN KEY (organizer_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
  END IF;

  -- Property amenities: property_id -> properties
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'property_amenities_property_id_fkey'
  ) THEN
    ALTER TABLE public.property_amenities
    ADD CONSTRAINT property_amenities_property_id_fkey 
    FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;
  END IF;

  -- Property amenities: amenity_id -> amenities
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'property_amenities_amenity_id_fkey'
  ) THEN
    ALTER TABLE public.property_amenities
    ADD CONSTRAINT property_amenities_amenity_id_fkey 
    FOREIGN KEY (amenity_id) REFERENCES public.amenities(id) ON DELETE CASCADE;
  END IF;

  -- Reviews: property_id -> properties
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_property_id_fkey'
  ) THEN
    ALTER TABLE public.reviews
    ADD CONSTRAINT reviews_property_id_fkey 
    FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;
  END IF;

  -- Reviews: reviewer_id -> profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_reviewer_id_fkey'
  ) THEN
    ALTER TABLE public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey 
    FOREIGN KEY (reviewer_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
  END IF;

  -- Reviews: booking_id -> bookings
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_booking_id_fkey'
  ) THEN
    ALTER TABLE public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey 
    FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;
  END IF;
END $$;