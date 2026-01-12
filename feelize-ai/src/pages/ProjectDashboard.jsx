import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Project, Task, ActivityLog, Engineer, User } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import { Loader2, ArrowLeft, MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectTabs from '@/components/project/ProjectTabs';
import ReportViewer from '@/components/project/ReportViewer';
import { motion, AnimatePresence } from 'framer-motion';

// AI Chatbot Component
const ProjectChatbot = ({ project, userRole }) => {
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
      // Add welcome message when chat opens for the first time
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
        
        ${project.ai_analysis ? `AI ANALYSIS:\n${project.ai_analysis}` : ''}
        
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
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to reach out to your project team directly via the Activity tab."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed  bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-110 z-50"
          >
            <MessageCircle className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200"
          >
            {/* Header */}
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

            {/* Messages */}
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

            {/* Input */}
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

export default function ProjectDashboard() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [team, setTeam] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('client');
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const getProjectId = () => {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  };

  const loadProjectData = useCallback(async () => {
    const projectId = getProjectId();
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    try {
      const [projRes, projTasksRes, projActivitiesRes, user] = await Promise.all([
        Project.get(projectId),
        Task.filter({ project_id: projectId, sort: '-created_date' }),
        ActivityLog.filter({ project_id: projectId, sort: '-created_date', limit: 50 }),
        User.me(),
      ]);

      const proj = projRes.data || projRes;
      const projTasks = projTasksRes.data || [];
      const projActivities = projActivitiesRes.data || [];

      setProject(proj);
      setTasks(projTasks);
      setActivities(projActivities);
      setCurrentUser(user);

      // Determine user role for this project
      if (user && user.email === 'admin@feelize.ai') {
        setUserRole('admin');
      } else if (user && proj.assigned_team?.includes(user.email)) {
        setUserRole('engineer');
      } else {
        setUserRole('client');
      }

      // Load full team details
      if (proj.assigned_team && proj.assigned_team.length > 0) {
        const engineerDetailsRes = await Engineer.filter({ email: { '$in': proj.assigned_team } });
        setTeam(engineerDetailsRes.data || []);
      }

    } catch (error) {
      console.error("Failed to load project data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  const handleCreateActivity = async (activityData) => {
    try {
      const newActivityRes = await ActivityLog.create({
        ...activityData,
        project_id: project.id || project._id,
        user_email: currentUser.email,
        user_name: currentUser.displayName || currentUser.email,
        user_role: userRole,
      });
      const newActivity = newActivityRes.data || newActivityRes;
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen  bg-slate-50 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Project Not Found</h2>
        <p className="text-slate-600 mb-6">The project you are looking for does not exist or you do not have permission to view it.</p>
        <Link to={createPageUrl("UserDashboard")}>
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 mt-[120px]">
      <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <ProjectHeader project={project} userRole={userRole} />
        <main className="mt-8">
          <ProjectTabs
            project={project}
            tasks={tasks}
            activities={activities}
            team={team}
            currentUser={currentUser}
            userRole={userRole}
            onTaskUpdate={loadProjectData}
            onActivityCreate={handleCreateActivity}
            ReportViewerComponent={<ReportViewer project={project} userRole={userRole} />}
          />
        </main>
      </div>

      {/* AI Chatbot - Only visible to clients */}
      {userRole === 'client' && <ProjectChatbot project={project} userRole={userRole} />}
    </div>
  );
}