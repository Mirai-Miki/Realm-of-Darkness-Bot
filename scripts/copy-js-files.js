const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

const sourceDir = path.resolve(__dirname, "..");
const destDir = path.resolve(__dirname, "../dist");

// Clean the dist directory first
console.log("Cleaning dist directory...");
fs.emptyDirSync(destDir);

// Copy JS files that don't have TS equivalents
console.log("Copying JS files without TS equivalents...");
glob(
  "**/*.js",
  { cwd: sourceDir, ignore: ["node_modules/**", "dist/**", "scripts/**"] },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const tsFile = file.replace(/\.js$/, ".ts");
      // Only copy if there's no TS equivalent
      if (!fs.existsSync(path.join(sourceDir, tsFile))) {
        const destFile = path.join(destDir, file);
        fs.ensureDirSync(path.dirname(destFile));
        fs.copySync(path.join(sourceDir, file), destFile);
      }
    });
    console.log("JS files copied successfully");
  }
);

// Copy package.json (needed for dependencies)
console.log("Copying package.json...");
if (fs.existsSync(path.join(sourceDir, "package.json"))) {
  fs.copySync(
    path.join(sourceDir, "package.json"),
    path.join(destDir, "package.json")
  );
}

// Copy alias.js (needed for module resolution)
if (fs.existsSync(path.join(sourceDir, "alias.js"))) {
  fs.copySync(path.join(sourceDir, "alias.js"), path.join(destDir, "alias.js"));
}

console.log("Build preparation complete!");
