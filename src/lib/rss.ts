import type { BlogPost } from "@/src/types/blog";

interface RssFeedSource {
  label: string;
  url: string;
}

const FEED_SOURCES: RssFeedSource[] = [
  {
    label: "Zen Habits",
    url: "https://zenhabits.net/feed/",
  },
  {
    label: "Lifehack",
    url: "https://www.lifehack.org/feed/",
  },
  {
    label: "Mindful",
    url: "https://www.mindful.org/feed/",
  },
];

const RELEVANCE_KEYWORDS = [
  "study",
  "studying",
  "focus",
  "focused",
  "focuses",
  "break",
  "breaks",
  "meditation",
  "mindful",
  "mindfulness",
  "productivity",
  "procrastination",
  "deep work",
  "time management",
  "reset",
  "rest",
  "revision",
];

const TOPIC_LABELS: { label: string; keywords: string[] }[] = [
  {
    label: "Focus",
    keywords: ["focus", "focused", "deep work"],
  },
  {
    label: "Breaks",
    keywords: ["break", "breaks", "rest", "reset"],
  },
  {
    label: "Meditation",
    keywords: ["meditation", "mindful", "mindfulness"],
  },
  {
    label: "Study",
    keywords: ["study", "studying", "revision"],
  },
  {
    label: "Productivity",
    keywords: ["productivity", "time management", "procrastination"],
  },
];

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function htmlToText(value: string): string {
  const withoutCdataMarkers = value
    .replace(/<!\[CDATA\[/gi, "")
    .replace(/\]\]>/g, "");

  const withBreaks = withoutCdataMarkers
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n\n")
    .replace(/<\s*\/div\s*>/gi, "\n")
    .replace(/<\s*\/li\s*>/gi, "\n");

  const stripped = withBreaks.replace(/<[^>]+>/g, " ");
  const decoded = decodeXmlEntities(stripped).replace(/\r/g, "");

  return decoded
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n\n");
}

function extractTagContent(xml: string, tagName: string): string {
  const tagPattern = new RegExp(
    `<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`,
    "i",
  );
  const match = xml.match(tagPattern);

  return match?.[1]?.trim() ?? "";
}

function extractNamespacedContent(xml: string, tagName: string): string {
  const namespacedPattern = new RegExp(
    `<(?:[a-z]+:)?${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[a-z]+:)?${tagName}>`,
    "i",
  );
  const match = xml.match(namespacedPattern);

  return match?.[1]?.trim() ?? "";
}

function extractLink(xml: string): string {
  const link = extractTagContent(xml, "link");

  if (link.length > 0) {
    return decodeXmlEntities(link);
  }

  const guid = extractTagContent(xml, "guid");
  return decodeXmlEntities(guid);
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 220));

  return `${minutes} min read`;
}

function toIsoDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(0).toISOString();
  }

  return parsedDate.toISOString();
}

function takePreview(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }

  return `${text.slice(0, length).trimEnd()}...`;
}

function getRelevanceScore(text: string): number {
  const lowerText = text.toLowerCase();

  return RELEVANCE_KEYWORDS.reduce((score, keyword) => {
    return lowerText.includes(keyword) ? score + 1 : score;
  }, 0);
}

function getTopicLabel(text: string): string {
  const lowerText = text.toLowerCase();

  for (const topic of TOPIC_LABELS) {
    if (topic.keywords.some((keyword) => lowerText.includes(keyword))) {
      return topic.label;
    }
  }

  return "Study";
}

function buildBlogPost(
  source: RssFeedSource,
  itemXml: string,
  index: number,
): BlogPost | null {
  const title = htmlToText(extractTagContent(itemXml, "title"));
  const link = extractLink(itemXml);
  const description = htmlToText(extractTagContent(itemXml, "description"));
  const content = htmlToText(
    extractNamespacedContent(itemXml, "encoded") ||
      extractNamespacedContent(itemXml, "content"),
  );
  const body = content.length > 0 ? content : description;
  const excerptSource = body.replace(/\s+/g, " ");
  const excerpt = takePreview(
    excerptSource.length > 0 ? excerptSource : description,
    180,
  );
  const publishedAt = toIsoDate(extractTagContent(itemXml, "pubDate"));
  const id =
    decodeXmlEntities(extractTagContent(itemXml, "guid")) ||
    link ||
    `${source.url}-${index}`;

  if (title.length === 0 || link.length === 0) {
    return null;
  }

  const relevanceScore = getRelevanceScore(
    `${title} ${excerpt} ${body} ${source.label}`,
  );

  if (relevanceScore === 0) {
    return null;
  }

  return {
    id,
    title,
    topic: getTopicLabel(`${title} ${excerpt} ${body}`),
    excerpt:
      excerpt.length > 0
        ? excerpt
        : "Read the full post for the complete breakdown.",
    content: body.length > 0 ? body : description,
    link,
    source: source.label,
    publishedAt,
    readTime: estimateReadTime(body.length > 0 ? body : description),
  };
}

function parseFeedPosts(xml: string, source: RssFeedSource): BlogPost[] {
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return itemMatches
    .map((itemXml, index) => buildBlogPost(source, itemXml, index))
    .filter((post): post is BlogPost => post !== null);
}

function dedupeAndSortPosts(posts: BlogPost[]): BlogPost[] {
  const seenLinks = new Set<string>();

  return posts
    .filter((post) => {
      if (seenLinks.has(post.link)) {
        return false;
      }

      seenLinks.add(post.link);
      return true;
    })
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime(),
    );
}

export async function fetchRssStudyPosts(
  refreshSeed = 0,
  signal?: AbortSignal,
): Promise<BlogPost[]> {
  const settledPosts = await Promise.allSettled(
    FEED_SOURCES.map(async (source) => {
      const feedUrl = new URL(source.url);
      feedUrl.searchParams.set("_ts", `${Date.now()}`);
      feedUrl.searchParams.set("seed", `${refreshSeed}`);

      const response = await fetch(feedUrl.toString(), { signal });

      if (!response.ok) {
        throw new Error(`Failed to load ${source.label} (${response.status})`);
      }

      const xml = await response.text();
      const feedPosts = parseFeedPosts(xml, source);

      if (feedPosts.length === 0) {
        throw new Error(`${source.label} did not return any posts.`);
      }

      return feedPosts.slice(0, 8);
    }),
  );

  const posts = settledPosts.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  if (posts.length === 0) {
    throw new Error("We couldn't load any study blogs right now.");
  }

  const sortedPosts = dedupeAndSortPosts(posts);

  if (sortedPosts.length <= 6) {
    return sortedPosts;
  }

  const startIndex = refreshSeed % sortedPosts.length;
  const selectedPosts = sortedPosts
    .slice(startIndex, startIndex + 6)
    .concat(sortedPosts.slice(0, Math.max(0, startIndex + 6 - sortedPosts.length)));

  return selectedPosts.slice(0, 6);
}
