import type { AuthPageShellProps } from "./AuthPageShell.types";

export function AuthPageShell({ children }: AuthPageShellProps) {
  const cardBg = {
    background: `
      radial-gradient(ellipse at 20% 0%, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, color-mix(in oklch, var(--accent) 10%, transparent) 0%, transparent 50%)
    `,
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background text-foreground selection:bg-primary/30"
      style={cardBg}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </main>
  );
}
