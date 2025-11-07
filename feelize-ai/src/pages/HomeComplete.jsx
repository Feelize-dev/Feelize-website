import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Phone,
  Rocket,
  QrCode,
  TrendingUp,
  Check,
  Mail,
  Globe,
  Github,
  Linkedin,
  Twitter,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import axios from 'axios';
import ContactForm from '@/components/ContactForm';
import { AIChatbot, ChatButton } from '@/components/AIChatbot';

const API_BASE_URL = import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:3000';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const HomePage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [aiInput, setAiInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleAiAnalysis = async () => {
    if (!aiInput.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResult('');
    
    try {
      if (GEMINI_API_KEY) {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{
                text: `As a senior software architect and AI specialist, analyze this project idea and provide:
                1. Project Overview
                2. Key Features (5-7 items)
                3. Tech Stack Recommendations
                4. Timeline Estimate
                5. Estimated Budget Range
                6. Potential Challenges
                7. Success Metrics
                
                Format the response in clean HTML with proper headings, lists, and styling classes for a dark theme.
                
                Project Description: ${aiInput}`
              }]
            }]
          }
        );
        
        const result = response.data.candidates[0].content.parts[0].text;
        setAnalysisResult(result);
      } else {
        // Fallback to backend
        const response = await axios.post(`${API_BASE_URL}/api/ai/analyze`, {
          prompt: aiInput
        });
        setAnalysisResult(response.data.analysis);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAnalysisResult('<div class="text-red-400">Analysis failed. Please try again or contact us for a personalized consultation.</div>');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testimonials = [
    {
      quote: "Feelize delivered beyond our wildest expectations. Their AI-powered approach cut our development time in half while maintaining premium quality.",
      author: "Sarah Mitchell",
      title: "CEO, TechFlow Innovations",
      metric: "500% increase in user engagement",
      rating: 5
    },
    {
      quote: "Working with Feelize was a game-changer for our business. Their AI integration helped us achieve conversion rates we never thought possible.",
      author: "Marcus Rodriguez",
      title: "Founder, EcoMarket Pro",
      metric: "300% increase in sales",
      rating: 5
    },
    {
      quote: "The speed and quality of delivery was incredible. We could launch our campaign weeks ahead of schedule with results that exceeded all our KPIs.",
      author: "Emily Chen",
      title: "Marketing Director, HealthFirst",
      metric: "450% increase in qualified leads",
      rating: 5
    }
  ];

  const processSteps = [
    {
      icon: Phone,
      title: "Discovery Call",
      subtitle: "Phase 1",
      description: "We start with understanding your vision, goals, and requirements through detailed consultation."
    },
    {
      icon: Rocket,
      title: "AI-Powered Planning",
      subtitle: "Phase 2",
      description: "Our AI analyzes your needs and creates an optimized development roadmap for maximum efficiency."
    },
    {
      icon: QrCode,
      title: "Rapid Development",
      subtitle: "Phase 3",
      description: "Lightning-fast coding powered by AI, with human oversight ensuring quality and creativity."
    },
    {
      icon: QrCode,
      title: "Quality Assurance",
      subtitle: "Phase 4",
      description: "Rigorous testing and refinement to ensure your product exceeds industry standards."
    },
    {
      icon: Rocket,
      title: "Launch & Scale",
      subtitle: "Phase 5",
      description: "Seamless deployment with ongoing support to help your product grow and succeed."
    }
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
        "Blazing Fast performance"
      ]
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
        "Advanced SEO for Products"
      ]
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
        "Scalable Cloud Infrastructure"
      ]
    }
  ];

  const faqs = [
    {
      question: "What services does Feelize offer?",
      answer: "Feelize is a development-first agency. We specialize in \"vibe coding as a service,\" building clean, scalable, and creative digital experiences. Our in-house designers support projects with design when needed."
    },
    {
      question: "What is \"vibe coding\"?",
      answer: "Vibe coding is our signature approach to development — it's not just about writing code, it's about creating smooth, intuitive, and visually striking digital experiences that align with your brand's personality."
    },
    {
      question: "What industries do you work with?",
      answer: "We work with startups, growing businesses, and creators who want development that truly stand out. Whether you're launching a product, rebranding, or scaling your platform, we can help."
    },
    {
      question: "Do you only build websites?",
      answer: "No. While websites are a big part of what we do, our team also builds web apps, mobile apps, dashboards, custom tools, and integrations that help businesses scale."
    },
    {
      question: "How does the project process work?",
      answer: "Every project starts with a discovery session to understand your goals. Then we create design concepts, build with clean code, and refine with feedback. You'll be part of the process at every stage."
    },
    {
      question: "How long does a project take?",
      answer: "Timelines vary depending on scope. A simple landing page may take 1–2 weeks, while full-scale platforms or custom development projects may take 4–10 weeks. We'll give you a clear timeline after reviewing your project."
    },
    {
      question: "Do you provide design services too?",
      answer: "Yes, we have in-house designers who collaborate with our developers to create user-friendly and visually strong products when clients need both design and build."
    },
    {
      question: "What do your services cost?",
      answer: "Our pricing depends on project complexity and deliverables. We offer flexible packages for startups and businesses. Share your project details with us, and we'll provide a tailored quote."
    },
    {
      question: "Do you offer ongoing support after launch?",
      answer: "Yes. We provide maintenance, updates, and improvements to ensure your product continues to perform at its best."
    },
    {
      question: "Can you work with my existing design team?",
      answer: "Definitely. If you already have designs, our developers can bring them to life. If not, our in-house designers can create the visuals alongside our dev team."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white relative">
      {/* Fixed Background with Gradient Ellipses */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Multiple purple gradient blurs throughout the page */}
        {[
          { left: '-142px', top: '484px' },
          { left: '864px', top: '860px' },
          { left: '191px', top: '-188px' },
          { left: '1226px', top: '3px' },
          { left: '-142px', top: '2664px' },
          { left: '864px', top: '3040px' },
          { left: '191px', top: '1992px' },
          { left: '1226px', top: '2183px' },
          { left: '-142px', top: '4774px' },
          { left: '864px', top: '5150px' },
          { left: '191px', top: '4102px' },
          { left: '1226px', top: '4293px' },
          { left: '-142px', top: '6644px' },
          { left: '864px', top: '7020px' },
          { left: '191px', top: '5972px' },
          { left: '1226px', top: '6163px' }
        ].map((pos, i) => (
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
        {/* Hero Section */}
        <section className="container mx-auto px-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center gap-8 max-w-6xl mx-auto"
          >
            <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
              <Sparkles className="w-5 h-5 mr-2" />
              ✨ AI-Powered Development
            </Badge>

            <h1 className="text-7xl lg:text-8xl font-normal leading-tight font-['Bricolage_Grotesque']">
              Leverage on the Maximum Potential of AI
            </h1>

            <p className="text-2xl text-gray-400 font-['Istok_Web']">
              We deliver MVPs faster and cost effective
            </p>

            <Button 
              size="lg"
              onClick={() => setIsContactOpen(true)}
              className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white px-8 py-6 text-lg rounded-full h-auto"
            >
              Start Using AI assistant
            </Button>
          </motion.div>
        </section>

        {/* Process Section */}
        <section className="container mx-auto px-16 py-28">
          <div className="flex flex-col items-center gap-12 mb-16">
            <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
              ✨ AI-Optimized Workflow
            </Badge>
            
            <div className="flex justify-between items-start w-full max-w-7xl gap-12">
              <div className="flex-1 space-y-6">
                <h2 className="text-5xl font-semibold text-white font-['Geist']">
                  Our Process
                </h2>
                <p className="text-xl text-gray-400 font-['Istok_Web'] leading-relaxed">
                  At Feelize, we partner with startups and enterprises to craft digital experiences through vibe coding. From concept to scale, we turn emotions into UI/UX, branding, and product development—delivering solutions that connect with users and drive growth.
                </p>
              </div>

              <div className="flex-1 space-y-4">
                {processSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-10">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0580E8] to-[#7000FF] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {index < processSteps.length - 1 && (
                          <div className="w-0.5 h-20 bg-gradient-to-b from-purple-500/50 to-transparent" />
                        )}
                      </div>

                      <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold text-white mb-1 font-['Geist']">{step.subtitle}</p>
                        <h3 className="text-3xl font-semibold text-white mb-2 font-['Geist']">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 font-['Geist']">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Success Metrics Section */}
        <section className="container mx-auto px-16 py-16">
          <div className="flex flex-col items-center gap-16">
            <div className="text-center space-y-6 max-w-6xl">
              <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
                Why Choose Us
              </Badge>
              <div className="grid grid-cols-2 gap-28 items-center">
                <h2 className="text-5xl font-bold text-white text-left font-['Geist']">
                  Discover Our Unmatched Success Rates
                </h2>
                <p className="text-2xl text-gray-400 leading-relaxed text-left font-['Geist']">
                  At Feelize, we pride ourselves on delivering exceptional results for our clients. With a proven track record and a commitment to customer satisfaction, we ensure that your projects are in capable hands. Join the ranks of our successful clients today!
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-32">
              <div className="text-center px-6">
                <h3 className="text-7xl font-bold text-white mb-1 font-['Geist']">95%</h3>
                <p className="text-2xl text-gray-400 font-['Geist']">Faster Delivery</p>
              </div>
              <div className="text-center px-6">
                <h3 className="text-7xl font-bold text-white mb-1 font-['Geist']">80%</h3>
                <p className="text-2xl text-gray-400 font-['Geist']">Cost Savings</p>
              </div>
              <div className="text-center px-6">
                <h3 className="text-7xl font-bold text-white mb-1 font-['Geist']">100%</h3>
                <p className="text-2xl text-gray-400 font-['Geist']">Client Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Analyzer Section */}
        <section className="container mx-auto px-16 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
                <Sparkles className="w-5 h-5 mr-2" />
                AI-Powered Analysis
              </Badge>
              <h2 className="text-5xl font-bold text-white font-['Geist']">
                Try Our Free AI Project Analyzer
              </h2>
              <p className="text-xl text-gray-400 font-['Geist']">
                Describe your project idea and get instant AI-powered insights
              </p>
            </div>

            <div className="space-y-6">
              <Textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Describe your project idea in detail... What are you trying to build? Who is your target audience? What problems will it solve?"
                className="w-full min-h-[200px] bg-[#141324] border-gray-700 text-white text-lg resize-none focus:border-purple-500"
              />
              
              <Button
                onClick={handleAiAnalysis}
                disabled={isAnalyzing || !aiInput.trim()}
                className="w-full bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white py-6 text-lg"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing your project...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Analyze My Project
                  </span>
                )}
              </Button>

              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#141324] border border-gray-700 rounded-lg p-8"
                >
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: analysisResult }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-16 py-24">
          <div className="text-center space-y-6 mb-16">
            <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
              Success Stories
            </Badge>
            <h2 className="text-5xl font-bold text-white font-['Geist']">
              What Our Clients Say
            </h2>
          </div>

          <div className="space-y-8">
            {/* First Row */}
            <div className="grid grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-[#141324] border-gray-700">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed font-['Geist']">
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-white font-semibold font-['Geist']">{testimonial.author}</p>
                      <p className="text-gray-400 text-sm font-['Geist']">{testimonial.title}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <p className="text-green-500 text-sm font-semibold font-['Geist']">
                          {testimonial.metric}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index + 3} className="bg-[#141324] border-gray-700">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed font-['Geist']">
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-white font-semibold font-['Geist']">{testimonial.author}</p>
                      <p className="text-gray-400 text-sm font-['Geist']">{testimonial.title}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <p className="text-green-500 text-sm font-semibold font-['Geist']">
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
        <section className="container mx-auto px-16 py-24">
          <div className="text-center space-y-6 mb-16">
            <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
              Transparent Pricing
            </Badge>
            <h2 className="text-5xl font-bold text-white font-['Geist']">
              Choose Your Package
            </h2>
            <p className="text-xl text-gray-400 font-['Geist']">
              Flexible solutions for every stage of your journey
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="bg-[#141324] border-gray-700 hover:border-purple-500 transition-all">
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2 font-['Geist']">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 font-['Geist']">{plan.duration}</p>
                  </div>

                  <div className="py-6 border-y border-gray-700">
                    <div className="text-5xl font-bold text-white mb-2 font-['Geist']">
                      {plan.price}
                    </div>
                    <p className="text-gray-400 font-['Geist']">{plan.description}</p>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 font-['Geist']">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => setIsContactOpen(true)}
                    className="w-full bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white py-6 text-lg"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-16 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
                Got Questions?
              </Badge>
              <h2 className="text-5xl font-bold text-white font-['Geist']">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-400 font-['Geist']">
                Can't find what you're looking for? Chat with our AI assistant below!
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-[#141324] border-gray-700">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors"
                    >
                      <span className="text-xl font-semibold text-white font-['Geist']">
                        {faq.question}
                      </span>
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <p className="text-gray-400 text-lg leading-relaxed font-['Geist']">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Chatbot Button */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-6 text-lg font-['Geist']">
                Still have questions? Our AI assistant is here to help!
              </p>
              <ChatButton onClick={() => setIsChatOpen(true)} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0D1117] border-t border-gray-800 py-16">
          <div className="container mx-auto px-16">
            <div className="grid grid-cols-4 gap-12 mb-12">
              {/* Logo and Description */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white font-['Geist']">Feelize</h3>
                <p className="text-gray-400 font-['Geist']">
                  AI-powered development agency delivering exceptional digital experiences
                </p>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white font-['Geist']">Services</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/services/campaigns" className="text-gray-400 hover:text-white transition-colors font-['Geist']">
                      Campaign Sites
                    </Link>
                  </li>
                  <li>
                    <Link to="/services/ecommerce" className="text-gray-400 hover:text-white transition-colors font-['Geist']">
                      E-commerce
                    </Link>
                  </li>
                  <li>
                    <Link to="/services/saas" className="text-gray-400 hover:text-white transition-colors font-['Geist']">
                      SaaS Platforms
                    </Link>
                  </li>
                  <li>
                    <Link to="/services/ai" className="text-gray-400 hover:text-white transition-colors font-['Geist']">
                      AI Integration
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white font-['Geist']">Company</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors font-['Geist']">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/work" className="text-gray-400 hover:text-white transition-colors font-['Geist']">
                      Our Work
                    </Link>
                  </li>
                  <li>
                    <Link to="/process" className="text-gray-400 hover:text-white transition-colors font-['Geist']">
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors font-['Geist']">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white font-['Geist']">Get in Touch</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-400">
                    <Mail className="w-5 h-5" />
                    <a href="mailto:hello@feelize.com" className="hover:text-white transition-colors font-['Geist']">
                      hello@feelize.com
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <Globe className="w-5 h-5" />
                    <a href="https://feelize.com" className="hover:text-white transition-colors font-['Geist']">
                      www.feelize.com
                    </a>
                  </li>
                </ul>

                <div className="flex gap-4 mt-6">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800 text-center text-gray-400 font-['Geist']">
              <p>&copy; {new Date().getFullYear()} Feelize. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ContactForm 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      <AIChatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
