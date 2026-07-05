import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "app/template/demo/valley-interlocking");
const configImport =
  "import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';";

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name === "page.tsx" || ent.name === "not-found.tsx") files.push(p);
  }
  return files;
}

function ensureImport(src) {
  if (src.includes(configImport)) return src;
  if (!src.includes("viDemoPageTitle") && !src.includes("viRouteMetadata")) return src;
  return src.replace(
    /(import type \{ Metadata \} from "next";\r?\n)/,
    `$1${configImport}\r\n`,
  );
}

for (const file of walk(root).concat(path.join(root, "not-found.tsx"))) {
  let src = fs.readFileSync(file, "utf8");
  const next = ensureImport(src);
  if (next !== src) {
    fs.writeFileSync(file, next);
    console.log(`Added import: ${path.relative(process.cwd(), file)}`);
  }
}

// Fix home canonical + location page titles
const homeFile = path.join(root, "page.tsx");
let home = fs.readFileSync(homeFile, "utf8");
home = home.replace(
  /export const metadata: Metadata = viRouteMetadata\("\/"\);/,
  `export const metadata: Metadata = {\n  ...viRouteMetadata("/"),\n  alternates: { canonical: absoluteUrl("/template/demo/valley-interlocking") },\n};`,
);
if (!home.includes(configImport)) {
  home = home.replace(
    /(import type \{ Metadata \} from "next";\r?\n)/,
    `$1${configImport}\r\n`,
  );
}
fs.writeFileSync(homeFile, home);
console.log("Fixed home metadata");

const titleFixes = [
  [
    path.join(root, "valley-interlocking-landscaping-toronto/page.tsx"),
    'viDemoPageTitle("East Region Landscaping")',
  ],
  [
    path.join(root, "valley-interlocking-landscaping-edmonton/page.tsx"),
    'viDemoPageTitle("West Region Landscaping")',
  ],
];

for (const [file, titleExpr] of titleFixes) {
  let src = fs.readFileSync(file, "utf8");
  src = src.replace(/title: viDemoPageTitle\("[^"]+"\),/, `title: ${titleExpr},`);
  src = ensureImport(src);
  fs.writeFileSync(file, src);
  console.log(`Fixed ${path.relative(process.cwd(), file)}`);
}
