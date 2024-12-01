import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Companies', href: '/companies' },
    { name: 'Resources', href: '/resources' },
    { name: 'About ', href: '/about' }
  ];

  const themes = [
    { name: 'Light', value: 'light', icon: '☀️' },
    { name: 'Dark', value: 'dark', icon: '🌙' },
    { name: 'System', value: 'system', icon: '💻' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHeaderVisible(false); 
      } else {
        setHeaderVisible(true); 
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`fixed w-full top-0 bg-emerald-500/90 dark:bg-emerald-800/90 p-2 md:p-4 h-[10vh] md:h-[12vh] flex items-center justify-between z-50 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/assets/Logo2.png" alt="Logo" className="w-[60px] h-[60px] md:w-[80px] md:h-[80px]" />
          <h1 className="text-lg md:text-2xl m-0 text-white">RemoHive</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-white hover:text-emerald-100 transition-colors duration-200 text-base font-bold ${
                  location.pathname === link.href ? 'text-blue-500 font-bold text-lg' : '' 
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Theme Selector */}
          <div className="relative group">

            <div className="hidden group-hover:block absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-32 py-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900 flex items-center space-x-2
                    ${theme === t.value ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  <span>{t.icon}</span>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">

          <button 
            className="text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <i className={`fa ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg md:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-emerald-500 hover:text-white border-b border-gray-100 dark:border-gray-700"
                onClick={() => setShowMobileMenu(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;