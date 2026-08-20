import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, FileDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/page-header";
import { SectionCard, StatCard } from "@/components/scna/cards";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collaborationByDomain, fundingSplit, institutions, publicationTrend } from "@/lib/scna-data";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — SCNA" },
      {
        name: "description",
        content:
          "Publication trends, citation growth, funding mix and institution-wise research statistics with PDF and Excel export.",
      },
      { property: "og:title", content: "Reports & Analytics — SCNA" },
      {
        property: "og:description",
        content: "Institution-level research analytics for publications, citations and collaboration intensity.",
      },
    ],
  }),
  component: ReportsPage,
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

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insights"
        title="Reports & Analytics"
        description="Longitudinal research performance across departments, institutions and funding sources."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => window.print()}>
              <FileDown className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button className="rounded-xl shadow-glow" onClick={() => {
              const rows = institutions.map((i) => [i.name, i.country, i.researchers, i.jointPublications, i.activeProjects]);
              const csv = [["Institution","Country","Researchers","Joint publications","Active projects"], ...rows].map((r) => r.map((v) => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "scna-institution-report.csv"; a.click(); URL.revokeObjectURL(url);
            }}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Citations (12 mo)" value="9,830" delta="+18.4% YoY" icon={TrendingUp} />
        <StatCard label="Avg. h-index" value="31.6" delta="+2.1" icon={TrendingUp} tone="info" />
        <StatCard label="Open access rate" value="64%" delta="+7 pts" icon={TrendingUp} tone="success" />
        <StatCard label="Intl. co-authorship" value="48%" delta="+3 pts" icon={TrendingUp} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Publication trends" description="Output and citation accrual by year">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={publicationTrend} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="publications"
                  name="Publications"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="citations"
                  name="Citations"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Funding mix" description="Share of active research funding">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={104}
                  paddingAngle={3}
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {fundingSplit.map((entry, i) => (
                    <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Collaboration intensity by domain" description="Internal vs. external co-authorship">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={collaborationByDomain} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="domain" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip {...chartTooltip} cursor={{ fill: "var(--muted)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="internal" name="Internal" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="external" name="External" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Institution-wise statistics" description="Partner performance snapshot">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead className="hidden sm:table-cell">Country</TableHead>
                <TableHead className="text-right">Researchers</TableHead>
                <TableHead className="text-right">Joint publications</TableHead>
                <TableHead className="text-right">Active projects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutions.map((i) => (
                <TableRow key={i.name}>
                  <TableCell className="text-sm font-medium">{i.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{i.country}</TableCell>
                  <TableCell className="text-right text-sm">{i.researchers}</TableCell>
                  <TableCell className="text-right text-sm">{i.jointPublications}</TableCell>
                  <TableCell className="text-right text-sm">{i.activeProjects}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
