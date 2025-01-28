import {api} from "@/config/ky.config";
import {MatchList} from "@/schemes/match.scheme";


export const getMatches = async (startDate: string, endDate: string) => {
    const url = getUrl(startDate, endDate);

    return await api.get(`${url}`).json().then(MatchList.parse);
}

const getUrl = (startDate: string, endDate: string) => {
    return `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=1&start_date=${startDate}&end_date=${endDate}`
}