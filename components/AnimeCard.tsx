'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/lib/types';
import { useState } from 'react';

interface AnimeCardProps {
    anime: Anime;
    index?: number;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link href={`/anime/${anime.id}`} className="group block">
            <article className="card-hover rounded-lg overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)]">
                    <Image
                        src={imageError ? '/placeholder.jpg' : anime.image}
                        alt={anime.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        onError={() => setImageError(true)}
                        unoptimized
                    />

                    {/* Episode Count Badge */}
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1.5">
                        {anime.episodes?.sub && (
                            <span className="px-2 py-1 bg-[var(--accent)] text-white text-xs font-medium rounded">
                                SUB {anime.episodes.sub}
                            </span>
                        )}
                        {anime.episodes?.dub && (
                            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                                DUB {anime.episodes.dub}
                            </span>
                        )}
                    </div>

                    {/* Type Badge */}
                    {anime.type && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs font-medium rounded">
                            {anime.type}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-3">
                    <h3 className="font-medium text-sm text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors min-h-[2.5rem]">
                        {anime.title}
                    </h3>
                </div>
            </article>
        </Link>
    );
}
