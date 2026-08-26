import type { AuthHeaderProps } from "./AuthHeader.types";

export function AuthHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 mb-5">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>

      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
        {eyebrow}
      </span>

      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>

      {subtitle ? (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
