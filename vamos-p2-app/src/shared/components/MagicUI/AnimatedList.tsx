import { motion } from 'motion/react';

interface AnimatedListProps {
  children: React.ReactNode[];
  stagger?: number;
  className?: string;
}

export function AnimatedList({ children, stagger = 0.1, className }: AnimatedListProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.38, delay: i * stagger, ease: 'easeOut' }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
