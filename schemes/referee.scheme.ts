import {z} from "zod";

export const Referee = z.object({
    id: z.number(),
    firstname: z.string(),
    surname: z.string(),
});

export type RefereeType = z.infer<typeof Referee>;