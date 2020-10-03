import axios from 'axios'
import JobDescriptionParser from './job-description-parser';
import SearchResultsParser, { JobSearchItem } from './search-parser';

export interface HttpFetcher {
    get(url: string): Promise<{
        data: string
    }>
}

export default class LinkedInAPI {
    private httpFetcher: HttpFetcher;

    constructor(fetcher: HttpFetcher) {
        this.httpFetcher = fetcher;
    }

    public async GetSearchResults(params: { location: string, keywords: string, starting: number }) {
        const route = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${params.keywords}&location=${params.location}&start=${params.starting}`
        const response = await this.httpFetcher.get(route);

        return SearchResultsParser(response.data)
    }

    public async GetJobDescription(parameter: string | JobSearchItem) {
        let id = '';
        if (typeof (parameter) === 'string') {
            id = parameter;
        }
        else {
            id = parameter.id
        }

        const route = `https://www.linkedin.com/jobs/view/${id}`;
        const response = await this.httpFetcher.get(route);

        return JobDescriptionParser(response.data);
    }
}