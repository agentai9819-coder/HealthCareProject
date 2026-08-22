const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=================================================================");
console.log("🔐 VERIDIAN CARE — CREDENTIAL & SECRET AUDIT SCANNER");
console.log("=================================================================\n");

const ROOT_DIR = path.resolve(__dirname, "..");
const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  ".turbo",
  ".system_generated",
  "coverage",
  ".git",
  ".pnpm-store",
  "scratch",
]);

const SECRET_PATTERNS = [
  {
    name: "AWS Access Key ID",
    regex: /AKIA[0-9A-Z]{16}/,
  },
  {
    name: "Stripe Secret Key",
    regex: /(?:sk|rk)_live_[0-9a-zA-Z]{24,}/,
  },
  {
    name: "Private Cryptographic Key",
    regex: /-----BEGIN (?:RSA|EC|DSA|OPENSSH|PGP)?\s*PRIVATE KEY-----/,
  },
  {
    name: "Hardcoded Database Password in Code",
    regex: /postgres(?:ql)?:\/\/[a-zA-Z0-9_-]+:(?!postgres|password)[a-zA-Z0-9_\-!@#$%^&*]+@/i,
    exemptFiles: [".env.example"],
  },
  {
    name: "JWT Secret / Token Assignment",
    regex: /(?:jwt_secret|jwtSecret|api_key|apiKey|auth_token|authToken)\s*[:=]\s*["'][a-zA-Z0-9_\-]{20,}["']/,
    exemptFiles: [".env.example"],
  },
];

const BANNED_EXTENSIONS = [
  ".pem",
  ".key",
  ".cert",
  ".pfx",
  ".p12",
  ".id_rsa",
  ".id_ed25519",
  ".secret",
];

let scannedFiles = 0;
const violations = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanDirectory(fullPath);
      }
      continue;
    }

    scannedFiles++;

    // 1. Check for banned secret file extensions
    for (const ext of BANNED_EXTENSIONS) {
      if (entry.name.endsWith(ext)) {
        violations.push({
          file: relativePath,
          rule: "Banned Secret File Extension",
          details: `File with sensitive extension '${ext}' must not exist in repository: ${relativePath}`,
        });
      }
    }

    // Only scan text source/config files for pattern contents
    const textExtensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".env", ".yml", ".yaml", ".sql"];
    const isTextFile = textExtensions.some((ext) => entry.name.endsWith(ext));

    if (!isTextFile) continue;

    const content = fs.readFileSync(fullPath, "utf8");

    // 2. Check for secret patterns in file content
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.exemptFiles && pattern.exemptFiles.some((ef) => relativePath.endsWith(ef))) {
        continue;
      }

      if (pattern.regex.test(content)) {
        // Exclude the scanner script itself from regex matching
        if (relativePath === "scripts/secret-scanner.js") continue;

        violations.push({
          file: relativePath,
          rule: pattern.name,
          details: `Potential hardcoded secret detected matching rule: ${pattern.name}`,
        });
      }
    }

    // 3. Frontend Secret Isolation Check (apps/web/src must contain zero server secrets)
    if (relativePath.startsWith("apps/web/src/")) {
      const serverSecrets = [
        "SESSION_SECRET",
        "DATABASE_URL",
        "BCRYPT_SALT_ROUNDS",
        "process.env.PGUSER",
        "process.env.PGPASSWORD",
      ];

      for (const secret of serverSecrets) {
        if (content.includes(secret)) {
          violations.push({
            file: relativePath,
            rule: "Frontend Server Secret Leakage",
            details: `Frontend file references forbidden server-side variable '${secret}': ${relativePath}`,
          });
        }
      }
    }
  }
}

scanDirectory(ROOT_DIR);

console.log(`🔎 Scanned ${scannedFiles} files across the repository.`);

if (violations.length > 0) {
  console.error(`\n❌ Found ${violations.length} credential/secret security violations:\n`);
  for (const v of violations) {
    console.error(`  - [${v.rule}] ${v.file}: ${v.details}`);
  }
  process.exit(1);
} else {
  console.log("✔ Zero hardcoded credentials or private keys detected.");
  console.log("✔ Frontend (apps/web/src) is 100% isolated from server secrets.");
  console.log("✔ Zero forbidden secret/key files present in repository.");
  console.log("\n✅ Credential & Secret Audit Passed Successfully!\n");
}
