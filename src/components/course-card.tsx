import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';

interface CourseCardProps {
  id: string;
  slug?: string;
  title: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';
  duration?: string;
  enrollment?: number;
  thumbnail?: string | null;
  // New props for AI recommendations + progress
  reason?: string | null;
  isRecommended?: boolean;
  progress?: number | null; // 0-100 if enrolled
  isEnrolled?: boolean;
}

export function CourseCard({
  id,
  slug,
  title,
  description,
  price,
  level,
  duration,
  enrollment = 0,
  thumbnail,
  reason,
  isRecommended = false,
  progress = null,
  isEnrolled = false,
}: CourseCardProps) {
  const normalizedLevel = level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' | 'professional';
  
  const levelColors: Record<string, string> = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/50',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    professional: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  const courseUrl = slug ? `/courses/${slug}` : `/courses/${id}`;
  const buttonText = isEnrolled ? 'Continue Learning' : 'View Course';

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-background/50 backdrop-blur hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
      {/* Recommended Badge */}
      {isRecommended && (
        <Badge className="absolute left-2 top-2 z-10 bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0">
          🤖 Recommended
        </Badge>
      )}

      {/* Thumbnail */}
      {thumbnail && (
        <Link href={courseUrl}>
          <div className="aspect-video relative overflow-hidden bg-muted">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </Link>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link href={courseUrl}>
              <CardTitle className="text-lg line-clamp-2 hover:text-cyan-400 transition-colors">
                {title}
              </CardTitle>
            </Link>
            
            {/* AI Reason */}
            {reason && (
              <p className="text-sm text-cyan-400/80 italic mt-2 line-clamp-2">
                &quot;{reason}&quot;
              </p>
            )}
            
            <CardDescription className="mt-1 line-clamp-2">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar (if enrolled) */}
        {isEnrolled && progress !== null && progress > 0 && (
          <ProgressBar value={progress} />
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`border ${levelColors[normalizedLevel] || levelColors.beginner}`}>
            {normalizedLevel.charAt(0).toUpperCase() + normalizedLevel.slice(1)}
          </Badge>
          {duration && <span className="text-xs text-muted-foreground">{duration}</span>}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {isEnrolled ? (
                <span className="text-cyan-400">Enrolled</span>
              ) : (
                <>₦{price.toLocaleString()}</>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{enrollment} enrolled</p>
          </div>
          <Button 
            size="sm" 
            variant={isEnrolled ? 'secondary' : 'outline'}
            className={isEnrolled ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : ''}
            asChild
          >
            <Link href={isEnrolled ? `${courseUrl}/learn` : courseUrl}>
              {buttonText}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
