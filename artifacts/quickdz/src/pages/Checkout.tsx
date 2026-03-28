import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useListRegions, useCreateOrder } from '@workspace/api-client-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(9, "Valid phone number required"),
  regionId: z.coerce.number().min(1, "Please select a wilaya"),
  address: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { items, getTotal, clearCart } = useCart();
  
  const { data: regions = [] } = useListRegions();
  const createOrder = useCreateOrder();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  });

  if (items.length === 0) {
    setLocation('/cart');
    return null;
  }

  const onSubmit = (data: CheckoutForm) => {
    createOrder.mutate({
      data: {
        ...data,
        isInstant: false,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity, price: Number(i.product.price) }))
      }
    }, {
      onSuccess: () => {
        clearCart();
        toast({ title: "Order Confirmed!", description: "Thank you for shopping with us." });
        setLocation('/');
      }
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-10">{t('Checkout')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t('Full Name')} *</label>
                <Input {...register('fullName')} className="h-14 rounded-xl bg-secondary" placeholder="e.g. Amina Benali" />
                {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">{t('Phone Number')} *</label>
                <Input {...register('phone')} className="h-14 rounded-xl bg-secondary" placeholder="0555 00 00 00" dir="ltr" />
                {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">{t('Wilaya')} *</label>
                <select 
                  {...register('regionId')}
                  className="w-full h-14 px-4 rounded-xl bg-secondary border border-transparent focus:border-primary focus:ring-2 ring-primary/20 outline-none font-medium transition-all"
                >
                  <option value="">-- Select Wilaya --</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.code} - {isRTL ? r.nameAr : r.name}</option>
                  ))}
                </select>
                {errors.regionId && <p className="text-destructive text-sm">{errors.regionId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">{t('Address')}</label>
                <Input {...register('address')} className="h-14 rounded-xl bg-secondary" placeholder="Street name, building..." />
              </div>

            </form>
          </div>
        </div>

        <div>
          <div className="bg-secondary/30 rounded-3xl p-8 border border-border sticky top-28">
            <h3 className="text-2xl font-bold mb-6">{t('Order Summary')}</h3>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-card border overflow-hidden shrink-0">
                    <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1">{isRTL ? item.product.nameAr || item.product.name : item.product.name}</h4>
                    <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold">
                    {(Number(item.product.price) * item.quantity).toLocaleString()} DA
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 space-y-4 text-lg">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{getTotal().toLocaleString()} {t('DA')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>Depends on Wilaya</span>
              </div>
              <div className="border-t border-border pt-4 mt-4 flex justify-between font-black text-3xl text-foreground">
                <span>{t('Total')}</span>
                <span className="text-primary">{getTotal().toLocaleString()} {t('DA')}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              disabled={createOrder.isPending}
              className="w-full h-16 mt-8 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20"
            >
              {createOrder.isPending ? "Processing..." : t('Place Order')}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">Cash on delivery only. You pay when you receive the product.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
