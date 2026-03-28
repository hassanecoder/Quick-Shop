import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Zap, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-background pt-20 pb-10 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group inline-flex">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-xl">
                <Zap className="w-6 h-6" fill="currentColor" />
              </div>
              <span className="font-bold text-3xl tracking-tight">
                Quick<span className="text-primary">Dz</span>
              </span>
            </Link>
            <p className="text-background/70 leading-relaxed max-w-sm">
              Your premium destination for shopping in Algeria. Fast delivery to all 58 wilayas, cash on delivery, and 24/7 customer support.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">{t('Categories')}</h4>
            <ul className="space-y-4 text-background/70">
              <li><Link href="/products?category=electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=fashion" className="hover:text-primary transition-colors">Fashion & Apparel</Link></li>
              <li><Link href="/products?category=home" className="hover:text-primary transition-colors">Home & Kitchen</Link></li>
              <li><Link href="/products?category=beauty" className="hover:text-primary transition-colors">Beauty & Health</Link></li>
              <li><Link href="/categories" className="hover:text-primary font-medium text-background">View All Categories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-background/70">
              <li><Link href="/products" className="hover:text-primary transition-colors">{t('Products')}</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">{t('Cart')}</Link></li>
              <li><Link href="/regions" className="hover:text-primary transition-colors">{t('Delivery Info')}</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-background/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>123 Didouche Mourad Street, Algiers, Algeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span dir="ltr">+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contact@quickdz.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>© {new Date().getFullYear()} QuickDz. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-background transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
