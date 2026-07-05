import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "app/template/demo/valley-interlocking");
const configImport =
  "import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';";

const routeMetadataFiles = new Map([
  [path.join(root, "page.tsx"), "/"],
  [path.join(root, "about-valley-interlock/page.tsx"), "/about-valley-interlock"],
  [path.join(root, "contact-valley-interlock/page.tsx"), "/contact-valley-interlock"],
  [path.join(root, "the-team/page.tsx"), "/the-team"],
  [path.join(root, "our-services/page.tsx"), "/our-services"],
  [path.join(root, "our-work-valley-interlock/page.tsx"), "/our-work-valley-interlock"],
  [path.join(root, "resources/page.tsx"), "/resources"],
]);

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name === "page.tsx") files.push(p);
  }
  return files;
}

function ensureImport(src) {
  if (src.includes(configImport)) return src;
  return src.replace(/(import type \{ Metadata \} from "next";\n)/, `$1${configImport}\n`);
}

const files = [...walk(root), path.join(root, "not-found.tsx")];

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("Valley Interlocking")) continue;

  src = src.replace(
    /title: `\$\{([^}]+)\.title\} \| Valley Interlocking & Landscaping \(demo\)`,/g,
    "title: viDemoPageTitle($1.title),",
  );
  src = src.replace(
    /title: "([^"]+) \| Valley Interlocking & Landscaping \(demo\)",/g,
    'title: viDemoPageTitle("$1"),',
  );
  src = src.replace(
    /description: "Meet the certified craftspeople and designers behind Valley Interlocking & Landscaping in Toronto and Edmonton.",/,
    'description: viRouteMetadata("/the-team").description,',
  );

  const route = routeMetadataFiles.get(file);
  if (route) {
    src = src.replace(
      /export const metadata: Metadata = \{[\s\S]*?\};/,
      `export const metadata: Metadata = viRouteMetadata("${route}");`,
    );
  }

  if (src.includes("viDemoPageTitle") || src.includes("viRouteMetadata")) {
    src = ensureImport(src);
  }

  fs.writeFileSync(file, src);
  console.log(`Updated ${path.relative(process.cwd(), file)}`);
}
