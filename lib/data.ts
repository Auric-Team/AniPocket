// Mock anime data with real episode IDs for video playback
import { Anime, AnimeDetails, Episode } from './types';

// Popular anime with real hianime episode IDs
export const ANIME_DATA: AnimeDetails[] = [
    {
        id: 'jujutsu-kaisen-tv-534',
        title: 'Jujutsu Kaisen',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFbgZ.jpg',
        type: 'TV',
        synopsis: 'Yuji Itadori is an unnaturally fit high school student living in Sendai. On the night his grandfather dies, Yuji\'s friends find a rotting cursed finger at their school, attracting curses. Yuji swallows the finger to protect them and becomes the host of Ryomen Sukuna, a powerful curse.',
        genres: ['Action', 'Fantasy', 'Supernatural'],
        status: 'Completed',
        aired: 'Oct 2020',
        rating: '8.7',
        episodes: { sub: 24, dub: 24 },
        totalEpisodes: 24,
        episodeList: [
            { id: '88837', number: 1, title: 'Ryomen Sukuna' },
            { id: '88838', number: 2, title: 'For Myself' },
            { id: '88839', number: 3, title: 'Girl of Steel' },
            { id: '89056', number: 4, title: 'Curse Womb Must Die' },
            { id: '89057', number: 5, title: 'Curse Womb Must Die -II-' },
            { id: '91098', number: 6, title: 'After Rain' },
            { id: '91099', number: 7, title: 'Assault' },
            { id: '91564', number: 8, title: 'Boredom' },
            { id: '91900', number: 9, title: 'Small Fry and Reverse Retribution' },
            { id: '92265', number: 10, title: 'Idle Transfiguration' },
        ],
    },
    {
        id: 'demon-slayer-kimetsu-no-yaiba-38',
        title: 'Demon Slayer: Kimetsu no Yaiba',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTc93blC.jpg',
        type: 'TV',
        synopsis: 'Since ancient times, rumors have said that man-eating demons lurk in the woods. Tanjiro works as a charcoal seller to support his family after his father\'s death. One day, he returns home to find his entire family slaughtered, except for his sister Nezuko who has been turned into a demon.',
        genres: ['Action', 'Fantasy', 'Supernatural'],
        status: 'Completed',
        aired: 'Apr 2019',
        rating: '8.6',
        episodes: { sub: 26, dub: 26 },
        totalEpisodes: 26,
        episodeList: [
            { id: '32787', number: 1, title: 'Cruelty' },
            { id: '32788', number: 2, title: 'Trainer Sakonji Urokodaki' },
            { id: '32789', number: 3, title: 'Sabito and Makomo' },
            { id: '32790', number: 4, title: 'Final Selection' },
            { id: '32791', number: 5, title: 'My Own Steel' },
            { id: '35063', number: 6, title: 'Swordsman Accompanying a Demon' },
            { id: '35064', number: 7, title: 'Muzan Kibutsuji' },
            { id: '35658', number: 8, title: 'The Smell of Enchanting Blood' },
            { id: '36157', number: 9, title: 'Temari Demon and Arrow Demon' },
            { id: '36158', number: 10, title: 'Together Forever' },
        ],
    },
    {
        id: 'attack-on-titan-112',
        title: 'Attack on Titan',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg',
        type: 'TV',
        synopsis: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
        genres: ['Action', 'Drama', 'Fantasy'],
        status: 'Completed',
        aired: 'Apr 2013',
        rating: '9.0',
        episodes: { sub: 25, dub: 25 },
        totalEpisodes: 25,
        episodeList: [
            { id: '807', number: 1, title: 'To You, in 2000 Years: The Fall of Shiganshina, Part 1' },
            { id: '808', number: 2, title: 'That Day: The Fall of Shiganshina, Part 2' },
            { id: '809', number: 3, title: 'A Dim Light Amid Despair: Humanity\'s Comeback, Part 1' },
            { id: '810', number: 4, title: 'The Night of the Closing Ceremony: Humanity\'s Comeback, Part 2' },
            { id: '811', number: 5, title: 'First Battle: The Struggle for Trost, Part 1' },
            { id: '812', number: 6, title: 'The World the Girl Saw: The Struggle for Trost, Part 2' },
            { id: '813', number: 7, title: 'Small Blade: The Struggle for Trost, Part 3' },
            { id: '814', number: 8, title: 'I Can Hear His Heartbeat: The Struggle for Trost, Part 4' },
            { id: '815', number: 9, title: 'Whereabouts of His Left Arm: The Struggle for Trost, Part 5' },
            { id: '816', number: 10, title: 'Response: The Struggle for Trost, Part 6' },
        ],
    },
    {
        id: 'one-piece-21',
        title: 'One Piece',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg',
        type: 'TV',
        synopsis: 'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. His execution brought a change throughout the world, inspiring countless souls to pursue their dreams and set sail to find his legendary treasure, One Piece.',
        genres: ['Action', 'Adventure', 'Comedy'],
        status: 'Ongoing',
        aired: 'Oct 1999',
        rating: '8.9',
        episodes: { sub: 1100, dub: 900 },
        totalEpisodes: 10,
        episodeList: [
            { id: '1', number: 1, title: 'I\'m Luffy! The Man Who\'s Gonna Be King of the Pirates!' },
            { id: '2', number: 2, title: 'Enter the Great Swordsman! Pirate Hunter Roronoa Zoro!' },
            { id: '3', number: 3, title: 'Morgan versus Luffy! Who\'s the Mysterious Pretty Girl?' },
            { id: '4', number: 4, title: 'Luffy\'s Past! Enter Red-Haired Shanks!' },
            { id: '5', number: 5, title: 'A Terrifying Mysterious Power! Captain Buggy, the Clown Pirate!' },
            { id: '6', number: 6, title: 'Desperate Situation! Beast Tamer Mohji vs. Luffy!' },
            { id: '7', number: 7, title: 'Epic Showdown! Swordsman Zoro vs. Acrobat Cabaji!' },
            { id: '8', number: 8, title: 'Who is the Victor? Devil Fruit Power Showdown!' },
            { id: '9', number: 9, title: 'The Honorable Liar? Captain Usopp!' },
            { id: '10', number: 10, title: 'The Weirdest Guy Ever! Jango the Hypnotist!' },
        ],
    },
    {
        id: 'naruto-20',
        title: 'Naruto',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-LxrhhIQyiE60.jpg',
        type: 'TV',
        synopsis: 'In another world, ninja are the ultimate power, and in the Village Hidden in the Leaves live the stealthiest ninja in the land. Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage.',
        genres: ['Action', 'Adventure', 'Shounen'],
        status: 'Completed',
        aired: 'Oct 2002',
        rating: '8.3',
        episodes: { sub: 220, dub: 220 },
        totalEpisodes: 10,
        episodeList: [
            { id: '11', number: 1, title: 'Enter: Naruto Uzumaki!' },
            { id: '12', number: 2, title: 'My Name is Konohamaru!' },
            { id: '13', number: 3, title: 'Sasuke and Sakura: Friends or Foes?' },
            { id: '14', number: 4, title: 'Pass or Fail: Survival Test' },
            { id: '15', number: 5, title: 'You Failed! Kakashi\'s Final Decision' },
            { id: '16', number: 6, title: 'A Dangerous Mission! Journey to the Land of Waves!' },
            { id: '17', number: 7, title: 'The Assassin of the Mist!' },
            { id: '18', number: 8, title: 'The Oath of Pain' },
            { id: '19', number: 9, title: 'Kakashi: Sharingan Warrior!' },
            { id: '20', number: 10, title: 'The Forest of Chakra' },
        ],
    },
    {
        id: 'my-hero-academia-21459',
        title: 'My Hero Academia',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21459-RoPwgrZ32gM3.jpg',
        type: 'TV',
        synopsis: 'In a world where 80% of humans have superpowers called "Quirks," Izuku Midoriya is born without any powers. Despite this, he dreams of becoming a hero like his idol All Might, the greatest hero of all time.',
        genres: ['Action', 'Comedy', 'Superhero'],
        status: 'Ongoing',
        aired: 'Apr 2016',
        rating: '8.4',
        episodes: { sub: 13, dub: 13 },
        totalEpisodes: 10,
        episodeList: [
            { id: '19842', number: 1, title: 'Izuku Midoriya: Origin' },
            { id: '19843', number: 2, title: 'What It Takes to Be a Hero' },
            { id: '19844', number: 3, title: 'Roaring Muscles' },
            { id: '19845', number: 4, title: 'Start Line' },
            { id: '19846', number: 5, title: 'What I Can Do For Now' },
            { id: '19847', number: 6, title: 'Rage, You Damned Nerd' },
            { id: '19848', number: 7, title: 'Deku vs. Kacchan' },
            { id: '19849', number: 8, title: 'Bakugo\'s Start Line' },
            { id: '19850', number: 9, title: 'Yeah, Just Do Your Best, Ida!' },
            { id: '19851', number: 10, title: 'Encounter with the Unknown' },
        ],
    },
];

// Get all anime (for homepage)
export function getAllAnime(): Anime[] {
    return ANIME_DATA.map(({ episodeList, totalEpisodes, ...anime }) => anime);
}

// Get anime by ID (for details page)
export function getAnimeById(id: string): AnimeDetails | undefined {
    return ANIME_DATA.find(anime => anime.id === id);
}

// Search anime by title
export function searchAnime(query: string): Anime[] {
    const lowerQuery = query.toLowerCase();
    return ANIME_DATA
        .filter(anime => anime.title.toLowerCase().includes(lowerQuery))
        .map(({ episodeList, totalEpisodes, ...anime }) => anime);
}

// Get episode by ID
export function getEpisodeById(animeId: string, episodeId: string): Episode | undefined {
    const anime = getAnimeById(animeId);
    return anime?.episodeList.find(ep => ep.id === episodeId);
}
