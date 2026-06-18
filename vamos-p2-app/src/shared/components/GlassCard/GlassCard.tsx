import type { ReactNode } from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

export function GlassCard({ children, className = '', onClick, as: Tag = 'div' }: GlassCardProps) {
  return (
    <Tag className={[styles.card, className].filter(Boolean).join(' ')} onClick={onClick}>
      {children}
    </Tag>
  );
}
