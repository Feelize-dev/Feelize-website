import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/api/entities';

const TaskCard = ({ task, index, team }) => {
  const assignee = team.find(member => member.user_email === task.assignee_email);
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <p className="font-semibold text-sm mb-2">{task.title}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {assignee && (
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://avatar.vercel.sh/${assignee.user_email}.png`} alt={assignee.full_name} />
                        <AvatarFallback>{assignee.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

const BoardColumn = ({ status, title, tasks, team }) => {
  return (
    <div className="flex-1 bg-slate-100 rounded-lg p-3">
      <h3 className="font-semibold mb-4 px-1">{title}</h3>
      <Droppable droppableId={status}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[400px]">
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} team={team} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 w-full p-2 rounded-md">
        <PlusCircle className="w-4 h-4" />
        Add task
      </button>
    </div>
  );
};

export default function TeamTaskBoard({ initialTasks, team, onTaskUpdate, onActivityCreate }) {
  const [tasks, setTasks] = useState({
    todo: [],
    in_progress: [],
    done: [],
  });

  useEffect(() => {
    const sortedTasks = { todo: [], in_progress: [], done: [] };
    initialTasks.forEach(task => {
      if (sortedTasks[task.status]) {
        sortedTasks[task.status].push(task);
      }
    });
    setTasks(sortedTasks);
  }, [initialTasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = [...tasks[source.droppableId]];
    const finishColumn = [...tasks[destination.droppableId]];
    const movedTask = startColumn.find(t => t.id === draggableId);

    // Optimistic UI Update
    startColumn.splice(source.index, 1);
    finishColumn.splice(destination.index, 0, movedTask);
    
    setTasks(prev => ({
        ...prev,
        [source.droppableId]: startColumn,
        [destination.droppableId]: finishColumn
    }));

    // Persist change to the database
    try {
        await Task.update(draggableId, { status: destination.droppableId });
        
        // Create activity log
        onActivityCreate({
            activity_type: "TASK_UPDATE",
            description: `moved task "${movedTask.title}" from ${source.droppableId} to ${destination.droppableId}`,
            details: { taskId: draggableId, from: source.droppableId, to: destination.droppableId }
        });

    } catch (error) {
        console.error("Error updating task", error);
        // Revert UI on error
        onTaskUpdate(); 
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6">
        <BoardColumn status="todo" title="To Do" tasks={tasks.todo} team={team} />
        <BoardColumn status="in_progress" title="In Progress" tasks={tasks.in_progress} team={team} />
        <BoardColumn status="done" title="Done" tasks={tasks.done} team={team} />
      </div>
    </DragDropContext>
  );
}