# PingPe Deployment Guide

**Version:** 1.1.0  
**Last Updated:** October 2025

## Quick Deploy Checklist

- [ ] Build production bundle
- [ ] Configure environment variables
- [ ] Deploy to hosting platform
- [ ] Run database migrations
- [ ] Configure Stripe (optional)
- [ ] Configure Resend (optional)
- [ ] Test production site
- [ ] Monitor logs

## Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

## Environment Variables

Required variables:
```env
VITE_SUPABASE_URL=https://kolzaqqfwldrksyrlwxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment Platforms

**Recommended: Netlify/Vercel**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

**Alternative: Traditional VPS**
1. Upload `/dist` folder to web server
2. Configure Nginx/Apache
3. Point domain to server
4. Enable HTTPS (Let's Encrypt)

## Post-Deployment

1. Verify all pages load
2. Test booking flow
3. Check admin dashboard
4. Configure Stripe if ready
5. Configure Resend if ready
6. Seed demo content or upload real content

## Support

Technical issues: support@devmart.sr  
PingPe contact: info@jungleresortpingpe.com
