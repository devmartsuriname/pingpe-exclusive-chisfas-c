import SEO from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Privacy Policy | PingPe"
        description="Learn how PingPe collects, uses, and protects your personal information."
        url="https://www.jungleresortpingpe.com/privacy"
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
