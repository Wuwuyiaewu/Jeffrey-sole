import { getPost } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const post = await getPost(slug);

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
      {resolvedSearchParams.ref && <p>Referred from: {resolvedSearchParams.ref}</p>}
    </div>
  );
}
