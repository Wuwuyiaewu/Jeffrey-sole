import { getPost } from "@/lib/posts";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function BlogPostPage({ params, searchParams }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        <a href="/blog">← Back to Blog List</a>
      </p>

      {/* 示範讀取 searchParams */}
      {searchParams.ref && <p>Referred from: {searchParams.ref}</p>}
    </div>
  );
}
