-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'host', 'guest');

-- Create property type enum
CREATE TYPE public.property_type AS ENUM ('hotel', 'apartment', 'villa', 'cabin', 'cottage', 'house');

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Properties table
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    property_type property_type NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    beds INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Amenities table
CREATE TABLE public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    category TEXT
);

ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

-- Property amenities junction table
CREATE TABLE public.property_amenities (
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (property_id, amenity_id)
);

ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;

-- Bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    guest_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status booking_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (booking_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Favorites table
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, property_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Payment records table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    stripe_payment_id TEXT,
    paypal_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
ON public.properties FOR SELECT
TO authenticated
USING (is_active = true OR host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Hosts can create properties"
ON public.properties FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'host') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Hosts can update their own properties"
ON public.properties FOR UPDATE
TO authenticated
USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Hosts can delete their own properties"
ON public.properties FOR DELETE
TO authenticated
USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Amenities policies
CREATE POLICY "Amenities are viewable by everyone"
ON public.amenities FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage amenities"
ON public.amenities FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Property amenities policies
CREATE POLICY "Property amenities are viewable by everyone"
ON public.property_amenities FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Hosts can manage their property amenities"
ON public.property_amenities FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = property_amenities.property_id
    AND (properties.host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (
  guest_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = bookings.property_id
    AND properties.host_id = auth.uid()
  ) OR
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Guests can create bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (
  guest_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = bookings.property_id
    AND properties.host_id = auth.uid()
  ) OR
  public.has_role(auth.uid(), 'admin')
);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Guests can create reviews for their bookings"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = reviews.booking_id
    AND bookings.guest_id = auth.uid()
    AND bookings.status = 'completed'
  )
);

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
ON public.favorites FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages for their bookings"
ON public.messages FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = messages.booking_id
    AND (
      bookings.guest_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = bookings.property_id
        AND properties.host_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can send messages for their bookings"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = messages.booking_id
    AND (
      bookings.guest_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = bookings.property_id
        AND properties.host_id = auth.uid()
      )
    )
  )
);

-- Payments policies
CREATE POLICY "Users can view payments for their bookings"
ON public.payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = payments.booking_id
    AND (
      bookings.guest_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = bookings.property_id
        AND properties.host_id = auth.uid()
      )
    )
  ) OR
  public.has_role(auth.uid(), 'admin')
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();