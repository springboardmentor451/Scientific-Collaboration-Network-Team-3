import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ExternalLink, FileText, Pencil, Search, Trash2, Unlock, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/scna/cards";
import { StatusBadge, toneForStatus } from "@/components/scna/status-badge";
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
import { Textarea } from "@/components/ui/textarea";
import { publications as seedPublications, type Publication } from "@/lib/scna-data";
import { createPublication, deletePublication, getPublications, updatePublication } from "@/lib/scna.functions";

export const Route = createFileRoute("/_app/publications")({
  head: () => ({
    meta: [
      { title: "Publication Management — SCNA" },
      {
        name: "description",
        content:
          "Track journal articles, conference papers, preprints and datasets with citation counts, DOIs and review status.",
      },
      { property: "og:title", content: "Publication Management — SCNA" },
      {
        property: "og:description",
        content: "Upload, filter and monitor the publication record of your research network.",
      },
    ],
  }),
  component: PublicationsPage,
});

const statuses = ["Published", "Under Review", "Preprint", "Draft"];

function PublicationsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState<Publication[]>(seedPublications);
  const [open, setOpen] = useState(false);
  useEffect(() => { getPublications().then(setRows).catch(() => toast.info("Using demo publication data until MongoDB is connected.")); }, []);

  const filtered = useMemo(
    () =>
      rows.filter((p) => {
        const matchesQuery = `${p.title} ${p.venue} ${p.authors.join(" ")} ${p.doi}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesQuery && (status === "all" || p.status === status);
      }),
    [rows, query, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Research output"
        title="Publication Management"
        description="Every journal article, conference paper, review and dataset produced across the collaboration network."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-glow">
                <Upload className="mr-2 h-4 w-4" /> Upload publication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Upload publication</DialogTitle>
                <DialogDescription>
                  Metadata is cross-checked against Crossref and the institutional repository.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-title">Title</Label>
                  <Input id="p-title" placeholder="Paper title" className="rounded-xl" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="p-venue">Venue</Label>
                    <Input id="p-venue" placeholder="Nature Computational Science" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-doi">DOI / arXiv ID</Label>
                    <Input id="p-doi" placeholder="10.1038/…" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-authors">Authors</Label>
                  <Textarea
                    id="p-authors"
                    placeholder="A. Okonkwo, H. Suzuki, R. Iyer"
                    className="rounded-xl"
                  />
                </div>
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Drop the manuscript PDF here, or click to browse.
                </div>
              </div>
              <DialogFooter>
                <Button className="rounded-xl" onClick={async () => {
                  const title=(document.getElementById("p-title") as HTMLInputElement)?.value.trim();
                  const venue=(document.getElementById("p-venue") as HTMLInputElement)?.value.trim() || "Institutional Repository";
                  const doi=(document.getElementById("p-doi") as HTMLInputElement)?.value.trim() || `SCNA-${Date.now()}`;
                  const authorsRaw=(document.getElementById("p-authors") as HTMLTextAreaElement)?.value || "";
                  if(!title) { toast.error("Publication title is required."); return; }
                  try { const created=await createPublication({ data: {id:`P-${Date.now().toString().slice(-6)}`,title,venue,year:new Date().getFullYear(),type:"Journal Article",authors:authorsRaw.split(",").map(x=>x.trim()).filter(Boolean),citations:0,status:"Draft",doi,openAccess:false } }); setRows(p=>[created,...p]); setOpen(false); toast.success("Publication saved to MongoDB."); } catch(e){toast.error("Could not save publication",{description:e instanceof Error?e.message:"Check MongoDB connection."});}
                }}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="surface-card grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_200px]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, venue, author or DOI"
            className="h-11 rounded-xl pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="cards">
        <TabsList className="rounded-xl">
          <TabsTrigger value="cards" className="rounded-lg">
            Card view
          </TabsTrigger>
          <TabsTrigger value="table" className="rounded-lg">
            Table view
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No publications found"
              description="Adjust the search terms or status filter to widen your results."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((p) => (
                <article key={p.id} className="surface-card hover-lift flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                      <BookOpen className="h-3 w-3" /> {p.type}
                    </span>
                    <StatusBadge label={p.status} tone={toneForStatus(p.status)} />
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.venue} · {p.year}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.authors.join(" · ")}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{p.citations} citations</span>
                      {p.openAccess && (
                        <span className="inline-flex items-center gap-1 text-success">
                          <Unlock className="h-3 w-3" /> Open access
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => toast(p.doi)}>
                      DOI <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <div className="surface-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden lg:table-cell">Venue</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="text-right">Year</TableHead>
                  <TableHead className="text-right">Citations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[320px]">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.authors.join(", ")}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{p.venue}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{p.type}</TableCell>
                    <TableCell className="text-right text-sm">{p.year}</TableCell>
                    <TableCell className="text-right text-sm">{p.citations}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <StatusBadge label={p.status} tone={toneForStatus(p.status)} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" aria-label="Edit publication" onClick={() => {
                          const title = window.prompt("Publication title", p.title); if (title === null) return;
                          updatePublication({ data: { ...p, title: title.trim() || p.title } }).then((updated) => setRows((prev) => prev.map((x) => x.id === updated.id ? updated : x))).then(() => toast.success("Publication updated." )).catch((e) => toast.error("Could not update publication", { description: e instanceof Error ? e.message : "Check MongoDB connection." }));
                        }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" aria-label="Delete publication" onClick={() => {
                          if (!window.confirm(`Delete ${p.title}?`)) return;
                          deletePublication({ data: { id: p.id } }).then(() => setRows((prev) => prev.filter((x) => x.id !== p.id))).then(() => toast.success("Publication deleted.")).catch((e) => toast.error("Could not delete publication", { description: e instanceof Error ? e.message : "Check MongoDB connection." }));
                        }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
