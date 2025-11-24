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
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import ContactForm from "@/components/ContactForm";
import { AIChatbot, ChatButton } from "@/components/AIChatbot";
import { ProjectAnalyzer } from "@/components/ProjectAnalyzerNew";

const API_BASE_URL =
  import.meta.env.VITE_SERVER_API_ENDPOINT || "http://localhost:3000";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const HomePage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const testimonials = [
    {
      quote:
        "Feelize's AI-supercharged engineers delivered beyond expectations. They combined AI speed with the quality and attention to detail of senior developers. Our product launched 60% faster than traditional agencies quoted.",
      author: "Sarah Mitchell",
      title: "CEO, TechFlow Innovations",
      metric: "500% increase in user engagement",
      rating: 5,
    },
    {
      quote:
        "Finally, a team that leverages AI without sacrificing code quality. The structure and scalability of what Feelize built rivals what we'd expect from Big Tech, but delivered in a fraction of the time.",
      author: "Marcus Rodriguez",
      title: "Founder, EcoMarket Pro",
      metric: "300% increase in sales",
      rating: 5,
    },
    {
      quote:
        "This is the future of software development. Their engineers use AI tools masterfully while maintaining best practices. We got enterprise-grade quality at startup speed.",
      author: "Emily Chen",
      title: "Marketing Director, HealthFirst",
      metric: "450% increase in qualified leads",
      rating: 5,
    },
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
      icon: Rocket,
      title: "AI-Powered Planning",
      subtitle: "Phase 2",
      description:
        "Our AI analyzes your needs and creates an optimized development roadmap for maximum efficiency.",
    },
    {
      icon: QrCode,
      title: "Rapid Development",
      subtitle: "Phase 3",
      description:
        "Lightning-fast coding powered by AI, with human oversight ensuring quality and creativity.",
    },
    {
      icon: QrCode,
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
        <section className="w-full px-10 pt-20 md:pt-60 pb-5 md:pb-10 h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center gap-7 max-w-6xl w-full"
          >
            <Badge className="px-5 py-3 text-md md:text-lg font-light rounded-full bg-transparent border-2 border-blue-600">
              ✨ AI-Powered Development
            </Badge>

            <h1 className="text-5xl lg:text-8xl font-bold leading-tight font-['Bricolage_Grotesque']">
              Developers Supercharged by AI
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl">
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
              className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white px-7 py-5 text-lg rounded-full h-auto"
            >
              Start Using AI assistant
            </Button>
          </motion.div>
        </section>

        {/* Process Section */}
        <section className="container mx-auto px-16 py-20 md:py-28">
          <div className="flex flex-col items-center gap-12 mb-16">
            <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
              ✨ AI-Optimized Workflow
            </Badge>

            <div className="flex-col md:flex md:flex-row justify-between items-start w-full max-w-7xl gap-12 space-y-10 md:space-y-0">
              <div className="flex-1 space-y-6">
                <h2 className="text-5xl font-semibold text-white font-['Geist']">
                  Our Process
                </h2>
                <p className="text-xl text-gray-400 font-['Istok_Web'] leading-relaxed">
                  At Feelize, we're redefining software development. Our
                  AI-supercharged engineers combine the speed and innovation of
                  cutting-edge AI tools with the quality, structure, and
                  expertise of professional developers and designers—delivering
                  exceptional digital experiences that scale.
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
                        <p className="text-sm font-semibold text-white mb-1 font-['Geist']">
                          {step.subtitle}
                        </p>
                        <h3 className="text-3xl font-semibold text-white mb-2 font-['Geist']">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 font-['Geist']">
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

        {/* Success Metrics Section */}
        <section className="container mx-auto px-16 py-16">
          <div className="flex flex-col items-center gap-16">
            <div className="text-center space-y-6 max-w-6xl">
              <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
                Why Choose Us
              </Badge>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-20 md:gap-28 items-center">
                <h2 className="text-5xl font-bold text-white md:text-left font-['Geist'] text-center">
                  Discover Our Unmatched Success Rates
                </h2>
                <p className="text-2xl text-gray-400 leading-relaxed font-['Geist'] text-justify">
                  At Feelize, we pride ourselves on delivering exceptional
                  results for our clients. With a proven track record and a
                  commitment to customer satisfaction, we ensure that your
                  projects are in capable hands. Join the ranks of our
                  successful clients today!
                </p>
              </div>
            </div>

            <div className="grid md:flex justify-center items-center gap-14 md:gap-32">
              <div className="text-center px-6">
                <h3 className="text-7xl font-bold text-white mb-1 font-['Geist']">
                  95%
                </h3>
                <p className="text-2xl text-gray-400 font-['Geist']">
                  Faster Delivery
                </p>
              </div>
              <div className="text-center px-6">
                <h3 className="text-7xl font-bold text-white mb-1 font-['Geist']">
                  80%
                </h3>
                <p className="text-2xl text-gray-400 font-['Geist']">
                  Cost Savings
                </p>
              </div>
              <div className="text-center px-6">
                <h3 className="text-7xl font-bold text-white mb-1 font-['Geist']">
                  100%
                </h3>
                <p className="text-2xl text-gray-400 font-['Geist']">
                  Client Satisfaction Rate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Analyzer Section */}
        <section
          id="ai-analyzer"
          className="container mx-auto px-16 py-24 scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none">
                <Sparkles className="w-5 h-5 mr-2" />
                AI-Powered Analysis
              </Badge>
              <h2 className="text-5xl font-bold text-white font-['Geist']">
                Free AI Project Analyzer
              </h2>
              <p className="text-xl text-gray-400 font-['Geist']">
                Upload files, describe your project, and get a professional
                report with timeline and budget
              </p>
            </div>

            <ProjectAnalyzer />
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
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed font-['Geist']">
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-white font-semibold font-['Geist']">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-400 text-sm font-['Geist']">
                        {testimonial.title}
                      </p>
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
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed font-['Geist']">
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-white font-semibold font-['Geist']">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-400 text-sm font-['Geist']">
                        {testimonial.title}
                      </p>
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
              <Card
                key={index}
                className="bg-[#141324] border-gray-700 hover:border-purple-500 transition-all"
              >
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2 font-['Geist']">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 font-['Geist']">
                      {plan.duration}
                    </p>
                  </div>

                  <div className="py-6 border-y border-gray-700">
                    <div className="text-5xl font-bold text-white mb-2 font-['Geist']">
                      {plan.price}
                    </div>
                    <p className="text-gray-400 font-['Geist']">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 font-['Geist']">
                          {feature}
                        </span>
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
                Can't find what you're looking for? Chat with our AI assistant
                below!
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
