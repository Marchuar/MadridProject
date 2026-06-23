import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from './useAuth';
import { useToast } from '../../shared/components/Toast/Toast';
import { Button } from '../../shared/components/Button/Button';
import { FormField } from '../../shared/components/FormField/FormField';

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
    <div className="min-h-dvh flex">
      {/* Left: photo panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <img
          src={((window as any).vamosp2Config?.assetsUrl ?? '') + '/loginPageBG.jpg'}
          alt="Madrid"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#E31E24] flex items-center justify-center">
              <span className="font-[Clash_Display] font-black text-white text-[13px]">V</span>
            </div>
            <span className="font-[Clash_Display] font-black text-white text-[15px] tracking-tight">
              VamosMadrid
            </span>
          </div>
          <div>
            <blockquote className="font-[Clash_Display] font-black text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              "Life is short. Madrid is long."
            </blockquote>
            <p className="text-white/55 text-[14px]">Join thousands exploring the city</p>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-12 xl:px-16 bg-white overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2.5 mb-12">
          <div className="w-7 h-7 bg-[#E31E24] flex items-center justify-center">
            <span className="font-[Clash_Display] font-black text-white text-[13px]">V</span>
          </div>
          <span className="font-[Clash_Display] font-black text-[#111827] text-[15px] tracking-tight">
            VamosMadrid
          </span>
        </div>

        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#E31E24] mb-3">Get started</p>
            <h1 className="font-[Clash_Display] font-black text-[#111827] text-[36px] leading-none mb-2">
              Create account
            </h1>
            <p className="text-[14px] text-[#9CA3AF]">Join to get personalised activity recommendations</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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
                  className="flex items-center justify-center text-[#9CA3AF] hover:text-[#5F6B7A] transition-colors p-1"
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

          <p className="mt-8 text-center text-[14px] text-[#9CA3AF] border-t border-[#E5E5E3] pt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E31E24] font-semibold hover:opacity-75 transition-opacity">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
