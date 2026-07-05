import fs from "node:fs";
import path from "node:path";

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.tsx?$/.test(ent.name)) files.push(p);
  }
  return files;
}

const root = path.join(process.cwd(), "components/templates/demos/valley-interlocking");

for (const file of walk(root)) {
  let src = fs.readFileSync(file, "utf8");
  const original = src;
  const unaryMethods = ["map", "filter", "forEach", "find", "some", "every", "flatMap"];
  for (const method of unaryMethods) {
    src = src.replace(
      new RegExp(String.raw`\.${method}\(\(([a-zA-Z_][a-zA-Z0-9_]*),\s*([a-zA-Z_][a-zA-Z0-9_]*)\)\s*=>`, "g"),
      `.${method}(($1: any, $2: any) =>`,
    );
    src = src.replace(
      new RegExp(String.raw`\.${method}\(\(([a-zA-Z_][a-zA-Z0-9_]*)\)\s*=>`, "g"),
      `.${method}(($1: any) =>`,
    );
  }
  if (src !== original) {
    fs.writeFileSync(file, src);
    console.log(path.relative(process.cwd(), file));
  }
}
