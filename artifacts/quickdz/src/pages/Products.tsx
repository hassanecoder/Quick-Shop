import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useListProducts, useListCategories, ListProductsSortBy } from '@workspace/api-client-react';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Products() {
  const { t } = useTranslation();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  
  const initialCategory = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const initialSearch = searchParams.get('search') || undefined;

  const [categoryId, setCategoryId] = useState<number | undefined>(initialCategory);
  const [search] = useState<string | undefined>(initialSearch);
  const [sortBy, setSortBy] = useState<ListProductsSortBy>(ListProductsSortBy.newest);

  const { data: categories = [] } = useListCategories();
  const { data: productsData, isLoading } = useListProducts({ categoryId, search, sortBy, limit: 20 });

  const products = productsData?.products || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <SlidersHorizontal className="w-5 h-5" />
              {t('Categories')}
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => setCategoryId(undefined)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoryId ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-secondary text-muted-foreground'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryId === cat.id ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-secondary text-muted-foreground'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t">
            <h3 className="font-bold text-lg mb-4">{t('Price')} Range</h3>
            {/* Range slider placeholder */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="w-full px-3 py-2 bg-secondary rounded-md text-sm outline-none focus:ring-2 ring-primary/20" />
                <span className="text-muted-foreground">-</span>
                <input type="number" placeholder="Max" className="w-full px-3 py-2 bg-secondary rounded-md text-sm outline-none focus:ring-2 ring-primary/20" />
              </div>
              <Button variant="outline" className="w-full">Apply Filter</Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">
              {search ? `Search results for "${search}"` : t('Products')}
              <span className="text-muted-foreground text-lg ml-2 font-normal">({productsData?.total || 0})</span>
            </h1>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as ListProductsSortBy)}
                className="bg-secondary px-4 py-2 rounded-lg text-sm font-medium outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mx-auto mb-6">
                  <SlidersHorizontal className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
                <Button onClick={() => { setCategoryId(undefined); }}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
