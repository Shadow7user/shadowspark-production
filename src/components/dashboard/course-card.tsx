import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';

type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface CourseCardProps {
  title: string;
  description: string;
  level: CourseLevel;
  price: number;
  enrolled: number;
  progress?: number;
  thumbnail: string;
  href: string;
}

export function CourseCard({
  title,
  description,
  level,
  price,
  enrolled,
  progress,
  thumbnail,
  href,
}: CourseCardProps) {
  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/50';
    }
  };

  const formattedPrice = `₦${price.toLocaleString('en-NG')}`;

  return (
    <Card className="border-cyber-cyan/30 bg-card/40 backdrop-blur border-cyberpunk overflow-hidden group hover:border-cyber-cyan/60 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${getLevelColor(level)} border font-medium`}>
            {level}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold line-clamp-2 text-foreground">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>

        {/* Price and Enrolled */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-cyber-cyan">{formattedPrice}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{enrolled} students</span>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-semibold text-cyber-cyan">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Button */}
        <Link href={href} className="block">
          <Button
            className="w-full bg-cyber-cyan hover:bg-cyber-cyan/80 text-background font-medium transition-all"
            variant="default"
          >
            {progress !== undefined ? 'Continue' : 'Enroll Now'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
