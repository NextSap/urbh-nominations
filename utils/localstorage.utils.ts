export const series = {
    "MSHL": true,
    "MFDC": true,
    "MSDC": true,
    "WFDC": true,
    "WFDRC": true,
    "WSDC": true,
    "MBC": true,
    "WBC": true,
    "D1M": false,
    "D1D": false,
    "PM": false,
    "U18": false,
    "xx": false,
    "yy": false,
}

export const setStoredSelectedSeries = (rules: { [key: string]: boolean }) => {
    localStorage.setItem('selectedSeries', JSON.stringify(rules));
}

export const getStoredSelectedSeries = (): { [key: string]: boolean } => {
    const selectedSeries = localStorage.getItem('selectedSeries');
    if (!selectedSeries){
        setStoredSelectedSeries(series);
        return series;
    }

    return JSON.parse(selectedSeries);
}

export const setStoredScoreOption = (show: boolean) => {
    localStorage.setItem('optionsNominationsScore', JSON.stringify(show));
}

export const getStoredScoreOptions = (): boolean => {
    const options = localStorage.getItem('optionsNominationsScore');
    if (!options){
        setStoredScoreOption(true);
        return true;
    }

    return JSON.parse(options);
}

export const setStoredDelegateOption = (show: boolean) => {
    localStorage.setItem('optionsNominationsDelegate', JSON.stringify(show));
}

export const getStoredDelegateOptions = (): boolean => {
    const options = localStorage.getItem('optionsNominationsDelegate');
    if (!options){
        setStoredDelegateOption(true);
        return true;
    }

    return JSON.parse(options);
}