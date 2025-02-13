"use server"

import {getMatches} from "@/services/urbh.service";
import {addDays, format, startOfWeek} from "date-fns";
import {unstable_cache} from "next/cache";

const cache = unstable_cache(async (startDate: string, endDate: string) => {
    const data = await getMatches(startDate, endDate);
    return {
        matches: data,
        lastUpdated: Date.now(),
    }
}, ["matches"], {
    revalidate: 3600,
});

export async function getCachedMatches() {
    const date = startOfWeek(new Date(), { weekStartsOn: 1 });
    const { matches } = await cache(
        format(date, "yyyy/MM/dd"),
        format(addDays(date, 45), "yyyy/MM/dd")
    );
    return matches.elements;
}

export async function getLastRevalidateDate() {
    const date = startOfWeek(new Date(), { weekStartsOn: 1 });
    const { lastUpdated } = await cache(
        format(date, "yyyy/MM/dd"),
        format(addDays(date, 45), "yyyy/MM/dd")
    );
    return lastUpdated;
}