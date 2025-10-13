import SEO from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Briefcase, Heart, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Careers() {
  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Paramaribo / Remote",
      type: "Full-time",
    },
    {
      title: "Customer Success Manager",
      department: "Support",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Contract",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Travel",
      description: "We love what we do and believe in the transformative power of travel",
    },
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "We work together as one team, supporting and learning from each other",
    },
    {
      icon: TrendingUp,
      title: "Growth Mindset",
      description: "We embrace challenges and continuously improve ourselves and our product",
    },
    {
      icon: Briefcase,
      title: "Work-Life Balance",
      description: "We believe in sustainable success and taking care of our team",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Careers | PingPe - Join Our Team"
        description="Join the PingPe team and help us revolutionize travel. Explore open positions and learn about our company culture."
        url="https://www.jungleresortpingpe.com/careers"
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Join Our Team
              </h1>
              <p className="text-xl text-muted-foreground">
                Help us build the future of travel while working with passionate people from around the world
              </p>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
              Why Work at PingPe?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
              Open Positions
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {openPositions.map((position, idx) => (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {position.department}
                        </span>
                        <span>•</span>
                        <span>{position.location}</span>
                        <span>•</span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Perks & Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                Perks & Benefits
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Competitive Compensation
                  </h3>
                  <p className="text-muted-foreground">
                    Fair salaries, equity options, and performance bonuses
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Flexible Work
                  </h3>
                  <p className="text-muted-foreground">
                    Work remotely or from our offices with flexible hours
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Travel Perks
                  </h3>
                  <p className="text-muted-foreground">
                    Annual travel stipend and discounts on PingPe bookings
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Professional Growth
                  </h3>
                  <p className="text-muted-foreground">
                    Learning budget, conferences, and mentorship programs
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Health & Wellness
                  </h3>
                  <p className="text-muted-foreground">
                    Comprehensive health insurance and wellness programs
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Time Off
                  </h3>
                  <p className="text-muted-foreground">
                    Generous PTO, holidays, and parental leave
                  </p>
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
                Don't See the Right Role?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're always looking for talented people. Send us your resume and tell us how you'd like to contribute.
              </p>
              <Button size="lg" asChild>
                <a href="/contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
