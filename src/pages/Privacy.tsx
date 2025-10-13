import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | PingPe</title>
        <meta name="description" content="Learn how PingPe collects, uses, and protects your personal information." />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
