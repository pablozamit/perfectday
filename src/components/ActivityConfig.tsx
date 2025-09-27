import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react';
import { Activity } from '../types';
import { ActivityCard } from './ActivityCard';

interface ActivityConfigProps {
  activities: Activity[];
  onActivitiesChange: (activities: Activity[]) => void;
}

export const ActivityConfig: React.FC<ActivityConfigProps> = ({
  activities,
  onActivitiesChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    importance: 3,
    icon: 'Circle',
    category: 'General'
  });

  const categories = ['Salud', 'Fitness', 'Nutrición', 'Bienestar', 'Desarrollo', 'Social', 'General'];
  const icons = ['Sun', 'Dumbbell', 'Heart', 'Egg', 'Brain', 'Book', 'PenTool', 'Trees', 'Droplets', 'Users', 'Lightbulb', 'Moon', 'Coffee', 'Music', 'Camera', 'Circle'];

  const handleAddNew = () => {
    setEditingActivity(null);
    setFormData({
      name: '',
      description: '',
      importance: 3,
      icon: 'Circle',
      category: 'General'
    });
    setIsEditing(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description || '',
      importance: activity.importance,
      icon: activity.icon,
      category: activity.category
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const newActivity: Activity = {
      id: editingActivity?.id || Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      importance: formData.importance,
      icon: formData.icon,
      category: formData.category
    };

    let newActivities;
    if (editingActivity) {
      newActivities = activities.map(a => a.id === editingActivity.id ? newActivity : a);
    } else {
      newActivities = [...activities, newActivity];
    }

    onActivitiesChange(newActivities);
    setIsEditing(false);
    setEditingActivity(null);
  };

  const handleDelete = (activityId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      onActivitiesChange(activities.filter(a => a.id !== activityId));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingActivity(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Configurar Día Perfecto</h2>
        <button
          onClick={handleAddNew}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Actividad</span>
        </button>
      </div>

      {isEditing && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-orange-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ej: Hacer ejercicio"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={2}
                placeholder="Descripción opcional de la actividad"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Importancia (1-5)
              </label>
              <select
                value={formData.importance}
                onChange={(e) => setFormData({...formData, importance: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num} {'★'.repeat(num)}{'☆'.repeat(5-num)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icono
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {icons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="relative group">
            <ActivityCard activity={activity} showImportance={true} />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                onClick={() => handleEdit(activity)}
                className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleDelete(activity.id)}
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No hay actividades configuradas</p>
          <button
            onClick={handleAddNew}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Crear tu primera actividad
          </button>
        </div>
      )}
    </div>
  );
};