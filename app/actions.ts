'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

const PROXY_BASE = 'https://proxy.animo.qzz.io';
const HIANIME_URL = 'https://hianime.to';

function proxyUrl(path: string): string {
    return `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}${path}`)}`;
}

export interface Server {
    id: string;
    name: string;
    type: 'sub' | 'dub';
}

export async function getEpisodeServers(episodeId: string): Promise<Server[]> {
    try {
        const url = proxyUrl(`/ajax/v2/episode/servers?episodeId=${episodeId}`);
        const { data } = await axios.get(url);
        const html = typeof data === 'string' ? data : data.html;
        const $ = cheerio.load(html);

        const servers: Server[] = [];
        $('.server-item').each((_, el) => {
            const $el = $(el);
            const id = $el.attr('data-id');
            const type = $el.attr('data-type') as 'sub' | 'dub';
            const name = $el.text().trim();

            if (id && type) {
                servers.push({ id, name, type });
            }
        });
        return servers;
    } catch (error) {
        console.error('Error fetching servers:', error);
        return [];
    }
}

export async function getEpisodeSource(serverId: string): Promise<string | null> {
    try {
        const url = proxyUrl(`/ajax/v2/episode/sources?id=${serverId}`);
        const { data } = await axios.get(url);
        // The API returns { link: "...", type: "iframe", ... }
        if (data && data.link) {
            return data.link;
        }
        return null;
    } catch (error) {
        console.error('Error fetching source:', error);
        return null;
    }
}
