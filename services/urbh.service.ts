import {api} from "@/config/ky.config";
import {MatchList} from "@/schemes/match.scheme";

export const sortedSeries = [
    "MFDC",
    "MSDC",
    "WFDC",
    "WFDRC",
    "WSDC",
    "MBC",
    "WBC",
    "D1M",
    "D1D",
    "PM",
    "U18",
    "xx",
    "yy",
]

export const series = [
    "N1 Men",
    "N2 Men",
    "N1 Women",
    "N1 Women (R)",
    "N2 Women",
    "Lotto Handball Cup Men",
    "Lotto Handball Cup Women",
    "LFH 1 Men",
    "LFH 1 Women",
    "Promo",
    "U18",
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

export const getPromoBHtMatches = async (startDate: string, endDate: string) => {
    const url = getPromoBHUrl(startDate, endDate);

    return await api.get(`${url}`).json().then(MatchList.parse);
}

const getPromoBHUrl = (startDate: string, endDate: string) => {
    return `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=8&start_date=${startDate}&end_date=${endDate}`;
}


export const getMatches = async (startDate: string, endDate: string) => {
    const nationalMatches = getNationalMatches(startDate, endDate).then(matches => matches.elements);
    const leagueMatches = getLeagueMatches(startDate, endDate).then(matches => matches.elements);
    const promoLiegeMatches = getPromoLiegeMatches(startDate, endDate).then(matches => matches.elements);
    const promoBHMatches = getPromoBHtMatches(startDate, endDate).then(matches => matches.elements);

    return Promise.all([nationalMatches, leagueMatches, promoLiegeMatches, promoBHMatches]).then((values) => {
        values.flat().forEach((match) => {
            match.referees = match.referees.filter((referee) => referee !== null);
            if(match.referees.length > 2) {
                match.delegates = match.referees.slice(2);
                match.referees = match.referees.slice(0, 2);
            }
        });

        return {
            elements: values.flat()
        }
    });
}