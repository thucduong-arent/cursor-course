'use client'

import Link from "next/link"
import Image from "next/image"
import { Github, BarChart3, GitPullRequest, Star, GitBranch, ArrowRight, Menu } from "lucide-react"
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { Button } from "@/components/ui/button"
import SignInButton from "./components/SignInButton"
import ApiDemo from "./components/api-demo"

export default function LandingPage() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="text-lg md:text-xl font-bold">Thuc Github Analyzer</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Navigation */}
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

          <div className="hidden md:flex items-center gap-4">
            <SignInButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container px-4 py-4 space-y-4">
              <nav className="flex flex-col gap-4">
                <Link 
                  href="#features" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  href="#pricing" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
              </nav>
              <div className="pt-4 border-t">
                <SignInButton />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-12 lg:py-24 xl:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
                    Unlock the Power of GitHub Repositories
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-base md:text-lg lg:text-xl">
                    Get valuable insights, summaries, and analytics on any open source GitHub repository. Track stars,
                    pull requests, and version updates.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto gap-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg rounded-xl transition-transform hover:scale-105 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-yellow-500"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Link href="#features" className="w-full sm:w-auto">
                    <Button
                      size='lg'
                      variant='outline'
                      className='w-full sm:w-auto border-yellow-500 text-yellow-600 bg-white/80 rounded-xl hover:bg-yellow-50 hover:border-yellow-600 focus-visible:ring-2 focus-visible:ring-yellow-500'
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full">
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
        <section id="features" className="w-full bg-muted py-8 md:py-12 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">Powerful Features</h2>
                <p className="max-w-[900px] text-muted-foreground text-base md:text-lg lg:text-xl">
                  Everything you need to understand and track GitHub repositories
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* API Demo Section */}
        <section id="api-demo" className="w-full py-8 md:py-12 lg:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">Try Our API</h2>
                <p className="max-w-[900px] text-muted-foreground text-base md:text-lg lg:text-xl">
                  Experience the power of our GitHub Analyzer API with this interactive demo
                </p>
              </div>
            </div>
            <ApiDemo />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-8 md:py-12 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground text-base md:text-lg lg:text-xl">
                  Get started with Thuc Github Analyzer in just a few simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
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
        <section id="pricing" className="w-full bg-muted py-8 md:py-12 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">Pricing Plans</h2>
                <p className="max-w-[900px] text-muted-foreground text-base md:text-lg lg:text-xl">
                  Choose the perfect plan for your needs
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
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
                    <span>Limit to 200 requests</span>
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
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-lg relative">
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md">
                  Coming Soon
                </div>
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
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
              {/* Team Tier */}
              <div className="flex flex-col rounded-lg border bg-background p-6 relative">
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md">
                  Coming Soon
                </div>
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
                </ul>
                <div className="mt-6">
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
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
                  <Link href="/auth/signin">
                    <Button size="lg" className="w-full">
                      Sign Up Now
                    </Button>
                  </Link>
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
