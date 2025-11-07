
import React, { useState, useEffect } from "react";
import { ProjectBrief } from "@/api/entities";
import { User } from "@/api/entities";
import { Engineer } from "@/api/entities";
import { Task } from "@/api/entities";
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
  Target,
  Share2,
  Clipboard,
  Check
} from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils"; // Import the global utility

// New Component for Team Management
const TeamManagement = ({ users, engineers, onUpdate }) => {
  const [engineersMap, setEngineersMap] = useState({});

  useEffect(() => {
    // Create a map of engineers for quick lookup by email
    const map = engineers.reduce((acc, eng) => {
      acc[eng.user_email] = eng;
      return acc;
    }, {});
    setEngineersMap(map);
  }, [engineers]);

  const handleLevelChange = async (email, newLevel) => {
    const engineer = engineersMap[email];
    if (engineer) {
      try {
        await Engineer.update(engineer.id, { access_level: newLevel });
        onUpdate(); // Refresh data after update
      } catch (error) {
        console.error("Error updating engineer level:", error);
      }
    }
  };

  const handleCreateEngineer = async (user) => {
    const newEngineer = {
      user_email: user.email,
      full_name: user.full_name,
      access_level: 'junior' // Default level
    };
    try {
      await Engineer.create(newEngineer);
      onUpdate(); // Refresh data after creation
    } catch (error) {
      console.error("Error creating engineer:", error);
    }
  };

  return (
    <div className="space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Users className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
          Manage Team Roles
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {users.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No users found.</p>
          </div>
        ) : (
          users.map(user => (
            <Card key={user.id} className="mb-2 last:mb-0 border-0 shadow-none">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">{user.full_name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                {engineersMap[user.email] ? (
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-100 text-green-800">Engineer</Badge>
                    <Select
                      value={engineersMap[user.email].access_level}
                      onValueChange={(value) => handleLevelChange(user.email, value)}
                    >
                      <SelectTrigger className="w-32 text-xs">
                        <SelectValue placeholder="Set Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid-level">Mid-level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => handleCreateEngineer(user)}>
                    Make Engineer
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </div>
  );
};


export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectNotes, setProjectNotes] = useState("");
  const [isGeneratingTeamReport, setIsGeneratingTeamReport] = useState(false);
  const [isGeneratingClientReport, setIsGeneratingClientReport] = useState(false); // New state
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [allUsers, setAllUsers] = useState([]);
  const [allEngineers, setAllEngineers] = useState([]);
  const [teamSelection, setTeamSelection] = useState([]);
  const [isCopied, setIsCopied] = useState(false);


  const loadAllData = async () => {
    // New: Centralized data loading function
    const [userData, engineerData, projectData] = await Promise.all([
      User.list(),
      Engineer.list(),
      ProjectBrief.list('-created_date')
    ]);
    setAllUsers(userData);
    setAllEngineers(engineerData);
    setProjects(projectData);
  };

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);

        // Only admins can access this dashboard
        if (user.role !== 'admin') {
          window.location.href = createPageUrl("Home");
          return;
        }

        await loadAllData(); // Use the new centralized loader

      } catch (error) {
        console.error("Error loading data:", error);
        window.location.href = createPageUrl("Home");
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // New: Effect to update teamSelection when selectedProject changes - This will mostly be unused now
  useEffect(() => {
    if (selectedProject) {
      setTeamSelection(selectedProject.assigned_team || []);
      setProjectNotes(selectedProject.project_notes || ''); // Also ensure notes are loaded
    }
  }, [selectedProject]);


  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      await ProjectBrief.update(projectId, { status: newStatus });
      // Reload data to reflect status change
      await loadAllData(); // Use centralized loader
      // If the updated project is currently selected, refresh its details from the reloaded projects.
      setSelectedProject(prevSelected => {
        if (prevSelected && prevSelected.id === projectId) {
          const updatedProject = projects.find(p => p.id === projectId);
          return updatedProject || null;
        }
        return prevSelected;
      });
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const generateTeamReport = async (project) => {
    if (!project.ai_analysis) return;

    setIsGeneratingTeamReport(true);
    try {
      const allEngineers = await Engineer.list();
      const availableEngineers = allEngineers.map(e => ({ name: e.full_name, email: e.user_email, level: e.access_level }));

      const teamReportResponse = await InvokeLLM({
        prompt: `
        Analyze the provided project data and generate two outputs:
        1. A detailed internal team report (as a raw string).
        2. A structured JSON array of tasks to be executed.

        AVAILABLE ENGINEERS for assignment: ${JSON.stringify(availableEngineers)}

        PROJECT DATA:
        - Client: ${project.client_name}
        - Description: ${project.project_description}
        - AI Analysis: ${project.ai_analysis}

        **Instructions for Task Generation (JSON):**
        - Create a list of actionable development tasks.
        - For each task, provide a 'title', 'description', a 'due_date' (in YYYY-MM-DD format, relative to today), and assign it to the most suitable engineer from the available list by their 'assignee_email'.
        - Distribute tasks logically among the engineers based on their likely skills.

        **Instructions for Team Report (String):**
        Create a comprehensive report with:
        1. DEVELOPMENT TIME BREAKDOWN (in hours for Frontend, Backend, Design, QA, PM).
        2. PRICING ANALYSIS (Recommended Price, Market Rate, Profit Margins).
        3. RESOURCE ALLOCATION (hours per role).
        4. TECHNICAL COMPLEXITY (Score 1-10, Risks, Challenges).
        5. PROJECT TIMELINE (in days for phases).
        6. RECOMMENDATIONS (Team assignment, Tech stack).

        Return a single JSON object with two keys: "teamReport" (string) and "tasks" (JSON array).
        `,
        response_json_schema: {
          "type": "object",
          "properties": {
            "teamReport": { "type": "string" },
            "tasks": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "title": { "type": "string" },
                  "description": { "type": "string" },
                  "assignee_email": { "type": "string" },
                  "due_date": { "type": "string", "format": "date" }
                },
                "required": ["title", "description", "assignee_email", "due_date"]
              }
            }
          },
          "required": ["teamReport", "tasks"]
        }
      });
      
      const { teamReport, tasks } = teamReportResponse;

      // Extract metrics from the text report
      const hourMatch = teamReport.match(/Total Estimated Hours[:\s]+(\d+)/i);
      const priceMatch = teamReport.match(/Recommended Project Price \(total\):?\s*\$?([\d,]+)/i);
      const complexityMatch = teamReport.match(/Complexity Score \(1-10\):?\s*(\d+)/i);

      const estimatedHours = hourMatch ? parseInt(hourMatch[1]) : null;
      const recommendedPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
      const complexityScore = complexityMatch ? parseInt(complexityMatch[1]) : null;

      // Update the project brief
      await ProjectBrief.update(project.id, {
        internal_team_report: teamReport,
        estimated_hours: estimatedHours,
        recommended_price: recommendedPrice,
        complexity_score: complexityScore
      });

      // Create tasks in the database
      if (tasks && tasks.length > 0) {
        const tasksToCreate = tasks.map(task => ({
            ...task,
            project_id: project.id,
            status: 'todo'
        }));
        await Task.bulkCreate(tasksToCreate);
      }

      await loadAllData(); 
      // Update selected project to reflect new data from the brief.
      setSelectedProject(prevSelected => {
        if (prevSelected && prevSelected.id === project.id) {
          const updatedProject = projects.find(p => p.id === project.id);
          return updatedProject || null;
        }
        return prevSelected;
      });

    } catch (error) {
      console.error("Error generating team report and tasks:", error);
    } finally {
      setIsGeneratingTeamReport(false);
    }
  };

  const generateClientProposal = async (project) => {
    if (!project.ai_analysis && !project.internal_team_report) {
      alert("Please generate the internal team report first to provide context for the client proposal.");
      return;
    }

    setIsGeneratingClientReport(true);
    try {
      const proposalHTML = await InvokeLLM({
        prompt: `
          You are a world-class business consultant and web development expert. Your task is to transform the following technical project analysis into a beautiful, client-facing proposal. The output must be a single, self-contained HTML file with embedded CSS for styling.

          **Client & Project Information:**
          - Client: ${project.client_name}
          - Company: ${project.company_name}
          - Project Type: ${project.project_type}
          - Goal: ${project.project_description}

          **Internal AI Analysis (for your reference):**
          ---
          ${project.ai_analysis}
          ---

          **Internal Team & Pricing Breakdown (for your reference):**
          ---
          ${project.internal_team_report}
          ---

          **Instructions for the HTML Proposal:**
          1. **Structure:** Create a professional document with sections like:
              - Header with "Feelize AI" Logo (you can use a stylized text logo) and Project Title.
              - Introduction: Thank the client and summarize your understanding of the project.
              - Our Understanding of Your Vision: Elaborate on the project goals and their business impact.
              - Proposed Solution: Detail the key features and functionalities to be built.
              - Project Phases & Timeline: Provide a clear, high-level timeline (e.g., Discovery, Design, Development, Launch).
              - Investment: Present the recommended_price from the internal report. Frame it as "Project Investment."
              - Why Choose Feelize: Briefly highlight our value proposition (AI-powered, expert team, speed, quality).
              - Next Steps: Outline what happens after they approve the proposal.
          2. **Styling (Embedded CSS):**
              - Use a modern, clean, and professional design. Use a font like 'Inter' from Google Fonts.
              - Use a color palette with #4F46E5 (indigo), #1F2937 (dark gray), and #F9FAFB (light gray).
              - Style cards, sections, headers, and text to be visually appealing and easy to read.
              - Ensure the HTML is responsive. All styles must be in a <style> tag in the <head>.
          3. **Content:**
              - Translate technical jargon into business-friendly language. Focus on benefits.
              - Be persuasive, confident, and professional.
              - Do NOT include internal hour breakdowns or profit margins. Only the final recommended price.

          Your final output should be only the complete HTML code, starting with <!DOCTYPE html>.
        `,
      });

      await ProjectBrief.update(project.id, { professional_report_html: proposalHTML });
      await loadAllData();
      // Refresh selected project
      setSelectedProject(prev => prev ? { ...prev, professional_report_html: proposalHTML } : null);

    } catch (error) {
      console.error("Error generating client proposal:", error);
    } finally {
      setIsGeneratingClientReport(false);
    }
  };


  const saveProjectNotes = async () => {
    if (!selectedProject) return;

    try {
      await ProjectBrief.update(selectedProject.id, { project_notes: projectNotes });
      setSelectedProject(prev => ({ ...prev, project_notes: projectNotes })); // Optimistic update
      // Update the projects list as well to reflect changes
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, project_notes: projectNotes } : p));
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const handleAssignTeam = async () => {
    if (!selectedProject) return;
    try {
      await ProjectBrief.update(selectedProject.id, { assigned_team: teamSelection });
      const updatedProject = { ...selectedProject, assigned_team: teamSelection };
      setSelectedProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    } catch (error) {
      console.error("Error assigning team:", error);
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
      value: `$${Math.round(projects.filter(p => p.recommended_price).reduce((sum, p) => sum + (p.recommended_price || 0), 0) / projects.filter(p => p.recommended_price).length || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  // Modified: Enhanced function to generate comprehensive prompt with detailed team info
  const generateProjectFlowPrompt = (project) => {
    if (!project) return "";

    // Get detailed team member information
    const teamDetails = project.assigned_team && project.assigned_team.length > 0 
      ? project.assigned_team.map(email => {
          const engineer = allEngineers.find(e => e.user_email === email);
          return engineer 
            ? `${engineer.full_name} (${engineer.user_email}) - ${engineer.access_level} level`
            : `${email} - level unknown`;
        }).join('\n- ')
      : 'No team assigned yet.';

    const prompt = `
      Generate a complete project plan for the following project, formatted for a project management tool like Trello or Monday.com. Create distinct phases, epics, user stories, and individual tasks.

      **Project Core Details:**
      - **Project Name:** ${project.company_name || project.client_name} - ${project.project_type}
      - **Client:** ${project.client_name}
      - **Client Email:** ${project.client_email}
      - **Company:** ${project.company_name || 'N/A'}
      - **Project Type:** ${project.project_type}
      - **Budget:** ${project.budget_range}
      - **Timeline:** ${project.timeline}

      **High-Level Goal:**
      ${project.project_description}

      **Key Features / Epics:**
      ${project.key_features ? project.key_features.join(', ') : 'Not specified.'}

      **Target Audience:**
      ${project.target_audience || 'Not specified.'}

      **AI-Generated Strategic Analysis (Client-Facing):**
      ---
      ${project.ai_analysis || 'No client-facing analysis available.'}
      ---

      **Internal Technical & Pricing Breakdown (Internal Team Report):**
      ---
      ${project.internal_team_report || 'No internal team report available. Use the strategic analysis to infer tasks.'}
      ---
      This report contains hour estimates, pricing, and technical risks. Use this as the primary source for creating detailed development tasks.

      **Assigned Team Members:**
      ${teamDetails.startsWith('No team') ? teamDetails : '- ' + teamDetails}

      **Project Metrics:**
      - Estimated Hours: ${project.estimated_hours || 'Not estimated'}
      - Recommended Price: $${project.recommended_price ? project.recommended_price.toLocaleString() : 'Not calculated'}
      - Complexity Score: ${project.complexity_score || 'Not rated'}/10

      **Instructions for AI:**
      1. Create a project board with columns: To Do, In Progress, In Review, Done.
      2. Break down the project into smaller, actionable tasks based on the features and reports above.
      3. Use the 'Internal Team Report' to estimate time for each task. 
      4. If team members are assigned, distribute tasks among them based on their skill levels and the task requirements.
      5. For each task, include:
         - Clear title and detailed description
         - Estimated hours (if available from internal report)
         - Priority level (High/Medium/Low)
         - Assigned team member (use their email for assignment)
         - Due date suggestions based on project timeline
      6. Group tasks into logical sprints or phases based on the 'Project Timeline'.
      7. Add a 'Project Brief' card in the 'To Do' column containing the high-level goal and key client requirements for context.
      8. Consider dependencies between tasks and suggest a logical sequence.

      **Additional Context:**
      - Project Status: ${project.status}
      - Created: ${new Date(project.created_date).toLocaleDateString()}
      - Internal Notes: ${project.project_notes || 'No additional notes.'}

      Your final output should be a structured project plan ready for execution, with clear task assignments and realistic timelines.
    `;

    return prompt.trim();
  };

  // Updated: Click handler with correct Project Flow URL
  const handleProjectFlowClick = (e, project) => {
    e.preventDefault();
    const prompt = generateProjectFlowPrompt(project);
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
    window.open("https://evu-projectflow.base44.app", "_blank");
  };


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

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-2">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'projects' && (
          <>
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
                    <div className="max-h-[60vh] overflow-y-auto">
                      {projects.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <ClipboardList className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                          <p>No projects found.</p>
                        </div>
                      ) : (
                        projects.map((project) => (
                            <div
                              key={project.id}
                              className={`p-3 sm:p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                                selectedProject?.id === project.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                              }`}
                              onClick={() => setSelectedProject(project)}
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
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Project Management Details Panel */}
              <div className="lg:col-span-2">
                {selectedProject ? (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{selectedProject.company_name || 'Project Details'}</h2>
                          <div className="flex items-center gap-2">
                            <Select
                              value={selectedProject.status}
                              onValueChange={(newStatus) => updateProjectStatus(selectedProject.id, newStatus)}
                            >
                              <SelectTrigger className="w-40 text-xs h-8">
                                <SelectValue placeholder="Set status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="completed">Review</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Link to={createPageUrl(`ProjectDashboard?id=${selectedProject.id}`)}>
                                <Button variant="outline" size="sm" className="text-xs h-8">
                                    <Eye className="w-3 h-3 mr-2" />
                                    View Client Dashboard
                                </Button>
                            </Link>
                          </div>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => handleProjectFlowClick(e, selectedProject)}
                          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Clipboard className="w-4 h-4" />}
                          {isCopied ? 'Copied Prompt!' : 'Create in Project Flow'}
                        </a>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto">
                          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                          <TabsTrigger value="team-report" className="text-xs sm:text-sm">Team Report</TabsTrigger>
                          <TabsTrigger value="client-report" className="text-xs sm:text-sm">Client Report</TabsTrigger>
                          <TabsTrigger value="assign-team" className="text-xs sm:text-sm">Assign Team</TabsTrigger>
                          <TabsTrigger value="notes" className="text-xs sm:text-sm">Notes</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview">
                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-3">Project Metrics</h4>
                              <div className="space-y-3">
                                {selectedProject.estimated_hours ? (
                                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <Timer className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm font-medium">Est. Hours</span>
                                    </div>
                                    <span className="font-bold text-blue-600">{selectedProject.estimated_hours}h</span>
                                  </div>
                                ) : null}

                                {selectedProject.recommended_price ? (
                                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="w-4 h-4 text-green-600" />
                                      <span className="text-sm font-medium">Recommended Price</span>
                                    </div>
                                    <span className="font-bold text-green-600">${selectedProject.recommended_price.toLocaleString()}</span>
                                  </div>
                                ) : null}

                                {selectedProject.complexity_score ? (
                                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <Target className="w-4 h-4 text-purple-600" />
                                      <span className="text-sm font-medium">Complexity</span>
                                    </div>
                                    <span className="font-bold text-purple-600">{selectedProject.complexity_score}/10</span>
                                  </div>
                                ) : null}
                              </div>
                              {selectedProject.assigned_team && selectedProject.assigned_team.length > 0 && (
                                <div className="mt-6">
                                  <h4 className="font-semibold text-slate-900 mb-3">Assigned Team</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedProject.assigned_team.map((email, index) => {
                                      const engineer = allEngineers.find(eng => eng.user_email === email);
                                      return engineer ? (
                                        <Badge key={index} className="bg-orange-100 text-orange-800 text-xs">
                                          {engineer.full_name} ({engineer.access_level})
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
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
                                    <FileText className="w-4 h-4 text-slate-400" />
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
                        </TabsContent>

                        {/* Team Report Tab */}
                        <TabsContent value="team-report">
                          <Card className="bg-slate-50 border-slate-200">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between text-base">
                                Internal Team Brief
                                <Button
                                  size="sm"
                                  onClick={() => generateTeamReport(selectedProject)}
                                  disabled={isGeneratingTeamReport}
                                >
                                  {isGeneratingTeamReport ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                                  {selectedProject.internal_team_report ? 'Regenerate' : 'Generate'} Brief
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedProject.internal_team_report ? (
                                <pre className="whitespace-pre-wrap text-xs text-slate-700 font-mono bg-white p-4 rounded-md max-h-96 overflow-auto">
                                  {selectedProject.internal_team_report}
                                </pre>
                              ) : (
                                <div className="text-center py-8 text-slate-500">
                                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                  <p>No team report generated yet.</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        {/* Client Report Tab */}
                        <TabsContent value="client-report">
                           <Card className="bg-slate-50 border-slate-200">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between text-base">
                                Client-Facing Proposal
                                <Button 
                                  size="sm"
                                  onClick={() => generateClientProposal(selectedProject)}
                                  disabled={isGeneratingClientReport}
                                >
                                   {isGeneratingClientReport ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                   {selectedProject.professional_report_html ? 'Regenerate' : 'Generate'} Proposal
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedProject.professional_report_html ? (
                                <div className="border bg-white p-4 rounded-md max-h-96 overflow-auto" dangerouslySetInnerHTML={{ __html: selectedProject.professional_report_html }} />
                              ) : (
                                <div className="text-center py-8 text-slate-500">
                                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                  <p>No client proposal generated yet.</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        {/* Assign Team Tab */}
                        <TabsContent value="assign-team">
                          <h4 className="font-semibold text-slate-900 mb-4">Assign Engineers</h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto mb-4 p-2 bg-slate-50 rounded-md">
                            {allEngineers.map((engineer) => (
                              <div key={engineer.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`eng-${engineer.id}`}
                                  checked={teamSelection.includes(engineer.user_email)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setTeamSelection([...teamSelection, engineer.user_email]);
                                    } else {
                                      setTeamSelection(teamSelection.filter(email => email !== engineer.user_email));
                                    }
                                  }}
                                />
                                <label htmlFor={`eng-${engineer.id}`} className="text-sm font-medium text-gray-700">
                                  {engineer.full_name} ({engineer.access_level})
                                </label>
                              </div>
                            ))}
                          </div>
                          <Button onClick={handleAssignTeam}>Save Team</Button>
                        </TabsContent>

                        {/* Notes Tab */}
                        <TabsContent value="notes">
                          <Textarea
                            placeholder="Add internal notes about the project..."
                            className="h-40 mb-4"
                            value={projectNotes}
                            onChange={(e) => setProjectNotes(e.target.value)}
                          />
                          <Button onClick={saveProjectNotes}>Save Notes</Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-8 sm:p-12 text-center">
                      <ClipboardList className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-slate-300" />
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Select a Project</h3>
                      <p className="text-slate-600 text-sm">Choose a project from the list to view its dedicated dashboard.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {/* Team Management Tab Content */}
        {activeTab === 'team' && (
          <Card className="border-0 shadow-sm">
            <TeamManagement
              users={allUsers}
              engineers={allEngineers}
              onUpdate={loadAllData}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
