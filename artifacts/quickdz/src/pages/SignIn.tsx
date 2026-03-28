import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignIn() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-border">
        <div className="flex justify-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg shadow-primary/20">
            <Zap className="w-8 h-8" fill="currentColor" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to your QuickDz account</p>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('Email')}</label>
            <Input type="email" placeholder="you@example.com" className="h-14 rounded-xl bg-secondary border-transparent focus:bg-background" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold">{t('Password')}</label>
              <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot?</a>
            </div>
            <Input type="password" placeholder="••••••••" className="h-14 rounded-xl bg-secondary border-transparent focus:bg-background" />
          </div>

          <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 mt-4">
            {t('Sign In')}
          </Button>
        </form>

        <div className="mt-8 text-center text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            {t('Sign Up')}
          </Link>
        </div>
      </div>
    </div>
  );
}
