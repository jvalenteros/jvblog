import { getCollection, type CollectionEntry } from "astro:content";
import { slug } from "github-slugger";

const visible = ({ data }: { data: { draft: boolean } }) =>
  !(data.draft && import.meta.env.PROD);

export async function getPosts(): Promise<CollectionEntry<"posts">[]> {
  const posts = await getCollection("posts", visible);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTagMap(): Promise<
  Map<string, { tag: string; posts: CollectionEntry<"posts">[] }>
> {
  const map = new Map<string, { tag: string; posts: CollectionEntry<"posts">[] }>();
  for (const post of await getPosts()) {
    for (const tag of post.data.tags) {
      const key = slug(tag);
      if (!map.has(key)) map.set(key, { tag, posts: [] });
      map.get(key)!.posts.push(post);
    }
  }
  return map;
}

export async function getWorlds(): Promise<{
  landings: CollectionEntry<"worlds">[];
  pages: CollectionEntry<"worlds">[];
}> {
  const all = await getCollection("worlds", visible);
  return {
    landings: all.filter((e) => !e.id.includes("/")),
    pages: all.filter((e) => e.id.includes("/")),
  };
}
