import { useMemo } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Pin, Trash2, Clock } from 'lucide-react';
import { Note } from '../types';
import { useNotesStore } from '../store/useNotesStore';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const { activeNoteId, setActiveNote, deleteNote } = useNotesStore();

  // Группировка заметок по дате
  const groupedNotes = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

    const groups: { label: string; notes: Note[] }[] = [
      { label: 'Сегодня', notes: [] },
      { label: 'Вчера', notes: [] },
      { label: 'Ранее', notes: [] },
    ];

    notes.forEach((note) => {
      const noteDate = format(new Date(note.updatedAt), 'yyyy-MM-dd');
      if (noteDate === today) {
        groups[0].notes.push(note);
      } else if (noteDate === yesterday) {
        groups[1].notes.push(note);
      } else {
        groups[2].notes.push(note);
      }
    });

    return groups.filter((g) => g.notes.length > 0);
  }, [notes]);

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-text-muted" />
        </div>
        <p className="text-text-secondary text-sm">Заметок пока нет</p>
        <p className="text-text-muted text-xs mt-1">Нажмите «Новая запись» чтобы создать первую</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {groupedNotes.map((group) => (
        <div key={group.label}>
          <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur-sm px-4 py-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              {group.label}
            </span>
          </div>
          {group.notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onSelect={() => setActiveNote(note.id)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function NoteItem({ note, isActive, onSelect, onDelete }: NoteItemProps) {
  const formattedTime = format(new Date(note.updatedAt), 'HH:mm');
  const title = note.title || 'Без заголовка';
  const preview = note.preview || 'Пустая заметка...';

  return (
    <div
      onClick={onSelect}
      className={`
        group relative px-4 py-3 cursor-pointer border-b border-border-light
        transition-all duration-150
        ${isActive
          ? 'bg-accent border-l-2 border-l-blue-400'
          : 'hover:bg-accent/50 border-l-2 border-l-transparent'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {note.isPinned && (
              <Pin className="w-3 h-3 text-blue-400 flex-shrink-0 fill-blue-400" />
            )}
            <h3 className={`text-sm font-medium truncate ${isActive ? 'text-text-primary' : 'text-text-primary'}`}>
              {title}
            </h3>
          </div>
          <p className="text-xs text-text-muted truncate leading-relaxed">
            {preview}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-text-muted">{formattedTime}</span>
            {note.tags.length > 0 && (
              <div className="flex gap-1">
                {note.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                      ${tag.color === 'blue' ? 'bg-tag-blue text-blue-700' : ''}
                      ${tag.color === 'green' ? 'bg-tag-green text-green-700' : ''}
                      ${tag.color === 'purple' ? 'bg-tag-purple text-purple-700' : ''}
                      ${tag.color === 'yellow' ? 'bg-tag-yellow text-yellow-700' : ''}
                      ${tag.color === 'pink' ? 'bg-tag-pink text-pink-700' : ''}
                    `}
                  >
                    {tag.name}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="text-[10px] text-text-muted">+{note.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger-light transition-all"
          title="Удалить"
        >
          <Trash2 className="w-3.5 h-3.5 text-danger" />
        </button>
      </div>
    </div>
  );
}
