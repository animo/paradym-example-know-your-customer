"use server";

import { env } from "@/env";
import { paradym } from "@/lib/paradym";
import { ApiResponse } from "@/types/api-error";
import type { OpenId4VcVerificationStatus } from "@paradym/sdk";

export type VerificationStatusResult = {
  verificationId: string;
  status?: OpenId4VcVerificationStatus;
  errorMessage?: string;
};

export async function getVerificationStatus(
  verificationId: string,
): Promise<ApiResponse<VerificationStatusResult>> {
  let response;
  try {
    response = await paradym.openId4Vc.verification.getVerificationSession({
      path: {
        projectId: env.PARADYM_PROJECT_ID,
        openId4VcVerificationId: verificationId,
      },
    });
  } catch (error) {
    console.error("Error fetching verification session:", error);
    return {
      status: "error",
      error: {
        message: "Failed to fetch verification session",
      },
    };
  }

  return {
    status: "success",
    data: {
      verificationId,
      status: response.data?.status,
      errorMessage: response.data?.error?.message,
    },
  };
}
