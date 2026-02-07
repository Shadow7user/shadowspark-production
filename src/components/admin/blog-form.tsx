"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createBlogPost, updateBlogPost } from "@/lib/actions/admin";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface BlogFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    published: boolean;
    featured: boolean;
  };
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    thumbnail: post?.thumbnail || "",
    metaTitle: post?.metaTitle || "",
    metaDescription: post?.metaDescription || "",
    published: post?.published || false,
    featured: post?.featured || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: post ? prev.slug : generateSlug(title),
      metaTitle: post ? prev.metaTitle : title,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (post) {
          await updateBlogPost(post.id, formData);
        } else {
          await createBlogPost(formData);
        }
        router.push("/admin/blog");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="post-url-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="Brief summary shown in listings..."
                  rows={3}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.excerpt.length} characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Write your post content here... (Markdown supported)"
                  rows={20}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.content.length} characters •{" "}
                  {formData.content.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Make visible to readers
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev) => ({ ...prev, published: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Show prominently on blog
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev) => ({ ...prev, featured: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Featured Image URL</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
              {formData.thumbnail && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaTitle: e.target.value,
                    }))
                  }
                  placeholder="SEO title (defaults to post title)"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  placeholder="SEO description (defaults to excerpt)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {post ? "Update Post" : "Create Post"}
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
