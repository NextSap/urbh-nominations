import {z} from "zod";
import {Referee} from "@/schemes/referee.scheme";

export const Match = z.object({
    reference: z.string(),
    date: z.string(),
    time: z.string().optional(),
    home_score: z.number().nullable().optional(),
    away_score: z.number().nullable().optional(),
    home_forfeit_status_id: z.number(),
    away_forfeit_status_id: z.number(),
    serie_reference: z.string(),
    serie_name: z.string(),
    venue_name: z.string().optional(),
    venue_city: z.string().optional(),
    home_team_short_name: z.string().optional(),
    away_team_short_name: z.string().optional(),
    home_club_logo_img_url: z.string().optional(),
    away_club_logo_img_url: z.string().optional(),
    referees: z.array(Referee.nullable()),
    delegates: z.array(Referee.nullable()).optional(),
});

export type MatchType = z.infer<typeof Match>;

export const MatchList = z.object({
    elements: z.array(Match),
})