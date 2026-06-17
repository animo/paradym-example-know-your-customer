"use client";

import { getVerificationStatus } from "@/actions/get-verification-status";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Check,
  Circle,
  CircleAlert,
  Clock,
  Globe,
  LoaderCircle,
  MapPin,
  QrCode,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type VerificationStatus =
  | "requested"
  | "requestRetrieved"
  | "verified"
  | "failed"
  | "expired";

const POLLING_INTERVAL_MS = 8000;

export function VerificationCard({
  verificationId,
  authorizationRequestQrUri,
  authorizationRequestUri,
}: {
  verificationId: string;
  authorizationRequestQrUri: string;
  authorizationRequestUri: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("requested");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    const fetchStatus = async () => {
      try {
        const response = await getVerificationStatus(verificationId);
        if (!active || response.status === "error" || !response.data.status) {
          return;
        }

        const { status: currentStatus, errorMessage } = response.data;

        setStatus(currentStatus);
        setErrorMessage(errorMessage);

        if (currentStatus === "verified") {
          router.push("/dashboard");
          return;
        }

        if (currentStatus === "failed" || currentStatus === "expired") {
          if (timer) {
            clearInterval(timer);
          }
        }
      } catch {
        // Silent retry while polling.
      }
    };

    void fetchStatus();
    timer = setInterval(fetchStatus, POLLING_INTERVAL_MS);

    return () => {
      active = false;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [verificationId, router]);

  const statusTitle = useMemo(() => {
    if (status === "requested") return "Waiting for wallet";
    if (status === "requestRetrieved") return "Wallet connected";
    if (status === "verified") return "Identity verified";
    if (status === "expired") return "Session expired";
    return "Verification failed";
  }, [status]);

  return (
    <>
      <div className="mt-6 w-full rounded-xl border border-border bg-card p-4">
        <div className="mx-auto w-fit rounded-lg border border-border bg-background p-2">
          <img
            src={authorizationRequestQrUri}
            alt="Verification QR code"
            className="h-56 w-56 rounded-md"
          />
        </div>

        <Button
          asChild
          variant="outline"
          className="mt-4 w-full rounded-full"
          size="lg"
        >
          <a href={authorizationRequestUri}>Open in wallet app</a>
        </Button>
      </div>

      <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
        {status === "requested" && (
          <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {status === "requestRetrieved" && (
          <Clock className="h-4 w-4 text-accent" />
        )}
        {status === "verified" && <Check className="h-4 w-4 text-accent" />}
        {status === "failed" && (
          <CircleAlert className="h-4 w-4 text-destructive" />
        )}
        {status === "expired" && (
          <CircleAlert className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-medium text-foreground">{statusTitle}</span>
      </div>

      {(status === "expired" || status === "failed") && (
        <Button
          className="mt-4 w-full rounded-full"
          size="lg"
          onClick={() => window.location.assign("/verify")}
        >
          Start new verification
        </Button>
      )}

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium text-foreground">
          Information to be shared
        </h3>
        <div className="space-y-2">
          <ClaimItem icon={<User className="h-4 w-4" />} label="Full name" />
          <ClaimItem
            icon={<Calendar className="h-4 w-4" />}
            label="Date of birth"
          />
          <ClaimItem icon={<Globe className="h-4 w-4" />} label="Nationality" />
          <ClaimItem icon={<MapPin className="h-4 w-4" />} label="Address" />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-foreground">
              What happens now?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              We are polling the session and update this screen
              when your wallet retrieves, verifies, or fails the session.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-secondary/20 p-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <QrCode className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Verification reference:{" "}
            <span className="font-medium text-foreground">
              {verificationId}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

function ClaimItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        {icon}
      </div>
      <span className="text-sm text-foreground">{label}</span>
      <Circle className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
    </div>
  );
}
