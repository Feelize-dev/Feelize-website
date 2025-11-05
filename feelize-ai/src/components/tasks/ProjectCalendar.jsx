import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProjectCalendar({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = format(new Date(task.due_date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch(status) {
      case 'done': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-md hover:bg-slate-100">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-md hover:bg-slate-100">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 font-medium mb-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div key={`empty-${index}`} className="border rounded-md border-transparent"></div>
          ))}
          {daysInMonth.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const tasksForDay = tasksByDate[dayKey] || [];
            return (
              <div
                key={day.toString()}
                className={`border rounded-md p-2 h-28 flex flex-col ${
                  isSameDay(day, new Date()) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
              >
                <span className={`font-medium ${isSameMonth(day, currentDate) ? 'text-slate-800' : 'text-slate-400'}`}>
                  {format(day, 'd')}
                </span>
                <div className="flex-grow mt-1 overflow-y-auto space-y-1 pr-1">
                  <TooltipProvider>
                    {tasksForDay.map(task => (
                      <Tooltip key={task.id}>
                        <TooltipTrigger asChild>
                           <div className="flex items-center gap-1.5 cursor-pointer">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} flex-shrink-0`}></div>
                              <p className="text-xs text-slate-700 truncate">{task.title}</p>
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-sm text-slate-500">{task.description}</p>
                           <Badge className="mt-2" variant={task.status === 'done' ? 'default' : 'secondary'}>
                              {task.status === 'done' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                              {task.status}
                           </Badge>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}