/**
 * Post URL slug, and how Markdown images are referenced.
 *
 * Import `slug` from this file. The public URL of a note is `/blog/${slug(path)}/`.
 * `path` is the note path relative to `src/content/blog/` (an Obsidian wikilink
 * target, with or without a `.md` extension). This function is also the content
 * collection entry id, so routes and synced links stay the same.
 *
 * `slug(relativePath)` applies these steps in order:
 * 1. Convert `\` to `/`, then strip one leading `./`.
 * 2. If the path ends with `.md`, `.mdx`, or `.markdown` (any case), remove that extension.
 * 3. Split on `/` and drop empty segments (leading, trailing, or repeated slashes).
 * 4. In each segment, replace every ASCII space (U+0020) with `-`.
 *    Do not trim, lowercase, collapse hyphens, percent-encode, or transliterate.
 *    Chinese and every other character stay as written. Tabs, ideographic spaces
 *    (U+3000), and other whitespace are not spaces here and are left unchanged.
 * 5. Join the segments with `/`.
 * 6. Do not Unicode-normalize. NFC and NFD are different inputs and stay different.
 *    Do not percent-decode; pass the raw path string, not a URL-encoded one.
 *
 * Examples:
 *   hello-world.md     → hello-world       → /blog/hello-world/
 *   notes/my post.md   → notes/my-post     → /blog/notes/my-post/
 *   日记/你好 世界.md   → 日记/你好-世界     → /blog/日记/你好-世界/
 *   日记/你好 世界      → 日记/你好-世界     → /blog/日记/你好-世界/
 *   folder/a  b.md     → folder/a--b       → /blog/folder/a--b/
 *   Hello World.md     → Hello-World       → /blog/Hello-World/
 *
 * Images in Markdown:
 * - Relative paths are resolved from the Markdown file and processed by Astro.
 *   Keep the file under `src/` (next to the post, or in a parent folder):
 *     ![alt](./attachments/foo.png)
 *     ![alt](../attachments/foo.png)
 * - A path that starts with `/` is a file in `public/` and is copied unchanged:
 *     ![alt](/images/foo.png)   →  public/images/foo.png
 * - A bare filename (`foo.png`) or a `src/` filesystem path is not a valid reference.
 */
export function slug(relativePath: string): string {
  if (typeof relativePath !== 'string') {
    throw new TypeError('slug() expects a string path');
  }

  let path = relativePath.replace(/\\/g, '/');
  if (path.startsWith('./')) path = path.slice(2);
  path = path.replace(/\.(md|mdx|markdown)$/i, '');

  return path
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.replaceAll(' ', '-'))
    .join('/');
}
