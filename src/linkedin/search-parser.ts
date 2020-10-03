import cheerio from 'cheerio'

/**
 * JobSearchItem represents an item of a LinkedIn job search
 */
export type JobSearchItem = {
    title: string;
    company: string;
    /**
     * Unique LinkedIn ID of the job
     */
    id: string;
}

function searchResultItemParser(element: cheerio.Element): JobSearchItem {
    const $ = cheerio.load(element);
    return {
        title: $('.job-result-card__title').text(),
        company: $('.job-result-card__subtitle-link').text(),
        id: element.attribs['data-id']
    }
}

/**
 * Take the HTML of a LinkedIn job posting, and return an array of JobSearchItem
 * @param html  html of the search results
 */
export default function searchResultsParser(html: string): JobSearchItem[] {
    const $ = cheerio.load(html);
    const jobListItems = $('li');
    return jobListItems.toArray().map(searchResultItemParser);
}