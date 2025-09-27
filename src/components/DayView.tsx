import React, { useState } from 'react';
import { Save, CreditCard as Edit3 } from 'lucide-react';
import { Activity, DayEntry } from '../types';
import { ActivityCard } from './ActivityCard';
import { DayScore } from './DayScore';
import { formatDisplayDate } from '../utils/dateUtils';

interface DayViewProps {
  date: string;
  activities: Activity[];
  dayEntry?: DayEntry;
  onSave: (entry: DayEntry) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  date,
  activities,
  dayEntry,
  onSave
}) => {
  const [completedActivities, setCompletedActivities] = useState<string[]>(
    dayEntry?.completedActivities || []
  );
  const [notes, setNotes] = useState(dayEntry?.notes || '');
  const [hasChanges, setHasChanges] = useState(false);

  const toggleActivity = (activityId: string) => {
    const newCompleted = completedActivities.includes(activityId)
      ? completedActivities.filter(id => id !== activityId)
      : [...completedActivities, activityId];
    
    setCompletedActivities(newCompleted);
    setHasChanges(true);
  };

  const calculateScore = () => {
    return completedActivities.reduce((total, activityId) => {
      const activity = activities.find(a => a.id === activityId);
      return total + (activity?.importance || 0);
    }, 0);
  };

  const getTotalPossibleScore = () => {
    return activities.reduce((total, activity) => total + activity.importance, 0);
  };

  const handleSave = () => {
    const entry: DayEntry = {
      date,
      completedActivities,
      score: calculateScore(),
      notes: notes.trim() || undefined
    };
    
    onSave(entry);
    setHasChanges(false);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasChanges(true);
  };

  const score = calculateScore();
  const maxScore = getTotalPossibleScore();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {formatDisplayDate(date)}
            </h2>
            <p className="text-gray-600 mt-1">
              Marca las actividades que has completado hoy
            </p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
          )}
        </div>

        <DayScore score={score} maxScore={maxScore} date={date} />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm mr-2">
            Actividades
          </span>
          <span className="text-sm text-gray-500">
            ({completedActivities.length}/{activities.length})
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isCompleted={completedActivities.includes(activity.id)}
              onToggle={toggleActivity}
              showImportance={false}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Edit3 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Notas del día</h3>
        </div>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="¿Cómo te has sentido hoy? ¿Qué has aprendido? ¿Qué podrías mejorar mañana?"
        />
        {hasChanges && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Guardar cambios</span>
            </button>
          </div>
        )}
      </div>

      {activities.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            No hay actividades configuradas para tu día perfecto
          </p>
          <p className="text-gray-400">
            Ve a la sección "Configurar" para añadir actividades
          </p>
        </div>
      )}
    </div>
  );
};