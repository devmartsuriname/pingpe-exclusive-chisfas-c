# 📧 Email Notification Integration Guide — PingPe v1.1

## Overview
PingPe v1.1 includes a **manual configuration email notification system** powered by **Resend.com** that allows administrators to configure email delivery through the admin panel settings page.

---

## 🔐 Security Architecture

### Key Storage
- All Resend API keys are stored securely in the Supabase `settings` table
- API keys are never exposed to the client-side code
- Keys are retrieved dynamically by the Edge Function during email sending
- RLS policies ensure only admins can modify email settings

### Authentication
- The `send-email` Edge Function does not require JWT authentication (system-triggered emails)
- User authentication is optional but supported for user-initiated emails
- Email templates are rendered server-side for security

---

## ⚙️ Configuration Steps

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### 2. Verify Your Domain
**CRITICAL:** You must verify your sending domain before sending emails.

1. Go to [Resend Domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter your domain: `jungleresortpingpe.com`
4. Add the provided DNS records to your domain registrar:
   - SPF record (TXT)
   - DKIM record (TXT)
   - DMARC record (TXT)
5. Click **Verify** once DNS records are added
6. Wait for verification (can take up to 48 hours, usually much faster)

### 3. Get API Key
1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Click **Create API Key**
3. Name it: "PingPe Production" or "PingPe Development"
4. Copy the API key (starts with `re_...`)
5. **IMPORTANT:** Save it securely — you can't view it again!

### 4. Configure in PingPe
1. Log in to the PingPe admin panel
2. Navigate to **Settings → Integrations**
3. Locate the **Email Notifications (Resend)** section
4. Enter configuration:
   - **Resend API Key:** Paste your API key
   - **Sender Email:** `noreply@jungleresortpingpe.com` (must match verified domain)
   - **Sender Name:** `Jungle Resort PingPe`
5. Click **Save Configuration**
6. Click **Send Test Email** to verify setup

### 5. Verify Test Email
- Check your inbox (admin user email)
- Look for "Test Email from Jungle Resort PingPe"
- If not received:
  - Check spam/junk folder
  - Verify domain is fully verified in Resend
  - Check Resend logs for errors
  - Verify API key is correct

---

## 📧 Email Templates

### Available Templates

#### 1. Booking Confirmation
**Template:** `booking-confirmation`  
**Triggered:** When booking status changes to 'confirmed'  
**Recipient:** Guest (booking.guest_id email)

**Data Fields:**
```typescript
{
  userName: string;
  bookingId: string;
  propertyTitle: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  currency: string;
}
```

**Features:**
- Welcoming header with resort branding
- Complete booking details card
- Contact information box
- Check-in instructions reminder

#### 2. Payment Receipt
**Template:** `payment-receipt`  
**Triggered:** When payment status changes to 'succeeded'  
**Recipient:** Guest (booking.guest_id email)

**Data Fields:**
```typescript
{
  userName: string;
  bookingId: string;
  propertyTitle: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentDate: string;
  currency: string;
  transactionId: string;
}
```

**Features:**
- Professional receipt format
- Payment details breakdown
- Transaction ID for reference
- Account access instructions

#### 3. Booking Cancellation
**Template:** `booking-cancellation`  
**Triggered:** When booking status changes to 'cancelled'  
**Recipient:** Guest (booking.guest_id email)

**Data Fields:**
```typescript
{
  userName: string;
  bookingId: string;
  propertyTitle: string;
  checkInDate: string;
  checkOutDate: string;
  cancellationDate: string;
  refundAmount: number;
  currency: string;
  reason: string;
}
```

**Features:**
- Cancellation confirmation
- Refund information (if applicable)
- Rebooking call-to-action
- Support contact information

---

## 🔄 Automatic Email Triggers

### Implementation Pattern

```typescript
import { useEmail } from "@/hooks/useEmail";

const { sendBookingConfirmation } = useEmail();

// After booking is confirmed
await sendBookingConfirmation({
  to: guest.email,
  userName: guest.full_name,
  bookingId: booking.id,
  propertyTitle: property.title,
  checkInDate: booking.check_in,
  checkOutDate: booking.check_out,
  guests: booking.guests,
  totalAmount: booking.total_price,
  currency: 'USD',
});
```

### Trigger Points

| Event | Template | Trigger Condition |
|-------|----------|-------------------|
| Booking Created & Confirmed | booking-confirmation | `booking.status === 'confirmed'` |
| Payment Completed | payment-receipt | `booking.payment_status === 'succeeded'` |
| Booking Cancelled | booking-cancellation | `booking.status === 'cancelled'` |

### Graceful Degradation
If Resend is not configured:
- Email function returns `{ error: "Email service not configured", configured: false }`
- System logs: `"Email not sent — Resend API not configured"`
- Application continues normally (no errors thrown)
- No user-facing errors

---

## 🛠️ Edge Function API

### send-email
**Path:** `supabase/functions/send-email/index.ts`  
**Authentication:** Optional (JWT not required for system emails)  
**Method:** POST

**Request Body:**
```json
{
  "to": "guest@example.com",
  "template": "booking-confirmation",
  "data": {
    "userName": "John Doe",
    "bookingId": "abc-123",
    "propertyTitle": "Jungle Bungalow",
    "checkInDate": "2025-02-01",
    "checkOutDate": "2025-02-05",
    "guests": 2,
    "totalAmount": 450.00,
    "currency": "USD"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "emailId": "re_xxx_xxx",
  "template": "booking-confirmation",
  "to": "guest@example.com",
  "message": "Email sent successfully"
}
```

**Error Response (Not Configured):**
```json
{
  "error": "Email service not configured. Please configure Resend API key in Settings → Integrations.",
  "configured": false
}
```

**Error Response (Send Failed):**
```json
{
  "error": "Failed to send email: Invalid API key",
  "configured": true
}
```

---

## 🧪 Testing

### Test Email Feature
The admin panel includes a "Send Test Email" button:

1. Configure Resend API key
2. Click **Send Test Email** button
3. Test email is sent to your admin account email
4. Check inbox for test message
5. Verify sender name and email appear correctly

### Test Scenarios
- ✅ Send test email with valid configuration
- ✅ Attempt test email without configuration (should show error)
- ✅ Test with invalid API key (should fail gracefully)
- ✅ Test with unverified domain (Resend will reject)
- ✅ Test booking confirmation flow
- ✅ Test payment receipt flow
- ✅ Test cancellation notice flow

---

## 🎨 UI Components

### ResendConfigForm
Admin configuration form with:

```tsx
<ResendConfigForm />
```

**Features:**
- Real-time configuration status indicator
- Secure API key input (password field)
- Sender email validation
- Sender name customization
- Test email button
- Helper links to Resend Dashboard

**Status Indicators:**
- 🟢 Configured (green checkmark)
- 🔴 Not Configured (red X)

### useEmail Hook
React hook for sending emails:

```tsx
const { 
  sendEmail,
  sendBookingConfirmation,
  sendPaymentReceipt,
  sendBookingCancellation
} = useEmail();
```

**Features:**
- Type-safe email sending
- Automatic error handling
- Console logging for debugging
- Returns boolean success status

---

## 🚨 Troubleshooting

### Issue: "Email service not configured" error
**Solution:** Navigate to Settings → Integrations and configure Resend API key

### Issue: Test email not received
**Solutions:**
1. Check spam/junk folder
2. Verify domain is verified in Resend Dashboard
3. Check Resend logs for errors
4. Ensure sender email matches verified domain

### Issue: "Invalid API key" error
**Solutions:**
1. Verify API key is correct (starts with `re_`)
2. Check API key hasn't been revoked
3. Generate new API key in Resend Dashboard

### Issue: Domain verification pending
**Solution:** 
1. Check DNS records are correctly added
2. Use DNS checker tool to verify propagation
3. Wait up to 48 hours for verification
4. Contact Resend support if issues persist

### Issue: Emails sent to spam
**Solutions:**
1. Ensure SPF, DKIM, DMARC records are correct
2. Warm up new sending domain gradually
3. Include unsubscribe link in emails
4. Monitor spam reports in Resend Dashboard

---

## 📊 Monitoring & Logs

### Resend Dashboard
View email activity:
1. Go to [Resend Dashboard](https://resend.com/emails)
2. View sent emails, opens, clicks
3. Check delivery status
4. Review bounce and spam reports

### Edge Function Logs
View logs in Supabase Dashboard:
1. Navigate to **Functions** section
2. Select `send-email`
3. Click **Logs** tab
4. Filter by error level or search terms

### Email Tracking Query
```sql
-- Track email notifications (requires notifications table)
SELECT 
  n.sent_at,
  n.user_id,
  n.channel,
  n.status,
  n.subject,
  n.external_id,
  n.error_message
FROM notifications n
WHERE n.channel = 'email'
ORDER BY n.sent_at DESC
LIMIT 50;
```

---

## 🔐 Security Best Practices

1. **Never expose API keys** in client-side code
2. **Always use verified domains** for sending
3. **Monitor spam reports** regularly
4. **Include unsubscribe links** (future enhancement)
5. **Rate limit email sending** to prevent abuse
6. **Validate recipient emails** before sending
7. **Log email activity** for audit trail
8. **Test in staging** before production

---

## 🚀 Going Live

### Pre-Launch Checklist
- [ ] Resend account created and verified
- [ ] Domain fully verified with DNS records
- [ ] API key generated and configured
- [ ] Test email sent successfully
- [ ] All three templates tested
- [ ] Sender email matches verified domain
- [ ] Email logs monitoring set up
- [ ] Spam reports monitored

### Production Recommendations
- Use custom domain for sender email
- Set up email analytics tracking
- Configure webhook for delivery events (future)
- Create branded email footer
- Add social media links to templates
- Monitor delivery rates closely

---

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Email Best Practices](https://resend.com/docs/send-email)
- [React Email Components](https://react.email/docs/components)
- [Domain Verification Guide](https://resend.com/docs/domain-verification)
- [PingPe Backend Documentation](./backend.md)

---

## 🔄 Future Enhancements

### Planned Features
1. **Webhook Integration** — Real-time delivery status updates
2. **Email Templates Admin** — Visual template editor
3. **Unsubscribe Management** — User preference management
4. **Email Scheduling** — Delayed send and reminders
5. **Multi-language Support** — Localized email templates
6. **Email Analytics Dashboard** — Open rates, click tracking
7. **A/B Testing** — Template performance comparison
8. **Guest Communication Thread** — Booking-specific email history

---

**Status:** ✅ Phase 5B Complete — Manual Configuration Mode  
**Next Phase:** 5C - Content Population  
**Version:** PingPe v1.1 — January 2025
