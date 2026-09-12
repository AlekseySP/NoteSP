import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, Theme } from '../store/useThemeStore';

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Светлая' },
    { value: 'dark', icon: Moon, label: 'Тёмная' },
    { value: 'system', icon: Monitor, label: 'Системная' },
  ];

  return (
    <div className="flex items-center gap-0.5 bg-cream-dark rounded-lg p-0.5">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`p-1.5 rounded-md transition-all
            ${theme === value
              ? 'bg-card text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
            }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
