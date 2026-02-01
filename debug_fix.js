const axios = require('axios');
const cheerio = require('cheerio');

const PROXY_BASE = 'https://proxy.animo.qzz.io';
const HIANIME_URL = 'https://hianime.to';

function proxyUrl(path) {
    return `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}${path}`)}`;
}

async function run() {
    try {
        const id = 'sakamoto-days-19431';
        console.log(`Fetching details for ${id}...`);
        
        const { data: pageData } = await axios.get(proxyUrl(`/${id}`));
        const $ = cheerio.load(pageData);
        
        console.log('Page Title:', $('title').text());
        
        // Try to find the "Next Episode" or "Aired" info
        // It's usually in .anisc-info .item-item
        
        $('.anisc-info .item-item').each((i, el) => {
            const $el = $(el);
            const label = $el.find('.item-title').text().trim();
            const value = $el.find('.item-text').text().trim() || $el.find('.name').text().trim();
            console.log(`${label}: ${value}`);
        });

        // Check for countdown in script variables
        // HiAnime often uses `var targetDate = ...`
        $('script').each((i, el) => {
             const js = $(el).html();
             if (js && (js.includes('targetDate') || js.includes('countDown'))) {
                 console.log('Found Countdown Script:', js.substring(0, 200));
             }
        });

    } catch (e) {
        console.error(e);
    }
}

run();
