import SEO from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Gift, Heart, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GiftCards() {
  const giftAmounts = [50, 100, 250, 500];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Gift Cards | PingPe - Give the Gift of Travel"
        description="Give the gift of unforgettable travel experiences with PingPe gift cards. Perfect for any occasion, redeemable on stays, experiences, and more."
        url="https://www.jungleresortpingpe.com/gifts"
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Gift className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Give the Gift of Adventure
              </h1>
              <p className="text-xl text-muted-foreground">
                PingPe gift cards are perfect for birthdays, holidays, or any special occasion. Let your loved ones choose their own unforgettable experience.
              </p>
            </div>
          </div>
        </section>

        {/* Gift Card Amounts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
              Choose Your Gift Amount
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {giftAmounts.map((amount) => (
                <div
                  key={amount}
                  className="bg-card border-2 border-border rounded-lg p-8 text-center hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="text-4xl font-bold text-primary mb-2">
                    ${amount}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">USD</p>
                  <Button className="w-full">Select</Button>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-8">
              Custom amounts also available
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                Why Choose PingPe Gift Cards?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Flexible Use
                  </h3>
                  <p className="text-muted-foreground">
                    Redeemable on any stay, experience, event, or transport booking
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Never Expires
                  </h3>
                  <p className="text-muted-foreground">
                    No expiration dates - use whenever you're ready to travel
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Perfect Gift
                  </h3>
                  <p className="text-muted-foreground">
                    Instant digital delivery or beautiful physical card options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Select Amount & Personalize
                    </h3>
                    <p className="text-muted-foreground">
                      Choose your gift amount and add a personal message for the recipient
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Choose Delivery Method
                    </h3>
                    <p className="text-muted-foreground">
                      Send instantly via email or schedule delivery for a special date
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Recipient Redeems
                    </h3>
                    <p className="text-muted-foreground">
                      Your recipient enters their gift card code at checkout to apply the balance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Ready to Give the Gift of Travel?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Purchase a gift card in just a few clicks
              </p>
              <Button size="lg">Purchase Gift Card</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
