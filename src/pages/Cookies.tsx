import { Helmet } from "react-helmet";

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - Jungle Resort PingPe</title>
        <meta name="description" content="Cookie usage policy and tracking information for Jungle Resort PingPe website." />
      </Helmet>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
              <p className="mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Session management</li>
                <li>Authentication and security</li>
                <li>Load balancing</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Functional Cookies</h3>
              <p className="mb-4">
                These cookies allow us to remember your preferences and provide enhanced features.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Language preferences</li>
                <li>Theme selection (dark/light mode)</li>
                <li>Cookie consent preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Analytics Cookies</h3>
              <p className="mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Page views and navigation patterns</li>
                <li>Time spent on pages</li>
                <li>Error messages</li>
                <li>Device and browser information</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Marketing Cookies</h3>
              <p className="mb-4">
                These cookies track your activity across websites to deliver targeted advertising.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ad personalization</li>
                <li>Campaign effectiveness</li>
                <li>Social media integration</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
              <p className="mb-4">
                We may use third-party services that also set cookies on your device:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>Google Analytics:</strong> For website analytics (if implemented)</li>
                <li><strong>Social Media Platforms:</strong> For social sharing features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
              <p className="mb-4">
                You can control and manage cookies in several ways:
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Browser Settings</h3>
              <p className="mb-4">
                Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>View what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Cookie Consent Banner</h3>
              <p className="mb-4">
                When you first visit our website, you'll see a cookie consent banner where you can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accept all cookies</li>
                <li>Decline non-essential cookies</li>
                <li>Customize your preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Impact of Disabling Cookies</h2>
              <p className="mb-4">
                If you disable cookies, some features of our website may not work properly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may not be able to complete bookings</li>
                <li>Your preferences won't be saved</li>
                <li>Some pages may not display correctly</li>
                <li>You'll need to log in repeatedly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookie Duration</h2>
              <p className="mb-4">Cookies can be:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology or legislation. Please check this page regularly for updates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us at:
                <br />
                Email: privacy@jungleresortpingpe.com
                <br />
                Phone: +597 123-4567
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
