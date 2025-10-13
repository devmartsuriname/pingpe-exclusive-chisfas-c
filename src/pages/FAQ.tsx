import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      category: "Booking & Payments",
      questions: [
        {
          q: "How do I make a booking?",
          a: "Browse our listings, select your dates and number of guests, and click 'Book Now'. You'll be guided through the payment process and receive a confirmation email once your booking is complete."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our trusted payment partners."
        },
        {
          q: "When will I be charged?",
          a: "Your payment method is charged immediately upon booking confirmation. For some bookings, a deposit may be required with the balance due closer to your travel date."
        },
        {
          q: "Can I get a refund if I cancel?",
          a: "Refund eligibility depends on the cancellation policy of your specific booking. Check the cancellation policy before booking, and review your confirmation email for details."
        }
      ]
    },
    {
      category: "Account & Profile",
      questions: [
        {
          q: "Do I need an account to book?",
          a: "Yes, you need to create a free account to make bookings. This allows you to manage your reservations, communicate with hosts, and save your favorite listings."
        },
        {
          q: "How do I update my profile information?",
          a: "Log in to your account and navigate to Profile Settings. You can update your name, email, phone number, and other preferences there."
        },
        {
          q: "I forgot my password. What should I do?",
          a: "Click 'Forgot Password' on the login page and enter your email address. You'll receive instructions to reset your password."
        }
      ]
    },
    {
      category: "For Hosts",
      questions: [
        {
          q: "How do I become a host?",
          a: "Sign up for an account and apply to become a host from your dashboard. Once approved, you can create listings for stays, experiences, events, or transportation services."
        },
        {
          q: "What commission does PingPe charge?",
          a: "Our standard service fee is 15% of the booking total. This covers payment processing, customer support, and platform maintenance."
        },
        {
          q: "How and when do I receive payments?",
          a: "Payments are typically released 24 hours after guest check-in. You can set up your payout method in your host dashboard."
        },
        {
          q: "Can I set my own cancellation policy?",
          a: "Yes, you can choose from several cancellation policy options when creating your listing. Select the one that works best for your business."
        }
      ]
    },
    {
      category: "Experiences & Events",
      questions: [
        {
          q: "What types of experiences can I book?",
          a: "We offer a wide range of experiences including tours, workshops, adventure activities, cultural experiences, and more. Browse our Experiences section to see what's available in your destination."
        },
        {
          q: "What's the difference between experiences and events?",
          a: "Experiences are regularly scheduled activities (like tours or classes), while events are one-time or periodic happenings (like festivals or concerts)."
        },
        {
          q: "What's included in the experience price?",
          a: "Each experience listing details what's included. This typically covers instruction, equipment, and sometimes food or drinks. Check the listing for specifics."
        }
      ]
    },
    {
      category: "Travel Packages",
      questions: [
        {
          q: "What are travel packages?",
          a: "Travel packages combine multiple services (stays, experiences, transportation, events) into one curated itinerary at a discounted rate."
        },
        {
          q: "Can I customize a package?",
          a: "Some packages offer flexibility in dates and optional add-ons. Contact the package creator for customization options."
        },
        {
          q: "Do packages include flights?",
          a: "Most packages don't include flights, but they may include ground transportation. Check the package details for what's included."
        }
      ]
    },
    {
      category: "Support & Safety",
      questions: [
        {
          q: "How do I contact customer support?",
          a: "Visit our Contact page or access live chat from your account dashboard. We're available Monday-Friday, 9am-6pm EST."
        },
        {
          q: "What if I have an issue during my trip?",
          a: "Contact us immediately through the support chat in your account. We have a 24/7 emergency hotline for urgent issues."
        },
        {
          q: "How does PingPe ensure safety?",
          a: "We verify all hosts, review listings, and maintain insurance requirements. We also encourage reviews and ratings to help maintain quality standards."
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ | PingPe - Frequently Asked Questions</title>
        <meta
          name="description"
          content="Find answers to common questions about PingPe. Learn about bookings, payments, hosting, experiences, and more in our comprehensive FAQ."
        />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground">
                Find answers to the most common questions about using PingPe
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {faqs.map((category, idx) => (
                <div key={idx}>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, qIdx) => (
                      <AccordionItem key={qIdx} value={`${idx}-${qIdx}`} className="border rounded-lg px-6">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-semibold text-foreground">{faq.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto mt-16 text-center bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Still have questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
