import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';

export default function CartDrawer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [, setLocation] = useLocation();
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, getTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 w-full max-w-md bg-background shadow-2xl z-[101] flex flex-col ${isRTL ? 'left-0' : 'right-0'}`}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">{t('Cart')} ({items.length})</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold">{t('Your cart is empty')}</h3>
                  <Button onClick={() => { setIsOpen(false); setLocation('/products'); }} variant="outline">
                    {t('Continue Shopping')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 group">
                      <div className="w-24 h-24 rounded-xl bg-secondary overflow-hidden shrink-0 border border-border">
                        <img 
                          src={item.product.imageUrl || ''} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold line-clamp-2 text-sm leading-tight">
                            {isRTL ? item.product.nameAr || item.product.name : item.product.name}
                          </h4>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-primary font-bold mt-1">
                          {Number(item.product.price).toLocaleString()} DA
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border rounded-lg bg-background">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t bg-secondary/30">
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="font-medium text-muted-foreground">{t('Total')}</span>
                  <span className="font-bold text-2xl">{getTotal().toLocaleString()} {t('DA')}</span>
                </div>
                <Button 
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20"
                  onClick={() => {
                    setIsOpen(false);
                    setLocation('/checkout');
                  }}
                >
                  {t('Checkout')}
                  <ArrowRight className="ml-2 w-5 h-5 rtl:rotate-180" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
