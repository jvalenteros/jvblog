import fs from "node:fs";
import path from "node:path";
import { slug } from "github-slugger";

/**
 * Slugify a content path the same way for collection ids, routes, and
 * wiki-link targets. Collection generateId and getPermalinks() both flow
 * through here so links and routes can never drift apart.
 */
export function slugifyPath(p: string): string {
  return p
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .map((segment) => slug(segment))
    .join("/");
}

/**
 * Walk the content vault and return the final route for every markdown
 * page. Fed to the remark wiki-link plugin so [[Page Name]] resolves to a
 * real URL at build time.
 *
 * Runs once when the Astro config loads — after creating a brand-new page,
 * restart the dev server for links *to* it to resolve.
 */
export function getPermalinks(): string[] {
  const permalinks: string[] = [];
  for (const section of ["posts", "worlds"]) {
    const dir = path.resolve("content", section);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir, { recursive: true, encoding: "utf8" });
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const rel = file.replace(/\\/g, "/").replace(/\.md$/, "");
      const route = slugifyPath(rel).replace(/\/index$/, "");
      permalinks.push(`/${section}/${route}`);
    }
  }
  return permalinks;
}
