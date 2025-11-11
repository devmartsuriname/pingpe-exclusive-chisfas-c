# Email System Documentation - PingPe Platform

**Version:** 1.3.0  
**Last Updated:** 2025-10-24

---

## 📧 Overview

The PingPe email system provides flexible, multi-provider email delivery with fallback support and admin testing capabilities. The system is architected to support multiple email providers (SMTP and API-based) with graceful degradation.

---

## 🏗️ Architecture

### Components

1. **EmailProvider Interface** (`src/lib/email/providers/EmailProvider.ts`)
   - Abstract base class for all email providers
   - Defines standard methods: `send()`, `test()`, `validate()`

2. **Provider Implementations**
   - **HostingerSMTP** - Traditional SMTP for reliable delivery
   - **Resend** - Modern API-based provider (planned)
   - **SendGrid** - Enterprise option (future)

3. **Provider Registry** (`src/lib/email/EmailProviderRegistry.ts`)
   - Auto-detects active provider from settings
   - Manages provider instances
   - Fallback logic when provider unavailable

4. **Edge Functions**
   - `send-email-v2` - Send emails via active provider
   - `test-email-v2` - Test provider configuration

5. **Admin UI**
   - Settings → Email tab
   - Provider configuration forms
   - Test email button
   - Status indicators

---

## 📊 Provider Comparison

| Feature | Hostinger SMTP | Resend | SendGrid |
|---------|---------------|---------|----------|
| **Type** | SMTP | API | API |
| **Setup Complexity** | Low | Low | Medium |
| **Monthly Free Tier** | Varies | 3,000 | 100/day |
| **Reliability** | High | Very High | Very High |
| **Tracking** | Basic | Advanced | Advanced |
| **Templates** | Manual | React Email | Handlebars |
| **Webhooks** | No | Yes | Yes |
| **Best For** | Simple, reliable | Modern apps | Enterprise |

---

## ⚙️ Configuration Guide

### Hostinger SMTP Setup

1. **Obtain Credentials**
   - Login to Hostinger Control Panel
   - Navigate to Email → Email Accounts
   - Create or select existing email (e.g., `info@jungleresortpingpe.com`)
   - Note SMTP settings:
     - **Host:** `smtp.hostinger.com`
     - **Port:** `465` (SSL) or `587` (TLS)
     - **Username:** Full email address
     - **Password:** Email account password

2. **Configure in PingPe**
   - Navigate to **Admin → Settings → Email**
   - Select "Hostinger SMTP" tab
   - Fill in the form:
     ```
     SMTP Host: smtp.hostinger.com
     SMTP Port: 465
     SMTP Secure: true
     SMTP Username: info@jungleresortpingpe.com
     SMTP Password: [your-password]
     From Email: info@jungleresortpingpe.com
     From Name: Jungle Resort PingPe
     ```
   - Click **Save Settings**

3. **Test Connection**
   - Click **Test Email** button
   - Enter recipient email
   - Check inbox for test message
   - Verify status shows "Active ✓"

### Resend Setup (Planned)

1. **Create Resend Account**
   - Visit https://resend.com
   - Sign up and verify domain
   - Generate API key

2. **Configure in PingPe**
   - Admin → Settings → Email → Resend tab
   - Enter API key
   - Set sender email (verified domain required)
   - Save and test

---

## 🔧 Environment Variables

Email settings are stored in the `settings` table (encrypted), not environment variables. This allows runtime configuration without redeployment.

### Database Schema

```sql
-- Email settings stored as JSONB
SELECT key, value FROM settings WHERE key LIKE 'email_%';

-- Example keys:
email_provider_active         -- 'hostinger_smtp' | 'resend'
email_hostinger_smtp_host     -- 'smtp.hostinger.com'
email_hostinger_smtp_port     -- '465'
email_hostinger_smtp_secure   -- true
email_hostinger_smtp_username -- 'info@jungleresortpingpe.com'
email_hostinger_smtp_password -- '[encrypted]'
email_hostinger_from_email    -- 'info@jungleresortpingpe.com'
email_hostinger_from_name     -- 'Jungle Resort PingPe'
```

---

## 🧪 Testing Procedures

### Manual Test via Admin UI

1. Navigate to **Admin → Settings → Email**
2. Ensure provider is configured
3. Click **Test Email** button
4. Enter your email address
5. Submit and check inbox
6. Verify subject: "Test Email from Jungle Resort PingPe"

### Edge Function Test (Development)

```bash
# Test send-email-v2 edge function
curl -X POST https://kolzaqqfwldrksyrlwxx.supabase.co/functions/v1/send-email-v2 \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "<p>Hello from PingPe!</p>",
    "isHtml": true
  }'
```

### Test Email Template Rendering

```typescript
// In browser console or component
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke('send-email-v2', {
  body: {
    to: 'your-email@example.com',
    subject: 'Booking Confirmation Test',
    body: `
      <h1>Booking Confirmed</h1>
      <p>Your booking #TEST-001 has been confirmed.</p>
      <p><strong>Total:</strong> €285.00</p>
    `,
    isHtml: true
  }
});
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "SMTP Connection Failed"

**Symptoms:**
- Test email fails immediately
- Error: "Connection timeout" or "Authentication failed"

**Solutions:**
- ✅ Verify SMTP host and port are correct
- ✅ Check username is full email address (not just username)
- ✅ Confirm password is correct (no extra spaces)
- ✅ Ensure firewall allows outbound connections on port 465/587
- ✅ Try alternate port (465 vs 587)
- ✅ Check Hostinger service status

#### 2. "Email Sent But Not Received"

**Symptoms:**
- Test succeeds but inbox empty
- No error messages

**Solutions:**
- ✅ Check spam/junk folder
- ✅ Verify recipient email is valid
- ✅ Check sender domain reputation (SPF/DKIM)
- ✅ Review Hostinger email logs
- ✅ Test with different recipient domain

#### 3. "Provider Not Configured"

**Symptoms:**
- Status shows "Not Configured ⚠️"
- Test button disabled

**Solutions:**
- ✅ Save settings before testing
- ✅ Refresh page after saving
- ✅ Check all required fields are filled
- ✅ Verify settings saved to database:
  ```sql
  SELECT * FROM settings WHERE key LIKE 'email_%';
  ```

#### 4. "Rate Limit Exceeded"

**Symptoms:**
- Error: "Too many requests"
- Temporary send failure

**Solutions:**
- ✅ Wait 5-10 minutes before retrying
- ✅ Check Hostinger email quotas
- ✅ Consider upgrading plan if sending high volume
- ✅ Implement email queueing for bulk sends

---

## 📚 Edge Functions Reference

### `send-email-v2`

**Purpose:** Send email via configured provider

**Authentication:** Required (JWT)

**Request:**
```typescript
{
  to: string;           // Recipient email
  subject: string;      // Email subject
  body: string;         // HTML or plain text
  isHtml?: boolean;     // Default: true
  replyTo?: string;     // Optional reply-to address
}
```

**Response:**
```typescript
{
  success: boolean;
  messageId?: string;
  error?: string;
}
```

**Example:**
```typescript
const { data, error } = await supabase.functions.invoke('send-email-v2', {
  body: {
    to: 'guest@example.com',
    subject: 'Welcome to PingPe',
    body: '<h1>Welcome!</h1><p>Your account is ready.</p>',
    isHtml: true
  }
});
```

---

### `test-email-v2`

**Purpose:** Test provider configuration

**Authentication:** Required (Admin role)

**Request:**
```typescript
{
  recipientEmail: string;  // Test recipient
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}
```

**Example:**
```typescript
const { data, error } = await supabase.functions.invoke('test-email-v2', {
  body: {
    recipientEmail: 'admin@example.com'
  }
});
```

---

## 🔒 Security Considerations

### Password Encryption

- Email passwords stored as encrypted JSONB in `settings` table
- RLS policies restrict access to admin role only
- Edge functions use service role key to decrypt

### Best Practices

1. **Use App Passwords** - For Gmail/Outlook, use app-specific passwords
2. **Rotate Credentials** - Change SMTP passwords quarterly
3. **Monitor Logs** - Review Edge Function logs for suspicious activity
4. **Limit Permissions** - Restrict admin access to email settings
5. **Test Regularly** - Weekly test emails to verify service health

---

## 📈 Monitoring & Logs

### View Edge Function Logs

1. Navigate to Supabase Dashboard
2. Functions → `send-email-v2` → Logs
3. Filter by time range and error level
4. Look for patterns:
   - High error rates
   - Unusual recipients
   - Slow response times

### Logging Best Practices

```typescript
// In edge functions, log key events:
console.log('[Email] Provider:', activeProvider);
console.log('[Email] Recipient:', to);
console.log('[Email] Subject:', subject);

// On success:
console.log('[Email] Sent successfully:', messageId);

// On error:
console.error('[Email] Send failed:', error.message);
```

---

## 🚀 Future Enhancements

### Planned Features

- [ ] **Email Templates** - Pre-designed HTML templates
- [ ] **Batch Sending** - Send to multiple recipients
- [ ] **Scheduling** - Delayed email delivery
- [ ] **Tracking** - Open rates, click tracking (Resend)
- [ ] **Webhooks** - Event notifications (bounces, complaints)
- [ ] **A/B Testing** - Test email variants
- [ ] **Email Queue** - Background processing for bulk sends
- [ ] **Resend Integration** - Full implementation

---

## 📞 Support

### Technical Issues

- **Email:** support@devmart.sr
- **Subject:** `[PingPe Email] - [Issue Description]`
- **Include:** Error messages, Edge Function logs, provider used

### PingPe Management

- **Contact:** info@jungleresortpingpe.com
- **Phone:** +597 8858525

---

## 📖 Related Documentation

- [Backend Architecture](./backend.md)
- [Admin Guide](./admin-guide.md)
- [Deployment Guide](./deployment.md)
- [Settings Management](./IMPLEMENTATION_STATUS.md)

---

**Last Updated:** 2025-10-24  
**Maintained by:** Devmart Suriname
