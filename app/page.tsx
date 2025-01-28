"use client"

import {useEffect, useState} from "react";
import {getMatches} from "@/services/urbh.service";
import {MatchType} from "@/schemes/match.scheme";
import {format, startOfWeek} from "date-fns";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

const sortSeries = [
    "First Division Men",
    "Second Division Men",
    "First Division Women",
    "First Division Women (R)",
    "Second Division Women",
    "1/64 Final Men",
    "1/32 Final Men",
    "1/16 Final Men",
    "1/8 Final Men",
    "1/4 Final Men",
    "1/2 Final Men",
    "Final Men",
    "1/64 Final Women",
    "1/32 Final Women",
    "1/16 Final Women",
    "1/8 Final Women",
    "1/4 Final Women",
    "1/2 Final Women",
    "Final Women",
    "Friendly games with ref",
    "Friendly games without ref"
]

export default function Home() {

    const [weeklyMatches, setWeeklyMatches] = useState<Record<string, MatchType[]>>({});

    useEffect(() => {
        getMatches(format(new Date(), "yyyy-MM-dd"), "2025-06-30").then((data) => {
            const matches = data.elements;

            // Regroupement par semaine
            const groupedByWeek: Record<string, MatchType[]> = {};
            matches.forEach((match: MatchType) => {
                const weekStart = startOfWeek(new Date(match.date), {weekStartsOn: 1}); // Lundi
                const weekKey = format(weekStart, "dd-MM-yyyy");

                if (!groupedByWeek[weekKey]) {
                    groupedByWeek[weekKey] = [];
                }
                groupedByWeek[weekKey].push(match);
            });

            // Tri par série dans chaque semaine
            Object.keys(groupedByWeek).forEach((weekKey) => {
                groupedByWeek[weekKey].sort(
                    (a, b) => sortSeries.indexOf(a.serie_name) - sortSeries.indexOf(b.serie_name)
                );
            });

            setWeeklyMatches(groupedByWeek);
        });
    }, []);

    return (
        <div className="flex flex-col gap-1.5">
            {/*matches.sort((a, b) => {
                return sortSeries.indexOf(a.serie_name) - sortSeries.indexOf(b.serie_name);
            }).map((match, index, sortedMatches) => {
                const showSerieName =
                    index === 0 || match.serie_name !== sortedMatches[index - 1].serie_name;

                return (
                    <div key={match.reference}>
                        {showSerieName && <p>{match.serie_name.toUpperCase()}</p>}
                        <p>{match.date} - {match.time} {match.home_team_name} {match.home_score} - {match.away_score} {match.away_team_name}</p>
                        <div className="flex gap-3">
                            {match.referees.map((referee) => {
                                if (referee !== null)
                                    return (
                                        <p key={referee.id}>{referee.firstname} {referee.surname.toUpperCase()}</p>
                                    )
                            })}
                        </div>
                    </div>
                )
            })*/}
            <Accordion className="p-3" type="multiple">
                {Object.entries(weeklyMatches).map(([week, matches]) => (
                    <AccordionItem value={week} key={week}>
                        <AccordionTrigger className="font-bold text-xl">Week of {week}</AccordionTrigger>
                        <AccordionContent>
                            {matches.map((match, index, sortedMatches) => {
                                const showSerieName =
                                    index === 0 || match.serie_name !== sortedMatches[index - 1].serie_name;
                                const formatDate = format(new Date(match.date), "dd/MM/yyyy");
                                const formatTime = match.time.split(":").slice(0, 2).join(":");
                                return (
                                    <div key={match.reference} className="pl-4 pb-4">
                                        {showSerieName && <p className="font-bold">{match.serie_name.toUpperCase()}</p>}
                                        <p>{formatDate} - {formatTime}</p>
                                        <p>{match.home_team_short_name} {match.home_score} -{" "}{match.away_score} {match.away_team_short_name}</p>
                                        <div>
                                            {match.referees.map((referee) => {
                                                if (referee !== null) {
                                                   return (
                                                       <p key={referee.id}>
                                                           {referee.firstname} {referee.surname.toUpperCase()}
                                                       </p>
                                                   );
                                                }
                                            })}
                                            {match.referees.every((referee) => referee === null) && <p>No referee</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
