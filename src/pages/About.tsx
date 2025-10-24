import SEO from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { Users, Target, Heart, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="About Us | PingPe - Your Travel Companion"
        description="Learn about PingPe's mission to revolutionize travel experiences. Discover our story, values, and commitment to creating unforgettable adventures."
        url="https://www.jungleresortpingpe.com/about"
      />
      <Header />
      <main className="flex-1">
        <PageHero
          title="About Jungle Resort PingPe"
          subtitle="We're on a mission to make travel experiences more accessible, authentic, and unforgettable for everyone."
          backgroundImage="/demo-content/gallery-1.jpg"
          breadcrumbItems={[{ label: "About" }]}
        />

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  PingPe was born from a simple idea: travel should be more than just visiting places—it should be about creating meaningful connections and unforgettable experiences.
                </p>
                <p>
                  Founded in 2024, we started with a vision to connect travelers with authentic local experiences, unique accommodations, and seamless transportation options. Today, we're proud to serve thousands of travelers and work with hundreds of hosts and partners worldwide.
                </p>
                <p>
                  Our platform brings together stays, experiences, events, and transportation in one place, making it easier than ever to plan your perfect trip.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Community First</h3>
                <p className="text-muted-foreground">
                  We believe in building strong communities of travelers and hosts.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Authenticity</h3>
                <p className="text-muted-foreground">
                  We curate genuine experiences that reflect local culture and traditions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Sustainability</h3>
                <p className="text-muted-foreground">
                  We're committed to responsible travel that benefits local communities.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in every aspect of our service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">Our Team</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're a passionate team of travelers, technologists, and hospitality experts dedicated to transforming how people explore the world.
              </p>
              <p className="text-muted-foreground">
                From customer support to product development, every member of our team is committed to creating the best possible experience for our users.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
