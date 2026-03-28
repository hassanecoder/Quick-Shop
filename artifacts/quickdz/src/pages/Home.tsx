import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { ArrowRight, ShieldCheck, Truck, HeadphonesIcon, CreditCard } from 'lucide-react';
import { useListCategories, useListProducts } from '@workspace/api-client-react';
import ProductCard from '@/components/ui/ProductCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const { data: categories = [], isLoading: loadingCategories } = useListCategories();
  const { data: productsData, isLoading: loadingProducts } = useListProducts({ featured: true, limit: 8 });

  const products = productsData?.products || [];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center opacity-40 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 uppercase tracking-wider backdrop-blur-md">
            The #1 Marketplace in Algeria
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Discover <span className="gradient-text">Premium</span> Products Delivered Fast
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Shop the latest electronics, fashion, and home goods. Delivery to all 58 wilayas with cash on delivery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/25" asChild>
              <Link href="/products">{t('Shop by Category')}</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg bg-background/50 backdrop-blur-md" asChild>
              <Link href="/categories">{t('Categories')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: t('Delivery'), desc: "All 58 Wilayas" },
            { icon: CreditCard, title: t('Payment'), desc: "Cash on delivery" },
            { icon: ShieldCheck, title: "Secure", desc: "Quality guaranteed" },
            { icon: HeadphonesIcon, title: t('Support'), desc: "Always here for you" }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-secondary/50 rounded-3xl">
              <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center shadow-sm text-primary mb-4">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">{t('Shop by Category')}</h2>
            <p className="text-muted-foreground mt-2">Find what you need easily</p>
          </div>
          <Link href="/categories" className="hidden sm:flex items-center text-primary font-semibold hover:underline">
            View All <ArrowRight className="w-4 h-4 ml-1 rtl:rotate-180" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loadingCategories ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)
          ) : (
            categories.slice(0, 6).map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img 
            src={`${import.meta.env.BASE_URL}images/promo-banner.png`} 
            alt="Promotion" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center p-8 md:p-16">
            <div className="max-w-xl text-white">
              <span className="inline-block py-1 px-3 rounded-md bg-accent text-accent-foreground font-bold text-sm mb-4">Limited Time Offer</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Up to 50% Off Top Brands</h2>
              <p className="text-lg text-white/80 mb-8">Upgrade your lifestyle with our exclusive collection. Only available this week.</p>
              <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-white text-black hover:bg-white/90">
                {t('Buy Now')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">{t('Featured Products')}</h2>
            <p className="text-muted-foreground mt-2">Handpicked quality items</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center text-primary font-semibold hover:underline">
            View All <ArrowRight className="w-4 h-4 ml-1 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loadingProducts ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
