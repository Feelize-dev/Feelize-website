import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageSquare, 
  FileSearch, 
  HandshakeIcon, 
  Hammer, 
  Rocket,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function ProcessPage() {
  const [activePhase, setActivePhase] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const phases = [
    {
      phase: 1,
      title: "AI-Powered Discovery",
      icon: MessageSquare,
      duration: "5-10 minutes",
      description: "Our AI assistant conducts an intelligent conversation to understand your vision, analyzing your ideas and any files you upload.",
      aiBoost: "90% faster than traditional briefing",
      benefits: ["Instant file analysis", "Smart follow-up questions", "Zero miscommunication"],
      color: "from-cyan-400 to-blue-500"
    },
    {
      phase: 2,
      title: "Human Expert Analysis",
      icon: FileSearch,
      duration: "24-48 hours",
      description: "Our expert team reviews the AI-generated brief to craft a detailed, customized proposal with accurate timelines and pricing.",
      aiBoost: "40% more accurate proposals",
      benefits: ["AI-enhanced insights", "Precise cost estimation", "Technical feasibility check"],
      color: "from-blue-500 to-purple-500"
    },
    {
      phase: 3,
      title: "Smart Agreement",
      icon: HandshakeIcon,
      duration: "1-2 days",
      description: "Finalize the agreement and meet your dedicated project team. We set up your project in our AI-optimized client portal.",
      aiBoost: "Instant project setup",
      benefits: ["Automated documentation", "Team allocation", "Portal configuration"],
      color: "from-purple-500 to-pink-500"
    },
    {
      phase: 4,
      title: "AI-Accelerated Build",
      icon: Hammer,
      duration: "2-8 weeks",
      description: "Our developers, supercharged by AI tools, build your project with unparalleled speed and precision, providing regular updates.",
      aiBoost: "50% faster development",
      benefits: ["AI code generation", "Automated testing", "Real-time optimization"],
      color: "from-pink-500 to-red-500"
    },
    {
      phase: 5,
      title: "Intelligent Launch",
      icon: Rocket,
      duration: "Ongoing",
      description: "We deploy your project and use AI monitoring tools to ensure optimal performance and provide data-driven growth strategies.",
      aiBoost: "3x faster issue detection",
      benefits: ["Smart monitoring", "Performance optimization", "Growth insights"],
      color: "from-red-500 to-orange-500"
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % phases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phases.length, isPaused]);

  const nextPhase = () => {
    setActivePhase((prev) => (prev + 1) % phases.length);
  };

  const prevPhase = () => {
    setActivePhase((prev) => (prev - 1 + phases.length) % phases.length);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-slate-800/50 rounded-full border border-cyan-500/30 mb-6 sm:mb-8 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-xs sm:text-sm font-medium">AI-Optimized Workflow</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6">
              Our Process,
              <span className="block gradient-text">Supercharged</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto px-4">
              We've engineered a process that integrates AI at every stage to maximize efficiency, precision, and value for you.
            </p>
          </div>

          {/* Mobile-First Interactive Process */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            
            {/* Mobile Phase Navigation - Scrollable */}
            <div className="block sm:hidden mb-8">
              <div className="flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide">
                {phases.map((phase, index) => (
                  <button
                    key={phase.phase}
                    onClick={() => setActivePhase(index)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm whitespace-nowrap ${
                      activePhase === index
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg'
                        : 'bg-slate-800/50 text-slate-300 border border-slate-600/30'
                    }`}
                  >
                    Phase {phase.phase}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Phase Navigation */}
            <div className="hidden sm:flex justify-center mb-8 lg:mb-12">
              <div className="flex gap-2 p-2 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-white/10">
                {phases.map((phase, index) => (
                  <button
                    key={phase.phase}
                    onClick={() => setActivePhase(index)}
                    className={`px-4 lg:px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base ${
                      activePhase === index
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Phase {phase.phase}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Phase Display */}
            <div 
              className="max-w-4xl mx-auto"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Card className="glass-morphism border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${phases[activePhase].color} opacity-5`} />
                <CardContent className="relative p-6 sm:p-8 lg:p-12">
                  
                  {/* Mobile Navigation Arrows */}
                  <div className="flex sm:hidden justify-between items-center mb-6">
                    <button
                      onClick={prevPhase}
                      className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                      <span className="text-cyan-400 text-sm font-medium">
                        {activePhase + 1} / {phases.length}
                      </span>
                    </div>
                    <button
                      onClick={nextPhase}
                      className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`inline-flex p-4 sm:p-6 bg-gradient-to-br ${phases[activePhase].color} rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6`}>
                      {React.createElement(phases[activePhase].icon, { className: "w-8 h-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-white" })}
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 px-4">
                      {phases[activePhase].title}
                    </h3>
                    <Badge className="bg-slate-700/50 text-slate-300 text-sm">
                      {phases[activePhase].duration}
                    </Badge>
                  </div>

                  <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 text-center leading-relaxed px-2 sm:px-0">
                    {phases[activePhase].description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-4">
                        <TrendingUp className="w-5 h-5 sm:w-6 h-6 text-green-400" />
                        <h4 className="text-base sm:text-lg font-bold text-white">AI Boost</h4>
                      </div>
                      <p className="text-green-400 font-semibold text-base sm:text-lg">{phases[activePhase].aiBoost}</p>
                    </div>

                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-4">
                        <CheckCircle className="w-5 h-5 sm:w-6 h-6 text-cyan-400" />
                        <h4 className="text-base sm:text-lg font-bold text-white">Key Benefits</h4>
                      </div>
                      <ul className="space-y-2">
                        {phases[activePhase].benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center justify-center sm:justify-start gap-2 text-slate-300 text-sm sm:text-base">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Efficiency Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
            <Card className="glass-morphism border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">60%</h3>
              <p className="text-slate-300 text-sm sm:text-base">Faster Delivery</p>
            </Card>

            <Card className="glass-morphism border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">40%</h3>
              <p className="text-slate-300 text-sm sm:text-base">Higher Accuracy</p>
            </Card>

            <Card className="glass-morphism border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">35%</h3>
              <p className="text-slate-300 text-sm sm:text-base">Cost Savings</p>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-purple-900/50 border border-cyan-400/30 rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-10 lg:p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Experience 
                  <span className="block gradient-text mt-2">AI-Powered Development?</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                  See how our AI-optimized process can bring your vision to life faster and more cost-effectively than ever before.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
                    Start with our AI Assistant
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}