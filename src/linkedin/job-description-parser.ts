import cheerio from 'cheerio'
import turndown from 'turndown'

/**
 * Additional information for a LinkedIn Job
 * 
 * IE: Employment Type, Seniority Level, Industry
 */
export type JobCriteriaItem = {
    name: string;
    value: string[];
}

/**
 * Description of a LinkedIn Job
 */
export type JobDescription = {
    /**
     * Name of job
     */
    title: string;
    /**
     * Company posting this job
     */
    company: string;
    /**
     * Entire description of the job in markdown format
     */
    descriptionMarkdown: string;
    criteria: JobCriteriaItem[]
}

function jobCriteriaListParser($: cheerio.Cheerio): JobCriteriaItem[] {
    return $.find('.job-criteria__item').toArray().map((element) => {
        const $ = cheerio.load(element);
        
        return {
            name: $('.job-criteria__subheader').text(),
            value: $('.job-criteria__text').toArray().map((e) => cheerio.load(e).root().text())
        }
    })
}

/**
 * Take the HTML of a LinkedIn job posting, and return a JobDescription
 * @param html html of the job posting
 */
export default function jobDescriptionParser(html: string): JobDescription {
    const $ = cheerio.load(html);
    
    const descriptionHtml = $('.show-more-less-html__markup').html() || '';
    return {
        title: $('.topcard__title').text(),
        company: $('.topcard__org-name-link').text(),
        descriptionMarkdown: new turndown().turndown(descriptionHtml),
        criteria: jobCriteriaListParser($('.job-criteria__list'))
    }
}