import cheerio from 'cheerio'
import turndown from 'turndown'


export type JobCriteriaItem = {
    name: string;
    value: string[];
}

export type JobDescription = {
    title: string;
    company: string;
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