"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment, deleteComment } from "@/lib/actions/project-comments";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Reply, Send, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: Date;
  replies?: Comment[];
}

interface CommentThreadProps {
  projectId: string;
  comments: Comment[];
  currentUserId: string;
  currentUserRole: string;
}

export function CommentThread({
  projectId,
  comments,
  currentUserId,
  currentUserRole,
}: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (parentId?: string) => {
    const content = parentId ? replyText : newComment;
    if (!content.trim()) return;

    startTransition(async () => {
      await addComment({ projectId, content, parentId });
      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
    });
  };

  const handleDelete = (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    startTransition(async () => {
      await deleteComment(commentId);
    });
  };

  const canDelete = (authorId: string) =>
    authorId === currentUserId || currentUserRole === "ADMIN";

  const roleBadgeColor: Record<string, string> = {
    ADMIN: "bg-primary/20 text-primary",
    CUSTOMER: "bg-blue-500/20 text-blue-400",
    STUDENT: "bg-purple-500/20 text-purple-400",
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-8 mt-3" : "mt-4"}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.author.image ?? undefined} />
          <AvatarFallback className="text-xs">
            {comment.author.name?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">
              {comment.author.name ?? "Anonymous"}
            </span>
            <Badge
              className={`text-[10px] ${roleBadgeColor[comment.author.role] ?? ""}`}
            >
              {comment.author.role}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-2 mt-1">
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
              >
                <Reply className="h-3 w-3 mr-1" /> Reply
              </Button>
            )}
            {canDelete(comment.author.id) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-destructive hover:text-destructive"
                onClick={() => handleDelete(comment.id)}
                disabled={isPending}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="flex gap-2 mt-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="text-sm min-h-[60px]"
              />
              <Button
                size="icon"
                onClick={() => handleSubmit(comment.id)}
                disabled={isPending || !replyText.trim()}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {comment.replies?.map((reply) => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* New comment form */}
      <div className="flex gap-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px]"
        />
        <Button
          onClick={() => handleSubmit()}
          disabled={isPending || !newComment.trim()}
          className="shrink-0"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Comments list */}
      <div className="divide-y divide-border">
        {comments.map((comment) => renderComment(comment))}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No comments yet
          </p>
        )}
      </div>
    </div>
  );
}
