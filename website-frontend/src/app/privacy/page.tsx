import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl md:text-2xl">Fat Cow</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: March 26, 2025</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              Fat Cow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you use our mobile application and website
              (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you
              have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            <p>We collect several types of information from and about users of our Service:</p>
            <h3 className="text-xl font-medium mt-4">Personal Information</h3>
            <p>When you register for an account, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Campus affiliation</li>
              <li>Profile picture (optional)</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">Location Information</h3>
            <p>With your permission, we collect precise location information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Show available delivery options near you</li>
              <li>Track delivery progress</li>
              <li>Provide accurate navigation for drivers</li>
              <li>Verify campus-specific deliveries</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">Transaction Information</h3>
            <p>When you place an order or make a delivery, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Order details and history</li>
              <li>Payment information (processed securely through our payment processor)</li>
              <li>Delivery addresses</li>
              <li>Delivery timestamps</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">Usage Information</h3>
            <p>We automatically collect information about your interactions with our Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address</li>
              <li>App usage statistics</li>
              <li>Log data</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process and fulfill orders</li>
              <li>Facilitate deliveries between customers and drivers</li>
              <li>Process payments</li>
              <li>Communicate with you about orders, promotions, and updates</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Protect the security and integrity of our Service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Delivery Drivers:</strong> When you place an order, we share relevant information (such as
                delivery address and order details) with the assigned driver.
              </li>
              <li>
                <strong>Customers:</strong> When you accept a delivery, we share relevant information (such as your name
                and approximate location) with the customer.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share your information with third-party vendors who provide
                services on our behalf, such as payment processing, data analysis, and customer service.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
                response to valid requests by public authorities.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal
              information. However, please be aware that no method of transmission over the internet or electronic
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Your Choices</h2>
            <p>You have several choices regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> You can review and update your account information through the app
                settings.
              </li>
              <li>
                <strong>Location Data:</strong> You can enable or disable location services through your device
                settings.
              </li>
              <li>
                <strong>Marketing Communications:</strong> You can opt out of receiving promotional emails by following
                the unsubscribe instructions in those emails.
              </li>
              <li>
                <strong>Account Deletion:</strong> You can request to delete your account by contacting our support
                team.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
              Policy periodically for any changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              Email: fatcowapp@gmail.com
              <br />
              Address: Computer Science Building (K17), Engineering Rd, UNSW Sydney, Kensington NSW 2033
            </p>
          </section>
        </div>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 Fat Cow. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="/terms"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

