"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { homeHeroSlides } from "@/lib/home-hero-slides";

const AUTOPLAY_DELAY_MS = 4500;
const SWIPE_THRESHOLD = 48;

export function HomeHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;

    const timeoutId = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % homeHeroSlides.length);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, isPaused]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  function pauseTemporarily() {
    setIsPaused(true);

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, AUTOPLAY_DELAY_MS + 1200);
  }

  function goToSlide(index: number) {
    pauseTemporarily();
    setActiveIndex(index);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    setIsPaused(true);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;

    if (startX === null || typeof endX !== "number") {
      pauseTemporarily();
      return;
    }

    const deltaX = startX - endX;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        setActiveIndex((current) => (current + 1) % homeHeroSlides.length);
      } else {
        setActiveIndex((current) => (current - 1 + homeHeroSlides.length) % homeHeroSlides.length);
      }
    }

    pauseTemporarily();
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[#efe2d8] via-[#f6ede7] to-transparent" />
      <div className="mx-auto max-w-6xl px-4 pb-2 pt-3 sm:px-5 sm:pt-4">
        <div
          className="group relative overflow-hidden rounded-[2rem] border border-line/80 bg-surface shadow-soft"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative min-h-[400px] sm:min-h-[480px]">
            {homeHeroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-out",
                  index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
                )}
              >
                <Image
                  src={slide.imageUrl}
                  alt={`Editorial Consi ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: slide.objectPosition }}
                />
                <div className="absolute inset-x-0 top-0 flex justify-between p-4">
                  <span className="inline-flex rounded-full bg-white/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-foreground backdrop-blur">
                    {slide.caption}
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-black/6" />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 px-4 pb-4">
            {homeHeroSlides.map((slide, index) => (
              <button
                key={`${slide.id}-dot`}
                type="button"
                aria-label={`Ir a la imagen ${index + 1}`}
                className={cn(
                  "h-2 rounded-full bg-white/70 transition-all duration-300",
                  index === activeIndex ? "w-6" : "w-2"
                )}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
