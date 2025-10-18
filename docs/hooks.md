# Hooks Documentation

## useUnifiedSearch

Unified search hook for querying across multiple inventory types (properties and experiences).

### Location

`src/hooks/useUnifiedSearch.ts`

### Usage

```typescript
import { useUnifiedSearch } from "@/hooks/useUnifiedSearch";

const { data: results, isLoading } = useUnifiedSearch({
  type: "all",
  guests: 4,
  startDate: new Date("2024-10-21"),
  endDate: new Date("2024-10-25"),
});
```

### Parameters

```typescript
interface UnifiedSearchParams {
  location?: string;           // Optional - PingPe has single location
  startDate?: Date | null;     // Filter by availability start date
  endDate?: Date | null;       // Filter by availability end date
  guests?: number;             // Filter by capacity/max participants
  type?: "stays" | "experiences" | "transport" | "packages" | "all"; // Filter by type
}
```

### Return Type

```typescript
interface SearchResult {
  id: string;
  type: "stay" | "experience" | "transport" | "package";
  title: string;
  location: string;
  price: number;
  priceUnit: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
}
```

### Behavior

- Queries multiple Supabase tables based on `type` parameter
- Currently supports: `properties` (stays) and `experiences`
- Future: Will include `transport` and `packages` for comprehensive search
- Filters by `guests` (maps to `capacity` or `max_participants` depending on type)
- Returns unified result format across all types
- Uses React Query for caching and optimization
- Query is enabled only when search parameters are provided

### Implementation Notes

- Each inventory type is queried from separate Supabase tables
- Results are mapped to a common `SearchResult` interface for consistent UI rendering
- The hook automatically handles loading states and errors via React Query
- Cached results improve performance for repeated searches

---

## usePackages

Fetches package listings with optional filtering and sorting.

### Location

`src/hooks/usePackages.ts`

### Usage

```typescript
import { usePackages } from "@/hooks/usePackages";

const { data: packages, isLoading } = usePackages({
  minPrice: 500,
  maxPrice: 2000,
  durationDays: 3,
  maxParticipants: 4,
  sortBy: "price_asc"
});
```

### Parameters

```typescript
interface PackageFilters {
  minPrice?: number;         // Minimum package price
  maxPrice?: number;         // Maximum package price
  durationDays?: number;     // Filter by duration in days
  maxParticipants?: number;  // Minimum capacity required
  sortBy?: string;           // Sort order: "price_asc" | "price_desc" | "popular"
}
```

### Sorting Options

- `price_asc`: Price low to high
- `price_desc`: Price high to low
- Default: Most recent (by `created_at`)

---

## useTransport

Fetches transport listings with optional filtering and sorting.

### Location

`src/hooks/useTransport.ts`

### Usage

```typescript
import { useTransport } from "@/hooks/useTransport";

const { data: transport, isLoading } = useTransport({
  minPrice: 50,
  maxPrice: 200,
  vehicleType: "boat",
  capacity: 4,
  sortBy: "price_asc"
});
```

### Parameters

```typescript
interface TransportFilters {
  minPrice?: number;        // Minimum price per person
  maxPrice?: number;        // Maximum price per person
  vehicleType?: string;     // Filter by vehicle type (boat, 4x4, etc.)
  capacity?: number;        // Minimum capacity required
  routeFrom?: string;       // Filter by departure location
  routeTo?: string;         // Filter by destination
  sortBy?: string;          // Sort order
}
```

### Sorting Options

- `price_asc`: Price low to high
- `price_desc`: Price high to low
- Default: Most recent (by `created_at`)

---

## usePackageDetail

Fetches detailed information for a single package including provider profile.

### Location

`src/hooks/usePackages.ts`

### Usage

```typescript
import { usePackageDetail } from "@/hooks/usePackages";

const { data: package, isLoading } = usePackageDetail(packageId);
```

### Returns

Package object with extended profile information:
- All package fields from database
- `profiles`: Provider information (full_name, avatar_url, bio, etc.)

---

## useTransportDetail

Fetches detailed information for a single transport option including provider profile.

### Location

`src/hooks/useTransport.ts`

### Usage

```typescript
import { useTransportDetail } from "@/hooks/useTransport";

const { data: transport, isLoading } = useTransportDetail(transportId);
```

### Returns

Transport object with extended profile information:
- All transport fields from database
- `profiles`: Provider information (full_name, avatar_url, bio, etc.)

---

**Last Updated:** October 18, 2025  
**Version:** 1.0.0
