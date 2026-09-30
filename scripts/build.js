const { execSync } = require("child_process");

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/taplink?schema=public";

console.log("=== TapLink Production Build Started ===");
console.log("1. Generating Prisma client...");
try {
  execSync("npx prisma generate", { stdio: "inherit" });
} catch (err) {
  console.warn("Prisma generate warning (proceeding with fallback):", err.message);
}

console.log("2. Building Next.js application...");
execSync("npx next build", { stdio: "inherit" });
console.log("=== TapLink Production Build Complete ===");
