import { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  duration?: number;  // ms
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function NumberTicker({ value, duration = 1400, prefix = '', suffix = '', className }: NumberTickerProps) {
  const [current, setCurrent] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCurrent(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  );
}
