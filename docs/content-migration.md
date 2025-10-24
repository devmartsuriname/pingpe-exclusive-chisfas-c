# Content Migration Guide

## PingPe Official Tour Import (Phase 3)

### Overview
Phase 3 successfully replaced demo content with authentic PingPe tour data sourced from official documents. This migration involved database schema updates, content extraction and translation from Dutch to English, and comprehensive frontend integration.

### Source Documents
The following official documents were used as authoritative sources:

1. **3 Daagse tours info.DOCX** - 3-day Jungle Adventure tour
2. **4 daagse tour info.DOCX** - 4-day Jungle Experience tour
3. **4 daagse tour back-to-basic info.DOCX** - 4-day Back-to-Basic Expedition
4. **5 daagse tour info.DOCX** - 5-day Jungle Explorer tour
5. **5 daagse tour back-to basic.DOCX** - 5-day Back-to-Basic Expedition
6. **6 Daagse Tours Back-to Basic info.DOCX** - 6-day Ultimate Back-to-Basic
7. **Brownberg & Ston Island combinatie tour info.DOCX** - 2-day Combination tour
8. **Tarieven Info.DOCX** - Pricing information
9. **Accommodatie.DOCX** - Resort facilities documentation
10. **Dorp Ping Pe info.DOCX** - Village profile information

### Database Changes

#### New Fields Added to `experiences` Table
```sql
ALTER TABLE experiences 
ADD COLUMN duration_days INTEGER,
ADD COLUMN day_program JSONB DEFAULT '[]'::jsonb,
ADD COLUMN tour_type TEXT CHECK (tour_type IN ('standard', 'back-to-basic', 'combination')),
ADD COLUMN keywords TEXT[] DEFAULT '{}'::text[],
ADD COLUMN is_demo BOOLEAN DEFAULT false,
ADD COLUMN transport_options JSONB DEFAULT '[]'::jsonb;
```

#### Field Descriptions
- **duration_days**: Total tour duration in days (supplements existing `duration_hours`)
- **day_program**: JSONB array containing detailed daily itineraries
- **tour_type**: Categorizes tours as 'standard', 'back-to-basic', or 'combination'
- **keywords**: Array of SEO keywords for search optimization
- **is_demo**: Boolean flag to hide demo content from public view
- **transport_options**: JSONB array of available transport methods (bus-korjaal, flight options)

#### Day Program Structure
```json
{
  "day": 1,
  "title": "Paramaribo – Jungle Resort Pingpe",
  "description": "Morning pickup from Paramaribo...",
  "activities": ["Bus journey", "Korjaal boat ride", "Village walk", "Night safari"],
  "meals": ["Lunch", "Dinner"],
  "accommodation": "Jungle Resort Pingpe Lodge"
}
```

### Imported Tours

| Tour Name | Type | Days | Price (€) | Key Features |
|-----------|------|------|-----------|--------------|
| Jungle Adventure – Authentic Cultural Encounter | Standard | 3 | 285 | Cultural immersion, Tapawatra waterfall, village visit |
| Jungle Experience – Nature & Cultural Immersion | Standard | 4 | 360 | Extended itinerary, school visit, Granman village |
| Back-to-Basic Expedition – Wilderness Camp Trek | Back-to-Basic | 4 | 380 | 2-day primitive camping, creek fishing, hammock nights |
| Jungle Explorer – Extended Ananasberg Adventure | Standard | 5 | 385 | Ananasberg climb, cultural performances, extended exploration |
| Back-to-Basic Expedition – Deep Forest Experience | Back-to-Basic | 5 | 410 | Extended camping, deep jungle immersion |
| Ultimate Back-to-Basic – 3-Day Jungle Camp | Back-to-Basic | 6 | 430 | 3-day primitive camping, ultimate wilderness experience |
| Brownsberg & Ston Island Combo Tour | Combination | 2 | 145 | Nature park, waterfalls, Brokopondo Lake |

### Media Assets

#### Image Sources
Images were extracted from parsed `.DOCX` documents located in the `parsed-documents://` namespace. Each tour document contained embedded images showing:
- Jungle landscapes and rivers
- Cultural activities and village life
- Resort facilities
- Wildlife and nature photography
- Activities (trekking, swimming, korjaal rides)

#### Storage Strategy
Images are ready for:
1. **Optimization**: Convert to WebP/AVIF formats
2. **Organization**: Structure in `/public/tours/[tour-slug]/` folders
3. **Upload**: Transfer to `inventory_images` Supabase storage bucket
4. **Linking**: Update tour records with storage URLs

### Content Translation

All tour content was translated from Dutch to English:

**Dutch → English Examples:**
- "onaangetaste jungle" → "pristine jungle"
- "Saramaccaanse cultuur" → "Saramaccan culture"
- "korjaal" → "korjaal" (traditional canoe - kept authentic term)
- "stroomversnelling" → "rapids/waterfall"
- "Back-to-Basic" → "Back-to-Basic" (brand name preserved)

### Transport Options

Three transport methods documented from Tarieven Info.DOCX:

1. **Bus-Korjaal-Bus**: Default round-trip by road and boat (included in base price)
2. **Bus-Korjaal / Flight**: One-way by flight from/to Djumu airfield (45-minute flight)
3. **Flight (Return)**: Round-trip by flight via Zorg en Hoop airport (15-minute korjaal from Djumu to resort)

### Import Process

#### Admin Import Tool
Location: `/admin/content` → Content Management page

**Features:**
- One-click import of all 7 official tours
- Preview of tours before import
- Success/error reporting
- Demo content clearing function

**Import Script:**
```typescript
// Location: src/admin/utils/importPingPeTours.ts
export async function importPingPeTours(userId: string): Promise<ImportResult>
```

#### Usage Steps
1. Navigate to Admin → Content Management
2. Click "Import Official Tours" in Tour Importer card
3. Confirm import (replaces demo content)
4. Review success message and counts
5. Verify tours appear on `/experiences` page

### Frontend Integration

#### New Components Created
1. **DayByDayAccordion** (`src/components/experiences/DayByDayAccordion.tsx`)
   - Renders daily itineraries in expandable accordion format
   - Shows activities, meals, and accommodation per day

2. **TourImporter** (`src/admin/components/content/TourImporter.tsx`)
   - Admin UI for bulk tour import
   - Displays import results and error handling

#### Enhanced Pages
1. **Experience Detail Page** (`/experiences/:id`)
   - Added day-by-day itinerary section
   - Transport options display
   - Tour type badges (Standard/Back-to-Basic/Combination)
   - Duration shown in days for multi-day tours
   - Pricing disclaimer notice

2. **Experiences Listing** (`/experiences`)
   - Tour type filter (Standard/Back-to-Basic/Combination)
   - Duration filter (2-6 days)
   - Hides demo content (`is_demo = true`)
   - Enhanced badges showing tour duration and type

3. **New Static Pages**
   - `/accommodation` - Resort facilities and lodges
   - `/village` - PingPe village cultural information
   - `/projects` - Placeholder for community projects

#### Navigation Updates
Updated main navigation in Header component:
- "Experiences" → "Tours"
- Added "Accommodation"
- Added "Village"
- Added "About"

### SEO Implementation

#### Tour-Specific Keywords
Each tour includes targeted keywords:
```typescript
keywords: [
  "jungle tour suriname",
  "eco-tourism",
  "saramaccan culture",
  "tapawatra waterfall",
  "boven-suriname river",
  "back-to-basic adventure"
]
```

#### Meta Tags
- **Title**: `[Tour Name] | Jungle Resort PingPe - Suriname Eco Tours`
- **Description**: Tour-specific 150-160 character descriptions
- **Schema**: Product schema with pricing and ratings

### Pricing Information

#### Base Prices (EUR)
From Tarieven Info.DOCX:
- 3 Days: €285
- 4 Days Standard: €360
- 4 Days Back-to-Basic: €380
- 5 Days Standard: €385
- 5 Days Back-to-Basic: €410
- 6 Days Back-to-Basic: €430
- 2 Days Combo: €145

#### Inclusions (Standard)
- Professional Dutch and English-speaking guide
- All activities as per daily program
- Three meals per day (breakfast, lunch, dinner)
- Snacks, fruit, water, coffee, tea
- Transport to/from Pingpe (bus-korjaal-bus)
- Accommodation at Jungle Resort PingPe

**Exclusions:**
- Alcoholic beverages (available at resort bar)
- Airport transfers for flight options
- Personal insurance

#### Pricing Disclaimer
> "Prices are based on current economic conditions and may be adjusted if unexpected changes occur."

### Rollback Procedures

#### Database Rollback
```sql
-- Revert to demo content
UPDATE experiences 
SET is_demo = false 
WHERE title LIKE '%(Demo)%';

UPDATE experiences 
SET is_demo = true 
WHERE tour_type IS NOT NULL;
```

#### Git Restore Point
```bash
git tag restore/2025-10-24_phase-3-content-seed
git push origin restore/2025-10-24_phase-3-content-seed
```

### Verification Checklist

- [x] All 7 tours imported successfully
- [x] Day-by-day itineraries render correctly
- [x] Pricing matches source document (€285-€430)
- [x] Transport options displayed
- [x] Tour type and duration filters work
- [x] Demo content hidden from public view
- [x] New pages (Accommodation, Village, Projects) accessible
- [x] Navigation updated with new links
- [x] SEO meta tags optimized
- [x] Mobile responsiveness verified

### Known Issues & Future Enhancements

#### Pending
- [ ] Import tour images from parsed documents to storage
- [ ] Generate AI images for tours lacking sufficient photography
- [ ] Add multi-language support (Dutch, English, Spanish)
- [ ] Implement real-time availability calendar
- [ ] Add video content for tours (drone footage)
- [ ] Complete Projects page with community initiatives content

#### Technical Debt
- Consider splitting large tour import file into smaller modules
- Add unit tests for import functionality
- Implement automated image optimization pipeline

### Support & Resources

**Admin Access:**
- Dashboard: `/admin/dashboard`
- Content Management: `/admin/content`
- Media Library: `/admin/media`

**Documentation:**
- Backend Architecture: `/docs/backend.md`
- Architecture Overview: `/docs/architecture.md`
- Change Log: `/docs/changelog.md`

**Image Sources:**
- Official PingPe websites: futureproofpingpe.com, jungleresortpingpe.com
- Parsed document images: `parsed-documents://` namespace

### Maintenance

#### Weekly Tasks
- Monitor tour booking rates
- Review user feedback on tour descriptions
- Check for broken image links

#### Monthly Tasks
- Update pricing if economic conditions change
- Add seasonal tour variations
- Refresh tour photography

#### Quarterly Tasks
- Review and update SEO keywords based on analytics
- Add new tours or modify itineraries
- Update village and accommodation content

---

**Migration Completed:** October 24, 2025  
**Version:** 1.3.0  
**Status:** ✅ COMPLETE
