import { Router, type Request, type Response } from "express";
import { getPanelSummary } from "../features/panel/application/getPanelSummary";
import { prismaPanelRepository } from "../features/panel/infrastructure/prismaPanelRepository";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import type { ApiErrorResponse } from "../types/auth";
import type { PanelSummaryResponse } from "../types/panel";

export const panelRouter = Router();

panelRouter.use(authenticateToken);
panelRouter.use(requireRole("ADMIN"));

panelRouter.get(
  "/summary",
  async (
    _req: Request,
    res: Response<PanelSummaryResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const summary = await getPanelSummary(prismaPanelRepository);
      res.json(summary);
    } catch (error) {
      console.error("[panel summary]", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);
