const axios = require('axios');
const cheerio = require('cheerio');

const PROXY_BASE = 'https://proxy.animo.qzz.io';
const HIANIME_URL = 'https://hianime.to';

function proxyUrl(path) {
    return `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}${path}`)}`;
}

async function run() {
    try {
        // Fetch One Piece (known airing anime)
        const id = 'one-piece-100'; 
        console.log(`Fetching details for ${id}...`);
        const { data } = await axios.get(proxyUrl(`/${id}`));
        const $ = cheerio.load(data);
        
        console.log('\n--- Status Section ---');
        // Log the entire item list to see where status is
        $('.anisc-info .item-item').each((i, el) => {
            console.log($(el).text().trim().replace(/\s+/g, ' '));
        });

        console.log('\n--- Next Episode / Time ---');
        // Check for next episode info often found in blocks
        console.log('Film Time:', $('.film-time').text().trim());
        console.log('Next Ep Text:', $('.anisc-info').text().includes('Next') ? 'Found "Next" in info' : 'Not found');
        
        // Sometimes it's in a specific block for airing time
        const airingTime = $('.anisc-info .item-time').text().trim();
        console.log('Item Time:', airingTime);

        console.log('\n--- Raw Overview ---');
        console.log($('.anisc-info-wrap').html()?.substring(0, 500));

    } catch (e) {
        console.error(e);
    }
}

run();
