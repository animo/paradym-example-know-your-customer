import { setEnvValue } from "@/lib/set-env-value";
import { Paradym, type SdJwtCredentialTemplateAttributes } from "@paradym/sdk";

const PRESENTATION_TEMPLATE_NAME = "Verify EUDI PID (Banking Example)";
const TRUSTED_ENTITY_NAME = "Utopia Government";
const CREDENTIAL_TEMPLATE_NAME = `EUDI PID (${TRUSTED_ENTITY_NAME})`;
const EUDI_PID_CREDENTIAL = {
  format: "sd-jwt-vc" as const,
  name: CREDENTIAL_TEMPLATE_NAME,
  description: "Compliant with EU Digital Identity",
  type: "urn:eudi:pid:1",
  background: {
    color: "#607d99",
  },
  attributes: {
    family_name: {
      type: "string",
      name: "Family Name",
      description: "Current last name(s) or surname(s) of the user",
      required: true,
      alwaysDisclosed: false,
    },
    given_name: {
      type: "string",
      name: "Given Name",
      description:
        "Current first name(s), including middle name(s) where applicable",
      required: true,
      alwaysDisclosed: false,
    },
    birthdate: {
      type: "date",
      name: "Birth Date",
      description: "Date of birth in ISO 8601-1 YYYY-MM-DD format",
      required: true,
      alwaysDisclosed: false,
    },
    place_of_birth: {
      type: "object",
      name: "Place of Birth",
      description: "Country, region, or locality where the user was born",
      required: true,
      alwaysDisclosed: false,
      properties: {
        country: {
          type: "string",
          name: "Birth Country",
          description: "Alpha-2 country code as specified in ISO 3166-1",
          required: false,
          alwaysDisclosed: false,
        },
        region: {
          type: "string",
          name: "Birth Region",
          description: "State, province, district, or local area",
          required: false,
          alwaysDisclosed: false,
        },
        locality: {
          type: "string",
          name: "Birth Locality",
          description: "Municipality, city, town, or village",
          required: false,
          alwaysDisclosed: false,
        },
      },
    },
    nationalities: {
      type: "array",
      name: "Nationalities",
      description: "One or more Alpha-2 country codes representing nationality",
      required: true,
      alwaysDisclosed: false,
      items: {
        type: "string",
      },
    },
    address: {
      type: "object",
      name: "Resident Address",
      description: "Address where the user currently resides",
      required: false,
      alwaysDisclosed: false,
      properties: {
        formatted: {
          type: "string",
          name: "Full Address",
          description: "Complete formatted address",
          required: false,
          alwaysDisclosed: false,
        },
        street_address: {
          type: "string",
          name: "Street Address",
          description: "Street name where the user resides",
          required: false,
          alwaysDisclosed: false,
        },
        house_number: {
          type: "string",
          name: "House Number",
          description: "House number including any affix or suffix",
          required: false,
          alwaysDisclosed: false,
        },
        locality: {
          type: "string",
          name: "City",
          description: "Municipality, city, town, or village",
          required: false,
          alwaysDisclosed: false,
        },
        region: {
          type: "string",
          name: "State/Region",
          description: "State, province, district, or local area",
          required: false,
          alwaysDisclosed: false,
        },
        postal_code: {
          type: "string",
          name: "Postal Code",
          description: "Postal code of residence",
          required: false,
          alwaysDisclosed: false,
        },
        country: {
          type: "string",
          name: "Country",
          description: "Alpha-2 country code as specified in ISO 3166-1",
          required: false,
          alwaysDisclosed: false,
        },
      },
    },
  } satisfies SdJwtCredentialTemplateAttributes,
};

const EUDI_PID_PRESENTATION_CREDENTIAL = {
  format: 'sd-jwt-vc' as const,
  name: PRESENTATION_TEMPLATE_NAME,
  description: EUDI_PID_CREDENTIAL.type,
  type: 'urn:eudi:pid:1',

  attributes: {
    family_name: {
      type: "string",
    },
    given_name: {
      type: "string",
    },
    birthdate: {
      type: "date",
    },
    place_of_birth: {
      type: "object",
      properties: {
        country: {
          type: "string",
        },
        region: {
          type: "string",
        },
        locality: {
          type: "string",
        },
      },
    },
    nationalities: {
      type: "array",
      items: {
        type: "string",
      },
    },
    address: {
      type: "object",
      properties: {
        formatted: {
          type: "string",
        },
        street_address: {
          type: "string",
        },
        house_number: {
          type: "string",
        },
        locality: {
          type: "string",
        },
        region: {
          type: "string",
        },
        postal_code: {
          type: "string",
        },
        country: {
          type: "string",
        },
      },
    },
  } satisfies SdJwtCredentialTemplateAttributes
}




const paradym = new Paradym({
  apiKey: process.env.PARADYM_API_KEY!,

});

const PARADYM_PROJECT_ID = process.env.PARADYM_PROJECT_ID as string;
const PARADYM_API_KEY = process.env.PARADYM_API_KEY as string;

if (!PARADYM_PROJECT_ID) {
  throw new Error("Missing required environment variable: PARADYM_PROJECT_ID");
}

if (!PARADYM_API_KEY) {
  throw new Error("Missing required environment variable: PARADYM_API_KEY");
}

async function setup() {
  await getOrCreateVerifierCertificate();
  const certificate = await getOrCreateIssuerCertificate();

  const credentialTemplate = await getOrCreateCredentialTemplate();

  const trustedEntity = await getOrCreateTrustedEntity(certificate);

  const presentationTemplate = await getOrCreatePresentationTemplate(
    trustedEntity.id,
  );

  // Save the IDs of the created or existing templates to the .env file for use in the application.
  await setEnvValue(
    "PARADYM_PRESENTATION_TEMPLATE_ID",
    presentationTemplate.id,
  );
  await setEnvValue("PARADYM_CREDENTIAL_TEMPLATE_ID", credentialTemplate.id);
}

async function getOrCreateIssuerCertificate() {
  const certificateList = await paradym.certificates.getAllCertificates({
    path: { projectId: PARADYM_PROJECT_ID },
    query: {
      "page[size]": 1,
      "filter[keyType]": "P-256",
      "filter[type]": "issuerRoot",
      "filter[status]": "active",
    }
  });

  const existingCertificate = certificateList.data.data[0];
  if (existingCertificate) {
    console.info("Using existing issuer certificate. Skipping creation.");
    return existingCertificate.certificate;
  }

  try {
    const certificate = await paradym.certificates.createCertificate({
      path: { projectId: PARADYM_PROJECT_ID },
      body: {
        type: "issuerRoot",
        keyType: "P-256",
        countryName: "NL",
        commonName: TRUSTED_ENTITY_NAME,
        issuerAlternativeNameUrl: "https://example.com",
      },
    });

    console.info("Created issuer certificate");
    return certificate.data.certificate;
  } catch (error) {
    const maybeError = error as {
      message?: string;
      statusCode?: number;
      response?: { data?: { code?: number; message?: string } };
    };
    const isConflict =
      maybeError.statusCode === 409 ||
      maybeError.response?.data?.code === 2005 ||
      maybeError.message?.toLowerCase().includes("conflict");

    if (!isConflict) {
      throw error;
    }

    const refreshedCertificateList =
      await paradym.certificates.getAllCertificates({
        path: { projectId: PARADYM_PROJECT_ID },
      });

    const conflictedExistingCertificate =
      refreshedCertificateList.data.data.find(
        (certificate) =>
          certificate.type === "issuerRoot" &&
          certificate.keyType === "P-256" &&
          Boolean(certificate.certificate),
      );

    if (!conflictedExistingCertificate?.certificate) {
      throw error;
    }

    return conflictedExistingCertificate.certificate;
  }
}

async function getOrCreateVerifierCertificate() {
  const certificateList = await paradym.certificates.getAllCertificates({
    path: { projectId: PARADYM_PROJECT_ID },
    query: {
      "page[size]": 1,
      "filter[keyType]": "P-256",
      "filter[type]": "verifierRoot",
      "filter[status]": "active",
    }
  });

  const existing = certificateList.data.data[0];
  if (existing) {
    console.info("Using existing verifier certificate. Skipping creation.");
    return existing;
  }

  const certificate = await paradym.certificates.createCertificate({
    path: { projectId: PARADYM_PROJECT_ID },
    body: {
      type: "verifierRoot",
      keyType: "P-256",
      countryName: "NL",
      issuerAlternativeNameUrl: "https://example.com",
    },
  });

  console.info("Created verifier certificate");
  return certificate.data;
}

async function getOrCreateCredentialTemplate() {
  const credentialTemplateList =
    await paradym.templates.credentials.sdJwtVc.getAllCredentialTemplates({
      path: { projectId: PARADYM_PROJECT_ID },
      query: {
        "search[name]": CREDENTIAL_TEMPLATE_NAME,
        "page[size]": 1
      }
    });

  const existingTemplate = credentialTemplateList.data.data[0];
  if (existingTemplate) {
    console.info("Using existing credential template. Skipping creation.");
    return existingTemplate;
  }

  const { format, ...rest } = EUDI_PID_CREDENTIAL;

  const credentialTemplate =
    await paradym.templates.credentials.sdJwtVc.createCredentialTemplate({
      body: {
        ...rest,
        name: CREDENTIAL_TEMPLATE_NAME,
        issuer: { signer: "certificate", keyType: "P-256" },
        validUntil: {
          start: "issuance",
          future: {
            years: 1,
          },
        },
      },
      path: { projectId: PARADYM_PROJECT_ID },
    });

  console.info("Created credential template");
  return credentialTemplate.data;
}

async function getOrCreateTrustedEntity(certificate: string) {
  const trustedEntityList = await paradym.trustedEntities.getAllTrustedEntities(
    {
      path: { projectId: PARADYM_PROJECT_ID },
      query: {
        "search[name]": TRUSTED_ENTITY_NAME,
        "page[size]": 1
      }
    },
  );

  const existingTrustedEntity = trustedEntityList.data.data[0]; 
  const hasCertificate = existingTrustedEntity?.certificates.some(
    (cert) => cert.certificate === certificate,
  );

  if (existingTrustedEntity) {
    console.info("Using existing trusted entity. Skipping creation.");
    if (!hasCertificate) {
      console.info(
        `Adding certificate to existing trusted entity "${TRUSTED_ENTITY_NAME}"...`,
      );
      const updated = await paradym.trustedEntities.updateTrustedEntity({
        path: {
          projectId: PARADYM_PROJECT_ID,
          trustedEntityId: existingTrustedEntity.id,
        },
        body: {
          name: TRUSTED_ENTITY_NAME,
          certificates: [
            ...existingTrustedEntity.certificates,
            { certificate },
          ],
        },
      });
      return updated.data;
    }
    return existingTrustedEntity;
  }

  const response = await paradym.trustedEntities.createTrustedEntity({
    body: {
      name: TRUSTED_ENTITY_NAME,
      certificates: [
        {
          certificate,
        },
      ],
    },
    path: { projectId: PARADYM_PROJECT_ID },
  });

  console.info("Created trusted entity");
  return response.data;
}

async function getOrCreatePresentationTemplate(trustedIssuerId: string) {
  const presentationTemplates =
    await paradym.templates.presentations.getAllPresentationTemplates({
      path: { projectId: PARADYM_PROJECT_ID },
      query: {
        "search[name]": PRESENTATION_TEMPLATE_NAME,
        "page[size]": 1
      }
    });

  const existingTemplate = presentationTemplates.data.data[0]
  if (existingTemplate) {
    console.info("Using existing presentation template. Skipping creation.");
    return existingTemplate;
  }

  const presentationTemplate =
    await paradym.templates.presentations.createPresentationTemplate({
      body: {
        name: PRESENTATION_TEMPLATE_NAME,
        description:
          "Verify that the user has an EUDI PID credential issued by the trusted entity",
        credentials: [
          {
            trustedIssuers: [trustedIssuerId],
            ...EUDI_PID_PRESENTATION_CREDENTIAL,
          },
        ],
        verifier: {
          signer: "certificate",
          keyType: "P-256",
        },
      },
      path: { projectId: PARADYM_PROJECT_ID },
    });

  console.info("Created presentation template");
  return presentationTemplate.data;
}

setup().catch((error) => {
  console.error("Error during setup:");
  console.dir(error, {depth: null});
  process.exit(1);
});
