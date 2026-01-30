const axios = require('axios');
const cheerio = require('cheerio');

const PROXY_BASE = 'https://proxy.animo.qzz.io';
const HIANIME_URL = 'https://hianime.to';

function proxyUrl(path) {
    return `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}${path}`)}`;
}

async function run() {
    try {
        console.log('Fetching home...');
        const { data } = await axios.get(proxyUrl('/home'), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        });
        const $ = cheerio.load(data);
        
        console.log('--- Checking Top Viewed Sections ---');
        console.log('#top-viewed-day exists:', $('#top-viewed-day').length > 0);
        console.log('#top-viewed-week exists:', $('#top-viewed-week').length > 0);
        console.log('#top-viewed-month exists:', $('#top-viewed-month').length > 0);

        const monthSection = $('#top-viewed-month');
        if (monthSection.length > 0) {
            console.log('\n--- #top-viewed-month HTML (first 500 chars) ---');
            console.log(monthSection.html().substring(0, 500));
            
            console.log('\n--- Checking list items ---');
            const items = monthSection.find('ul li');
            console.log(`Found ${items.length} items in ul li`);
            
            if (items.length === 0) {
                console.log('Trying direct children or other structure...');
                console.log(monthSection.children().map((i, el) => el.tagName).get().join(', '));
            }
        } else {
             console.log('Trying to find any block with "Top 10"...');
             $('.block_area-header').each((i, el) => {
                 if ($(el).text().includes('Top 10')) {
                     console.log('Found Top 10 Header. Parent class:', $(el).parent().attr('class'));
                     console.log('Next sibling HTML start:', $(el).next().html()?.substring(0, 100));
                 }
             });
        }

    } catch (e) {
        console.error(e);
    }
}

run();
