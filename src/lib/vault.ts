import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();
const projectId = "shadowspark-production-489115";

let cloudSecretsPromise: Promise<void> | null = null;

function hasDatabaseSecrets(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DIRECT_URL);
}

function shouldSkipCloudSecrets(): boolean {
  return process.env.SKIP_CLOUD_SECRETS === "true";
}

async function fetchCloudSecrets(): Promise<void> {
  const [dbUrl, directUrl] = await Promise.all([
    client.accessSecretVersion({
      name: `projects/${projectId}/secrets/NEON_DATABASE_URL/versions/latest`,
    }),
    client.accessSecretVersion({
      name: `projects/${projectId}/secrets/NEON_DIRECT_URL/versions/latest`,
    }),
  ]);

  const dbPayload = dbUrl[0].payload?.data?.toString();
  const directPayload = directUrl[0].payload?.data?.toString();

  if (!dbPayload || !directPayload) {
    throw new Error("Vault did not return the required Neon database secrets.");
  }

  process.env.DATABASE_URL = dbPayload;
  process.env.DIRECT_URL = directPayload;
}

export async function loadCloudSecrets(): Promise<void> {
  if (hasDatabaseSecrets() || shouldSkipCloudSecrets()) {
    return;
  }

  if (!cloudSecretsPromise) {
    cloudSecretsPromise = fetchCloudSecrets().catch((error: unknown) => {
      cloudSecretsPromise = null;
      throw error;
    });
  }

  await cloudSecretsPromise;
}
