import { auth } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Menu, LogOut, User, BookOpen, LayoutDashboard, Settings } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { DashboardNavigation } from './navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userInitial = session.user.name?.charAt(0) ?? 'U';
  const userRole = (session.user as any)?.role ?? 'STUDENT';

  return (
    <div className="min-h-screen bg-gradient-cyberpunk text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-cyber-cyan/20 bg-card/40 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="border-b border-cyber-cyan/10 p-6">
            <Link href="/dashboard" className="flex items-center gap-3 transition-transform hover:scale-105">
              <div className="glow-cyan h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50" />
              <span className="gradient-text text-2xl font-bold">ShadowSpark</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6">
            <DashboardNavigation />
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-cyber-cyan/10 p-4">
            <div className="rounded-lg border border-cyber-cyan/20 bg-card/80 p-4 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.user.image ?? undefined}
                    alt={session.user.name ?? ''}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-xs font-bold text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">
                    {session.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="w-full justify-center border-cyber-cyan/50 text-cyber-cyan"
              >
                {userRole}
              </Badge>
            </div>
            <form
              action={async () => {
                'use server';
                const { signOut } = await import('next-auth/react');
                await signOut({ redirectTo: '/login' });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                className="mt-4 w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-cyber-cyan/20 bg-card/80 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center gap-4 px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-cyan-500/20">
                <Menu className="h-6 w-6 text-cyan-500" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-r border-cyber-cyan/20 bg-card/95 p-0 backdrop-blur-xl"
            >
              <div className="flex h-full flex-col">
                {/* Mobile Logo */}
                <div className="border-b border-cyber-cyan/10 p-6">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3"
                  >
                    <div className="glow-cyan h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500" />
                    <span className="gradient-text text-2xl font-bold">
                      ShadowSpark
                    </span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-3 py-6">
                  <DashboardNavigation />
                </nav>

                {/* Mobile User Section */}
                <div className="border-t border-cyber-cyan/10 p-4">
                  <div className="rounded-lg border border-cyber-cyan/20 bg-card/80 p-4 backdrop-blur mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={session.user.image ?? undefined}
                          alt={session.user.name ?? ''}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-xs font-bold text-white">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="w-full justify-center border-cyber-cyan/50 text-cyber-cyan"
                    >
                      {userRole}
                    </Badge>
                  </div>
                  <form
                    action={async () => {
                      'use server';
                      const { signOut } = await import('next-auth/react');
                      await signOut({ redirectTo: '/login' });
                    }}
                  >
                    <Button
                      type="submit"
                      variant="ghost"
                      className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign out
                    </Button>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-3 flex-1">
            <div className="glow-cyan h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500" />
            <span className="gradient-text text-lg font-bold">ShadowSpark</span>
          </Link>

          <Avatar className="h-9 w-9">
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name ?? ''}
            />
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-xs font-bold text-white">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="min-h-[calc(100vh-4rem)] p-4 pt-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
