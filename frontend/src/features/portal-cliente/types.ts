import { z } from "zod";

export interface PortalSession {
  sessionToken: string;
  client: { id: number; name: string; taxId: string | null };
}

export interface PortalProject {
  id: number;
  name: string;
  status: string;
  type: string;
  address: string | null;
  progressPercent: number;
  estimatedEnd: string | null;
}

export interface PortalProjectTask {
  id: number;
  title: string;
  status: string;
  progress: number;
}

export interface PortalProjectDetail extends PortalProject {
  description: string | null;
  estimatedStart: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  tasks: PortalProjectTask[];
}

export interface PortalPayment {
  id: number;
  type: string;
  method: string;
  amount: number;
  date: string;
  projectId: number | null;
}

export const portalLoginSchema = z.object({
  identifier: z.string().trim().min(1, "Ingresá tu ID o CUIT/DNI"),
});

export type PortalLoginFormData = z.infer<typeof portalLoginSchema>;
