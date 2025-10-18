# PingPe Admin User Guide

**Version:** 1.1.0  
**Last Updated:** October 2025  
**For:** PingPe Resort Staff & Administrators

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [Inventory Management](#inventory-management)
5. [Bookings & Payments](#bookings--payments)
6. [Blog Management](#blog-management)
7. [Dynamic Pages](#dynamic-pages)
8. [Media Library](#media-library)
9. [Reports & Analytics](#reports--analytics)
10. [Settings & Configuration](#settings--configuration)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

Welcome to the PingPe Admin Dashboard! This comprehensive platform allows you to manage every aspect of Jungle Resort PingPe's online presence, from accommodation listings to blog posts, bookings, and payments.

### What You Can Do

- Manage properties, experiences, transport, and packages
- Handle bookings and process payments
- Create and publish blog content
- Build custom pages without coding
- Upload and organize media files
- View analytics and generate reports
- Configure platform settings

### User Roles

**Administrator**
- Full system access
- Manage all content and settings
- View all bookings and reports
- Configure integrations

**Host**
- Manage own properties and experiences
- Create blog posts
- View own bookings
- Limited settings access

**Guest** (Default)
- Browse and book listings
- View own bookings
- No admin access

---

## Getting Started

### Logging In

1. Navigate to `https://[your-domain]/admin`
2. Enter your email and password
3. Click "Sign In"
4. First-time users: Check email for confirmation link

**Default Admin Account:**
- Email: Set up during initial deployment
- Password: Provided by technical team

### Navigating the Dashboard

The admin interface has three main areas:

**Top Navigation Bar**
- Dashboard link (home)
- User profile menu
- Notifications
- Sign out button

**Sidebar Menu**
- Dashboard
- Inventory (Properties, Experiences, Transport, Packages)
- Bookings
- Blog
- Pages
- Media Library
- Analytics
- Settings

**Main Content Area**
- Dynamic content based on selected menu item
- Tables, forms, and data visualizations

---

## Dashboard Overview

The main dashboard provides an at-a-glance view of your resort's performance.

### Key Performance Indicators (KPIs)

**Total Bookings**
- Shows total number of bookings in the selected period
- Trend indicator (up/down from previous period)

**Revenue**
- Total revenue from confirmed bookings
- Includes all successful payments

**Active Listings**
- Count of published properties and experiences
- Excludes inactive/draft items

**Pending Approvals**
- Bookings awaiting confirmation
- Reviews pending moderation

### Quick Actions

- **Add New Property** - Create accommodation listing
- **Create Blog Post** - Publish news or articles
- **View Bookings** - See today's check-ins/check-outs
- **Upload Media** - Add photos to library

### Recent Activity

- Last 10 booking updates
- Recent content changes
- System notifications

---

## Inventory Management

### Properties (Stays/Accommodations)

#### Adding a New Property

1. Go to **Admin → Inventory → Properties**
2. Click **"Add New Property"**
3. Fill in required fields:

**Basic Information:**
- **Title** - Descriptive name (e.g., "Riverside Eco-Lodge")
- **Description** - Detailed overview (2-3 paragraphs)
- **Property Type** - Select from dropdown (Lodge, Cabin, House, Villa, etc.)

**Capacity:**
- **Max Guests** - Total occupancy
- **Bedrooms** - Number of separate sleeping rooms
- **Beds** - Total bed count
- **Bathrooms** - Number of bathrooms

**Pricing:**
- **Price Per Night** - Base rate in USD
- Enable **Dynamic Pricing** (optional)

**Location:**
- **Address** - Full physical address
- **City** - PingPe
- **Country** - Suriname
- **Coordinates** - Latitude/Longitude (for map display)

**Images:**
- Click **"Select Images"** from Media Library
- Choose 5-10 high-quality photos
- Set one as **Featured Image**
- Add alt text for accessibility

**Amenities:**
- Select all applicable amenities
- Categories: Essentials, Facilities, Activities

**SEO Settings:**
- **Meta Title** - 50-60 characters
- **Meta Description** - 150-160 characters
- **URL Slug** - Auto-generated (editable)

4. Click **"Preview"** to see how it looks
5. Click **"Publish"** to make live

#### Editing Properties

1. Navigate to property list
2. Click **"Edit"** icon next to property name
3. Make changes
4. **Save Draft** or **Publish**

#### Managing Availability

1. Open property details
2. Go to **"Availability"** tab
3. Use calendar to:
   - Block dates (maintenance, personal use)
   - Set seasonal pricing
   - Override base rates for specific dates

**Blocking Dates:**
- Click date range on calendar
- Select "Block"
- Add reason (optional)
- Save

**Price Overrides:**
- Select date range
- Enter custom price
- Click "Apply"

---

### Experiences (Tours & Activities)

#### Creating an Experience

1. Go to **Admin → Inventory → Experiences**
2. Click **"Add New Experience"**
3. Complete form:

**Basic Details:**
- **Title** - Experience name
- **Description** - Full itinerary and details
- **Duration** - Hours or days
- **Difficulty** - Easy, Moderate, Challenging
- **Age Restriction** - Minimum age if applicable

**Capacity:**
- **Min Participants** - Minimum to run
- **Max Participants** - Maximum allowed

**Pricing:**
- **Price Per Person** - Individual rate
- Group discounts (optional)

**Meeting Point:**
- Exact location where tour starts
- GPS coordinates

**Includes:**
- Guide services
- Meals
- Equipment
- Transportation

**What to Bring:**
- Suggest items guests should pack
- Safety equipment
- Personal items

**Languages:**
- Select all languages guides can speak

**Images:**
- Action shots preferred
- Show activities, destinations, guides

4. Add availability schedule
5. Publish when ready

---

### Transport Options

#### Adding Transport Service

1. Go to **Admin → Inventory → Transport**
2. Click **"Add Transport"**
3. Enter details:

**Route:**
- **From** - Starting point
- **To** - Destination
- **Vehicle Type** - Boat, Bus, Car, etc.

**Capacity & Pricing:**
- **Max Passengers**
- **Price Per Person** OR **Price Per Group**
- **Luggage Allowance**

**Schedule:**
- Departure times
- Duration
- Frequency (daily, weekly, etc.)

**Amenities:**
- Life jackets
- Covered seating
- Onboard facilities

---

### Packages (Bundled Deals)

#### Creating a Package

1. Go to **Admin → Inventory → Packages**
2. Click **"Create Package"**
3. Configure:

**Package Details:**
- **Title** - Package name
- **Description** - What's included
- **Duration** - Total days/nights
- **Max Participants**

**Bundle Components:**
Click "Add Item" to include:
- **Properties** - Select accommodation
- **Experiences** - Choose tours
- **Transport** - Add transfers

**Pricing:**
- System calculates total from components
- **Discount %** - Apply package savings
- **Final Price** - Auto-calculated

**Inclusions Summary:**
List all items included in bullet points

4. Upload package images
5. Set availability
6. Publish

---

## Bookings & Payments

### Viewing Bookings

**Admin → Bookings** shows all reservations

**Filters:**
- Date range
- Status (Pending, Confirmed, Completed, Cancelled)
- Property/Experience
- Guest name/email

**Booking Details View:**
- Guest information
- Booking dates
- Total price
- Payment status
- Special requests

### Managing Bookings

#### Confirming a Booking

1. Open booking details
2. Review guest information
3. Click **"Confirm Booking"**
4. Confirmation email sent automatically

#### Cancelling a Booking

1. Open booking
2. Click **"Cancel"**
3. Select cancellation reason
4. Process refund (if applicable)
5. System sends cancellation email

#### Modifying Bookings

1. Open booking
2. Click **"Edit Dates"** or **"Change Details"**
3. Adjust as needed
4. Recalculate pricing if dates changed
5. Save changes
6. Notification sent to guest

### Payment Management

**Payment Status Types:**
- **Pending** - Awaiting payment
- **Paid** - Payment received
- **Failed** - Payment unsuccessful
- **Refunded** - Money returned

#### Processing Payments (After Stripe Configuration)

**Viewing Payment Details:**
1. Open booking
2. Go to "Payment" tab
3. View:
   - Payment method
   - Transaction ID
   - Amount charged
   - Processing fees
   - Net amount

**Manual Payment Recording:**
(For cash or bank transfer payments)
1. Open booking
2. Click "Record Payment"
3. Enter:
   - Amount
   - Payment method
   - Transaction reference
4. Save

**Issuing Refunds:**
1. Navigate to booking
2. Click "Issue Refund"
3. Enter refund amount
4. Select reason
5. Confirm
6. Stripe processes automatically

---

## Blog Management

### Creating Blog Posts

1. Go to **Admin → Blog → Posts**
2. Click **"New Post"**
3. Fill in:

**Content:**
- **Title** - Catchy, descriptive headline
- **Slug** - URL-friendly version (auto-generated)
- **Excerpt** - Brief summary (2-3 sentences)
- **Body** - Full article content

**Rich Text Editor Tools:**
- Headings (H2, H3, H4)
- Bold, Italic, Underline
- Bulleted/Numbered lists
- Links
- Block quotes
- Images
- Code blocks

**Metadata:**
- **Category** - Travel Tips, Culture, Tours, etc.
- **Tags** - Keywords for filtering
- **Featured Image** - Article cover photo
- **Author** - Auto-set to your name

**SEO:**
- **Meta Title** - 50-60 chars
- **Meta Description** - 150-160 chars
- Preview how it appears in search results

**Publishing:**
- **Save Draft** - Keep private
- **Preview** - See how it looks
- **Publish** - Make live
- **Schedule** - Set future publish date

### Managing Categories & Tags

**Categories:**
1. Go to **Blog → Categories**
2. Click "Add Category"
3. Enter name and slug
4. Add description
5. Save

**Tags:**
1. Go to **Blog → Tags**
2. Create new tags as needed
3. Apply to posts during editing

### Blog Best Practices

- **Post Regularly** - Aim for 2-4 posts per month
- **Use Images** - Include 2-3 images per article
- **Optimize SEO** - Use keywords naturally
- **Internal Links** - Link to relevant listings
- **Call to Action** - Encourage bookings at end

---

## Dynamic Pages

The Page Builder allows creating custom pages without coding.

### Creating a New Page

1. Go to **Admin → Pages**
2. Click **"Create Page"**
3. Enter page details:
   - **Title** - Page name
   - **Slug** - URL path
   - **Status** - Draft or Published

4. Click **"Edit Content"** to open Page Builder

### Using the Page Builder

**Adding Sections:**
1. Click **"+ Add Section"**
2. Choose section type:
   - Hero Section
   - Text Content
   - Image Gallery
   - Features Grid
   - Contact Form
   - Testimonials
   - Call to Action

3. Configure section:
   - Edit text and headings
   - Upload images
   - Adjust layout
   - Set background colors

**Reordering Sections:**
- Drag and drop sections to reorder
- Use up/down arrows
- Changes save automatically

**Section Settings:**
- **Visibility** - Show/hide section
- **Background** - Color, image, gradient
- **Spacing** - Padding and margins
- **Animation** - Fade in, slide, etc.

### Publishing Pages

1. Preview page before publishing
2. Check mobile responsiveness
3. Verify all links work
4. Click **"Publish"**
5. Page goes live immediately

### Example Custom Pages

- About Us
- Contact Information
- FAQ
- Booking Policies
- Sustainability Initiatives
- Team Bios

---

## Media Library

Centralized storage for all images and media files.

### Uploading Files

1. Go to **Admin → Media Library**
2. Click **"Upload Files"** or drag & drop
3. Select images from computer
4. Wait for upload to complete

**Supported Formats:**
- Images: JPG, PNG, WebP
- Max size: 10MB per file
- Recommended resolution: 1920x1080px or higher

### Organizing Media

**Folders:**
- Root
- Stays
- Experiences
- Transport
- Packages
- Blog
- General

**To Move Files:**
1. Select file(s)
2. Click "Move to Folder"
3. Choose destination
4. Confirm

### Editing Media Details

1. Click on image thumbnail
2. Edit:
   - **Title** - Descriptive name
   - **Alt Text** - For accessibility (describe image)
   - **Tags** - Keywords for searching
   - **Folder** - Category

3. Save changes

### Using Images in Content

When adding images to properties, blog posts, or pages:
1. Click "Select from Library"
2. Browse or search
3. Select image(s)
4. Click "Insert"

**Image Optimization:**
- System automatically creates WebP versions
- Generates multiple sizes for responsive loading
- Compresses without quality loss

---

## Reports & Analytics

### Dashboard Analytics

**Overview Metrics:**
- Total bookings (monthly, yearly)
- Revenue trends
- Occupancy rates
- Popular listings
- Traffic sources

**Charts & Graphs:**
- Booking trends over time
- Revenue by property
- Guest demographics
- Peak seasons

### Generating Reports

1. Go to **Admin → Analytics → Reports**
2. Select report type:
   - Bookings Summary
   - Revenue Report
   - Property Performance
   - Guest Analytics

3. Set date range
4. Apply filters (property, type, etc.)
5. Click **"Generate Report"**
6. View on screen or **Export to CSV**

### Interpreting Data

**Booking Conversion Rate:**
```
(Confirmed Bookings / Total Inquiries) × 100
```

**Average Booking Value:**
```
Total Revenue / Number of Bookings
```

**Occupancy Rate:**
```
(Booked Nights / Available Nights) × 100
```

### Exporting Data

- Click **"Export"** button on any report
- Choose format: CSV or PDF
- File downloads automatically
- Open in Excel or Google Sheets

---

## Settings & Configuration

### General Settings

**Admin → Settings → General**

**Platform Information:**
- Platform Name
- Contact Phone: +597 8858525
- Contact Email: info@jungleresortpingpe.com
- Address: Vidijaweg 25, Wanica, Boven-Suriname

**Operating Hours:**
- Daily: 08:00 - 20:00

**Logo & Branding:**
1. Upload platform logo (PNG, transparent background)
2. Upload favicon (32x32px)
3. Select brand colors (optional)

**Regional Settings:**
- Default Currency: USD
- Date Format: MM/DD/YYYY
- Time Zone: America/Paramaribo

### Payment Configuration (Stripe)

**Admin → Settings → Payments**

⚠️ **Note:** Requires Stripe account. Contact technical support to enable.

**Setup Steps:**
1. Create Stripe account at stripe.com
2. Obtain API keys (Publishable & Secret)
3. Enter keys in Settings
4. Select currency (USD recommended)
5. Toggle Test Mode (for development)
6. Save configuration

**Test Mode:**
- Use test card numbers
- No real charges processed
- Safe for training

**Live Mode:**
- Real payments processed
- Requires business verification
- Enable only when ready for production

### Email Configuration (Resend)

**Admin → Settings → Integrations**

**Email Settings:**
1. Enter Resend API Key
2. Set sender email (noreply@jungleresortpingpe.com)
3. Set sender name (Jungle Resort PingPe)
4. Test email delivery

**Email Templates:**
- Booking Confirmation
- Payment Receipt
- Cancellation Notice
- Password Reset

**Testing:**
- Click "Send Test Email"
- Check inbox for delivery
- Verify formatting and links

### User Management

**Admin → Settings → Users**

**Adding New Admin Users:**
1. Click "Invite User"
2. Enter email address
3. Select role (Admin, Host)
4. Send invitation
5. User receives email with setup link

**Managing Roles:**
- View all users
- Change user roles
- Deactivate accounts
- Reset passwords

**Role Permissions:**

| Permission | Admin | Host | Guest |
|------------|-------|------|-------|
| Manage Properties | ✅ | ✅ | ❌ |
| View All Bookings | ✅ | Own Only | Own Only |
| Edit Settings | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Create Blog Posts | ✅ | ✅ | ❌ |
| Process Payments | ✅ | ❌ | ❌ |

---

## Troubleshooting

### Common Issues

#### Can't Log In

**Problem:** "Invalid credentials" error

**Solutions:**
1. Verify email spelling
2. Check caps lock is off
3. Click "Forgot Password" to reset
4. Clear browser cache and cookies
5. Try different browser
6. Contact technical support

#### Images Not Uploading

**Problem:** Upload fails or hangs

**Solutions:**
1. Check file size (max 10MB)
2. Verify file format (JPG, PNG only)
3. Check internet connection
4. Try smaller image
5. Use image compression tool first

#### Booking Not Showing

**Problem:** New booking doesn't appear in list

**Solutions:**
1. Refresh page (F5)
2. Check filters (date range, status)
3. Search by guest name
4. Clear search/filter
5. Log out and back in

#### Email Notifications Not Sending

**Problem:** Guests not receiving confirmation emails

**Solutions:**
1. Verify Resend API key is configured
2. Check Settings → Integrations
3. Send test email
4. Ask guest to check spam folder
5. Confirm sender email is verified

#### Payment Processing Fails

**Problem:** "Payment declined" or error message

**Solutions:**
1. Verify Stripe is configured correctly
2. Check test/live mode matches intent
3. Try different payment method
4. Contact guest about card issues
5. Check Stripe dashboard for details

### Getting Help

**Technical Support:**
- **Email:** support@devmart.sr
- **Phone:** +597 [support number]
- **Hours:** Mon-Fri 9:00-17:00

**Documentation:**
- Backend Guide: `docs/backend.md`
- Deployment Guide: `docs/deployment.md`
- API Reference: `docs/api-reference.md`

**Emergency Contact:**
For urgent issues affecting bookings or payments, contact:
- Technical Lead: [name]
- PingPe Management: info@jungleresortpingpe.com

---

## Best Practices

### Content Guidelines

1. **Use High-Quality Images**
   - Minimum 1920x1080px
   - Well-lit, clear subjects
   - Showcase unique features
   - Optimize before uploading

2. **Write Compelling Descriptions**
   - Be specific and accurate
   - Highlight unique selling points
   - Use descriptive language
   - Keep paragraphs short (2-4 sentences)

3. **Optimize for SEO**
   - Use relevant keywords naturally
   - Fill all meta fields
   - Write unique descriptions (no duplicates)
   - Add alt text to all images

4. **Keep Information Current**
   - Update pricing seasonally
   - Remove outdated blog posts
   - Archive past events
   - Refresh property photos annually

### Security Best Practices

1. **Password Management**
   - Use strong, unique passwords
   - Change password every 90 days
   - Never share login credentials
   - Enable two-factor authentication (if available)

2. **Data Privacy**
   - Don't share guest information
   - Export reports securely
   - Log out when leaving computer
   - Don't access from public WiFi

3. **Regular Backups**
   - System backs up automatically
   - Export important data monthly
   - Keep offline copies of critical info

---

## Appendix

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save | Ctrl/Cmd + S |
| Preview | Ctrl/Cmd + P |
| Bold Text | Ctrl/Cmd + B |
| Italic | Ctrl/Cmd + I |
| Insert Link | Ctrl/Cmd + K |
| Search | Ctrl/Cmd + F |

### Glossary

**Booking Status**
- **Pending** - Awaiting confirmation
- **Confirmed** - Approved, awaiting check-in
- **Completed** - Guest has checked out
- **Cancelled** - Booking voided

**Inventory**
- Properties, experiences, transport, packages collectively

**RLS**
- Row-Level Security (database access control)

**Slug**
- URL-friendly version of a title (e.g., "about-us")

**SEO**
- Search Engine Optimization (improving Google rankings)

**Meta Description**
- Summary text shown in search results

---

## Training Resources

### Video Tutorials
(To be added upon request)

### Live Training Sessions
Contact management to schedule group training for new staff.

### Quick Reference Guides
- Property Setup Checklist
- Blog Post Template
- Booking Workflow Diagram

---

**Version History:**
- v1.1.0 (Oct 2025) - Complete admin guide with all modules
- v1.0.0 (Initial) - Basic documentation

**Maintained by:** Devmart Suriname  
**For Support:** support@devmart.sr  
**PingPe Contact:** info@jungleresortpingpe.com
