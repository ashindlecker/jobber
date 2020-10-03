import axios from 'axios';
import searchResultsParser, { JobSearchItem } from './search-parser'
import jobDescriptionParser from './job-description-parser'

export interface HttpFetcher {
    get(url: string): Promise<{
        data: string
    }>
}

export default class LinkedInAPI {
    private httpFetcher: HttpFetcher;

    constructor(fetcher?: HttpFetcher) {
        if(!fetcher) {
            this.httpFetcher = axios;
        }
        else {
            this.httpFetcher = fetcher;
        }
    }

    public getFetcher() {
        return this.httpFetcher;
    }

    public async getSearchResults(params: { location: string, keywords: string, starting?: number }) {
        if (params.starting === undefined) {
            params.starting = 0;
        }

        const route = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${params.keywords}&location=${params.location}&start=${params.starting}`
        const response = await this.httpFetcher.get(route);

        return searchResultsParser(response.data)
    }

    public async getJobDescription(jobID: string | JobSearchItem) {
        let id = '';
        if (typeof (jobID) === 'string') {
            id = jobID;
        }
        else {
            id = jobID.id
        }

        const route = `https://www.linkedin.com/jobs/view/${id}`;
        const response = await this.httpFetcher.get(route);

        return jobDescriptionParser(response.data);
    }
}