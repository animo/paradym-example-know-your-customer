import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Lock } from "lucide-react"

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center gap-12 py-16">
          <div className="max-w-2xl text-center">
            <h1 className="text-pretty text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Banking built for the digital age
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-balance text-lg text-muted-foreground">
              Open your account in minutes with secure identity verification. No paperwork, no branch visits.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="h-12 gap-2 rounded-full px-8 text-base">
                <Link href="/verify">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Bank-grade security"
              description="Your data is protected with enterprise-level encryption"
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Instant verification"
              description="Verify your identity in under 3 minutes"
            />
            <FeatureCard
              icon={<Lock className="h-5 w-5" />}
              title="Privacy first"
              description="Share only what's needed with SD-JWT credentials"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </footer>
      </div>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
        {icon}
      </div>
      <h3 className="font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
