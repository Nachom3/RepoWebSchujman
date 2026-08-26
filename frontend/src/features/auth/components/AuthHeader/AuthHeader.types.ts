import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface AuthHeaderProps {
  readonly icon: LucideIcon;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly subtitle?: string;
}
