import SEO from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Search, BookOpen, CreditCard, MapPin, Users, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HelpCenter() {
  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using PingPe",
      articles: 12,
    },
    {
      icon: CreditCard,
      title: "Booking & Payments",
      description: "Everything about making and managing bookings",
      articles: 18,
    },
    {
      icon: MapPin,
      title: "Travel & Destinations",
      description: "Tips and guides for your trips",
      articles: 24,
    },
    {
      icon: Users,
      title: "Host Resources",
      description: "Information for hosts and partners",
      articles: 15,
    },
  ];

  const popularArticles = [
    "How do I create an account?",
    "What payment methods do you accept?",
    "How do I cancel or modify my booking?",
    "How do I contact my host?",
    "What is your refund policy?",
    "How do I become a host?",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Help Center | PingPe - Support & Resources"
        description="Get help and find answers to your questions. Browse articles, guides, and resources for travelers and hosts."
        url="https://www.jungleresortpingpe.com/help"
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                How can we help you?
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Search our knowledge base or browse categories below
              </p>
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for help articles..."
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {categories.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.articles} articles
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                Popular Articles
              </h2>
              <div className="space-y-3">
                {popularArticles.map((article, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="block bg-background border border-border rounded-lg p-4 hover:shadow-md hover:border-primary transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-medium">
                        {article}
                      </span>
                      <span className="text-primary">→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-primary/10 rounded-lg p-12 text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Still Need Help?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Can't find what you're looking for? Our support team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/faq">View FAQ</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
