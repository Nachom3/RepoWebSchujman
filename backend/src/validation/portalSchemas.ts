import { z } from "zod";

// Accept numeric client id OR tax id (CUIT/DNI/etc.) to keep the portal
// simple for non-technical users.
export const portalLoginBodySchema = z.object({
  identifier: z.string().trim().min(1, "Identifier is required"),
});

export type PortalLoginBody = z.infer<typeof portalLoginBodySchema>;
