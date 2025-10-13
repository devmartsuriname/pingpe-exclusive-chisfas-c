import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, Calendar, MessageSquare, CheckCircle, Home, Compass, Truck, Gift } from "lucide-react";

export default function HowItWorks() {
  return (
    <>
      <Helmet>
        <title>How It Works | PingPe - Simple Travel Booking</title>
        <meta
          name="description"
          content="Learn how PingPe works. Discover our simple 4-step process for booking stays, experiences, events, and transportation for your perfect trip."
        />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                How PingPe Works
              </h1>
              <p className="text-xl text-muted-foreground">
                Book your perfect trip in four simple steps
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-16">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <div className="text-primary font-bold mb-2">Step 1</div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Search & Discover</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Browse our curated collection of stays, experiences, events, and transportation options. Use filters to find exactly what you're looking for based on location, dates, price, and preferences.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Advanced search filters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Verified listings with photos and reviews</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Detailed descriptions and amenities</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <div className="text-primary font-bold mb-2">Step 2</div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Select & Book</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Choose your dates, number of guests, and any additional options. Review the details, pricing, and cancellation policy, then complete your secure booking with just a few clicks.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Instant booking confirmation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Secure payment processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Clear pricing with no hidden fees</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <div className="text-primary font-bold mb-2">Step 3</div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Connect with Hosts</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Communicate directly with your host or service provider through our messaging system. Get answers to your questions, receive important details, and coordinate your arrival.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>In-app messaging system</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Automatic booking reminders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Access to important information</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <div className="text-primary font-bold mb-2">Step 4</div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Experience & Review</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Enjoy your stay, experience, or event! After your trip, share your feedback to help future travelers and contribute to our community.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>24/7 customer support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Review system for quality assurance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Save favorites for future trips</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Can Book Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              What You Can Book on PingPe
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="bg-background rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Stays</h3>
                <p className="text-muted-foreground">
                  Hotels, resorts, homestays, and unique accommodations for every budget
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Experiences</h3>
                <p className="text-muted-foreground">
                  Tours, activities, workshops, and adventures hosted by local experts
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Transport</h3>
                <p className="text-muted-foreground">
                  Airport transfers, car rentals, and transportation services
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Packages</h3>
                <p className="text-muted-foreground">
                  All-inclusive travel packages combining multiple services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-primary/10 rounded-lg p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of travelers who trust PingPe for their adventures
              </p>
              <a
                href="/stays"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start Exploring
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
