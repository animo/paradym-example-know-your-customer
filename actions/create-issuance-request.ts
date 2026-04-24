"use server";

import { env } from "@/env";
import { paradym } from "@/lib/paradym";
import { ApiResponse } from "@/types/api-error";
import type { OpenId4VcIssuance } from "@paradym/sdk/build/generated/types.gen";

export async function createIssuanceRequest(): Promise<
  ApiResponse<OpenId4VcIssuance>
> {
  let response;
  try {
    response = await paradym.openId4Vc.issuance.createOffer({
      path: {
        projectId: env.PARADYM_PROJECT_ID,
      },
      body: {
        credentials: [
          {
            credentialTemplateId: env.PARADYM_CREDENTIAL_TEMPLATE_ID,
            attributes: {
              family_name: "Mustermann",
              given_name: "Erika",
              birthdate: "1964-08-12",
              place_of_birth: {
                country: "NL",
                region: "Utrecht",
                locality: "Utrecht",
              },
              nationalities: ["NL"],
              address: {
                formatted: "Rietveld 1, 90210 Utrecht",
                street_address: "Rietveld",
                house_number: "1",
                locality: "Utrecht",
                region: "Utrecht",
                postal_code: "90210",
                country: "NL",
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(
      "Error creating issuance request:",
      JSON.stringify(error, null, 2),
    );
    return {
      status: "error",
      error: {
        message: "Failed to create issuance request",
      },
    };
  }

  if (!response.data) {
    return {
      status: "error",
      error: {
        message: "Failed to create issuance request",
      },
    };
  }

  return {
    status: "success",
    data: response.data,
  };
}
