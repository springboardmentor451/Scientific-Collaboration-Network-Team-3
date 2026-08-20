import { createFileRoute } from "@tanstack/react-router";
import { Camera, Moon, Shield, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/scna/cards";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/scna-data";
import { getProfileSettings, saveProfilePhoto, saveProfileSettings, updatePassword, type ProfileSettings } from "@/lib/scna.functions";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [
    { title: "Profile & Settings — SCNA" },
    { name: "description", content: "Manage your researcher profile, institution details, ORCID, password and appearance preferences in SCNA." },
    { property: "og:title", content: "Profile & Settings — SCNA" },
    { property: "og:description", content: "Update personal and institutional details, security credentials and theme settings." },
  ]}),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [profile, setProfile] = useState<ProfileSettings>({
    name: currentUser.name, role: currentUser.role, email: currentUser.email, orcid: currentUser.orcid,
    bio: "Network inference across multi-omics layers, with a focus on reproducible graph-regularized models for large biomedical consortia.",
    institution: currentUser.institution, department: currentUser.department, lab: "Multi-Omics Network Group",
  });
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfileSettings().then((p) => { setProfile(p); setPhoto(p.photoDataUrl); }).catch(() => toast.info("Using local profile defaults until MongoDB is connected."));
  }, []);

  const update = (key: keyof ProfileSettings, value: string) => setProfile((p) => ({ ...p, [key]: value }));
  const save = async () => {
    setSaving(true);
    try { await saveProfileSettings({ data: profile }); toast.success("Profile details saved to MongoDB."); }
    catch (e) { toast.error("Could not save profile", { description: e instanceof Error ? e.message : "Check MongoDB connection." }); }
    finally { setSaving(false); }
  };
  const choosePhoto = async (file: File | undefined) => {
    if (!file) return; if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("Please choose an image under 8 MB."); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result); setPhoto(dataUrl);
      try { const result = await saveProfilePhoto({ data: { dataUrl } }); if (!result.ok) throw new Error(result.message); toast.success("Profile photo saved."); }
      catch (e) { toast.error("Could not save photo", { description: e instanceof Error ? e.message : "Check MongoDB connection." }); }
    };
    reader.readAsDataURL(file);
  };
  const changePassword = async () => {
    const currentPassword = (document.getElementById("current-pw") as HTMLInputElement)?.value;
    const newPassword = (document.getElementById("new-pw") as HTMLInputElement)?.value;
    const confirm = (document.getElementById("confirm-pw") as HTMLInputElement)?.value;
    if (newPassword !== confirm) { toast.error("New passwords do not match."); return; }
    try { const result = await updatePassword({ data: { currentPassword, newPassword } }); if (!result.ok) throw new Error(result.message); toast.success("Password updated securely."); }
    catch (e) { toast.error("Could not update password", { description: e instanceof Error ? e.message : "Check MongoDB connection." }); }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="Profile & Settings" description="Your researcher identity, institutional affiliation and workspace preferences." />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <SectionCard title="Profile photo" description="Shown across the collaboration network">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-card shadow-elevated">
                {photo ? <AvatarImage src={photo} alt={profile.name} /> : null}
                <AvatarFallback className="gradient-brand font-display text-2xl font-bold text-primary-foreground">{profile.name.split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase()}</AvatarFallback>
              </Avatar>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => choosePhoto(e.target.files?.[0])} />
              <button onClick={() => fileRef.current?.click()} className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full border border-border bg-card shadow-soft" aria-label="Change profile photo"><Camera className="h-4 w-4" /></button>
            </div>
            <div className="text-center"><p className="font-semibold">{profile.name}</p><p className="text-sm text-muted-foreground">{profile.role}</p><p className="mt-1 text-xs text-muted-foreground">ORCID {profile.orcid}</p></div>
          </div>
        </SectionCard>

        <SectionCard title="Personal details" description="Used on publication records and exports">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="full-name">Full name</Label><Input id="full-name" value={profile.name} onChange={(e) => update("name", e.target.value)} className="rounded-xl" /></div>
            <div className="space-y-2"><Label htmlFor="role">Academic title</Label><Input id="role" value={profile.role} onChange={(e) => update("role", e.target.value)} className="rounded-xl" /></div>
            <div className="space-y-2"><Label htmlFor="email">Institutional email</Label><Input id="email" type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} className="rounded-xl" /></div>
            <div className="space-y-2"><Label htmlFor="orcid">ORCID</Label><Input id="orcid" value={profile.orcid} onChange={(e) => update("orcid", e.target.value)} className="rounded-xl" /></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="bio">Research statement</Label><Textarea id="bio" value={profile.bio} onChange={(e) => update("bio", e.target.value)} className="rounded-xl" /></div>
          </div>
          <Button className="mt-5 rounded-xl" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</Button>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Institution details" description="Affiliation shown on collaboration records">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="inst">Institution</Label><Input id="inst" value={profile.institution} onChange={(e) => update("institution", e.target.value)} className="rounded-xl" /></div>
            <div className="space-y-2"><Label htmlFor="dept">Department</Label><Input id="dept" value={profile.department} onChange={(e) => update("department", e.target.value)} className="rounded-xl" /></div>
            <div className="space-y-2"><Label htmlFor="lab">Lab / group</Label><Input id="lab" value={profile.lab} onChange={(e) => update("lab", e.target.value)} className="rounded-xl" /></div>
          </div>
          <Button className="mt-5 rounded-xl" onClick={save}>Save institution</Button>
        </SectionCard>

        <SectionCard title="Security" description="Password and account protection">
          <div className="grid gap-4">
            <div className="space-y-2"><Label htmlFor="current-pw">Current password</Label><Input id="current-pw" type="password" placeholder="••••••••" className="rounded-xl" /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="new-pw">New password</Label><Input id="new-pw" type="password" placeholder="At least 8 characters" className="rounded-xl" /></div><div className="space-y-2"><Label htmlFor="confirm-pw">Confirm password</Label><Input id="confirm-pw" type="password" placeholder="Repeat password" className="rounded-xl" /></div></div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4"><div className="flex min-w-0 items-center gap-3"><Shield className="h-4 w-4 shrink-0 text-primary" /><div className="min-w-0"><p className="text-sm font-medium">Two-factor authentication</p><p className="text-xs text-muted-foreground">Preference stored for this workspace</p></div></div><Switch defaultChecked onCheckedChange={(checked) => localStorage.setItem("scna-2fa", String(checked))} /></div>
            <Button variant="outline" className="rounded-xl" onClick={changePassword}>Update password</Button>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Theme settings" description="Appearance of your SCNA workspace">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">{theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</span><div className="min-w-0"><p className="text-sm font-medium">{theme === "dark" ? "Dark" : "Light"} mode</p><p className="text-xs text-muted-foreground">Applies instantly across all pages</p></div></div><Switch checked={theme === "dark"} onCheckedChange={toggle} aria-label="Toggle dark mode" /></div>
      </SectionCard>
    </div>
  );
}
