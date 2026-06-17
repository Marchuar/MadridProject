import { type InputHTMLAttributes, type ReactNode, useId } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
  rightSlot?: ReactNode;
}

export function FormField({ label, error, helper, rightSlot, id: idProp, ...inputProps }: FormFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {inputProps.required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
      <div className={styles.inputWrap}>
        <input
          id={id}
          className={[styles.input, error ? styles.inputError : ''].join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {!error && helper && <p className={styles.helper}>{helper}</p>}
    </div>
  );
}
