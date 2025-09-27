import React, { useState } from 'react';
import { Calendar, Settings, BarChart3, Sun } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultActivities } from './data/defaultActivities';
import { Activity, DayEntry } from './types';
import { ActivityConfig } from './components/ActivityConfig';
import { DayView } from './components/DayView';
import { Calendar as CalendarComponent } from './components/Calendar';
import { formatDate } from './utils/dateUtils';

type View = 'today' | 'calendar' | 'config' | 'stats' | 'how-it-works';

function App() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('perfect-day-activities', defaultActivities);
  const [dayEntries, setDayEntries] = useLocalStorage<{ [date: string]: DayEntry }>('perfect-day-entries', {});
  const [currentView, setCurrentView] = useState<View>('today');
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));

  const handleSaveDayEntry = (entry: DayEntry) => {
    setDayEntries(prev => ({
      ...prev,
      [entry.date]: entry
    }));
  };

  const getCurrentStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateString = formatDate(currentDate);
      const entry = dayEntries[dateString];
      
      if (!entry || entry.score === 0) {
        break;
      }
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      
      // Limit to prevent infinite loop
      if (streak > 365) break;
    }
    
    return streak;
  };

  const getStats = () => {
    const entries = Object.values(dayEntries);
    const totalPossibleScore = activities.reduce((sum, activity) => sum + activity.importance, 0);
    
    if (entries.length === 0) {
      return {
        totalDays: 0,
        averageScore: 0,
        bestDay: 0,
        currentStreak: 0,
        perfectDays: 0
      };
    }

    const averageScore = entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length;
    const bestDay = Math.max(...entries.map(entry => entry.score));
    const perfectDays = entries.filter(entry => entry.score === totalPossibleScore).length;

    return {
      totalDays: entries.length,
      averageScore: Math.round(averageScore * 10) / 10,
      bestDay,
      currentStreak: getCurrentStreak(),
      perfectDays
    };
  };

  const renderStats = () => {
    const stats = getStats();
    const totalPossibleScore = activities.reduce((sum, activity) => sum + activity.importance, 0);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalDays}</div>
              <div className="text-sm text-blue-800">Días registrados</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.currentStreak}</div>
              <div className="text-sm text-green-800">Racha actual</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.perfectDays}</div>
              <div className="text-sm text-purple-800">Días perfectos</div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.averageScore}</div>
              <div className="text-sm text-orange-800">Puntuación promedio</div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.bestDay}</div>
              <div className="text-sm text-yellow-800">Mejor día</div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">{totalPossibleScore}</div>
              <div className="text-sm text-gray-800">Máximo posible</div>
            </div>
          </div>
        </div>

        {stats.totalDays > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Progreso reciente</h3>
            <div className="space-y-2">
              {Object.entries(dayEntries)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 7)
                .map(([date, entry]) => {
                  const percentage = totalPossibleScore > 0 ? Math.round((entry.score / totalPossibleScore) * 100) : 0;
                  return (
                    <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-700 w-16 text-right">
                          {entry.score}/{totalPossibleScore}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHowItWorks = () => {
    const totalPossibleScore = activities.reduce((sum, activity) => sum + activity.importance, 0);
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">¿Cómo funciona Perfect Day?</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              Perfect Day te ayuda a diseñar y seguir tu día ideal mediante un sistema de puntuación 
              basado en la importancia que le das a cada actividad.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">🎯 El Sistema de Puntuación</h3>
              <p className="text-blue-700 mb-4">
                Cada actividad tiene una puntuación de <strong>importancia del 1 al 5</strong>:
              </p>
              <ul className="space-y-2 text-blue-700">
                <li><strong>⭐ (1 punto):</strong> Actividad opcional, pero beneficiosa</li>
                <li><strong>⭐⭐ (2 puntos):</strong> Actividad recomendable</li>
                <li><strong>⭐⭐⭐ (3 puntos):</strong> Actividad importante</li>
                <li><strong>⭐⭐⭐⭐ (4 puntos):</strong> Actividad muy importante</li>
                <li><strong>⭐⭐⭐⭐⭐ (5 puntos):</strong> Actividad esencial para tu día perfecto</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">🧮 Cálculo de la Puntuación Diaria</h3>
              <p className="text-green-700 mb-4">
                Tu puntuación diaria se calcula <strong>sumando los puntos de importancia</strong> de todas 
                las actividades que completes ese día.
              </p>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Ejemplo con las actividades por defecto:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>• Ejercicio de potencia (⭐⭐⭐⭐⭐)</span>
                    <span className="font-bold">5 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Meditación (⭐⭐⭐⭐⭐)</span>
                    <span className="font-bold">5 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Dormir 8 horas (⭐⭐⭐⭐⭐)</span>
                    <span className="font-bold">5 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Tomar el sol (⭐⭐⭐⭐)</span>
                    <span className="font-bold">4 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Cardio (⭐⭐⭐⭐)</span>
                    <span className="font-bold">4 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Lectura (⭐⭐⭐⭐)</span>
                    <span className="font-bold">4 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Escribir journal (⭐⭐⭐⭐)</span>
                    <span className="font-bold">4 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Conectar con seres queridos (⭐⭐⭐⭐)</span>
                    <span className="font-bold">4 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Comer 6 huevos (⭐⭐⭐)</span>
                    <span className="font-bold">3 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Caminar en naturaleza (⭐⭐⭐)</span>
                    <span className="font-bold">3 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Hidratación adecuada (⭐⭐⭐)</span>
                    <span className="font-bold">3 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Aprender algo nuevo (⭐⭐⭐)</span>
                    <span className="font-bold">3 puntos</span>
                  </div>
                  <hr className="my-2 border-green-300" />
                  <div className="flex justify-between font-bold text-green-800">
                    <span>TOTAL MÁXIMO POSIBLE:</span>
                    <span>{totalPossibleScore} puntos</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">📊 Ejemplos Prácticos</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Ejemplo 1: Día Excelente</h4>
                  <p className="text-sm text-orange-700 mb-2">Completaste: Ejercicio (5) + Meditación (5) + Dormir bien (5) + Tomar sol (4) + Cardio (4) + Lectura (4)</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Puntuación: 27/{totalPossibleScore}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                      {Math.round((27/totalPossibleScore) * 100)}% - ¡Excelente! 🌟
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Ejemplo 2: Día Bueno</h4>
                  <p className="text-sm text-orange-700 mb-2">Completaste: Meditación (5) + Tomar sol (4) + Lectura (4) + Hidratación (3) + Caminar (3)</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Puntuación: 19/{totalPossibleScore}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-bold">
                      {Math.round((19/totalPossibleScore) * 100)}% - Bien 😊
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Ejemplo 3: Día Regular</h4>
                  <p className="text-sm text-orange-700 mb-2">Completaste: Dormir bien (5) + Hidratación (3) + Comer huevos (3)</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Puntuación: 11/{totalPossibleScore}</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-bold">
                      {Math.round((11/totalPossibleScore) * 100)}% - Regular 😐
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">🎨 Personalización</h3>
              <ul className="space-y-2 text-purple-700">
                <li><strong>• Crea tus propias actividades:</strong> Define qué actividades son importantes para TU día perfecto</li>
                <li><strong>• Ajusta las puntuaciones:</strong> Asigna más puntos a las actividades que consideres más importantes</li>
                <li><strong>• Sigue tu progreso:</strong> El calendario te muestra visualmente cómo van tus días</li>
                <li><strong>• Mantén rachas:</strong> Intenta conseguir días consecutivos con buenas puntuaciones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-lg">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Perfect Day</h1>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => setCurrentView('today')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  currentView === 'today' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Hoy</span>
              </button>
              <button
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  currentView === 'calendar' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Calendario</span>
              </button>
              <button
                onClick={() => setCurrentView('stats')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  currentView === 'stats' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Estadísticas</span>
              </button>
              <button
                onClick={() => setCurrentView('how-it-works')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  currentView === 'how-it-works' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>❓</span>
                <span>Cómo funciona</span>
              </button>
              <button
                onClick={() => setCurrentView('config')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  currentView === 'config' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Configurar</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'today' && (
          <DayView
            date={formatDate(new Date())}
            activities={activities}
            dayEntry={dayEntries[formatDate(new Date())]}
            onSave={handleSaveDayEntry}
          />
        )}
        
        {currentView === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CalendarComponent
                dayEntries={dayEntries}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>
            <div>
              <DayView
                date={selectedDate}
                activities={activities}
                dayEntry={dayEntries[selectedDate]}
                onSave={handleSaveDayEntry}
              />
            </div>
          </div>
        )}
        
        {currentView === 'config' && (
          <ActivityConfig
            activities={activities}
            onActivitiesChange={setActivities}
          />
        )}
        
        {currentView === 'stats' && renderStats()}
        
        {currentView === 'how-it-works' && renderHowItWorks()}
      </main>
    </div>
  );
}

export default App;