import axios from 'axios'
import LinkedInAPI from './linkedin/api';

(async () => {
    const api = new LinkedInAPI(axios);

    const results = await api.GetSearchResults({
        location: 'Arizona',
        keywords: 'JavaScript',
        starting: 0
    });

    const all = Promise.all(results.map((item) => {
        return api.GetJobDescription(item);
    }))

    const jobs = await all;
    console.log(JSON.stringify(jobs, null, 2));
})();