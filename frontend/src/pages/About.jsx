
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Sparkles, 
  Users,
  Code2,
  Palette,
  BrainCircuit,
  Briefcase,
  ArrowRight,
  Heart,
  Target,
  Zap,
  Award,
  CheckCircle,
  Server,
  BarChart3,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState(null);

  const management = [
    {
      name: "Alex Zordel",
      role: "Client Relations Director",
      icon: Users,
      description: "The external-facing voice of Feelize. Alex ensures a seamless client experience from onboarding to final delivery, guaranteeing every client feels understood and valued.",
      aiSuperpower: "AI-Enhanced Client Communication",
      color: "from-cyan-500 to-blue-500",
    },
    {
      name: "navaj.bloch22",
      role: "Director of Internal Operations",
      icon: Briefcase,
      description: "The internal-facing engine of Feelize. Navaj orchestrates our teams and processes, ensuring peak efficiency and cross-functional synergy.",
      aiSuperpower: "AI-Powered Operational Efficiency",
      color: "from-amber-400 to-orange-500",
    },
    {
      name: "Sarah Johnson",
      role: "Operations Manager",
      icon: Award,
      description: "Manages the day-to-day project lifecycle with precision, using AI tools to track progress, allocate resources, and ensure flawless execution.",
      aiSuperpower: "AI Project Intelligence",
      color: "from-lime-400 to-green-500",
    },
  ];

  const coreTeam = [
    // Department leads integrated with core team
    {
      name: "Kalman Greenfield",
      role: "Head of AI Technology",
      icon: BrainCircuit,
      description: "Directs our AI strategy and implements cutting-edge tools across all departments.",
      aiSuperpower: "AI Infrastructure & Innovation",
      color: "from-purple-600 to-indigo-600",
      department: "AI Technology"
    },
    {
      name: "Stewart Johanson",
      role: "Head of Design",
      icon: Palette,
      description: "Leads our creative vision and provides the team with advanced AI-powered design tools.",
      aiSuperpower: "AI-Powered Design Systems",
      color: "from-pink-500 to-rose-500",
      department: "Design Leadership"
    },
    // Developers
    {
      name: "Alex Chen",
      role: "Lead Full-Stack Developer",
      icon: Code2,
      description: "Masters both traditional development and AI-assisted coding. Collaborates closely with designers to create seamless user experiences.",
      aiSuperpower: "AI-Enhanced Development",
      color: "from-green-400 to-emerald-500",
      department: "Development"
    },
    {
      name: "Ethan",
      role: "Frontend Developer",
      icon: Code2,
      description: "Specializes in React and modern frontend frameworks, enhanced by AI code generation and design-to-code conversion tools.",
      aiSuperpower: "AI Frontend Optimization",
      color: "from-blue-400 to-cyan-500",
      department: "Development"
    },
    {
      name: "Paul",
      role: "Backend Developer",
      icon: Server,
      description: "Builds robust server architectures using AI-powered optimization and automated testing frameworks.",
      aiSuperpower: "AI Backend Intelligence",
      color: "from-indigo-400 to-purple-500",
      department: "Development"
    },
    {
      name: "Micheal",
      role: "Full-Stack Developer",
      icon: Code2,
      description: "Bridges frontend and backend development with AI tools that accelerate across the entire development stack.",
      aiSuperpower: "AI Full-Stack Integration",
      color: "from-teal-400 to-green-500",
      department: "Development"
    },
    // Designers
    {
      name: "Vee",
      role: "Senior UI/UX Designer",
      icon: Palette,
      description: "Creates intuitive user experiences using advanced AI design tools while collaborating closely with developers.",
      aiSuperpower: "AI-Enhanced UX Strategy",
      color: "from-rose-400 to-pink-500",
      department: "Design"
    },
    {
      name: "Aleef Ahammed",
      role: "Visual Designer",
      icon: Palette,
      description: "Crafts stunning visual identities using AI-powered design generation and works directly with frontend developers.",
      aiSuperpower: "AI Visual Creation",
      color: "from-orange-400 to-red-500",
      department: "Design"
    },
    {
      name: "Dev B.",
      role: "Product Designer",
      icon: Palette,
      description: "Designs comprehensive product experiences using AI research tools and collaborates across all departments.",
      aiSuperpower: "AI Product Intelligence",
      color: "from-violet-400 to-purple-500",
      department: "Design"
    },
    // Specialists
    {
      name: "Adeyemi Favour Oluwapelumi",
      role: "AI Security & QA Lead",
      icon: ShieldCheck,
      description: "Ensures every project is flawless and secure. Adeyemi uses AI-powered testing to safeguard against vulnerabilities and guarantee reliability.",
      aiSuperpower: "AI Security & Quality Analysis",
      color: "from-emerald-400 to-teal-500",
      department: "Quality"
    },
    {
      name: "Md Zubayer Hossain Patowari",
      role: "Future-Proofing Architect",
      icon: Server,
      description: "Manages our intelligent infrastructure. Zubayer ensures all code is scalable, secure, and future-proof through advanced DevOps and CI/CD practices.",
      aiSuperpower: "Future-Proof DevOps",
      color: "from-slate-500 to-gray-600",
      department: "Operations"
    },
    {
      name: "Mehra Thanesha29",
      role: "AI Data Specialist",
      icon: BarChart3,
      description: "Provides AI-powered insights that inform both design decisions and development optimizations across projects.",
      aiSuperpower: "AI Analytics Intelligence",
      color: "from-amber-400 to-orange-500",
      department: "Analytics"
    },
  ];

  const departments = {
    "AI Technology": coreTeam.filter(m => m.department === "AI Technology"),
    "Design Leadership": coreTeam.filter(m => m.department === "Design Leadership"),
    "Development": coreTeam.filter(m => m.department === "Development"),
    "Design": coreTeam.filter(m => m.department === "Design"), 
    "Operations": coreTeam.filter(m => m.department === "Operations"),
    "Analytics": coreTeam.filter(m => m.department === "Analytics"),
    "Quality": coreTeam.filter(m => m.department === "Quality"),
  };

  const values = [
    {
      icon: Zap,
      title: "AI-First Collaboration",
      description: "Every department works together using cutting-edge AI tools. Our developers and designers don't just coexist—they empower each other with intelligent technology."
    },
    {
      icon: Target,
      title: "Cross-Functional Innovation",
      description: "Our leadership ensures AI integration happens across all departments, creating unprecedented synergy between design, development, and operations."
    },
    {
      icon: Heart,
      title: "Human + AI Excellence",
      description: "Our team members don't compete with AI—they collaborate with it. Every specialist is enhanced by intelligent tools while maintaining their unique human expertise."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 rounded-full border border-purple-500/30 mb-8 backdrop-blur-xl">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">AI-Powered Collaboration</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">
              Human Experts,
              <span className="block gradient-text">AI Supercharged</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              Our team doesn't just use AI—we live and breathe it. Our leadership aggressively integrates cutting-edge AI into every department, 
              while our specialists empower each other through intelligent collaboration.
            </p>
          </div>

          {/* Management Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-2">Our Leadership</h2>
              <p className="text-slate-400 max-w-3xl mx-auto">
                The strategic minds guiding our mission and ensuring flawless execution.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {management.map((member) => (
                <div
                  key={member.name}
                  className={`transition-all duration-500 ${hoveredMember === member.name ? 'scale-105 -translate-y-4' : ''}`}
                  onMouseEnter={() => setHoveredMember(member.name)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <Card className="h-full glass-morphism border-2 border-cyan-400/30 rounded-3xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 shadow-2xl shadow-cyan-500/20">
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-10`} />
                    <CardContent className="relative p-8 text-center h-full flex flex-col">
                      <div className="relative mb-6">
                        <div className={`w-24 h-24 bg-gradient-to-br ${member.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl`}>
                          <member.icon className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white animate-pulse" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                      <Badge className="mb-4 bg-cyan-900/30 text-cyan-300 border border-cyan-500/30">{member.role}</Badge>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-grow">{member.description}</p>
                      <div className="mt-auto">
                        <div className="p-3 bg-slate-800/50 rounded-xl border border-cyan-500/30">
                          <div className="flex items-center gap-2 justify-center">
                            <BrainCircuit className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 text-sm font-medium">{member.aiSuperpower}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Expert Teams Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Expert Teams</h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                AI-supercharged specialists working in synergy to bring your vision to life.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                {/* AI Technology & Design Leadership */}
                <Card className="glass-morphism border border-purple-400/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-purple-400" />
                    Technology & Design Leadership
                  </h3>
                  <p className="text-slate-300 mb-6">Department leads who drive AI integration and creative excellence</p>
                  <div className="grid gap-4">
                    {[...departments["AI Technology"], ...departments["Design Leadership"]].map((member) => (
                      <div
                        key={member.name}
                        className={`p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:border-purple-400/50 cursor-pointer ${
                          hoveredMember === member.name ? 'bg-slate-800/50 scale-105' : ''
                        }`}
                        onMouseEnter={() => setHoveredMember(member.name)}
                        onMouseLeave={() => setHoveredMember(null)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center`}>
                            <member.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{member.name}</h4>
                            <p className="text-slate-400 text-xs">{member.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                                {member.aiSuperpower}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass-morphism border border-green-400/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Code2 className="w-8 h-8 text-green-400" />
                    Development Team
                  </h3>
                  <p className="text-slate-300 mb-6">AI-enhanced developers who collaborate closely with designers for seamless implementation</p>
                  <div className="grid gap-4">
                    {departments.Development.map((member) => (
                      <div
                        key={member.name}
                        className={`p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:border-green-400/50 cursor-pointer ${
                          hoveredMember === member.name ? 'bg-slate-800/50 scale-105' : ''
                        }`}
                        onMouseEnter={() => setHoveredMember(member.name)}
                        onMouseLeave={() => setHoveredMember(null)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center`}>
                            <member.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{member.name}</h4>
                            <p className="text-slate-400 text-xs">{member.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">
                                {member.aiSuperpower}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass-morphism border border-pink-400/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Palette className="w-8 h-8 text-pink-400" />
                    Design Team
                  </h3>
                  <p className="text-slate-300 mb-6">AI-powered designers who work hand-in-hand with developers for pixel-perfect implementation</p>
                  <div className="grid gap-4">
                    {departments.Design.map((member) => (
                      <div
                        key={member.name}
                        className={`p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:border-pink-400/50 cursor-pointer ${
                          hoveredMember === member.name ? 'bg-slate-800/50 scale-105' : ''
                        }`}
                        onMouseEnter={() => setHoveredMember(member.name)}
                        onMouseLeave={() => setHoveredMember(null)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center`}>
                            <member.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{member.name}</h4>
                            <p className="text-slate-400 text-xs">{member.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">
                                {member.aiSuperpower}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <Card className="glass-morphism border border-blue-400/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-blue-400" />
                    Operations & Quality
                  </h3>
                  <p className="text-slate-300 mb-6">AI-enhanced specialists ensuring seamless project delivery, quality, and security.</p>
                  <div className="grid gap-4">
                    {[...departments.Operations, ...departments.Quality].map((member) => (
                      <div
                        key={member.name}
                        className={`p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:border-blue-400/50 cursor-pointer ${
                          hoveredMember === member.name ? 'bg-slate-800/50 scale-105' : ''
                        }`}
                        onMouseEnter={() => setHoveredMember(member.name)}
                        onMouseLeave={() => setHoveredMember(null)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center`}>
                            <member.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{member.name}</h4>
                            <p className="text-slate-400 text-xs">{member.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">
                                {member.aiSuperpower}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass-morphism border border-yellow-400/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-yellow-400" />
                    Analytics
                  </h3>
                  <p className="text-slate-300 mb-6">AI-driven insights that inform and optimize every stage of the project lifecycle.</p>
                  <div className="grid gap-4">
                    {departments.Analytics.map((member) => (
                      <div
                        key={member.name}
                        className={`p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:border-yellow-400/50 cursor-pointer ${
                          hoveredMember === member.name ? 'bg-slate-800/50 scale-105' : ''
                        }`}
                        onMouseEnter={() => setHoveredMember(member.name)}
                        onMouseLeave={() => setHoveredMember(null)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center`}>
                            <member.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{member.name}</h4>
                            <p className="text-slate-400 text-xs">{member.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">
                                {member.aiSuperpower}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Our Collaboration Philosophy
              </h2>
              <p className="text-xl text-slate-300">
                How AI integration and cross-functional collaboration drive extraordinary results
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="glass-morphism border border-white/10 rounded-3xl p-8 text-center hover:border-cyan-400/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-purple-900/50 border border-cyan-400/30 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
              <div className="relative">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Experience True
                  <span className="block gradient-text mt-2">AI-Human Collaboration</span>
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  See how our AI-supercharged team collaborates across all departments to build your project faster, smarter, and better than ever before.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-12 py-6 text-lg rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
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
