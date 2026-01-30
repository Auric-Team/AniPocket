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
        const { data: homeData } = await axios.get(proxyUrl('/home'));
        const $ = cheerio.load(homeData);
        
        console.log('\n--- Trending Home (#trending-home) ---');
        const trendingItems = $('#trending-home .swiper-slide');
        console.log(`Found ${trendingItems.length} trending items`);
        if (trendingItems.length > 0) {
            console.log(trendingItems.first().html().substring(0, 300));
        }

        console.log('\n--- Fetching /most-favorite ---');
        try {
            const { data: favData } = await axios.get(proxyUrl('/most-favorite'));
            const $fav = cheerio.load(favData);
            const favItems = $fav('.film_list-wrap .flw-item');
            console.log(`Found ${favItems.length} most favorite items`);
        } catch(e) { console.log('Most favorite failed', e.message); }

        console.log('\n--- Fetching /completed ---');
        try {
            const { data: compData } = await axios.get(proxyUrl('/completed'));
            const $comp = cheerio.load(compData);
            const compItems = $comp('.film_list-wrap .flw-item');
            console.log(`Found ${compItems.length} completed items`);
        } catch(e) { console.log('Completed failed', e.message); }

    } catch (e) {
        console.error(e);
    }
}

run();
