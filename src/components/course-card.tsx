import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  enrollment?: number;
}

export function CourseCard({
  id,
  title,
  description,
  price,
  level,
  duration,
  enrollment = 0,
}: CourseCardProps) {
  const levelColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/50',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  return (
    <Card className="border-border/50 bg-background/50 backdrop-blur hover:border-cyan-500/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={`border ${levelColors[level]}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">{duration}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">${price}</p>
            <p className="text-xs text-muted-foreground">{enrollment} enrolled</p>
          </div>
          <Button size="sm" variant="outline">
            View Course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
