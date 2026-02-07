import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlogPost } from "@/lib/actions/admin";
import { BlogForm } from "@/components/admin/blog-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const post = await getBlogPost(id);
  if (!post) notFound();

  const postData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    thumbnail: post.thumbnail,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    published: post.published,
    featured: post.featured,
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <p className="text-muted-foreground">{post.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-sm rounded ${
                post.published
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </span>
            {post.featured && (
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                Featured
              </span>
            )}
          </div>
        </div>

        <BlogForm post={postData} />
      </div>
    </div>
  );
}
