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
        
        console.log('Checking #slider .swiper-slide...');
        const slides = $('#slider .swiper-slide');
        console.log(`Found ${slides.length} slides`);

        if (slides.length > 0) {
            const first = slides.first();
            console.log('--- First Slide HTML ---');
            console.log(first.html());
            console.log('------------------------');
        } else {
            console.log('No #slider found. Dumping #trending-home again to be sure.');
             const tSlides = $('#trending-home .swiper-slide');
             console.log(`Found ${tSlides.length} trending slides`);
        }

    } catch (e) {
        console.error(e);
    }
}

run();