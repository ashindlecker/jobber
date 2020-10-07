import cheerio from 'cheerio'
import turndown from 'turndown'

export type JobDescription = {
    title: string,
    descriptionMarkDown: string,
}
/**
 * Takes the html of an Indeed job description and returns a JobDescription
 * @param html
 */
function jobDescriptionParser(html: string): JobDescription {
    const $ = cheerio.load(html);

    return {
        title: $('.jobsearch-JobInfoHeader-title').text(),
        descriptionMarkDown: new turndown().turndown($('#jobDescriptionText').html() || '')
    }
}

export default jobDescriptionParser;