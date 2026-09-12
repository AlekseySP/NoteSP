import { Note, Tag } from '../types';

const STORAGE_KEY = 'diary-notes';
const TAGS_KEY = 'diary-tags';

/** Сохранить заметки в LocalStorage */
export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Ошибка сохранения заметок:', error);
  }
}

/** Загрузить заметки из LocalStorage */
export function loadNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    // Если данных нет — создаём демо-заметки
    const demo = getDemoNotes();
    saveNotes(demo);
    return demo;
  } catch (error) {
    console.error('Ошибка загрузки заметок:', error);
    return [];
  }
}

/** Сохранить теги в LocalStorage */
export function saveTags(tags: Tag[]): void {
  try {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  } catch (error) {
    console.error('Ошибка сохранения тегов:', error);
  }
}

/** Загрузить теги из LocalStorage */
export function loadTags(): Tag[] {
  try {
    const data = localStorage.getItem(TAGS_KEY);
    return data ? JSON.parse(data) : getDefaultTags();
  } catch (error) {
    console.error('Ошибка загрузки тегов:', error);
    return getDefaultTags();
  }
}

/** Получить теги по умолчанию */
export function getDefaultTags(): Tag[] {
  return [
    { id: 'tag-1', name: 'Личное', color: 'blue' },
    { id: 'tag-2', name: 'Работа', color: 'green' },
    { id: 'tag-3', name: 'Идеи', color: 'purple' },
    { id: 'tag-4', name: 'Важное', color: 'yellow' },
    { id: 'tag-5', name: 'Путешествия', color: 'pink' },
  ];
}

/** Извлечь текстовое превью из HTML */
export function extractPreview(html: string, maxLength: number = 100): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength) + '…';
}

/** Создать демо-заметки для первого запуска */
export function getDemoNotes(): Note[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 18, 45);
  const twoDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 14, 0);

  return [
    {
      id: 'demo-1',
      title: 'Добро пожаловать в Дневник ✨',
      content: '<h2>Добро пожаловать!</h2><p>Это ваше личное пространство для записей и мыслей. Здесь вы можете:</p><ul><li>Вести ежедневные записи</li><li>Использовать форматирование текста</li><li>Создавать чек-листы для задач</li><li>Добавлять теги для организации</li><li>Закреплять важные заметки</li></ul><p>Все данные хранятся локально в вашем браузере — никто кроме вас не имеет к ним доступа.</p><h3>Горячие клавиши</h3><p><strong>Ctrl+B</strong> — жирный текст<br><strong>Ctrl+I</strong> — курсив<br><strong>Ctrl+U</strong> — подчёркивание</p>',
      preview: 'Добро пожаловать! Это ваше личное пространство для записей и мыслей. Здесь вы можете: Вести ежедневные записи, использовать форматирование текста, создавать чек-листы…',
      tags: [{ id: 'tag-1', name: 'Личное', color: 'blue' }],
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      isPinned: true,
    },
    {
      id: 'demo-2',
      title: 'План на неделю',
      content: '<h2>Задачи на неделю</h2><ul data-type="taskList"><li data-type="taskItem" data-checked="true"><p>Завершить проект до пятницы</p></li><li data-type="taskItem" data-checked="false"><p>Позвонить клиенту</p></li><li data-type="taskItem" data-checked="false"><p>Подготовить презентацию</p></li><li data-type="taskItem" data-checked="false"><p>Купить продукты</p></li><li data-type="taskItem" data-checked="true"><p>Записаться к врачу</p></li></ul><blockquote>Не забывайте делать перерывы каждые 2 часа!</blockquote>',
      preview: 'Задачи на неделю: Завершить проект до пятницы, Позвонить клиенту, Подготовить презентацию, Купить продукты, Записаться к врачу…',
      tags: [
        { id: 'tag-2', name: 'Работа', color: 'green' },
        { id: 'tag-4', name: 'Важное', color: 'yellow' },
      ],
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString(),
      isPinned: false,
    },
    {
      id: 'demo-3',
      title: 'Идея для проекта',
      content: '<h2>Мобильное приложение для медитации</h2><p>Концепция: минималистичное приложение с таймером для медитации и звуками природы.</p><h3>Основные функции:</h3><ol><li>Таймер с настраиваемой длительностью</li><li>Библиотека звуков (дождь, лес, океан)</li><li>Статистика медитаций</li><li>Напоминания</li></ol><p>Нужно исследовать рынок и конкурентов. Посмотреть <code>Headspace</code> и <code>Calm</code> как референсы.</p><hr><p><em>Обновить после исследования рынка.</em></p>',
      preview: 'Мобильное приложение для медитации. Концепция: минималистичное приложение с таймером для медитации и звуками природы…',
      tags: [{ id: 'tag-3', name: 'Идеи', color: 'purple' }],
      createdAt: twoDaysAgo.toISOString(),
      updatedAt: twoDaysAgo.toISOString(),
      isPinned: false,
    },
  ];
}
