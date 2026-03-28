import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { Category } from '@workspace/api-client-react';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  const name = isRTL ? category.nameAr || category.name : category.name;
  const imageUrl = category.imageUrl || `https://images.unsplash.com/photo-[placeholder]`;

  return (
    <Link href={`/products?categoryId=${category.id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="group relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-square flex items-end"
      >
        <div className="absolute inset-0 bg-secondary">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-4 sm:p-6 w-full">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-foreground transition-colors">{name}</h3>
          <p className="text-white/80 text-sm">{category.productCount || 0} Products</p>
        </div>
      </motion.div>
    </Link>
  );
}
