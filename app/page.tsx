"use client"

import {useEffect, useState} from "react";
import {getMatches} from "@/services/urbh.service";
import {MatchType} from "@/schemes/match.scheme";
import {format, startOfWeek} from "date-fns";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Spinner} from "@heroui/spinner";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Checkbox} from "@/components/ui/checkbox";
import {getStoredSelectedSeries, setStoredSelectedSeries} from "@/utils/localstorage.utils";

const sortedSeries = [
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

const series = [
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

const baseImage = "https://admin.handballbelgium.be/lms_league_ws/public/img/";

export default function Home() {
    const [weeklyMatches, setWeeklyMatches] = useState<Record<string, MatchType[]>>({});
    const [loading, setLoading] = useState(true);
    const [refereeFilter, setRefereeFilter] = useState<string>("");
    const [selectedSeries, setSelectedSeries] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const internalSelectedSeries = getStoredSelectedSeries();
        setSelectedSeries(internalSelectedSeries);
        getMatches(format(new Date(), "yyyy-MM-dd"), "2025-06-30").then((data) => {
            const matches = data.elements;

            // Regroupement par semaine
            const groupedByWeek: Record<string, MatchType[]> = {};
            matches.forEach((match: MatchType) => {
                if (!internalSelectedSeries[match.serie_reference]) return;

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
                    (a, b) => sortedSeries.indexOf(a.serie_reference) - sortedSeries.indexOf(b.serie_reference)
                );
            });

            setWeeklyMatches(groupedByWeek);
            setLoading(false);
        });
    }, []);

    const filteredMatches = (matches: MatchType[]) => {
        if (refereeFilter === "") return matches;
        return matches.filter((match) => {
            return match.referees.some((referee) => {
                if (referee !== null)
                    return referee.firstname.toLowerCase().includes(refereeFilter.toLowerCase()) ||
                        referee.surname.toLowerCase().includes(refereeFilter.toLowerCase());
            });
        });
    };

    return (
        loading ?
            (
                <div className="h-[100vh] flex flex-col gap-3 justify-center items-center">
                    <p>Data are loading...</p>
                    <Spinner/>
                </div>
            ) : (
                <div className="flex flex-col gap-1.5 p-3">
                    <Sheet onOpenChange={(open) => {
                        if(!open) window.location.reload();
                    }}>
                        <SheetTrigger asChild>
                            <Button>Select competitions</Button>
                        </SheetTrigger>

                        <Label htmlFor="refereeFilter">Filter by referee</Label>
                        <Input id="refereeFilter" value={refereeFilter}
                               onChange={(event) => setRefereeFilter(event.target.value)}/>
                        <Accordion type="multiple">
                            {Object.entries(weeklyMatches).map(([week, matches]) => (
                                <AccordionItem value={week} key={week}>
                                    <AccordionTrigger className="font-bold text-xl">Week of {week}</AccordionTrigger>
                                    <AccordionContent>
                                        {filteredMatches(matches).map((match, index, sortedMatches) => {
                                            const showSerieName =
                                                index === 0 || match.serie_reference !== sortedMatches[index - 1].serie_reference;
                                            const formatDate = format(new Date(match.date), "EEEEEE dd/MM/yyyy");

                                            const formatTime = match.time ? match.time.split(":").slice(0, 2).join(":") : "00:00";
                                            return (
                                                <div key={match.reference} className="pb-4 md:w-96">
                                                    {showSerieName &&
                                                        <p className="font-bold">{series[sortedSeries.indexOf(match.serie_reference)].toUpperCase()}</p>}
                                                    <div className="flex">
                                                        <div className="w-[70%]">
                                                            <p>{match.serie_name}</p>
                                                            <p>{formatDate} - {formatTime}</p>
                                                            <div className="flex gap-2">
                                                                <img src={baseImage + match.home_club_logo_img_url}
                                                                     alt={match.home_team_short_name}
                                                                     className="w-6 h-6"/>
                                                                <p>{match.home_team_short_name}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <img src={baseImage + match.away_club_logo_img_url}
                                                                     alt={match.away_team_short_name}
                                                                     className="w-6 h-6"/>
                                                                <p>{match.away_team_short_name}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p>Referees</p>
                                                            {match.referees.map((referee) => {
                                                                if (referee !== null) {
                                                                    return (
                                                                        <p key={referee.id}>
                                                                            {referee.surname} {referee.firstname.substring(0, 1).toUpperCase()}.
                                                                        </p>
                                                                    );
                                                                }
                                                            })}
                                                            {match.referees.every((referee) => referee === null) &&
                                                                <p>No referee</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <SheetContent side={"left"}>
                            <SheetHeader>
                                <SheetTitle>Competitions</SheetTitle>
                                <SheetDescription>
                                    Select the competitions you want to display
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col">
                                {series.map((serie, index) => (
                                    <p key={serie} className="flex items-center gap-2 p-3">
                                        <Checkbox checked={selectedSeries[sortedSeries[index]]} id={serie}
                                                  onCheckedChange={(checked) => {
                                                      const newSelectedSeries = {
                                                          ...selectedSeries,
                                                          [sortedSeries[index]]: Boolean(checked.valueOf())
                                                      };
                                                      setSelectedSeries(newSelectedSeries);
                                                      setStoredSelectedSeries(newSelectedSeries);
                                                  }}/>
                                        <Label htmlFor={serie}>{serie}</Label>
                                    </p>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            ));
}

/*
*
* <div className="flex gap-1.5 items-center">
                                                        <p>{match.home_team_short_name}</p>
                                                        <img src={baseImage + match.home_club_logo_img_url}
                                                             alt={match.home_team_short_name} className="w-6 h-6"/>
                                                        <p className="">10</p>
                                                        <p>-</p>
                                                        <p className="">39</p>
                                                        <img src={baseImage + match.away_club_logo_img_url}
                                                             alt={match.away_team_short_name} className="w-6 h-6"/>
                                                        <p>{match.away_team_short_name}</p>
                                                    </div> */
