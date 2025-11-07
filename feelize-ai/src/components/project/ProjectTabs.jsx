import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientOverview from './ClientOverview';
import TeamTaskBoard from './TeamTaskBoard';
import ActivityFeed from './ActivityFeed';
import ProjectTeam from './ProjectTeam';
import ReportViewer from './ReportViewer'; // Can be removed if we pass component as prop

export default function ProjectTabs({ project, tasks, activities, team, currentUser, userRole, onTaskUpdate, onActivityCreate, ReportViewerComponent }) {
  const isInternalUser = userRole === 'admin' || userRole === 'engineer';

  const defaultTab = userRole === 'client' ? "overview" : "tasks";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:flex w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isInternalUser && <TabsTrigger value="tasks">Tasks</TabsTrigger>}
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <div className="flex-shrink-0">
          <ProjectTeam team={team} />
        </div>
      </div>

      <TabsContent value="overview" className="mt-6">
        <ClientOverview project={project} tasks={tasks} />
      </TabsContent>
      
      {isInternalUser && (
        <TabsContent value="tasks" className="mt-6">
          <TeamTaskBoard
            initialTasks={tasks}
            team={team}
            onTaskUpdate={onTaskUpdate}
            onActivityCreate={onActivityCreate}
          />
        </TabsContent>
      )}

      <TabsContent value="report" className="mt-6">
        {ReportViewerComponent}
      </TabsContent>

      <TabsContent value="activity" className="mt-6">
        <ActivityFeed
            activities={activities}
            currentUser={currentUser}
            onComment={onActivityCreate}
        />
      </TabsContent>
    </Tabs>
  );
}