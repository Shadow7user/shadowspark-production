import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/stats-card';
import { CourseCard } from '@/components/dashboard/course-card';
import { BookOpen, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back, <span className="gradient-text">{session.user?.name}</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Here's what's happening in your account today.
          </p>
        </div>

        {/* Stats Grid - Using StatsCard Component */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Courses"
            value="12"
            icon={<BookOpen className="h-6 w-6" />}
            trend="+3 this month"
            trendType="up"
          />

          <StatsCard
            title="In Progress"
            value="3"
            icon={<TrendingUp className="h-6 w-6" />}
            trend="+1 this week"
            trendType="up"
          />

          <StatsCard
            title="Completed"
            value="9"
            icon={<CheckCircle className="h-6 w-6" />}
            trend="+2 this week"
            trendType="up"
          />

          <StatsCard
            title="Study Hours"
            value="24"
            icon={<Clock className="h-6 w-6" />}
            trend="+5 this week"
            trendType="up"
          />
        </div>

        {/* Continue Learning Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">
              <span className="gradient-text">Continue Learning</span>
            </h2>
            <p className="text-muted-foreground mt-1">Pick up where you left off or explore new courses</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CourseCard
              title="AI Prompting Masterclass"
              description="Master the art of AI prompting with advanced techniques"
              level="Beginner"
              price={15000}
              enrolled={45}
              progress={45}
              thumbnail="https://images.unsplash.com/photo-1677442d019cecf8978f62eb248576c41?w=500&h=300&fit=crop"
              href="/dashboard/courses/ai-prompting"
            />

            <CourseCard
              title="Web Development Bootcamp"
              description="Build modern websites with Next.js and React ecosystem"
              level="Intermediate"
              price={35000}
              enrolled={28}
              progress={12}
              thumbnail="https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop"
              href="/dashboard/courses/web-development"
            />

            <CourseCard
              title="Chatbot Builder Pro"
              description="Create AI-powered chatbots with advanced conversational abilities"
              level="Advanced"
              price={50000}
              enrolled={15}
              progress={89}
              thumbnail="https://images.unsplash.com/photo-1677442d019cecf8978f62eb248576c41?w=500&h=300&fit=crop"
              href="/dashboard/courses/chatbot-builder"
            />
          </div>
        </div>

        {/* User Info Card */}
        <Card className="border-cyber-cyan/30 bg-card/40 backdrop-blur border-cyberpunk">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{session.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge className="mt-2 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50">
                  {(session.user as any)?.role || 'No role assigned'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">Tasks assigned</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">
                Active
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">{session.user?.role}</p>
            </CardContent>
          </Card>
        </div>

        {/* User Info Card */}
        <Card className="border-border/50 bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{session.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium text-foreground">{session.user?.role || 'No role assigned'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
