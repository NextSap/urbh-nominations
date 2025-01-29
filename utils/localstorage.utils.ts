export const series = {
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