
import React, { useState, useEffect } from "react";
import { Project } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea"; // This import is not used in the final implementation, but was in original file, keeping to preserve structure if it's used elsewhere.
import { Link, useNavigate } from "react-router-dom";
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
  Users, // This import is not used in the final implementation, but was in original file, keeping to preserve structure.
  Loader2,
  Rocket,
  Zap,
  Target,
  Send, // This import is not used in the final implementation, but was in original file, keeping to preserve structure.
  Eye, // This import is not used in the final implementation, but was in original file, keeping to preserve structure.
  BrainCircuit, // This import is not used in the final implementation, but was in original file, keeping to preserve structure.
  ArrowLeft, // This import is not used in the final implementation, but was in original file, keeping to preserve structure.
  Sparkles, // This import is not used in the final implementation, but was in original file, keeping to preserve structure.
  Gift, // NEW: Icon for affiliate section
  ArrowRight // NEW: Icon for navigation
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import axios from "axios";

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

  const navigate = useNavigate()
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [affiliateData, setAffiliateData] = useState(null); // NEW: Track affiliate data
  const [referrals, setReferrals] = useState([]); // NEW: Track referrals
  // selectedProject and showFullAnalysis states were previously removed as project details and full analysis
  // are now handled on a dedicated ProjectDashboard page, accessed via navigation.
  const [newMessage, setNewMessage] = useState(""); // This state is not used in the final implementation, but was in original file, keeping to preserve structure.
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);

      // Fetch projects
      const fetchProjects = async () => {
        try {
          const response = await Project.filter({ sort: '-created_date' });
          if (response.success) {
            setProjects(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        }
      };

      fetchProjects();

      // Fetch affiliate data if not already present
      const fetchAffiliateData = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/affiliates/me`, { withCredentials: true });
          if (res.data.success) {
            setAffiliateData(res.data.data.affiliate);
            setReferrals(res.data.data.referrals);
          }
        } catch (error) {
          // It's okay if 404/error, means user is not an affiliate
          console.log("Not an affiliate or error fetching data");
        }
      };

      // We check if fetchAffiliateData should be called
      fetchAffiliateData();
    }
  }, [user]);

  if (!user) {

    navigate('/')
  }

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
      case 'completed': // This status "completed" now implies "awaiting review" in the UI below.
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
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Dashboard</h1>
              </div>
              <p className="text-slate-600 text-sm sm:text-base">
                Welcome back, {currentUser?.full_name || 'there'}!
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

        {/* NEW: Affiliate Section */}
        {affiliateData && (
          <Card className="border-0 shadow-sm mb-8 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  Your Affiliate Stats
                </CardTitle>
                <Link to={createPageUrl("AffiliateSignup")}>
                  <Button variant="outline" size="sm">
                    View Details
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-slate-600 text-sm mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(affiliateData.total_earnings || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-slate-600 text-sm mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    ${(affiliateData.pending_earnings || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-slate-600 text-sm mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {affiliateData.total_referrals || 0}
                  </p>
                </div>
              </div>

              {referrals.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Referred Projects
                  </h4>
                  <div className="overflow-x-auto bg-white rounded-lg border border-slate-100">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-600 font-medium">
                        <tr>
                          <th className="p-3">Client / Project</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((ref) => (
                          <tr key={ref._id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <div className="font-medium text-slate-900">
                                {ref.project_id?.company_name || ref.project_id?.client_name || 'No Project Started'}
                              </div>
                              {ref.project_id?.project_type && (
                                <div className="text-xs text-slate-500 capitalize">{ref.project_id.project_type.replace('_', ' ')}</div>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="text-slate-900">{ref.referred_user_email}</div>
                              {ref.project_id?.client_name && (
                                <div className="text-xs text-slate-500">{ref.project_id.client_name}</div>
                              )}
                            </td>
                            <td className="p-3 text-slate-600">
                              {new Date(ref.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <Badge className={`text-xs ${ref.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  ref.status === 'converted' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {ref.status.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="p-3 text-right font-medium text-slate-900">
                              {ref.commission_amount ? `$${ref.commission_amount.toLocaleString()}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* NEW: Affiliate CTA if not an affiliate */}
        {!affiliateData && (
          <Card className="border-0 shadow-sm mb-8 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Join Our Affiliate Program</h3>
                    <p className="text-slate-600 text-sm">Earn 10% commission on every referral</p>
                  </div>
                </div>
                <Link to={createPageUrl("AffiliateSignup")}>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

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
                  <Link to={createPageUrl(`ProjectDashboard?id=${project.id}`)} key={project.id}>
                    <Card
                      className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
                    // The previous selectedProject state and onClick handler were removed as clicking now navigates to a new page,
                    // making local state for selection unnecessary on this dashboard.
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
                  </Link>
                );
              })}
            </div>

            {/* Project Details - This section is deprecated for direct display */}
            {/* It now serves as an instructional message, guiding users to navigate to a dedicated project page. */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Project</h3>
                  <p className="text-slate-600 text-sm">Choose a project from the list to view its dedicated dashboard and see the latest updates.</p>
                </CardContent>
              </Card>
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
                  {/* Counts projects with 'completed' status, which maps to 'Under Review' label */}
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
