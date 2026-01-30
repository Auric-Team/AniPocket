'use client';

import Link from 'next/link';
import { Anime } from '@/lib/types';
import { useState, useRef, MouseEvent, useEffect } from 'react';
import PlaceholderImage from './PlaceholderImage';

interface AnimeCardProps {
    anime: Anime;
    index?: number;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [shine, setShine] = useState({ x: 0, y: 0, opacity: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || isMobile) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        // Subtle 3D Tilt
        const x = yPct * -8;
        const y = xPct * 8;

        setRotation({ x, y });
        setShine({ x: mouseX, y: mouseY, opacity: 0.15 });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setShine({ ...shine, opacity: 0 });
    };

    return (
        <Link href={`/anime/${anime.id}`} className="block h-full perspective-1000 group">
            <article 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative h-full flex flex-col gap-3 transition-transform duration-300 ease-out will-change-transform"
                style={{
                    transform: isMobile ? 'none' : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Image Container */}
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[var(--bg-secondary)] shadow-xl ring-1 ring-white/5 group-hover:ring-[var(--accent)]/50 transition-all duration-500 group-hover:shadow-[0_15px_30px_rgba(99,102,241,0.2)]">
                    <PlaceholderImage
                        src={anime.image}
                        alt={anime.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Dynamic Shine Effect - Desktop Only */}
                    {!isMobile && (
                        <div 
                            className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-transparent via-white to-transparent mix-blend-overlay"
                            style={{
                                opacity: shine.opacity,
                                transform: `translate(${shine.x}px, ${shine.y}px) translate(-50%, -50%) scale(2)`,
                                width: '200%',
                                height: '200%',
                            }}
                        />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10" />

                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                        <div className="w-12 h-12 bg-[var(--accent)]/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-white">
                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Floating Badges */}
                    <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                         {anime.type && (
                            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                                {anime.type}
                            </span>
                        )}
                        <span className="px-2 py-0.5 bg-[var(--accent)] text-white text-[10px] font-bold rounded uppercase tracking-wider shadow-lg">
                            HD
                        </span>
                    </div>

                    {/* Episode Info (Always Visible) */}
                    <div className="absolute bottom-2 left-2 z-20 flex flex-wrap gap-1.5 transform translate-z-10">
                        {anime.episodes?.sub && (
                            <span className="px-1.5 py-0.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded flex items-center gap-1 border border-white/10">
                                <svg className="w-3 h-3 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"/></svg>
                                {anime.episodes.sub}
                            </span>
                        )}
                        {anime.episodes?.dub && (
                            <span className="px-1.5 py-0.5 bg-purple-500/20 backdrop-blur-md text-purple-200 text-[10px] font-bold rounded flex items-center gap-1 border border-purple-500/20">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="3"/></svg>
                                {anime.episodes.dub}
                            </span>
                        )}
                    </div>
                </div>

                {/* Text Content */}
                <div className="transform translate-z-5 px-1">
                    <h3 className="font-bold text-sm text-gray-100 line-clamp-2 leading-tight group-hover:text-[var(--accent)] transition-colors group-hover:text-glow">
                        {anime.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                        <span className="truncate">{anime.type || 'TV Series'}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"/>
                        <span className="text-green-400 font-medium">Releasing</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
