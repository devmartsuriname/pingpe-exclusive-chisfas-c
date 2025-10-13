import SEO from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";

export default function Sitemap() {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "Stays", path: "/stays" },
        { name: "Experiences", path: "/experiences" },
        { name: "Transport", path: "/transport" },
        { name: "Packages", path: "/packages" },
        { name: "Events", path: "/events" },
        { name: "Blog", path: "/blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Contact Us", path: "/contact" },
        { name: "FAQ", path: "/faq" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Safety", path: "/safety" },
        { name: "Cancellation Policy", path: "/cancellation" },
      ],
    },
    {
      title: "Explore",
      links: [
        { name: "Destinations", path: "/destinations" },
        { name: "Travel Guide", path: "/guide" },
        { name: "Gift Cards", path: "/gifts" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Sign In", path: "/auth/sign-in" },
        { name: "Sign Up", path: "/auth/sign-up" },
        { name: "Profile", path: "/profile" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Sitemap | PingPe - Site Navigation"
        description="Browse all pages on PingPe. Find links to stays, experiences, support, company information, and more."
        url="https://www.jungleresortpingpe.com/sitemap"
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Sitemap
              </h1>
              <p className="text-xl text-muted-foreground">
                Navigate all pages and resources on PingPe
              </p>
            </div>
          </div>
        </section>

        {/* Sitemap Links */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          to={link.path}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Use our search feature or contact our support team for assistance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/help"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Visit Help Center
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
