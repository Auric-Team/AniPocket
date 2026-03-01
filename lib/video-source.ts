import axios from 'axios';
import * as cheerio from 'cheerio';
import CryptoJS from 'crypto-js';
import crypto from 'crypto';

const VERCEL_PROXY = 'https://vercel-proxy-kappa-nine.vercel.app/';

const STREAM_PROXIES = [
    'https://cdn.4animo.xyz/proxy',
    'https://proxy.useless.nl',
    'https://api.pike.tech/proxy',
];

const CORS_PROXIES = [
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://cdn.4animo.xyz/proxy/?url=${encodeURIComponent(url)}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

let currentProxyIndex = 0;

function getProxyUrl(url: string): string {
    return CORS_PROXIES[currentProxyIndex](url);
}

function rotateProxy(): void {
    currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
}

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
    let lastError = null;
    
    for (let attempt = 0; attempt < CORS_PROXIES.length; attempt++) {
        try {
            const proxyUrl = getProxyUrl(url);
            const response = await axios.get(proxyUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': referer,
                },
                timeout,
            });
            return response.data;
        } catch (error: any) {
            console.log('[FetchWithProxy] Failed attempt', attempt + 1, error.message);
            lastError = error;
            rotateProxy();
        }
    }
    
    console.error('[VideoSource] All proxies failed:', lastError);
    return null;
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

async function fetchMegaCloudKey(videoId: string): Promise<string | null> {
    try {
        const urls = [
            `https://megacloud.tv/embed-2/v3/e-1/${videoId}`,
            `https://megacloud.blog/embed-2/v3/e-1/${videoId}`,
            `https://megacloud.tv/embed-2/e-1/${videoId}`,
        ];
        
        for (const url of urls) {
            try {
                const html = await fetchWithProxy(url, 'https://megacloud.tv', 8000);
                if (!html) continue;
                
                const dpiMatch = html.match(/data-dpi="([^"]+)"/);
                if (dpiMatch && dpiMatch[1]) {
                    return dpiMatch[1];
                }
                
                const keyMatch = html.match(/"key"\s*:\s*"([^"]+)"/);
                if (keyMatch && keyMatch[1]) {
                    return keyMatch[1];
                }
            } catch (e) {
                continue;
            }
        }
        return null;
    } catch (e) {
        return null;
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
                const megaSource = await extractMegaCloudFromEmbed(fetchUrl, kMatch[1]);
                if (megaSource) return megaSource;
            }
            const megaSource = await extractMegaCloudSource(fetchUrl);
            if (megaSource) return megaSource;
        } else if (fetchUrl.includes('t-cloud')) {
            referer = 'https://t-cloud.live';
            const tCloudSource = await extractTCloudSource(fetchUrl);
            if (tCloudSource) return tCloudSource;
        } else if (fetchUrl.includes('vidsrc')) {
            referer = 'https://vidsrc.nl';
            const vidSrcSource = await extractVidSrcSource(fetchUrl);
            if (vidSrcSource) return vidSrcSource;
        } else if (fetchUrl.includes('decoder')) {
            referer = 'https://decoder.to';
            const decoderSource = await extractDecoderSource(fetchUrl);
            if (decoderSource) return decoderSource;
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
        const serversUrl = getProxyUrl(`https://hianime.to/ajax/v2/episode/servers?episodeId=${episodeId}`);
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

        for (const server of servers) {
            if (server.type !== serverType && serverType !== 'sub') continue;
            
            try {
                const sourceUrl = getProxyUrl(`https://hianime.to/ajax/v2/episode/sources?id=${server.id}`);
                const sourceData = await axios.get(sourceUrl, { timeout: 10000 });
                
                if (sourceData.data && sourceData.data.link) {
                    const embedUrl = sourceData.data.link;
                    console.log('[VideoSource] Trying server:', server.name, embedUrl);
                    
                    if (embedUrl.includes('megacloud') && (embedUrl.includes('404') || embedUrl.includes('deleted') || embedUrl.includes('not-found'))) {
                        console.log('[VideoSource] MegaCloud dead, trying next server');
                        continue;
                    }
                    
                    const source = await getVideoSource(embedUrl);
                    if (source && source.url) {
                        console.log('[VideoSource] Got source:', source.url);
                        return source;
                    }
                }
            } catch (e) {
                console.log('[VideoSource] Server failed:', server.name, e);
                continue;
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
            `https://megacloud.tv/embed-2/e-1/${sourceId}`,
            `https://megacloud.tv/embed-2/v3/e-1/${sourceId}`,
            `https://megacloud.blog/embed-2/e-1/${sourceId}`,
            `https://megacloud.blog/embed-2/v3/e-1/${sourceId}`,
        ];
        
        for (const iframeUrl of urls) {
            try {
                const html = await fetchWithProxy(iframeUrl, 'https://megacloud.tv', 8000);
                if (!html) continue;
                
                const dpiMatch = html.match(/data-dpi="([^"]+)"/);
                if (dpiMatch && dpiMatch[1]) {
                    console.log('[ClientKey] Found data-dpi key:', dpiMatch[1]);
                    return dpiMatch[1];
                }

                const clientKeyMatch = html.match(/clientKey\s*[:=]\s*["']([^"']+)["']/);
                if (clientKeyMatch && clientKeyMatch[1]) {
                    console.log('[ClientKey] Found key:', clientKeyMatch[1]);
                    return clientKeyMatch[1];
                }

                const dataKeyMatch = html.match(/data-key\s*=\s*["']([^"']+)["']/);
                if (dataKeyMatch && dataKeyMatch[1]) {
                    console.log('[ClientKey] Found data-key:', dataKeyMatch[1]);
                    return dataKeyMatch[1];
                }
                
                const v3KeyMatch = html.match(/"key"\s*:\s*"([^"]+)"/);
                if (v3KeyMatch && v3KeyMatch[1]) {
                    console.log('[ClientKey] Found v3 key:', v3KeyMatch[1]);
                    return v3KeyMatch[1];
                }
            } catch (e) {
                rotateProxy();
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
        
        let decryptionKey = key;
        
        const fetchedKey = await fetchMegaCloudKey(videoId);
        if (fetchedKey) {
            decryptionKey = fetchedKey;
            console.log('[MegaCloud] Fetched key from page:', decryptionKey);
        }
        
        const sourcesUrls = [
            `${embedBase}/embed-2/v3/e-1/getSources?id=${videoId}`,
            `${embedBase}/embed-2/v2/e-1/getSources?id=${videoId}`,
            `${embedBase}/embed-1/v2/e-1/getSources?id=${videoId}`,
        ];
        
        for (const sourcesUrl of sourcesUrls) {
            try {
                console.log('[MegaCloud] Trying:', sourcesUrl);
                const { data } = await axios.get(getProxyUrl(sourcesUrl), {
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
                        const decrypted = simpleDecrypt(sourceUrl, decryptionKey);
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
                rotateProxy();
                continue;
            }
        }
        
        console.log('[MegaCloud] All extraction methods failed, returning embed URL as fallback');
        return { url: embedUrl, type: 'm3u8', encrypted: false, embedUrl, referer: 'https://megacloud.tv' };
    } catch (error) {
        console.error('[MegaCloud] Extract from embed error:', error);
        return { url: embedUrl, type: 'm3u8', encrypted: false, embedUrl, referer: 'https://megacloud.tv' };
    }
}

async function extractMegaCloudSourceById(videoId: string): Promise<VideoSource | null> {
    try {
        const clientKey = await getMegaCloudClientKey(videoId);
        console.log('[MegaCloud] Client key:', clientKey);
        
        const sourcesUrls = [
            `https://megacloud.tv/embed-2/v2/e-1/getSources?id=${videoId}`,
            `https://megacloud.blog/embed-2/v2/e-1/getSources?id=${videoId}`,
            `https://megacloud.tv/embed-2/v3/e-1/getSources?id=${videoId}`,
            `https://megacloud.blog/embed-2/v3/e-1/getSources?id=${videoId}`,
            `https://megacloud.tv/embed-2/ajax/e-1/getSources?id=${videoId}`,
            `https://megacloud.blog/embed-2/ajax/e-1/getSources?id=${videoId}`,
        ];
        
        if (clientKey) {
            sourcesUrls.unshift(
                `https://megacloud.tv/embed-2/v2/e-1/getSources?id=${videoId}&_k=${clientKey}`,
                `https://megacloud.blog/embed-2/v2/e-1/getSources?id=${videoId}&_k=${clientKey}`,
                `https://megacloud.tv/embed-2/v3/e-1/getSources?id=${videoId}&_k=${clientKey}`,
                `https://megacloud.blog/embed-2/v3/e-1/getSources?id=${videoId}&_k=${clientKey}`,
            );
        }
        
        let data = null;
        
        for (const sourcesUrl of sourcesUrls) {
            try {
                console.log('[MegaCloud] Trying URL:', sourcesUrl);
                const response = await axios.get(getProxyUrl(sourcesUrl), {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://megacloud.tv',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    timeout: 10000,
                });
                data = response.data;
                console.log('[MegaCloud] Success with URL:', sourcesUrl);
                break;
            } catch (e) {
                rotateProxy();
                continue;
            }
        }

        if (!data) {
            console.error('[MegaCloud] No data received from any endpoint');
            return null;
        }

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
        return { url: `https://megacloud.tv/embed-2/e-1/${videoId}`, type: 'm3u8', encrypted: false, embedUrl: `https://megacloud.tv/embed-2/e-1/${videoId}`, referer: 'https://megacloud.tv' };
    }
}

async function extractTCloudSource(embedUrl: string): Promise<VideoSource | null> {
    try {
        console.log('[T-Cloud] Extracting from:', embedUrl);
        
        const videoIdMatch = embedUrl.match(/\/embed\/([^?\/]+)/);
        if (!videoIdMatch) return null;
        
        const videoId = videoIdMatch[1];
        const sourcesUrl = `https://t-cloud.live/ajax/embed-6/getSource?id=${videoId}`;
        
        const { data } = await axios.get(getProxyUrl(sourcesUrl), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://t-cloud.live',
                'X-Requested-With': 'XMLHttpRequest',
            },
            timeout: 10000,
        });
        
        console.log('[T-Cloud] Response:', JSON.stringify(data).slice(0, 200));
        
        if (data.link) {
            return {
                url: data.link,
                type: 'm3u8',
                encrypted: false,
                embedUrl,
                referer: 'https://t-cloud.live',
            };
        }
        
        return null;
    } catch (error) {
        console.error('[T-Cloud] Error:', error);
        return null;
    }
}

async function extractVidSrcSource(embedUrl: string): Promise<VideoSource | null> {
    try {
        console.log('[VidSrc] Extracting from:', embedUrl);
        
        const videoIdMatch = embedUrl.match(/\/embed\/([^?\/]+)/);
        if (!videoIdMatch) return null;
        
        const videoId = videoIdMatch[1];
        
        const sourcesUrl = `https://vidsrc.nl/embed/${videoId}`;
        const html = await fetchWithProxy(sourcesUrl, 'https://vidsrc.nl', 10000);
        
        if (!html) return null;
        
        const match = html.match(/file:\s*["']([^"']+\.m3u8[^"']*)["']/);
        if (match && match[1]) {
            return {
                url: match[1],
                type: 'm3u8',
                encrypted: false,
                embedUrl,
                referer: 'https://vidsrc.nl',
            };
        }
        
        return null;
    } catch (error) {
        console.error('[VidSrc] Error:', error);
        return null;
    }
}

async function extractDecoderSource(embedUrl: string): Promise<VideoSource | null> {
    try {
        console.log('[Decoder] Extracting from:', embedUrl);
        
        const videoIdMatch = embedUrl.match(/\/embed\/([^?\/]+)/);
        if (!videoIdMatch) return null;
        
        const videoId = videoIdMatch[1];
        const sourcesUrl = `https://decoder.to/ajax/embed-6/getSource?id=${videoId}`;
        
        const { data } = await axios.get(getProxyUrl(sourcesUrl), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://decoder.to',
                'X-Requested-With': 'XMLHttpRequest',
            },
            timeout: 10000,
        });
        
        if (data.link) {
            return {
                url: data.link,
                type: 'm3u8',
                encrypted: false,
                embedUrl,
                referer: 'https://decoder.to',
            };
        }
        
        return null;
    } catch (error) {
        console.error('[Decoder] Error:', error);
        return null;
    }
}

export function buildProxyUrl(directUrl: string, referer: string): string {
    const encodedUrl = encodeURIComponent(directUrl);
    const encodedReferer = encodeURIComponent(referer);
    
    if (directUrl.includes('.m3u8')) {
        return `https://cdn.4animo.xyz/proxy/?url=${encodedUrl}&referer=${encodedReferer}`;
    }
    
    if (directUrl.includes('megacloud') || directUrl.includes('t-cloud') || directUrl.includes('vidsrc') || directUrl.includes('decoder') || directUrl.includes('embed')) {
        return `https://cdn.4animo.xyz/proxy/?url=${encodedUrl}&referer=${encodedReferer}`;
    }
    
    return directUrl;
}

export function getIframeUrl(episodeId: string, language: 'sub' | 'dub' | 'hindi', animeTitle?: string, episodeNumber?: number): string {
    if (language === 'hindi' && animeTitle && episodeNumber) {
        const slug = animeTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        return `https://letsembed.cc/embed/anime/?id=${slug}/${episodeNumber}?al=hindi&autoplay=1`;
    }
    return `https://megaplay.buzz/stream/s-2/${episodeId}/${language}?autoplay=1`;
}
