import { NextResponse } from "next/server";
import { env } from "@/env";
import { paradym } from "@/lib/paradym";
import type { OpenId4VcVerificationStatus } from "@paradym/sdk";

type RouteContext = {
  params: Promise<{
    verificationId: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { verificationId } = await context.params;

  let paradymStatus: OpenId4VcVerificationStatus | undefined;
  let errorMessage: string | undefined

  try {
    const response = await paradym.openId4Vc.verification.getVerificationSession({
      path: {
        projectId: env.PARADYM_PROJECT_ID,
        openId4VcVerificationId: verificationId,
      },
    });

    paradymStatus = response.data?.status;
    if (response.data?.error?.message) {
      errorMessage = response.data.error.message;
    }
  } catch (error) {
    console.error("Error fetching verification session:", error);
  }

  return NextResponse.json({
    verificationId,
    status: paradymStatus,
    errorMessage,
  });
}
