import { useState } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Tag,
  Menu,
  X,
} from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';
import NoteList from './NoteList';

export default function Sidebar() {
  const {
    tags,
    filters,
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    createNote,
    setSearchQuery,
    setSelectedTag,
    getFilteredNotes,
  } = useNotesStore();

  const [showTags, setShowTags] = useState(false);
  const filteredNotes = getFilteredNotes();

  return (
    <>
      {/* Мобильный overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          h-full w-80 bg-cream border-r border-border
          flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full lg:w-0 lg:min-w-0 lg:overflow-hidden'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h1 className="text-base font-semibold text-text-primary">Дневник</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Кнопка новой записи */}
        <div className="px-3 py-3">
          <button
            onClick={createNote}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5
              bg-blue-500 hover:bg-blue-600 text-white rounded-lg
              text-sm font-medium transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Новая запись
          </button>
        </div>

        {/* Поиск */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Поиск заметок..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border
                rounded-lg placeholder:text-text-muted focus:outline-none
                focus:border-blue-300 focus:ring-1 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Теги */}
        <div className="px-3 pb-2">
          <button
            onClick={() => setShowTags(!showTags)}
            className="flex items-center gap-2 text-xs font-medium text-text-secondary
              hover:text-text-primary transition-colors w-full"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Теги</span>
            <span className="ml-auto text-text-muted">{tags.length}</span>
          </button>
          {showTags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-xs px-2 py-1 rounded-full transition-colors
                  ${!filters.selectedTag
                    ? 'bg-accent text-blue-600 font-medium'
                    : 'bg-cream-dark text-text-secondary hover:bg-accent-hover'
                  }`}
              >
                Все
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(filters.selectedTag === tag.id ? null : tag.id)}
                  className={`text-xs px-2 py-1 rounded-full transition-colors
                    ${tag.color === 'blue' ? 'bg-tag-blue text-blue-700' : ''}
                    ${tag.color === 'green' ? 'bg-tag-green text-green-700' : ''}
                    ${tag.color === 'purple' ? 'bg-tag-purple text-purple-700' : ''}
                    ${tag.color === 'yellow' ? 'bg-tag-yellow text-yellow-700' : ''}
                    ${tag.color === 'pink' ? 'bg-tag-pink text-pink-700' : ''}
                    ${filters.selectedTag === tag.id ? 'ring-2 ring-blue-300' : ''}
                  `}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Разделитель */}
        <div className="border-t border-border mx-3" />

        {/* Список заметок */}
        <div className="flex-1 overflow-y-auto">
          <NoteList notes={filteredNotes} />
        </div>

        {/* Footer с количеством */}
        <div className="px-4 py-2.5 border-t border-border">
          <span className="text-xs text-text-muted">
            {filteredNotes.length} {getNoteWord(filteredNotes.length)}
          </span>
        </div>
      </aside>

      {/* Кнопка открытия sidebar (когда закрыт) */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-3 top-3 z-30 p-2 bg-card border border-border
            rounded-lg shadow-sm hover:bg-accent transition-colors"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>
      )}
    </>
  );
}

function getNoteWord(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;
  if (lastTwo >= 11 && lastTwo <= 19) return 'заметок';
  if (lastOne === 1) return 'заметка';
  if (lastOne >= 2 && lastOne <= 4) return 'заметки';
  return 'заметок';
}
