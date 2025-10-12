-- Add new enums for inventory types
CREATE TYPE public.inventory_type AS ENUM ('stay', 'experience', 'transport', 'package', 'event');

-- Update booking_status to include missing states from PRD
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'payment_intent';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'pending_approval';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'refunded';

-- Experiences table (tours, activities, cultural visits)
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_hours DECIMAL(4,2) NOT NULL,
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'extreme')),
    age_restriction INTEGER,
    language TEXT[] DEFAULT '{}',
    includes TEXT[] DEFAULT '{}',
    what_to_bring TEXT[] DEFAULT '{}',
    meeting_point TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    price_per_person DECIMAL(10,2) NOT NULL,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Transport table (boats, 4x4, shuttles)
CREATE TABLE public.transport (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    vehicle_type TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    luggage_allowance TEXT,
    route_from TEXT NOT NULL,
    route_to TEXT NOT NULL,
    duration_hours DECIMAL(4,2),
    price_per_person DECIMAL(10,2) NOT NULL,
    price_per_group DECIMAL(10,2),
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.transport ENABLE ROW LEVEL SECURITY;

-- Events table (full moon ceremonies, festivals)
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours DECIMAL(4,2),
    location TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    max_attendees INTEGER,
    price_per_person DECIMAL(10,2) NOT NULL,
    includes TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Packages table (bundled offerings)
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    price_total DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2),
    max_participants INTEGER NOT NULL,
    includes_summary TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Package items junction table
CREATE TABLE public.package_items (
    package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
    inventory_type inventory_type NOT NULL,
    inventory_id UUID NOT NULL,
    quantity INTEGER DEFAULT 1,
    day_number INTEGER,
    notes TEXT,
    PRIMARY KEY (package_id, inventory_type, inventory_id)
);

ALTER TABLE public.package_items ENABLE ROW LEVEL SECURITY;

-- Price rules table (seasonal pricing, group discounts, promo codes)
CREATE TABLE public.price_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_type inventory_type NOT NULL,
    inventory_id UUID NOT NULL,
    rule_name TEXT NOT NULL,
    rule_type TEXT CHECK (rule_type IN ('seasonal', 'weekend', 'group_discount', 'promo_code', 'early_bird')),
    date_start DATE,
    date_end DATE,
    day_of_week INTEGER[],
    min_participants INTEGER,
    max_participants INTEGER,
    discount_percentage DECIMAL(5,2),
    discount_fixed DECIMAL(10,2),
    price_multiplier DECIMAL(5,2),
    promo_code TEXT,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.price_rules ENABLE ROW LEVEL SECURITY;

-- Availability table (date-based capacity and pricing overrides)
CREATE TABLE public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_type inventory_type NOT NULL,
    inventory_id UUID NOT NULL,
    date DATE NOT NULL,
    capacity INTEGER,
    booked INTEGER DEFAULT 0,
    price_override DECIMAL(10,2),
    is_blocked BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (inventory_type, inventory_id, date)
);

ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Partners table (travel agencies, tour operators)
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_name TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    commission_rate DECIMAL(5,2) NOT NULL,
    payment_terms TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Partner bookings junction table
CREATE TABLE public.partner_bookings (
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_paid BOOLEAN DEFAULT false,
    commission_paid_date DATE,
    notes TEXT,
    PRIMARY KEY (booking_id, partner_id)
);

ALTER TABLE public.partner_bookings ENABLE ROW LEVEL SECURITY;

-- Notifications log table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    channel TEXT CHECK (channel IN ('email', 'sms', 'whatsapp', 'push')),
    subject TEXT,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT CHECK (status IN ('sent', 'failed', 'pending')),
    error_message TEXT,
    external_id TEXT
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Settings table (key-value configuration)
CREATE TABLE public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Refunds table
CREATE TABLE public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    refund_method TEXT CHECK (refund_method IN ('original', 'voucher', 'bank_transfer')),
    status TEXT CHECK (status IN ('requested', 'approved', 'processing', 'completed', 'rejected')) DEFAULT 'requested',
    requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    voucher_code TEXT,
    voucher_expires_at DATE,
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- Booking items table (for package line items)
CREATE TABLE public.booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    inventory_type inventory_type NOT NULL,
    inventory_id UUID NOT NULL,
    quantity INTEGER DEFAULT 1,
    price_per_unit DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    date DATE,
    notes TEXT
);

ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;

-- Update bookings table to support all inventory types
ALTER TABLE public.bookings ADD COLUMN inventory_type inventory_type DEFAULT 'stay';
ALTER TABLE public.bookings ADD COLUMN inventory_id UUID;

-- RLS Policies for Experiences
CREATE POLICY "Experiences are viewable by everyone"
ON public.experiences FOR SELECT
TO authenticated
USING (is_active = true OR host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Hosts can create experiences"
ON public.experiences FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'host') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Hosts can update their own experiences"
ON public.experiences FOR UPDATE
TO authenticated
USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Hosts can delete their own experiences"
ON public.experiences FOR DELETE
TO authenticated
USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Transport
CREATE POLICY "Transport is viewable by everyone"
ON public.transport FOR SELECT
TO authenticated
USING (is_active = true OR provider_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can create transport"
ON public.transport FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'host') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can update their own transport"
ON public.transport FOR UPDATE
TO authenticated
USING (provider_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can delete their own transport"
ON public.transport FOR DELETE
TO authenticated
USING (provider_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Events
CREATE POLICY "Events are viewable by everyone"
ON public.events FOR SELECT
TO authenticated
USING (is_active = true OR organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Organizers can create events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'host') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Organizers can update their own events"
ON public.events FOR UPDATE
TO authenticated
USING (organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Organizers can delete their own events"
ON public.events FOR DELETE
TO authenticated
USING (organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Packages
CREATE POLICY "Packages are viewable by everyone"
ON public.packages FOR SELECT
TO authenticated
USING (is_active = true OR creator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Creators can create packages"
ON public.packages FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'host') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Creators can update their own packages"
ON public.packages FOR UPDATE
TO authenticated
USING (creator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Creators can delete their own packages"
ON public.packages FOR DELETE
TO authenticated
USING (creator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Package Items
CREATE POLICY "Package items are viewable by everyone"
ON public.package_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Package creators can manage their package items"
ON public.package_items FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.packages
    WHERE packages.id = package_items.package_id
    AND (packages.creator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- RLS Policies for Price Rules
CREATE POLICY "Price rules are viewable by inventory owners"
ON public.price_rules FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins and hosts can manage price rules"
ON public.price_rules FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'host') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Availability
CREATE POLICY "Availability is viewable by everyone"
ON public.availability FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Hosts and admins can manage availability"
ON public.availability FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'host') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Partners
CREATE POLICY "Partners are viewable by admins"
ON public.partners FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage partners"
ON public.partners FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Partner Bookings
CREATE POLICY "Partner bookings are viewable by admins and related partners"
ON public.partner_bookings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage partner bookings"
ON public.partner_bookings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for Settings
CREATE POLICY "Settings are viewable by admins"
ON public.settings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage settings"
ON public.settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Refunds
CREATE POLICY "Users can view refunds for their bookings"
ON public.refunds FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = refunds.booking_id
    AND (bookings.guest_id = auth.uid())
  ) OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can request refunds for their bookings"
ON public.refunds FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = requested_by AND
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = refunds.booking_id
    AND bookings.guest_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage refunds"
ON public.refunds FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Booking Items
CREATE POLICY "Users can view booking items for their bookings"
ON public.booking_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = booking_items.booking_id
    AND (
      bookings.guest_id = auth.uid() OR
      public.has_role(auth.uid(), 'admin')
    )
  )
);

CREATE POLICY "System can create booking items"
ON public.booking_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = booking_items.booking_id
    AND bookings.guest_id = auth.uid()
  )
);

-- Add triggers for updated_at columns
CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_updated_at
BEFORE UPDATE ON public.transport
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_refunds_updated_at
BEFORE UPDATE ON public.refunds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();