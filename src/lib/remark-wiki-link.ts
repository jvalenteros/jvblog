import { slug } from "github-slugger";
import { slugifyPath } from "./wiki";
import { withBase } from "./site";

interface Options {
  permalinks: string[];
}

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  url?: string;
  data?: { hProperties?: Record<string, unknown> };
}

// [[Target]], [[Target|alias]], [[Target#Heading]], ![[embed]]
const PATTERN = /!?\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

/**
 * Obsidian-style wiki links. CommonMark leaves [[...]] as literal text
 * (undefined link references fall back to text), so we rewrite text nodes
 * into link nodes, resolving targets against the permalink map from
 * getPermalinks(). Unresolved links get class "internal new".
 */
export default function remarkWikiLink(options: Options) {
  const permalinks = options?.permalinks ?? [];

  function resolve(target: string): { url: string; exists: boolean } {
    const hashIndex = target.indexOf("#");
    const path = hashIndex === -1 ? target : target.slice(0, hashIndex);
    const heading = hashIndex === -1 ? "" : target.slice(hashIndex + 1);
    const anchor = heading ? `#${slug(heading)}` : "";
    if (!path) return { url: anchor, exists: true }; // same-page heading link
    const candidate = slugifyPath(path);
    const match = permalinks.find(
      (p) => p === `/${candidate}` || p.endsWith(`/${candidate}`),
    );
    return { url: withBase(match ?? `/${candidate}`) + anchor, exists: !!match };
  }

  function split(value: string): MdNode[] {
    const nodes: MdNode[] = [];
    let last = 0;
    for (const m of value.matchAll(PATTERN)) {
      const [raw, target, alias] = m;
      if (m.index > last) {
        nodes.push({ type: "text", value: value.slice(last, m.index) });
      }
      const trimmed = target.trim();
      const { url, exists } = resolve(trimmed);
      const hashIndex = trimmed.indexOf("#");
      const display =
        alias?.trim() ??
        (hashIndex === 0
          ? trimmed.slice(1)
          : hashIndex === -1
            ? trimmed
            : trimmed.slice(0, hashIndex));
      nodes.push({
        type: "link",
        url,
        data: {
          hProperties: {
            className: exists ? ["internal"] : ["internal", "new"],
          },
        },
        children: [{ type: "text", value: display }],
      });
      last = m.index + raw.length;
    }
    if (last < value.length) {
      nodes.push({ type: "text", value: value.slice(last) });
    }
    return nodes;
  }

  function walk(node: MdNode): void {
    if (!node.children) return;
    const out: MdNode[] = [];
    for (const child of node.children) {
      if (child.type === "text" && child.value?.includes("[[")) {
        out.push(...split(child.value));
      } else {
        walk(child);
        out.push(child);
      }
    }
    node.children = out;
  }

  return (tree: MdNode) => walk(tree);
}
