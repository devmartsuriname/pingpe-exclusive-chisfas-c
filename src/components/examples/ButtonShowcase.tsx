import { Button } from "@/components/ui/button";
import { Heart, Download, Send, Sparkles } from "lucide-react";

/**
 * ButtonShowcase Component
 * Demonstrates all available button variants and sizes from Phase 1
 */
export function ButtonShowcase() {
  return (
    <div className="p-8 space-y-12 bg-background">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Button System</h1>
          <p className="text-muted-foreground">
            Complete Phase 1 Button Variants with Ripple Effects
          </p>
        </div>

        {/* Default Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Standard Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* Phase 1 New Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Phase 1 Special Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="premium">
              <Sparkles className="w-4 h-4" />
              Premium
            </Button>
            <Button variant="gradient">
              <Heart className="w-4 h-4" />
              Gradient
            </Button>
            <Button variant="glass">Glass Effect</Button>
            <Button variant="glow">
              Glowing Button
            </Button>
            <Button variant="3d">3D Button</Button>
            <Button variant="hero">Hero CTA</Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="gradient">
              <Send className="w-4 h-4" />
              Send Message
            </Button>
            <Button variant="glow">
              <Sparkles className="w-4 h-4" />
              Magic Effect
            </Button>
            <Button variant="3d">
              <Heart className="w-4 h-4" />
              Like This
            </Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm" variant="gradient">Small</Button>
            <Button size="default" variant="gradient">Default</Button>
            <Button size="lg" variant="gradient">Large</Button>
            <Button size="xl" variant="gradient">Extra Large</Button>
            <Button size="icon" variant="glow">
              <Heart />
            </Button>
          </div>
        </section>

        {/* States */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button States</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Normal</Button>
            <Button variant="default" disabled>Disabled</Button>
            <Button variant="gradient" disabled>Disabled Gradient</Button>
            <Button variant="glow" disabled>Disabled Glow</Button>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-4 p-8 bg-muted/30 rounded-lg border">
          <h2 className="text-2xl font-semibold">Interactive Demo</h2>
          <p className="text-muted-foreground">
            Click any button to see the ripple effect in action!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="default" className="w-full">Click Me</Button>
            <Button variant="gradient" className="w-full">Gradient Ripple</Button>
            <Button variant="glow" className="w-full">Glow Effect</Button>
            <Button variant="3d" className="w-full">3D Press</Button>
            <Button variant="premium" className="w-full">Premium Click</Button>
            <Button variant="glass" className="w-full">Glass Ripple</Button>
          </div>
        </section>

        {/* Code Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Usage Examples</h2>
          <div className="space-y-4 p-6 bg-muted/30 rounded-lg border font-mono text-sm">
            <div className="space-y-2">
              <p className="text-muted-foreground">// Standard button</p>
              <code className="text-foreground">{`<Button variant="default">Click Me</Button>`}</code>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">// Gradient with icon</p>
              <code className="text-foreground">{`<Button variant="gradient"><Heart />Love It</Button>`}</code>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">// Glowing effect</p>
              <code className="text-foreground">{`<Button variant="glow">Shine Bright</Button>`}</code>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">// 3D press effect</p>
              <code className="text-foreground">{`<Button variant="3d">Press Me</Button>`}</code>
            </div>
          </div>
        </section>

        {/* Animation Library Note */}
        <section className="space-y-4 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Phase 1 Complete!
          </h3>
          <div className="space-y-2 text-muted-foreground">
            <p>✅ All button variants implemented with ripple effects</p>
            <p>✅ Centralized animation library created at <code className="text-foreground">src/lib/animations.ts</code></p>
            <p>✅ Custom keyframes for gradient-shift and glow effects</p>
            <p>✅ Responsive and accessible button system</p>
          </div>
        </section>
      </div>
    </div>
  );
}
