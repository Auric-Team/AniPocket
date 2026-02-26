import axios from 'axios';
import * as cheerio from 'cheerio';
import CryptoJS from 'crypto-js';
import crypto from 'crypto';

const PROXY_BASE = 'https://cors.eu.org';

const MEGA_KEYS = {
    mega: 'nTAygRRNLS3wo82OtMyfPrWgD9K2UIvcwlj',
    mega2: 'c10院士2024MySql_Master_Key',
    rabbit: '3AlttPAF1Zwn2l63meMeGMIvlWOXgm9ZXNk3glEzLTGOr1F113',
};

interface VideoSource {
    url: string;
    type: 'm3u8' | 'mp4';
    encrypted: boolean;
    embedUrl: string;
    referer?: string;
    sourceName?: string;
}

async function fetchWithProxy(url: string, referer: string = 'https://hianime.to/', timeout: number = 8000) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': referer,
            },
            timeout,
        });
        return response.data;
    } catch (error) {
        console.error('[VideoSource] Fetch error:', error);
        return null;
    }
}

function simpleDecrypt(encrypted: string, key: string): string {
    try {
        const result: string[] = [];
        for (let i = 0; i < encrypted.length; i++) {
            result.push(String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)));
        }
        return atob(result.join(''));
    } catch (e) {
        return '';
    }
}

export async function getVideoSource(embedUrl: string): Promise<VideoSource | null> {
    try {
        console.log('[VideoSource] Fetching embed URL:', embedUrl);
        
        let fetchUrl = embedUrl;
        if (embedUrl.startsWith('//')) {
            fetchUrl = 'https:' + embedUrl;
        }

        let referer = 'https://hianime.to/';
        
        if (fetchUrl.includes('megacloud')) {
            referer = 'https://megacloud.tv';
            
            const kMatch = fetchUrl.match(/[?&]k=([^&]+)/);
            if (kMatch && kMatch[1]) {
                console.log('[VideoSource] Found megacloud k param:', kMatch[1]);
                const megaSource = await extractMegaCloudFromEmbed(fetchUrl, kMatch[1]);
                if (megaSource) {
                    return megaSource;
                }
            }
            
            const megaSource = await extractMegaCloudSource(fetchUrl);
            if (megaSource) {
                return megaSource;
            }
        } else if (fetchUrl.includes('streamtape')) {
            referer = 'https://streamtape.com';
        } else if (fetchUrl.includes('doodstream')) {
            referer = 'https://doodstream.com';
        } else if (fetchUrl.includes('vidplay')) {
            referer = 'https://vidplay.site';
        }

        const html = await fetchWithProxy(fetchUrl, referer, 5000);
        
        if (!html) {
            return { url: embedUrl, type: 'm3u8', encrypted: false, embedUrl, referer };
        }

        const $ = cheerio.load(html);
        let videoUrl = '';
        let encrypted = false;

        $('script').each((_, el) => {
            const src = $(el).html() || '';
            
            const patterns = [
                /file:\s*["']([^"']+\.m3u8[^"']*)["']/,
                /src:\s*["']([^"']+\.m3u8[^"']*)["']/,
                /url:\s*["']([^"']+\.m3u8[^"']*)["']/,
            ];
            
            for (const pattern of patterns) {
                const match = src.match(pattern);
                if (match && match[1] && !match[1].includes('iframe')) {
                    videoUrl = match[1];
                    break;
                }
            }
            
            if (src.includes('encrypted')) {
                encrypted = true;
            }
        });

        if (videoUrl) {
            return { url: videoUrl, type: 'm3u8', encrypted, embedUrl, referer };
        }

        return { url: embedUrl, type: 'm3u8', encrypted: false, embedUrl, referer };
        
    } catch (error) {
        console.error('[VideoSource] Error:', error);
        return null;
    }
}

export async function getHianimeSource(episodeId: string, serverType: 'sub' | 'dub' = 'sub'): Promise<VideoSource | null> {
    try {
        const serversUrl = `${PROXY_BASE}/https://hianime.to/ajax/v2/episode/servers?episodeId=${episodeId}`;
        const { data } = await axios.get(serversUrl, { timeout: 10000 });
        
        const html = typeof data === 'string' ? data : data.html || '';
        const $ = cheerio.load(html);
        
        const servers: { id: string; name: string; type: string }[] = [];
        
        $('.server-item').each((_, el) => {
            const id = $(el).attr('data-id');
            const type = $(el).attr('data-type') || 'sub';
            const name = $(el).text().trim();
            
            if (id) {
                servers.push({ id, name, type });
            }
        });

        console.log('[VideoSource] Available servers:', servers);

        for (const server of servers.slice(0, 2)) {
            if (server.type !== serverType && serverType !== 'sub') continue;
            
            const sourceUrl = `${PROXY_BASE}/https://hianime.to/ajax/v2/episode/sources?id=${server.id}`;
            const sourceData = await axios.get(sourceUrl, { timeout: 10000 });
            
            if (sourceData.data && sourceData.data.link) {
                const embedUrl = sourceData.data.link;
                console.log('[VideoSource] Trying server:', server.name, embedUrl);
                
                if (embedUrl.includes('megacloud') && (embedUrl.includes('404') || embedUrl.includes('deleted') || embedUrl.includes('not-found'))) {
                    console.log('[VideoSource] MegaCloud dead, trying next server');
                    continue;
                }
                
                const source = await getVideoSource(embedUrl);
                if (source) {
                    return source;
                }
            }
        }

        return null;
    } catch (error) {
        console.error('[VideoSource] Error getting hianime source:', error);
        return null;
    }
}

function decryptSrc2(encrypted: string, clientKey: string, serverKey: string): string {
    try {
        const parts = clientKey.split('');
        const byteArray = [];
        
        for (let i = 0; i < parts.length; i += 2) {
            const hex = parts[i] + parts[i + 1];
            byteArray.push(parseInt(hex, 16));
        }
        
        const uint8Array = new Uint8Array(byteArray);
        const md5Hashes: Buffer[] = [];
        const salt = uint8Array.slice(0, 8);
        
        let digest = Buffer.concat([Buffer.from(serverKey, 'binary'), Buffer.from(salt)]);
        
        for (let i = 0; i < 3; i++) {
            md5Hashes[i] = crypto.createHash('md5').update(digest).digest();
            digest = Buffer.concat([md5Hashes[i], Buffer.from(serverKey, 'binary'), Buffer.from(salt)]);
        }
        
        const key = Buffer.concat([md5Hashes[0], md5Hashes[1]]);
        const iv = md5Hashes[2];
        
        const encryptedBuffer = Buffer.from(encrypted, 'base64');
        const contents = encryptedBuffer.slice(16);
        
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = decipher.update(contents, undefined, 'utf8') + decipher.final();
        
        return decrypted;
    } catch (error) {
        console.error('[DecryptSrc2] Error:', error);
        return '';
    }
}

async function getMegaCloudClientKey(sourceId: string): Promise<string | null> {
    try {
        const urls = [
            `${PROXY_BASE}/https://megacloud.tv/embed-2/e-1/${sourceId}`,
            `${PROXY_BASE}/https://megacloud.tv/embed-1/e-1/${sourceId}`,
            `${PROXY_BASE}/https://megacloud.blog/embed-2/e-1/${sourceId}`,
        ];
        
        for (const iframeUrl of urls) {
            try {
                const { data } = await axios.get(iframeUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://hianime.to/',
                    },
                    timeout: 5000,
                });

                const clientKeyMatch = data.match(/clientKey\s*[:=]\s*["']([^"']+)["']/);
                if (clientKeyMatch && clientKeyMatch[1]) {
                    console.log('[ClientKey] Found key:', clientKeyMatch[1]);
                    return clientKeyMatch[1];
                }

                const dataKeyMatch = data.match(/data-key\s*=\s*["']([^"']+)["']/);
                if (dataKeyMatch && dataKeyMatch[1]) {
                    console.log('[ClientKey] Found data-key:', dataKeyMatch[1]);
                    return dataKeyMatch[1];
                }
                
                const v3KeyMatch = data.match(/"key"\s*:\s*"([^"]+)"/);
                if (v3KeyMatch && v3KeyMatch[1]) {
                    console.log('[ClientKey] Found v3 key:', v3KeyMatch[1]);
                    return v3KeyMatch[1];
                }
            } catch (e) {
                console.log('[ClientKey] Failed URL:', iframeUrl);
                continue;
            }
        }
        
        return null;
    } catch (error) {
        console.error('[ClientKey] Error:', error);
        return null;
    }
}

export async function decryptMegaCloudUrl(encryptedUrl: string, clientKey?: string): Promise<string | null> {
    try {
        const keys = [MEGA_KEYS.mega, MEGA_KEYS.mega2, MEGA_KEYS.rabbit];
        
        for (const key of keys) {
            if (!key) continue;
            
            let decrypted: string;
            
            if (clientKey) {
                decrypted = decryptSrc2(encryptedUrl, clientKey, key);
            } else {
                try {
                    decrypted = CryptoJS.AES.decrypt(encryptedUrl, key).toString(CryptoJS.enc.Utf8);
                } catch (e) {
                    decrypted = '';
                }
            }
            
            if (decrypted && decrypted.length > 10) {
                try {
                    const sources = JSON.parse(decrypted);
                    if (Array.isArray(sources) && sources.length > 0) {
                        console.log('[Decrypt] Success with key:', key.slice(0, 10));
                        return sources[0].file || sources[0].url || null;
                    }
                    if (decrypted.includes('.m3u8')) {
                        console.log('[Decrypt] Success with key (direct):', key.slice(0, 10));
                        return decrypted;
                    }
                } catch (parseErr) {
                    if (decrypted.includes('.m3u8')) {
                        console.log('[Decrypt] Success with key (direct URL):', key.slice(0, 10));
                        return decrypted;
                    }
                }
            }
        }
        
        console.error('[Decrypt] Failed to decrypt with all keys');
        return null;
    } catch (error) {
        console.error('[Decrypt] Error:', error);
        return null;
    }
}

async function extractMegaCloudSource(embedUrl: string): Promise<VideoSource | null> {
    try {
        const videoIdMatch = embedUrl.match(/\/embed[/-]?\d*\/[e-]?\d*\/([^?\/]+)/);
        if (!videoIdMatch) {
            const simpleMatch = embedUrl.match(/\/([^\/]+)\?/);
            if (simpleMatch) {
                return extractMegaCloudSourceById(simpleMatch[1]);
            }
            return null;
        }
        
        const videoId = videoIdMatch[1];
        return extractMegaCloudSourceById(videoId);
    } catch (error) {
        console.error('[MegaCloud] Extract error:', error);
        return null;
    }
}

async function extractMegaCloudFromEmbed(embedUrl: string, key: string): Promise<VideoSource | null> {
    try {
        console.log('[MegaCloud] Extracting from embed with key:', key);
        
        const videoIdMatch = embedUrl.match(/\/embed[/-]?\d*\/[e-]?\d*\/([^?\/]+)/);
        if (!videoIdMatch) return null;
        
        const videoId = videoIdMatch[1];
        const embedBase = embedUrl.split('/embed-')[0];
        
        const sourcesUrls = [
            `${embedBase}/embed-2/v3/e-1/getSources?id=${videoId}`,
            `${embedBase}/embed-2/v2/e-1/getSources?id=${videoId}`,
            `${embedBase}/embed-1/v2/e-1/getSources?id=${videoId}`,
        ];
        
        for (const sourcesUrl of sourcesUrls) {
            try {
                console.log('[MegaCloud] Trying:', sourcesUrl);
                const { data } = await axios.get(sourcesUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://megacloud.tv',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    timeout: 10000,
                });
                
                console.log('[MegaCloud] Got response:', JSON.stringify(data).slice(0, 300));
                
                if (data.sources) {
                    let sourceUrl = data.sources;
                    
                    if (data.encrypted) {
                        const decrypted = simpleDecrypt(sourceUrl, key);
                        console.log('[MegaCloud] Decrypted:', decrypted.slice(0, 200));
                        try {
                            const parsed = JSON.parse(decrypted);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                return {
                                    url: parsed[0].file || parsed[0].url,
                                    type: 'm3u8',
                                    encrypted: false,
                                    embedUrl,
                                    referer: 'https://megacloud.tv',
                                };
                            }
                        } catch (e) {
                            if (decrypted.includes('.m3u8')) {
                                return {
                                    url: decrypted,
                                    type: 'm3u8',
                                    encrypted: false,
                                    embedUrl,
                                    referer: 'https://megacloud.tv',
                                };
                            }
                        }
                    }
                    
                    if (Array.isArray(sourceUrl) && sourceUrl.length > 0) {
                        return {
                            url: sourceUrl[0].file || sourceUrl[0].url,
                            type: 'm3u8',
                            encrypted: false,
                            embedUrl,
                            referer: 'https://megacloud.tv',
                        };
                    }
                }
            } catch (e) {
                console.log('[MegaCloud] Failed URL:', sourcesUrl);
                continue;
            }
        }
        
        return null;
    } catch (error) {
        console.error('[MegaCloud] Extract from embed error:', error);
        return null;
    }
}

async function extractMegaCloudSourceById(videoId: string): Promise<VideoSource | null> {
    try {
        const clientKey = await getMegaCloudClientKey(videoId);
        console.log('[MegaCloud] Client key:', clientKey);
        
        const sourcesUrls = [
            `${PROXY_BASE}/https://megacloud.tv/embed-2/v2/e-1/getSources?id=${videoId}`,
            `${PROXY_BASE}/https://megacloud.blog/embed-2/v2/e-1/getSources?id=${videoId}`,
            `${PROXY_BASE}/https://megacloud.tv/embed-2/v3/e-1/getSources?id=${videoId}`,
            `${PROXY_BASE}/https://megacloud.blog/embed-2/v3/e-1/getSources?id=${videoId}`,
            `${PROXY_BASE}/https://megacloud.tv/embed-2/ajax/e-1/getSources?id=${videoId}`,
            `${PROXY_BASE}/https://megacloud.blog/embed-2/ajax/e-1/getSources?id=${videoId}`,
        ];
        
        if (clientKey) {
            sourcesUrls.unshift(
                `${PROXY_BASE}/https://megacloud.tv/embed-2/v2/e-1/getSources?id=${videoId}&_k=${clientKey}`,
                `${PROXY_BASE}/https://megacloud.blog/embed-2/v2/e-1/getSources?id=${videoId}&_k=${clientKey}`,
                `${PROXY_BASE}/https://megacloud.tv/embed-2/v3/e-1/getSources?id=${videoId}&_k=${clientKey}`,
                `${PROXY_BASE}/https://megacloud.blog/embed-2/v3/e-1/getSources?id=${videoId}&_k=${clientKey}`,
            );
        }
        
        let data = null;
        let usedUrl = '';
        
        for (const sourcesUrl of sourcesUrls) {
            try {
                console.log('[MegaCloud] Trying URL:', sourcesUrl);
                const { data: resData } = await axios.get(sourcesUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://megacloud.tv',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    timeout: 10000,
                });
                data = resData;
                usedUrl = sourcesUrl;
                console.log('[MegaCloud] Success with URL:', sourcesUrl);
                break;
            } catch (e) {
                continue;
            }
        }

        if (!data) {
            console.error('[MegaCloud] No data received from any endpoint');
            return null;
        }

        console.log('[MegaCloud] Using URL:', usedUrl);
        console.log('[MegaCloud] Data:', JSON.stringify(data).slice(0, 200));

        if (!data.encrypted) {
            if (Array.isArray(data.sources) && data.sources.length > 0) {
                return {
                    url: data.sources[0].file || data.sources[0].url,
                    type: 'm3u8',
                    encrypted: false,
                    embedUrl: `https://megacloud.tv/embed-2/e-1/${videoId}`,
                    referer: 'https://megacloud.tv',
                };
            }
            return null;
        }

        const encryptedSource = data.sources;
        const decryptedUrl = await decryptMegaCloudUrl(encryptedSource, clientKey || undefined);
        
        if (decryptedUrl) {
            return {
                url: decryptedUrl,
                type: 'm3u8',
                encrypted: false,
                embedUrl: `https://megacloud.tv/embed-2/e-1/${videoId}`,
                referer: 'https://megacloud.tv',
            };
        }

        return {
            url: encryptedSource,
            type: 'm3u8',
            encrypted: true,
            embedUrl: `https://megacloud.tv/embed-2/e-1/${videoId}`,
            referer: 'https://megacloud.tv',
        };
    } catch (error) {
        console.error('[MegaCloud] API error:', error);
        return null;
    }
}

export function buildProxyUrl(directUrl: string, referer: string): string {
    const encodedUrl = encodeURIComponent(directUrl);
    const encodedReferer = encodeURIComponent(referer);
    return `https://cdn.4animo.xyz/proxy/?url=${encodedUrl}&referer=${encodedReferer}`;
}

export function getIframeUrl(episodeId: string, language: 'sub' | 'dub' | 'hindi', animeTitle?: string, episodeNumber?: number): string {
    if (language === 'hindi' && animeTitle && episodeNumber) {
        const slug = animeTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        return `https://letsembed.cc/embed/anime/?id=${slug}/${episodeNumber}?al=hindi&autoplay=1`;
    }
    return `https://megaplay.buzz/stream/s-2/${episodeId}/${language}?autoplay=1`;
}
