import { useTranslation } from 'react-i18next';
import { useListRegions } from '@workspace/api-client-react';
import { MapPin, Truck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Regions() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { data: regions = [], isLoading } = useListRegions();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Truck className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('Delivery Info')}</h1>
        <p className="text-lg text-muted-foreground">
          We deliver to all 58 wilayas in Algeria. Check the estimated delivery times and fees for your region below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 58 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          regions.map((region) => (
            <div key={region.id} className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="bg-secondary text-foreground font-black text-xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                {region.code}
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1">
                  {isRTL ? region.nameAr : region.name}
                </h3>
                <div className="flex flex-col text-sm text-muted-foreground">
                  <span>{region.deliveryDays} Days</span>
                  <span className="text-primary font-semibold">{region.deliveryFee.toLocaleString()} DA</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
