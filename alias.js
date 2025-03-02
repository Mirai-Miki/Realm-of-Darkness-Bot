const moduleAlias = require("module-alias");
const path = require("path");

// Root directory is always where alias.js is located
const rootDir = __dirname;

// Check if we're running from a built distribution
const runningFromDist = process.env.NODE_ENV === "production";

// Set source directory based on environment
const srcDir = runningFromDist
  ? path.join(rootDir, "dist")
  : path.join(rootDir, "src");

moduleAlias.addAliases({
  "@root": rootDir,
  "@src": srcDir,
  "@bots": path.join(srcDir, "bots"),
  "@commands": path.join(rootDir, "commands"),
  "@components": path.join(rootDir, "components"),
  "@structures": path.join(rootDir, "structures"),
  "@events": path.join(rootDir, "events"),
  "@modules": path.join(rootDir, "modules"),
  "@errors": path.join(rootDir, "Errors"),
  "@api": path.join(rootDir, "realmAPI"),
  "@constants": path.join(rootDir, "Constants"),
});

// Debug output if needed
if (process.env.DEBUG === "true") {
  console.log("Alias paths configured:");
  console.log("  Root dir:", rootDir);
  console.log("  Src dir:", srcDir);
}
