"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBlogPost, toggleBlogPublished } from "@/lib/actions/admin";
import {
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface BlogPostActionsProps {
  post: {
    id: string;
    slug: string;
    published: boolean;
  };
}

export function BlogPostActions({ post }: BlogPostActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTogglePublished = () => {
    startTransition(async () => {
      await toggleBlogPublished(post.id);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    startTransition(async () => {
      await deleteBlogPost(post.id);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/blog/${post.id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </DropdownMenuItem>
        {post.published && (
          <DropdownMenuItem asChild>
            <Link href={`/blog/${post.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleTogglePublished}>
          {post.published ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Publish
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
