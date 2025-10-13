
import React, { useState, useEffect } from "react";
import { ProjectBrief } from "@/api/entities";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  ClipboardList, 
  TrendingUp,
  Calendar,
  Clock,
  Mail,
  Phone,
  FileText,
  Send,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  BrainCircuit,
  Sparkles,
  Settings,
  BarChart3,
  ArrowLeft,
  DollarSign,
  Timer,
  Target
} from "lucide-react";
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isGeneratingTeamReport, setIsGeneratingTeamReport] = useState(false);
  const [projectNotes, setProjectNotes] = useState("");

  // Helper function to generate page URLs
  const createPageUrl = (pageName) => {
    switch (pageName) {
      case "ProjectReport":
        return "/admin/project-report"; 
      case "Home": // Added for redirection
        return "/";
      default:
        return "/";
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        // Only admins can access this dashboard
        if (user.role !== 'admin') {
          window.location.href = createPageUrl("Home");
          return;
        }
        
        const projectData = await ProjectBrief.list('-created_date');
        setProjects(projectData);
        
        // The original `if (selectedProject)` logic here caused a dependency issue if `selectedProject`
        // was added to the useEffect dependency array, potentially leading to an infinite loop.
        // It's also redundant now that `updateProjectStatus` and `generateTeamReport` explicitly
        // re-select the project if it's the current one being viewed.
        // For initial mount, `selectedProject` would typically be null unless state is persisted
        // across unmounts/mounts by other means (e.g., URL parameters, local storage).
        // For internal state management, user selection and action-based updates are sufficient.
        
      } catch (error) {
        console.error("Error loading data:", error);
        // Redirect to home if not authenticated or other error occurs
        window.location.href = createPageUrl("Home");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      await ProjectBrief.update(projectId, { status: newStatus });
      // Reload data to reflect status change
      const projectData = await ProjectBrief.list('-created_date');
      setProjects(projectData);
      if (selectedProject && selectedProject.id === projectId) {
        // If the updated project is currently selected, refresh its details.
        const updatedProject = projectData.find(p => p.id === projectId);
        setSelectedProject(updatedProject || null);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const generateTeamReport = async (project) => {
    if (!project.ai_analysis) return;
    
    setIsGeneratingTeamReport(true);
    try {
      const teamReport = await InvokeLLM({
        prompt: `
        Generate a detailed internal team report for project pricing and execution planning.

        PROJECT DATA:
        - Client: ${project.client_name}
        - Company: ${project.company_name || 'N/A'}
        - Project Type: ${project.project_type}
        - Budget Range: ${project.budget_range}
        - Timeline: ${project.timeline}
        - Description: ${project.project_description}

        AI ANALYSIS:
        ${project.ai_analysis}

        Create a comprehensive internal report with:

        1. **DEVELOPMENT TIME BREAKDOWN:**
           - Frontend Development (hours): [Estimated hours]
           - Backend Development (hours): [Estimated hours]
           - Design & UX (hours): [Estimated hours]
           - Testing & QA (hours): [Estimated hours]
           - Project Management (hours): [Estimated hours]
           - Total Estimated Hours: [Total estimated hours]

        2. **PRICING ANALYSIS:**
           - Market Rate Research ($50-150/hour based on complexity)
           - Recommended Project Price (total): $[Recommended price]
           - Profit Margins: [Estimated percentage]
           - Competitive Analysis: [Brief analysis]

        3. **RESOURCE ALLOCATION:**
           - Senior Developer (hours): [Estimated hours]
           - Junior Developer (hours): [Estimated hours]
           - Designer (hours): [Estimated hours]
           - Project Manager (hours): [Estimated hours]

        4. **TECHNICAL COMPLEXITY ASSESSMENT:**
           - Complexity Score (1-10): [Score] (1 being very simple, 10 being extremely complex)
           - Risk Factors: [List of risks]
           - Technical Challenges: [List of challenges]
           - Required Technologies: [List of technologies]

        5. **PROJECT TIMELINE:**
           - Phase 1: Design & Planning (days): [Estimated days]
           - Phase 2: Development (days): [Estimated days]
           - Phase 3: Testing & Deployment (days): [Estimated days]
           - Total Project Duration: [Total estimated days]

        6. **RECOMMENDATIONS:**
           - Team assignment suggestions: [Suggestions]
           - Technology stack recommendations: [Recommendations]
           - Potential upsell opportunities: [Opportunities]

        Format as structured text with clear sections and bullet points.
        `,
        response_json_schema: null
      });

      // Extract pricing and hour estimates from the report
      const hourMatch = teamReport.match(/Total Estimated Hours[:\s]+(\d+)/i);
      const priceMatch = teamReport.match(/Recommended Project Price \(total\):?\s*\$?([\d,]+)/i); // Improved regex for price
      const complexityMatch = teamReport.match(/Complexity Score \(1-10\):?\s*(\d+)/i); // Improved regex for complexity

      const estimatedHours = hourMatch ? parseInt(hourMatch[1]) : null;
      const recommendedPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
      const complexityScore = complexityMatch ? parseInt(complexityMatch[1]) : null;

      await ProjectBrief.update(project.id, {
        internal_team_report: teamReport,
        estimated_hours: estimatedHours,
        recommended_price: recommendedPrice,
        complexity_score: complexityScore
      });

      // Reload data to show updated project with report
      const projectData = await ProjectBrief.list('-created_date');
      setProjects(projectData);
      // Refresh the currently selected project if it's the one that just got a report
      const updatedProject = projectData.find(p => p.id === project.id);
      setSelectedProject(updatedProject || null);
    } catch (error) {
      console.error("Error generating team report:", error);
    } finally {
      setIsGeneratingTeamReport(false);
    }
  };

  const saveProjectNotes = async () => {
    if (!selectedProject) return;
    
    try {
      await ProjectBrief.update(selectedProject.id, { project_notes: projectNotes });
      setSelectedProject(prev => ({...prev, project_notes: projectNotes})); // Optimistic update
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-slate-500/20 text-slate-600';
      case 'completed': return 'bg-blue-500/20 text-blue-600';
      case 'contacted': return 'bg-green-500/20 text-green-600';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-600';
      case 'delivered': return 'bg-purple-500/20 text-purple-600';
      case 'cancelled': return 'bg-red-500/20 text-red-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const stats = [
    { 
      title: "Total Projects", 
      value: projects.length, 
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Pending Review", 
      value: projects.filter(p => p.status === 'completed').length, 
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    { 
      title: "In Progress", 
      value: projects.filter(p => p.status === 'in_progress').length, 
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      title: "Avg. Value",
      value: `$${Math.round(projects.reduce((sum, p) => sum + (p.recommended_price || 0), 0) / projects.length || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base">Manage all projects, pricing, and team assignments</p>
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
                  <ClipboardList className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {projects.map((project) => (
                    <div 
                      key={project.id}
                      className={`p-3 sm:p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedProject?.id === project.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                      }`}
                      onClick={() => {
                        setSelectedProject(project);
                        setProjectNotes(project.project_notes || '');
                      }}
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
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.created_date).toLocaleDateString()}
                        </div>
                        {project.recommended_price && (
                          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <DollarSign className="w-3 h-3" />
                            ${project.recommended_price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Management */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <Card className="border-0 shadow-sm">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
                      Project Management
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProject.ai_analysis && !selectedProject.internal_team_report && (
                        <Button 
                          onClick={() => generateTeamReport(selectedProject)}
                          disabled={isGeneratingTeamReport}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        >
                          {isGeneratingTeamReport ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <BarChart3 className="w-3 h-3 mr-1" />
                              Generate Team Report
                            </>
                          )}
                        </Button>
                      )}
                      
                      {/* Status Dropdown */}
                      <Select
                        value={selectedProject.status}
                        onValueChange={(value) => updateProjectStatus(selectedProject.id, value)}
                      >
                        <SelectTrigger className="w-32 text-xs">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="completed">Under Review</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto">
                      <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                      <TabsTrigger value="team-report" className="text-xs sm:text-sm">Team Report</TabsTrigger>
                      <TabsTrigger value="client-report" className="text-xs sm:text-sm">Client Report</TabsTrigger>
                      <TabsTrigger value="notes" className="text-xs sm:text-sm">Notes</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Project Metrics</h4>
                          <div className="space-y-3">
                            {selectedProject.estimated_hours && (
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Timer className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium">Est. Hours</span>
                                </div>
                                <span className="font-bold text-blue-600">{selectedProject.estimated_hours}h</span>
                              </div>
                            )}
                            
                            {selectedProject.recommended_price && (
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium">Recommended Price</span>
                                </div>
                                <span className="font-bold text-green-600">${selectedProject.recommended_price.toLocaleString()}</span>
                              </div>
                            )}
                            
                            {selectedProject.complexity_score && (
                              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-medium">Complexity</span>
                                </div>
                                <span className="font-bold text-purple-600">{selectedProject.complexity_score}/10</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Client Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span>{selectedProject.client_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="break-all">{selectedProject.client_email}</span>
                            </div>
                            {selectedProject.company_name && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span>{selectedProject.company_name}</span>
                              </div>
                            )}
                            {selectedProject.project_type && (
                              <div>
                                <span className="font-medium">Type: </span>
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  {selectedProject.project_type}
                                </Badge>
                              </div>
                            )}
                            {selectedProject.budget_range && (
                              <div>
                                <span className="font-medium">Budget: </span>
                                <span className="text-slate-600">{selectedProject.budget_range}</span>
                              </div>
                            )}
                            {selectedProject.timeline && (
                              <div>
                                <span className="font-medium">Timeline: </span>
                                <span className="text-slate-600">{selectedProject.timeline}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-3">Project Description</h4>
                        <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg">
                          {selectedProject.project_description}
                        </p>
                      </div>

                      {selectedProject.key_features && selectedProject.key_features.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3 text-sm sm:text-base">Key Features</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.key_features.map((feature, index) => (
                                <Badge key={index} className="bg-indigo-100 text-indigo-800 text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </TabsContent>
                    
                    {/* New Team Report Tab */}
                    <TabsContent value="team-report">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">Internal Team Analysis</h4>
                          {selectedProject.internal_team_report && (
                            <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}&type=team`}>
                              <Button size="sm" variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                View Full Report
                              </Button>
                            </Link>
                          )}
                        </div>
                        
                        {selectedProject.internal_team_report ? (
                          <div className="bg-slate-50 p-6 rounded-xl overflow-hidden">
                            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                              {selectedProject.internal_team_report.substring(0, 1000)}...
                            </pre>
                            {selectedProject.internal_team_report.length > 1000 && (
                              <div className="mt-4 text-right">
                                <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}&type=team`}>
                                  <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                                    Read more →
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>No team report generated yet.</p>
                            {selectedProject.ai_analysis ? (
                                <Button 
                                onClick={() => generateTeamReport(selectedProject)}
                                disabled={isGeneratingTeamReport}
                                className="mt-4"
                                >
                                {isGeneratingTeamReport ? (
                                    <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                    </>
                                ) : (
                                    <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Team Report
                                    </>
                                )}
                                </Button>
                            ) : (
                                <p className="mt-2 text-sm">AI analysis is required to generate a team report.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    {/* New Client Report Tab */}
                    <TabsContent value="client-report">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">Client Analysis Report</h4>
                          {selectedProject.ai_analysis && (
                            <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}`}>
                              <Button size="sm" variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                View Client Report
                              </Button>
                            </Link>
                          )}
                        </div>
                        
                        {selectedProject.ai_analysis ? (
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200 overflow-hidden">
                            <div className="prose prose-sm max-w-none text-slate-700">
                              <p className="mb-3">
                                {selectedProject.ai_analysis.substring(0, 500)}...
                              </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-purple-200">
                              <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}`}>
                                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Open Full Report
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <BrainCircuit className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>No client analysis available.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    {/* New Notes Tab */}
                    <TabsContent value="notes">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Project Notes & Updates</h4>
                        <Textarea
                          placeholder="Add internal notes, updates, or team communications..."
                          value={projectNotes}
                          onChange={(e) => setProjectNotes(e.target.value)}
                          className="min-h-32"
                        />
                        <Button onClick={saveProjectNotes} className="w-full sm:w-auto">
                          <Send className="w-4 h-4 mr-2" />
                          Save Notes
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 sm:p-12 text-center">
                  <ClipboardList className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select a Project</h3>
                  <p className="text-slate-600 text-sm">Choose a project to manage pricing, team assignment, and client communication</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
