import {z} from "zod";

export const Competition = z.object({
    name: z.string(),
    order: z.number(),
})

export type CompetitionType = z.infer<typeof Competition>;