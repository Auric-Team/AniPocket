
const { searchAnimeFromSite, getAnimeDetails, getEpisodeServers } = require('./lib/hianime');

async function run() {
    try {
        const animeId = 'jujutsu-kaisen-the-culling-game-part-1-20401';
        console.log('Directly checking Anime ID:', animeId);

        const anime = await getAnimeDetails(animeId);
        if (!anime || anime.episodeList.length === 0) {
            console.log('No details or episodes found');
            return;
        }

        const epId = anime.episodeList[0].id;
        console.log('Checking Episode 1 ID:', epId);

        const servers = await getEpisodeServers(epId);
        console.log('Servers found:', servers);

        if (servers.dub) {
            console.log('SUCCESS: Dub detected correctly.');
        } else {
            console.log('WARNING: Dub NOT detected (unexpected for Naruto).');
        }
    } catch (e) {
        console.error(e);
    }
}

run();
