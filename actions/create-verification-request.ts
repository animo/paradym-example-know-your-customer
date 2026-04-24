"use server";

import { env } from "@/env";
import { paradym } from "@/lib/paradym";
import { ApiResponse } from "@/types/api-error";
import type { OpenId4VcVerification } from "@paradym/sdk/build/generated/types.gen";

export async function createVerificationRequest(): Promise<
  ApiResponse<OpenId4VcVerification>
> {
  let response;
  try {
    response = await paradym.openId4Vc.verification.createRequest({
      path: {
        projectId: env.PARADYM_PROJECT_ID,
      },
      body: {
        presentationTemplateId: env.PARADYM_PRESENTATION_TEMPLATE_ID,
      },
    });
  } catch (error) {
    console.error("Error creating verification request:", error);
    return {
      status: "error",
      error: {
        message: "Failed to create verification request",
      },
    };
  }

  if (!response.data) {
    return {
      status: "error",
      error: {
        message: "Failed to create verification request",
      },
    };
  }

  return {
    status: "success",
    data: response.data,
  };
}
