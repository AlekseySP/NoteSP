import { BookOpen, Plus, Search, Tag } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';

export default function EmptyState() {
  const { createNote } = useNotesStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-card">
      <div className="w-24 h-24 rounded-2xl bg-accent flex items-center justify-center mb-6 shadow-sm">
        <BookOpen className="w-12 h-12 text-blue-300" />
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">
        Добро пожаловать в Дневник
      </h2>
      <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-8">
        Создайте свою первую запись или выберите существующую заметку
        из списка в боковой панели.
      </p>

      <button
        onClick={createNote}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600
          text-white rounded-lg text-sm font-medium transition-colors shadow-sm
          shadow-blue-500/20 mb-8"
      >
        <Plus className="w-4 h-4" />
        Создать первую запись
      </button>

      {/* Подсказки */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg">
        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-cream">
          <Search className="w-5 h-5 text-text-muted" />
          <span className="text-xs text-text-secondary text-center">Поиск по всем заметкам</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-cream">
          <Tag className="w-5 h-5 text-text-muted" />
          <span className="text-xs text-text-secondary text-center">Теги для организации</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-cream">
          <BookOpen className="w-5 h-5 text-text-muted" />
          <span className="text-xs text-text-secondary text-center">Богатый редактор</span>
        </div>
      </div>

      {/* Горячие клавиши */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-cream-dark border border-border rounded text-[10px] font-mono">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-cream-dark border border-border rounded text-[10px] font-mono">N</kbd>
          <span className="ml-1">Новая заметка</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-cream-dark border border-border rounded text-[10px] font-mono">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-cream-dark border border-border rounded text-[10px] font-mono">B</kbd>
          <span className="ml-1">Жирный</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-cream-dark border border-border rounded text-[10px] font-mono">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-cream-dark border border-border rounded text-[10px] font-mono">I</kbd>
          <span className="ml-1">Курсив</span>
        </div>
      </div>
    </div>
  );
}
