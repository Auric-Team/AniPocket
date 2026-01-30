const axios = require('axios');
const cheerio = require('cheerio');

const PROXY_BASE = 'https://proxy.animo.qzz.io';
const HIANIME_URL = 'https://hianime.to';

function proxyUrl(path) {
    return `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}${path}`)}`;
}

async function run() {
    try {
        console.log('Fetching /top-airing...');
        const { data } = await axios.get(proxyUrl('/top-airing'), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        });
        const $ = cheerio.load(data);
        
        console.log('Checking .film_list-wrap .flw-item...');
        const items = $('.film_list-wrap .flw-item');
        console.log(`Found ${items.length} items`);

        if (items.length > 0) {
            const first = items.first();
            console.log('--- First Item HTML ---');
            console.log(first.html().substring(0, 500));
            console.log('------------------------');
        }

    } catch (e) {
        console.error(e);
    }
}

run();