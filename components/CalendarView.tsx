import React, { useMemo } from 'react';
import { TaskObject } from '../types';
import { CATEGORY_COLORS, DAYS_OF_WEEK } from '../constants';
import { BookOpen } from 'lucide-react';

interface CalendarViewProps {
  tasks: TaskObject[];
  userProfile: { restDay: number };
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, userProfile }) => {
  // Generate days for the current week (simple logic for demo, starting Sunday)
  const weekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay; 
    const sunday = new Date(today.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      return day;
    });
  }, []);

  const getTasksForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
        // Simple match for exact date
        const taskDate = task.startTime.split('T')[0];
        // In a real app, handle recurring logic here
        return taskDate === dateStr;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day, index) => {
           const isToday = new Date().toDateString() === day.toDateString();
           const isRestDay = index === userProfile.restDay;
           
           return (
            <div key={index} className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${isRestDay ? 'bg-slate-50' : ''}`}>
              <p className={`text-xs font-semibold uppercase ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                {DAYS_OF_WEEK[index]}
              </p>
              <p className={`text-lg font-bold ${isToday ? 'text-indigo-600' : 'text-gray-800'}`}>
                {day.getDate()}
              </p>
              {isRestDay && (
                  <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full mt-1">
                    Descanso
                  </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 min-h-[500px]">
           {weekDays.map((day, dayIndex) => {
             const dayTasks = getTasksForDay(day);
             const isRestDay = dayIndex === userProfile.restDay;

             return (
               <div key={dayIndex} className={`border-r border-gray-100 last:border-r-0 p-2 space-y-2 ${isRestDay ? 'bg-slate-50/50' : ''}`}>
                 {dayTasks.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-300 text-xs italic">
                        Livre
                    </div>
                 )}
                 {dayTasks.map(task => {
                   const startTime = new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                   const colorClass = CATEGORY_COLORS[task.category];
                   
                   return (
                     <div key={task.id} className={`p-2 rounded-md border text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer ${colorClass}`}>
                        <div className="flex justify-between items-start mb-1 opacity-75">
                          <span>{startTime}</span>
                          {task.bibleReference && <BookOpen size={10} />}
                        </div>
                        <p className="font-semibold leading-tight truncate">{task.title}</p>
                        {task.bibleReference && (
                            <p className="mt-1 text-[10px] italic opacity-90 truncate">{task.bibleReference}</p>
                        )}
                     </div>
                   );
                 })}
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;