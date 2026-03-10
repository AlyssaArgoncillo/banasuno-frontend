import { useEffect, useRef } from 'react';

/**
 * useScrollFade
 * - Hides scrollbars by default.
 * - Shows themed scrollbars while the user is actively scrolling (mouse, wheel, or touch).
 * - Keeps them visible for a short delay after scrolling stops, then fades them out.
 *
 * Usage:
 *   const scrollRef = useScrollFade();
 *   return <div ref={scrollRef} className="scroll-fade">...</div>;
 */
export default function useScrollFade(options = {}) {
  const { delayMs = 1600 } = options;
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hasOverflow = false;

    const updateOverflow = () => {
      if (!el) return;
      const nextHasOverflow = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      if (nextHasOverflow === hasOverflow) return;
      hasOverflow = nextHasOverflow;
      if (hasOverflow) {
        el.classList.add('scroll-fade--has-scrollbar');
      } else {
        el.classList.remove('scroll-fade--has-scrollbar');
        el.classList.remove('scroll-fade--active');
      }
    };

    const activate = () => {
      if (!hasOverflow) return;
      el.classList.add('scroll-fade--active');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        el.classList.remove('scroll-fade--active');
      }, delayMs);
    };

    updateOverflow();

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateOverflow();
      });
      resizeObserver.observe(el);
    } else {
      window.addEventListener('resize', updateOverflow);
    }

    const onScroll = () => {
      updateOverflow();
      activate();
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onScroll, { passive: true });
    el.addEventListener('touchstart', onScroll, { passive: true });
    el.addEventListener('touchmove', onScroll, { passive: true });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateOverflow);
      }
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onScroll);
      el.removeEventListener('touchstart', onScroll);
      el.removeEventListener('touchmove', onScroll);
    };
  }, [delayMs]);

  return ref;
}

