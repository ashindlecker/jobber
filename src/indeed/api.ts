import axios from 'axios';
import searchResultsParser, { JobSearchItem } from './search-parser'
import jobDescriptionParser from './job-description-parser'

/**
 * Performs Get requests to URLs and returns a promise to a string of data as a response
 */
export interface HttpFetcher {
    get(url: string): Promise<{
        data: string
    }>
}
export type SearchParameters = {
    location: string, 
    keywords: string, 
    page?: number
}
/**
 * LinkedInAPI performs searches and gets details of a LinkedIn job
 */
export default class IndeedAPI {
    private httpFetcher: HttpFetcher;

    constructor(fetcher?: HttpFetcher) {
        if (!fetcher) {
            this.httpFetcher = axios;
        }
        else {
            this.httpFetcher = fetcher;
        }
    }

    public getFetcher() {
        return this.httpFetcher;
    }

    /**
     * Perform a LinkedIn job search
     * @param params 
     */
    public async getSearchResults(params: SearchParameters) {
        if (params.page === undefined) {
            params.page = 0;
        }

        const route = `https://www.indeed.com/jobs?q=${params.keywords}&l=${params.location}&start=${params.page * 10}`
        const response = await this.httpFetcher.get(route);

        return searchResultsParser(response.data)
    }

    /**
     * Get description of a specific job
     * @param jobID string id of LinkedIn job, or JobSearchItem object
     */
    public async getJobDescription(jobID: string | JobSearchItem) {
        let id = '';
        if (typeof (jobID) === 'string') {
            id = jobID;
        }
        else {
            id = jobID.id
        }

        const route = `https://www.indeed.com/viewjob?jk=${id}`;
        const response = await this.httpFetcher.get(route);

        return jobDescriptionParser(response.data);
    }
}