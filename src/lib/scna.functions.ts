import { createServerFn } from "@tanstack/react-start";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "./db.server";
import type { Conference, Project, Publication, Researcher } from "./scna-data";

const collections = {
  researchers: "researchers",
  projects: "projects",
  publications: "publications",
  conferences: "conferences",
} as const;
type Resource = keyof typeof collections;
type AnyRecord = Record<string, unknown>;

async function ensureSeeded(resource: Resource, seed: readonly object[]) {
  const db = await getDb();
  const collection = db.collection<AnyRecord>(collections[resource]);
  const count = await collection.countDocuments();
  if (count === 0 && seed.length) await collection.insertMany(seed.map((item) => ({ ...(item as object) } as AnyRecord)));
  return collection;
}
function withStringId<T>(doc: AnyRecord): T {
  const { _id, ...rest } = doc;
  return { ...rest, id: String(doc["id"] ?? _id ?? "") } as unknown as T;
}

export const getResearchers = createServerFn({ method: "GET" }).handler(async () => {
  const { researchers } = await import("./scna-data");
  const c = await ensureSeeded("researchers", researchers as Researcher[]);
  return (await c.find({}).toArray()).map((d: AnyRecord) => withStringId<Researcher>(d));
});
export const createResearcher = createServerFn({ method: "POST" }).validator((data: Researcher) => data).handler(async ({ data }) => {
  await (await getDb()).collection<AnyRecord>(collections.researchers).insertOne(data as AnyRecord); return data;
});
export const updateResearcher = createServerFn({ method: "POST" }).validator((data: Researcher) => data).handler(async ({ data }) => {
  const { id, ...changes } = data; await (await getDb()).collection<AnyRecord>(collections.researchers).updateOne({ id }, { $set: changes }); return data;
});
export const deleteResearcher = createServerFn({ method: "POST" }).validator((data: { id: string }) => data).handler(async ({ data }) => {
  await (await getDb()).collection<AnyRecord>(collections.researchers).deleteOne({ id: data.id }); return { ok: true };
});

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { projects } = await import("./scna-data"); const c = await ensureSeeded("projects", projects as Project[]);
  return (await c.find({}).toArray()).map((d: AnyRecord) => withStringId<Project>(d));
});
export const createProject = createServerFn({ method: "POST" }).validator((data: Project) => data).handler(async ({ data }) => {
  await (await getDb()).collection<AnyRecord>(collections.projects).insertOne(data as AnyRecord); return data;
});
export const updateProject = createServerFn({ method: "POST" }).validator((data: Project) => data).handler(async ({ data }) => {
  const { id, ...changes } = data; await (await getDb()).collection<AnyRecord>(collections.projects).updateOne({ id }, { $set: changes }); return data;
});
export const deleteProject = createServerFn({ method: "POST" }).validator((data: { id: string }) => data).handler(async ({ data }) => {
  await (await getDb()).collection<AnyRecord>(collections.projects).deleteOne({ id: data.id }); return { ok: true };
});

export const getPublications = createServerFn({ method: "GET" }).handler(async () => {
  const { publications } = await import("./scna-data"); const c = await ensureSeeded("publications", publications as Publication[]);
  return (await c.find({}).toArray()).map((d: AnyRecord) => withStringId<Publication>(d));
});
export const createPublication = createServerFn({ method: "POST" }).validator((data: Publication) => data).handler(async ({ data }) => {
  await (await getDb()).collection<AnyRecord>(collections.publications).insertOne(data as AnyRecord); return data;
});
export const updatePublication = createServerFn({ method: "POST" }).validator((data: Publication) => data).handler(async ({ data }) => {
  const { id, ...changes } = data; await (await getDb()).collection<AnyRecord>(collections.publications).updateOne({ id }, { $set: changes }); return data;
});
export const deletePublication = createServerFn({ method: "POST" }).validator((data: { id: string }) => data).handler(async ({ data }) => {
  await (await getDb()).collection<AnyRecord>(collections.publications).deleteOne({ id: data.id }); return { ok: true };
});

export const getConferences = createServerFn({ method: "GET" }).handler(async () => {
  const { conferences } = await import("./scna-data"); const c = await ensureSeeded("conferences", conferences as Conference[]);
  return (await c.find({}).toArray()).map((d: AnyRecord) => withStringId<Conference>(d));
});
export const createConference = createServerFn({ method: "POST" }).validator((data: Conference) => data).handler(async ({ data }) => {
  await (await getDb()).collection<AnyRecord>(collections.conferences).insertOne(data as AnyRecord); return data;
});
export const updateConference = createServerFn({ method: "POST" }).validator((data: Conference) => data).handler(async ({ data }) => {
  const { id, ...changes } = data; await (await getDb()).collection<AnyRecord>(collections.conferences).updateOne({ id }, { $set: changes }); return data;
});
export const deleteConference = createServerFn({ method: "POST" }).validator((data: { id: string }) => data).handler(async ({ data }) => {
  await (await getDb()).collection<AnyRecord>(collections.conferences).deleteOne({ id: data.id }); return { ok: true };
});

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const { researchers: rs, publications: ps, projects: prs, conferences: cs } = await import("./scna-data");
  const [r, p, pr, c] = await Promise.all([
    ensureSeeded("researchers", rs as Researcher[]), ensureSeeded("publications", ps as Publication[]),
    ensureSeeded("projects", prs as Project[]), ensureSeeded("conferences", cs as Conference[]),
  ]);
  const [researchers, publications, projects, conferences] = await Promise.all([r.countDocuments(), p.countDocuments(), pr.countDocuments(), c.countDocuments()]);
  return { researchers, publications, projects, conferences };
});

export type ProfileSettings = {
  name: string; role: string; email: string; orcid: string; bio: string; institution: string; department: string; lab: string; photoDataUrl?: string;
};
const defaultProfile: ProfileSettings = {
  name: "Dr. Amara Okonkwo", role: "Principal Investigator", email: "a.okonkwo@northfield.edu", orcid: "0000-0002-4417-9931",
  bio: "Network inference across multi-omics layers, with a focus on reproducible graph-regularized models for large biomedical consortia.",
  institution: "Northfield Institute of Technology", department: "Computational Biology", lab: "Multi-Omics Network Group",
};
export const getProfileSettings = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDb(); const doc = await db.collection<ProfileSettings>("settings").findOne({ key: "profile" } as never);
  return doc ? { ...defaultProfile, ...doc, photoDataUrl: doc.photoDataUrl } : defaultProfile;
});
export const saveProfileSettings = createServerFn({ method: "POST" }).validator((data: ProfileSettings) => data).handler(async ({ data }) => {
  await (await getDb()).collection("settings").updateOne({ key: "profile" }, { $set: { ...data, key: "profile" } }, { upsert: true }); return data;
});

function hashPassword(password: string, salt: string) { return scryptSync(password, salt, 64).toString("hex"); }
export const updatePassword = createServerFn({ method: "POST" }).validator((data: { currentPassword: string; newPassword: string }) => data).handler(async ({ data }) => {
  if (!data.newPassword || data.newPassword.length < 8) return { ok: false, message: "New password must be at least 8 characters." };
  const db = await getDb(); const doc = await db.collection<{ key: string; salt: string; hash: string }>("credentials").findOne({ key: "admin" });
  const envPassword = process.env["SCNA_ADMIN_PASSWORD"] ?? "researchnetwork";
  const currentHash = doc ? hashPassword(data.currentPassword, doc.salt) : createHash("sha256").update(data.currentPassword).digest("hex");
  const valid = doc ? timingSafeEqual(Buffer.from(currentHash, "hex"), Buffer.from(doc.hash, "hex")) : data.currentPassword === envPassword;
  if (!valid) return { ok: false, message: "Current password is incorrect." };
  const salt = randomBytes(16).toString("hex"); const hash = hashPassword(data.newPassword, salt);
  await db.collection("credentials").updateOne({ key: "admin" }, { $set: { key: "admin", salt, hash } }, { upsert: true });
  return { ok: true };
});
export const saveProfilePhoto = createServerFn({ method: "POST" }).validator((data: { dataUrl: string }) => data).handler(async ({ data }) => {
  if (!data.dataUrl.startsWith("data:image/")) return { ok: false, message: "Please select an image file." };
  if (data.dataUrl.length > 12_000_000) return { ok: false, message: "Image is too large. Please choose one under 8 MB." };
  await (await getDb()).collection("settings").updateOne({ key: "profile" }, { $set: { photoDataUrl: data.dataUrl, key: "profile" } }, { upsert: true });
  return { ok: true };
});
