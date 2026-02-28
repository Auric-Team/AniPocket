import { NextRequest, NextResponse } from 'next/server';
import { getHianimeSource, decryptMegaCloudUrl, buildProxyUrl, getIframeUrl } from '@/lib/video-source';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { episodeId, serverType = 'sub', animeId, episodeNumber } = body;

        if (!episodeId) {
            return NextResponse.json(
                { error: 'episodeId is required' },
                { status: 400 }
            );
        }

        console.log('[API/Source] Getting source for episode:', episodeId, 'type:', serverType);

        const source = await getHianimeSource(episodeId, serverType);

        if (!source) {
            const iframeUrl = getIframeUrl(episodeId, serverType);
            return NextResponse.json({
                success: false,
                useIframe: true,
                iframeUrl,
                error: 'No direct source available, using iframe'
            });
        }

        let directUrl = source.url;
        let proxyUrl = '';
        let isEncrypted = source.encrypted;
        
        console.log('[API/Source] Initial URL:', directUrl, 'encrypted:', isEncrypted, 'referer:', source.referer);
        
        if (isEncrypted && directUrl) {
            console.log('[API/Source] URL is encrypted, attempting to decrypt...');
            const decryptedUrl = await decryptMegaCloudUrl(directUrl);
            console.log('[API/Source] Decrypted URL:', decryptedUrl);
            if (decryptedUrl && decryptedUrl.includes('.m3u8')) {
                directUrl = decryptedUrl;
                isEncrypted = false;
                console.log('[API/Source] Successfully decrypted URL');
            }
        }
        
        console.log('[API/Source] Before proxy - URL:', directUrl, 'includes m3u8:', directUrl?.includes('.m3u8'));
        
        const referer = source.referer || 'https://megacloud.tv';
        
        if (directUrl && directUrl.includes('.m3u8')) {
            proxyUrl = buildProxyUrl(directUrl, referer);
            console.log('[API/Source] Built proxy URL for m3u8:', proxyUrl);
        } else if (directUrl && (directUrl.includes('megacloud') || directUrl.includes('t-cloud') || directUrl.includes('vidsrc') || directUrl.includes('decoder') || directUrl.includes('embed'))) {
            proxyUrl = buildProxyUrl(directUrl, referer);
            console.log('[API/Source] Built proxy URL for embed:', proxyUrl);
        } else {
            console.log('[API/Source] NOT building proxy - conditions not met');
        }

        console.log('[API/Source] Final - directUrl:', directUrl, 'proxyUrl:', proxyUrl, 'useIframe:', !proxyUrl || isEncrypted || !directUrl);

        return NextResponse.json({
            success: true,
            source: {
                url: directUrl,
                proxyUrl: proxyUrl,
                type: source.type,
                encrypted: isEncrypted,
                embedUrl: source.embedUrl,
                referer: source.referer,
                sourceName: source.sourceName,
            },
            useIframe: !proxyUrl || isEncrypted || !directUrl,
            iframeUrl: getIframeUrl(episodeId, serverType)
        });

    } catch (error) {
        console.error('[API/Source] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
