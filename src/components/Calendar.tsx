import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';

export default function Calendar() {
  const {
    calendarView,
    setCalendarView,
    filters,
    setSelectedDate,
    getNoteForDate,
    createNoteForDate,
    setActiveNote,
    getDatesWithNotes,
  } = useNotesStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datesWithNotes = getDatesWithNotes();

  // Генерация дней для отображения
  const days = useMemo(() => {
    if (calendarView === 'month') {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

      const result: Date[] = [];
      let day = calStart;
      while (day <= calEnd) {
        result.push(day);
        day = addDays(day, 1);
      }
      return result;
    } else {
      // Неделя — показываем 7 дней начиная с текущего понедельника
      const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }
  }, [currentMonth, calendarView]);

  const handlePrev = () => {
    setCurrentMonth((m) => (calendarView === 'month' ? subMonths(m, 1) : subWeeks(m, 1)));
  };

  const handleNext = () => {
    setCurrentMonth((m) => (calendarView === 'month' ? addMonths(m, 1) : addWeeks(m, 1)));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const handleDayClick = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');

    // Если уже выбран этот день — снимаем выделение
    if (filters.selectedDate === dateStr) {
      setSelectedDate(null);
      return;
    }

    // Выбираем день
    setSelectedDate(dateStr);

    // Если есть заметка за этот день — открываем её, иначе создаём новую
    const existingNote = getNoteForDate(day);
    if (existingNote) {
      setActiveNote(existingNote.id);
    } else {
      createNoteForDate(day);
    }
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const headerTitle = calendarView === 'month'
    ? format(currentMonth, 'LLLL yyyy', { locale: ru })
    : `${format(days[0], 'd MMM', { locale: ru })} — ${format(days[6], 'd MMM yyyy', { locale: ru })}`;

  return (
    <div className="px-3 py-2 border-b border-border">
      {/* Переключатель месяц/неделя */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-0.5 bg-cream-dark rounded-lg p-0.5">
          <button
            onClick={() => setCalendarView('month')}
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors
              ${calendarView === 'month'
                ? 'bg-card text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
              }`}
            title="Месяц"
          >
            <CalendarDays className="w-3 h-3" />
            <span>Мес</span>
          </button>
          <button
            onClick={() => setCalendarView('week')}
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors
              ${calendarView === 'week'
                ? 'bg-card text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
              }`}
            title="Неделя"
          >
            <CalendarRange className="w-3 h-3" />
            <span>Нед</span>
          </button>
        </div>

        {/* Навигация */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handlePrev}
            className="p-1 rounded hover:bg-accent transition-colors"
            title="Назад"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          <button
            onClick={handleToday}
            className="px-1.5 py-0.5 text-[10px] font-medium text-text-secondary
              hover:bg-accent rounded transition-colors"
          >
            Сегодня
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded hover:bg-accent transition-colors"
            title="Вперёд"
          >
            <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Заголовок */}
      <div className="text-center text-xs font-medium text-text-primary mb-2 capitalize">
        {headerTitle}
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium text-text-muted py-0.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Сетка дней */}
      <div className={`grid ${calendarView === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-0.5`}>
        {days.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasNote = datesWithNotes.has(dateStr);
          const isSelected = filters.selectedDate === dateStr;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`
                relative aspect-square flex flex-col items-center justify-center
                text-[11px] rounded-md transition-all
                ${calendarView === 'week' ? 'py-1.5' : ''}
                ${isSelected
                  ? 'bg-blue-500 text-white shadow-sm'
                  : isCurrentDay
                    ? 'bg-accent text-blue-600 font-semibold'
                    : isCurrentMonth
                      ? 'text-text-primary hover:bg-accent'
                      : 'text-text-muted hover:bg-accent/50'
                }
              `}
              title={format(day, 'd MMMM yyyy', { locale: ru })}
            >
              <span className={calendarView === 'week' ? 'text-sm' : ''}>
                {format(day, 'd')}
              </span>
              {hasNote && !isSelected && (
                <span className={`absolute bottom-0.5 w-1 h-1 rounded-full
                  ${isCurrentDay ? 'bg-blue-500' : 'bg-blue-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Индикатор выбранной даты */}
      {filters.selectedDate && (
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[10px] text-text-muted">
            Выбрано: {format(new Date(filters.selectedDate + 'T12:00:00'), 'd MMMM', { locale: ru })}
          </span>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-[10px] text-blue-500 hover:text-blue-600 font-medium"
          >
            Сбросить
          </button>
        </div>
      )}
    </div>
  );
}
