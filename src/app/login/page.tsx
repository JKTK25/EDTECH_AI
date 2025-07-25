"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpenCheck, Twitter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuthToast } from "@/hooks/use-auth-toast"
import { signInWithFacebook, signInWithTwitter } from "@/lib/auth"
import { useAuth } from "@/lib/auth-context"
import { GoogleSignInButton } from "@/components/auth/google-sign-in"

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.63 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c2.25 0 3.67.92 4.48 1.69l2.52-2.52C18.48 2.44 15.98 1 12.48 1 5.88 1 1 5.88 1 12.48s4.88 11.48 11.48 11.48c3.47 0 6.28-1.18 8.35-3.35 2.13-2.2 2.72-5.23 2.72-8.35 0-.73-.06-1.42-.18-2.08H12.48z" />
    </svg>
)

const MetaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Meta</title>
        <path d="M22.09 0H1.91C.86 0 0 .86 0 1.91v20.18c0 1.05.86 1.91 1.91 1.91h20.18c1.05 0 1.91-.86 1.91-1.91V1.91C24 .86 23.14 0 22.09 0ZM15.33 8.34h-1.42c-.52 0-.89.28-.89.9v1.42h2.3l-.33 2.3H13V22h-3.13v-9.04H8.34V8.34h1.53V6.52c0-1.61 1-2.52 3.13-2.52h1.86v2.3h-1.1c-.54.02-.91.2-.91.89v1.15Z" />
    </svg>
)

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Twitter</title>
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { showAuthError, showAuthSuccess } = useAuthToast()
  const { isDemoMode, signIn, signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      showAuthSuccess("Login Successful!", "Welcome back to EdTech AI Hub.")
      
      // Add a small delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use window.location.href for immediate redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      showAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLoginSuccess = async (result: any) => {
    // The result is already a User object from auth context
    showAuthSuccess("Login Successful!", "Welcome back to EdTech AI Hub.")
    
    // Add a small delay to ensure cookies are set
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Use window.location.href for immediate redirect
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    } else {
      router.push("/dashboard");
    }
  }

  const handleGoogleLoginError = (error: Error) => {
    showAuthError(error)
  }

  const handleFacebookLogin = async () => {
    setLoading(true)
    try {
      await signInWithFacebook()
      showAuthSuccess("Login Successful!", "Welcome back to EdTech AI Hub.")
      router.push("/dashboard")
    } catch (error: any) {
      showAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTwitterLogin = async () => {
    setLoading(true)
    try {
      await signInWithTwitter()
      showAuthSuccess("Login Successful!", "Welcome back to EdTech AI Hub.")
      router.push("/dashboard")
    } catch (error: any) {
      showAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="w-full bg-blue-50 border-b border-blue-200 p-3 text-center text-sm text-blue-800">
          <strong>Demo Mode:</strong> Firebase not configured. Try: student@demo.com / password123
        </div>
      )}
      
      <main className="flex-1 flex items-center justify-center w-full px-4">
        <Card className="mx-auto max-w-sm w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <BookOpenCheck className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">EdTech AI Hub</CardTitle>
            <CardDescription>
              Enter your email to log in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
            
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            
            <div className="grid gap-3">
                {!isDemoMode && (
                  <div className="text-xs text-muted-foreground text-center mb-2">
                    Google sign-in will automatically adapt if popups are blocked
                  </div>
                )}
                
                <GoogleSignInButton
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  disabled={loading || isDemoMode}
                  className="w-full"
                />
                
                <Button 
                  variant="outline" 
                  onClick={handleTwitterLogin} 
                  disabled={loading || isDemoMode}
                  className="w-full"
                >
                    <TwitterIcon className="mr-2 h-4 w-4" />
                    Continue with Twitter
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleFacebookLogin} 
                  disabled={loading || isDemoMode}
                  className="w-full"
                >
                    <MetaIcon className="mr-2 h-4 w-4" />
                    Continue with Meta
                </Button>
            </div>
            
            {isDemoMode && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                <p className="font-medium mb-2">🚀 Demo Mode Active</p>
                <p className="mb-2">Social login is disabled. To enable:</p>
                <ol className="list-decimal list-inside text-xs space-y-1">
                  <li>Set up Firebase project</li>
                  <li>Enable Google & Twitter auth</li>
                  <li>Update environment variables</li>
                </ol>
                <p className="mt-2 text-xs">See <code>FIREBASE_AUTH_SETUP.md</code> for details.</p>
              </div>
            )}

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Developed by Kariuki James Kariuki</p>
        <p>0718845847 | jamexkarix583@gmail.com</p>
      </footer>
    </div>
  )
}
