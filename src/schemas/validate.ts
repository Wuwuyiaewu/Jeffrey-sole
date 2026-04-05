import { z } from "zod";

export const PlayerSchema = z.object({
  username: z.string(),
  xp: z.number(),
});

export type Player = z.infer<typeof PlayerSchema>;
