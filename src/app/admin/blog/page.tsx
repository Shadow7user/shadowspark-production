import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBlogPosts } from "@/lib/actions/admin";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BlogPostActions } from "./blog-actions";

export default async function AdminBlogPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const posts = await getBlogPosts();

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground">
              {posts.length} posts • {publishedCount} published • {draftCount}{" "}
              drafts
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            + New Post
          </Link>
        </div>

        <div className="grid gap-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No blog posts yet</p>
                <Link
                  href="/admin/blog/new"
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  Create your first post
                </Link>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="hover:border-primary/50 transition"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        /blog/{post.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                      {post.featured && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground space-x-4">
                      <span>By {post.author.name || post.author.email}</span>
                      <span>
                        {post.publishedAt
                          ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                          : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                      </span>
                    </div>
                    <BlogPostActions post={post} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
