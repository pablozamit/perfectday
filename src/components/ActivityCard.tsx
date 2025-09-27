import React from 'react';
import * as Icons from 'lucide-react';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  isCompleted?: boolean;
  onToggle?: (activityId: string) => void;
  showImportance?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isCompleted = false,
  onToggle,
  showImportance = true
}) => {
  const IconComponent = Icons[activity.icon as keyof typeof Icons] as React.ComponentType<any>;
  
  const getImportanceColor = (importance: number) => {
    switch (importance) {
      case 5: return 'text-red-500';
      case 4: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 2: return 'text-blue-500';
      case 1: return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getImportanceStars = (importance: number) => {
    return '★'.repeat(importance) + '☆'.repeat(5 - importance);
  };

  return (
    <div 
      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
        isCompleted 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-200 hover:border-orange-300'
      }`}
      onClick={() => onToggle?.(activity.id)}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${
          isCompleted ? 'bg-green-100' : 'bg-orange-100'
        }`}>
          {IconComponent && <IconComponent className={`h-5 w-5 ${
            isCompleted ? 'text-green-600' : 'text-orange-600'
          }`} />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${
              isCompleted ? 'text-green-800' : 'text-gray-800'
            }`}>
              {activity.name}
            </h3>
            {isCompleted && (
              <Icons.Check className="h-5 w-5 text-green-500" />
            )}
          </div>
          
          {activity.description && (
            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          )}
          
          {showImportance && (
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-xs font-medium text-gray-500">Importancia:</span>
              <span className={`text-sm font-bold ${getImportanceColor(activity.importance)}`}>
                {getImportanceStars(activity.importance)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};