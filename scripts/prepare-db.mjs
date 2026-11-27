import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
const dbUrl = process.env.DATABASE_URL || "";

const original = fs.readFileSync(schemaPath, "utf8");
const targetProvider =
  dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")
    ? "postgresql"
    : "sqlite";

let updated = original;
if (targetProvider === "postgresql") {
  updated = original.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
} else {
  updated = original.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
}

const providerChanged = updated !== original;
if (providerChanged) {
  fs.writeFileSync(schemaPath, updated, "utf8");
}
console.log(`[prepare-db] Prisma datasource provider = ${targetProvider}`);

const clientEngineDir = path.join(process.cwd(), "node_modules", ".prisma", "client");
const needsGenerate =
  Boolean(process.env.VERCEL) || providerChanged || !fs.existsSync(clientEngineDir);

if (needsGenerate) {
  console.log("[prepare-db] Running prisma generate...");
  execSync("npx prisma generate", { stdio: "inherit" });
} else {
  console.log("[prepare-db] Prisma client already up to date.");
}
