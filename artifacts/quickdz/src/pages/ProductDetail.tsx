import { useState } from 'react';
import { useRoute } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useGetProduct, useGetRelatedProducts, useCreateOrder, useListRegions } from '@workspace/api-client-react';
import { useCart } from '@/hooks/use-cart';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const instantOrderSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(9, "Valid phone required"),
  regionId: z.coerce.number().min(1, "Wilaya is required"),
});

type InstantOrderForm = z.infer<typeof instantOrderSchema>;

export default function ProductDetail() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute('/products/:id');
  const productId = Number(params?.id);
  const isRTL = i18n.dir() === 'rtl';
  const { toast } = useToast();
  
  const { addItem, setIsOpen: setCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useGetProduct(productId, { query: { enabled: !!productId } });
  const { data: related = [] } = useGetRelatedProducts(productId, { query: { enabled: !!productId } });
  const { data: regions = [] } = useListRegions();
  
  const createOrder = useCreateOrder();

  const { register, handleSubmit, formState: { errors } } = useForm<InstantOrderForm>({
    resolver: zodResolver(instantOrderSchema)
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12"><Skeleton className="w-full h-[600px] rounded-3xl" /></div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  const allImages = product.images?.length ? [product.imageUrl, ...product.images] : [product.imageUrl];
  const name = isRTL ? product.nameAr || product.name : product.name;
  const description = isRTL ? product.descriptionAr || product.description : product.description;

  const onInstantOrder = (data: InstantOrderForm) => {
    createOrder.mutate({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        regionId: data.regionId,
        isInstant: true,
        items: [{ productId: product.id, quantity, price: Number(product.price) }]
      }
    }, {
      onSuccess: () => {
        toast({ title: "Order Placed Successfully!", description: "We will contact you shortly to confirm." });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-secondary border border-border">
            <img 
              src={allImages[activeImage]} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col">
          <div className="mb-2 text-primary font-bold text-sm tracking-widest uppercase">
            {isRTL ? product.categoryNameAr || product.categoryName : product.categoryName}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">{name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold">{Number(product.rating).toFixed(1)}</span>
              <span className="text-sm text-amber-600/80 dark:text-amber-500/80">({product.reviewCount} reviews)</span>
            </div>
            {product.stock > 0 ? (
              <span className="text-green-600 bg-green-500/10 px-3 py-1 rounded-full font-bold text-sm">In Stock</span>
            ) : (
              <span className="text-red-600 bg-red-500/10 px-3 py-1 rounded-full font-bold text-sm">Out of Stock</span>
            )}
          </div>

          <div className="flex items-end gap-4 mb-8">
            <div className="text-4xl font-black text-foreground">{Number(product.price).toLocaleString()} DA</div>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <div className="text-xl text-muted-foreground line-through mb-1">{Number(product.originalPrice).toLocaleString()} DA</div>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">{description}</p>

          {/* Actions */}
          <div className="flex gap-4 mb-10">
            <div className="flex items-center bg-secondary rounded-2xl p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center font-bold text-xl rounded-xl hover:bg-background transition-colors"
              >-</button>
              <div className="w-12 text-center font-bold text-lg">{quantity}</div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center font-bold text-xl rounded-xl hover:bg-background transition-colors"
              >+</button>
            </div>
            <Button 
              size="lg" 
              className="flex-1 h-[56px] rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
              onClick={() => {
                addItem(product, quantity);
                setCartOpen(true);
              }}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {t('Add to Cart')}
            </Button>
            <Button size="icon" variant="outline" className="h-[56px] w-[56px] rounded-2xl border-2">
              <Heart className="w-6 h-6" />
            </Button>
          </div>

          {/* Instant Order Form - High Conversion Feature */}
          <div className="bg-secondary/50 rounded-3xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4 text-primary font-bold">
              <Zap className="w-5 h-5" fill="currentColor" />
              <h3 className="text-lg uppercase tracking-wider">{t('Instant Order')}</h3>
            </div>
            <form onSubmit={handleSubmit(onInstantOrder)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input placeholder={t('Full Name')} {...register("fullName")} className="bg-background h-12 rounded-xl" />
                  {errors.fullName && <span className="text-destructive text-xs mt-1">{errors.fullName.message}</span>}
                </div>
                <div>
                  <Input placeholder={t('Phone Number')} {...register("phone")} className="bg-background h-12 rounded-xl" dir="ltr" />
                  {errors.phone && <span className="text-destructive text-xs mt-1">{errors.phone.message}</span>}
                </div>
              </div>
              <div>
                <select 
                  {...register("regionId")}
                  className="w-full bg-background border border-input h-12 px-3 rounded-xl outline-none focus:ring-2 ring-primary/20 font-medium"
                >
                  <option value="">-- Select {t('Wilaya')} --</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.code} - {isRTL ? r.nameAr : r.name}</option>
                  ))}
                </select>
                {errors.regionId && <span className="text-destructive text-xs mt-1">{errors.regionId.message}</span>}
              </div>
              <Button type="submit" disabled={createOrder.isPending} className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-lg shadow-accent/20">
                {createOrder.isPending ? "Processing..." : t('Buy Now')}
              </Button>
            </form>
          </div>
          
          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <span className="font-medium text-sm">Delivery to 58 Wilayas</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="font-medium text-sm">Secure Shopping</span>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-8">{t('Related Products')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.slice(0, 4).map((prod, i) => (
              <ProductCard key={prod.id} product={prod} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
