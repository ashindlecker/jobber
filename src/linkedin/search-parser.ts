import cheerio from 'cheerio'

export type JobSearchItem = {
    title: string;
    company: string;
    id: string;
}

export function SearchResultItemParser(element: cheerio.Element): JobSearchItem {
    const $ = cheerio.load(element);
    return {
        title: $('.job-result-card__title').text(),
        company: $('.job-result-card__subtitle-link').text(),
        id: element.attribs['data-id']
    }
}

export default function SearchResultsParser(html: string): JobSearchItem[] {
    const $ = cheerio.load(html);
    const jobListItems = $('li');
    return jobListItems.toArray().map(SearchResultItemParser);
}