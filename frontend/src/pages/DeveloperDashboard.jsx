
import React, { useState, useEffect } from "react";
import { ProjectBrief } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom"; // New import
import { 
  Code2, 
  MessageSquare, 
  ClipboardList, 
  TrendingUp,
  Calendar,
  Clock,
  Users,
  Send,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Rocket,
  Bug,
  GitBranch,
  FileCode,
  Timer,
  Target,
  FileText // Kept as it's used in the new Link button
} from "lucide-react";

import AIAnalysisReport from "../components/AIAnalysisReport";

// Helper function to create URLs (assuming a simple mapping for now)
const createPageUrl = (pageName) => {
  switch (pageName) {
    case "ProjectReport":
      return "/project-report";
    // Add other page mappings as needed
    default:
      return `/${pageName.toLowerCase().replace(/ /g, '-')}`;
  }
};

export default function DeveloperDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  // Removed showFullAnalysis state as full view is now a separate page

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Get only projects that are in progress or assigned to development
      const devProjects = await ProjectBrief.filter(
        { status: 'in_progress' },
        '-updated_date'
      );
      setProjects(devProjects);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectProgress = async (projectId, progressData) => {
    try {
      await ProjectBrief.update(projectId, { ...progressData });
      loadData();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const getProjectProgress = (project) => {
    // Mock progress calculation - in real app this would come from project data
    const phases = ['Planning', 'Design', 'Development', 'Testing', 'Deployment'];
    // For demonstration, let's assume current phase is based on a project property if it exists, otherwise mock
    const currentPhaseIndex = project?.current_dev_phase_index !== undefined ? project.current_dev_phase_index : 2; // Mock current phase
    return {
      currentPhase: phases[currentPhaseIndex],
      progress: ((currentPhaseIndex + 1) / phases.length) * 100,
      phases
    };
  };

  const stats = [
    { 
      title: "Active Projects", 
      value: projects.length, 
      icon: Code2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Completed This Month", 
      value: 5, // Mock data
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      title: "Pending Reviews", 
      value: 3, // Mock data
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    { 
      title: "Issues/Bugs", 
      value: 2, // Mock data
      icon: Bug,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // The full analysis view conditional render has been removed
  // as it's now handled by a separate page navigated via Link.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-5 sm:w-6 h-5 sm:w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Developer Dashboard</h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base">Manage development projects, track progress, and communicate with clients and team</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <p className="text-slate-600 text-xs sm:text-sm font-medium">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 sm:w-6 h-5 sm:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Projects List */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Rocket className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                  Development Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                  {projects.length === 0 ? (
                    <div className="p-8 text-center">
                      <Code2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500 text-sm">No projects in development queue</p>
                    </div>
                  ) : (
                    projects.map((project) => {
                      const progress = getProjectProgress(project);
                      return (
                        <div 
                          key={project.id}
                          className={`p-3 sm:p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                            selectedProject?.id === project.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                          }`}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1">
                              {project.company_name || project.client_name}'s {project.project_type?.replace('_', ' ')}
                            </h3>
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              {progress.currentPhase}
                            </Badge>
                          </div>
                          
                          <Progress value={progress.progress} className="h-2 mb-2" />
                          
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Started {new Date(project.created_date).toLocaleDateString()}
                            </span>
                            <span>{Math.round(progress.progress)}%</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <Card className="border-0 shadow-sm">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <FileCode className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                      Project Development
                    </CardTitle>
                    <div className="flex gap-2">
                      {selectedProject.ai_analysis && (
                        <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}`}>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Technical Report
                          </Button>
                        </Link>
                      )}
                      <Button size="sm" variant="outline" className="text-xs">
                        <GitBranch className="w-3 h-3 mr-1" />
                        View Code
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Bug className="w-3 h-3 mr-1" />
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto">
                      <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                      <TabsTrigger value="progress" className="text-xs sm:text-sm">Progress</TabsTrigger>
                      <TabsTrigger value="communication" className="text-xs sm:text-sm">Communication</TabsTrigger>
                      <TabsTrigger value="specs" className="text-xs sm:text-sm">Requirements</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3">Project Details</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Client:</span> {selectedProject.client_name}
                              </div>
                              <div>
                                <span className="font-medium">Type:</span> 
                                <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
                                  {selectedProject.project_type?.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Budget:</span> {selectedProject.budget_range}
                              </div>
                              <div>
                                <span className="font-medium">Timeline:</span> {selectedProject.timeline || 'TBD'}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3">Development Status</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Overall Progress</span>
                                  <span className="text-sm text-slate-500">{Math.round(getProjectProgress(selectedProject).progress)}%</span>
                                </div>
                                <Progress value={getProjectProgress(selectedProject).progress} className="h-2" />
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <Timer className="w-4 h-4 text-green-600" />
                                <span>Current Phase: <strong>{getProjectProgress(selectedProject).currentPhase}</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Project Description</h4>
                          <p className="text-slate-700 bg-slate-50 p-4 rounded-lg text-sm leading-relaxed">
                            {selectedProject.project_description}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="progress">
                      <div className="space-y-6">
                        <h4 className="font-semibold text-slate-900">Development Phases</h4>
                        
                        <div className="space-y-4">
                          {getProjectProgress(selectedProject).phases.map((phase, index) => {
                            const currentPhaseIndex = getProjectProgress(selectedProject).phases.indexOf(
                              getProjectProgress(selectedProject).currentPhase
                            );
                            const isCompleted = index < currentPhaseIndex;
                            const isCurrent = index === currentPhaseIndex;
                            
                            return (
                              <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCompleted ? 'bg-green-500 text-white' : 
                                  isCurrent ? 'bg-purple-500 text-white' : 
                                  'bg-slate-300 text-slate-600'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <span className="text-sm font-bold">{index + 1}</span>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <h5 className="font-medium text-slate-900">{phase}</h5>
                                  <p className="text-sm text-slate-600">
                                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                                  </p>
                                </div>
                                
                                {isCurrent && (
                                  <Button size="sm" variant="outline">
                                    Update Status
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="communication">
                      <div className="space-y-6">
                        <h4 className="font-semibold text-slate-900">Team & Client Communication</h4>
                        
                        {/* Message Thread */}
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-medium text-slate-900">Project Manager</span>
                              <span className="text-xs text-slate-500">1 day ago</span>
                            </div>
                            <p className="text-sm text-slate-700">Development kickoff meeting scheduled for tomorrow. Please review the technical requirements.</p>
                          </div>
                          
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <Code2 className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-medium text-slate-900">You</span>
                              <span className="text-xs text-slate-500">6 hours ago</span>
                            </div>
                            <p className="text-sm text-slate-700">Initial setup complete. Working on the core architecture. Will have first demo ready by end of week.</p>
                          </div>
                        </div>
                        
                        {/* Send Message */}
                        <div className="border-t pt-4">
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Update team and client on progress..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1"
                              rows={3}
                            />
                            <Button 
                              size="sm"
                              disabled={!newMessage.trim()}
                              className="self-end bg-purple-600 hover:bg-purple-700"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="specs">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-slate-900">Technical Requirements</h4>
                          {selectedProject.ai_analysis && (
                            <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}`}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-purple-600 hover:text-purple-700 text-xs"
                              >
                                View Full Report →
                              </Button>
                            </Link>
                          )}
                        </div>
                        
                        {selectedProject.ai_analysis ? (
                          <AIAnalysisReport 
                            analysis={selectedProject.ai_analysis}
                            projectData={selectedProject}
                            isFullView={false}
                          />
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <FileCode className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p className="text-sm">No technical specifications available yet.</p>
                          </div>
                        )}
                        
                        {/* Key Features */}
                        {selectedProject.key_features && selectedProject.key_features.length > 0 && (
                          <div>
                            <h5 className="font-medium text-slate-900 mb-3">Key Features to Implement</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedProject.key_features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span className="text-sm text-slate-700">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Code2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Project</h3>
                  <p className="text-slate-600 text-sm">Choose a project from the development queue to view details and manage progress</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
