import { Variants } from "framer-motion";

/**
 * Centralized Animation Library
 * Reusable animation configurations for consistent motion design across the app
 */

// ============= FADE ANIMATIONS =============
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// ============= SCALE ANIMATIONS =============
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.34, 1.56, 0.64, 1] // Bounce easing
    }
  }
};

// ============= SLIDE ANIMATIONS =============
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// ============= STAGGER ANIMATIONS =============
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// ============= CARD ANIMATIONS =============
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

export const card3DTilt: Variants = {
  rest: { 
    rotateX: 0, 
    rotateY: 0,
    scale: 1 
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

// ============= BUTTON ANIMATIONS =============
export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const buttonGlow: Variants = {
  rest: { boxShadow: "0 0 0 rgba(var(--primary), 0)" },
  hover: { 
    boxShadow: "0 0 20px rgba(var(--primary), 0.5)",
    transition: { duration: 0.3 }
  }
};

// ============= MODAL/DIALOG ANIMATIONS =============
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// ============= DRAWER ANIMATIONS =============
export const drawerSlideUp: Variants = {
  hidden: { y: "100%" },
  visible: { 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.32, 0.72, 0, 1] // Custom easing
    }
  },
  exit: { 
    y: "100%",
    transition: { duration: 0.2 }
  }
};

// ============= LOADING ANIMATIONS =============
export const pulseAnimation: Variants = {
  initial: { opacity: 0.6, scale: 1 },
  animate: { 
    opacity: 1, 
    scale: 1.05,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export const spinAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// ============= SCROLL REVEAL ANIMATIONS =============
export const scrollReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// ============= PARALLAX UTILITY =============
export const parallaxConfig = {
  slow: { y: [0, -50] },
  medium: { y: [0, -100] },
  fast: { y: [0, -150] }
};

// ============= TRANSITION PRESETS =============
export const transitions = {
  fast: { duration: 0.2, ease: "easeOut" },
  normal: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.5, ease: "easeOut" },
  bounce: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  spring: { type: "spring", stiffness: 300, damping: 20 },
  springBouncy: { type: "spring", stiffness: 400, damping: 15 }
};

// ============= EASING PRESETS =============
export const easings = {
  easeOut: [0.32, 0.72, 0, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.65, 0, 0.35, 1],
  anticipate: [0.36, 0, 0.66, -0.56],
  backOut: [0.34, 1.56, 0.64, 1]
};

// ============= GESTURE ANIMATIONS =============
export const swipeableCard: Variants = {
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: 0.3 }
  })
};

// ============= NOTIFICATION ANIMATIONS =============
export const toastSlideIn: Variants = {
  hidden: { 
    opacity: 0, 
    x: 100,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    x: 100,
    transition: { duration: 0.2 }
  }
};

// ============= HERO ANIMATIONS =============
export const heroText: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const heroImage: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 1,
      ease: "easeOut"
    }
  }
};
