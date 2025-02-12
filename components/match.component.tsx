import React from 'react';
import {MatchType} from "@/schemes/match.scheme";
import {series, sortedSeries} from "@/services/urbh.service";
import {format} from "date-fns";
import {cn} from "@/lib/utils";

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

    const isVenueNameTooLong: boolean = props.match.venue_name ? props.match.venue_name.length > 35 : false;

    return (
        <div className="pb-8 md:w-96">
            {showSerieName &&
                <p className="font-bold">{series[sortedSeries.indexOf(props.match.serie_reference)].toUpperCase()}</p>}
            <div className="grid grid-cols-3 ssm:grid-cols-12 grid-rows-7 ssm:grid-rows-5 grid-flow-col">
                <p className="col-span-2 ssm:row-span-1 ssm:col-span-3 hidden ssm:block"></p>
                <p className="col-span-2 ssm:col-span-3">{props.match.reference}</p>
                <p className="border col-span-2 ssm:col-span-3">{formatDate} - {formatTime}</p>
                <p className={cn("border col-span-2 ssm:col-span-3 w-[95%] ssm:row-span-2", isVenueNameTooLong ? "row-span-2" : "row-span-1")}>{props.match.venue_name}</p>
                <div className="border flex items-end gap-1.5 row-span-1 col-span-2 ssm:row-span-2 ssm:col-span-4">
                    <img
                        src={baseImage + props.match.home_club_logo_img_url}
                        alt={props.match.home_team_short_name}
                        className="w-5 h-5"/>
                    <p>{props.match.home_team_short_name}</p>
                </div>
                <div className={cn("border flex items-start gap-1.5 col-span-2 ssm:row-span-3 ssm:col-span-4")}>
                    <img
                        src={baseImage + props.match.away_club_logo_img_url}
                        alt={props.match.away_team_short_name}
                        className="w-5 h-5"/>
                    <p>{props.match.away_team_short_name}</p>
                </div>
                {props.showScore ?
                    <div
                        className={cn("grid grid-rows-subgrid col-span-2 ssm:row-span-5 ", isVenueNameTooLong ? "row-span-1" : "row-span-2")}>
                        <p className="font-bold underline hidden ssm:block ssm:row-span-1">Score</p>
                        <p className="block ssm:hidden">{props.match.home_score || "x"} - {props.match.away_score || "x"}</p>
                        <p className="hidden ssm:flex ssm:justify-start col-span-1">{props.match.home_score || "x"}</p>
                        <p className="hidden ssm:flex ssm:justify-start col-span-1 ssm:row-span-3">{props.match.away_score || "x"}</p>
                    </div> :
                    <p className={cn("col-span-2 ssm:col-span-1 ssm:row-span-5", isVenueNameTooLong ? "row-span-1" : "row-span-2")}></p>
                }
                <p className="font-bold underline ssm:col-span-2 row-span-1">Referees</p>
                <div className="flex flex-col row-span-2 ssm:row-span-4 ssm:col-span-2">
                    {props.match.referees.length == 0 && <p className="row-span-2">x</p>}
                    {props.match.referees.map((referee) => {
                        if (referee !== null) {
                            return (
                                <p key={referee.id}>
                                    {referee.surname} {referee.firstname.substring(0, 1).toUpperCase()}.
                                </p>
                            );
                        }
                    })}
                </div>
                {props.showDelegates && <p className="font-bold underline ssm:col-span-2">Delegates</p>}
                {props.showDelegates && <div className="row-span-2 ssm:row-span-4 ssm:col-span-2">
                    {!props.match.delegates && <p>x</p>}
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
                }
            </div>
        </div>
    );
};

export default MatchComponent;