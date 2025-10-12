import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Safety", href: "/safety" },
        { name: "Cancellation", href: "/cancellation" },
      ],
    },
    {
      title: "Explore",
      links: [
        { name: "Destinations", href: "/destinations" },
        { name: "Activities", href: "/experiences" },
        { name: "Travel Guide", href: "/guide" },
        { name: "Gift Cards", href: "/gifts" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Sitemap", href: "/sitemap" },
      ],
    },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h3 className="font-display text-2xl font-bold mb-3">
            Good news from far away
          </h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to get exclusive deals, travel tips, and updates from Boven Suriname
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button type="submit">
              <Mail className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">P</span>
              </div>
              <div>
                <p className="font-display font-bold">PingPe</p>
                <p className="text-xs text-muted-foreground">
                  © 2025 PingPe. All rights reserved.
                </p>
              </div>
            </div>

            {/* Language Selector (placeholder) */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-foreground">English</span>
              <span className="text-sm text-muted-foreground cursor-not-allowed">
                Nederlands
              </span>
              <span className="text-sm text-muted-foreground cursor-not-allowed">
                Français
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
