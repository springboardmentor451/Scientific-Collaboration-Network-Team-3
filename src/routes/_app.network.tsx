import { createFileRoute } from "@tanstack/react-router";
import { Building2, Link2, Maximize2, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/scna/cards";
import { StatusBadge } from "@/components/scna/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { coAuthorLinks, institutions, projects, teams } from "@/lib/scna-data";

export const Route = createFileRoute("/_app/network")({
  head: () => ({
    meta: [
      { title: "Collaboration Network — SCNA" },
      {
        name: "description",
        content:
          "Explore co-authorship relationships, research teams, institutional partnerships and project assignments in the collaboration graph.",
      },
      { property: "og:title", content: "Collaboration Network — SCNA" },
      {
        property: "og:description",
        content: "Interactive view of co-author links and cross-institution research partnerships.",
      },
    ],
  }),
  component: NetworkPage,
});

/** Static SVG stand-in for the interactive force-directed graph. */
function GraphPlaceholder() {
  const nodes = [
    { x: 300, y: 180, r: 26, label: "AO" },
    { x: 140, y: 100, r: 18, label: "HS" },
    { x: 470, y: 110, r: 20, label: "LB" },
    { x: 130, y: 280, r: 16, label: "RI" },
    { x: 460, y: 290, r: 19, label: "MC" },
    { x: 300, y: 330, r: 15, label: "IF" },
    { x: 220, y: 60, r: 12, label: "TH" },
    { x: 390, y: 350, r: 13, label: "SM" },
  ];
  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 6],
    [2, 4],
    [3, 5],
    [4, 7],
    [5, 7],
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30">
      <div className="grid-lines absolute inset-0 opacity-50" />
      <svg viewBox="0 0 600 400" className="relative h-[360px] w-full">
        <g stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="1.6">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a]!.x}
              y1={nodes[a]!.y}
              x2={nodes[b]!.x}
              y2={nodes[b]!.y}
            />
          ))}
        </g>
        {nodes.map((n) => (
          <g key={n.label} className="animate-pulse-soft" style={{ animationDelay: `${n.r / 20}s` }}>
            <circle cx={n.x} cy={n.y} r={n.r + 8} fill="var(--primary)" opacity="0.12" />
            <circle cx={n.x} cy={n.y} r={n.r} fill="var(--primary)" />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--primary-foreground)"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>Node size = publication volume</span>
        <span>Edge weight = shared papers</span>
      </div>
    </div>
  );
}

function NetworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Graph explorer"
        title="Collaboration Network"
        description="Co-authorship structure, research teams and institutional partnerships across the SCNA corpus."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => document.getElementById("scna-network-map")?.requestFullscreen?.()}>
            <Maximize2 className="mr-2 h-4 w-4" /> Full-screen graph
          </Button>
        }
      />

      <div id="scna-network-map">
      <SectionCard
        title="Co-authorship graph"
        description="1,284 links · 8 highlighted researchers · 6 institutions"
      >
        <GraphPlaceholder />
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Research teams" description="Cross-institution working groups">
          <div className="grid gap-4 sm:grid-cols-2">
            {teams.map((t) => (
              <article key={t.id} className="rounded-2xl border border-border p-4 hover-lift">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.focus}</p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <dt className="text-muted-foreground">Members</dt>
                    <dd className="font-display text-base font-bold">{t.members}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Institutions</dt>
                    <dd className="font-display text-base font-bold">{t.institutions}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Papers</dt>
                    <dd className="font-display text-base font-bold">{t.publications}</dd>
                  </div>
                </dl>
                <p className="mt-3 truncate text-xs text-muted-foreground">Lead: {t.lead}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Co-author relationships" description="Strongest pairings by shared output">
            <ul className="space-y-3">
              {coAuthorLinks.map((l) => (
                <li
                  key={`${l.a}-${l.b}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {l.a} <Link2 className="inline h-3.5 w-3.5 text-muted-foreground" /> {l.b}
                    </p>
                    <p className="text-xs text-muted-foreground">{l.papers} co-authored papers</p>
                  </div>
                  <StatusBadge
                    label={l.strength}
                    tone={l.strength === "Strong" ? "success" : l.strength === "Emerging" ? "info" : "neutral"}
                  />
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Institution collaborations" description="Joint publication volume">
            <ul className="space-y-4">
              {institutions.slice(0, 5).map((inst) => (
                <li key={inst.name} className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{inst.name}</span>
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {inst.jointPublications} papers
                    </span>
                  </div>
                  <Progress value={(inst.jointPublications / 268) * 100} className="mt-2 h-1.5" />
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Project assignments" description="Who is working on what, right now">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border p-4">
              <p className="truncate text-sm font-medium">{p.title}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">Lead: {p.lead}</p>
              <div className="mt-3 flex -space-x-2">
                {p.team.map((m) => (
                  <span
                    key={m}
                    className="grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-primary/12 text-[11px] font-semibold text-primary"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      </div>
    </div>
  );
}
