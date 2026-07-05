"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";
import Fade from "embla-carousel-fade";
import ClassNames from "embla-carousel-class-names";

type Variant = "slide" | "fade" | "marquee";

type Props = {
  children: React.ReactNode[];
  /** Tailwind basis classes controlling how many slides show per breakpoint. */
  slideBasis?: string;
  autoplayDelay?: number;
  loop?: boolean;
  dots?: boolean;
  arrows?: boolean;
  className?: string;
  /** gap between slides in px (applied as a gutter, reliable with loop) */
  gapPx?: number;
  /** slide = standard, fade = crossfade single slide, marquee = continuous auto-scroll */
  variant?: Variant;
  /** grow the centered/snapped slide, dim the rest (only for slide variant) */
  activeScale?: boolean;
  /** marquee speed (px/frame-ish); higher = faster */
  speed?: number;
  direction?: "forward" | "backward";
};

export function Carousel({
  children,
  slideBasis = "basis-full sm:basis-1/2 lg:basis-1/3",
  autoplayDelay = 3500,
  loop = true,
  dots = false,
  arrows = false,
  className = "",
  gapPx = 24,
  variant = "slide",
  activeScale = false,
  speed = 2,
  direction = "forward",
}: Props) {
  const plugins = [];
  if (variant === "marquee") {
    plugins.push(AutoScroll({ speed, startDelay: 0, stopOnInteraction: false, stopOnMouseEnter: true, direction }));
  } else if (autoplayDelay > 0) {
    plugins.push(Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true }));
  }
  if (variant === "fade") plugins.push(Fade());
  if (activeScale) plugins.push(ClassNames({ snapped: "tk-snapped", inView: "tk-inview" }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, align: variant === "marquee" ? "start" : "center", dragFree: variant === "marquee", containScroll: variant === "marquee" ? false : "trimSnaps" },
    plugins
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => setSelected(api.selectedScrollSnap()), []);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={`relative ${activeScale ? "tk-scale-carousel" : ""} ${className}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex" style={variant === "fade" ? undefined : { marginLeft: `-${gapPx}px` }}>
          {children.map((child, i) => (
            <div
              key={i}
              className={`tk-cslide min-w-0 shrink-0 grow-0 ${variant === "fade" ? "basis-full" : slideBasis}`}
              style={variant === "fade" ? undefined : { paddingLeft: `${gapPx}px` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {arrows && variant !== "marquee" && (
        <>
          <button
            aria-label="Trước"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8169f1] shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition hover:bg-[#8169f1] hover:text-white md:flex"
          >
            ‹
          </button>
          <button
            aria-label="Sau"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8169f1] shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition hover:bg-[#8169f1] hover:text-white md:flex"
          >
            ›
          </button>
        </>
      )}

      {dots && variant !== "marquee" && snaps.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2.5 rounded-full transition-all ${i === selected ? "w-6 bg-[#8169f1]" : "w-2.5 bg-[#c9c2ef]"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
