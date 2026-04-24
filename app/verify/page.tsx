import { createVerificationRequest } from "@/actions/create-verification-request";
import { Button } from "@/components/ui/button";
import { VerificationCard } from "@/components/verification-card";
import {
  ArrowLeft,
  ChevronRight,
  CircleAlert,
  HelpCircle,
  Info,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VerifyPage() {
  const verificationRequestResponse = await createVerificationRequest();

  if (verificationRequestResponse.status === "error") {
    return (
      <ConnectErrorState message={verificationRequestResponse.error.message} />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-8">
        <div className="mb-6 overflow-hidden rounded-xl border border-accent/20 bg-accent/5">
          <div className="flex items-start gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <Info className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                Credential required for verification
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                This is a demo. Please issue an EUDI PID credential first to proceed.
              </p>
              <Link
                href="/issue"
                target="_blank"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent/80"
              >
                Issue credential
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>

        <div className="flex flex-1 flex-col py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Verify with your EUDI wallet
            </h1>
            <p className="mt-2 text-muted-foreground">
              Scan the QR code to prove your issued PID and continue onboarding.
            </p>
          </div>

          <VerificationCard
            verificationId={verificationRequestResponse.data.id}
            authorizationRequestQrUri={
              verificationRequestResponse.data.authorizationRequestQrUri
            }
            authorizationRequestUri={
              verificationRequestResponse.data.authorizationRequestUri
            }
          />
        </div>
      </div>
    </main>
  );
}

function ConnectErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="relative">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <CircleAlert className="h-8 w-8 text-destructive" />
            </div>
          </div>

          <h1 className="mt-6 text-xl font-semibold text-foreground text-balance text-center">
            Something went wrong starting your verification
          </h1>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground text-balance">
            {message}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3">
            <Link href="/verify">
              <Button className="w-full gap-2 rounded-full" size="lg">
                <RefreshCcw className="h-4 w-4" />
                Try again
              </Button>
            </Link>
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 rounded-full"
              size="lg"
            >
              <Link href="/">Go back home</Link>
            </Button>
          </div>

          <button className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <HelpCircle className="h-4 w-4" />
            Need help?
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </main>
  );
}
