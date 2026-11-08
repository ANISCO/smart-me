import { useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedNumber({ value, prefix = '', suffix = '', duration = 600 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(0);

  useEffect(() => {
    fromRef.current = startRef.current;
    const from = fromRef.current;
    const to = value;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = from + (to - from) * eased;
      startRef.current = current;
      if (ref.current) {
        ref.current.textContent = prefix + Math.round(current).toLocaleString('en-US') + suffix;
      }
      if (p < 1) raf = requestAnimationFrame(tick);
      else startRef.current = to;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, prefix, suffix, duration]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}
