import React from 'react';
import { Captions as Icons } from 'lucide-react';

interface DayScoreProps {
  score: number;
  maxScore: number;
  date: string;
}

export const DayScore: React.FC<DayScoreProps> = ({ score, maxScore, date }) => {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    if (percentage >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getBackgroundColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 border-green-200';
    if (percentage >= 60) return 'bg-yellow-100 border-yellow-200';
    if (percentage >= 40) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  const getEmoji = (percentage: number) => {
    if (percentage >= 90) return '🌟';
    if (percentage >= 80) return '😄';
    if (percentage >= 60) return '😊';
    if (percentage >= 40) return '😐';
    return '😔';
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getBackgroundColor(percentage)} transition-all duration-300`}>
      <div className="text-center">
        <div className="text-4xl mb-2">{getEmoji(percentage)}</div>
        <div className={`text-3xl font-bold mb-2 ${getScoreColor(percentage)}`}>
          {score} / {maxScore}
        </div>
        <div className={`text-lg font-semibold mb-2 ${getScoreColor(percentage)}`}>
          {percentage}%
        </div>
        <div className="text-sm text-gray-600">
          Puntuación del día perfecto
        </div>
      </div>
      
      <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            percentage >= 80 ? 'bg-green-500' :
            percentage >= 60 ? 'bg-yellow-500' :
            percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};