# 💳 Payment Integration Guide — PingPe v1.1

## Overview
PingPe v1.1 includes a **manual configuration Stripe payment integration** that allows administrators to configure payment processing through the admin panel settings page.

---

## 🔐 Security Architecture

### Key Storage
- All Stripe API keys are stored securely in the Supabase `settings` table
- Secret keys are never exposed to the client-side code
- Keys are retrieved dynamically by Edge Functions during payment processing
- RLS policies ensure only admins can modify payment settings

### Authentication
- Both payment Edge Functions (`create-payment-intent` and `confirm-payment`) require JWT authentication
- Users can only process payments for bookings they own
- Payment intent IDs are validated against booking records before confirmation

---

## 📋 Database Schema Changes

### Bookings Table Updates
The following columns have been added to the `bookings` table:

| Column | Type | Description |
|--------|------|-------------|
| `payment_status` | text | Current payment status (pending, processing, succeeded, failed, refunded, cancelled) |
| `payment_intent_id` | text | Stripe PaymentIntent ID for tracking |
| `payment_provider` | text | Payment provider used (default: 'stripe') |
| `payment_method` | text | Payment method type (card, wallet, etc.) |
| `payment_completed_at` | timestamp | When payment was successfully completed |

**Indexes:**
- `idx_bookings_payment_intent` on `payment_intent_id`
- `idx_bookings_payment_status` on `payment_status`

---

## ⚙️ Configuration Steps

### 1. Access Admin Settings
1. Log in to the admin panel
2. Navigate to **Settings → Payments**
3. Locate the **Stripe Configuration** section

### 2. Obtain Stripe API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. For testing: Copy your **Publishable key** (starts with `pk_test_...`)
3. For testing: Copy your **Secret key** (starts with `sk_test_...`)
4. For production: Use live keys (`pk_live_...` and `sk_live_...`)

### 3. Configure in PingPe
1. Enable **Test Mode** toggle for development
2. Paste **Publishable Key** into the form
3. Paste **Secret Key** into the form
4. (Optional) Add **Webhook Secret** for webhook verification
5. Select **Default Currency** (USD, SRD, EUR)
6. Click **Save Configuration**

### 4. Verify Configuration
- A green checkmark should appear: "✓ Stripe is configured and active"
- Payment processing is now enabled for all booking flows

---

## 🔄 Payment Flow

### Step 1: Create Payment Intent
When a user initiates checkout:

```typescript
const { createPaymentIntent } = usePayment();

const result = await createPaymentIntent({
  bookingId: booking.id,
  amount: booking.total_price,
  currency: 'usd',
  metadata: {
    property_title: property.title,
    guest_name: user.full_name,
  },
});

if (result) {
  const { clientSecret, paymentIntentId } = result;
  // Use clientSecret with Stripe.js to collect payment
}
```

**Edge Function:** `create-payment-intent`
- Verifies user owns the booking
- Retrieves Stripe secret key from settings
- Creates PaymentIntent with Stripe API
- Updates booking with `payment_intent_id` and sets `payment_status` to 'processing'

### Step 2: Collect Payment (Client-Side)
The client-side implementation should:
1. Load Stripe.js with the publishable key from settings
2. Use the `clientSecret` to present payment form
3. Collect payment details from user
4. Confirm payment with Stripe

### Step 3: Confirm Payment
After successful payment confirmation:

```typescript
const { confirmPayment } = usePayment();

const success = await confirmPayment({
  paymentIntentId: result.paymentIntentId,
  bookingId: booking.id,
});

if (success) {
  // Redirect to booking confirmation page
}
```

**Edge Function:** `confirm-payment`
- Retrieves payment intent status from Stripe
- Updates booking status based on payment result
- Creates payment record in `payments` table
- Sets `payment_status` to 'succeeded' and `status` to 'confirmed'

---

## 🛠️ Edge Functions

### create-payment-intent
**Path:** `supabase/functions/create-payment-intent/index.ts`  
**Authentication:** Required (JWT)  
**Method:** POST

**Request Body:**
```json
{
  "bookingId": "uuid",
  "amount": 1500.00,
  "currency": "usd",
  "metadata": {
    "property_title": "Jungle Bungalow",
    "guest_name": "John Doe"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "status": "requires_payment_method"
}
```

**Error (Not Configured):**
```json
{
  "error": "Stripe is not configured. Please contact administrator.",
  "configured": false
}
```

### confirm-payment
**Path:** `supabase/functions/confirm-payment/index.ts`  
**Authentication:** Required (JWT)  
**Method:** POST

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "bookingId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "paymentStatus": "succeeded",
  "bookingStatus": "confirmed",
  "paymentIntent": {
    "id": "pi_xxx",
    "status": "succeeded",
    "amount": 1500.00,
    "currency": "usd"
  }
}
```

---

## 🧪 Testing

### Test Mode Configuration
1. Enable **Test Mode** in payment settings
2. Use Stripe test keys (`pk_test_...`, `sk_test_...`)
3. Use [Stripe test cards](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Authentication Required: `4000 0025 0000 3155`

### Test Scenarios
- ✅ Successful payment flow
- ✅ Payment declined handling
- ✅ User cancels payment
- ✅ Network error during payment
- ✅ Unauthorized booking access
- ✅ Payment for non-existent booking
- ✅ Stripe not configured error

---

## 🎨 UI Components

### PaymentStatusBadge
Displays payment status with appropriate styling:

```tsx
<PaymentStatusBadge status={booking.payment_status} />
```

**Status Colors:**
- **succeeded**: Green (✓ Paid)
- **processing**: Blue (⏱ Processing)
- **pending**: Yellow (💵 Pending)
- **failed**: Red (✗ Failed)
- **refunded**: Purple (⚠ Refunded)
- **cancelled**: Gray (✗ Cancelled)

### usePayment Hook
React hook for payment operations:

```tsx
const { 
  createPaymentIntent, 
  confirmPayment, 
  getPaymentStatus,
  isProcessing 
} = usePayment();
```

---

## 🚨 Troubleshooting

### Issue: "Stripe is not configured" error
**Solution:** Navigate to Settings → Payments and configure Stripe API keys

### Issue: Payment fails silently
**Solution:** Check browser console for errors and verify Stripe keys are correct

### Issue: Booking status not updating
**Solution:** Check Edge Function logs in Supabase Dashboard → Functions

### Issue: "Invalid API Key" error
**Solution:** Verify keys match test/live mode setting

---

## 📊 Monitoring & Logs

### Edge Function Logs
View logs in Supabase Dashboard:
1. Navigate to **Functions** section
2. Select `create-payment-intent` or `confirm-payment`
3. Click **Logs** tab
4. Filter by error level or search terms

### Payment Tracking
Query payment status:
```sql
SELECT 
  b.id,
  b.payment_status,
  b.payment_intent_id,
  b.payment_method,
  b.payment_completed_at,
  p.amount as payment_amount
FROM bookings b
LEFT JOIN payments p ON p.booking_id = b.id
WHERE b.guest_id = '<user_id>'
ORDER BY b.created_at DESC;
```

---

## 🔐 Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Always validate** booking ownership before processing payments
3. **Use webhook secrets** for production (future enhancement)
4. **Monitor failed payments** for potential fraud
5. **Enable 3D Secure** for card payments in production
6. **Test thoroughly** in test mode before going live
7. **Keep Stripe libraries updated** for security patches

---

## 🚀 Going Live

### Pre-Launch Checklist
- [ ] Switch to Stripe **live mode** in settings
- [ ] Update API keys to live keys (`pk_live_...`, `sk_live_...`)
- [ ] Test live payment with real card (small amount)
- [ ] Configure webhook endpoints in Stripe Dashboard
- [ ] Enable fraud detection in Stripe settings
- [ ] Set up email notifications for successful payments
- [ ] Monitor first few transactions closely
- [ ] Document refund procedures for support team

### Production Recommendations
- Use SRD (Surinamese Dollar) as default currency for local payments
- Configure tax handling if applicable
- Set up automated receipt generation
- Implement payment retry logic for failed transactions
- Create admin dashboard for payment monitoring

---

## 📚 Additional Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [PingPe Backend Documentation](./backend.md)

---

**Status:** ✅ Phase 5A Complete — Manual Configuration Mode  
**Next Phase:** 5B - Email Notification Integration  
**Version:** PingPe v1.1 — January 2025
