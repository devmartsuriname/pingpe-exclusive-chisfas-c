import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shield, CheckCircle, AlertTriangle, Phone } from "lucide-react";

export default function Safety() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Safety Guidelines | PingPe - Travel Safely</title>
        <meta
          name="description"
          content="Learn about PingPe's safety measures, guidelines, and resources to ensure safe travel experiences for all users."
        />
      </Helmet>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Your Safety is Our Priority
              </h1>
              <p className="text-xl text-muted-foreground">
                Learn about our safety measures and how we help create secure travel experiences
              </p>
            </div>
          </div>
        </section>

        {/* Safety Measures */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                How We Keep You Safe
              </h2>
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Verified Hosts & Properties
                      </h3>
                      <p className="text-muted-foreground">
                        All hosts go through a verification process including identity verification, property inspection, and background checks before they can list on PingPe.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Secure Payment Processing
                      </h3>
                      <p className="text-muted-foreground">
                        We use industry-leading payment processors and never share your payment information with hosts. Your money is held securely until after check-in.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        24/7 Customer Support
                      </h3>
                      <p className="text-muted-foreground">
                        Our dedicated safety team is available around the clock to handle emergencies, answer questions, and resolve issues during your trip.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Review System
                      </h3>
                      <p className="text-muted-foreground">
                        Our two-way review system ensures accountability. Both guests and hosts can leave honest feedback to maintain quality and safety standards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Travel Insurance Options
                      </h3>
                      <p className="text-muted-foreground">
                        We partner with leading insurance providers to offer optional travel insurance coverage for your bookings, including trip cancellation and medical coverage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                Safety Tips for Travelers
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Before You Book
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Read reviews from previous guests</li>
                    <li>• Verify property details and photos</li>
                    <li>• Check host response rate and rating</li>
                    <li>• Communicate through PingPe messaging</li>
                  </ul>
                </div>
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    During Your Stay
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Keep emergency contacts handy</li>
                    <li>• Share your itinerary with someone</li>
                    <li>• Follow local safety guidelines</li>
                    <li>• Report any concerns immediately</li>
                  </ul>
                </div>
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Communication Safety
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Always use in-platform messaging</li>
                    <li>• Never share financial information</li>
                    <li>• Don't pay outside the platform</li>
                    <li>• Report suspicious behavior</li>
                  </ul>
                </div>
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Property Safety
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Check smoke and CO detectors</li>
                    <li>• Locate emergency exits</li>
                    <li>• Secure valuables properly</li>
                    <li>• Follow house rules</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Emergency Support
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      If you're in danger or experiencing an emergency, contact local authorities first. Then reach out to our 24/7 safety team for additional support.
                    </p>
                    <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Phone className="w-5 h-5" />
                      <span>24/7 Emergency Hotline: +1 (555) 911-HELP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Issue */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Report a Safety Concern
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                If you notice a safety issue or suspicious activity, please let us know immediately so we can investigate and take appropriate action.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Report an Issue
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
