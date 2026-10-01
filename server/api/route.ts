import type { Request, Response } from "express";
import { handleCreateRoute } from "../lib/handlers.ts";

export async function routeHandler(req: Request, res: Response) {
  const result = await handleCreateRoute(req.body);
  res.status(result.status).json(result.body);
}
