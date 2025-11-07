
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ExternalLink,
  Calendar,
  Users,
  Zap,
  ShoppingCart,
  Briefcase,
  Palette,
  Code2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Award
} from "lucide-react";

export default function WorkPage() {
  const [filter, setFilter] = useState("all");
  const [hoveredProject, setHoveredProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "LuxWatch E-commerce Platform",
      category: "ecommerce",
      client: "Premium Timepieces Inc.",
      description: "AI-powered luxury watch marketplace with AR try-on features, dynamic pricing, and personalized recommendations.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      timeline: "6 weeks",
      results: ["300% increase in conversions", "50% faster load times", "95% customer satisfaction"],
      technologies: ["React", "Node.js", "AI Integration", "AR Technology"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "TechStartup SaaS Dashboard",
      category: "saas",
      client: "DataFlow Analytics",
      description: "Comprehensive analytics platform with real-time data visualization, AI-powered insights, and multi-tenant architecture.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      timeline: "12 weeks",
      results: ["5000+ active users", "99.9% uptime", "40% faster data processing"],
      technologies: ["Vue.js", "Python", "AI/ML", "Cloud Infrastructure"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Green Energy Campaign Site",
      category: "campaign",
      client: "EcoFuture Solutions",
      description: "High-converting campaign site for renewable energy company with interactive calculators and AI-powered lead qualification.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
      timeline: "2 weeks",
      results: ["400% increase in leads", "85% bounce rate reduction", "200% engagement boost"],
      technologies: ["React", "AI Chatbot", "Analytics", "Lead Generation"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "HealthTech Patient Portal",
      category: "saas",
      client: "MediConnect Pro",
      description: "HIPAA-compliant patient management system with AI symptom checker, appointment scheduling, and telemedicine integration.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      timeline: "10 weeks",
      results: ["10,000+ patients onboarded", "60% reduction in admin work", "98% user satisfaction"],
      technologies: ["React", "HIPAA Compliance", "AI Health Assistant", "Secure Infrastructure"],
      color: "from-teal-500 to-blue-500"
    },
    {
      id: 5,
      title: "Fashion Brand E-store",
      category: "ecommerce",
      client: "Urban Style Co.",
      description: "Modern fashion e-commerce with AI style recommendations, virtual fitting room, and social commerce features.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["250% sales increase", "70% return customer rate", "4.9/5 customer rating"],
      technologies: ["Next.js", "AI Recommendations", "AR Fitting", "Social Integration"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 6,
      title: "Real Estate Campaign Hub",
      category: "campaign",
      client: "Prime Properties Group",
      description: "High-impact real estate campaign site with AI property matching, virtual tours, and automated lead nurturing.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      timeline: "3 weeks",
      results: ["500% more qualified leads", "90% faster property matching", "150% engagement increase"],
      technologies: ["React", "AI Property Match", "Virtual Tours", "CRM Integration"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const categories = [
    { id: "all", name: "All Projects", count: projects.length },
    { id: "campaign", name: "Campaign Sites", count: projects.filter(p => p.category === "campaign").length },
    { id: "ecommerce", name: "E-commerce", count: projects.filter(p => p.category === "ecommerce").length },
    { id: "saas", name: "SaaS Platforms", count: projects.filter(p => p.category === "saas").length }
  ];

  const filteredProjects = filter === "all" ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-slate-800/50 rounded-full border border-purple-500/30 mb-6 sm:mb-8 backdrop-blur-xl">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-xs sm:text-sm font-medium">AI-Powered Success Stories</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6">
              Our Work in Action,
              <span className="block gradient-text mt-1 sm:mt-2">Results That Speak</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-4xl mx-auto">
              See how our AI-enhanced team has transformed businesses across industries. Every project showcases the perfect blend of human expertise and intelligent technology.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12 sm:mb-16">
            <div className="w-full sm:w-auto px-4">
                <div className="sm:inline-flex flex gap-2 p-2 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-white/10 overflow-x-auto scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setFilter(category.id)}
                      className={`flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 ${
                        filter === category.id
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 opacity-60">({category.count})</span>
                    </button>
                  ))}
                </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-20">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <Card className="h-full glass-morphism border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-400/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <CardContent className="relative p-0">
                    {/* Project Image */}
                    <div className="relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-56 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`bg-gradient-to-r ${project.color} text-white border-0 text-xs sm:text-sm`}>
                          {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <div className="flex items-center gap-1 p-2 bg-black/30 backdrop-blur rounded-lg">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          <span className="text-white text-xs">{project.timeline}</span>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-6 sm:p-8">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-1">Client: {project.client}</p>
                      </div>

                      <p className="text-slate-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Results */}
                      <div className="mb-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          Key Results
                        </h4>
                        <div className="space-y-2">
                          {project.results.map((result, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              <span className="text-slate-300">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <Badge key={idx} className="bg-slate-800/50 text-slate-300 border border-slate-600/30 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-purple-900/50 border border-cyan-400/30 rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Join Our 
                  <span className="block gradient-text mt-2">Success Stories?</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Let our AI-powered team create your next success story. Experience the same results-driven approach that's transformed these businesses.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
                    Start Your Success Story
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
