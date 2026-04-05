import { getAllPosts } from "@/lib/posts";
import ScrollHero from "./(component)/ScrollHero";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category as string | undefined;
  let posts = await getAllPosts();

  if (category) {
    posts = posts.filter((post) => post.category === category);
  }

  return (
    <div>
      {/* GSAP Scroll 區塊 */}
      <ScrollHero />
    </div>
  );
}
