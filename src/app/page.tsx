"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpenCheck, GraduationCap, Brain, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user, loading, isDemoMode } = useAuth()
  const router = useRouter()
  const [forceShowPage, setForceShowPage] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Force demo mode detection based on environment variable
  const isDemo = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                 process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here";

  // EMERGENCY: Force page to show after 3 seconds no matter what
  useEffect(() => {
    const emergencyOverride = setTimeout(() => {
      console.log('EMERGENCY: Forcing page to show after 3 seconds');
      setForceShowPage(true);
    }, 3000);

    return () => clearTimeout(emergencyOverride);
  }, []);

  useEffect(() => {
    // Mark auth as checked after initial load
    if (!loading) {
      setAuthChecked(true);
    }
  }, [loading]);

  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (authChecked && user) {
      console.log('Redirecting authenticated user to dashboard:', user.email);
      router.push("/dashboard");
    }
  }, [user, authChecked, router])

  // Show loading while checking authentication - BUT force show page if emergency override
  const shouldShowLoading = loading && !forceShowPage && !authChecked;

  console.log('HomePage render:', { 
    loading, 
    forceShowPage,
    authChecked,
    isDemoMode, 
    isDemo, 
    shouldShowLoading, 
    user: user?.email,
    envKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  });

  // Show loading while checking authentication
  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <BookOpenCheck className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Loading...</p>
            <p className="text-sm text-muted-foreground">Please wait while we prepare your experience</p>
          </div>
        </div>
      </div>
    )
  }

  // Show landing page if user is not authenticated
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpenCheck className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">EdTech AI Hub</span>
          </div>
          <div className="space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Learning with{" "}
              <span className="text-primary">AI-Powered Education</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover personalized learning paths, AI tutoring, and smart study tools 
              designed to help you excel in your educational journey.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EdTech AI Hub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>AI-Powered Learning</CardTitle>
                <CardDescription>
                  Personalized learning paths and AI tutoring tailored to your needs
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Expert Content</CardTitle>
                <CardDescription>
                  Comprehensive study materials and exam preparation tools
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Community Learning</CardTitle>
                <CardDescription>
                  Connect with tutors and join study groups for collaborative learning
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already transforming their education with AI.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Create Your Account</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Developed by Kariuki James Kariuki</p>
          <p>0718845847 | jamexkarix583@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}
