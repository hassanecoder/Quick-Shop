import { useTranslation } from 'react-i18next';
import { useListCategories } from '@workspace/api-client-react';
import CategoryCard from '@/components/ui/CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Categories() {
  const { t } = useTranslation();
  const { data: categories = [], isLoading } = useListCategories();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('Categories')}</h1>
        <p className="text-lg text-muted-foreground">
          Browse our extensive collection of products structured for your convenience.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))
        ) : (
          categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
