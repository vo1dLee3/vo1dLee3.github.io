/** Obsidian extras: ==highlight==, %%comments%%, #tags, ![[wikilink]] images, callouts. */
export function remarkObsidian() {
  return (tree) => walk(tree);
}

function walk(node) {
  if (!node?.children) return;
  if (node.type === "code" || node.type === "inlineCode") return;

  if (node.type === "blockquote") {
    const callout = asCallout(node);
    if (callout) {
      node.children.forEach(walk);
      return;
    }
  }

  const next = [];
  for (const child of node.children) {
    if (child.type === "text") {
      const parts = splitText(child.value);
      if (parts) {
        next.push(...parts);
        continue;
      }
    }
    walk(child);
    next.push(child);
  }
  node.children = next.filter((child) => {
    if (child.type === "paragraph" && (!child.children || child.children.length === 0)) return false;
    if (child.type === "text" && child.value === "") return false;
    return true;
  });
}

function asCallout(blockquote) {
  const first = blockquote.children[0];
  if (!first || first.type !== "paragraph" || !first.children?.length) return false;
  const text = first.children[0];
  if (text.type !== "text") return false;
  const match = text.value.match(/^\[!([A-Za-z][\w-]*)\]([+-])?(?:[ \t]*([^\n]*))?/);
  if (!match) return false;

  const type = match[1].toLowerCase();
  const flag = match[2] || "";
  const title = (match[3] || type).trim();
  const label = title.charAt(0).toUpperCase() + title.slice(1);
  const rest = text.value.slice(match[0].length).replace(/^\r?\n/, "");
  if (rest) text.value = rest;
  else first.children.shift();
  while (first.children[0]?.type === "break") first.children.shift();
  if (first.children.length === 0) blockquote.children.shift();

  const folded = flag === "-" || flag === "+";
  const props = { class: `callout callout-${type}` };
  if (flag === "+") props.open = true;
  blockquote.data = { hName: folded ? "details" : "aside", hProperties: props };
  blockquote.children.unshift({
    type: "paragraph",
    data: { hName: folded ? "summary" : "p", hProperties: { class: "callout-title" } },
    children: [{ type: "text", value: label }],
  });
  return true;
}

function splitText(value) {
  const re = /%%[\s\S]*?%%|==([^=\n]+)==|!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|(^|[^\S\n])#([\p{L}\p{N}_][\p{L}\p{N}_/-]*)/gu;
  if (!re.test(value)) return null;
  re.lastIndex = 0;
  const nodes = [];
  let last = 0;
  for (const match of value.matchAll(re)) {
    if (match.index > last) nodes.push(text(value.slice(last, match.index)));
    if (match[0].startsWith("%%")) {
      /* hidden comment */
    } else if (match[0].startsWith("==")) {
      nodes.push({
        type: "mark",
        data: { hName: "mark" },
        children: [text(match[1])],
      });
    } else if (match[0].startsWith("![[")) {
      const target = match[2].trim();
      const url = /^(https?:|\/)/.test(target) ? target : `./${target}`;
      nodes.push({ type: "image", url, alt: (match[3] || target).trim() });
    } else {
      if (match[4]) nodes.push(text(match[4]));
      nodes.push({
        type: "tag",
        data: { hName: "span", hProperties: { class: "tag" } },
        children: [text(`#${match[5]}`)],
      });
    }
    last = match.index + match[0].length;
  }
  if (last < value.length) nodes.push(text(value.slice(last)));
  return nodes;
}

function text(value) {
  return { type: "text", value };
}
