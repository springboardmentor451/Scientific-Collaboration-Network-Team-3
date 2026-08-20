import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  FileText,
  FlaskConical,
  Kanban,
  Network,
  Plus,
  Upload,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SectionCard, StatCard } from "@/components/scna/cards";
import { StatusBadge, toneForStatus } from "@/components/scna/status-badge";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/scna.functions";
import { Separator } from "@/components/ui/separator";
import {
  activities,
  collaborationByDomain,
  conferences,
  currentUser,
  publicationTrend,
  publications,
} from "@/lib/scna-data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SCNA Research Collaboration Overview" },
      {
        name: "description",
        content:
          "Live overview of researchers, publications, projects, conferences, institutions and active collaborations across the SCNA network.",
      },
      { property: "og:title", content: "SCNA Dashboard — Research Collaboration Overview" },
      {
        property: "og:description",
        content: "Track publication trends, co-authorship activity and upcoming conferences in one view.",
      },
    ],
  }),
  component: DashboardPage,
});

const chartTooltip = {
  contentStyle: {
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "var(--popover)",
    color: "var(--popover-foreground)",
    fontSize: "12px",
  },
} as const;

function DashboardPage() {
  const [stats, setStats] = useState({ researchers: 1443, publications: 12806, projects: 147, conferences: 62 });
  useEffect(() => { getDashboardStats().then(setStats).catch(() => undefined); }, []);
  return (
    <div className="space-y-6">
      {/* Hero welcome */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="gradient-brand pointer-events-none absolute inset-0 opacity-[0.09]" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <FlaskConical className="h-3.5 w-3.5" /> Northfield Institute of Technology
            </span>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
              Welcome back, <span className="gradient-text">{currentUser.name.split(" ")[1]}</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Your network added 34 co-authorship links and 12 publications this month. Three grant
              milestones need review before the end of the quarter.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-xl shadow-glow">
              <Link to="/researchers">
                <Plus className="mr-2 h-4 w-4" /> Add researcher
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/publications">
                <Upload className="mr-2 h-4 w-4" /> Upload publication
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/network">
                <Network className="mr-2 h-4 w-4" /> Explore network
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistic cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Researchers" value={stats.researchers.toLocaleString()} delta="Live MongoDB count" icon={Users} />
        <StatCard label="Publications" value={stats.publications.toLocaleString()} delta="Live MongoDB count" icon={FileText} tone="info" />
        <StatCard label="Projects" value={stats.projects.toLocaleString()} delta="Live MongoDB count" icon={Kanban} tone="success" />
        <StatCard label="Conferences" value={stats.conferences.toLocaleString()} delta="Live MongoDB count" icon={CalendarDays} tone="warning" />
        <StatCard label="Institutions" value="216" delta="+6 partnerships" icon={Building2} tone="info" />
        <StatCard label="Active Collaborations" value="1,284" delta="+34 links" icon={Network} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <SectionCard
          title="Publication & citation trend"
          description="Yearly output across all affiliated departments"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={publicationTrend} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="pubFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="citeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="publications"
                  name="Publications"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#pubFill)"
                />
                <Area
                  type="monotone"
                  dataKey="citations"
                  name="Citations"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  fill="url(#citeFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Collaboration by domain" description="Internal vs. external co-authorship">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collaborationByDomain} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="domain"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-18}
                  dy={10}
                  height={54}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="internal" name="Internal" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="external" name="External" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Lists */}
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Recent publications"
          action={
            <Button asChild variant="ghost" size="sm" className="rounded-lg">
              <Link to="/publications">
                View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <ul className="space-y-4">
            {publications.slice(0, 4).map((p) => (
              <li key={p.id} className="min-w-0">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {p.venue} · {p.authors.join(", ")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge label={p.status} tone={toneForStatus(p.status)} />
                  <span className="text-xs text-muted-foreground">{p.citations} citations</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Upcoming conferences"
          action={
            <Button asChild variant="ghost" size="sm" className="rounded-lg">
              <Link to="/conferences">
                Calendar <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <ul className="space-y-4">
            {conferences.map((c) => (
              <li key={c.id} className="flex min-w-0 items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  {c.acronym.slice(0, 4)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.date} · {c.location}
                  </p>
                  <StatusBadge
                    className="mt-1.5"
                    label={c.registration}
                    tone={toneForStatus(c.registration)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Latest activity" description="Across your research groups">
          <ol className="relative space-y-5 border-l border-border pl-5">
            {activities.map((a) => (
              <li key={a.id} className="relative">
                <span className="gradient-brand absolute -left-[26px] top-1.5 h-3 w-3 rounded-full ring-4 ring-card" />
                <p className="text-sm">
                  <span className="font-medium">{a.actor}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
              </li>
            ))}
          </ol>
          <Separator className="my-5" />
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link to="/reports">Open analytics report</Link>
          </Button>
        </SectionCard>
      </div>
    </div>
  );
}
