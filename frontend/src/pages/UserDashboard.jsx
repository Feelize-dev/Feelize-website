
import React, { useState, useEffect } from "react";
import { projectsApi, messagesApi } from "@/api/apiClient";
import { useAuth } from '@/contexts/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FolderOpen,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  FileText,
  Users,
  Loader2,
  Rocket,
  Zap,
  Target,
  Send,
  Eye,
  BrainCircuit,
  ArrowLeft,
  Sparkles
} from "lucide-react";

// AIAnalysisReport Component: Renders formatted AI analysis text
// This component remains defined as it may be used by the new ProjectReport page,
// but its direct usage for rendering previews in UserDashboard has been replaced.
const AIAnalysisReport = ({ analysis, isFullView }) => {
  if (!analysis) return null;

  // Split analysis text into paragraphs, filtering out empty lines
  const paragraphs = analysis.split('\n').filter(p => p.trim() !== '');

  // Determine which paragraphs to display based on isFullView prop
  const displayParagraphs = isFullView ? paragraphs : paragraphs.slice(0, 3);

  // Helper function to render a single paragraph with basic formatting
  const renderFormattedParagraph = (paragraph, index) => {
    // Simple heuristic for potential sub-headings or list items
    if (paragraph.endsWith(':')) {
      // Treat lines ending with a colon as sub-headings
      return <h5 key={index} className="text-md font-semibold text-slate-800 mt-4 mb-2">{paragraph}</h5>;
    } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
      // Treat lines starting with '- ' or '* ' as list items
      return <li key={index} className="text-sm text-slate-700 ml-4">{paragraph.substring(2)}</li>;
    }
    // Default to a regular paragraph
    return <p key={index} className="mb-3 last:mb-0">{paragraph}</p>;
  };

  return (
    <div className="prose prose-sm max-w-none text-slate-700">
      {displayParagraphs.map(renderFormattedParagraph)}
    </div>
  );
};


export default function UserDashboard() {
  const [projects, setProjects] = useState([]);
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Load user data and projects
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      if (!currentUser) {
        window.location.href = createPageUrl("StartProject");
        return;
      }

      try {
        // Get user's projects sorted by created date
        const userProjects = await projectsApi.list({ 
          sort: '-created_date',
          limit: 50 // Adjust limit as needed
        });
        setProjects(userProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [currentUser]);

  // Load messages when a project is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedProject) return;
      
      try {
        const projectMessages = await messagesApi.list(selectedProject.id, {
          limit: 50 // Adjust limit as needed
        });
        setMessages(projectMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [selectedProject?.id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          color: 'bg-slate-500/20 text-slate-600',
          icon: FileText,
          progress: 25,
          description: 'Your project brief is being reviewed by our team'
        };
      case 'completed':
        return {
          label: 'Under Review',
          color: 'bg-blue-500/20 text-blue-600',
          icon: Clock,
          progress: 50,
          description: 'Our experts are analyzing your requirements and preparing a proposal'
        };
      case 'contacted':
        return {
          label: 'Proposal Sent',
          color: 'bg-purple-500/20 text-purple-600',
          icon: MessageSquare,
          progress: 75,
          description: 'We\'ve sent you a detailed proposal - check your email!'
        };
      case 'in_progress':
        return {
          label: 'In Development',
          color: 'bg-green-500/20 text-green-600',
          icon: Rocket,
          progress: 85, // Changed from 100 to 85 to accommodate 'delivered'
          description: 'Your project is in active development by our AI-powered team'
        };
      case 'delivered': // New status
        return {
          label: 'Delivered',
          color: 'bg-emerald-500/20 text-emerald-600',
          icon: CheckCircle,
          progress: 100,
          description: 'Project completed and delivered successfully!'
        };
      case 'cancelled': // New status
        return {
          label: 'Cancelled',
          color: 'bg-red-500/20 text-red-600',
          icon: AlertCircle,
          progress: 0,
          description: 'Project has been cancelled'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-500/20 text-gray-600',
          icon: AlertCircle,
          progress: 0,
          description: 'Status unknown'
        };
    }
  };

  const getProjectTypeIcon = (type) => {
    switch (type) {
      case 'website': return '🌐';
      case 'web_app': return '💻';
      case 'ecommerce': return '🛍️';
      case 'mobile_app': return '📱';
      case 'redesign': return '🎨';
      default: return '✨';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // The previous conditional rendering for `showFullAnalysis` has been removed.
  // Full analysis is now accessed via a dedicated route.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Projects</h1>
              </div>
              <p className="text-slate-600 text-sm sm:text-base">
                Welcome back, {currentUser?.full_name || 'there'}! Track your projects and communicate with our team.
              </p>
            </div>
            <Link to={createPageUrl("StartProject")}>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          /* Empty State */
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 sm:w-12 h-10 sm:h-12 text-indigo-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Ready to start your first project?</h3>
              <p className="text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                Our AI-powered team is ready to bring your vision to life. Start by chatting with our AI assistant.
              </p>
              <Link to={createPageUrl("StartProject")}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                  <Zap className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Start Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Projects Grid */
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Projects List */}
            <div className="lg:col-span-1 space-y-4">
              {projects.map((project) => {
                const statusInfo = getStatusInfo(project.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card
                    key={project.id}
                    className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                      selectedProject?.id === project.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-2xl flex-shrink-0">
                            {getProjectTypeIcon(project.project_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
                              {project.company_name ? `${project.company_name} Project` : 'My Project'}
                            </h3>
                            <p className="text-slate-600 text-sm line-clamp-2 mb-2">
                              {project.project_description?.substring(0, 80)}...
                            </p>
                          </div>
                        </div>

                        <Badge className={`${statusInfo.color} flex items-center gap-1 text-xs whitespace-nowrap ml-2`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {/* Progress Section */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-700">Progress</span>
                          <span className="text-xs text-slate-500">{statusInfo.progress}%</span>
                        </div>
                        <Progress value={statusInfo.progress} className="h-1.5" />
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.created_date).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Project Details */}
            <div className="lg:col-span-2">
              {selectedProject ? (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-indigo-600" />
                        Project Details
                      </CardTitle>
                      <div className="flex gap-2">
                        {selectedProject.ai_analysis && (
                          <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}`}>
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm hover:from-purple-600 hover:to-pink-600">
                              <FileText className="w-4 h-4 mr-2" />
                              View Professional Report
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Project Overview */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Project Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Type:</span>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {selectedProject.project_type?.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          {selectedProject.budget_range && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Budget:</span>
                              <span className="text-slate-600">{selectedProject.budget_range.replace('_', ' ')}</span> {/* Replaced '-' with ' ' */}
                            </div>
                          )}
                          {selectedProject.timeline && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Timeline:</span>
                              <span className="text-slate-600">{selectedProject.timeline}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Current Status</h4>
                        <div className="space-y-3">
                          {getStatusInfo(selectedProject.status).description && (
                            <p className="text-sm text-slate-600">
                              {getStatusInfo(selectedProject.status).description}
                            </p>
                          )}
                          <Progress value={getStatusInfo(selectedProject.status).progress} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis Quick Preview */}
                    {selectedProject.ai_analysis && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-purple-600" />
                            <h4 className="font-semibold text-slate-900">AI Analysis Preview</h4> {/* Changed heading */}
                          </div>
                          <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700"
                            >
                              View Full Professional Report → {/* Changed text */}
                            </Button>
                          </Link>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                          {/* Directly rendering the preview instead of using AIAnalysisReport component */}
                          <div className="prose prose-sm max-w-none text-slate-700">
                            {selectedProject.ai_analysis.split('\n').slice(0, 3).map((paragraph, index) => (
                              paragraph.trim() ? ( // Ensure paragraph is not empty after trim
                                <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
                              ) : null
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-purple-200">
                            <Link to={`${createPageUrl("ProjectReport")}?id=${selectedProject.id}`}>
                              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Open Professional Report
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Communication */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                        Communication
                      </h4>

                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-slate-500">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No messages yet. Start the conversation!</p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div 
                              key={message.id}
                              className={`p-4 rounded-lg ${
                                message.sender_type === 'user' 
                                  ? 'bg-indigo-50 ml-8' 
                                  : 'bg-slate-50 mr-8'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  message.sender_type === 'user' 
                                    ? 'bg-indigo-500' 
                                    : 'bg-slate-500'
                                }`}>
                                  {message.sender_type === 'user' ? (
                                    <Users className="w-3 h-3 text-white" />
                                  ) : (
                                    <MessageSquare className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className="text-sm font-medium text-slate-900">
                                  {message.sender_type === 'user' ? 'You' : 'Feelize Team'}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {new Date(message.created_at).toLocaleDateString()} at{' '}
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700">{message.content}</p>
                              {message.attachments?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {message.attachments.map((attachment, index) => (
                                    <a
                                      key={index}
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 bg-white px-2 py-1 rounded border border-indigo-200"
                                    >
                                      <FileText className="w-3 h-3" />
                                      {attachment.name}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message to our team..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                          rows={3}
                          disabled={isSendingMessage}
                        />
                        <Button
                          size="sm"
                          disabled={!newMessage.trim() || isSendingMessage}
                          className="self-end bg-indigo-600 hover:bg-indigo-700"
                          onClick={async () => {
                            if (!selectedProject || !newMessage.trim()) return;
                            
                            setIsSendingMessage(true);
                            try {
                              const sentMessage = await messagesApi.send(selectedProject.id, newMessage.trim());
                              setMessages(prev => [...prev, sentMessage]);
                              setNewMessage(""); // Clear input after sending
                            } catch (error) {
                              console.error("Error sending message:", error);
                              // You might want to show an error toast here
                            } finally {
                              setIsSendingMessage(false);
                            }
                          }}
                        >
                          {isSendingMessage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Project</h3>
                    <p className="text-slate-600 text-sm">Choose a project from the list to view details and communicate with our team</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{projects.length}</h3>
                <p className="text-slate-600 text-sm">Total Projects</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {projects.filter(p => p.status === 'in_progress').length}
                </h3>
                <p className="text-slate-600 text-sm">Active Projects</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {projects.filter(p => p.status === 'completed').length}
                </h3>
                <p className="text-slate-600 text-sm">Awaiting Review</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
