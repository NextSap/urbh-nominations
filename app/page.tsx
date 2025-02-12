"use client"

import {useEffect, useState, useTransition} from "react";
import {series, sortedSeries} from "@/services/urbh.service";
import {MatchType} from "@/schemes/match.scheme";
import {addDays, format, startOfWeek} from "date-fns";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
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
import MatchComponent from "@/components/match.component";
import LoaderComponent from "@/components/loader.component";
import Image from "next/image";
import {getCachedMatches} from "@/lib/actions/matches.action";

const MainComponent = () => {
    const [weeklyMatches, setWeeklyMatches] = useState<Record<string, MatchType[]>>({});
    const [isPending, startTransition] = useTransition();
    const [refereeFilter, setRefereeFilter] = useState<string>("");
    const [teamFilter, setTeamFilter] = useState<string>("");
    const [selectedSeries, setSelectedSeries] = useState<{ [key: string]: boolean }>({});
    const [showScore, setShowScore] = useState<boolean>(false);
    const [showDelegates, setShowDelegates] = useState<boolean>(true);

    useEffect(() => {
        const internalSelectedSeries = getStoredSelectedSeries();
        setSelectedSeries(internalSelectedSeries);

        startTransition(() => {
            getCachedMatches().then((matches) => {
                const groupedByWeek: Record<string, MatchType[]> = groupByWeekend(matches, internalSelectedSeries);
                setWeeklyMatches(groupedByWeek);
            });
        });
    }, []);

    const filteredMatches = (matches: MatchType[]) => {
        if (refereeFilter == "" && teamFilter == "") {
            return matches;
        }
        return matches.filter((match) => {
            let show: boolean = false;
            if (refereeFilter !== "") {
                match.referees.forEach((referee) => {
                    if (referee !== null)
                        show = show || (referee.surname.toLowerCase().includes(refereeFilter.toLowerCase()) ||
                            referee.firstname.toLowerCase().includes(refereeFilter.toLowerCase()));
                });
                showDelegates && match.delegates?.forEach((delegate) => {
                    if (delegate !== null) {
                        show = show || (delegate.surname.toLowerCase().includes(refereeFilter.toLowerCase()) ||
                            delegate.firstname.toLowerCase().includes(refereeFilter.toLowerCase()));
                    }
                });
            }

            if (teamFilter !== "") {
                const homeTeamName = match.home_team_short_name?.toLowerCase() || "";
                const awayTeamName = match.away_team_short_name?.toLowerCase() || "";
                show = show || homeTeamName.includes(teamFilter.toLowerCase()) || awayTeamName.includes(teamFilter.toLowerCase());
            }

            return show;
        });
    };

    return (
        isPending ? <LoaderComponent/> : (
            <div className="flex flex-col gap-1.5 p-3">
                <Sheet onOpenChange={(open) => {
                    if (!open) window.location.reload();
                }}>
                    <Image className="m-auto" src={"/urbh_logo.png"} alt={"URBH Logo"} width={50} height={50}/>
                    <h1 className="flex justify-center font-bold text-2xl w-full text-center">Belgian Referees
                        Nominations</h1>
                    <div className="my-1.5">
                        <Label htmlFor="refereeFilter">Filter by referee or delegate</Label>
                        <Input id="refereeFilter" value={refereeFilter}
                               onChange={(event) => setRefereeFilter(event.target.value)}/>
                    </div>
                    <div className="my-1.5">
                        <Label htmlFor="teamFilter">Filter by team</Label>
                        <Input id="teamFilter" value={teamFilter}
                               onChange={(event) => setTeamFilter(event.target.value)}/>
                    </div>
                    <div className="flex gap-1.5 items-center my-1.5">
                        <Checkbox id="showScore" checked={showScore}
                                  onCheckedChange={() => setShowScore(!showScore)}/>
                        <Label htmlFor={"showScore"}>Show score</Label>
                    </div>
                    <div className="flex gap-1.5 items-center my-0.5">
                        <Checkbox id="showDelegates" checked={showDelegates}
                                  onCheckedChange={() => setShowDelegates(!showDelegates)}/>
                        <Label htmlFor={"showDelegates"}>Show delegates</Label>
                    </div>
                    <SheetTrigger asChild>
                        <Button variant="third" className="my-2">Click to display others competitions</Button>
                    </SheetTrigger>
                    <Accordion type="multiple">
                        {Object.entries(weeklyMatches).map(([week, matches]) => {
                            const date = new Date(week);
                            const monday = format(date, "dd/MM/yyyy");
                            const saturday = format(addDays(date, 5), "dd/MM");
                            const sunday = format(addDays(date, 6), "dd/MM");
                            return (
                                <AccordionItem value={week} key={week}>
                                    <AccordionTrigger className="font-bold text-xl">Week of {monday}<br/>Sa {saturday} -
                                        Su {sunday}</AccordionTrigger>
                                    <AccordionContent>
                                        {filteredMatches(matches).map((match, index, sortedMatches) => {
                                            return <MatchComponent key={match.reference + index} match={match}
                                                                   showScore={showScore}
                                                                   showDelegates={showDelegates}
                                                                   index={index}
                                                                   sortedMatches={sortedMatches}/>
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                    <SheetContent side={"left"} className="overflow-auto">
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

const groupByWeekend = (matches: MatchType[], internalSelectedSeries: { [key: string]: boolean }) => {
    const groupedByWeek: Record<string, MatchType[]> = {};
    matches.forEach((match) => {
        if (!internalSelectedSeries[match.serie_reference]) return;

        const weekStart = startOfWeek(new Date(match.date), {weekStartsOn: 1}); // Lundi
        const weekKey = format(weekStart, "yyyy/MM/dd");

        if (!groupedByWeek[weekKey]) {
            groupedByWeek[weekKey] = [];
        }
        groupedByWeek[weekKey].push(match);
    });

    Object.keys(groupedByWeek).forEach((weekKey) => {
        groupedByWeek[weekKey].sort((a, b) => a.serie_name.localeCompare(b.serie_name)).sort(
            (a, b) => sortedSeries.indexOf(a.serie_reference) - sortedSeries.indexOf(b.serie_reference)
        );
    });

    return groupedByWeek;
}

export default MainComponent;
