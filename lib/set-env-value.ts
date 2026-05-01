import { readFile, writeFile } from "node:fs/promises";

export async function setEnvValue(name: string, value: string) {
  const envPath = ".env";
  const line = `${name}=${value}`;

  let content = "";

  try {
    content = await readFile(envPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escapedName}=.*$`, "m");
  const updated = regex.test(content)
    ? content.replace(regex, line)
    : `${content}${content && !content.endsWith("\n") ? "\n" : ""}${line}\n`;

  await writeFile(envPath, updated, "utf8");

  return { name, value };
}