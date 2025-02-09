import React from 'react';
import {MatchType} from "@/schemes/match.scheme";
import {series, sortedSeries} from "@/services/urbh.service";
import {format} from "date-fns";

type MatchComponentProps = {
    sortedMatches: MatchType[];
    index: number;
    showScore: boolean;
    showDelegates: boolean;
    match: MatchType;
}

const baseImage = "https://admin.handballbelgium.be/lms_league_ws/public/img/";

const MatchComponent = (props: MatchComponentProps) => {
    const showSerieName =
        props.index === 0 || props.match.serie_reference !== props.sortedMatches[props.index - 1].serie_reference;
    const formatDate = format(new Date(props.match.date), "EEEEEE dd/MM/yyyy");
    const formatTime = props.match.time ? props.match.time.split(":").slice(0, 2).join(":") : "00:00";

    return (
        <div className="pb-4 md:w-96">
            {showSerieName &&
                <p className="font-bold">{series[sortedSeries.indexOf(props.match.serie_reference)].toUpperCase()}</p>}
            <div className="flex">
                <div className="w-[70%]">
                    <p>{props.match.serie_name}</p>
                    <p>{formatDate} - {formatTime}</p>
                    <div className="flex gap-2 items-center">
                        <img
                            src={baseImage + props.match.home_club_logo_img_url}
                            alt={props.match.home_team_short_name}
                            className="w-6 h-6"/>
                        <p>{props.match.home_team_short_name}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <img
                            src={baseImage + props.match.away_club_logo_img_url}
                            alt={props.match.away_team_short_name}
                            className="w-6 h-6"/>
                        <p>{props.match.away_team_short_name}</p>
                    </div>
                    {props.showScore &&
                        ((props.match.home_score == null || props.match.away_score == null) ?
                            <p>No score</p> :
                            <div className="flex gap-1 items-center">
                                <p>{props.match.home_score}</p>
                                <p>-</p>
                                <p>{props.match.away_score}</p>
                            </div>)
                    }
                </div>
                <div>
                    <p className="font-bold underline">Referees</p>
                    {props.match.referees.length == 0 && <p>No referee</p>}
                    {props.match.referees.map((referee) => {
                        if (referee !== null) {
                            return (
                                <p key={referee.id}>
                                    {referee.surname} {referee.firstname.substring(0, 1).toUpperCase()}.
                                </p>
                            );
                        }
                    })}
                    {props.showDelegates && (
                        <div>
                            <p className="font-bold underline">Delegates</p>
                            {!props.match.delegates && <p>No delegate</p>}
                            {props.match.delegates?.map((delegate) => {
                                if (delegate !== null) {
                                    return (
                                        <p key={delegate.id}>
                                            {delegate.surname} {delegate.firstname.substring(0, 1).toUpperCase()}.
                                        </p>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchComponent;