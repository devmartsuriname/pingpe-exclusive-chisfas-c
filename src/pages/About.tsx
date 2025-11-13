import SEO from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StatCard } from "@/components/about/StatCard";
import { TeamCarousel } from "@/components/about/TeamCarousel";
import { Users, Target, Heart, Award, MapPin, Calendar, Star } from "lucide-react";

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
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
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
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-4">Our Impact</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                See how we're making a difference in the travel industry and communities we serve
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <ScrollReveal direction="up" delay={0.1}>
                <StatCard
                  number={5000}
                  suffix="+"
                  label="Happy Travelers"
                  icon={Users}
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.2}>
                <StatCard
                  number={200}
                  suffix="+"
                  label="Local Partners"
                  icon={MapPin}
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.3}>
                <StatCard
                  number={50}
                  suffix="+"
                  label="Unique Experiences"
                  icon={Star}
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.4}>
                <StatCard
                  number={2024}
                  label="Founded"
                  icon={Calendar}
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                Our Values
              </h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <ScrollReveal direction="up" delay={0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Community First</h3>
                  <p className="text-muted-foreground">
                    We believe in building strong communities of travelers and hosts.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.2}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Authenticity</h3>
                  <p className="text-muted-foreground">
                    We curate genuine experiences that reflect local culture and traditions.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.3}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Sustainability</h3>
                  <p className="text-muted-foreground">
                    We're committed to responsible travel that benefits local communities.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.4}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Excellence</h3>
                  <p className="text-muted-foreground">
                    We strive for excellence in every aspect of our service.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl font-bold text-foreground mb-6">Meet Our Team</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    We're a passionate team of travelers, technologists, and hospitality experts dedicated to transforming how people explore the world.
                  </p>
                  <p className="text-muted-foreground">
                    From customer support to product development, every member of our team is committed to creating the best possible experience for our users.
                  </p>
                </div>
              </ScrollReveal>
              
              <TeamCarousel
                members={[
                  {
                    name: "Sarah Johnson",
                    role: "Founder & CEO",
                    bio: "Travel enthusiast with 15 years of experience in the hospitality industry. Passionate about connecting cultures.",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                    social: {
                      linkedin: "https://linkedin.com",
                      twitter: "https://twitter.com"
                    }
                  },
                  {
                    name: "Michael Chen",
                    role: "Head of Technology",
                    bio: "Former Silicon Valley engineer turned travel tech innovator. Building the future of travel platforms.",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                    social: {
                      linkedin: "https://linkedin.com"
                    }
                  },
                  {
                    name: "Emma Rodriguez",
                    role: "Community Director",
                    bio: "Dedicated to building meaningful connections between travelers and local communities worldwide.",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                    social: {
                      twitter: "https://twitter.com"
                    }
                  },
                  {
                    name: "David Park",
                    role: "Experience Curator",
                    bio: "World traveler who's visited 80+ countries. Curating authentic experiences that create lasting memories.",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                    social: {
                      linkedin: "https://linkedin.com"
                    }
                  },
                  {
                    name: "Lisa Anderson",
                    role: "Customer Success Lead",
                    bio: "Ensuring every traveler has an unforgettable experience from booking to journey's end.",
                    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
                    social: {
                      linkedin: "https://linkedin.com",
                      twitter: "https://twitter.com"
                    }
                  },
                  {
                    name: "James Wilson",
                    role: "Sustainability Officer",
                    bio: "Leading our commitment to responsible travel and positive impact on local communities.",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                    social: {
                      linkedin: "https://linkedin.com"
                    }
                  }
                ]}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
