import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, FileText, Target, DollarSign, Calendar } from 'lucide-react';

export default function ClientOverview({ project, tasks }) {
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const milestones = [
    { name: 'Project Kick-off', status: 'completed' },
    { name: 'Design Phase', status: 'completed' },
    { name: 'Development', status: 'in_progress' },
    { name: 'Testing & QA', status: 'todo' },
    { name: 'Launch', status: 'todo' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">{completedTasks} of {totalTasks} tasks completed</span>
              <span className="font-bold text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>

        {/* Milestones Card */}
        <Card>
          <CardHeader>
            <CardTitle>Key Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    {milestone.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {milestone.status === 'in_progress' && <Clock className="w-6 h-6 text-blue-500 animate-spin-slow" />}
                    {milestone.status === 'todo' && <div className="w-6 h-6 rounded-full border-2 border-slate-300" />}
                  </div>
                  <div className="ml-4">
                    <p className={`font-medium ${milestone.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {milestone.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 mt-1 text-slate-500" />
              <div>
                <h4 className="font-semibold text-slate-800">Project Type</h4>
                <p className="text-slate-600">{project.project_type}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-4 h-4 mt-1 text-slate-500" />
              <div>
                <h4 className="font-semibold text-slate-800">Target Audience</h4>
                <p className="text-slate-600">{project.target_audience}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-4 h-4 mt-1 text-slate-500" />
              <div>
                <h4 className="font-semibold text-slate-800">Budget Range</h4>
                <p className="text-slate-600">{project.budget_range?.replace(/_/g, ' ')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 mt-1 text-slate-500" />
              <div>
                <h4 className="font-semibold text-slate-800">Timeline</h4>
                <p className="text-slate-600">{project.timeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}