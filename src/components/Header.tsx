import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Pin,
  PinOff,
  Trash2,
  Tag,
  Menu,
  X,
  Calendar,
  Clock,
  Check,
} from 'lucide-react';
import { Note, Tag as TagType } from '../types';
import { useNotesStore } from '../store/useNotesStore';
import { useClickOutside } from '../hooks/useClickOutside';

interface HeaderProps {
  note: Note;
}

export default function Header({ note }: HeaderProps) {
  const { tags, updateNote, deleteNote, togglePin, toggleSidebar } = useNotesStore();
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const tagPickerRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

  // Закрытие popup при клике вне
  useClickOutside(tagPickerRef, () => setShowTagPicker(false), showTagPicker);
  useClickOutside(deleteRef, () => setShowDeleteConfirm(false), showDeleteConfirm);

  // Индикатор сохранения при обновлении заметки
  useEffect(() => {
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [note.updatedAt]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(note.id, { title: e.target.value });
  };

  const handleTagToggle = (tag: TagType) => {
    const hasTag = note.tags.some((t) => t.id === tag.id);
    if (hasTag) {
      updateNote(note.id, { tags: note.tags.filter((t) => t.id !== tag.id) });
    } else {
      updateNote(note.id, { tags: [...note.tags, tag] });
    }
  };

  const handleDelete = () => {
    deleteNote(note.id);
    setShowDeleteConfirm(false);
  };

  const createdDate = format(new Date(note.createdAt), 'd MMMM yyyy', { locale: ru });
  const updatedDate = format(new Date(note.updatedAt), 'd MMMM yyyy, HH:mm', { locale: ru });

  return (
    <div className="border-b border-border bg-card">
      {/* Верхняя строка с действиями */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            title="Меню"
          >
            <Menu className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Индикатор сохранения */}
          <div
            className={`flex items-center gap-1 text-xs transition-opacity duration-300
              ${showSaved ? 'opacity-100' : 'opacity-0'}`}
          >
            <Check className="w-3 h-3 text-success" />
            <span className="text-success">Сохранено</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => togglePin(note.id)}
            className={`p-1.5 rounded-lg transition-colors
              ${note.isPinned
                ? 'bg-accent text-blue-500'
                : 'hover:bg-accent text-text-secondary'
              }`}
            title={note.isPinned ? 'Открепить' : 'Закрепить'}
          >
            {note.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          </button>

          <div className="relative" ref={tagPickerRef}>
            <button
              onClick={() => setShowTagPicker(!showTagPicker)}
              className={`p-1.5 rounded-lg transition-colors
                ${showTagPicker
                  ? 'bg-accent text-blue-500'
                  : 'hover:bg-accent text-text-secondary'
                }`}
              title="Теги"
            >
              <Tag className="w-4 h-4" />
            </button>

            {showTagPicker && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border
                rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-border">
                  <span className="text-xs font-medium text-text-muted">Добавить тег</span>
                </div>
                {tags.map((tag) => {
                  const isSelected = note.tags.some((t) => t.id === tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm
                        hover:bg-accent transition-colors"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full
                        ${tag.color === 'blue' ? 'bg-blue-400' : ''}
                        ${tag.color === 'green' ? 'bg-green-400' : ''}
                        ${tag.color === 'purple' ? 'bg-purple-400' : ''}
                        ${tag.color === 'yellow' ? 'bg-yellow-400' : ''}
                        ${tag.color === 'pink' ? 'bg-pink-400' : ''}
                      `} />
                      <span className="flex-1 text-left text-text-primary">{tag.name}</span>
                      {isSelected && (
                        <span className="text-blue-500 text-xs">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative" ref={deleteRef}>
            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="p-1.5 rounded-lg hover:bg-danger-light text-text-secondary
                hover:text-danger transition-colors"
              title="Удалить"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {showDeleteConfirm && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border
                rounded-lg shadow-lg z-50 p-3">
                <p className="text-sm text-text-primary mb-2">Удалить заметку?</p>
                <p className="text-xs text-text-muted mb-3">Это действие нельзя отменить</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-danger text-white
                      rounded-md hover:bg-red-600 transition-colors"
                  >
                    Удалить
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-cream-dark text-text-secondary
                      rounded-md hover:bg-border transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Заголовок заметки */}
      <div className="px-4 lg:px-6 pb-3">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Заголовок заметки..."
          className="w-full text-xl lg:text-2xl font-semibold text-text-primary
            placeholder:text-text-muted bg-transparent border-none outline-none
            leading-tight"
        />

        {/* Метаданные */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Calendar className="w-3 h-3" />
            <span>{createdDate}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            <span>Изменено: {updatedDate}</span>
          </div>
        </div>

        {/* Теги заметки */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {note.tags.map((tag) => (
              <span
                key={tag.id}
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                  ${tag.color === 'blue' ? 'bg-tag-blue text-blue-700' : ''}
                  ${tag.color === 'green' ? 'bg-tag-green text-green-700' : ''}
                  ${tag.color === 'purple' ? 'bg-tag-purple text-purple-700' : ''}
                  ${tag.color === 'yellow' ? 'bg-tag-yellow text-yellow-700' : ''}
                  ${tag.color === 'pink' ? 'bg-tag-pink text-pink-700' : ''}
                `}
              >
                {tag.name}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
