import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, MapPin, Pencil, Plus, Ticket, Trash2, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/scna/cards";
import { StatusBadge, toneForStatus } from "@/components/scna/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { conferences as seedConferences, type Conference } from "@/lib/scna-data";
import { createConference, deleteConference, getConferences, updateConference } from "@/lib/scna.functions";

export const Route = createFileRoute("/_app/conferences")({
  head: () => ({
    meta: [
      { title: "Conference Management — SCNA" },
      {
        name: "description",
        content:
          "Manage conference participation: submissions, registration status, speaking invitations and the academic event calendar.",
      },
      { property: "og:title", content: "Conference Management — SCNA" },
      {
        property: "og:description",
        content: "Track abstract submissions, registrations and travel across the academic conference calendar.",
      },
    ],
  }),
  component: ConferencesPage,
});

const calendarMonths = [
  { month: "September 2026", events: ["ICCB — Lisbon"] },
  { month: "October 2026", events: ["WCRC — Nairobi"] },
  { month: "November 2026", events: ["QPS — Zurich"] },
  { month: "December 2026", events: ["NeurIPS — Vancouver"] },
];

function ConferencesPage() {
  const [rows, setRows] = useState<Conference[]>(seedConferences);
  const [open, setOpen] = useState(false);
  useEffect(() => { getConferences().then(setRows).catch(() => toast.info("Using demo conference data until MongoDB is connected.")); }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic events"
        title="Conference Management"
        description="Submissions, registrations and speaking slots across the upcoming conference season."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-xl shadow-glow"><Plus className="mr-2 h-4 w-4" /> Add conference</Button></DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Add conference</DialogTitle><DialogDescription>Save an academic event to the SCNA calendar.</DialogDescription></DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="c-name">Conference name</Label><Input id="c-name" placeholder="International Research Conference" className="rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="c-acronym">Acronym</Label><Input id="c-acronym" placeholder="IRC" className="rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="c-location">Location</Label><Input id="c-location" placeholder="Berlin, Germany" className="rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="c-date">Date</Label><Input id="c-date" placeholder="10–12 Mar 2027" className="rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="c-track">Track</Label><Input id="c-track" placeholder="AI & Research Networks" className="rounded-xl" /></div>
              </div>
              <DialogFooter><Button className="rounded-xl" onClick={async()=>{
                const name=(document.getElementById("c-name") as HTMLInputElement)?.value.trim(); if(!name) { toast.error("Conference name is required."); return; }
                const acronym=(document.getElementById("c-acronym") as HTMLInputElement)?.value.trim() || "CONF"; const location=(document.getElementById("c-location") as HTMLInputElement)?.value.trim() || "TBD"; const date=(document.getElementById("c-date") as HTMLInputElement)?.value.trim() || "TBD"; const track=(document.getElementById("c-track") as HTMLInputElement)?.value.trim() || "General";
                try { const created=await createConference({ data: {id:`C-${Date.now().toString().slice(-6)}`,name,acronym,location,date,track,registration:"Pending",attendees:0,submissionsFromLab:0 } }); setRows(p=>[created,...p]); setOpen(false); toast.success("Conference saved to MongoDB."); } catch(e){toast.error("Could not save conference",{description:e instanceof Error?e.message:"Check MongoDB connection."});}
              }}>Save conference</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((c) => (
          <article key={c.id} className="surface-card hover-lift relative overflow-hidden p-5">
            <div className="gradient-brand pointer-events-none absolute inset-x-0 top-0 h-1" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold">{c.acronym}</p>
                <h2 className="mt-0.5 text-sm text-muted-foreground">{c.name}</h2>
              </div>
              <StatusBadge label={c.registration} tone={toneForStatus(c.registration)} />
            </div>

            <dl className="mt-5 grid gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" /> {c.date}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" /> {c.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" /> ~{c.attendees.toLocaleString()} attendees
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ticket className="h-4 w-4 shrink-0" /> {c.submissionsFromLab} submissions · {c.track}
              </div>
            </dl>

            <div className="mt-5 flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => {
                const name = window.prompt("Conference name", c.name); if (name === null) return;
                const location = window.prompt("Location", c.location) ?? c.location;
                updateConference({ data: { ...c, name: name.trim() || c.name, location } }).then((updated) => setRows((prev) => prev.map((x) => x.id === updated.id ? updated : x))).then(() => toast.success("Conference updated.")).catch((e) => toast.error("Could not update conference", { description: e instanceof Error ? e.message : "Check MongoDB connection." }));
              }}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button>
              <Button variant="ghost" size="sm" className="rounded-lg text-destructive" onClick={() => {
                if (!window.confirm(`Delete ${c.name}?`)) return;
                deleteConference({ data: { id: c.id } }).then(() => setRows((prev) => prev.filter((x) => x.id !== c.id))).then(() => toast.success("Conference deleted.")).catch((e) => toast.error("Could not delete conference", { description: e instanceof Error ? e.message : "Check MongoDB connection." }));
              }}><Trash2 className="mr-1 h-3.5 w-3.5" /> Delete</Button>
              <Button variant="ghost" size="sm" className="rounded-lg">Manage submissions</Button>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <SectionCard title="Season timeline" description="Chronological view of confirmed participation">
          <ol className="relative space-y-6 border-l border-border pl-6">
            {rows.map((c) => (
              <li key={c.id} className="relative">
                <span className="gradient-brand absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full ring-4 ring-card" />
                <p className="text-sm font-medium">
                  {c.acronym} — {c.location}
                </p>
                <p className="text-xs text-muted-foreground">{c.date}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Track: {c.track} · {c.submissionsFromLab} lab submissions
                </p>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Event calendar" description="Next four months">
          <div className="space-y-3">
            {calendarMonths.map((m) => (
              <div key={m.month} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold">{m.month}</p>
                <ul className="mt-2 space-y-1">
                  {m.events.map((e) => (
                    <li key={e} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
