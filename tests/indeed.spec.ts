import { openTestFile } from "./test-util";
import searchParser, { JobSearchItem } from '../src/indeed/search-parser'
import jobDescriptionParser, { JobDescription } from "../src/indeed/job-description-parser";

describe('Indeed', () => {
    const sampleSearchResultsHTML = openTestFile(`${__dirname}/test_data/indeed-job-search.html`);
    const sampleDescriptionResultsHTML = openTestFile(`${__dirname}/test_data/indeed-job-description.html`);

    function validateSampleSearchResultsHtml(results: JobSearchItem[]) {
        expect(results.length).toEqual(15);
        
        expect(results[0]).toEqual({
            id: 'b6bbb243dbcf990f',
            title: 'Full stack PHP/Laravel Engineer',
            company: 'Surgio',
            location: 'Scottsdale, AZ 85260 (North Scottsdale area)'
        })
        expect(results[1]).toEqual({
            id: 'ac31d3682a2c80b9',
            title: 'Full Stack Engineer',
            company: 'DSP',
            location: 'Remote'
        })
    }

    function validateSampleDescriptionResultsHtml(description: JobDescription) {
        expect(description.descriptionMarkDown.indexOf(`At Level2, our mission is remission for people with type 2 diabetes`)).not.toEqual(-1);
        expect(description.title).toEqual('Junior Full Stack Engineer');
        
    }

    describe('Parser', () => {
        test('Parse search HTML and return an array of JobSearchItem', () => {
            const results = searchParser(sampleSearchResultsHTML);
            validateSampleSearchResultsHtml(results);
        })

        test('Parse description HTML and return a JobDescription', () => {
            const description = jobDescriptionParser(sampleDescriptionResultsHTML);
            validateSampleDescriptionResultsHtml(description);
        })
    })
});