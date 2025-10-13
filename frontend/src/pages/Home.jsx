
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/api/integrations";
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Users,
  FastForward,
  Check,
  Loader2,
  Tag,
  UploadCloud,
  X,
  Palette,
  Code2,
  Zap,
  Target,
  Rocket,
  ChevronRight,
  Play,
  TrendingUp,
  Award, // New import
  Heart, // New import
  Quote, // New import
  Star // New import
} from "lucide-react";

// Interactive AI Demo Component with stunning visuals
const AiDemo = () => {
  const [demoText, setDemoText] = useState("");
  const [demoFile, setDemoFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef(null);

  const handleAnalysis = async () => {
    if (!demoText && !demoFile) return;
    setIsAnalyzing(true);
    setAnalysisResult([]);
    setShowResults(false);

    let promptContent = demoText;
    if (demoFile) {
      promptContent += `\n\nFile: ${demoFile.name} - likely contains visual mockups or design inspiration.`;
    }

    const prompt = `
      Analyze this project description and extract key actionable insights.
      Return exactly 6 strings representing: technologies, features, design elements, or business requirements.
      
      Description: "${promptContent}"
    `;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "array",
          items: { type: "string" },
        },
      });
      setAnalysisResult(result.slice(0, 6));
      setShowResults(true);
    } catch (e) {
      setAnalysisResult(["Modern Design", "Responsive Layout", "User Experience", "Performance", "Security", "Analytics"]);
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDemoFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
      
      <Card className="relative glass-morphism border border-white/20 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        
        <CardContent className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/25">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white gradient-text">AI Vision Analyzer</h3>
              <p className="text-slate-400 text-sm">Watch our AI extract insights in real-time</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <Textarea
                placeholder="Describe your dream project... 'I want a sleek e-commerce platform for luxury watches with AR try-on features, premium animations, and seamless checkout...'"
                className="bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-2xl p-4 min-h-32 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">Live Demo</Badge>
              </div>
            </div>

            <div
              className="relative border-2 border-dashed border-slate-600/50 rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-cyan-400/50 transition-all duration-300 group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setDemoFile(e.target.files[0])}
                accept="image/*,.pdf,.txt,.docx"
              />
              
              {demoFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-xl">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-white font-medium text-sm">{demoFile.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDemoFile(null); }}
                    className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400 hover:text-red-400"/>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300">
                    <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Drop your inspiration here</p>
                    <p className="text-slate-400 text-xs">Images, PDFs, documents welcome</p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleAnalysis} 
              disabled={isAnalyzing || (!demoText && !demoFile)}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold py-3 sm:py-4 rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base sm:text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>

          {/* Results Animation */}
          {showResults && analysisResult.length > 0 && (
            <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h4 className="text-base sm:text-lg font-bold text-white">AI Insights Extracted</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {analysisResult.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-600/30 animate-in slide-in-from-left-2 duration-500"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="p-1.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
                      {tag.toLowerCase().includes('design') || tag.toLowerCase().includes('ui') ? 
                        <Palette className="w-3 h-3 text-white" /> : 
                        <Code2 className="w-3 h-3 text-white" />
                      }
                    </div>
                    <span className="text-white text-sm font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Floating 3D Cards Component
const FloatingCard = ({ children, delay = 0, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`transform transition-all duration-700 hover:scale-105 ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        transform: isHovered ? 'rotateX(5deg) rotateY(5deg)' : 'rotateX(0deg) rotateY(0deg)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    { 
      icon: Zap, 
      title: "Lightning Fast", 
      description: "AI acceleration reduces project time by 60%" 
    },
    { 
      icon: Target, 
      title: "Precision Perfect", 
      description: "AI analysis ensures 99% requirement accuracy" 
    },
    { 
      icon: TrendingUp, 
      title: "Cost Effective", 
      description: "Save 40% compared to traditional agencies" 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="relative">
      {/* Hero Section with Animated Elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-slate-800/50 rounded-full border border-cyan-500/30 mb-6 sm:mb-8 backdrop-blur-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 text-xs sm:text-sm font-medium">AI-Powered Development • Live Now</span>
            </div>

            {/* Main Headline with Animated Gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight">
              <span className="block text-white">Expert Quality,</span>
              <span className="block gradient-text animate-in slide-in-from-bottom-6 duration-1000 delay-300">
                AI Speed.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-1000 delay-500 px-4">
              Our <span className="text-cyan-400 font-semibold">professional team</span>, trained to leverage the maximum potential of AI, delivers your project 
              <span className="text-purple-400 font-semibold"> faster</span> and more 
              <span className="text-pink-400 font-semibold"> cost-effectively</span>. Get the best of both worlds.
            </p>
            
            {/* CTA Buttons with Hover Effects */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-in slide-in-from-bottom-2 duration-1000 delay-700 px-4">
              <Link to={createPageUrl("StartProject")}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 neon-glow group">
                  <Play className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                  Start with AI Assistant
                </Button>
              </Link>
              
              <Link to={createPageUrl("About")} className="flex items-center text-slate-300 hover:text-cyan-400 font-medium group transition-all duration-300">
                <span className="text-sm sm:text-base">Meet Our AI-Powered Team</span>
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Animated Feature Stats */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 mt-12 sm:mt-16 animate-in slide-in-from-bottom duration-1000 delay-1000 px-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    activeFeature === index ? 'scale-110 opacity-100' : 'scale-100 opacity-60'
                  }`}
                >
                  <div className={`w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    activeFeature === index 
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30' 
                      : 'bg-slate-800'
                  }`}>
                    <feature.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Problem/Solution Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8">
              The Old Way is Broken.
              <span className="block gradient-text mt-2 sm:mt-4">We Built a Better Way.</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Stop choosing between speed, quality, and cost. Get all three.
            </p>
          </div>

          {/* New Asymmetrical Layout */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            
            {/* The "Old Way" - Stacked Problem Cards */}
            <div className="space-y-6 sm:space-y-8">
              <FloatingCard delay={100}>
                <Card className="h-full glass-morphism border border-red-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 group transition-all duration-300 hover:border-red-400/50">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-red-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-red-500/20 flex-shrink-0">
                      <X className="w-6 sm:w-8 h-6 sm:h-8 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Traditional Agencies</h3>
                      <p className="text-slate-400 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">High quality, but painfully slow and expensive. Projects drag on for months.</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-900/50 text-red-300 border-red-500/30 text-xs">Slow Delivery</Badge>
                        <Badge className="bg-red-900/50 text-red-300 border-red-500/30 text-xs">High Cost</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </FloatingCard>

              <FloatingCard delay={200}>
                <Card className="h-full glass-morphism border border-yellow-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 group transition-all duration-300 hover:border-yellow-400/50">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-yellow-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-yellow-500/20 flex-shrink-0">
                      <Users className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Freelancers</h3>
                      <p className="text-slate-400 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">Affordable, but a total gamble on quality, reliability, and communication.</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-yellow-900/50 text-yellow-300 border-yellow-500/30 text-xs">Inconsistent Quality</Badge>
                        <Badge className="bg-yellow-900/50 text-yellow-300 border-yellow-500/30 text-xs">Unreliable</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </FloatingCard>
            </div>
            
            {/* The "New Way" - The Feelize Model Card */}
            <FloatingCard delay={300} className="h-full">
              <Card className="h-full bg-gradient-to-br from-slate-50 to-slate-200 border-2 border-white/50 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xl shadow-cyan-500/20">
                <div className="absolute -bottom-20 -right-20 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-tr from-cyan-400/50 via-blue-500/50 to-purple-600/50 rounded-full blur-3xl opacity-60" />
                <CardContent className="p-6 sm:p-10 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-2xl shadow-cyan-500/40">
                      <Rocket className="w-8 sm:w-12 h-8 sm:h-12 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-3 sm:mb-4">The Feelize Model</h3>
                    <p className="text-slate-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">We deliver the impossible: premium quality, lightning speed, and affordable pricing. All powered by our AI-augmented team.</p>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                          <Check className="w-3 sm:w-5 h-3 sm:h-5 text-green-600" />
                        </div>
                        <span className="text-slate-800 font-semibold text-sm sm:text-lg">Premium Agency Quality</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                          <Check className="w-3 sm:w-5 h-3 sm:h-5 text-green-600" />
                        </div>
                        <span className="text-slate-800 font-semibold text-sm sm:text-lg">AI-Accelerated Speed</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                          <Check className="w-3 sm:w-5 h-3 sm:h-5 text-green-600" />
                        </div>
                        <span className="text-slate-800 font-semibold text-sm sm:text-lg">Unbeatable Value</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link to={createPageUrl("StartProject")} className="mt-8 sm:mt-10">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-700 font-bold py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-105 transition-all duration-300">
                      Experience the Difference
                      <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 ml-2 sm:ml-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FloatingCard>
          </div>

          {/* AI Demo Section - Separated and Improved */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mt-20 sm:mt-32 mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                See Our AI in Action
              </h2>
              <p className="text-lg sm:text-xl text-slate-300">
                Experience how our AI analyzes your project ideas in real-time
              </p>
            </div>
            <AiDemo />
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-slate-800/50 rounded-full border border-purple-500/30 mb-6 sm:mb-8 backdrop-blur-xl">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-xs sm:text-sm font-medium">Real Results • Real Projects</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Projects That Speak for Themselves
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              See how our AI-powered approach has transformed businesses across industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {[
              {
                title: "LuxWatch E-commerce",
                category: "E-commerce",
                result: "300% increase in conversions",
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "TechStartup SaaS Dashboard",
                category: "SaaS Platform",
                result: "5000+ active users",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Green Energy Campaign",
                category: "Campaign Site",
                result: "400% increase in leads",
                image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop",
                color: "from-green-500 to-emerald-500"
              }
            ].map((project, index) => (
              <FloatingCard key={index} delay={index * 100}>
                <Card className="glass-morphism border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-cyan-400/30 transition-all duration-500 hover:scale-[1.02] group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardContent className="relative p-0">
                    <div className="relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-40 sm:h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <Badge className={`bg-gradient-to-r ${project.color} text-white border-0 text-xs`}>
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold text-xs sm:text-sm">{project.result}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FloatingCard>
            ))}
          </div>

          <div className="text-center">
            <Link to={createPageUrl("Work")}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
                View All Projects
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-slate-800/50 rounded-full border border-yellow-500/30 mb-6 sm:mb-8 backdrop-blur-xl">
              <Heart className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs sm:text-sm font-medium">Client Love • Proven Results</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              What Our Clients Are Saying
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what business leaders say about working with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {[
              {
                name: "Sarah Mitchell",
                role: "CEO, TechFlow Innovations",
                quote: "Feelize delivered beyond our wildest expectations. Their AI-powered approach cut our development time in half while maintaining premium quality.",
                result: "500% increase in user engagement",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
                rating: 5
              },
              {
                name: "Marcus Rodriguez",
                role: "Founder, EcoMarket Pro",
                quote: "Working with Feelize was a game-changer for our business. Their AI integration helped us achieve conversion rates we never thought possible.",
                result: "300% increase in sales",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                rating: 5
              },
              {
                name: "Emily Chen",
                role: "Marketing Director, HealthFirst",
                quote: "The speed and quality of delivery was incredible. We could launch our campaign weeks ahead of schedule with results that exceeded all our KPIs.",
                result: "450% increase in qualified leads",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                rating: 5
              }
            ].map((testimonial, index) => (
              <FloatingCard key={index} delay={index * 150}>
                <Card className="h-full glass-morphism border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-cyan-400/30 transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex-1">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 sm:w-4 h-3 sm:h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <Quote className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400 mb-4 opacity-50" />
                      
                      <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                          <p className="text-slate-400 text-xs">{testimonial.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs py-1 px-3">
                          {testimonial.result}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FloatingCard>
            ))}
          </div>

          <div className="text-center">
            <Link to={createPageUrl("Testimonials")}>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105">
                Read More Reviews
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA with Particle Effect */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900/20 to-purple-900/20" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8 animate-in slide-in-from-bottom-4 duration-1000">
            Ready to feel the 
            <span className="block gradient-text mt-2">difference?</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-12 max-w-2xl mx-auto animate-in slide-in-from-bottom-2 duration-1000 delay-200">
            Start a conversation with our AI assistant. It's the first step to a better, more intelligent development journey.
          </p>
          
          <Link to={createPageUrl("StartProject")}>
            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 hover:from-purple-400 hover:via-pink-400 hover:to-cyan-300 text-white px-12 sm:px-16 py-6 sm:py-8 text-lg sm:text-xl font-bold rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-500 hover:scale-110 animate-in slide-in-from-bottom duration-1000 delay-500">
              <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 animate-pulse" />
              Chat With Our AI Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
