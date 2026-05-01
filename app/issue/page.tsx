import { createIssuanceRequest } from "@/actions/create-issuance-request";
import { IssuanceCard } from "@/components/issuance-card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronRight,
  CircleAlert,
  HelpCircle,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function IssuePage() {
  const issuanceRequestResponse = await createIssuanceRequest();

  if (issuanceRequestResponse.status === "error") {
    return (
      <ConnectErrorState message={issuanceRequestResponse.error.message} />
    );
  }

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

        <div className="flex flex-1 flex-col py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Issue your EUDI wallet
            </h1>
            <p className="mt-2 text-muted-foreground">
              This is a demo issuance. In practice, the EUDI PID is issued by a
              government, which acts as the trusted authority during
              verification.
            </p>

            <p className="mt-4 text-muted-foreground">
              Scan the QR code to receive your PID credential in your wallet.
            </p>
          </div>

          <IssuanceCard
            issuanceId={issuanceRequestResponse.data.id}
            offerQrUri={issuanceRequestResponse.data.offerQrUri}
            offerUri={issuanceRequestResponse.data.offerUri}
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
            Something went wrong starting your issuance
          </h1>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground text-balance">
            {message}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3">
            <Link href="/issue">
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
