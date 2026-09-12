import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { useEffect, useRef } from 'react';
import { NoteEditorToolbar } from './NoteEditorToolbar';

interface NoteEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function NoteEditor({ content, onChange }: NoteEditorProps) {
  // Ref для отслеживания последнего контента, отправленного из редактора
  const lastEmittedRef = useRef<string>(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Начните писать свою запись...',
      }),
      TaskList.configure({
        HTMLAttributes: { class: 'task-list' },
      }),
      TaskItem.configure({
        nested: true,
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedRef.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  // Обновляем контент извне ТОЛЬКО когда меняется заметка (не от нашего же ввода)
  useEffect(() => {
    if (editor && content !== lastEmittedRef.current) {
      // Контент изменился извне (переключение заметки)
      editor.commands.setContent(content);
      lastEmittedRef.current = content;
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      <NoteEditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto px-6 py-4 lg:px-10">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
