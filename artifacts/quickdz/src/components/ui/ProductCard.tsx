import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@workspace/api-client-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const isRTL = i18n.dir() === 'rtl';

  // Fallback image if missing
  const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-[placeholder]`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col h-full relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">NEW</span>
          )}
          {product.badge && (
            <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">{product.badge}</span>
          )}
        </div>
        <button className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-background shadow-sm transition-all pointer-events-auto">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img 
          src={imageUrl} 
          alt={isRTL ? product.nameAr || product.name : product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-primary font-medium mb-1.5">
          {isRTL ? product.categoryNameAr || product.categoryName : product.categoryName}
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {isRTL ? product.nameAr || product.name : product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mt-2 text-amber-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium text-foreground">{Number(product.rating).toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            <div className="font-bold text-lg text-foreground">
              {Number(product.price).toLocaleString()} DA
            </div>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <div className="text-sm text-muted-foreground line-through">
                {Number(product.originalPrice).toLocaleString()} DA
              </div>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors active:scale-95"
            title={t('Add to Cart')}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
