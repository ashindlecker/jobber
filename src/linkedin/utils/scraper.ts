import LinkedInAPI, { SearchParameters } from "../api";
import { JobDescription } from "../job-description-parser";
import { JobSearchItem } from "../search-parser";

type ScraperResult = {
    searchItem: JobSearchItem
    description: JobDescription
}

type PageScrapeCallback = (results: ScraperResult[]) => boolean;

type ScrapeParameters = {
    callback: PageScrapeCallback
    searchParams: SearchParameters
    incrementIndex: number
}

class Scraper {
    private api: LinkedInAPI;
    constructor(api: LinkedInAPI) {
        this.api = api;
    }
    
    public async scrape(params: ScrapeParameters) {
        const searchItems = await this.api.getSearchResults(params.searchParams);
        const results = await Promise.all(searchItems.map((s) => {
            return (async() => {
                return {
                    searchItem: s,
                    description: await this.api.getJobDescription(s)
                }
            })()
        }))

        const shouldContinue = params.callback(results);
        if(shouldContinue) {
            this.scrape({
                ...params,
                searchParams: {
                    ...params.searchParams,
                    startingIndex: params.searchParams.startingIndex || 0 + params.incrementIndex
                }
            })
        }
    }
}

export default Scraper;