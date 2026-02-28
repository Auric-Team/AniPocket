'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';
import Hls from 'hls.js';

function Player() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!url || !videoRef.current) return;
        const video = videoRef.current;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });
            return () => hls.destroy();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(() => {});
            });
        }
    }, [url]);

    if (!url) return <div className="text-white p-4 flex items-center justify-center h-full">No video URL provided</div>;

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full outline-none" controls playsInline />
        </div>
    );
}

export default function PlayerPage() {
    return (
        <Suspense fallback={<div className="bg-black w-full h-screen"></div>}>
            <Player />
        </Suspense>
    );
}