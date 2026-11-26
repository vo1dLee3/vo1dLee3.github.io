import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'vo1dLee3',
    description: 'vo1dLee3',
    site: context.site ?? 'https://vo1dLee3.github.io',
    customData: '<language>zh-CN</language>',
    items: posts.map((post) => {
      const extra = post.data as { description?: unknown };
      return {
        title: post.data.title,
        description: typeof extra.description === 'string' ? extra.description : undefined,
        pubDate: post.data.date,
        link: `/blog/${post.id}/`,
      };
    }),
  });
}
