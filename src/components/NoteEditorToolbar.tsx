import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  ListChecks,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
  ImagePlus,
} from 'lucide-react';

interface NoteEditorToolbarProps {
  editor: Editor;
}

export function NoteEditorToolbar({ editor }: NoteEditorToolbarProps) {
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      title: 'Жирный (Ctrl+B)',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      title: 'Курсив (Ctrl+I)',
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
      title: 'Подчёркнутый (Ctrl+U)',
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
      title: 'Зачёркнутый',
    },
    { type: 'separator' as const },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
      title: 'Заголовок 1',
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
      title: 'Заголовок 2',
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
      title: 'Заголовок 3',
    },
    { type: 'separator' as const },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
      title: 'Маркированный список',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
      title: 'Нумерованный список',
    },
    {
      icon: ListChecks,
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive('taskList'),
      title: 'Чек-лист',
    },
    { type: 'separator' as const },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
      title: 'Цитата',
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
      title: 'Код',
    },
    {
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: () => false,
      title: 'Разделитель',
    },
    { type: 'separator' as const },
    {
      icon: ImagePlus,
      action: handleImageUpload,
      isActive: () => false,
      title: 'Вставить изображение',
    },
    { type: 'separator' as const },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: () => false,
      title: 'Отменить (Ctrl+Z)',
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: () => false,
      title: 'Повторить (Ctrl+Y)',
    },
  ];

  return (
    <div className="flex items-center gap-0.5 px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex-wrap">
      {buttons.map((btn, i) => {
        if ('type' in btn && btn.type === 'separator') {
          return <div key={i} className="w-px h-5 bg-border mx-1" />;
        }
        const button = btn as Exclude<typeof btn, { type: 'separator' }>;
        const isActive = button.isActive();
        return (
          <button
            key={i}
            onClick={button.action}
            title={button.title}
            className={`p-1.5 rounded-md transition-colors
              ${isActive
                ? 'bg-accent text-blue-600'
                : 'text-text-secondary hover:bg-accent hover:text-text-primary'
              }`}
          >
            <button.icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
