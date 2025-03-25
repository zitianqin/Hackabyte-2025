import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-muted-foreground">Last Updated: March 26, 2025</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to Fat Cow ("we," "our," or "us"). These Terms and Conditions govern your use of the Fat Cow
              mobile application and website (collectively, the "Service"). By accessing or using our Service, you agree
              to be bound by these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Service Description</h2>
            <p>
              Fat Cow is a campus delivery platform that connects customers with delivery drivers for the purpose of
              delivering food, groceries, and other items to specific campus locations. Users can act as both customers
              and delivery drivers within the app.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p>
              To use certain features of the Service, you must register for an account. You agree to provide accurate,
              current, and complete information during the registration process and to update such information to keep
              it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your password and for all activities that occur under your account.
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Customer Terms</h2>
            <p>As a customer using Fat Cow, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate delivery location information</li>
              <li>Be available to receive your delivery</li>
              <li>Pay all applicable fees, including delivery fees, service fees, and the cost of ordered items</li>
              <li>
                Not request delivery of prohibited items, including alcohol to minors, illegal substances, or dangerous
                goods
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Driver Terms</h2>
            <p>As a delivery driver using Fat Cow, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have a valid student ID or campus access</li>
              <li>Deliver orders promptly and in good condition</li>
              <li>Maintain professional conduct during deliveries</li>
              <li>Comply with all campus regulations and local laws</li>
              <li>Not consume or tamper with customer orders</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Payments and Fees</h2>
            <p>
              Fat Cow charges fees for the use of our Service as described in the app. These may include delivery fees,
              service fees, and other applicable charges. All fees are clearly displayed before order confirmation.
            </p>
            <p>
              Drivers receive payment for completed deliveries as specified in the Driver Agreement. Payments are
              processed through our secure payment system.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Refund and Cancellation Policy</h2>
            <p>
              <strong>Order Cancellations:</strong> Customers may cancel an order at no charge before a driver accepts
              the order. Once a driver has accepted the order, a cancellation fee may apply.
            </p>
            <p>
              <strong>Refunds:</strong> If you are dissatisfied with your order, please contact our customer service
              within 24 hours. Refunds may be issued at our discretion based on the circumstances, including but not
              limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Missing items</li>
              <li>Damaged items</li>
              <li>Significant delivery delays</li>
              <li>Order quality issues</li>
            </ul>
            <p>Refunds will be processed to the original payment method used for the order.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Dispute Resolution</h2>
            <p>
              If you have a dispute with Fat Cow, please contact our customer service team first. We strive to resolve
              all issues promptly and fairly. If we cannot resolve the dispute informally, any legal action must be
              filed in accordance with the governing law section below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Fat Cow shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use or inability to use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. If we make changes, we will provide notice by posting the updated
              Terms on our website and updating the "Last Updated" date. Your continued use of the Service after any
              such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
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

