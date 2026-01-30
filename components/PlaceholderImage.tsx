'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface PlaceholderImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export default function PlaceholderImage({ src, alt, ...props }: PlaceholderImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--bg-secondary)]">
       {/* Skeleton Loader */}
      {isLoading && (
        <div className="absolute inset-0 skeleton z-10" />
      )}
      
      <Image
        src={isError ? '/placeholder.jpg' : src}
        alt={alt}
        {...props}
        onLoad={() => setIsLoading(false)}
        onError={() => {
            setIsError(true);
            setIsLoading(false);
        }}
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${props.className || ''}`}
        unoptimized
      />
    </div>
  );
}
