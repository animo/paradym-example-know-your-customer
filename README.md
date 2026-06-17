# Banking KYC Example

This project is a simple example of how to implement KYC for a financial platform using the EUDI PID credential.

Issuance and verification are handled through the Paradym API:
- Issuance: create and issue an EUDI PID credential.
- Verification: verify that credential through a presentation flow.

You can read more about the full flow here:
https://docs.paradym.id/api-and-dashboard/example-project

## Prerequisites

- [Node.js](https://nodejs.org) (v20+ LTS recommended)
- [pnpm](https://pnpm.io)
- A Paradym account and project. Create your account [here](https://paradym.id/sign-up)

## Getting Started

1. Install dependencies:
	```bash
	pnpm install
	```

2. Copy the environment file:
	```bash
	cp .env.example .env
	```
2. Fill in the `PARADYM_API_KEY` and `PARADYM_PROJECT_ID` in the `.env` file. Follow the [Quickstart guide](https://docs.paradym.id/api-and-dashboard/quickstart#go-to-api-keys) to generate your API key, and use this guide to locate your project ID [here](https://docs.paradym.id/api-and-dashboard/interacting-with-the-api#project-scope).

3. Choose one setup path:

	A. Automatic setup (recommended):
	Run the setup script to automatically create the required templates in Paradym and populate IDs in `.env`:
	```bash
    npx tsx --env-file=.env scripts/setup.ts
    # or 
	bun scripts/setup.ts
	```

	B. Manual setup:
	Configure everything manually in the Paradym platform and add the required IDs yourself.
	Documentation:
	[KYC example](https://docs.paradym.id/api-and-dashboard/example-project)

4. Start the app:
	```bash
	pnpm dev
	```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PARADYM_API_KEY` | API key from Paradym. Use an existing key or create one in Paradym settings: https://paradym.id/app/settings/api-keys |
| `PARADYM_PROJECT_ID` | The Paradym project where credential and presentation templates are created. Copy your project ID from the dashboard. If needed, see how to find it here: https://docs.paradym.id/api-and-dashboard/interacting-with-the-api#project-scope |
| `PARADYM_PRESENTATION_TEMPLATE_ID` | Automatically populated when `scripts/setup.ts` runs. The script creates a presentation template and writes its ID to `.env`, which the app uses to create verification sessions. If you configure Paradym manually, add this value yourself. |
| `PARADYM_CREDENTIAL_TEMPLATE_ID` | Automatically populated when `scripts/setup.ts` runs. The script creates a credential template and writes its ID to `.env`, which the app uses to issue an EUDI PID credential for the verification flow. If you configure Paradym manually, add this value yourself. |
