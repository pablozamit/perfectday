import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatDate, formatDisplayDate, isToday } from '../utils/dateUtils';
import { DayEntry } from '../types';

interface CalendarProps {
  dayEntries: { [date: string]: DayEntry };
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  dayEntries,
  onDateSelect,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const getDayScore = (date: Date) => {
    const dateString = formatDate(date);
    const entry = dayEntries[dateString];
    return entry ? entry.score : 0;
  };

  const getScoreColor = (score: number, maxScore: number = 60) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    if (score > 0) return 'bg-red-500';
    return 'bg-gray-100';
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 capitalize">{monthYear}</h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="aspect-square" />;
          }

          const dateString = formatDate(day);
          const dayScore = getDayScore(day);
          const isSelected = dateString === selectedDate;
          const isTodayDate = isToday(dateString);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(dateString)}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 relative ${
                isSelected
                  ? 'ring-2 ring-orange-500 ring-offset-2'
                  : 'hover:bg-gray-100'
              } ${isTodayDate ? 'ring-2 ring-blue-300' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getScoreColor(dayScore)}`}>
                <span className={dayScore > 0 ? 'text-white font-bold' : 'text-gray-700'}>
                  {day.getDate()}
                </span>
              </div>
              {dayScore > 0 && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Excelente (80%+)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Bien (60%+)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Regular (40%+)</span>
        </div>
      </div>
    </div>
  );
};