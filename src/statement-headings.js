// Stable, unique anchors, including repeated headings in Markdown content.
export function statementHeadings(markdown) {
  const used = new Map();
  return markdown.split('\n').flatMap((line, index) => {
    const match = /^(#{2,3}) (.+)$/.exec(line);
    if (!match) return [];
    const title = match[2];
    const anchorTitle = title === 'II. Preserving safety through continual updates' ? 'II. Safety-preserving learning and feedback' : title;
    const slug = anchorTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const count = (used.get(slug) || 0) + 1;
    used.set(slug, count);
    return [{ title, level: match[1].length, line: index + 1, id: count === 1 ? slug : `${slug}-${count}` }];
  });
}
