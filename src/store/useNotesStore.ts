import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note, Tag, NoteFilters } from '../types';
import { saveNotes, loadNotes, loadTags, saveTags, extractPreview, getDemoNotes } from '../utils/storage';

interface NotesStore {
  // Состояние
  notes: Note[];
  tags: Tag[];
  activeNoteId: string | null;
  filters: NoteFilters;
  isSidebarOpen: boolean;

  // Действия с заметками
  createNote: () => void;
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'isPinned'>>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  togglePin: (id: string) => void;

  // Действия с тегами
  addTag: (name: string, color: Tag['color']) => void;
  removeTag: (id: string) => void;

  // Фильтры
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tagId: string | null) => void;
  setSortBy: (sortBy: NoteFilters['sortBy']) => void;

  // UI
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Получение отфильтрованных заметок
  getFilteredNotes: () => Note[];
  getActiveNote: () => Note | undefined;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  // Начальное состояние
  notes: loadNotes(),
  tags: loadTags(),
  activeNoteId: loadNotes()[0]?.id || null,
  filters: {
    searchQuery: '',
    selectedTag: null,
    sortBy: 'updatedAt',
  },
  isSidebarOpen: true,

  // Создать новую заметку
  createNote: () => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      preview: '',
      tags: [],
      createdAt: now,
      updatedAt: now,
      isPinned: false,
    };
    set((state) => {
      const updatedNotes = [newNote, ...state.notes];
      saveNotes(updatedNotes);
      return {
        notes: updatedNotes,
        activeNoteId: newNote.id,
      };
    });
  },

  // Обновить заметку
  updateNote: (id, updates) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) => {
        if (note.id !== id) return note;
        const updated = {
          ...note,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        // Обновляем превью если изменился контент
        if (updates.content !== undefined) {
          updated.preview = extractPreview(updates.content);
        }
        return updated;
      });
      saveNotes(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  // Удалить заметку
  deleteNote: (id) => {
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== id);
      saveNotes(updatedNotes);
      const newActiveId = state.activeNoteId === id
        ? (updatedNotes.length > 0 ? updatedNotes[0].id : null)
        : state.activeNoteId;
      return {
        notes: updatedNotes,
        activeNoteId: newActiveId,
      };
    });
  },

  // Установить активную заметку
  setActiveNote: (id) => {
    set({ activeNoteId: id });
  },

  // Переключить закрепление
  togglePin: (id) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() } : note
      );
      saveNotes(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  // Добавить тег
  addTag: (name, color) => {
    const newTag: Tag = { id: uuidv4(), name, color };
    set((state) => {
      const updatedTags = [...state.tags, newTag];
      saveTags(updatedTags);
      return { tags: updatedTags };
    });
  },

  // Удалить тег
  removeTag: (id) => {
    set((state) => {
      const updatedTags = state.tags.filter((t) => t.id !== id);
      // Также удаляем тег из всех заметок
      const updatedNotes = state.notes.map((note) => ({
        ...note,
        tags: note.tags.filter((t) => t.id !== id),
      }));
      saveTags(updatedTags);
      saveNotes(updatedNotes);
      return { tags: updatedTags, notes: updatedNotes };
    });
  },

  // Фильтры
  setSearchQuery: (query) => {
    set((state) => ({ filters: { ...state.filters, searchQuery: query } }));
  },

  setSelectedTag: (tagId) => {
    set((state) => ({ filters: { ...state.filters, selectedTag: tagId } }));
  },

  setSortBy: (sortBy) => {
    set((state) => ({ filters: { ...state.filters, sortBy } }));
  },

  // UI
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ isSidebarOpen: open });
  },

  // Получить отфильтрованные и отсортированные заметки
  getFilteredNotes: () => {
    const { notes, filters } = get();
    let filtered = [...notes];

    // Фильтр по поисковому запросу
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.preview.toLowerCase().includes(query)
      );
    }

    // Фильтр по тегу
    if (filters.selectedTag) {
      filtered = filtered.filter((note) =>
        note.tags.some((tag) => tag.id === filters.selectedTag)
      );
    }

    // Сортировка: закреплённые всегда сверху
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (filters.sortBy) {
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  },

  // Получить активную заметку
  getActiveNote: () => {
    const { notes, activeNoteId } = get();
    return notes.find((note) => note.id === activeNoteId);
  },
}));
