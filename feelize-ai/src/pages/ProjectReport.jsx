import React, { useState, useEffect, useCallback } from "react";
import { Project } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Target,
  TrendingUp,
  MessageCircle,
  Send,
  X,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';

// AI Chatbot Component
const ProjectChatbot = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm your AI project assistant. I'm here to answer any questions you have about your ${project.project_type} project. Feel free to ask me about timelines, features, team members, or anything else related to your project!`
      }]);
    }
  }, [isOpen, messages.length, project.project_type]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const projectContext = `
        You are an AI assistant helping a client understand their software development project with Feelize.
        
        PROJECT DETAILS:
        - Project Type: ${project.project_type}
        - Company: ${project.company_name || 'Not specified'}
        - Description: ${project.project_description}
        - Budget Range: ${project.budget_range || 'Not specified'}
        - Timeline: ${project.timeline || 'Not specified'}
        - Status: ${project.status}
        - Key Features: ${project.key_features?.join(', ') || 'Not specified'}
        - Target Audience: ${project.target_audience || 'Not specified'}
        - Design Preferences: ${project.design_preferences || 'Not specified'}
        ${project.estimated_hours ? `- Estimated Hours: ${project.estimated_hours}` : ''}
        ${project.recommended_price ? `- Recommended Price: $${project.recommended_price}` : ''}
        ${project.complexity_score ? `- Complexity Score: ${project.complexity_score}/10` : ''}
        ${project.assigned_team?.length > 0 ? `- Assigned Team: ${project.assigned_team.join(', ')}` : '- Team: Being assembled'}
        
        ${project.professional_report_html ? 'A detailed project proposal has been generated and is available to the client.' : ''}
        
        INSTRUCTIONS:
        - Be friendly, helpful, and professional
        - Provide clear, concise answers about the project
        - If asked about timelines, refer to the project status and estimated hours
        - If asked about features, reference the key features list
        - If you don't have specific information, be honest and suggest they contact the team
        - Keep responses under 100 words unless more detail is specifically requested
        - Never make up information not provided in the context
        
        Client's question: "${userMessage}"
        
        Provide a helpful response:
      `;

      const response = await InvokeLLM({
        prompt: projectContext,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to reach out to your project team directly."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-110 z-50"
          >
            <MessageCircle className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Project Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-white/80 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-900 border border-slate-200'
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your project..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function ProjectReportPage() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const getProjectId = () => {
    const params = new URLSearchParams(location.search);
    return params.get("id");
  };

  const loadProject = useCallback(async () => {
    const projectId = getProjectId();
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    try {
      const projectRes = await Project.get(projectId);
      setProject(projectRes.data || projectRes);
    } catch (error) {
      console.error("Failed to load project:", error);
    } finally {
      setIsLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleDownloadReport = (markdownContent, projectName) => {
    if (!markdownContent) return;

    // Create a temporary container with the rendered markdown
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div class="markdown-content">${markdownContent.replace(/\n/g, '<br>')}</div>
      </div>
    `;

    // PDF options
    const opt = {
      margin: 1,
      filename: `${(projectName || "Project").replace(/\s+/g, "-")}-Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().set(opt).from(tempDiv).save();
  };

  const getStatusInfo = (status) => {
    const statuses = {
      draft: { label: "Draft", color: "bg-slate-500/20 text-slate-600", icon: FileText },
      completed: { label: "Under Review", color: "bg-blue-500/20 text-blue-600", icon: Clock },
      contacted: { label: "Proposal Sent", color: "bg-purple-500/20 text-purple-600", icon: CheckCircle },
      in_progress: { label: "In Development", color: "bg-green-500/20 text-green-600", icon: TrendingUp },
      delivered: { label: "Delivered", color: "bg-emerald-500/20 text-emerald-600", icon: CheckCircle },
      cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-600", icon: X },
    };
    return statuses[status] || { label: "Unknown", color: "bg-gray-500/20 text-gray-600", icon: FileText };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Project Not Found</h2>
        <p className="text-slate-600 mb-6">The project you are looking for does not exist.</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(project.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <statusInfo.icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.company_name || "Your Project"}</h1>
          <Badge className={`${statusInfo.color} text-sm px-4 py-1`}>{statusInfo.label}</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl flex flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Project Proposal
                </CardTitle>
                {project.professional_report_html && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleDownloadReport(project.professional_report_html, project.company_name)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {project.professional_report_html ? (
                  <div className="prose prose-slate max-w-none border rounded-lg p-8 bg-white markdown-report">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.professional_report_html}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 animate-spin" />
                    <p className="text-lg font-medium">Your proposal is being prepared...</p>
                    <p className="text-sm mt-2">Our team will have it ready for you shortly.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Project Type</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    {project.project_type?.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                {project.budget_range && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Budget Range</h4>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-slate-700">{project.budget_range.replace("_", " ")}</span>
                    </div>
                  </div>
                )}

                {project.timeline && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Timeline</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-700">{project.timeline}</span>
                    </div>
                  </div>
                )}

                {project.target_audience && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Target Audience</h4>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-600" />
                      <span className="text-slate-700">{project.target_audience}</span>
                    </div>
                  </div>
                )}

                {project.assigned_team && project.assigned_team.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Assigned Team</h4>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-600" />
                      <span className="text-slate-700">{project.assigned_team.length} member(s)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Project Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-700">Project analysis completed</span>
                  </div>

                  <div className={`flex items-center gap-3 p-3 rounded-lg ${project.status === "contacted" || project.status === "in_progress" || project.status === "delivered"
                    ? "bg-green-50"
                    : "bg-yellow-50"
                    }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${project.status === "contacted" || project.status === "in_progress" || project.status === "delivered"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                      }`}>
                      {project.status === "contacted" || project.status === "in_progress" || project.status === "delivered" ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <span className="text-white text-xs font-bold">2</span>
                      )}
                    </div>
                    <span className="text-sm text-slate-700">
                      {project.professional_report_html ? "Proposal delivered" : "Awaiting proposal"}
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 p-3 rounded-lg ${project.status === "in_progress" || project.status === "delivered"
                    ? "bg-green-50"
                    : "bg-slate-50"
                    }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${project.status === "in_progress" || project.status === "delivered"
                      ? "bg-green-500"
                      : "bg-slate-300"
                      }`}>
                      {project.status === "in_progress" || project.status === "delivered" ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <span className="text-white text-xs font-bold">3</span>
                      )}
                    </div>
                    <span className={`text-sm ${project.status === "in_progress" || project.status === "delivered"
                      ? "text-slate-700"
                      : "text-slate-500"
                      }`}>
                      Development in progress
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ProjectChatbot project={project} />
    </div>
  );
}