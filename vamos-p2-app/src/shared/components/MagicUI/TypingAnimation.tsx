import { useEffect, useRef, useState } from 'react';

interface TypingAnimationProps {
  texts: string[];
  speed?: number;        // ms per character
  pauseDuration?: number; // ms between texts
  className?: string;
  cursor?: boolean;
}

export function TypingAnimation({ texts, speed = 60, pauseDuration = 1800, className, cursor = true }: TypingAnimationProps) {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing'>('typing');
  const charIdx = useRef(0);

  useEffect(() => {
    const current = texts[textIdx] ?? '';

    if (phase === 'typing') {
      if (charIdx.current < current.length) {
        const t = setTimeout(() => {
          charIdx.current++;
          setDisplay(current.slice(0, charIdx.current));
        }, speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('erasing'), pauseDuration);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'erasing') {
      if (charIdx.current > 0) {
        const t = setTimeout(() => {
          charIdx.current--;
          setDisplay(current.slice(0, charIdx.current));
        }, speed * 0.5);
        return () => clearTimeout(t);
      } else {
        setTextIdx(i => (i + 1) % texts.length);
        setPhase('typing');
      }
    }
  }, [phase, textIdx, display, texts, speed, pauseDuration]);

  return (
    <span className={className} aria-live="polite" aria-label={texts[textIdx]}>
      {display}
      {cursor && <span style={{ opacity: 1, animation: 'blink 1s step-end infinite' }}>|</span>}
    </span>
  );
}
