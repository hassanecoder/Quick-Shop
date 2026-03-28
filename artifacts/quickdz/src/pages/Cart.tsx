import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { items, updateQuantity, removeItem, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8 text-muted-foreground">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <h1 className="text-4xl font-bold mb-4">{t('Your cart is empty')}</h1>
        <p className="text-lg text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button size="lg" className="rounded-full h-14 px-8 text-lg" asChild>
          <Link href="/products">{t('Continue Shopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-10">{t('Cart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.product.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-3xl border border-border shadow-sm">
              <div className="w-full sm:w-32 h-32 rounded-2xl bg-secondary overflow-hidden shrink-0 border border-border">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      {isRTL ? item.product.nameAr || item.product.name : item.product.name}
                    </h3>
                    <div className="text-sm text-primary font-semibold">
                      {isRTL ? item.product.categoryNameAr || item.product.categoryName : item.product.categoryName}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center bg-secondary rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center font-bold rounded-lg hover:bg-background transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >-</button>
                    <div className="w-10 text-center font-bold">{item.quantity}</div>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center font-bold rounded-lg hover:bg-background transition-colors"
                    >+</button>
                  </div>
                  <div className="text-xl font-black text-foreground">
                    {(Number(item.product.price) * item.quantity).toLocaleString()} DA
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-secondary/50 rounded-3xl p-8 border border-border sticky top-28">
            <h3 className="text-2xl font-bold mb-6">{t('Order Summary')}</h3>
            
            <div className="space-y-4 mb-8 text-lg">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{getTotal().toLocaleString()} {t('DA')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-border pt-4 mt-4 flex justify-between font-black text-2xl text-foreground">
                <span>{t('Total')}</span>
                <span>{getTotal().toLocaleString()} {t('DA')}</span>
              </div>
            </div>

            <Button size="lg" className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20" asChild>
              <Link href="/checkout">
                {t('Checkout')}
                <ArrowRight className="ml-2 w-6 h-6 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
