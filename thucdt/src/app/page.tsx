'use client'

import Link from "next/link"
import Image from "next/image"
import { Github, BarChart3, GitPullRequest, Star, GitBranch, ArrowRight } from "lucide-react"
import { useSession } from 'next-auth/react'

import { Button } from "@/components/ui/button"
import SignInButton from "./components/SignInButton"

export default function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="text-xl font-bold">Thuc Github Analyzer</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <SignInButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock the Power of GitHub Repositories
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Get valuable insights, summaries, and analytics on any open source GitHub repository. Track stars,
                    pull requests, and version updates.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {session ? (
                    <Link href="/dashboards">
                      <Button size="lg" className="gap-1.5">
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/signin">
                      <Button size="lg" className="gap-1.5">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px]">
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    alt="GitHub Repository Analytics Dashboard"
                    fill
                    className="rounded-lg object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Everything you need to understand and track GitHub repositories
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Repository Insights</h3>
                <p className="text-center text-muted-foreground">
                  Get comprehensive summaries and analytics on any GitHub repository
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Star Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Monitor star growth and trends over time with detailed charts
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <GitPullRequest className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">PR Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Track important pull requests and their impact on the repository
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Version Updates</h3>
                <p className="text-center text-muted-foreground">
                  Stay informed about new releases and version changes
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Cool Facts</h3>
                <p className="text-center text-muted-foreground">
                  Discover interesting facts and statistics about repositories
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Custom Reports</h3>
                <p className="text-center text-muted-foreground">
                  Generate custom reports tailored to your specific needs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Get started with Thuc Github Analyzer in just a few simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="text-center text-muted-foreground">
                  Create your account and choose a plan that fits your needs
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Add Repositories</h3>
                <p className="text-center text-muted-foreground">
                  Enter the GitHub repositories you want to analyze and track
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Get Insights</h3>
                <p className="text-center text-muted-foreground">
                  Access detailed analytics, summaries, and reports on your dashboard
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pricing Plans</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">Choose the perfect plan for your needs</p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              {/* Free Tier */}
              <div className="flex flex-col rounded-lg border bg-background p-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-muted-foreground">Perfect for getting started</p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $0
                  <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>5 repositories</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Daily updates</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/signup">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
              {/* Pro Tier */}
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-lg">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">For individual developers</p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $19
                  <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>25 repositories</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Hourly updates</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Custom reports</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/signup">
                    <Button className="w-full">Subscribe</Button>
                  </Link>
                </div>
              </div>
              {/* Team Tier */}
              <div className="flex flex-col rounded-lg border bg-background p-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Team</h3>
                  <p className="text-muted-foreground">For development teams</p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $49
                  <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Unlimited repositories</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Premium analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Real-time updates</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>API access</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/signup">
                    <Button className="w-full">Contact Sales</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Sign up today and start analyzing your favorite GitHub repositories
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  {session ? (
                    <Link href="/dashboards">
                      <Button size="lg" className="w-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/signin">
                      <Button size="lg" className="w-full">
                        Sign Up Now
                      </Button>
                    </Link>
                  )}
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="text-lg font-bold">Thuc Github Analyzer</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Thuc Github Analyzer. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
