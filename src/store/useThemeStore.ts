import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const THEME_KEY = 'diary-theme';

/** Определяет системную тему */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Применяет тему к DOM */
function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: (localStorage.getItem(THEME_KEY) as Theme) || 'light',
  resolvedTheme: 'light',

  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    applyTheme(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const { theme } = get();
    // Переключаем: light -> dark -> system -> light
    const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    get().setTheme(next);
  },

  initTheme: () => {
    const saved = (localStorage.getItem(THEME_KEY) as Theme) || 'light';
    const resolved = saved === 'system' ? getSystemTheme() : saved;
    applyTheme(resolved);
    set({ theme: saved, resolvedTheme: resolved });

    // Подписываемся на изменения системной темы
    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (get().theme === 'system') {
          const newResolved = getSystemTheme();
          applyTheme(newResolved);
          set({ resolvedTheme: newResolved });
        }
      });
    }
  },
}));
