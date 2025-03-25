import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Package, Users, Truck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl md:text-2xl">Fat Cow</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Pricing
              </Link>
              <Link
                href="/terms"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Terms
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Campus Delivery, Simplified
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Fat Cow delivers directly to specific campus rooms where normal delivery apps can't go. Be a
                    customer or a delivery driver—all in one app.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[300px] rounded-xl bg-muted/30 border flex items-center justify-center md:h-[450px] md:w-[400px]">
                  <div className="text-center p-6">
                    <Truck className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-medium mb-2">Fat Cow Delivery</h3>
                    <p className="text-muted-foreground">
                      Campus-specific delivery service that goes where others can't
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Fat Cow makes campus deliveries easier for everyone
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <MapPin className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Precise Room Delivery</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Get deliveries directly to your dorm room, library study spot, or any campus location
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Dual Roles</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Switch between being a customer and a delivery driver with a single tap
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Package className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Real-time Tracking</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Follow your order in real-time with accurate indoor campus mapping
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple steps to get started with Fat Cow
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">For Customers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">Download & Sign Up</h4>
                      <p className="text-sm text-muted-foreground">Create your account with your campus email</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">Place Your Order</h4>
                      <p className="text-sm text-muted-foreground">Select items from campus restaurants or stores</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">Specify Your Location</h4>
                      <p className="text-sm text-muted-foreground">Enter your exact campus building and room number</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      4
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">Receive Your Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Track in real-time and get your items delivered to your door
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">For Delivery Drivers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">Switch to Driver Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Toggle to driver mode in the app when you're ready to deliver
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">Accept Delivery Requests</h4>
                      <p className="text-sm text-muted-foreground">Choose orders that fit your schedule and location</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">Pick Up & Deliver</h4>
                      <p className="text-sm text-muted-foreground">
                        Follow in-app navigation to pick up and deliver orders
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      4
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">Get Paid</h4>
                      <p className="text-sm text-muted-foreground">Earn money with each completed delivery plus tips</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple and transparent pricing for all users
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <h3 className="text-2xl font-bold">For Customers</h3>
                <ul className="space-y-2 text-center">
                  <li>
                    <span className="font-semibold">Base Delivery Fee:</span> $2.99
                  </li>
                  <li>
                    <span className="font-semibold">Service Fee:</span> 10% of order total
                  </li>
                  <li>
                    <span className="font-semibold">Tipping:</span> Optional but encouraged
                  </li>
                  <li>
                    <span className="font-semibold">Minimum Order:</span> $5.00
                  </li>
                </ul>
                <Button asChild className="mt-4">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <h3 className="text-2xl font-bold">For Drivers</h3>
                <ul className="space-y-2 text-center">
                  <li>
                    <span className="font-semibold">Base Pay:</span> $2.50 per delivery
                  </li>
                  <li>
                    <span className="font-semibold">Distance Bonus:</span> $0.30 per 0.1 mile
                  </li>
                  <li>
                    <span className="font-semibold">Tips:</span> 100% of customer tips
                  </li>
                  <li>
                    <span className="font-semibold">Peak Hours Bonus:</span> Up to 1.5x base pay
                  </li>
                </ul>
                <Button asChild className="mt-4">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Download the Fat Cow app today and revolutionize your campus delivery experience
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/terms">Our Terms</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
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

