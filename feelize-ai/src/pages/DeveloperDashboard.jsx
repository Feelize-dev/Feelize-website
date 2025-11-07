
import React, { useState, useEffect } from "react";
import { ProjectBrief } from "@/api/entities";
import { Engineer } from "@/api/entities";
import { User } from "@/api/entities";
import { Task } from "@/api/entities"; // Import Task entity
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ClipboardList, 
  Calendar,
  DollarSign,
  Timer,
  Target,
  Send,
  Eye,
  Loader2,
  Code2,
  BookOpen,
  CalendarDays // Import CalendarDays for new tab
} from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import ProjectCalendar from "@/components/tasks/ProjectCalendar"; // Import new calendar component

export default function DeveloperDashboard() {
  const [projects, setProjects] = useState([]);
  // selectedProject state is no longer needed as navigation will handle individual project views
  const [tasks, setTasks] = useState([]); // State for tasks
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [engineerProfile, setEngineerProfile] = useState(null);
  // projectNotes state is no longer needed here as notes will be handled in ProjectDashboard

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        const [engineerData, projectData, taskData] = await Promise.all([
          Engineer.filter({ user_email: user.email }),
          ProjectBrief.list('-created_date'), // RLS will automatically filter this
          Task.filter({ assignee_email: user.email }) // Fetch tasks for current user
        ]);

        if (engineerData.length > 0) {
          setEngineerProfile(engineerData[0]);
        } else {
          // Not an engineer, redirect or show error
          window.location.href = createPageUrl("Home");
          return;
        }

        setProjects(projectData);
        setTasks(taskData);
        
      } catch (error) {
        console.error("Error loading data:", error);
        window.location.href = createPageUrl("Home");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // updateProjectStatus and saveProjectNotes functions are no longer needed here
  // as project details and notes will be managed on the ProjectDashboard page.

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-600';
      case 'delivered': return 'bg-green-500/20 text-green-600';
      case 'cancelled': return 'bg-red-500/20 text-red-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // selectedProjectTasks variable is no longer relevant as project details are viewed on a different page.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Developer Dashboard</h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base">
            Welcome, {engineerProfile?.full_name}. Here are your assigned projects.
          </p>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="projects">Project Board</TabsTrigger>
            <TabsTrigger value="calendar">Task Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <ClipboardList className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
                      Assigned Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[60vh] overflow-y-auto">
                      {projects.map((project) => (
                        <Link to={createPageUrl(`ProjectDashboard?id=${project.id}`)} key={project.id}>
                          <div 
                            className={`p-3 sm:p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors`}
                            // Removed selectedProject state and its conditional styling/onClick handler
                            // as project details are now handled on a dedicated ProjectDashboard page.
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1">
                                {project.company_name || project.client_name}
                              </h3>
                              <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                                {project.status}
                              </Badge>
                            </div>
                            
                            <p className="text-slate-600 text-xs mb-2 line-clamp-2">
                              {project.project_description?.substring(0, 60)}...
                            </p>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              {new Date(project.created_date).toLocaleDateString()}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {/* The right panel now shows a static prompt to select a project, 
                    as project details are handled on a dedicated ProjectDashboard page. */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-8 sm:p-12 text-center">
                      <ClipboardList className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-slate-300" />
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select a Project</h3>
                      <p className="text-slate-600 text-sm">Choose a project from the list to view its dedicated dashboard.</p>
                    </CardContent>
                  </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-indigo-600" />
                  My Task Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectCalendar tasks={tasks} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
