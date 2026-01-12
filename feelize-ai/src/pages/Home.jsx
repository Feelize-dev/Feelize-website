
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/api/integrations";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Users,
  Check,
  Loader2,
  X,
  UploadCloud,
  Palette,
  Code2,
  Zap,
  Target,
  Rocket,
  ChevronRight,
  Play,
  TrendingUp,
  Award,
  Heart,
  Quote,
  Star,
  XCircle,
  AlertCircle,
  MessageCircle,
  Send,
  ChevronLeft
} from "lucide-react";
import { motion, useAnimation, useScroll, useTransform, useInView } from "framer-motion";

// Custom Icon Components - More unique and less stock-like
const CustomRocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" fill="url(#rocketGradient)" opacity="0.3" />
    <path d="M12 2C12 2 16 6 16 12C16 14 14 16 12 16C10 16 8 14 8 12C8 6 12 2 12 2Z" stroke="url(#rocketGradient)" strokeWidth="2" fill="none" />
    <circle cx="12" cy="10" r="2" fill="url(#rocketGradient)" />
    <path d="M8 16L6 22M16 16L18 22" stroke="url(#rocketGradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CustomTargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#targetGradient)" strokeWidth="2" fill="none" opacity="0.3" />
    <circle cx="12" cy="12" r="6" stroke="url(#targetGradient)" strokeWidth="2" fill="none" opacity="0.5" />
    <circle cx="12" cy="12" r="2" fill="url(#targetGradient)" />
    <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="url(#targetGradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CustomZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="zapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#zapGradient)" stroke="url(#zapGradient)" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

// Shatter Piece Component - REALISTIC GLASS FALLING
const ShatterPiece = ({ x, y, rotation, delay, animate }) => (
  <motion.div
    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
    animate={animate ? {
      x: x,
      y: y + 500,
      opacity: 0,
      scale: 0.3,
      rotate: rotation,
      transition: { duration: 1.2, ease: [0.4, 0.0, 0.6, 1], delay: delay }
    } : {}}
    className="absolute w-4 h-4 bg-gradient-to-br from-red-500/90 to-yellow-500/90"
    style={{
      left: '50%',
      top: '50%',
      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
      boxShadow: '0 0 15px rgba(239, 68, 68, 0.6), inset 0 0 5px rgba(255, 255, 255, 0.3)'
    }}
  />
);

// Shatterable Card Component
const ShatterableCard = ({ children, shouldShatter }) => {
  const [isShattered, setIsShattered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (shouldShatter && !isShattered) {
      setIsShattered(true);
    }
  }, [shouldShatter, isShattered]);

  const pieces = Array.from({ length: 100 }).map((_, i) => {
    const angle = (i / 100) * Math.PI * 2;
    const distance = 50 + Math.random() * 150;
    return {
      x: Math.cos(angle) * distance + (Math.random() - 0.5) * 100,
      y: Math.random() * 100,
      rotation: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.2,
    };
  });

  return (
    <div ref={cardRef} className="relative">
      <motion.div
        animate={{ opacity: isShattered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      {isShattered && (
        <div className="absolute inset-0 pointer-events-none">
          {pieces.map((piece, i) => (
            <ShatterPiece key={i} {...piece} animate={isShattered} />
          ))}
        </div>
      )}
    </div>
  );
};

// AI Demo Component
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
      promptContent += `\n\nFile: ${demoFile.name}`;
    }

    const prompt = `Analyze this project description and extract exactly 6 key insights: "${promptContent}"`;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: { type: "string" }
            }
          }
        },
      });
      setAnalysisResult(result.insights.slice(0, 6));
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
    if (e.dataTransfer.files?.[0]) {
      setDemoFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative">
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
                placeholder="Describe your dream project..."
                className="bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-2xl p-4 min-h-32 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
              />
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
                    <X className="w-4 h-4 text-slate-400 hover:text-red-400" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-white font-medium text-sm">Drop your inspiration here</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleAnalysis}
              disabled={isAnalyzing || (!demoText && !demoFile)}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold py-4 rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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

          {showResults && analysisResult.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h4 className="text-lg font-bold text-white">AI Insights Extracted</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {analysisResult.map((tag, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-600/30"
                  >
                    <div className="p-1.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
                      {tag.toLowerCase().includes('design') ?
                        <Palette className="w-3 h-3 text-white" /> :
                        <Code2 className="w-3 h-3 text-white" />
                      }
                    </div>
                    <span className="text-white text-sm font-medium">{tag}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Floating Card Component
const FloatingCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.6 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

// REBUILT: Section Header Component with ONE-TIME zoom animation
const SectionHeader = ({ icon: Icon, badgeText, title, subtitle, badgeColor = "purple" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const colorClasses = {
    purple: "border-purple-500/30 bg-slate-800/50",
    cyan: "border-cyan-500/30 bg-slate-800/50",
    yellow: "border-yellow-500/30 bg-slate-800/50",
    green: "border-green-500/30 bg-slate-800/50"
  };

  const textColorClasses = {
    purple: "text-purple-400",
    cyan: "text-cyan-400",
    yellow: "text-yellow-400",
    green: "text-green-400"
  };

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ scale: 5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 5, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border backdrop-blur-xl mb-8 ${colorClasses[badgeColor]}`}
      >
        <Icon className={`w-4 h-4 ${textColorClasses[badgeColor]}`} />
        <span className={`text-sm font-medium ${textColorClasses[badgeColor]}`}>{badgeText}</span>
      </motion.div>

      <h2 className="text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// FIXED: Testimonial Chat Component
const TestimonialChat = ({ testimonial }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm ${testimonial.name}, ${testimonial.role} at ${testimonial.company}. I recently worked with Feelize on an incredible project and wanted to share my experience.\n\nMy project with Feelize resulted in ${testimonial.result}, which completely exceeded my expectations. ${testimonial.quote}\n\nI'd love to answer any questions you have about working with their team!`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // FIXED: Reset messages only when testimonial NAME changes, not the entire object
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi! I'm ${testimonial.name}, ${testimonial.role} at ${testimonial.company}. I recently worked with Feelize on an incredible project and wanted to share my experience.\n\nMy project with Feelize resulted in ${testimonial.result}, which completely exceeded my expectations. ${testimonial.quote}\n\nI'd love to answer any questions you have about working with their team!`
      }
    ]);
  }, [testimonial.name]); // FIXED: Only reset when name changes, not entire testimonial object

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const context = `
        You are roleplaying as ${testimonial.name}, a ${testimonial.role} at ${testimonial.company}.
        
        CRITICAL: Stay in character at all times. You are NOT an AI assistant. You are ${testimonial.name}.
        
        Your real experience with Feelize:
        - Your testimonial: "${testimonial.quote}"
        - The measurable result you achieved: ${testimonial.result}
        - Your role: ${testimonial.role}
        - Your company: ${testimonial.company}
        
        CHARACTER TRAITS:
        - Be enthusiastic and passionate about your successful project
        - Share specific details about the process, communication, and results
        - Mention how the AI-powered approach made a difference
        - Use first person ("I", "my", "we") naturally
        - Show emotion and excitement about the transformation
        - Reference specific moments or challenges you faced
        
        IMPORTANT RULES:
        - Never break character or mention you're an AI
        - Never say "as ${testimonial.name}" or similar meta-references
        - Keep responses under 80 words
        - Be conversational and authentic
        - If asked something you wouldn't know, say so naturally
        
        User's question: "${userMessage}"
        
        Respond as ${testimonial.name} would, staying completely in character:
      `;

      const response = await InvokeLLM({
        prompt: context,
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `You know, working with Feelize was truly transformative for ${testimonial.company}. The combination of their expert team and AI-powered tools delivered results faster than I thought possible. What specific aspect of my experience would you like to know more about?`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-morphism border border-white/20 rounded-3xl overflow-hidden h-[500px] flex flex-col">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white text-lg border-2 border-cyan-400">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-bold">{testimonial.name}</h4>
            <p className="text-slate-400 text-sm">{testimonial.role}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Online</span>
          </div>
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl ${message.role === 'user'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-700/50 text-slate-200'
              }`}>
              <p className="text-sm italic leading-relaxed whitespace-pre-line">{message.content}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/50 p-3 rounded-2xl">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => e.target.value.length < 150 && setInput(e.target.value)} // Character limit for input
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about their experience..."
            className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400"
            maxLength={150} // Also enforce visual character limit
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-cyan-500 hover:bg-cyan-400"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

// NEW: Jukebox Carousel Component (Classic American Diner Style)
const JukeboxCarousel = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const cardAngle = 360 / projects.length;
  const radius = 280; // Adjust this for circle size

  return (
    <div className="relative max-w-5xl mx-auto h-[550px] flex items-center justify-center">
      {/* Jukebox Frame */}
      <div className="absolute w-full max-w-4xl h-[550px] rounded-[40px] bg-gradient-to-br from-red-800 via-rose-900 to-red-900 shadow-2xl shadow-black/50 border-8 border-yellow-800/50 p-4">
        {/* Inner wood grain */}
        <div className="w-full h-full rounded-[32px] bg-yellow-900/50 p-4 border-4 border-black/30" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)' }}>
          {/* Chrome top */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[80%] h-24 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 rounded-t-3xl border-4 border-slate-600">
            <h3 className="text-center text-3xl font-black text-slate-800 drop-shadow-lg mt-6" style={{ fontFamily: "'Bungee', cursive" }}>
              FEELIZE HITS
            </h3>
          </div>
          {/* Speaker Grilles */}
          <div className="absolute bottom-6 left-6 w-28 h-28 bg-black/50 rounded-2xl border-4 border-slate-600 p-2">
            <div className="w-full h-full bg-repeat bg-[length:10px_10px] rounded-lg" style={{ backgroundImage: 'radial-gradient(#555 1px, transparent 1px)' }} />
          </div>
          <div className="absolute bottom-6 right-6 w-28 h-28 bg-black/50 rounded-2xl border-4 border-slate-600 p-2">
            <div className="w-full h-full bg-repeat bg-[length:10px_10px] rounded-lg" style={{ backgroundImage: 'radial-gradient(#555 1px, transparent 1px)' }} />
          </div>
        </div>
      </div>

      {/* Flipping Mechanism */}
      <div className="relative w-full h-96" style={{ perspective: "1000px" }}>
        <motion.div
          className="absolute w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: -currentIndex * cardAngle }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id || index}
              className="absolute w-72 h-96 left-1/2 top-1/2 -ml-36 -mt-48"
              style={{
                transform: `rotateY(${index * cardAngle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden"
              }}
            >
              <Card className={`relative w-full h-full rounded-2xl overflow-hidden border-4 transition-all duration-300 ${index === currentIndex ? 'border-yellow-400 shadow-2xl shadow-yellow-500/50' : 'border-slate-700'}`}>
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <div className="flex items-center gap-2 text-green-400 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold text-sm">{project.result}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-2xl font-bold text-white bg-black/50 px-3 py-1 rounded-lg">
                  {String.fromCharCode(65 + index)}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-20">
        <Button onClick={prevProject} className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 text-white border-4 border-slate-500 shadow-lg">
          <ChevronLeft className="w-10 h-10" />
        </Button>
        <Button onClick={nextProject} className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 text-white border-4 border-slate-500 shadow-lg">
          <ChevronRight className="w-10 h-10" />
        </Button>
      </div>
    </div>
  );
};


export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shatterOldCards, setShatterOldCards] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Hero section ref for scroll tracking
  const heroRef = useRef(null);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll to top on mount (when navigating to this page)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll-based hero dissolve
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(heroScroll, [0, 0.3, 0.6], [1, 0.7, 0]);
  const heroBlur = useTransform(heroScroll, [0, 0.3, 0.6], [0, 5, 15]);
  const heroFilter = useTransform(heroBlur, (v) => `blur(${v}px)`);
  const heroY = useTransform(heroScroll, [0, 1], [0, -100]);

  // IMPROVED: Lighting calculation with longer range, lower max brightness
  const calculateOpacity = useCallback((elementId) => {
    if (typeof window === "undefined") return 0.15;

    const element = document.getElementById(elementId);
    if (!element) return 0.15;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mousePosition.x - centerX, 2) +
      Math.pow(mousePosition.y - centerY, 2)
    );

    const maxDistance = 800; // Increased detection range
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    // Lower max brightness (0.5 instead of 0.9), smoother falloff
    const opacity = Math.max(0.1, Math.min(0.5, Math.pow(1 - normalizedDistance, 3)));

    return opacity;
  }, [mousePosition]);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "AI acceleration reduces project time by 60%",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      shadowColor: "shadow-orange-500/50"
    },
    {
      icon: Target,
      title: "Precision Perfect",
      description: "AI analysis ensures 99% requirement accuracy",
      gradient: "from-purple-400 via-pink-500 to-red-500",
      shadowColor: "shadow-pink-500/50"
    },
    {
      icon: Rocket,
      title: "Cost Effective",
      description: "Save 40% compared to traditional agencies",
      gradient: "from-cyan-400 via-blue-500 to-purple-500",
      shadowColor: "shadow-cyan-500/50"
    }
  ];

  const projects = [
    {
      title: "LuxWatch E-commerce",
      category: "E-commerce",
      result: "300% increase in conversions",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "TechStartup SaaS Dashboard",
      category: "SaaS Platform",
      result: "5000+ active users",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Green Energy Campaign",
      category: "Campaign Site",
      result: "400% increase in leads",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "HealthTech Patient Portal",
      category: "Healthcare Platform",
      result: "10,000+ patients onboarded",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      color: "from-teal-500 to-blue-500"
    },
    {
      title: "Fashion Brand E-store",
      category: "E-commerce",
      result: "250% sales increase",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const testimonials = [
    {
      name: "Vernon Attles",
      role: "President, CEO",
      company: "PressEmporium",
      quote: "Feelize is one of the greatest groups of creative minds and coding professionals that I have ever had the opportunity to work with. They ride the cutting edge of AI tech and their creativity and skill are phenomenal.",
      result: "Exceptional Craftsmanship",
      rating: 5
    },
    {
      name: "Utkarsh Srivastava",
      role: "Founder & Managing Partner",
      company: "Adjuva Legal",
      quote: "I am honored to vouch for Feelize. Their standard of code development, project custodianship, accountability in delivery, and overall project management reflects exceptional quality.",
      result: "Outstanding Technical Execution",
      rating: 5
    },
    {
      name: "Sal Austin",
      role: "Senior VP",
      company: "DGX Security",
      quote: "I confidently recommend Feelize for their outstanding professionalism and consistency. Their technical expertise, responsible ownership of work, and structured approach to project execution make them a dependable partner.",
      result: "High-value Delivery",
      rating: 5
    },
    {
      name: "Richard Weiner",
      role: "CEO",
      company: "ABCVI",
      quote: "Feelize delivers a rare combination of technical skill, accountability, and creative insight. They manage projects with clarity and discipline, ensuring transparency and timely execution.",
      result: "Exceeded Expectations",
      rating: 5
    },
    {
      name: "Sandy Weberman",
      role: "Owner",
      company: "Sandy Creative",
      quote: "Feelize stands out through a rare combination of technical skill, responsible execution, and thoughtful creativity. Their development practices are well-structured, project delivery is handled with discipline.",
      result: "Disciplined Delivery",
      rating: 5
    },
    {
      name: "Neal Elefant",
      role: "President",
      company: "Business Leader",
      quote: "Feelize is at the forefront of AI Web and app design. Contact them for your next project or to add new life to your existing Website.",
      result: "Cutting Edge Design",
      rating: 5
    }
  ];

  // Animation controls for Problem/Solution section
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (sectionInView) {
      const sequence = async () => {
        await controls.start("visible");
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShatterOldCards(true);
        await controls.start("crushed");
        await controls.start("showNew");
      };
      sequence();
    }
  }, [sectionInView, controls]);

  const oldCardsVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    crushed: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const newCardVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 150 },
    showNew: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, type: "spring", stiffness: 100, damping: 15 } },
  };

  const revealVariants = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 50 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="relative">
      {/* IMPROVED: Universal lighting with slower drift and better responsiveness */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Hero Section Lights */}
        <motion.div
          id="orb1"
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb1") }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          id="orb2"
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb2") }}
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          id="orb3"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb3") }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Problem/Solution Section Lights */}
        <motion.div
          id="orb4"
          className="absolute top-[120vh] left-20 w-[600px] h-[600px] bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb4") }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          id="orb5"
          className="absolute top-[140vh] right-20 w-[500px] h-[500px] bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb5") }}
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Featured Work Section Lights */}
        <motion.div
          id="orb6"
          className="absolute top-[220vh] left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/25 to-pink-500/25 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb6") }}
          animate={{
            x: [0, 40, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          id="orb7"
          className="absolute top-[260vh] right-1/4 w-96 h-96 bg-gradient-to-br from-green-500/25 to-emerald-500/25 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb7") }}
          animate={{
            x: [0, -35, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Testimonials Section Lights */}
        <motion.div
          id="orb8"
          className="absolute top-[320vh] left-10 w-[500px] h-[500px] bg-gradient-to-br from-yellow-500/25 to-orange-500/25 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb8") }}
          animate={{
            x: [0, 45, 0],
            y: [0, -35, 0],
          }}
          transition={{
            duration: 23,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          id="orb9"
          className="absolute top-[360vh] right-10 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/25 to-blue-500/25 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb9") }}
          animate={{
            x: [0, -40, 0],
            y: [0, 35, 0],
          }}
          transition={{
            duration: 27,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Final CTA Section Lights */}
        <motion.div
          id="orb10"
          className="absolute top-[420vh] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
          style={{ opacity: calculateOpacity("orb10") }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section with Scroll Dissolve */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 z-10"
        style={{
          opacity: heroOpacity,
          filter: heroFilter,
          y: heroY
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Animated Badge with proper styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 rounded-full border border-cyan-500/30 mb-8 backdrop-blur-xl"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 text-sm font-medium">AI-Powered Development • Live Now</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 leading-tight"
            >
              <span className="block text-white">Expert Quality,</span>
              <span className="block gradient-text mt-2">AI Speed.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto"
            >
              Our <span className="text-cyan-400 font-semibold">professional team</span>, trained to leverage the maximum potential of AI, delivers your project
              <span className="text-purple-400 font-semibold"> faster</span> and more
              <span className="text-pink-400 font-semibold"> cost-effectively</span>. Get the best of both worlds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24"
            >
              <Link to={createPageUrl("StartProject")}>
                <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black px-12 py-6 text-lg font-bold rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                  <Play className="w-6 h-6 mr-3" />
                  Start with AI Assistant
                </Button>
              </Link>

              <Link to={createPageUrl("About")} className="flex items-center text-slate-300 hover:text-cyan-400 font-medium group transition-all duration-300">
                <span>Meet Our AI-Powered Team</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Feature Cards with STYLED ICONS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FloatingCard key={index} delay={800 + index * 150}>
                  <Card className="h-full text-center glass-morphism border border-white/10 rounded-3xl p-8 group transition-all duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/10">
                    {/* NEON ICON with Feelize Colors */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      {/* Neon glow background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />

                      {/* Icon container with gradient background */}
                      <div className={`relative w-full h-full rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center ${feature.shadowColor} shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                        <feature.icon className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </Card>
                </FloatingCard>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Problem/Solution Section with FIXED animations */}
      <motion.section
        ref={sectionRef}
        className="py-32 relative overflow-hidden z-10"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={XCircle}
            badgeText="The Problem with Traditional Approaches"
            title={<>The Old Way is Broken.<br /><span className="gradient-text">We Built a Better Way.</span></>}
            subtitle="Stop choosing between speed, quality, and cost. Get all three."
            badgeColor="purple"
          />

          <div className="relative flex flex-col items-center justify-center min-h-[700px] mt-20">
            {/* Old Way Cards with Glitch + Shatter */}
            <motion.div
              className="w-full lg:w-2/3 space-y-8 absolute top-0"
              variants={oldCardsVariants}
              initial="hidden"
              animate={controls}
              style={{ zIndex: shatterOldCards ? 0 : 2 }}
            >
              <ShatterableCard shouldShatter={shatterOldCards}>
                <Card className="glass-morphism border-2 border-red-500/40 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl bg-slate-900/60">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />

                  {/* Rejected stamp */}
                  <div className="absolute top-4 right-4 opacity-30">
                    <div className="border-4 border-red-500 rounded-2xl px-4 py-2 rotate-12">
                      <XCircle className="w-16 h-16 text-red-500" />
                    </div>
                  </div>

                  {/* Content with glitch */}
                  <motion.div
                    animate={{
                      x: [0, -2, 2, -2, 0],
                      opacity: [1, 0.9, 1, 0.85, 1]
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      repeatDelay: 1.5
                    }}
                    className="relative flex items-start gap-6"
                  >
                    <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center border-2 border-red-500/30 flex-shrink-0">
                      <AlertCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">Traditional Agencies</h3>
                      <p className="text-slate-300 mb-4 leading-relaxed">High quality, but painfully slow and expensive. Projects drag on for months.</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-900/50 text-red-200 border border-red-500/30">Slow Delivery</Badge>
                        <Badge className="bg-red-900/50 text-red-200 border border-red-500/30">High Cost</Badge>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </ShatterableCard>

              <ShatterableCard shouldShatter={shatterOldCards}>
                <Card className="glass-morphism border-2 border-yellow-500/40 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl bg-slate-900/60">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl" />

                  {/* Rejected stamp */}
                  <div className="absolute top-4 right-4 opacity-30">
                    <div className="border-4 border-yellow-500 rounded-2xl px-4 py-2 -rotate-12">
                      <XCircle className="w-16 h-16 text-yellow-500" />
                    </div>
                  </div>

                  {/* Content with glitch */}
                  <motion.div
                    animate={{
                      x: [0, 2, -2, 2, 0],
                      opacity: [1, 0.85, 1, 0.9, 1]
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="relative flex items-start gap-6"
                  >
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-2xl flex items-center justify-center border-2 border-yellow-500/30 flex-shrink-0">
                      <Users className="w-10 h-10 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">Freelancers</h3>
                      <p className="text-slate-300 mb-4 leading-relaxed">Affordable, but a total gamble on quality, reliability, and communication.</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-yellow-900/50 text-yellow-200 border border-yellow-500/30">Inconsistent Quality</Badge>
                        <Badge className="bg-yellow-900/50 text-yellow-200 border border-yellow-500/30">Unreliable</Badge>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </ShatterableCard>
            </motion.div>

            {/* ENHANCED Feelize Model Card with better contrast and uniqueness */}
            <motion.div
              className="w-full lg:w-2/3 absolute top-0"
              variants={newCardVariants}
              initial="hidden"
              animate={controls}
              style={{ zIndex: shatterOldCards ? 2 : 0 }}
            >
              <Card className="relative overflow-hidden rounded-3xl border-4 border-cyan-400/60 shadow-2xl shadow-cyan-500/40">
                {/* Animated background gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    boxShadow: [
                      "0 0 30px rgba(34, 211, 238, 0.4)",
                      "0 0 60px rgba(34, 211, 238, 0.6)",
                      "0 0 30px rgba(34, 211, 238, 0.4)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <CardContent className="relative p-10 z-10">
                  {/* Icon with glow */}
                  <div className="relative mb-8 inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-3xl blur-3xl opacity-60 animate-pulse" />
                    <div className="relative w-28 h-28 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Rocket className="w-14 h-14 text-white" />
                    </div>
                  </div>

                  <h3 className="text-5xl font-black text-white mb-4 drop-shadow-lg">
                    The Feelize Model
                  </h3>
                  <p className="text-xl text-white/90 mb-8 leading-relaxed font-medium drop-shadow">
                    We deliver the impossible: premium quality, lightning speed, and affordable pricing. All powered by our AI-augmented team.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      "Premium Agency Quality",
                      "AI-Accelerated Speed",
                      "Unbeatable Value"
                    ].map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center border-2 border-green-400/50 backdrop-blur-sm">
                          <Check className="w-6 h-6 text-green-300" />
                        </div>
                        <span className="text-white text-xl font-bold drop-shadow">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Link to={createPageUrl("StartProject")}>
                    <Button className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-400 text-white font-bold py-5 text-xl rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 border-2 border-white/20">
                      Experience the Difference
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* AI Demo */}
          <motion.div
            className="max-w-5xl mx-auto mt-32"
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeader
              icon={BrainCircuit}
              badgeText="AI Vision Analyzer • Live Demo"
              title="See Our AI in Action"
              subtitle="Experience how our AI analyzes your project ideas in real-time"
              badgeColor="cyan"
            />
            <div className="mt-12">
              <AiDemo />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Work Section - NOW WITH JUKEBOX */}
      <motion.section
        className="py-32 relative z-10"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={Award}
            badgeText="Real Results • Real Projects"
            title="Projects That Speak for Themselves"
            subtitle="Select your favorite from our jukebox of success stories"
            badgeColor="purple"
          />

          <div className="mt-16">
            <JukeboxCarousel projects={projects} />
          </div>

          <div className="text-center mt-20">
            <Link to={createPageUrl("Work")}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
                View All Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Client Testimonials - WITH CHAT INTERFACE */}
      <motion.section
        className="py-32 relative z-10"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={MessageCircle}
            badgeText="Chat With Our Clients • Live Now"
            title="Talk to Our Satisfied Clients"
            subtitle="Don't just read testimonials. Have a conversation with our clients and ask them anything about their experience with Feelize."
            badgeColor="yellow"
          />

          <div className="mt-8">
            {/* Client Selector */}
            <div className="flex justify-center gap-4 mb-8">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`p-2 rounded-xl transition-all ${activeTestimonial === index
                    ? 'ring-2 ring-cyan-400 scale-110'
                    : 'opacity-50 hover:opacity-100'
                    }`}
                >
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-600 hover:border-cyan-400 text-white font-bold text-xl transition-colors">
                    {testimonial.name.charAt(0)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <TestimonialChat testimonial={testimonials[activeTestimonial]} />
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl("Testimonials")}>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-8 py-4 rounded-2xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105">
                Read More Reviews
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="py-32 relative overflow-hidden z-10"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900/20 to-purple-900/20" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-6xl font-black text-white mb-8">
            Ready to feel the
            <span className="block gradient-text mt-2">difference?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Start a conversation with our AI assistant. It's the first step to a better, more intelligent development journey.
          </p>

          <Link to={createPageUrl("StartProject")}>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 hover:from-purple-400 hover:via-pink-400 hover:to-cyan-300 text-white px-16 py-8 text-xl font-bold rounded-3xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-500 hover:scale-110">
              <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
              Chat With Our AI Now
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
