import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms & Conditions | PingPe</title>
        <meta name="description" content="Read PingPe's terms and conditions. Understand your rights and responsibilities when using our travel booking platform." />
      </Helmet>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Terms & Conditions</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 2025</p>
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">By accessing and using PingPe's platform, you accept and agree to be bound by these Terms and Conditions.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
