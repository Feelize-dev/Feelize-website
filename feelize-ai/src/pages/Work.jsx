
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

  const backgroundBlurs = [
    { left: '10%', top: '-200px' },
    { left: '70%', top: '-100px' },
    { left: '-142px', top: '1000px' },
    { left: '864px', top: '1500px' },
    { left: '191px', top: '800px' },
    { left: '1226px', top: '1200px' },
  ];

  const projects = [
    {
      id: 1,
      title: "Adept ML: AI Personal Secretary",
      category: "saas",
      client: "Adept ML",
      description:
        "A fully autonomous AI voice and text agent that manages inbound calls, WhatsApp inquiries, and client quoting. It acts as a 24/7 receptionist that never sleeps, ensuring zero lead leakage for businesses.",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
      timeline: "12 weeks",
      results: [
        "100% Lead Capture Rate",
        "24/7 Autonomous Operation",
        "Auto-WhatsApp Follow-ups",
      ],
      technologies: [
        "React",
        "Node.js",
        "Express.js",
        "Flutter",
        "Whisper",
        "GreenApi",
        "Google STT",
        "AI integration",
      ],
      color: "from-purple-500 to-pink-500",
      link: "https://adept.ml",
    },
    {
      id: 2,
      title: "Cloud Castles: Gaming Platform",
      category: "saas",
      client: "Cloud Castles",
      description: "Interactive gaming platform with advanced video manipulation, real-time multiplayer features, and cloud-based game streaming technology.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      timeline: "10 weeks",
      results: ["50K+ active gamers", "99.5% uptime", "Sub-50ms latency"],
      technologies: ["Svelte.js", "Video Manipulation", "WebRTC", "Cloud Streaming"],
      color: "from-blue-500 to-cyan-500",
      link: "https://www.cloudcastles.gg/"
    },
    {
      id: 3,
      title: "Allen Media: Digital Production Hub",
      category: "campaign",
      client: "Allen Media",
      description: "Comprehensive digital media platform featuring advanced video control, content management system, and streamlined production workflows for media professionals.",
      image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["300% content delivery speed", "70% workflow efficiency", "4.8/5 user rating"],
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "WordPress"],
      color: "from-red-500 to-orange-500",
      link: "https://allenmedia.tv/"
    },
    {
      id: 4,
      title: "Stonemark Capital: Investment Platform",
      category: "saas",
      client: "Stonemark Capital",
      description: "Sophisticated investment management platform with real-time portfolio tracking, AI-powered market insights, and secure client portal for wealth management.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      timeline: "14 weeks",
      results: ["$500M+ AUM managed", "2000+ investors onboarded", "Bank-level security"],
      technologies: ["React", "Bootstrap", "Responsive Design", "Financial APIs"],
      color: "from-green-500 to-emerald-500",
      link: "https://stonemarkcapital.com/"
    },
    {
      id: 5,
      title: "Image Appeal: Creative Studio Platform",
      category: "ecommerce",
      client: "Image Appeal",
      description: "Dynamic creative studio website with CSS3 animations, responsive design, and portfolio showcase featuring advanced image galleries and client workflow management.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      timeline: "6 weeks",
      results: ["200% client inquiries", "85% mobile traffic", "4.9/5 satisfaction"],
      technologies: ["JavaScript", "CSS3 Animations", "Responsive Design", "Portfolio CMS"],
      color: "from-purple-500 to-pink-500",
      link: "https://imageappeal.com/"
    },
    {
      id: 6,
      title: "Virtdrop: Virtual Events Platform",
      category: "saas",
      client: "Virtdrop",
      description: "Cutting-edge virtual events platform with custom themes, live streaming capabilities, interactive features, and comprehensive analytics for organizers.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      timeline: "16 weeks",
      results: ["100K+ event attendees", "500+ successful events", "98% satisfaction rate"],
      technologies: ["Custom Theme", "CSS3", "JavaScript", "Bootstrap", "PHP"],
      color: "from-cyan-500 to-blue-500",
      link: "https://virtdrop.com/"
    },
    {
      id: 7,
      title: "Sonora Sprinkler: Service Management",
      category: "campaign",
      client: "Sonora Sprinkler",
      description: "Complete service management platform for irrigation specialists featuring online scheduling, service tracking, customer portal, and automated billing systems.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
      timeline: "7 weeks",
      results: ["400% more bookings", "60% admin time saved", "95% customer retention"],
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "PHP", "WordPress"],
      color: "from-teal-500 to-green-500",
      link: "https://www.sonorasprinkler.com/"
    },
    {
      id: 8,
      title: "Unspouse: Legal Services Platform",
      category: "saas",
      client: "Unspouse",
      description: "Streamlined legal services platform for divorce proceedings with document automation, secure client communication, and case management features.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      timeline: "9 weeks",
      results: ["70% faster case processing", "1000+ cases handled", "Secure document management"],
      technologies: ["WordPress", "Secure Portal", "Document Automation", "Payment Integration"],
      color: "from-indigo-500 to-purple-500",
      link: "https://www.unspouse.com/"
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
        <div className="container mx-auto px-16 py-24">

          {/* Header */}
          <div className="text-center mb-20">
            <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none mb-8">
              <Award className="w-5 h-5 mr-2" />
              ✨ AI-Supercharged Success Stories
            </Badge>

            <h1 className="text-7xl lg:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] mb-6">
              Our Work in Action,<br />
              <span className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent">Results That Speak</span>
            </h1>
            <p className="text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl mx-auto">
              See how our AI-supercharged engineers have transformed businesses across industries. Speed of AI + Quality of Professional Engineers.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-16">
            <div className="w-full sm:w-auto px-4">
              <div className="sm:inline-flex flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilter(category.id)}
                    className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium text-base transition-all duration-300 font-['Geist'] ${filter === category.id
                      ? 'bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-purple-500/20'
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group h-full"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <Card className="h-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-400/70 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-purple-500/20 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                  <CardContent className="relative p-0 flex flex-col h-full">
                    {/* Project Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white border-0 text-[10px] px-2 py-0.5 font-['Geist']">
                          {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors font-['Bricolage_Grotesque'] line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-xs font-['Geist']">Client: {project.client}</p>
                      </div>

                      <p className="text-gray-300 mb-4 text-sm leading-relaxed font-['Geist'] line-clamp-3">
                        {project.description}
                      </p>

                      {/* Results */}
                      <div className="mb-4">
                        <h4 className="text-white text-xs font-semibold mb-2 flex items-center gap-1.5 font-['Bricolage_Grotesque']">
                          <TrendingUp className="w-3 h-3 text-purple-400" />
                          Key Results
                        </h4>
                        <div className="space-y-1">
                          {project.results.slice(0, 2).map((result, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                              <span className="text-gray-300 font-['Geist'] line-clamp-1">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.technologies.slice(0, 4).map((tech, idx) => (
                          <Badge key={idx} className="bg-purple-600/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 font-['Geist']">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge className="bg-purple-600/10 text-purple-400 border border-purple-500/20 text-[10px] px-2 py-0.5 font-['Geist']">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>

                      {/* View Project Link */}
                      {project.link && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors group/link"
                          >
                            Visit Website
                            <ExternalLink className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30" />
              <div className="relative">
                <h2 className="text-5xl font-bold text-white mb-6 font-['Bricolage_Grotesque']">
                  Ready to Join Our
                  <span className="block bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent mt-2">Success Stories?</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-['Geist']">
                  Let our AI-supercharged engineers create your next success story. Experience the same results-driven approach that's transformed these businesses.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:from-[#0580E8]/90 hover:to-[#7000FF]/90 text-white font-bold px-12 py-6 text-lg rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 font-['Bricolage_Grotesque']">
                    Start Your Success Story
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