import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import { useAuth } from './useAuth';
import { useToast } from '../../shared/components/Toast/Toast';
import { Button } from '../../shared/components/Button/Button';
import { FormField } from '../../shared/components/FormField/FormField';
import styles from './AuthPages.module.css';

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = 'Username is required';
    else if (username.trim().length < 3) e.username = 'Username must be at least 3 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      showToast('Account created! Complete your profile to get personalized recommendations.', 'success');
      navigate('/profile');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <motion.main
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
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
          <h2 className={styles.formTitle}>Create your account</h2>
          <p className={styles.formSubtitle}>Join to get personalized activity recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormField
            label="Username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            error={errors.username}
            placeholder="Choose a username"
            required
          />
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={errors.email}
            placeholder="your@email.com"
            required
          />
          <FormField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            placeholder="At least 8 characters"
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
          <FormField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            error={errors.confirm}
            placeholder="Repeat your password"
            required
          />

          <Button type="submit" fullWidth size="lg" loading={isLoading}>
            Create account
          </Button>
        </form>

        <p className={styles.switchLink}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </motion.main>
    </div>
  );
}
