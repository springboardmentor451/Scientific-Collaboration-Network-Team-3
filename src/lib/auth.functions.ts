import { createServerFn } from "@tanstack/react-start";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "./db.server";

function safeEqualPassword(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export const signIn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const validEmail = (process.env["SCNA_ADMIN_EMAIL"] ?? "a.okonkwo@northfield.edu").trim().toLowerCase();
    const envPassword = process.env["SCNA_ADMIN_PASSWORD"] ?? "researchnetwork";

    if (email !== validEmail) {
      return { success: false as const, message: "Invalid institutional email or password." };
    }

    // The environment credentials are the deployment/admin credentials.
    // They intentionally take priority so an old credentials document from a
    // previous local run cannot lock the demo account out.
    if (safeEqualPassword(data.password, envPassword)) {
      return { success: true as const, user: { email: validEmail, role: "Research Intelligence Admin" } };
    }

    // Optional persisted password: allow it when the environment password
    // does not match, so password changes can still work.
    try {
      const db = await getDb();
      const credential = await db.collection<{ key: string; salt: string; hash: string }>("credentials").findOne({ key: "admin" });
      if (credential) {
        const derived = scryptSync(data.password, credential.salt, 64).toString("hex");
        if (safeEqualPassword(derived, credential.hash)) {
          return { success: true as const, user: { email: validEmail, role: "Research Intelligence Admin" } };
        }
      }
    } catch {
      // If MongoDB is temporarily unavailable, the configured environment
      // credentials above still allow the admin to sign in.
    }

    return { success: false as const, message: "Invalid institutional email or password." };
  });
