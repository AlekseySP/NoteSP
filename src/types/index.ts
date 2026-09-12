/**
 * Основные типы данных для приложения дневника
 */

/** Тег для категоризации заметок */
export interface Tag {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'pink';
}

/** Основная модель заметки */
export interface Note {
  id: string;
  title: string;
  content: string; // HTML-содержимое из TipTap
  preview: string; // Текстовое превью (первые 100 символов)
  tags: Tag[];
  createdAt: string; // ISO-строка
  updatedAt: string; // ISO-строка
  isPinned: boolean;
}

/** Фильтры для списка заметок */
export interface NoteFilters {
  searchQuery: string;
  selectedTag: string | null;
  sortBy: 'updatedAt' | 'createdAt' | 'title';
}

/** Состояние приложения */
export interface AppState {
  notes: Note[];
  activeNoteId: string | null;
  filters: NoteFilters;
  isSidebarOpen: boolean;
}
