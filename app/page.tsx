import React from 'react';
import MainComponent from "@/components/main.component";
import {getCachedMatches} from "@/lib/cache";

export default async function Page() {
    const matches = await getCachedMatches();

    return <MainComponent matches={matches}/>
};