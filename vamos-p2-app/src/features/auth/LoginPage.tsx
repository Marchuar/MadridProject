import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import { useAuth } from './useAuth';
import { useToast } from '../../shared/components/Toast/Toast';
import { Button } from '../../shared/components/Button/Button';
import { FormField } from '../../shared/components/FormField/FormField';
import styles from './AuthPages.module.css';

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!username.trim()) e.username = 'Username or email is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(username.trim(), password);
      navigate('/');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed. Check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.heroBar} aria-hidden="true" />

      <main className={styles.card}>
        <div className={styles.brandHeader}>
          <div className={styles.brandIcon}>
            <MapPin size={22} color="white" />
          </div>
          <div>
            <h1 className={styles.brandName}>VamosMadrid</h1>
            <p className={styles.brandTagline}>Discover Madrid, your way</p>
          </div>
        </div>

        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSubtitle}>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormField
            label="Username or Email"
            type="text"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            error={errors.username}
            placeholder="Enter your username"
            required
          />
          <FormField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
            required
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Button type="submit" fullWidth size="lg" loading={isLoading}>
            Sign in
          </Button>
        </form>

        <p className={styles.switchLink}>
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </main>
    </div>
  );
}
