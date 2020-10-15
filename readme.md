# Jobber
#### 3rd party library to fetch jobs from LinkedIn and Indeed
<br/>

## Installation

**npm**

`npm install jobberjs`

**yarn**

`yarn install jobberjs`

## Usage
Fetch Full Stack positions in New York and get the job description of the first result:
```javascript

const jobberjs = require('jobberjs');

(async() => {
    //Instanciate a new LinkedInAPI
    const linkedIn = new jobberjs.LinkedInAPI();

    const searchCriteria = {
        location: 'New York',
        keywords: 'Full Stack',
        starting: 0 //Optional starting index, defaults to 0 if undefined
    }

    // Fetch Full Stack positions in New York
    const jobSearchItems = await linkedIn.getSearchResults(searchCriteria);
    /*
    jobSearchItems =>
    [
        {
            title: 'Full Stack Engineer - Summer Internship',
            company: 'Spotify',
            id: '2166678520'
        },
        ...
    ]
    */
    
    const firstJobDescription = await linkedIn.getJobDescription(jobSearchItems[0]);
    /*
    jobDescription =>
    {
        title: 'Full Stack Engineer - Summer Internship',
        company: 'Spotify',
        descriptionMarkdown: <entire markdown of the job description as a string>,
        criteria: [
            { name: 'Seniority level', value: [ 'Not Applicable' ] },
            { name: 'Employment type', value: [ 'Internship' ] },
            {
                name: 'Job function',
                value: [ 'Engineering', 'Information Technology' ]
            },
            {
                name: 'Industries',
                value: [ 'Marketing and Advertising', 'Computer Software', 'Internet' ]
            }
        ]
    }
    */
})()
```

## Types

**JobDescription**

*Defined in [linkedin/job-description-parser.ts:17](https://github.com/ashindlecker/jobber/tree/master/src/linkedin/job-description-parser.ts#L17)*

Description of a LinkedIn Job

#### Type declaration:

Name | Type | Description |
------ | ------ | ------ |
`company` | string | Company posting this job |
`criteria` | `JobCriteriaItem[]` | - |
`descriptionMarkdown` | string | Entire description of the job in markdown format |
`title` | string | Name of job |

---
**JobCriteriaItem**

*Defined in [linkedin/job-description-parser.ts:9](https://github.com/ashindlecker/jobber/tree/master/src/linkedin/job-description-parser.ts#L9)*

Additional information for a LinkedIn Job

IE: Employment Type, Seniority Level, Industry

#### Type declaration:

Name | Type |
------ | ------ |
`name` | string |
`value` | string[] |

---
**JobSearchItem**

*Defined in [linkedin/search-parser.ts:6](https://github.com/ashindlecker/jobber/tree/master/src/linkedin/search-parser.ts#L6)*

JobSearchItem represents an item of a LinkedIn job search

#### Type declaration:

Name | Type | Description |
------ | ------ | ------ |
`company` | string | - |
`id` | string | Unique LinkedIn ID of the job |
`title` | string | - |
