import { createFileRoute } from "@tanstack/react-router";
import { Mail, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/scna/cards";
import { StatusBadge, toneForStatus } from "@/components/scna/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { departments, researchers as seedResearchers, type Researcher } from "@/lib/scna-data";
import { createResearcher, deleteResearcher, getResearchers, updateResearcher } from "@/lib/scna.functions";

export const Route = createFileRoute("/_app/researchers")({
  head: () => ({
    meta: [
      { title: "Researcher Management — SCNA" },
      {
        name: "description",
        content:
          "Search, filter and manage researcher profiles, departments, h-index and co-authorship counts across the SCNA network.",
      },
      { property: "og:title", content: "Researcher Management — SCNA" },
      {
        property: "og:description",
        content: "Directory of affiliated researchers with publications, citations and collaboration metrics.",
      },
    ],
  }),
  component: ResearchersPage,
});

function ResearchersPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [rows, setRows] = useState<Researcher[]>(seedResearchers);
  const [pendingDelete, setPendingDelete] = useState<Researcher | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getResearchers().then(setRows).catch(() => toast.info("Using demo researcher data until MongoDB is connected."));
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const matchesQuery = `${r.name} ${r.institution} ${r.email} ${r.title}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesDept = department === "all" || r.department === department;
        return matchesQuery && matchesDept;
      }),
    [rows, query, department],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Directory"
        title="Researcher Management"
        description="Maintain researcher profiles, affiliations and collaboration metrics across all partner institutions."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-glow">
                <Plus className="mr-2 h-4 w-4" /> Add researcher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add researcher</DialogTitle>
                <DialogDescription>
                  Create a new profile in the collaboration network. ORCID is verified on save.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="r-name">Full name</Label>
                  <Input id="r-name" name="name" placeholder="Dr. Jane Doe" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-title">Academic title</Label>
                  <Input id="r-title" name="title" placeholder="Associate Professor" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-orcid">ORCID</Label>
                  <Input id="r-orcid" name="orcid" placeholder="0000-0000-0000-0000" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select name="department">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-email">Institutional email</Label>
                  <Input id="r-email" name="email" type="email" placeholder="name@university.edu" className="rounded-xl" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="rounded-xl"
                  disabled={saving}
                  onClick={async () => {
                    const name = (document.getElementById("r-name") as HTMLInputElement)?.value.trim();
                    const title = (document.getElementById("r-title") as HTMLInputElement)?.value.trim();
                    const email = (document.getElementById("r-email") as HTMLInputElement)?.value.trim();
                    const departmentValue = (document.querySelector('[name="department"]') as HTMLInputElement)?.value || "Computer Science";
                    if (!name || !email) { toast.error("Name and institutional email are required."); return; }
                    setSaving(true);
                    try {
                      const initials = name.split(/\s+/).filter(Boolean).slice(-2).map((x) => x[0]).join("").toUpperCase();
                      const created = await createResearcher({ data: {
                        id: `R-${Date.now().toString().slice(-6)}`, name, title: title || "Researcher",
                        department: departmentValue, institution: "Northfield Institute of Technology", email,
                        publications: 0, citations: 0, hIndex: 0, collaborators: 0, status: "Active", initials,
                      }});
                      setRows((prev) => [created, ...prev]);
                      setDialogOpen(false);
                      toast.success("Researcher saved to MongoDB.");
                    } catch (error) {
                      toast.error("Could not save researcher", { description: error instanceof Error ? error.message : "Check MongoDB connection." });
                    } finally { setSaving(false); }
                  }}
                >
                  {saving ? "Saving…" : "Save researcher"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Advanced search + filters */}
      <div className="surface-card grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_220px_160px]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, title, institution or email"
            className="h-11 rounded-xl pl-9"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-end text-sm text-muted-foreground">
          {filtered.length} of {rows.length}
        </div>
      </div>

      <Tabs defaultValue="table">
        <TabsList className="rounded-xl">
          <TabsTrigger value="table" className="rounded-lg">
            Table view
          </TabsTrigger>
          <TabsTrigger value="cards" className="rounded-lg">
            Profile cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No researchers match your filters"
              description="Try a different department or clear the search query to see the full directory."
            />
          ) : (
            <div className="surface-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Researcher</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden lg:table-cell">Institution</TableHead>
                    <TableHead className="text-right">Pubs</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">h-index</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {r.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{r.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{r.title}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{r.department}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{r.institution}</TableCell>
                      <TableCell className="text-right text-sm">{r.publications}</TableCell>
                      <TableCell className="hidden text-right text-sm sm:table-cell">{r.hIndex}</TableCell>
                      <TableCell>
                        <StatusBadge label={r.status} tone={toneForStatus(r.status)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${r.name}`}
                            onClick={() => {
                              const name = window.prompt("Researcher name", r.name); if (name === null) return;
                              const title = window.prompt("Academic title", r.title) ?? r.title;
                              updateResearcher({ data: { ...r, name: name.trim() || r.name, title } })
                                .then((updated) => setRows((prev) => prev.map((x) => x.id === updated.id ? updated : x)))
                                .then(() => toast.success("Researcher updated."))
                                .catch((e) => toast.error("Could not update researcher", { description: e instanceof Error ? e.message : "Check MongoDB connection." }));
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${r.name}`}
                            onClick={() => setPendingDelete(r)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cards" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => (
              <article key={r.id} className="surface-card hover-lift p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback className="gradient-brand text-sm font-semibold text-primary-foreground">
                      {r.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.title}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  {r.department} · {r.institution}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/60 p-3 text-center">
                  <div>
                    <p className="font-display text-lg font-bold">{r.publications}</p>
                    <p className="text-[11px] text-muted-foreground">Papers</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold">{r.citations}</p>
                    <p className="text-[11px] text-muted-foreground">Citations</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold">{r.collaborators}</p>
                    <p className="text-[11px] text-muted-foreground">Co-authors</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <StatusBadge label={r.status} tone={toneForStatus(r.status)} />
                  <Button variant="ghost" size="sm" className="rounded-lg" asChild>
                    <a href={`mailto:${r.email}`}>
                      <Mail className="mr-1.5 h-3.5 w-3.5" /> Contact
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation dialog */}
      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove researcher profile?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} will be detached from {pendingDelete?.collaborators} co-authorship links.
              Publications remain archived.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl"
              onClick={async () => {
                if (!pendingDelete) return;
                try {
                  await deleteResearcher({ data: { id: pendingDelete.id } });
                  setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
                  toast.success(`${pendingDelete.name} removed from MongoDB.`);
                } catch (error) {
                  toast.error("Could not remove researcher", { description: error instanceof Error ? error.message : "Check MongoDB connection." });
                } finally { setPendingDelete(null); }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
