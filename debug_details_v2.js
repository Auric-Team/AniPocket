const axios = require('axios');
const cheerio = require('cheerio');

const PROXY_BASE = 'https://proxy.animo.qzz.io';
const HIANIME_URL = 'https://hianime.to';

function proxyUrl(path) {
    return `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}${path}`)}`;
}

async function run() {
    try {
        const id = 'one-piece-100'; 
        console.log(`Fetching details for ${id}...`);
        const { data } = await axios.get(proxyUrl(`/${id}`));
        const $ = cheerio.load(data);
        
        console.log('\n--- Searching for "Status" ---');
        $('*').each((i, el) => {
            const text = $(el).clone().children().remove().end().text().trim();
            if (text.includes('Status:')) {
                console.log('Found "Status:" in tag:', el.tagName, 'Class:', $(el).attr('class'));
                console.log('Parent HTML:', $(el).parent().html()?.substring(0, 200));
            }
        });

        console.log('\n--- Searching for "Next Episode" ---');
        // Sometimes it's text like "Next episode airs in..."
        const fullText = $('body').text();
        const nextEpIndex = fullText.indexOf('Next episode');
        if (nextEpIndex !== -1) {
            console.log('Found "Next episode" text nearby:', fullText.substring(nextEpIndex, nextEpIndex + 100).replace(/\s+/g, ' '));
        } else {
            console.log('"Next episode" text not found globally.');
        }

        console.log('\n--- Anisc Info Items ---');
        $('.anisc-info .item').each((i, el) => {
            console.log(`Item ${i}:`, $(el).text().trim().replace(/\s+/g, ' '));
        });

    } catch (e) {
        console.error(e);
    }
}

run();
