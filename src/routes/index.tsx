import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Lock, Mail, Network, Quote, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth.functions";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — SCNA Scientific Collaboration Network Analyzer" },
      {
        name: "description",
        content:
          "Sign in to SCNA to analyze researcher collaboration networks, publications, projects and conferences across institutions.",
      },
      { property: "og:title", content: "Sign in — SCNA Collaboration Network Analyzer" },
      {
        property: "og:description",
        content: "Research intelligence for co-authorship networks, publications and institutional partnerships.",
      },
    ],
  }),
  component: LoginPage,
});

/** Split-screen login with animated research-network artwork. */
function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const payload = await signIn({ data: { email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") } });
      if (!payload.success) throw new Error(payload.message);
      toast.success("Welcome back", { description: "Signed in to the Northfield SCNA workspace." });
      window.location.assign("/dashboard");
    } catch (error) {
      toast.error("Sign in failed", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Artwork panel */}
      <section className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="gradient-brand absolute inset-0" />
        <div className="grid-lines absolute inset-0 opacity-30" />
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-primary-glow/40 blur-3xl animate-float" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-[26rem] w-[26rem] rounded-full bg-background/20 blur-3xl animate-float [animation-delay:2s]" />

        {/* Animated co-authorship constellation */}
        <svg
          viewBox="0 0 500 500"
          className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-primary-foreground/45 animate-orbit"
          aria-hidden="true"
        >
          <g stroke="currentColor" strokeWidth="1">
            <line x1="250" y1="250" x2="120" y2="130" />
            <line x1="250" y1="250" x2="390" y2="150" />
            <line x1="250" y1="250" x2="140" y2="370" />
            <line x1="250" y1="250" x2="370" y2="360" />
            <line x1="120" y1="130" x2="390" y2="150" />
            <line x1="140" y1="370" x2="370" y2="360" />
            <line x1="120" y1="130" x2="140" y2="370" />
          </g>
          <g fill="currentColor">
            <circle cx="250" cy="250" r="12" />
            <circle cx="120" cy="130" r="7" />
            <circle cx="390" cy="150" r="9" />
            <circle cx="140" cy="370" r="6" />
            <circle cx="370" cy="360" r="8" />
          </g>
        </svg>

        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-foreground/15 backdrop-blur">
              <FlaskConical className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold leading-tight">
                Northfield Institute of Technology
              </p>
              <p className="text-xs text-primary-foreground/75">Office of Research Intelligence</p>
            </div>
          </div>

          <div className="max-w-lg animate-rise">
            <h1 className="font-display text-4xl font-bold leading-tight">
              Scientific Collaboration Network Analyzer
            </h1>
            <p className="mt-4 text-primary-foreground/85">
              Map co-authorship graphs, trace citation impact and coordinate multi-institution research
              programmes from a single workspace.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "1,443", label: "Researchers" },
                { value: "12.8K", label: "Publications" },
                { value: "216", label: "Institutions" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-primary-foreground/10 p-4 backdrop-blur">
                  <p className="font-display text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-primary-foreground/75">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <figure className="max-w-md text-sm text-primary-foreground/85">
            <Quote className="h-5 w-5 opacity-70" />
            <blockquote className="mt-2">
              “SCNA cut the time we spend reconciling co-author records across six partner institutions
              from weeks to an afternoon.”
            </blockquote>
            <figcaption className="mt-2 text-xs text-primary-foreground/70">
              Prof. Sofia Marchetti — Director, Neural Systems Lab
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Form panel */}
      <section className="relative flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="w-full max-w-md animate-rise">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="gradient-brand grid h-10 w-10 place-items-center rounded-xl text-primary-foreground">
              <Network className="h-5 w-5" />
            </span>
            <span className="font-display font-bold">SCNA</span>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Research intelligence platform
          </span>
          <h2 className="mt-4 text-3xl font-bold">Sign in to your workspace</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use your institutional credentials to access the collaboration network.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Institutional email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="email"
                  id="email"
                  type="email"
                  required
                  defaultValue="a.okonkwo@northfield.edu"
                  className="h-11 rounded-xl pl-9"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="password"
                  id="password"
                  type="password"
                  required
                  defaultValue="researchnetwork"
                  className="h-11 rounded-xl pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked id="remember" />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => toast("Password reset link sent to your institutional inbox.")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl shadow-glow">
              {loading ? "Verifying credentials…" : "Sign in"}
            </Button>

            <Button asChild variant="outline" className="h-11 w-full rounded-xl">
              <Link to="/dashboard">
                Continue to demo workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            Access is governed by the Northfield Research Data Policy. Contact the Office of Research
            Intelligence for account provisioning.
          </p>
        </div>
      </section>
    </div>
  );
}
