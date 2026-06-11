import rss from "@astrojs/rss";
import { getPosts } from "../lib/collections";

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: "Johann Valenteros",
    description: "Thoughts and worldbuilding by Johann Valenteros.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
    })),
  });
}
