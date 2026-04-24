"use client";

import { Button } from "@/components/ui/button";
import { QrCode, ShieldCheck } from "lucide-react";

export function IssuanceCard({
  issuanceId,
  offerQrUri,
  offerUri,
}: {
  issuanceId: string;
  offerQrUri: string;
  offerUri: string;
}) {
  return (
    <>
      <div className="mt-6 w-full rounded-xl border border-border bg-card p-4">
        <div className="mx-auto w-fit rounded-lg border border-border bg-background p-2">
          <img
            src={offerQrUri}
            alt="Issuance QR code"
            className="h-56 w-56 rounded-md"
          />
        </div>

        <Button
          asChild
          variant="outline"
          className="mt-4 w-full rounded-full"
          size="lg"
        >
          <a href={offerUri}>Open in wallet app</a>
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-foreground">What happens now?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Accept the offer in your wallet to receive your PID credential.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-secondary/20 p-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <QrCode className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Issuance reference:{" "}
            <span className="font-medium text-foreground">{issuanceId}</span>
          </p>
        </div>
      </div>
    </>
  );
}
