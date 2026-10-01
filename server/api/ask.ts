import type { Request, Response } from "express";
import { handleAskCurator } from "../lib/handlers.ts";

export async function askHandler(req: Request, res: Response) {
  const result = await handleAskCurator(req.body);
  res.status(result.status).json(result.body);
}
