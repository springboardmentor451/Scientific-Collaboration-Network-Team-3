import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  FileText,
  FlaskConical,
  Kanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Network,
  PieChart,
  Search,
  Settings,
  Sun,
  UserCircle,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { currentUser, notifications } from "@/lib/scna-data";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/researchers", label: "Researchers", icon: Users },
  { to: "/publications", label: "Publications", icon: FileText },
  { to: "/network", label: "Collaboration Network", icon: Network },
  { to: "/projects", label: "Projects", icon: Kanban },
  { to: "/conferences", label: "Conferences", icon: CalendarDays },
  { to: "/reports", label: "Reports & Analytics", icon: PieChart },
  { to: "/settings", label: "Profile & Settings", icon: Settings },
] as const;

function BrandMark({ collapsed }: { collapsed: boolean }) {
  return (
    <Link to="/dashboard" className="flex min-w-0 items-center gap-3 px-1">
      <span className="gradient-brand grid h-10 w-10 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-glow">
        <FlaskConical className="h-5 w-5" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-bold leading-tight">SCNA</span>
          <span className="block truncate text-[11px] text-muted-foreground">
            Collaboration Analyzer
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            {active && (
              <span className="gradient-brand absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full" />
            )}
            <item.icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle?: (() => void) | undefined;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between gap-2">
        <BrandMark collapsed={collapsed} />
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label="Toggle sidebar"
            className="hidden shrink-0 lg:inline-flex"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      <NavList collapsed={collapsed} onNavigate={onNavigate} />

      <div className="mt-auto pt-6">
        {!collapsed && (
          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-semibold">Network health</p>
            <p className="mt-1 text-xs text-muted-foreground">
              1,284 active co-author links across 6 institutions.
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="gradient-brand h-full w-[76%] rounded-full" />
            </div>
          </div>
        )}
        <Link
          to="/"
          className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && "Sign out"}
        </Link>
      </div>
    </div>
  );
}

/** Fixed collapsible sidebar + sticky glass navbar shell. */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Ambient background wash */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="grid-lines absolute inset-0 opacity-40" />
        <div className="absolute -left-32 top-[-10%] h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[-8%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-primary-glow/15 blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar/85 backdrop-blur-xl transition-[width] duration-300 lg:block",
          collapsed ? "w-[86px]" : "w-[272px]",
        )}
      >
        <SidebarInner collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </aside>

      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[86px]" : "lg:pl-[272px]")}>
        {/* Sticky top navbar */}
        <header className="glass sticky top-0 z-30 border-b border-border/70">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <SidebarInner collapsed={false} onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search researchers, publications, institutions…"
                className="h-10 w-full rounded-xl border-border/70 bg-background/60 pl-9"
                aria-label="Global search"
              />
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2.5">
                      <span className="text-sm font-medium">{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.body}</span>
                      <span className="text-[11px] text-muted-foreground/80">{n.time} ago</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors hover:bg-accent">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="gradient-brand text-xs font-semibold text-primary-foreground">
                        {currentUser.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden min-w-0 text-left md:block">
                      <span className="block truncate text-sm font-medium">{currentUser.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {currentUser.role}
                      </span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <UserCircle className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/">
                      <LogOut className="mr-2 h-4 w-4" /> Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
