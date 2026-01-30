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
        
        console.log('--- IDs found ---');
        $('[id]').each((i, el) => {
            const id = $(el).attr('id');
            if(id && (id.includes('trend') || id.includes('pop') || id.includes('top'))) {
                console.log(`ID: ${id}`);
            }
        });

        console.log('\n--- Section Headers ---');
        $('.block_area-header').each((i, el) => {
             console.log($(el).text().trim());
        });

        console.log('\n--- Trending (Top Slider) ---');
        // Usually the top slider has specific classes
        const sliderItems = $('#slider .swiper-slide .film-title, #trending-home .swiper-slide .film-title');
        console.log(`Found ${sliderItems.length} slider items`);
        sliderItems.each((i, el) => {
            if(i < 3) console.log($(el).text().trim());
        });

        console.log('\n--- Most Popular (Sidebar or Section) ---');
        const popularItems = $('#most-popular .film-name, .most-popular .film-name');
        console.log(`Found ${popularItems.length} popular items`);
        
    } catch (e) {
        console.error(e);
    }
}

run();
