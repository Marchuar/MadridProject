import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from './useAuth';
import { useToast } from '../../shared/components/Toast/Toast';
import { Button } from '../../shared/components/Button/Button';
import { FormField } from '../../shared/components/FormField/FormField';

const IS_DEV = import.meta.env.DEV;

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState(IS_DEV ? 'testuser' : '');
  const [password, setPassword] = useState(IS_DEV ? 'test123' : '');
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
    <div className="min-h-dvh flex">
      {/* Left: photo panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <img
          src="/cuatro-torres-madrid.jpg"
          alt="Cuatro Torres Madrid"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#E31E24] flex items-center justify-center">
              <span className="font-[Clash_Display] font-black text-white text-[13px]">V</span>
            </div>
            <span className="font-[Clash_Display] font-black text-white text-[15px] tracking-tight">
              VamosMadrid
            </span>
          </div>

          {/* Bottom quote */}
          <div>
            <blockquote className="font-[Clash_Display] font-black text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              "Madrid is a city with no night."
            </blockquote>
            <p className="text-white/55 text-[14px]">— Ernest Hemingway</p>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-12 xl:px-16 bg-white">
        {/* Mobile logo */}
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
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#E31E24] mb-3">Welcome back</p>
            <h1 className="font-[Clash_Display] font-black text-[#111827] text-[36px] leading-none mb-2">
              Sign in
            </h1>
            <p className="text-[14px] text-[#9CA3AF]">Enter your credentials to continue</p>
          </div>

          {IS_DEV && (
            <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 mb-6 text-[13px] text-amber-800">
              <span>Dev mode</span>
              <code className="font-mono font-bold">testuser / test123</code>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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
                  className="flex items-center justify-center text-[#9CA3AF] hover:text-[#5F6B7A] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-[14px] text-[#9CA3AF] border-t border-[#E5E5E3] pt-6">
            No account?{' '}
            <Link to="/register" className="text-[#E31E24] font-semibold hover:opacity-75 transition-opacity">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
