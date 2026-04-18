import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "sign-in" | "sign-up";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result =
        mode === "sign-in"
          ? await authClient.signIn.email({ email, password })
          : await authClient.signUp.email({
              email,
              password,
              name: name || email.split("@")[0],
            });
      if (result.error) {
        setError(result.error.message ?? "Authentication failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full lg:grid min-h-svh lg:grid-cols-2 bg-background text-foreground",
        className,
      )}
      {...props}
    >
      <div className="hidden bg-muted lg:block relative h-full">
        <div className="absolute inset-0 bg-zinc-950/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Abstract 3D background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="font-bold text-sm">L</span>
            </div>
            <span className="text-xl">Lory</span>
          </div>
          <div className="mt-auto max-w-xl">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Lory has completely revolutionized my daily workflow.
                It's the perfect blend of aesthetic design and frictionless
                functionality.&rdquo;
              </p>
              <footer className="text-sm font-medium">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-6">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {mode === "sign-in" ? "Login" : "Sign Up"}
            </h1>
            <p className="text-balance text-muted-foreground">
              {mode === "sign-in"
                ? "Enter your email below to login to your account"
                : "Enter your details below to create your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {mode === "sign-up" && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {mode === "sign-in" && (
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Forgot your password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                minLength={8}
                required
              />
            </div>

            {error && (
              <div
                className="text-[0.8rem] font-medium text-destructive"
                role="alert"
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && "Please wait..."}
              {!submitting && mode === "sign-in" && "Login"}
              {!submitting && mode === "sign-up" && "Sign up"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {mode === "sign-in"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              className="underline underline-offset-4 hover:text-primary font-medium"
              onClick={() =>
                setMode(mode === "sign-in" ? "sign-up" : "sign-in")
              }
            >
              {mode === "sign-in" ? "Sign up" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
