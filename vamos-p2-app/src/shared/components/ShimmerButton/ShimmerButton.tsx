import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './ShimmerButton.module.css';

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ShimmerButton({
  children,
  fullWidth,
  size = 'md',
  className = '',
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={[
        styles.btn,
        styles[size],
        fullWidth ? styles.fullWidth : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      <span className={styles.shimmer} aria-hidden="true" />
      <span className={styles.content}>{children}</span>
    </button>
  );
}
