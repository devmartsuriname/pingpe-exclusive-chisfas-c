import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { XCircle, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function Cancellation() {
  const policies = [
    {
      name: "Flexible",
      icon: CheckCircle,
      refund: "Full refund if canceled 24+ hours before check-in",
      description: "Best for travelers who want maximum flexibility",
    },
    {
      name: "Moderate",
      icon: Clock,
      refund: "Full refund if canceled 5+ days before check-in",
      description: "Balance between flexibility and commitment",
    },
    {
      name: "Firm",
      icon: AlertCircle,
      refund: "50% refund if canceled 7+ days before check-in",
      description: "Provides hosts with more booking certainty",
    },
    {
      name: "Strict",
      icon: XCircle,
      refund: "50% refund if canceled 14+ days before check-in",
      description: "For properties with high demand or unique offerings",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Cancellation Policy | PingPe - Refund Information</title>
        <meta
          name="description"
          content="Understand PingPe's cancellation policies and refund procedures. Learn about different cancellation options for bookings."
        />
      </Helmet>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Cancellation Policy
              </h1>
              <p className="text-xl text-muted-foreground">
                Understand our cancellation and refund policies for different types of bookings
              </p>
            </div>
          </div>
        </section>

        {/* Policy Types */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
              Cancellation Policy Types
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {policies.map((policy, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <policy.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {policy.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {policy.description}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-foreground font-medium">{policy.refund}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                How Cancellations Work
              </h2>
              <div className="space-y-6">
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    1. Review Your Booking's Policy
                  </h3>
                  <p className="text-muted-foreground">
                    Each booking displays its specific cancellation policy at the time of booking. Check your confirmation email or booking details to see which policy applies.
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    2. Cancel Through Your Account
                  </h3>
                  <p className="text-muted-foreground">
                    Log in to your account, go to your bookings, and select the reservation you want to cancel. Follow the prompts to complete the cancellation.
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    3. Receive Your Refund
                  </h3>
                  <p className="text-muted-foreground">
                    If eligible for a refund based on the cancellation policy, it will be processed to your original payment method within 5-10 business days.
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    4. Communicate with Your Host
                  </h3>
                  <p className="text-muted-foreground">
                    If you have special circumstances, message your host before canceling. Some hosts may be willing to work with you on alternative arrangements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                Important Information
              </h2>
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Service Fees
                  </h3>
                  <p className="text-muted-foreground">
                    PingPe service fees are refundable depending on when you cancel. Check the cancellation timeline for your specific booking to see which fees are refundable.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Experiences & Events
                  </h3>
                  <p className="text-muted-foreground">
                    Experiences and events may have different cancellation policies than accommodations. Many require 48-72 hours notice for full refunds. Always check before booking.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Force Majeure
                  </h3>
                  <p className="text-muted-foreground">
                    In cases of natural disasters, pandemics, or other extraordinary circumstances, special cancellation policies may apply. Contact our support team for assistance.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Host Cancellations
                  </h3>
                  <p className="text-muted-foreground">
                    If a host cancels your booking, you'll receive a full refund plus a 10% travel credit. We also help you find alternative accommodations if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Need Help with a Cancellation?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our support team is here to help you understand policies and process cancellations.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
