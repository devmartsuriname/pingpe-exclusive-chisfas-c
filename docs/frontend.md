# Frontend Documentation

## Overview

This document provides technical guidance for the PingPe frontend architecture, component patterns, and best practices.

---

## 🎠 Carousel Implementation

### Usage Pattern

PingPe uses Embla Carousel via the `@/components/ui/carousel` component wrapper. The carousel is used in multiple homepage sections for improved UX and responsive layouts.

### Basic Implementation

```tsx
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

<Carousel
  opts={{
    align: "start",
    loop: false,
  }}
  className="w-full"
>
  <CarouselContent>
    {items.map((item) => (
      <CarouselItem key={item.id} className="basis-1/2 md:basis-1/4">
        <YourCard {...item} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <div className="flex justify-center gap-2 mt-6">
    <CarouselPrevious className="relative static translate-y-0" />
    <CarouselNext className="relative static translate-y-0" />
  </div>
</Carousel>
```

### Responsive Breakpoints

Use Tailwind's responsive classes on `CarouselItem` to control visible cards:

```tsx
<CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
  {/* Content */}
</CarouselItem>
```

| Breakpoint | Class | Visible Cards |
|------------|-------|---------------|
| Mobile (default) | `basis-1/2` | 2 cards |
| Small tablet | `sm:basis-1/3` | 3 cards |
| Tablet | `md:basis-1/4` | 4 cards |
| Desktop | `lg:basis-1/5` | 5 cards |

### Autoplay Configuration

For sections that benefit from auto-scrolling:

```tsx
import Autoplay from "embla-carousel-autoplay";

<Carousel
  opts={{
    align: "start",
    loop: true,
  }}
  plugins={[
    Autoplay({
      delay: 4000, // 4 seconds
    })
  ]}
  className="w-full"
>
  {/* Content */}
</Carousel>
```

**Recommendations:**
- Use `loop: true` with autoplay for continuous scrolling
- Set delay between 3-5 seconds for optimal UX
- Consider disabling autoplay on user interaction

### Homepage Carousel Sections

1. **"Become a Host"** (`src/pages/Index.tsx` ~line 367)
   - Desktop: 5 cards visible
   - Autoplay: 4s delay
   - Loop: disabled (finite list)

2. **"Explore Nearby"** (`src/pages/Index.tsx` ~line 396)
   - Desktop: 4 locations visible
   - Autoplay: 3.5s delay
   - Loop: enabled (circular navigation)

3. **"What Our Guests Say"** (`src/pages/Index.tsx` ~line 451)
   - Desktop: 3 testimonials visible
   - No autoplay (user-controlled)

---

## 🎨 Icon Integration

### Lucide React Icons

PingPe uses [Lucide React](https://lucide.dev/) for consistent, scalable icons throughout the application.

### "How It Works" Section Pattern

The `IllustratedStep` component supports both image and icon props:

```tsx
import { Calendar, Send, Smile } from "lucide-react";
import IllustratedStep from "@/components/how-it-works/IllustratedStep";

<IllustratedStep
  icon={Calendar}
  title="Book a trip"
  description="Choose from stays, experiences, and transport options"
/>
```

**Component Props:**
```tsx
interface IllustratedStepProps {
  image?: string;              // Optional: path to image asset
  icon?: LucideIcon;           // Optional: Lucide icon component
  title: string;               // Step title
  description: string;         // Step description
}
```

**Styling:**
- Icon container: `w-24 h-24 rounded-full bg-muted`
- Icon color: `text-primary`
- Size: `w-16 h-16` (icon itself)

---

## 🖼️ Image Optimization

### OptimizedImage Component

All images should use the `OptimizedImage` component for lazy loading and responsive sizing:

```tsx
import OptimizedImage from "@/components/shared/OptimizedImage";

<OptimizedImage
  src="/demo-content/gallery-1.jpg"
  alt="Descriptive alt text"
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="rounded-xl object-cover"
/>
```

### Newsletter Section Pattern

The "Get PingPe Updates" section uses a 60/40 layout:

```tsx
<div className="grid lg:grid-cols-2 gap-12 items-center">
  {/* Left: Form (60%) */}
  <div>
    <h2>Get PingPe Updates</h2>
    <input type="email" />
  </div>
  
  {/* Right: Image (40%) */}
  <div className="hidden lg:flex justify-center items-center">
    <OptimizedImage
      src={heroImage1}
      alt="PingPe Resort"
      className="rounded-2xl shadow-lg object-cover w-full max-w-lg"
    />
  </div>
</div>
```

---

## 📱 Responsive Design Guidelines

### Breakpoint Strategy

| Device | Breakpoint | Typical Width |
|--------|-----------|---------------|
| Mobile | Default | 375px - 640px |
| Small tablet | `sm:` | 640px - 768px |
| Tablet | `md:` | 768px - 1024px |
| Desktop | `lg:` | 1024px - 1280px |
| Large desktop | `xl:` | 1280px+ |

### Common Patterns

**Container Widths:**
```tsx
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

**Grid Layouts:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

**Flex Direction:**
```tsx
className="flex flex-col lg:flex-row gap-8"
```

---

## 🎯 Component Architecture

### Atomic Design Pattern

PingPe follows atomic design principles:

```
src/components/
├── ui/              # Shadcn UI primitives (atoms)
├── shared/          # Reusable utility components
├── cards/           # Card components (molecules)
├── sections/        # Page sections (organisms)
└── how-it-works/    # Feature-specific components
```

### Creating New Components

**Component Template:**
```tsx
import { cn } from "@/lib/utils";

interface YourComponentProps {
  className?: string;
  // Add typed props
}

export default function YourComponent({ 
  className,
  ...props 
}: YourComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {/* Component content */}
    </div>
  );
}
```

**Guidelines:**
- Use TypeScript for all components
- Include prop interfaces
- Use `cn()` utility for className merging
- Export as default for page-level components
- Named exports for utility components

---

## 🎨 Design System

### Semantic Color Tokens

**Always use semantic tokens from `index.css`:**

```tsx
// ❌ WRONG - Direct color values
className="text-white bg-green-600"

// ✅ CORRECT - Semantic tokens
className="text-foreground bg-primary"
```

### Available Tokens

| Token | Usage |
|-------|-------|
| `background` | Page/card backgrounds |
| `foreground` | Primary text color |
| `primary` | Brand color (buttons, links) |
| `primary-foreground` | Text on primary backgrounds |
| `secondary` | Secondary actions |
| `muted` | Subtle backgrounds |
| `muted-foreground` | Secondary text |
| `accent` | Highlighted elements |
| `destructive` | Error states |
| `border` | Border colors |

---

## 🚀 Performance Best Practices

### Image Loading

- Use `OptimizedImage` component for all images
- Specify `width` and `height` attributes
- Use `sizes` prop for responsive images
- Implement lazy loading by default

### Code Splitting

- Dynamic imports for heavy components
- Route-based code splitting (automatic with Vite)
- Lazy load below-the-fold content

### Bundle Optimization

- Tree-shake unused Lucide icons
- Avoid large third-party libraries
- Use production builds for deployment

---

## 🧪 Testing Checklist

### Before Deploying

- [ ] Test on mobile (375px-480px)
- [ ] Test on tablet (768px-1024px)
- [ ] Test on desktop (1280px+)
- [ ] Verify dark/light mode compatibility
- [ ] Check console for errors/warnings
- [ ] Validate image loading (no broken images)
- [ ] Test carousel navigation and autoplay
- [ ] Verify responsive grid/flex layouts
- [ ] Check accessibility (keyboard navigation)
- [ ] Run Lighthouse audit (target >90 score)

---

## 📚 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Embla Carousel](https://www.embla-carousel.com/)
- [React Router](https://reactrouter.com/)

---

**Last Updated:** October 18, 2025  
**Version:** 1.1.0
