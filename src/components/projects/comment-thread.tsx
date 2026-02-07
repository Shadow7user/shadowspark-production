'use client'

import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Trash2, Reply } from 'lucide-react'
import { addComment, deleteComment } from '@/lib/actions/project-comments'
import { format } from 'date-fns'

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
  }
  replies?: Comment[]
}

interface CommentThreadProps {
  projectId: string
  comments: Comment[]
  currentUserId: string
  currentUserRole: string
}

export function CommentThread({
  projectId,
  comments: initialComments,
  currentUserId,
  currentUserRole,
}: CommentThreadProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const isAdmin = currentUserRole === 'ADMIN'

  const handleSubmit = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const result = await addComment({
        projectId,
        content: newComment,
      })

      if (result.success && result.comment) {
        setComments([result.comment, ...comments])
        setNewComment('')
      } else {
        console.error(result.error || 'Failed to add comment')
      }
    } catch (error) {
      console.error('Failed to add comment', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      const result = await addComment({
        projectId,
        content: replyContent,
        parentId,
      })

      if (result.success && result.comment) {
        // Update the parent comment with the new reply
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? {
                  ...c,
                  replies: [...(c.replies || []), result.comment!],
                }
              : c
          )
        )
        setReplyContent('')
        setReplyTo(null)
      } else {
        console.error(result.error || 'Failed to add reply')
      }
    } catch (error) {
      console.error('Failed to add reply', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string, parentId?: string) => {
    setDeleting(commentId)
    try {
      const result = await deleteComment(commentId)

      if (result.success) {
        if (parentId) {
          // Remove reply
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? {
                    ...c,
                    replies: c.replies?.filter((r) => r.id !== commentId),
                  }
                : c
            )
          )
        } else {
          // Remove main comment
          setComments((prev) => prev.filter((c) => c.id !== commentId))
        }
      } else {
        console.error(result.error || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Failed to delete comment', error)
    } finally {
      setDeleting(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800'
      case 'STUDENT':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const CommentItem = ({
    comment,
    isReply = false,
    parentId,
  }: {
    comment: Comment
    isReply?: boolean
    parentId?: string
  }) => {
    const canDelete = isAdmin || comment.author.id === currentUserId
    const isDeleting = deleting === comment.id

    return (
      <div className={`${isReply ? 'ml-12' : ''}`}>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            {comment.author.image ? (
              <img src={comment.author.image} alt={comment.author.name || comment.author.email} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs">
                {(comment.author.name || comment.author.email)[0].toUpperCase()}
              </div>
            )}
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {comment.author.name || comment.author.email}
              </span>
              <Badge className={`${getRoleBadgeColor(comment.author.role)}`} variant="secondary">
                {comment.author.role}
              </Badge>
              <span className="text-xs text-gray-500">
                {format(new Date(comment.createdAt), 'MMM dd, yyyy h:mm a')}
              </span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            <div className="flex items-center gap-2 pt-1">
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(comment.id, parentId)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {!isReply && replyTo === comment.id && (
          <div className="ml-12 mt-3 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleReply(comment.id)}
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? 'Replying...' : 'Reply'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-semibold">Add Comment</h3>
        <Textarea
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
        />
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !newComment.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <CommentItem comment={comment} />
              {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-4 mt-4">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      isReply
                      parentId={comment.id}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
