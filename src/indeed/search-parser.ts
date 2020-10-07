import { SearchParameters } from "../linkedin/api";

import cheerio from 'cheerio'

export type JobSearchItem = {
    /**
     * Unique Indeed Id of the job
     */
    id: string;
    title: string;
    company: string;
    location: string;
}

/**
 * Takes Indeed search html results and returns an array of JobSearchItem
 * @param html Indeed search html response
 */
function searchParser(html: string): JobSearchItem[] {
    const $ = cheerio.load(html);

    const jobSearchCards = $('.jobsearch-SerpJobCard').toArray();

    const removeNewlines = (str: string) => str.replace(/(\r\n|\n|\r)/gm, '')
    return jobSearchCards.map((element) => {
        const $ = cheerio.load(element);

        return {
            id: element.attribs['data-jk'],
            title: removeNewlines($('.title a').text()),
            company: removeNewlines($('.company').text()),
            location: removeNewlines($('.location').text())
        }
    })
}

export default searchParser;