import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";
import logo from "@/assets/logo.png";

export function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Discover",
      links: [
        { name: "Stays", href: "/stays" },
        { name: "Experiences", href: "/experiences" },
        { name: "Transport", href: "/transport" },
        { name: "Packages", href: "/packages" },
      ],
    },
    {
      title: "Contact",
      links: [
        { name: "Vidijaweg 25, Wanica", href: "/contact" },
        { name: "Boven-Suriname", href: "/contact" },
        { name: "+597 8858525", href: "tel:+5978858525" },
        { name: "info@jungleresortpingpe.com", href: "mailto:info@jungleresortpingpe.com" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
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
          <NewsletterForm layout="horizontal" showIcon={true} />
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
            <div className="flex items-center space-x-3">
              <img 
                src={logo}
                alt="PingPe Jungle Resort"
                className="h-10 w-auto object-contain"
              />
              <p className="text-xs text-muted-foreground">
                © 2025 PingPe. All rights reserved.
              </p>
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
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
