import {getMatches} from "@/services/urbh.service";
import {addDays, format, startOfWeek} from "date-fns";
import {MatchType} from "@/schemes/match.scheme";

let cacheData: MatchType[];
let lastUpdate = 0;
const CACHE_TTL = 300;

async function fetchMatches() {
    try {
        console.log(`Chargement des matchs... ${lastUpdate}`);
        const date = startOfWeek(new Date(), {weekStartsOn: 1});
        cacheData = await getMatches(format(date, "yyyy/MM/dd"), format(addDays(date, 45), "yyyy/MM/dd")).then((matches) => matches.elements);
        lastUpdate = Date.now();
    } catch (error) {
        console.error('Erreur lors du fetch des matchs:', error);
    }
}

setInterval(fetchMatches, CACHE_TTL * 1000);

fetchMatches().then(() => console.log("Matchs chargés."));

export async function getCachedMatches(): Promise<MatchType[]> {
    console.log(`Récupération des matchs en cache... ${lastUpdate} ${Date.now() - lastUpdate}`);
    if (!cacheData || Date.now() - lastUpdate > CACHE_TTL * 1000) {
        await fetchMatches();
    }
    return cacheData;
}
