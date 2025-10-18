-- Seed transport demo entries using an existing user as provider to satisfy FK
DO $$
DECLARE
  _provider uuid;
BEGIN
  SELECT id INTO _provider FROM auth.users ORDER BY created_at ASC LIMIT 1;
  IF _provider IS NULL THEN
    RAISE EXCEPTION 'No users found in auth.users to assign as provider_id';
  END IF;

  INSERT INTO public.transport (
    title, description, provider_id, vehicle_type, route_from, route_to, capacity,
    price_per_person, price_per_group, duration_hours, luggage_allowance, images, amenities, is_active
  ) VALUES
  (
    'Boat Transfer: Atjoni to PingPe (Demo)',
    'Daily boat service from Atjoni dock to Jungle Resort PingPe. Enjoy scenic 2-hour journey along the Upper Suriname River. Luggage included.',
    _provider,
    'boat',
    'Atjoni',
    'PingPe',
    12,
    35,
    NULL,
    2,
    'One large bag and one carry-on per person',
    ARRAY['/demo-content/river-hopping.jpg'],
    ARRAY['Life jackets','Covered seating','Luggage storage'],
    true
  ),
  (
    'Private Charter: Full-Day River Taxi (Demo)',
    'Private boat charter for custom river exploration. Perfect for groups wanting flexibility. Includes experienced captain familiar with all river routes.',
    _provider,
    'boat',
    'PingPe',
    'Custom Routes',
    8,
    35,
    280,
    8,
    'Flexible',
    ARRAY['/demo-content/gallery-3.jpg'],
    ARRAY['Captain','Fuel included','Flexible schedule','Cooler available'],
    true
  );
END $$;