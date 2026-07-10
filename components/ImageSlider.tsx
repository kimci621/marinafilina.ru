'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const scrollLeft = track.scrollLeft;
      const itemWidth = (track.children[0] as HTMLElement)?.clientWidth || 460;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(index);
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, []);

  if (images.length === 0) {
    return (
      <div
        data-testid="slider-placeholder"
        className="w-full aspect-square bg-(--color-text-muted)/10"
      />
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        data-testid="slider-track"
        className="flex gap-0 overflow-x-auto scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative w-[280px] h-[280px] tablet:w-[460px] tablet:h-[460px]">
              <Image
                src={src}
                alt={`Project image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 799px) 280px, 460px"
              />
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-[8px] mt-[16px]">
          {images.map((_, i) => (
            <button
              key={i}
              className={`w-[8px] h-[8px] rounded-full transition-colors ${
                i === activeIndex ? 'bg-(--color-text)' : 'bg-(--color-text-muted)/30'
              }`}
              onClick={() => {
                const track = trackRef.current;
                if (!track) return;
                const itemWidth = (track.children[0] as HTMLElement)?.clientWidth || 460;
                track.scrollTo({ left: i * itemWidth, behavior: 'smooth' });
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
