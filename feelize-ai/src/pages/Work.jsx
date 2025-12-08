import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  TrendingUp,
  ArrowRight,
  Clock,
  Award,
  ExternalLink,
  LinkIcon,
} from "lucide-react";

import adeptMlImage from "../assets/images/adeptMl.png";

export default function WorkPage() {
  const [filter, setFilter] = useState("all");
  const [hoveredProject, setHoveredProject] = useState(null);

  const backgroundBlurs = [
    { left: "10%", top: "-200px" },
    { left: "70%", top: "-100px" },
    { left: "-142px", top: "1000px" },
    { left: "864px", top: "1500px" },
    { left: "191px", top: "800px" },
    { left: "1226px", top: "1200px" },
  ];

  const projects = [
    {
      id: 1,
      title: "Adept ML: AI Personal Secretary",
      category: "saas",
      client: "Adept ML",
      description:
        "A fully autonomous AI voice and text agent that manages inbound calls, WhatsApp inquiries, and client quoting. It acts as a 24/7 receptionist that never sleeps, ensuring zero lead leakage for businesses.",
      image: adeptMlImage,
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
        "Ai integration",
      ],
      color: "from-purple-500 to-pink-500",
      link: "https://adept.ml",
    },
    {
      id: 7,
      title: "LuxWatch E-commerce Platform",
      category: "ecommerce",
      client: "Premium Timepieces Inc.",
      description:
        "AI-powered luxury watch marketplace with AR try-on features, dynamic pricing, and personalized recommendations.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      timeline: "6 weeks",
      results: [
        "300% increase in conversions",
        "50% faster load times",
        "95% customer satisfaction",
      ],
      technologies: ["React", "Node.js", "AI Integration", "AR Technology"],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      title: "TechStartup SaaS Dashboard",
      category: "saas",
      client: "DataFlow Analytics",
      description:
        "Comprehensive analytics platform with real-time data visualization, AI-powered insights, and multi-tenant architecture.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      timeline: "12 weeks",
      results: [
        "5000+ active users",
        "99.9% uptime",
        "40% faster data processing",
      ],
      technologies: ["Vue.js", "Python", "AI/ML", "Cloud Infrastructure"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      title: "Green Energy Campaign Site",
      category: "campaign",
      client: "EcoFuture Solutions",
      description:
        "High-converting campaign site for renewable energy company with interactive calculators and AI-powered lead qualification.",
      image:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
      timeline: "2 weeks",
      results: [
        "400% increase in leads",
        "85% bounce rate reduction",
        "200% engagement boost",
      ],
      technologies: ["React", "AI Chatbot", "Analytics", "Lead Generation"],
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      title: "HealthTech Patient Portal",
      category: "saas",
      client: "MediConnect Pro",
      description:
        "HIPAA-compliant patient management system with AI symptom checker, appointment scheduling, and telemedicine integration.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      timeline: "10 weeks",
      results: [
        "10,000+ patients onboarded",
        "60% reduction in admin work",
        "98% user satisfaction",
      ],
      technologies: [
        "React",
        "HIPAA Compliance",
        "AI Health Assistant",
        "Secure Infrastructure",
      ],
      color: "from-teal-500 to-blue-500",
    },
    {
      id: 5,
      title: "Fashion Brand E-store",
      category: "ecommerce",
      client: "Urban Style Co.",
      description:
        "Modern fashion e-commerce with AI style recommendations, virtual fitting room, and social commerce features.",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: [
        "250% sales increase",
        "70% return customer rate",
        "4.9/5 customer rating",
      ],
      technologies: [
        "Next.js",
        "AI Recommendations",
        "AR Fitting",
        "Social Integration",
      ],
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 6,
      title: "Real Estate Campaign Hub",
      category: "campaign",
      client: "Prime Properties Group",
      description:
        "High-impact real estate campaign site with AI property matching, virtual tours, and automated lead nurturing.",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      timeline: "3 weeks",
      results: [
        "500% more qualified leads",
        "90% faster property matching",
        "150% engagement increase",
      ],
      technologies: [
        "React",
        "AI Property Match",
        "Virtual Tours",
        "CRM Integration",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  const categories = [
    { id: "all", name: "All Projects", count: projects.length },
    {
      id: "campaign",
      name: "Campaign Sites",
      count: projects.filter((p) => p.category === "campaign").length,
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      count: projects.filter((p) => p.category === "ecommerce").length,
    },
    {
      id: "saas",
      name: "SaaS Platforms",
      count: projects.filter((p) => p.category === "saas").length,
    },
  ];

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white relative">
      {/* Fixed Background with Gradient Ellipses */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {backgroundBlurs.map((pos, i) => (
          <div
            key={i}
            className="absolute w-[542px] h-[494px] rounded-full blur-[75px]"
            style={{
              left: pos.left,
              top: pos.top,
              background: "rgba(80, 0, 181, 0.67)",
              opacity: 0.25,
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
              <Award className="w-5 h-5 mr-2" />✨ AI-Supercharged Success
              Stories
            </Badge>

            <h1 className="text-7xl lg:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] mb-6">
              Our Work in Action,
              <br />
              <span className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent">
                Results That Speak
              </span>
            </h1>
            <p className="text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl mx-auto">
              See how our AI-supercharged engineers have transformed businesses
              across industries. Speed of AI + Quality of Professional
              Engineers.
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
                    className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium text-base transition-all duration-300 font-['Geist'] ${
                      filter === category.id
                        ? "bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-purple-500/20"
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
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {filteredProjects.map((project, index) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <Card className="h-full bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl overflow-hidden hover:border-purple-400/70 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                  <CardContent className="relative p-0">
                    {/* Project Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* External Link Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white border-0 text-sm font-['Geist']">
                          {project.category.charAt(0).toUpperCase() +
                            project.category.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <div className="flex items-center gap-1 p-2 bg-purple-600/30 backdrop-blur rounded-lg border border-purple-500/30">
                          <Clock className="w-4 h-4 text-purple-300" />
                          <span className="text-white text-xs font-['Geist']">
                            {project.timeline}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-8">
                      <div className="mb-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors font-['Bricolage_Grotesque']">
                            {project.title}
                          </h3>
                          <LinkIcon className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors mt-1" />
                        </div>
                        <p className="text-gray-400 text-sm mb-1 font-['Geist']">
                          Client: {project.client}
                        </p>
                      </div>

                      <p className="text-gray-300 mb-6 leading-relaxed font-['Geist']">
                        {project.description}
                      </p>

                      {/* Results */}
                      <div className="mb-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2 font-['Bricolage_Grotesque']">
                          <TrendingUp className="w-4 h-4 text-purple-400" />
                          Key Results
                        </h4>
                        <div className="space-y-2">
                          {project.results.map((result, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="w-2 h-2 bg-purple-400 rounded-full" />
                              <span className="text-gray-300 font-['Geist']">
                                {result}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <Badge
                            key={idx}
                            className="bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-['Geist']"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30" />
              <div className="relative">
                <h2 className="text-5xl font-bold text-white mb-6 font-['Bricolage_Grotesque']">
                  Ready to Join Our
                  <span className="block bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent mt-2">
                    Success Stories?
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-['Geist']">
                  Let our AI-supercharged engineers create your next success
                  story. Experience the same results-driven approach that&apos;s
                  transformed these businesses.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:from-[#0580E8]/90 hover:to-[#7000FF]/90 text-white font-bold px-12 py-6 text-lg rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 font-['Bricolage_Grotesque']"
                  >
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
