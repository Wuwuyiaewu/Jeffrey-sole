export type Post = {
  slug: string;
  title: string;
  content: string;
  category?: string; // 可以加上分類，用於篩選
};

const posts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    content: "This is the first post.",
    category: "general",
  },
  {
    slug: "nextjs-15",
    title: "Next.js 15",
    content: "Dynamic routing in Next.js 15.",
    category: "tech",
  },
  {
    slug: "typescript",
    title: "TypeScript Basics",
    content: "Learn TypeScript in 5 minutes.",
    category: "tech",
  },
];

export async function getPost(slug: string): Promise<Post | null> {
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getAllPosts(): Promise<Post[]> {
  return posts;
}
