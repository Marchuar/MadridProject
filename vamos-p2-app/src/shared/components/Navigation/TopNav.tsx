import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/useAuth';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';

const NAV_LINKS = [
  { to: '/activities', label: 'Activities' },
  { to: '/map',        label: 'Map' },
  { to: '/calendar',   label: 'Calendar' },
  { to: '/recommendations', label: 'For You' },
  { to: '/my-madrid',  label: 'My Madrid' },
];

export function TopNav() {
  const { logout, user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const transparent = isHome && !scrolled;

  const handleLogout = async () => {
    setUserOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-250 ${
          transparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-sm border-b border-[#E5E5E3]'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 xl:px-10 h-[64px] flex items-center gap-10">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 mr-auto md:mr-0"
            aria-label="VamosMadrid home"
          >
            <div className="w-7 h-7 bg-[#E31E24] flex items-center justify-center flex-shrink-0">
              <span className="font-[Clash_Display] font-black text-white text-[13px] leading-none">V</span>
            </div>
            <span className={`font-[Clash_Display] font-black text-[15px] tracking-tight transition-colors ${transparent ? 'text-white' : 'text-[#111827]'}`}>
              VamosMadrid
            </span>
          </NavLink>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-7 flex-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                    transparent
                      ? isActive ? 'text-white' : 'text-white/75 hover:text-white'
                      : isActive ? 'text-[#E31E24]' : 'text-[#5F6B7A] hover:text-[#111827]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Auth / user */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(v => !v)}
                  className={`flex items-center gap-2 text-[13.5px] font-medium transition-colors ${
                    transparent ? 'text-white hover:text-white/80' : 'text-[#111827] hover:text-[#5F6B7A]'
                  }`}
                  aria-expanded={userOpen}
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 bg-[#E31E24] rounded-full flex items-center justify-center text-white text-[12px] font-bold leading-none flex-shrink-0">
                    {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden lg:block max-w-[100px] truncate">{user?.displayName?.split(' ')[0]}</span>
                  <ChevronDown size={13} className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                      <motion.div
                        className="absolute right-0 top-[calc(100%+8px)] w-44 bg-white border border-[#E5E5E3] shadow-lg z-20 overflow-hidden rounded-[8px]"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.14 }}
                      >
                        <NavLink
                          to="/profile"
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-3 text-[13.5px] text-[#111827] hover:bg-[#FAFAF8] transition-colors"
                        >
                          <User size={14} /> Profile
                        </NavLink>
                        <div className="h-px bg-[#E5E5E3]" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-[13.5px] text-[#E31E24] hover:bg-[#FEF2F2] transition-colors"
                        >
                          <LogOut size={14} /> Sign out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="h-9 px-5 bg-[#E31E24] text-white text-[13.5px] font-semibold hover:bg-[#C91018] transition-colors flex items-center"
              >
                Sign in
              </NavLink>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden ml-2 transition-colors ${transparent ? 'text-white' : 'text-[#111827]'}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[199] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
            <motion.nav
              className="absolute top-[64px] left-2 right-2 bg-white border border-[#E5E5E3] overflow-hidden rounded-[8px] shadow-lg"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `block px-6 py-4 text-[15px] font-medium border-b border-[#F0F0EE] transition-colors ${
                      isActive ? 'text-[#E31E24] bg-[#FEF2F2]' : 'text-[#111827] hover:bg-[#FAFAF8]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              {isLoggedIn ? (
                <>
                  <NavLink
                    to="/profile"
                    className="block px-6 py-4 text-[15px] font-medium text-[#111827] hover:bg-[#FAFAF8] border-b border-[#F0F0EE]"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-6 py-4 text-[15px] font-medium text-[#E31E24] hover:bg-[#FEF2F2]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="block px-6 py-4 text-[15px] font-semibold text-[#E31E24]"
                >
                  Sign in
                </NavLink>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
