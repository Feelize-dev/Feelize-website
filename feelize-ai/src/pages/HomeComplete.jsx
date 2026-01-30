import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
  Phone,
  Rocket,
  TrendingUp,
  Check,
  Zap,
  Code2,
  ShieldCheck,
  Cpu,
  Globe,
  Smartphone,
  Blocks,
  ShoppingCart,
  LayoutTemplate,
  Palette,
  Wrench,
  MessageSquare,
  Server,
  LineChart,
} from "lucide-react";
import { motion } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import { AIChatbot, ChatButton } from "@/components/AIChatbot";
import { ProjectAnalyzer } from "@/components/ProjectAnalyzerNew";

const HomePage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const services = [
    {
      title: "Vibe Code Polish & Security",
      description:
        "We turn rough AI-generated code into production-ready software. We debug, refactor, and secure your 'vibe coded' projects.",
      icon: Wrench,
      tags: ["Refactoring", "Security Audit", "Debugging", "Clean Code"],
    },
    {
      title: "AI Workflow Consultation",
      description:
        "Strategic guidance for Vibe Coders. We help you establish best practices, fix workflow bottlenecks, and maintain code health.",
      icon: MessageSquare,
      tags: ["Consulting", "Best Practices", "Training", "Architecture"],
    },
    {
      title: "AI-Powered Development",
      description:
        "Leveraging AI agents to accelerate coding, testing, and deployment workflows for maximum efficiency.",
      icon: Cpu,
      tags: ["Automation", "LLMs", "Predictive Models", "AI Agents"],
    },
    {
      title: "AI & Machine Learning",
      description:
        "Custom AI agents, LLM integration, and predictive models that automate your business logic.",
      icon: Cpu,
      tags: ["OpenAI", "Python", "TensorFlow", "Automation"],
    },
    {
      title: "Web App Development",
      description:
        "Scalable, high-performance web applications built with modern frameworks for enterprise needs.",
      icon: Globe,
      tags: ["React", "Next.js", "Node.js", "SaaS", "Laravel"],
    },
    {
      title: "Mobile Development",
      description:
        "Native and cross-platform mobile apps that provide seamless user experiences on iOS and Android.",
      icon: Smartphone,
      tags: ["React Native", "Flutter", "iOS", "Android"],
    },
    {
      title: "Performance & Security",
      description:
        "Advanced website maintenance, speed optimization, and rigorous security protocols to protect your data.",
      icon: ShieldCheck,
      tags: ["Security Audits", "Speed Opt", "Maintenance", "GDPR"],
    },
    {
      title: "Digital Growth & SEO",
      description:
        "Data-driven digital strategy, On-Page/Off-Page SEO, and PR campaigns to grow your brand visibility.",
      icon: LineChart,
      tags: ["SEO", "Digital Strategy", "PR", "Analytics"],
    },
    {
      title: "Blockchain & Web3",
      description:
        "Secure smart contracts, dApps, and tokenization solutions for the decentralized web.",
      icon: Blocks,
      tags: ["Solidity", "Smart Contracts", "NFTs", "DeFi"],
    },
    {
      title: "E-Commerce Solutions",
      description:
        "High-conversion online stores ranging from custom builds to Shopify and WooCommerce scaling.",
      icon: ShoppingCart,
      tags: ["Shopify", "WooCommerce", "Stripe", "Inventory"],
    },
    {
      title: "CMS & Platforms",
      description:
        "Custom themes and plugins for WordPress, Shopify, Webflow, Wix, and Squarespace to help marketing teams move fast.",
      icon: LayoutTemplate,
      tags: ["WordPress", "Webflow", "Shopify", "Wix"],
    },
    {
      title: "UI/UX Design",
      description:
        "User-centric design systems, prototyping, and visual identities that convert visitors into users.",
      icon: Palette,
      tags: ["Figma", "Prototyping", "User Research"],
    },
    {
      title: "Cloud, DevOps & Hosting",
      description:
        "Streamlined CI/CD, Cloud infra (AWS/GCP), and comprehensive hosting (Shared, VPS, Dedicated).",
      icon: Server,
      tags: ["AWS/GCP", "VPS Hosting", "Docker", "CI/CD"],
    },
  ];

  const testimonials = [
    {
      quote: "Feelize is one of the greatest groups of creative minds and coding professionals that I have ever had the opportunity to work with. They ride the cutting edge of AI tech and their creativity and skill are phenomenal.",
      author: "Vernon Attles",
      title: "President, CEO, PressEmporium",
      metric: "Exceptional Craftsmanship",
      rating: 5,
    },
    {
      quote: "I am honored to vouch for Feelize. Their standard of code development, project custodianship, accountability in delivery, and overall project management reflects exceptional quality.",
      author: "Utkarsh Srivastava",
      title: "Founder & Managing Partner, Adjuva Legal",
      metric: "Outstanding Technical Execution",
      rating: 5,
    },
    {
      quote: "I confidently recommend Feelize for their outstanding professionalism and consistency. Their technical expertise, responsible ownership of work, and structured approach to project execution make them a dependable partner.",
      author: "Sal Austin",
      title: "Senior VP, DGX Security",
      metric: "High-value Delivery",
      rating: 5,
    },
    {
      quote: "Feelize delivers a rare combination of technical skill, accountability, and creative insight. They manage projects with clarity and discipline, ensuring transparency and timely execution.",
      author: "Richard Weiner",
      title: "CEO, ABCVI",
      metric: "Exceeded Expectations",
      rating: 5,
    },
    {
      quote: "Feelize stands out through a rare combination of technical skill, responsible execution, and thoughtful creativity. Their development practices are well-structured, project delivery is handled with discipline.",
      author: "Sandy Weberman",
      title: "Owner, Sandy Creative",
      metric: "Disciplined Delivery",
      rating: 5,
    },
    {
      quote: "Feelize is at the forefront of AI Web and app design. Contact them for your next project or to add new life to your existing Website.",
      author: "Neal Elefant",
      title: "President, Business Leader",
      metric: "Cutting Edge Design",
      rating: 5,
    }
  ];

  const processSteps = [
    {
      icon: Phone,
      title: "Discovery Call",
      subtitle: "Phase 1",
      description:
        "We start with understanding your vision, goals, and requirements through detailed consultation.",
    },
    {
      icon: Zap,
      title: "AI-Powered Planning",
      subtitle: "Phase 2",
      description:
        "Our AI analyzes your needs and creates an optimized development roadmap for maximum efficiency.",
    },
    {
      icon: Code2,
      title: "Rapid Development",
      subtitle: "Phase 3",
      description:
        "Lightning-fast coding powered by AI, with human oversight ensuring quality and creativity.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      subtitle: "Phase 4",
      description:
        "Rigorous testing and refinement to ensure your product exceeds industry standards.",
    },
    {
      icon: Rocket,
      title: "Launch & Scale",
      subtitle: "Phase 5",
      description:
        "Seamless deployment with ongoing support to help your product grow and succeed.",
    },
  ];

  const pricingPlans = [
    {
      name: "Campaign Site",
      duration: "1-2 weeks",
      price: "$2,999",
      description: "Best for targeted campaigns or professional websites",
      features: [
        "AI-Powered Discovery",
        "5 x 1-pager landing pages",
        "Custom visual design",
        "Lead Capture Forms",
        "Basic Analytics Integrations",
        "Blazing Fast performance",
      ],
    },
    {
      name: "E-commerce pro",
      duration: "4-6 weeks",
      price: "$7,999",
      description: "A complete online store to sell your products or scale",
      features: [
        "Everything in campaign plus",
        "Full E-commerce system",
        "Up to 100 Products",
        "Secure Payment Gateways",
        "Inventory Management",
        "Advanced SEO for Products",
      ],
    },
    {
      name: "SaaS Platform",
      duration: "8-16 weeks",
      price: "$20,000+",
      description: "Full-scale custom software as a service application",
      features: [
        "Everything in E-commerce plus",
        "Custom Web Application",
        "User Authentication & Roles",
        "Complex Database Architecture",
        "Subscription/Billing logic",
        "Scalable Cloud Infrastructure",
      ],
    },
  ];

  const faqs = [
    {
      question: "What services does Feelize offer?",
      answer:
        "Feelize is a new approach to software development. We're AI-supercharged engineers—combining the speed of AI with the quality and structure of professional developers and designers. We build clean, scalable, and creative digital experiences backed by the most powerful AI tools in the market.",
    },
    {
      question: "What makes Feelize different?",
      answer:
        "We're the new way to build software. Our team leverages cutting-edge AI tools to accelerate development while maintaining the high standards, best practices, and attention to detail that only experienced engineers and designers can provide. You get the best of both worlds: AI speed with human expertise.",
    },
    {
      question: "What industries do you work with?",
      answer:
        "We work with startups, growing businesses, and creators who want development that truly stand out. Whether you're launching a product, rebranding, or scaling your platform, we can help.",
    },
    {
      question: "Do you only build websites?",
      answer:
        "No. While websites are a big part of what we do, our team also builds web apps, mobile apps, dashboards, custom tools, and integrations that help businesses scale.",
    },
    {
      question: "How does the project process work?",
      answer:
        "Every project starts with a discovery session to understand your goals. Then we create design concepts, build with clean code, and refine with feedback. You'll be part of the process at every stage.",
    },
    {
      question: "How long does a project take?",
      answer:
        "Timelines vary depending on scope. A simple landing page may take 1–2 weeks, while full-scale platforms or custom development projects may take 4–10 weeks. We'll give you a clear timeline after reviewing your project.",
    },
    {
      question: "Do you provide design services too?",
      answer:
        "Yes, we have in-house designers who collaborate with our developers to create user-friendly and visually strong products when clients need both design and build.",
    },
    {
      question: "What do your services cost?",
      answer:
        "Our pricing depends on project complexity and deliverables. We offer flexible packages for startups and businesses. Share your project details with us, and we'll provide a tailored quote.",
    },
    {
      question: "Do you offer ongoing support after launch?",
      answer:
        "Yes. We provide maintenance, updates, and improvements to ensure your product continues to perform at its best.",
    },
    {
      question: "Can you work with my existing design team?",
      answer:
        "Definitely. If you already have designs, our developers can bring them to life. If not, our in-house designers can create the visuals alongside our dev team.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white relative">
      {/* Fixed Background with Gradient Ellipses */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {/* Multiple purple gradient blurs throughout the page */}
        {[
          { left: "10%", top: "-350px" },
          { left: "70%", top: "-250px" },
          { left: "-142px", top: "200px" },
          { left: "864px", top: "500px" },
          { left: "191px", top: "100px" },
          { left: "1226px", top: "300px" },
          { left: "-142px", top: "2664px" },
          { left: "864px", top: "3040px" },
          { left: "191px", top: "1992px" },
          { left: "1226px", top: "2183px" },
          { left: "-142px", top: "4774px" },
          { left: "864px", top: "5150px" },
          { left: "191px", top: "4102px" },
          { left: "1226px", top: "4293px" },
          { left: "-142px", top: "6644px" },
          { left: "864px", top: "7020px" },
          { left: "191px", top: "5972px" },
          { left: "1226px", top: "6163px" },
        ].map((pos, i) => (
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
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-6 md:px-10 pt-32 h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center gap-4 sm:gap-6 md:gap-8 max-w-6xl w-full"
          >
            <div className="mb-2 sm:mb-4">
              <svg
                width="100"
                height="35"
                viewBox="0 0 120 40"
                className="mx-auto sm:w-[120px] sm:h-[40px]"
              >
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-['Bricolage_Grotesque'] font-bold"
                  style={{ fontSize: "28px", fill: "url(#gradient)" }}
                >
                  Feelize
                </text>
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#0580E8", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#7000FF", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] px-4">
              Developers Supercharged by AI
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl px-4">
              Speed of AI. The quality and creativity of our professional
              designers, engineers, and business strategists.
            </p>

            <Button
              size="lg"
              onClick={() => {
                const aiSection = document.getElementById("ai-analyzer");
                if (aiSection) {
                  aiSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg rounded-full h-auto"
            >
              Start with AI Assistant
            </Button>
          </motion.div>
        </section>

        {/* Process Section */}
        <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-28">
          <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 px-5">
            <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-base sm:text-lg rounded-full bg-transparent border-none">
              ✨ AI-Optimized Workflow
            </Badge>

            <div className="flex flex-col lg:flex-row justify-between items-start w-full max-w-7xl gap-8 sm:gap-10 lg:gap-12">
              <div className="w-full lg:flex-1 space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white font-['Geist']">
                  Our Process
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 font-['Istok_Web'] leading-relaxed text-justify">
                  At Feelize, our process is built on one core principle:
                  AI-Supercharged Engineering Teams. We unite our professional
                  engineers, designers, and marketers with advanced AI tools,
                  allowing us to blend innovation with structure. The result is
                  scalable, creative digital experiences delivered at
                  unparalleled speed.
                </p>
              </div>

              <div className="w-full lg:flex-1 space-y-3 sm:space-y-4">
                {processSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 sm:gap-6 md:gap-10"
                    >
                      <div className="flex flex-col items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#0580E8] to-[#7000FF] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        {index < processSteps.length - 1 && (
                          <div className="w-0.5 h-12 sm:h-16 md:h-20 bg-gradient-to-b from-purple-500/50 to-transparent" />
                        )}
                      </div>

                      <div className="flex-1 pb-2 sm:pb-4">
                        <p className="text-xs sm:text-sm font-semibold text-white mb-1 font-['Geist']">
                          {step.subtitle}
                        </p>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1 sm:mb-2 font-['Geist']">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-400 font-['Geist']">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24 bg-[#0A0E14]/50">
          <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16">
            <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-base sm:text-lg rounded-full bg-transparent border-none">
              End-to-End Solutions
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Geist']">
              Our Expertise
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 font-['Geist'] max-w-3xl mx-auto">
              From blockchain architecture to beautiful marketing sites, we
              deliver comprehensive digital solutions.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card className="h-full bg-[#141324] border-gray-700 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(112,0,255,0.2)] transition-all duration-300 group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0580E8] to-[#7000FF] p-0.5 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="w-full h-full bg-[#141324] rounded-2xl flex items-center justify-center">
                        <service.icon className="w-7 h-7 text-white group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 font-['Geist']">
                      {service.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow font-['Geist']">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {service.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Success Metrics Section */}
        <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 md:py-16">
          <div className="flex flex-col items-center gap-8 sm:gap-12 md:gap-16 px-5">
            <div className="text-center space-y-4 sm:space-y-6 max-w-6xl">
              <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-base sm:text-lg rounded-full bg-transparent border-none">
                Why Choose Us
              </Badge>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 md:gap-16 lg:gap-28 items-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center lg:text-left font-['Geist']">
                  Discover Our Unmatched Success Rates
                </h2>
                <p className="text-justify text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed lg:text-left font-['Geist']">
                  At Feelize, we pride ourselves on delivering exceptional
                  results for our clients. With a proven track record and a
                  commitment to customer satisfaction, we ensure that your
                  projects are in capable hands. Join the ranks of our
                  successful clients today!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-32 w-full">
              <div className="text-center px-4 sm:px-6">
                <h3 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-1 font-['Geist']">
                  95%
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-['Geist']">
                  Faster Delivery
                </p>
              </div>
              <div className="text-center px-4 sm:px-6">
                <h3 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-1 font-['Geist']">
                  80%
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-['Geist']">
                  Cost Savings
                </p>
              </div>
              <div className="text-center px-4 sm:px-6">
                <h3 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-1 font-['Geist']">
                  100%
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-['Geist']">
                  Client Satisfaction Rate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Analyzer Section */}
        <section
          id="ai-analyzer"
          className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24 scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
              <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-base sm:text-lg rounded-full bg-transparent border-none">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                AI-Powered Analysis
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Geist']">
                Free AI Project Analyzer
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 font-['Geist'] px-4">
                Upload files, describe your project, and get a professional
                report with timeline and budget
              </p>
            </div>

            <ProjectAnalyzer />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12 md:mb-16 px-5">
            <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-base sm:text-lg rounded-full bg-transparent border-none">
              Success Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Geist']">
              What Our Clients Say
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8 px-5">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <Card key={index} className="bg-[#141324] border-gray-700">
                  <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base italic leading-relaxed font-['Geist']">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="pt-3 sm:pt-4 border-t border-gray-700">
                      <p className="text-white font-semibold text-sm sm:text-base font-['Geist']">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm font-['Geist']">
                        {testimonial.title}
                      </p>
                      <div className="mt-3 sm:mt-4 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <p className="text-green-500 text-xs sm:text-sm font-semibold font-['Geist']">
                          {testimonial.metric}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {testimonials.slice(3, 6).map((testimonial, index) => (
                <Card key={index + 3} className="bg-[#141324] border-gray-700">
                  <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base italic leading-relaxed font-['Geist']">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="pt-3 sm:pt-4 border-t border-gray-700">
                      <p className="text-white font-semibold text-sm sm:text-base font-['Geist']">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm font-['Geist']">
                        {testimonial.title}
                      </p>
                      <div className="mt-3 sm:mt-4 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <p className="text-green-500 text-xs sm:text-sm font-semibold font-['Geist']">
                          {testimonial.metric}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12 md:mb-16 px-5">
            <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-base sm:text-lg rounded-full bg-transparent border-none">
              Transparent Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Geist']">
              Choose Your Package
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 font-['Geist']">
              Flexible solutions for every stage of your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto px-5">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className="bg-[#141324] border-gray-700 hover:border-purple-500 transition-all"
              >
                <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-['Geist']">
                      {plan.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 font-['Geist']">
                      {plan.duration}
                    </p>
                  </div>

                  <div className="py-4 sm:py-6 border-y border-gray-700">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-['Geist']">
                      {plan.price}
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 font-['Geist']">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 sm:space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-300 font-['Geist']">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => setIsContactOpen(true)}
                    className="w-full bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white py-4 sm:py-6 text-base sm:text-lg"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12 md:mb-16 px-5">
              <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-base sm:text-lg rounded-full bg-transparent border-none">
                Got Questions?
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Geist']">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 font-['Geist']">
                Can&apos;t find what you&apos;re looking for? Chat with our AI
                assistant below!
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 px-5">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-[#141324] border-gray-700">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-gray-800/50 transition-colors"
                    >
                      <span className="text-base sm:text-lg md:text-xl font-semibold text-white font-['Geist'] pr-4">
                        {faq.question}
                      </span>
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 sm:px-6 pb-4 sm:pb-6"
                      >
                        <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed font-['Geist']">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Chatbot Button */}
            <div className="mt-8 sm:mt-10 md:mt-12 text-center">
              <p className="text-gray-400 mb-4 sm:mb-6 text-base sm:text-lg font-['Geist'] px-4">
                Still have questions? Our AI assistant is here to help!
              </p>
              <ChatButton onClick={() => setIsChatOpen(true)} />
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <ContactForm
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default HomePage;
