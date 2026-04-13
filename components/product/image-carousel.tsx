"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  productName: string;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageCarousel({
  images,
  productName,
  activeIndex,
  onIndexChange
}: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const slide = container.children.item(activeIndex) as HTMLElement | null;
    if (!slide) return;

    container.scrollTo({
      left: slide.offsetLeft,
      behavior: "smooth"
    });
  }, [activeIndex, images]);

  function handleScroll() {
    const container = containerRef.current;

    if (!container) return;

    const width = container.clientWidth;
    if (width === 0) return;

    const nextIndex = Math.round(container.scrollLeft / width);
    if (nextIndex !== activeIndex) {
      onIndexChange(nextIndex);
    }
  }

  return (
    <section className="space-y-4">
      {images.length > 0 ? (
        <div
          ref={containerRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[2rem] bg-surfaceStrong"
          onScroll={handleScroll}
        >
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative aspect-[4/5] min-w-full snap-center">
              <Image
                src={image}
                alt={`${productName} imagen ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-surfaceStrong px-6 text-center text-sm text-muted">
          Imagen no disponible
        </div>
      )}

      {images.length > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={`${image}-dot-${index}`}
              type="button"
              aria-label={`Ver imagen ${index + 1}`}
              className={cn(
                "h-2.5 rounded-full transition-all duration-200",
                index === activeIndex ? "w-6 bg-foreground" : "w-2.5 bg-line"
              )}
              onClick={() => onIndexChange(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
