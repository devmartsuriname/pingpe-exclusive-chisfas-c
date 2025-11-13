# Animation Library Documentation

## Overview
Centralized animation configurations using Framer Motion for consistent motion design across the PingPe platform.

## Import
```typescript
import { fadeIn, scaleIn, buttonHover } from "@/lib/animations";
```

## Available Animations

### Fade Animations
```typescript
// Basic fade in
<motion.div variants={fadeIn} initial="hidden" animate="visible">

// Fade with upward motion
<motion.div variants={fadeInUp} initial="hidden" animate="visible">

// Fade with downward motion
<motion.div variants={fadeInDown} initial="hidden" animate="visible">
```

### Scale Animations
```typescript
// Smooth scale in
<motion.div variants={scaleIn} initial="hidden" animate="visible">

// Scale in with bounce
<motion.div variants={scaleInBounce} initial="hidden" animate="visible">
```

### Slide Animations
```typescript
// Slide in from left
<motion.div variants={slideInLeft} initial="hidden" animate="visible">

// Slide in from right
<motion.div variants={slideInRight} initial="hidden" animate="visible">
```

### Stagger Animations
Perfect for lists and grids:
```typescript
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Card Animations
```typescript
// Hover lift effect
<motion.div variants={cardHover} initial="rest" whileHover="hover">

// 3D tilt effect (requires perspective)
<motion.div 
  variants={card3DTilt} 
  initial="rest" 
  whileHover="hover"
  style={{ perspective: 1000 }}
>
```

### Button Animations
```typescript
// Button tap
<motion.button whileTap={buttonTap}>

// Button hover
<motion.button whileHover={buttonHover}>

// Button glow
<motion.button variants={buttonGlow} initial="rest" whileHover="hover">
```

### Modal/Dialog Animations
```typescript
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div variants={modalOverlay} initial="hidden" animate="visible" exit="exit" />
      <motion.div variants={modalContent} initial="hidden" animate="visible" exit="exit">
        {/* Modal content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Drawer Animations
```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div variants={drawerSlideUp} initial="hidden" animate="visible" exit="exit">
      {/* Drawer content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Loading Animations
```typescript
// Pulse effect
<motion.div variants={pulseAnimation} initial="initial" animate="animate">

// Spinning loader
<motion.div variants={spinAnimation} animate="animate">
```

### Scroll Reveal
```typescript
<motion.div 
  variants={scrollReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
>
```

### Hero Animations
```typescript
// Hero text entrance
<motion.h1 variants={heroText} initial="hidden" animate="visible">

// Hero image entrance
<motion.img variants={heroImage} initial="hidden" animate="visible">
```

## Transition Presets

Use predefined transitions for consistent timing:

```typescript
import { transitions } from "@/lib/animations";

<motion.div
  animate={{ opacity: 1 }}
  transition={transitions.fast}  // 0.2s
  transition={transitions.normal} // 0.3s
  transition={transitions.slow}   // 0.5s
  transition={transitions.bounce} // With bounce easing
  transition={transitions.spring} // Spring physics
>
```

## Easing Presets

Custom easing curves for smooth animations:

```typescript
import { easings } from "@/lib/animations";

<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.5, ease: easings.easeOut }}
>
```

## Parallax Configuration

```typescript
import { parallaxConfig } from "@/lib/animations";

const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], parallaxConfig.medium.y);

<motion.div style={{ y }}>
```

## Best Practices

1. **Use variants for complex animations** - Cleaner and more maintainable
2. **Combine with viewport triggers** - For scroll-based animations
3. **Use AnimatePresence** - For exit animations
4. **Respect reduced motion** - Always check `useReducedMotion()`
5. **Keep animations subtle** - Enhance, don't distract

## Examples

### Animated Card Grid
```typescript
<motion.div 
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
  className="grid grid-cols-3 gap-4"
>
  {cards.map(card => (
    <motion.div
      key={card.id}
      variants={staggerItem}
      whileHover={{ scale: 1.05 }}
    >
      {card.content}
    </motion.div>
  ))}
</motion.div>
```

### Animated Modal
```typescript
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div 
        variants={modalOverlay}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2>Modal Title</h2>
        <p>Modal content</p>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Scroll-Triggered Section
```typescript
<motion.section
  variants={scrollReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
  <h2>Revealed on Scroll</h2>
</motion.section>
```

## Phase 1 Completion Checklist

✅ Centralized animation library created  
✅ 30+ reusable animation variants  
✅ Transition and easing presets  
✅ Button animations with ripple effects  
✅ Modal, drawer, and loading animations  
✅ Scroll and parallax configurations  
✅ Documentation and examples  

---

**Next Steps**: Use these animations throughout the app for consistent, professional motion design. Check the ButtonShowcase component for button examples.
