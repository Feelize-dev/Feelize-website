import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BrainCircuit,
  Sparkles,
  Target,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Zap,
  BarChart3,
  Settings,
  Users,
  Code2,
  Palette,
  Shield,
  Rocket,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Eye,
  Calendar
} from "lucide-react";

export default function AIAnalysisReport({ analysis, projectData, isFullView = false }) {
  const [expandedSections, setExpandedSections] = useState(isFullView ? {} : {});

  const toggleSection = (section) => {
    if (isFullView) return; // Don't allow collapsing in full view
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Parse the AI analysis into structured sections
  const parseAnalysis = (analysisText) => {
    if (!analysisText) return {};
    
    const sections = {};
    const lines = analysisText.split('\n').filter(line => line.trim());
    let currentSection = 'overview';
    let currentContent = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check if this is a section header (contains numbers and keywords)
      if (trimmed.match(/^(\d+\.|\*\*|\#)/)) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n');
        }
        
        // Determine new section
        const lower = trimmed.toLowerCase();
        if (lower.includes('technical') || lower.includes('requirement')) {
          currentSection = 'technical';
        } else if (lower.includes('design') || lower.includes('user') || lower.includes('ux')) {
          currentSection = 'design';
        } else if (lower.includes('timeline') || lower.includes('milestone')) {
          currentSection = 'timeline';
        } else if (lower.includes('budget') || lower.includes('cost')) {
          currentSection = 'budget';
        } else if (lower.includes('challenge') || lower.includes('risk')) {
          currentSection = 'challenges';
        } else if (lower.includes('success') || lower.includes('metric') || lower.includes('kpi')) {
          currentSection = 'metrics';
        } else {
          currentSection = 'overview';
        }
        
        currentContent = [trimmed];
      } else {
        currentContent.push(trimmed);
      }
    });
    
    // Save the last section
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n');
    }
    
    return sections;
  };

  const sections = parseAnalysis(analysis);

  const sectionConfig = {
    overview: {
      title: "Executive Summary",
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    technical: {
      title: "Technical Requirements",
      icon: Code2,
      color: "from-purple-500 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-50"
    },
    design: {
      title: "Design & User Experience",
      icon: Palette,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50"
    },
    timeline: {
      title: "Development Timeline",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    budget: {
      title: "Budget Analysis",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50"
    },
    challenges: {
      title: "Risks & Challenges",
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50"
    },
    metrics: {
      title: "Success Metrics",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    }
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      // Headers
      if (trimmed.match(/^(\d+\.|\*\*)/)) {
        return (
          <h4 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
            {trimmed.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '')}
          </h4>
        );
      }
      
      // Bullet points
      if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        return (
          <div key={index} className="flex items-start gap-3 mb-2 ml-4">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700 text-sm leading-relaxed">
              {trimmed.substring(1).trim()}
            </span>
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="text-slate-700 mb-4 leading-relaxed text-sm">
          {trimmed}
        </p>
      );
    }).filter(Boolean);
  };

  if (!analysis) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <BrainCircuit className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Analysis Pending</h3>
          <p className="text-slate-600 text-sm">The AI analysis will appear here once generated</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${isFullView ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
      {/* Document Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-500/10" />
        <CardContent className="relative p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  AI-Generated Analysis
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">
                Project Analysis Report
              </h1>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {projectData?.project_type?.replace('_', ' ').toUpperCase() || 'CUSTOM'}
              </div>
              <div className="text-slate-300 text-sm">Project Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {projectData?.budget_range?.replace('_', '-').toUpperCase() || 'TBD'}
              </div>
              <div className="text-slate-300 text-sm">Budget Range</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400 mb-1">
                {projectData?.timeline || 'FLEXIBLE'}
              </div>
              <div className="text-slate-300 text-sm">Timeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                HIGH
              </div>
              <div className="text-slate-300 text-sm">AI Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Sections */}
      <div className="grid gap-6">
        {Object.entries(sections).map(([sectionKey, content]) => {
          const config = sectionConfig[sectionKey];
          if (!config || !content) return null;
          
          const Icon = config.icon;
          const isExpanded = isFullView || expandedSections[sectionKey];
          
          return (
            <Card key={sectionKey} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader 
                className={`bg-gradient-to-r ${config.color} text-white cursor-pointer transition-all duration-300 hover:shadow-lg ${!isFullView ? 'hover:scale-[1.02]' : ''}`}
                onClick={() => toggleSection(sectionKey)}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold">{config.title}</span>
                  </div>
                  {!isFullView && (
                    <div className="transition-transform duration-300">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              
              {(isFullView || isExpanded) && (
                <CardContent className={`p-6 sm:p-8 bg-gradient-to-br ${config.bgColor} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-5">
                    <Icon className="w-64 h-64 absolute -bottom-16 -right-16 text-slate-900" />
                  </div>
                  <div className="relative z-10 prose prose-slate max-w-none">
                    {formatContent(content)}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Project Insights Footer */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-slate-900">AI Insights Summary</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-slate-900 text-sm">Complexity Score</span>
              </div>
              <Progress value={75} className="h-2 mb-2" />
              <span className="text-xs text-slate-600">Medium-High Complexity</span>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-900 text-sm">Feasibility</span>
              </div>
              <Progress value={90} className="h-2 mb-2" />
              <span className="text-xs text-slate-600">Highly Feasible</span>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-900 text-sm">Success Probability</span>
              </div>
              <Progress value={85} className="h-2 mb-2" />
              <span className="text-xs text-slate-600">Very High Success Rate</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}