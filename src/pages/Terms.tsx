import { Helmet } from "react-helmet";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Jungle Resort PingPe</title>
        <meta name="description" content="Terms and conditions for booking and using Jungle Resort PingPe services in Upper Suriname." />
      </Helmet>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Jungle Resort PingPe booking platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Booking and Reservations</h2>
              <p className="mb-4">
                All bookings made through our platform are subject to availability and confirmation. We reserve the right to decline any booking at our discretion.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Booking confirmation is sent via email upon successful reservation</li>
                <li>Full payment or deposit may be required to secure your booking</li>
                <li>Prices are subject to change without notice until booking is confirmed</li>
                <li>All guests must provide valid identification upon arrival</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Cancellation Policy</h2>
              <p className="mb-4">
                Cancellation policies vary by accommodation type and season:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>30+ days before arrival:</strong> Full refund minus processing fees</li>
                <li><strong>15-29 days before arrival:</strong> 50% refund</li>
                <li><strong>Less than 15 days:</strong> No refund</li>
                <li>Special packages may have different cancellation terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Guest Responsibilities</h2>
              <p className="mb-4">As a guest, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respect the natural environment and local communities</li>
                <li>Follow all safety guidelines provided by staff</li>
                <li>Not engage in illegal activities on the premises</li>
                <li>Be responsible for any damage caused during your stay</li>
                <li>Comply with local laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Liability and Insurance</h2>
              <p>
                Jungle Resort PingPe is not liable for loss, theft, or damage to personal belongings. We strongly recommend purchasing comprehensive travel insurance. Adventure activities carry inherent risks, and participation is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Force Majeure</h2>
              <p>
                We are not responsible for failure to perform our obligations due to circumstances beyond our control, including but not limited to natural disasters, weather conditions, government restrictions, or other force majeure events.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Modifications to Service</h2>
              <p>
                We reserve the right to modify or discontinue services, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
              <p>
              For questions about these Terms of Service, please contact us at:
                <br />
                Email: info@jungleresortpingpe.com
                <br />
                Phone: +597 8858525
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
