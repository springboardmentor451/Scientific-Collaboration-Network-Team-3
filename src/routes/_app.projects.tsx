import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, CircleDollarSign, Pencil, Plus, Trash2, UserRound } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatusBadge, toneForStatus } from "@/components/scna/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { projects as seedProjects, type Project } from "@/lib/scna-data";
import { createProject, deleteProject, getProjects, updateProject } from "@/lib/scna.functions";

export const Route = createFileRoute("/_app/projects")({
  head: () => ({
    meta: [
      { title: "Research Projects — SCNA" },
      {
        name: "description",
        content:
          "Kanban board of research projects with funding details, progress, deadlines and assigned research teams.",
      },
      { property: "og:title", content: "Research Projects — SCNA" },
      {
        property: "og:description",
        content: "Coordinate grant-funded research programmes from proposal to completion.",
      },
    ],
  }),
  component: ProjectsPage,
});

const stages: Project["stage"][] = ["Proposal", "Active", "Analysis", "Completed"];

function ProjectCard({ project, onChange }: { project: Project; onChange: (project: Project | null) => void }) {
  return (
    <article className="surface-card hover-lift p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug">{project.title}</h3>
        <span className="shrink-0 text-[11px] text-muted-foreground">{project.id}</span>
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <UserRound className="h-3.5 w-3.5" /> {project.lead}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="mt-1.5 h-1.5" />
      </div>

      <dl className="mt-4 space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <CircleDollarSign className="h-3.5 w-3.5" /> Funding
          </dt>
          <dd className="truncate font-medium">
            {project.funding} · {project.funder}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" /> Deadline
          </dt>
          <dd className="font-medium">{project.deadline}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.team.map((m) => (
            <span
              key={m}
              className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-primary/12 text-[10px] font-semibold text-primary"
            >
              {m}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" aria-label="Edit project" onClick={() => {
            const title = window.prompt("Project title", project.title); if (title === null) return;
            const lead = window.prompt("Project lead", project.lead) ?? project.lead;
            const funding = window.prompt("Funding", project.funding) ?? project.funding;
            const deadline = window.prompt("Deadline", project.deadline) ?? project.deadline;
            updateProject({ data: { ...project, title: title.trim() || project.title, lead, funding, deadline } }).then((updated) => onChange(updated)).catch((e) => toast.error("Could not update project", { description: e instanceof Error ? e.message : "Check MongoDB connection." }));
          }}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" aria-label="Delete project" onClick={() => {
            if (!window.confirm(`Delete ${project.title}?`)) return;
            deleteProject({ data: { id: project.id } }).then(() => onChange(null)).catch((e) => toast.error("Could not delete project", { description: e instanceof Error ? e.message : "Check MongoDB connection." }));
          }}><Trash2 className="h-4 w-4" /></Button>
          <StatusBadge label={project.stage} tone={toneForStatus(project.stage)} />
        </div>
      </div>
    </article>
  );
}

function ProjectsPage() {
  const [rows, setRows] = useState<Project[]>(seedProjects);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getProjects().then(setRows).catch(() => toast.info("Using demo project data until MongoDB is connected."));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Programme delivery"
        title="Research Projects"
        description="Grant-funded programmes tracked from proposal through analysis and closeout."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-glow"><Plus className="mr-2 h-4 w-4" /> New project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>New research project</DialogTitle><DialogDescription>Create a project and persist it in MongoDB.</DialogDescription></DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="pr-title">Title</Label><Input id="pr-title" placeholder="Research programme" className="rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="pr-lead">Lead</Label><Input id="pr-lead" placeholder="Dr. Jane Doe" className="rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="pr-funder">Funder</Label><Input id="pr-funder" placeholder="Research Council" className="rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="pr-funding">Funding</Label><Input id="pr-funding" placeholder="$500K" className="rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="pr-deadline">Deadline</Label><Input id="pr-deadline" placeholder="Dec 2027" className="rounded-xl" /></div>
                <div className="space-y-2"><Label>Stage</Label><Select defaultValue="Proposal"><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{stages.map((x)=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <DialogFooter><Button className="rounded-xl" onClick={async () => {
                const title=(document.getElementById("pr-title") as HTMLInputElement)?.value.trim();
                if(!title) { toast.error("Project title is required."); return; }
                const lead=(document.getElementById("pr-lead") as HTMLInputElement)?.value.trim() || "Research Lead";
                const funder=(document.getElementById("pr-funder") as HTMLInputElement)?.value.trim() || "Internal Grant";
                const funding=(document.getElementById("pr-funding") as HTMLInputElement)?.value.trim() || "$0";
                const deadline=(document.getElementById("pr-deadline") as HTMLInputElement)?.value.trim() || "TBD";
                try { const created=await createProject({ data: {id:`PR-${Date.now().toString().slice(-6)}`,title,lead,funder,funding,progress:0,deadline,stage:"Proposal",team:[] } }); setRows(p=>[created,...p]); setOpen(false); toast.success("Project saved to MongoDB."); } catch(e){toast.error("Could not save project",{description:e instanceof Error?e.message:"Check MongoDB connection."});}
              }}>Save project</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Kanban board */}
      <div className="grid gap-4 lg:grid-cols-4">
        {stages.map((stage) => {
          const items = rows.filter((p) => p.stage === stage);
          return (
            <section key={stage} className="rounded-2xl border border-border bg-muted/40 p-3">
              <header className="flex items-center justify-between px-1 pb-3">
                <h2 className="text-sm font-semibold">{stage}</h2>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  {items.length}
                </span>
              </header>
              <div className="space-y-3">
                {items.map((p) => (
                  <ProjectCard key={p.id} project={p} onChange={(next) => setRows((prev) => next ? prev.map((x) => x.id === next.id ? next : x) : prev.filter((x) => x.id !== p.id))} />
                ))}
                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    No projects in this stage
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
