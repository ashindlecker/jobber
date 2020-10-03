import SearchParser, { JobSearchItem } from '../src/linkedin/search-parser'
import fs from 'fs'
import LinkedInAPI, { HttpFetcher } from '../src/linkedin/api';
import JobDescriptionParser, { JobDescription } from '../src/linkedin/job-description-parser';

function openTestFile(path: string) {
    return fs.readFileSync(path).toString();
}

describe('LinkedIn', () => {
    const sampleSearchHtml = openTestFile(`${__dirname}/test_data/linkedin-search-page-results.html`);
    const sampleDescriptionHtml = openTestFile(`${__dirname}/test_data/linkedin-job-details.html`);
    const sampleDescriptionHtmlWithoutDescription = openTestFile(`${__dirname}/test_data/linkedin-job-details-no-description.html`);

    function validateParsedSampleSearchHtmlResults(results: JobSearchItem[]) {
        expect(results.length).toEqual(25);
        expect(results[0]).toEqual({
            title: 'Frontend Developer',
            company: 'Exactius',
            id: '2152108066'
        });
        expect(results[1]).toEqual({
            title: 'Front End Web Developer (Remote) - San Francisco',
            company: 'Accelere',
            id: '2174653438'
        });
    }

    function validateParsedSampleDescriptionHtmlResults(result: JobDescription) {
        expect(result.title).toEqual('Web Developer');
        expect(result.company).toEqual('Nintendo');
        expect(result.descriptionMarkdown.indexOf(`Bachelor's degree or equivalent experience in Computer Science`)).not.toEqual(-1);
        expect(result.criteria).toEqual([
            {
                name: 'Seniority level',
                value: ['Entry level']
            },
            {
                name: 'Employment type',
                value: ['Contract']
            },
            {
                name: 'Job function',
                value: ['Engineering', 'Information Technology']
            },
            {
                name: 'Industries',
                value: ['Computer Games']
            }
        ])
    }

    describe('Search Parser', () => {
        test('Parse search results HTML and return a list of JobSearchItem', () => {
            const results = SearchParser(sampleSearchHtml);
            validateParsedSampleSearchHtmlResults(results);
        })
    })

    describe('Job Description Parser', () => {
        test('Parse Job Description HTML and return a JobDescription', () => {
            validateParsedSampleDescriptionHtmlResults(JobDescriptionParser(sampleDescriptionHtml));
            //Jobs with no description should return an empty string
            const result = JobDescriptionParser(sampleDescriptionHtmlWithoutDescription);
            expect(result.descriptionMarkdown).toEqual('');
        });
    })

    describe('Api', () => {
        test('Fetch search results and return JobSearchItem[]', async () => {
            const mockFetcher: HttpFetcher = {
                get: async (url: string) => {
                    return {
                        data: sampleSearchHtml
                    }
                }
            }
            const api = new LinkedInAPI(mockFetcher);
            const results = await api.GetSearchResults({
                location: 'remote',
                keywords: 'javascript',
                starting: 0
            });
            validateParsedSampleSearchHtmlResults(results);
        })
        test('Fetch Job Description results and return JobDescription', async () => {
            const mockFetcher: HttpFetcher = {
                get: async (url: string) => {
                    return {
                        data: sampleDescriptionHtml
                    }
                }
            }
            const api = new LinkedInAPI(mockFetcher);

            validateParsedSampleDescriptionHtmlResults(await api.GetJobDescription(''));
            validateParsedSampleDescriptionHtmlResults(await api.GetJobDescription({title: '', company: '', id: ''}));
        })
    })
})