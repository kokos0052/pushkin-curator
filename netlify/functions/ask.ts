import type { Config, Context } from "@netlify/functions";
import { handleAskCurator } from "../../server/lib/handlers";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body: unknown = await req.json();
    const result = await handleAskCurator(body);
    return Response.json(result.body, { status: result.status });
  } catch {
    return Response.json(
      { error: "Некорректный JSON" },
      { status: 400 },
    );
  }
};

export const config: Config = {
  path: "/api/ask",
  method: "POST",
};
