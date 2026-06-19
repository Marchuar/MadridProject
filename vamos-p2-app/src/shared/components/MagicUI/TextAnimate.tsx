import { motion } from 'framer-motion';

interface TextAnimateProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  mode?: 'words' | 'chars';
}

export function TextAnimate({ text, className, delay = 0, duration = 0.4, mode = 'words' }: TextAnimateProps) {
  const items = mode === 'words' ? text.split(' ') : text.split('');
  const joiner = mode === 'words' ? ' ' : '';

  return (
    <span className={className} aria-label={text}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: delay + i * 0.08, ease: 'easeOut' }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {item}{joiner}
        </motion.span>
      ))}
    </span>
  );
}
