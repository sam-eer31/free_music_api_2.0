import { useRef, useState } from 'react';

interface UseSliderOptions {
  itemCount: number;
  gapPx?: number;
}

export function useSlider({ itemCount, gapPx = 16 }: UseSliderOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement;
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth + gapPx;
    const index = Math.round(scrollPosition / cardWidth);
    
    setActiveIndex(Math.max(0, Math.min(index, itemCount - 1)));
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement;
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth + gapPx;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  return { scrollRef, activeIndex, handleScroll, scrollTo };
}
