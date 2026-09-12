import { useEffect } from 'react';
import { useNotesStore } from './store/useNotesStore';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import StatusBar from './components/StatusBar';
import EmptyState from './components/EmptyState';

export default function App() {
  const { getActiveNote, updateNote, createNote } = useNotesStore();
  const activeNote = getActiveNote();

  // Глобальные горячие клавиши
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N — новая заметка
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNote]);

  return (
    <Layout sidebar={<Sidebar />}>
      {activeNote ? (
        <div className="flex flex-col h-full">
          <Header note={activeNote} />
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-hidden">
              <NoteEditor
                content={activeNote.content}
                onChange={(html) => updateNote(activeNote.id, { content: html })}
              />
            </div>
            <StatusBar content={activeNote.content} />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </Layout>
  );
}
