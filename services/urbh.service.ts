import {api} from "@/config/ky.config";
import {MatchList} from "@/schemes/match.scheme";

export const sortedSeries = [
    "MSHL",
    "MBC",
    "WBC",
    "MFDC",
    "MSDC",
    "WFDC",
    "WFDRC",
    "WSDC",
    "D1M",
    "D1D",
    "PM",
    "U18",
    "U16F",

    "FA",
    "GA",
    "HA",
    "IA",
    "SHAVB",
    "SHROW",
    "SHRCL",
    "SDAVB",
    "SDROW",
    "SDRCL",
    "J18A",
    "J18B",
    "Z2J18F",
    "Z2J18G",
    "Z2J18H",
    "ZM18A",

    "xx",
    "yy",
]

export const series = [
    "Super Handball League",
    "Lotto Handball Cup Men",
    "Lotto Handball Cup Women",
    "First Division Men",
    "Second Division Men",
    "First Division Women",
    "First Division Women (R)",
    "Second Division Women",
    "D1 LFH Messieurs",
    "D1 LFH Dames",
    "Promotion",
    "U18 LFH",
    "U16 LFH Filles",

    "Heren Liga 1",
    "Heren Liga 2",
    "Heren Liga 3",
    "Dames Liga",
    "Heren Regio AVB",
    "Heren senioren OWV",
    "Heren Regio Limburg",
    "Dames Regio AVB",
    "Dames Regio OWV",
    "Dames Regio Limburg",
    "VHV-J18 A",
    "VHV-J18 B",
    "Zone 2, J18 F",
    "Zone 2, J18 G",
    "Zone 2, J18 H",
    "Zone M18 A",

    "Friendly games with ref",
    "Friendly games without ref",
]

export const getNationalMatches = async (startDate: string, endDate: string) => {
    const url = geNationalUrl(startDate, endDate);

    return await api.get(`${url}`).json().then(MatchList.parse);
}

const geNationalUrl = (startDate: string, endDate: string) => {
    return `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=1&start_date=${startDate}&end_date=${endDate}`
}

export const getLeagueMatches = async (startDate: string, endDate: string) => {
    const url = getLeagueUrl(startDate, endDate);

    return await api.get(`${url}`).json().then(MatchList.parse);
}

const getLeagueUrl = (startDate: string, endDate: string) => {
    return `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=3&start_date=${startDate}&end_date=${endDate}`;
}

export const getPromoLiegeMatches = async (startDate: string, endDate: string) => {
    const url = getPromoLiegeUrl(startDate, endDate);

    return await api.get(`${url}`).json().then(MatchList.parse);
}

const getPromoLiegeUrl = (startDate: string, endDate: string) => {
    return `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=7&start_date=${startDate}&end_date=${endDate}`;
}

export const getPromoBHMatches = async (startDate: string, endDate: string) => {
    const url = getPromoBHUrl(startDate, endDate);

    return await api.get(`${url}`).json().then(MatchList.parse);
}

const getPromoBHUrl = (startDate: string, endDate: string) => {
    return `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=8&start_date=${startDate}&end_date=${endDate}`;
}

export const getVHVMatches = async (startDate: string, endDate: string) => {
    const url = getVHVUrl(startDate, endDate);

    return await api.get(`${url}`).json().then(MatchList.parse);
}

const getVHVUrl = (startDate: string, endDate: string) => {
    return `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=2&start_date=${startDate}&end_date=${endDate}`;
}

export const getMatches = async (startDate: string, endDate: string) => {
   /* const vhvMatches = getVHVMatches(startDate, endDate).then(matches => matches.elements);
    const nationalMatches = getNationalMatches(startDate, endDate).then(matches => matches.elements);
    const leagueMatches = getLeagueMatches(startDate, endDate).then(matches => matches.elements);
    const promoLiegeMatches = getPromoLiegeMatches(startDate, endDate).then(matches => matches.elements);
    const promoBHMatches = getPromoBHMatches(startDate, endDate).then(matches => matches.elements); */

    const promises = [
        getNationalMatches(startDate, endDate),
        getLeagueMatches(startDate, endDate),
        getPromoLiegeMatches(startDate, endDate),
        getPromoBHMatches(startDate, endDate),
        getVHVMatches(startDate, endDate),
    ]

    const results = await Promise.allSettled(promises);

    const matches = results.filter(result => result.status === "fulfilled")
        .flatMap(result => result.value.elements);

    matches.forEach((match) => {
        match.referees = match.referees.filter((referee) => referee !== null);

        if (match.referees.length > 2) {
            match.delegates = match.referees.slice(2);
            match.referees = match.referees.slice(0, 2);
        }

        const serieMap: Record<string, string> = {
            "PrBHPO": "PM",
            "PrBHPD": "PM",
            "D1MPD": "D1M",
            "D1MPM": "D1M",
            "D1MPO": "D1M",
            "MFDPO": "MFDC",
            "MFDPD": "MFDC",
            "MSDPO": "MSDC",
            "MSDPD": "MSDC",
            "WFDPO": "WFDC",
            "WFDPDA": "WFDC",
            "WFDPDB": "WFDC",
            "WFDRPO": "WFDRC",
            "WFDRPD": "WFDRC",
            "WFDRPDB": "WFDRC",
        };
        match.serie_reference = serieMap[match.serie_reference] || match.serie_reference;
    });

    return {
        elements: matches
    }

   /* return Promise.all([nationalMatches, leagueMatches, promoLiegeMatches, promoBHMatches, vhvMatches]).then((values) => {
        values.flat().forEach((match) => {
            match.referees = match.referees.filter((referee) => referee !== null);
            if (match.referees.length > 2) {
                match.delegates = match.referees.slice(2);
                match.referees = match.referees.slice(0, 2);
            }
            if (match.serie_reference == "PrBHPO" || match.serie_reference == "PrBHPD") {
                match.serie_reference = "PM";
            } else if(match.serie_reference == "D1MPD" || match.serie_reference == "D1MPM") {
                match.serie_reference = "D1M";
            } else if(match.serie_reference == "MFDPO" || match.serie_reference == "MFDPD") {
                match.serie_reference = "MFDC";
            } else if(match.serie_reference == "MSDPO" || match.serie_reference == "MSDPD") {
                match.serie_reference = "MSDC";
            }
        });

        return {
            elements: values.flat()
        }
    }); */
}