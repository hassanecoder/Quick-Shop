import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Menu, Search, X, Sun, Moon, Globe, Zap, User } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useSession } from '@/hooks/use-session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { getItemCount, setIsOpen: setCartOpen } = useCart();
  const { language, setLanguage, theme, setTheme } = useSession();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleLanguage = () => {
    const nextMap: Record<string, 'ar'|'fr'|'en'> = { 'ar': 'fr', 'fr': 'en', 'en': 'ar' };
    const nextLang = nextMap[language];
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-xl group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" fill="currentColor" />
            </div>
            <span className="font-bold text-2xl tracking-tight hidden sm:block">
              Quick<span className="text-primary">Dz</span>
            </span>
          </Link>

          {/* Desktop Navigation & Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-3xl ml-8 gap-8">
            <nav className="flex items-center gap-6 font-medium text-sm">
              <Link href="/products" className="hover:text-primary transition-colors">{t('Products')}</Link>
              <Link href="/categories" className="hover:text-primary transition-colors">{t('Categories')}</Link>
              <Link href="/regions" className="hover:text-primary transition-colors">{t('Delivery')}</Link>
            </nav>

            <form onSubmit={handleSearch} className="flex-1 relative group">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <Input 
                type="search" 
                placeholder={t('Search...')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border-transparent hover:bg-secondary focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-full ltr:pl-10 rtl:pr-10 h-11 transition-all"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={toggleLanguage} className="p-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all" title={t('Language')}>
              <span className="font-bold text-xs uppercase tracking-wider">{language}</span>
            </button>
            <button onClick={toggleTheme} className="p-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all hidden sm:block">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 text-foreground/80 hover:text-accent hover:bg-accent/5 rounded-full transition-all relative hidden sm:block">
              <Heart className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center shadow-sm">
                  {getItemCount()}
                </span>
              )}
            </button>
            <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>
            <Link href="/signin" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-primary/5">
              <User className="w-5 h-5" />
              <span>{t('Sign In')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: i18n.dir() === 'rtl' ? '100%' : '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: i18n.dir() === 'rtl' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden flex flex-col"
          >
            <div className="p-4 flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-secondary rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="px-6 flex-1 flex flex-col gap-8">
              <form onSubmit={handleSearch} className="relative">
                <Input 
                  type="search" 
                  placeholder={t('Search...')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary border-transparent rounded-2xl h-14 text-lg ltr:pl-12 rtl:pr-12"
                />
                <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              </form>

              <nav className="flex flex-col gap-4 text-2xl font-semibold">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>{t('Home')}</Link>
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>{t('Products')}</Link>
                <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)}>{t('Categories')}</Link>
                <Link href="/regions" onClick={() => setIsMobileMenuOpen(false)}>{t('Delivery Info')}</Link>
              </nav>

              <div className="mt-auto pb-8 flex flex-col gap-4">
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
                    {t('Theme')}
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={toggleLanguage}>
                    <Globe className="w-5 h-5 mr-2" />
                    {language.toUpperCase()}
                  </Button>
                </div>
                <Button className="w-full rounded-xl h-12 text-lg" onClick={() => { setIsMobileMenuOpen(false); setLocation('/signin'); }}>
                  <User className="w-5 h-5 mr-2" />
                  {t('Sign In')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
