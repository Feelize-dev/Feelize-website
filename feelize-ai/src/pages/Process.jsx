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

  const backgroundBlurs = [
    { left: '10%', top: '-200px' },
    { left: '70%', top: '-100px' },
    { left: '-142px', top: '1000px' },
    { left: '864px', top: '1500px' },
    { left: '191px', top: '800px' },
    { left: '1226px', top: '1200px' },
  ];
  
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
    <div className="min-h-screen bg-[#0A0E14] text-white relative">
      {/* Fixed Background with Gradient Ellipses */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {backgroundBlurs.map((pos, i) => (
          <div
            key={i}
            className="absolute w-[542px] h-[494px] rounded-full blur-[75px]"
            style={{
              left: pos.left,
              top: pos.top,
              background: 'rgba(80, 0, 181, 0.67)',
              opacity: 0.25
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-sm sm:text-base md:text-lg rounded-full bg-transparent border-none mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              ✨ AI-Optimized Workflow
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] mb-4 sm:mb-6 px-4">
              Our Process,<br />
              <span className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent">AI-Supercharged</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl mx-auto px-4">
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
            <div className="hidden sm:flex justify-center mb-12">
              <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30">
                {phases.map((phase, index) => (
                  <button
                    key={phase.phase}
                    onClick={() => setActivePhase(index)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 text-base font-['Geist'] ${
                      activePhase === index
                        ? 'bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-purple-500/20'
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
              <Card className="bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30" />
                <CardContent className="relative p-6 sm:p-8 md:p-10 lg:p-12">
                  
                  {/* Mobile Navigation Arrows */}
                  <div className="flex sm:hidden justify-between items-center mb-6">
                    <button
                      onClick={prevPhase}
                      className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center text-white hover:bg-purple-600/30 transition-colors border border-purple-500/30"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                      <span className="text-purple-400 text-sm font-medium font-['Geist']">
                        {activePhase + 1} / {phases.length}
                      </span>
                    </div>
                    <button
                      onClick={nextPhase}
                      className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center text-white hover:bg-purple-600/30 transition-colors border border-purple-500/30"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#0580E8] to-[#7000FF] rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6">
                      {React.createElement(phases[activePhase].icon, { className: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" })}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 font-['Bricolage_Grotesque']">
                      {phases[activePhase].title}
                    </h3>
                    <Badge className="bg-purple-600/20 text-purple-300 text-xs sm:text-sm border border-purple-500/30 font-['Geist']">
                      {phases[activePhase].duration}
                    </Badge>
                  </div>

                  <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 text-center leading-relaxed font-['Geist']">
                    {phases[activePhase].description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                        <h4 className="text-lg font-bold text-white font-['Bricolage_Grotesque']">AI Boost</h4>
                      </div>
                      <p className="text-purple-400 font-semibold text-lg font-['Geist']">{phases[activePhase].aiBoost}</p>
                    </div>

                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-purple-400" />
                        <h4 className="text-lg font-bold text-white font-['Bricolage_Grotesque']">Key Benefits</h4>
                      </div>
                      <ul className="space-y-2">
                        {phases[activePhase].benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center justify-center sm:justify-start gap-2 text-gray-300 text-base font-['Geist']">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
            <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0580E8] to-[#7000FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 font-['Bricolage_Grotesque']">60%</h3>
              <p className="text-gray-300 text-base font-['Geist']">Faster Delivery</p>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0580E8] to-[#7000FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 font-['Bricolage_Grotesque']">40%</h3>
              <p className="text-gray-300 text-base font-['Geist']">Higher Accuracy</p>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0580E8] to-[#7000FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 font-['Bricolage_Grotesque']">35%</h3>
              <p className="text-gray-300 text-base font-['Geist']">Cost Savings</p>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30" />
              <div className="relative">
                <h2 className="text-5xl font-bold text-white mb-6 font-['Bricolage_Grotesque']">
                  Ready to Experience 
                  <span className="block bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent mt-2">AI-Supercharged Development?</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-['Geist']">
                  See how our AI-optimized process can bring your vision to life faster and more cost-effectively than ever before.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:from-[#0580E8]/90 hover:to-[#7000FF]/90 text-white font-bold px-12 py-6 text-lg rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 font-['Bricolage_Grotesque']">
                    Start with our AI Assistant
                    <ArrowRight className="w-5 h-5 ml-3" />
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