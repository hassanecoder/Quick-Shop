import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

type Theme = 'light' | 'dark' | 'system';
type Language = 'ar' | 'fr' | 'en';

interface SessionState {
  sessionId: string;
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: uuidv4(),
      theme: 'system',
      language: 'ar',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'quickdz-session' }
  )
);
