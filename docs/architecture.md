# Frontend Architecture

## Overview
This is a React-based single-page application (SPA) built with modern web technologies for a multi-inventory booking platform.

---

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Component library
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form validation
- **Supabase JS** - Backend client
- **Recharts** - Data visualization
- **date-fns** - Date utilities
- **Sonner** - Toast notifications

---

## Project Structure

```
src/
├── admin/                    # Admin portal
│   ├── components/          # Admin-specific components
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── reports/        # Report visualizations
│   │   └── settings/       # Settings forms
│   ├── hooks/              # Admin data hooks
│   │   ├── useAdminStats.ts
│   │   ├── useFinancialReports.ts
│   │   └── useSettings.ts
│   ├── pages/              # Admin pages
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Properties.tsx
│   │   ├── Bookings.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   └── utils/              # Admin utilities
│       └── exportCSV.ts
├── components/              # Shared components
│   └── ui/                 # Shadcn UI components
├── contexts/               # React contexts
│   └── AuthContext.tsx    # Authentication state
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   └── useToast.ts
├── integrations/           # Third-party integrations
│   └── supabase/
│       ├── client.ts      # Supabase client
│       └── types.ts       # Generated DB types
├── lib/                    # Utility functions
│   └── utils.ts           # Tailwind merge helper
├── pages/                  # Public pages
│   ├── Index.tsx          # Landing page
│   ├── Properties.tsx     # Property listings
│   ├── Experiences.tsx    # Experience listings
│   └── PropertyDetail.tsx # Detail pages
└── App.tsx                 # Root component & routing
```

---

## Component Patterns

### Atomic Design Principles
Components are organized by complexity:
1. **UI Components** (`/components/ui/`) - Primitive building blocks
2. **Feature Components** (`/admin/components/`) - Business logic components
3. **Page Components** (`/pages/`, `/admin/pages/`) - Full page views

### Component Guidelines
- Use functional components with hooks
- Props should be typed with TypeScript interfaces
- Extract reusable logic into custom hooks
- Keep components focused (Single Responsibility)
- Use composition over prop drilling

### Example Component Structure
```typescript
import { FC } from "react";

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const Component: FC<ComponentProps> = ({ title, onAction }) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

---

## Custom Hooks Catalog

### Data Fetching Hooks
- `useAdminStats()` - Dashboard KPIs
- `useFinancialReports(dateRange)` - Financial analytics
- `useBookingAnalytics(dateRange)` - Booking metrics
- `usePerformanceReports(dateRange)` - Host performance
- `useRecentActivity()` - Activity feed
- `useSettings()` - Platform settings CRUD

### Authentication Hooks
- `useAuth()` - User auth state and helpers
- `hasRole(role)` - Check user role

### UI Hooks
- `useToast()` - Toast notifications
- `useDebounce()` - Debounced values

---

## State Management

### Server State (TanStack Query)
Used for all backend data via Supabase:

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });
}
```

**Key Patterns:**
- `queryKey` - Unique cache identifier
- `queryFn` - Async data fetcher
- Auto-caching and refetching
- Loading and error states

### Local State (React useState)
Used for UI-only state:
- Form inputs
- Modal visibility
- Dropdown selections
- Filter states

### Global State (React Context)
Used for shared app state:
- **AuthContext** - User authentication and profile
- Accessible via `useAuth()` hook

---

## Routing

### Route Structure
```typescript
<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Index />} />
    <Route path="/properties" element={<Properties />} />
    <Route path="/properties/:id" element={<PropertyDetail />} />
    
    {/* Protected Routes */}
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    
    {/* Admin Routes */}
    <Route path="/admin/*" element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    } />
  </Routes>
</BrowserRouter>
```

### Route Protection
- **ProtectedRoute** - Requires authentication
- **AdminRoute** - Requires admin role
- Redirects to login if unauthorized

---

## Forms & Validation

### Zod Schema Pattern
```typescript
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(3, "Title too short"),
  price_per_night: z.number().positive("Must be positive"),
  guests: z.number().min(1).max(20),
});

type PropertyFormData = z.infer<typeof propertySchema>;
```

### React Hook Form Integration
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<PropertyFormData>({
  resolver: zodResolver(propertySchema),
  defaultValues: { title: "", price_per_night: 0, guests: 1 }
});

const onSubmit = form.handleSubmit(async (data) => {
  // Submit to Supabase
});
```

### Form Component Pattern
- Use `<Form>` wrapper from shadcn/ui
- Connect inputs with `form.register()`
- Display errors with `form.formState.errors`
- Show loading state during submission

---

## Data Flow

### Standard Data Flow
```
User Action
  ↓
Component Event Handler
  ↓
TanStack Query Mutation
  ↓
Supabase Client
  ↓
Supabase API (with RLS)
  ↓
Database
  ↓
Response
  ↓
Query Cache Update
  ↓
UI Re-render
```

### Example Mutation
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const createProperty = useMutation({
  mutationFn: async (property: PropertyFormData) => {
    const { data, error } = await supabase
      .from("properties")
      .insert(property)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    toast.success("Property created!");
  },
});
```

---

## Charts & Reports

### Recharts Integration
All admin reports use Recharts for visualizations:

**Available Components:**
- `BarChart` - Booking status distribution
- `LineChart` - Occupancy trends
- `PieChart` - Revenue breakdown

**Usage Pattern:**
```typescript
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
  </LineChart>
</ResponsiveContainer>
```

### CSV Export
Reports can be exported via `exportToCSV()` utility:
```typescript
import { exportToCSV } from "@/admin/utils/exportCSV";

exportToCSV({
  filename: "financial-report",
  data: reportData,
  headers: ["metric", "value", "growth"]
});
```

---

## Styling System

### Tailwind CSS
- Utility-first approach
- Responsive modifiers (`md:`, `lg:`)
- Dark mode support via `dark:` prefix

### Design Tokens (CSS Variables)
Located in `index.css`:
```css
:root {
  --primary: 220 90% 56%;
  --secondary: 217 91% 60%;
  --accent: 38 92% 50%;
  --muted: 210 40% 96%;
}
```

**Usage:**
```typescript
className="bg-primary text-primary-foreground"
// Compiles to: background-color: hsl(var(--primary))
```

### Component Variants (CVA)
```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        outline: "border border-input",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
      },
    },
  }
);
```

---

## Error Handling

### Query Errors
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ["properties"],
  queryFn: fetchProperties,
});

if (error) {
  return <ErrorMessage error={error.message} />;
}
```

### Toast Notifications
```typescript
import { toast } from "sonner";

toast.success("Success message");
toast.error("Error message");
toast.loading("Loading...");
```

### Global Error Boundary
```typescript
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

---

## Performance Optimizations

1. **React Query Caching** - Automatic data caching
2. **Lazy Loading** - Route-based code splitting
3. **Debouncing** - Search inputs with `useDebounce()`
4. **Pagination** - Large datasets with `range()` queries
5. **Memoization** - `useMemo()` for expensive calculations

---

## Admin Module Architecture

### Dashboard
- Real-time KPIs with trend indicators
- Activity feed with recent actions
- Quick stats tables

### Reports
Three report types with date filtering and CSV export:
1. **Financial** - Revenue, commissions, refunds
2. **Booking Analytics** - Status distribution, trends
3. **Performance** - Top hosts, occupancy rates

### Settings
Four settings categories:
1. **Platform** - General and booking settings
2. **Notifications** - Email/SMS preferences
3. **Roles** - Permission matrix display
4. **Integrations** - Connection status display

---

## Best Practices

1. **TypeScript** - Always type props and return values
2. **Hooks** - Extract complex logic into custom hooks
3. **Composition** - Build complex UIs from simple components
4. **Accessibility** - Use semantic HTML and ARIA labels
5. **Error Handling** - Always handle loading and error states
6. **Keys** - Use stable keys for list items
7. **Memoization** - Only when profiling shows benefit
8. **Testing** - Test business logic in hooks
9. **Code Splitting** - Lazy load routes
10. **CSS Variables** - Use design tokens, not hardcoded colors

---

## Common Patterns

### Loading State
```typescript
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage />;
return <Content data={data} />;
```

### Protected Action
```typescript
const { hasRole } = useAuth();

if (!hasRole("admin")) {
  return <Unauthorized />;
}
```

### Optimistic Update
```typescript
const mutation = useMutation({
  mutationFn: updateItem,
  onMutate: async (newData) => {
    await queryClient.cancelQueries(["items"]);
    const previous = queryClient.getQueryData(["items"]);
    queryClient.setQueryData(["items"], newData);
    return { previous };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(["items"], context.previous);
  },
});
```
