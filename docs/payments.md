# Payment System Documentation - PingPe Platform

**Version:** 1.3.0  
**Last Updated:** 2025-10-24

---

## 💳 Overview

The PingPe payment system is a flexible, multi-provider architecture supporting manual bank transfers (Wise), instant payments (PayPal), and card processing (Stripe planned). The system prioritizes security, admin control, and graceful degradation when providers are unavailable.

---

## 🏗️ System Architecture

### Core Components

1. **PaymentProvider Interface**
   - Abstract base class for all payment providers
   - Standard methods: `createPaymentIntent()`, `confirmPayment()`, `handleWebhook()`

2. **Provider Implementations**
   - **WiseProvider** - Manual bank transfer with admin review
   - **PayPalProvider** - Instant payment via PayPal SDK
   - **StripeProvider** - Card payments (stub for future)

3. **Provider Registry**
   - Auto-detects active provider from `settings` table
   - Returns provider instance or null if disabled
   - Key: `payment_provider_active`

4. **Database Schema**
   - **bookings** table:
     - `payment_status`: 'pending' | 'completed' | 'failed' | 'refunded'
     - `payment_intent_id`: External provider transaction ID
     - `payment_provider`: 'wise' | 'paypal' | 'stripe'
     - `payment_method`: User-friendly name
     - `proof_url`: Storage path for Wise proof uploads
   - **payments** table: Transaction history (legacy, read-only)

5. **Storage Buckets**
   - **payment_proofs** - Private bucket for Wise transfer screenshots
   - RLS: Admins + booking owner can view

6. **Edge Functions**
   - `create-payment-intent-v2` - Initialize payment
   - `confirm-payment-v2` - Complete payment
   - `payment-webhook` - Handle provider callbacks (PayPal/Stripe)
   - `admin-review-payment` - Manual approval workflow (Wise)

---

## 🔄 Payment Flow Diagram

\`\`\`mermaid
flowchart TD
    A[Guest Books Tour] --> B{Select Payment Method}
    B -->|Wise| C[Upload Transfer Proof]
    B -->|PayPal| D[PayPal SDK Button]
    B -->|Stripe| E[Card Entry Future]
    
    C --> F[Admin Reviews]
    F -->|Approve| G[Payment Confirmed]
    F -->|Reject| H[Payment Failed]
    
    D --> I[PayPal Webhook]
    I --> G
    
    E --> J[Stripe Webhook]
    J --> G
    
    G --> K[Booking Confirmed]
    G --> L[Confirmation Email]
    H --> M[Notify Guest]
\`\`\`

---

## 💰 Provider Comparison

| Feature | Wise | PayPal | Stripe |
|---------|------|--------|--------|
| **Type** | Manual Transfer | Instant | Instant |
| **Admin Review** | Required | Automatic | Automatic |
| **Transaction Fee** | 0% (bank charges) | 2.9% + fixed | 2.9% + fixed |
| **Setup Complexity** | Low | Medium | Medium |
| **Refunds** | Manual | API | API |
| **Webhooks** | No | Yes | Yes |
| **Best For** | Local guests | International | Card payments |
| **Implementation** | ✅ Complete | ✅ Complete | 📝 Stub |

---

## ⚙️ Configuration Guide

### Wise Provider Setup

**Overview:** Guests transfer money to PingPe's bank account, upload proof, admin verifies and approves.

**Steps:**

1. **Configure Bank Details**
   - Navigate to **Admin → Settings → Payments**
   - Select "Wise / Bank Transfer" tab
   - Enter:
     ```
     Bank Name: [Your Bank]
     Account Number: [PingPe Account]
     Account Name: Jungle Resort PingPe
     SWIFT/BIC: [If international]
     Instructions: "Transfer to account above, upload screenshot"
     ```
   - Click **Save**

2. **Enable Provider**
   - Toggle "Enable Wise Payments"
   - Provider will appear at checkout

3. **Create Storage Bucket Policy** (Already done)
   ```sql
   -- Bucket: payment_proofs (private)
   -- RLS allows admin + booking owner
   ```

4. **Admin Workflow**
   - Guest completes booking → uploads proof → status: "pending"
   - Admin → Dashboard → Pending Payments widget
   - Click "Review" → View proof → Verify bank account
   - Approve → Status: "completed" → Confirmation email sent
   - Reject → Status: "failed" → Guest notified

---

### PayPal Provider Setup

**Overview:** Instant payment processing via PayPal SDK with webhook confirmation.

**Steps:**

1. **Create PayPal App**
   - Visit https://developer.paypal.com/dashboard
   - Create App → Note Client ID and Secret
   - Enable "Accept payments" capability

2. **Configure Webhooks**
   - In PayPal App settings → Add Webhook
   - URL: `https://kolzaqqfwldrksyrlwxx.supabase.co/functions/v1/payment-webhook`
   - Events:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`

3. **Configure in PingPe**
   - Admin → Settings → Payments → PayPal tab
   - Enter:
     ```
     Client ID: [from PayPal dashboard]
     Client Secret: [from PayPal dashboard]
     Mode: sandbox | live
     ```
   - Click **Save**

4. **Enable Provider**
   - Toggle "Enable PayPal Payments"
   - PayPal button will render at checkout

5. **Test Transaction**
   - Use PayPal sandbox accounts
   - Complete test booking
   - Verify webhook received
   - Check booking status updated to "completed"

---

### Stripe Provider (Planned)

**Status:** Stub implementation exists, full integration pending.

**Planned Steps:**

1. Create Stripe account → Get API keys
2. Configure webhook endpoint
3. Implement `StripeProvider` class methods
4. Update checkout UI with Stripe Elements
5. Test card processing flow

---

## 🛠️ Edge Functions Reference

### `create-payment-intent-v2`

**Purpose:** Initialize payment for a booking

**Auth:** Required (JWT)

**Request:**
```typescript
{
  bookingId: string;     // UUID of booking
  provider: 'wise' | 'paypal' | 'stripe';
  amount: number;        // Total price in EUR
  currency: 'EUR';
  metadata?: {           // Optional provider-specific data
    proofUrl?: string;   // For Wise: storage path to proof
  }
}
```

**Response:**
```typescript
{
  success: boolean;
  paymentIntentId: string;    // Provider transaction ID
  clientSecret?: string;       // For PayPal/Stripe client-side completion
  requiresApproval?: boolean;  // true for Wise
  error?: string;
}
```

**Example (Wise):**
```typescript
const { data, error } = await supabase.functions.invoke('create-payment-intent-v2', {
  body: {
    bookingId: 'uuid-123',
    provider: 'wise',
    amount: 285,
    currency: 'EUR',
    metadata: {
      proofUrl: 'payment_proofs/uuid-123/proof.png'
    }
  }
});
```

---

### `confirm-payment-v2`

**Purpose:** Mark payment as completed

**Auth:** Required (JWT or webhook signature)

**Request:**
```typescript
{
  bookingId: string;
  paymentIntentId: string;
  provider: 'wise' | 'paypal' | 'stripe';
  status: 'completed' | 'failed';
}
```

**Response:**
```typescript
{
  success: boolean;
  booking?: Booking;
  error?: string;
}
```

**Example:**
```typescript
const { data } = await supabase.functions.invoke('confirm-payment-v2', {
  body: {
    bookingId: 'uuid-123',
    paymentIntentId: 'paypal-tx-456',
    provider: 'paypal',
    status: 'completed'
  }
});
```

---

### `payment-webhook`

**Purpose:** Handle provider callbacks (PayPal, Stripe)

**Auth:** None (public endpoint, signature verification required)

**Request:** Provider-specific JSON payload

**Response:**
```typescript
{ received: true }
```

**PayPal Webhook Example:**
```json
{
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": {
    "id": "paypal-tx-456",
    "status": "COMPLETED",
    "amount": {
      "value": "285.00",
      "currency_code": "EUR"
    }
  }
}
```

**Security:**
- Verifies PayPal webhook signature
- Validates event authenticity
- Updates booking status
- Idempotent (handles duplicate events)

---

### `admin-review-payment`

**Purpose:** Admin approves/rejects Wise transfers

**Auth:** Required (Admin role)

**Request:**
```typescript
{
  bookingId: string;
  action: 'approve' | 'reject';
  notes?: string;  // Admin comments
}
```

**Response:**
```typescript
{
  success: boolean;
  booking?: Booking;
  error?: string;
}
```

**Example:**
```typescript
const { data } = await supabase.functions.invoke('admin-review-payment', {
  body: {
    bookingId: 'uuid-123',
    action: 'approve',
    notes: 'Transfer verified in bank account'
  }
});
```

---

## 🛡️ Security Considerations

### 1. Payment Proof Storage

- **Bucket:** `payment_proofs` (private)
- **RLS Policy:**
  ```sql
  CREATE POLICY "Admins and booking owners can view payment proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment_proofs' AND (
      has_role(auth.uid(), 'admin') OR
      EXISTS (
        SELECT 1 FROM bookings
        WHERE bookings.guest_id = auth.uid()
        AND bookings.proof_url = storage.objects.name
      )
    )
  );
  ```

### 2. Webhook Signature Verification

```typescript
// In payment-webhook edge function
import crypto from 'crypto';

function verifyPayPalSignature(headers: Headers, body: string) {
  const signature = headers.get('paypal-transmission-sig');
  const certUrl = headers.get('paypal-cert-url');
  
  // Verify signature against PayPal's public key
  // Return true if valid, false otherwise
}
```

### 3. PCI Compliance

- **Wise:** No card data handled (bank transfers only)
- **PayPal:** Payment handled on PayPal's servers (PCI compliant)
- **Stripe:** Use Stripe.js (no card data touches server)

### 4. Admin Role Validation

```typescript
// In admin-review-payment
const { data: userRoles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId);

if (!userRoles?.some(r => r.role === 'admin')) {
  throw new Error('Unauthorized');
}
```

---

## 🧪 Testing Guide

### Test Wise Flow

1. Create test booking as guest
2. Navigate to checkout
3. Select "Bank Transfer (Wise)"
4. Upload dummy image as proof
5. Submit → Status: "pending"
6. Login as admin → Dashboard
7. Click "Review Payment" → View proof
8. Approve → Status: "completed"
9. Verify confirmation email sent

### Test PayPal Flow (Sandbox)

1. Create PayPal sandbox accounts:
   - Buyer: `buyer@example.com`
   - Merchant: `merchant@example.com`
2. Configure sandbox Client ID/Secret
3. Create test booking
4. Click PayPal button → Login with buyer
5. Complete payment
6. Webhook received → Status: "completed"
7. Check Edge Function logs

### Test Stripe Flow (Future)

1. Use Stripe test keys
2. Test card: `4242 4242 4242 4242`
3. Expiry: Any future date
4. CVC: Any 3 digits
5. Complete payment
6. Webhook confirms → Status: "completed"

---

## 🔧 Troubleshooting

### Issue: "Payment Proof Upload Failed"

**Symptoms:** Upload button hangs, no file appears

**Solutions:**
- ✅ Check storage bucket exists: `payment_proofs`
- ✅ Verify RLS policy allows INSERT
- ✅ Ensure file size < 10MB
- ✅ Check file type: PNG, JPG, PDF

### Issue: "PayPal Button Not Rendering"

**Symptoms:** Blank space at checkout

**Solutions:**
- ✅ Verify Client ID configured in settings
- ✅ Check browser console for SDK errors
- ✅ Ensure provider enabled in settings
- ✅ Test with sandbox mode first

### Issue: "Webhook Not Received"

**Symptoms:** Payment completed but booking still "pending"

**Solutions:**
- ✅ Verify webhook URL in PayPal dashboard
- ✅ Check Edge Function logs for errors
- ✅ Test webhook manually with PayPal simulator
- ✅ Ensure function deployed: `supabase functions deploy payment-webhook`

### Issue: "Admin Can't Approve Wise Payment"

**Symptoms:** Approve button fails

**Solutions:**
- ✅ Confirm user has `admin` role in `user_roles`
- ✅ Check `admin-review-payment` logs
- ✅ Verify booking exists and status is "pending"
- ✅ Ensure proof_url is valid storage path

---

## 📊 Dashboard Widgets

### Payment Status Widget

**Location:** Admin Dashboard (already integrated)

**Features:**
- Shows active payment provider
- Displays pending payments count
- Quick link to review queue
- Last 5 transactions summary

**Data Source:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE payment_status = 'pending') as pending,
  COUNT(*) FILTER (WHERE payment_status = 'completed') as completed,
  COUNT(*) FILTER (WHERE payment_status = 'failed') as failed
FROM bookings
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

## 📈 Reporting & Analytics

### Monthly Revenue Report

```sql
SELECT 
  DATE_TRUNC('month', payment_completed_at) as month,
  payment_provider,
  COUNT(*) as transaction_count,
  SUM(total_price) as total_revenue
FROM bookings
WHERE payment_status = 'completed'
GROUP BY month, payment_provider
ORDER BY month DESC;
```

### Payment Approval Time (Wise)

```sql
SELECT 
  AVG(EXTRACT(EPOCH FROM (payment_completed_at - created_at)) / 3600) as avg_hours
FROM bookings
WHERE payment_provider = 'wise'
AND payment_status = 'completed';
```

---

## 🚀 Future Enhancements

- [ ] **Partial Payments** - Deposits and installments
- [ ] **Refund Automation** - API-based refunds for PayPal/Stripe
- [ ] **Currency Conversion** - Support USD, SRD
- [ ] **Payment Plans** - Monthly payment options
- [ ] **Invoice Generation** - PDF invoices
- [ ] **Stripe Full Implementation** - Card payment support
- [ ] **Mobile Money** - Telesur integration (Suriname)

---

## 📞 Support

**Technical Issues:**  
support@devmart.sr

**PingPe Management:**  
info@jungleresortpingpe.com  
+597 8858525

---

## 📖 Related Documentation

- [Backend Architecture](./backend.md)
- [Email System](./email.md)
- [Admin Guide](./admin-guide.md)
- [Deployment Guide](./deployment.md)

---

**Last Updated:** 2025-10-24  
**Maintained by:** Devmart Suriname
