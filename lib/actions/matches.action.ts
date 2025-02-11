"use server"

import {getMatches} from "@/services/urbh.service";
import {addDays, format, startOfWeek} from "date-fns";
import {unstable_cache} from "next/cache";

const cache = unstable_cache(async (startDate: string, endDate: string) => getMatches(startDate, endDate), ["matches"], {
    revalidate: 3600,
});

export async function getCachedMatches() {
    const date = startOfWeek(new Date(), {weekStartsOn: 1});
    return await cache(format(date, "yyyy/MM/dd"), format(addDays(date, 45), "yyyy/MM/dd")).then((matches) => matches.elements);
}