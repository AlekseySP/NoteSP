import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Note, Tag, NoteFilters } from '../types';
import { saveNotes, loadNotes, loadTags, saveTags, extractPreview, getDemoNotes } from '../utils/storage';

interface NotesStore {
  // Состояние
  notes: Note[];
  tags: Tag[];
  activeNoteId: string | null;
  filters: NoteFilters;
  isSidebarOpen: boolean;
  calendarView: 'month' | 'week';

  // Действия с заметками
  createNote: () => void;
  createNoteForDate: (date: Date) => void;
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
  setSelectedDate: (date: string | null) => void;
  setSortBy: (sortBy: NoteFilters['sortBy']) => void;
  clearFilters: () => void;

  // UI
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCalendarView: (view: 'month' | 'week') => void;

  // Получение данных
  getFilteredNotes: () => Note[];
  getActiveNote: () => Note | undefined;
  getNoteForDate: (date: Date) => Note | undefined;
  getDatesWithNotes: () => Set<string>;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  // Начальное состояние
  notes: loadNotes(),
  tags: loadTags(),
  activeNoteId: loadNotes()[0]?.id || null,
  filters: {
    searchQuery: '',
    selectedTag: null,
    selectedDate: null,
    sortBy: 'updatedAt',
  },
  isSidebarOpen: true,
  calendarView: 'month',

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

  // Создать заметку на конкретную дату
  createNoteForDate: (date: Date) => {
    // Устанавливаем время на полдень, чтобы избежать проблем с часовыми зонами
    const targetDate = new Date(date);
    targetDate.setHours(12, 0, 0, 0);
    const iso = targetDate.toISOString();

    const newNote: Note = {
      id: uuidv4(),
      title: format(targetDate, 'd MMMM yyyy'),
      content: '',
      preview: '',
      tags: [],
      createdAt: iso,
      updatedAt: iso,
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

  setActiveNote: (id) => {
    set({ activeNoteId: id });
  },

  togglePin: (id) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() } : note
      );
      saveNotes(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  addTag: (name, color) => {
    const newTag: Tag = { id: uuidv4(), name, color };
    set((state) => {
      const updatedTags = [...state.tags, newTag];
      saveTags(updatedTags);
      return { tags: updatedTags };
    });
  },

  removeTag: (id) => {
    set((state) => {
      const updatedTags = state.tags.filter((t) => t.id !== id);
      const updatedNotes = state.notes.map((note) => ({
        ...note,
        tags: note.tags.filter((t) => t.id !== id),
      }));
      saveTags(updatedTags);
      saveNotes(updatedNotes);
      return { tags: updatedTags, notes: updatedNotes };
    });
  },

  setSearchQuery: (query) => {
    set((state) => ({ filters: { ...state.filters, searchQuery: query } }));
  },

  setSelectedTag: (tagId) => {
    set((state) => ({ filters: { ...state.filters, selectedTag: tagId } }));
  },

  setSelectedDate: (date) => {
    set((state) => ({ filters: { ...state.filters, selectedDate: date } }));
  },

  setSortBy: (sortBy) => {
    set((state) => ({ filters: { ...state.filters, sortBy } }));
  },

  clearFilters: () => {
    set((state) => ({
      filters: { ...state.filters, searchQuery: '', selectedTag: null, selectedDate: null },
    }));
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ isSidebarOpen: open });
  },

  setCalendarView: (view) => {
    set({ calendarView: view });
  },

  getFilteredNotes: () => {
    const { notes, filters } = get();
    let filtered = [...notes];

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.preview.toLowerCase().includes(query)
      );
    }

    if (filters.selectedTag) {
      filtered = filtered.filter((note) =>
        note.tags.some((tag) => tag.id === filters.selectedTag)
      );
    }

    // Фильтр по дате
    if (filters.selectedDate) {
      filtered = filtered.filter((note) => {
        const noteDate = format(new Date(note.createdAt), 'yyyy-MM-dd');
        return noteDate === filters.selectedDate;
      });
    }

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

  getActiveNote: () => {
    const { notes, activeNoteId } = get();
    return notes.find((note) => note.id === activeNoteId);
  },

  // Получить заметку за конкретный день
  getNoteForDate: (date: Date) => {
    const { notes } = get();
    const targetDate = format(date, 'yyyy-MM-dd');
    return notes.find((note) => {
      const noteDate = format(new Date(note.createdAt), 'yyyy-MM-dd');
      return noteDate === targetDate;
    });
  },

  // Получить все даты, в которые есть заметки (для индикаторов в календаре)
  getDatesWithNotes: () => {
    const { notes } = get();
    const dates = new Set<string>();
    notes.forEach((note) => {
      dates.add(format(new Date(note.createdAt), 'yyyy-MM-dd'));
    });
    return dates;
  },
}));
