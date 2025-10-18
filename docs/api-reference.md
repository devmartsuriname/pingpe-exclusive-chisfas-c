# PingPe API Reference

**Version:** 1.1.0

## Edge Functions

### `/functions/v1/send-email`
Send transactional emails

**Request:**
```json
{
  "type": "booking-confirmation",
  "to": "guest@example.com",
  "data": { "booking_id": "uuid", "guest_name": "John" }
}
```

### `/functions/v1/create-payment-intent`
Initialize Stripe payment

**Request:**
```json
{
  "booking_id": "uuid",
  "amount": 250.00
}
```

**Response:**
```json
{
  "client_secret": "pi_xxx",
  "payment_intent_id": "pi_xxx"
}
```

### `/functions/v1/confirm-payment`
Complete payment process

**Request:**
```json
{
  "payment_intent_id": "pi_xxx",
  "booking_id": "uuid"
}
```

## REST API

Base: `https://kolzaqqfwldrksyrlwxx.supabase.co/rest/v1/`

### Properties
```
GET    /properties?is_active=eq.true
POST   /properties
PATCH  /properties?id=eq.{uuid}
DELETE /properties?id=eq.{uuid}
```

### Bookings
```
GET    /bookings?guest_id=eq.{user_id}
POST   /bookings
PATCH  /bookings?id=eq.{uuid}
```

See `docs/backend.md` for complete schema documentation.
