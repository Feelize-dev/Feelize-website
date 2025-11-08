import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Crown, Code2, Palette, BrainCircuit, Users, Smartphone, Server, Lightbulb, TrendingUp, Share2,
  Sparkles, CheckCircle, ArrowRight, X, UserCheck, Swords, Shield, Wand, Bot
} from "lucide-react";

// --- REFINED TEAM DATA with NEW STATS ---
const ALL_MEMBERS = {
  leadership: [
    {
      id: "cory", name: "Cory", role: "Chief Executive Officer",
      icon: Crown, color: "text-yellow-400",
      avatar: "https://ui-avatars.com/api/?name=Cory&background=1a202c&color=fff&size=256",
      bio: "The visionary leader steering the Feelize ship. Cory orchestrates the grand strategy, ensuring every project aligns with our mission to revolutionize development with AI. His leadership is the nexus of innovation and execution.",
      skills: ["Strategic Vision", "Business Growth", "Team Orchestration", "Market Disruption"],
      superpower: { name: "Nexus of Command", description: "Instantly aligns team efforts and resources towards the highest-value objectives." },
      stats: { engineering: 6, product: 8, delivery: 9, strategy: 10 }
    },
    {
      id: "bloch", name: "Bloch", role: "Founder & Architect",
      icon: BrainCircuit, color: "text-cyan-400",
      avatar: "https://ui-avatars.com/api/?name=Bloch&background=1a202c&color=fff&size=256",
      bio: "The original architect of Feelize. Bloch's genius lies in weaving complex technical systems with AI, creating the very foundation upon which we build. He is the master of elegant, scalable solutions.",
      skills: ["System Architecture", "AI Integration", "Full-Stack Mastery", "Technical Innovation"],
      superpower: { name: "Genesis Forge", description: "Builds robust, scalable application foundations from a single idea in record time." },
      stats: { engineering: 10, product: 8, delivery: 7, strategy: 9 }
    },
    {
      id: "alex-z", name: "Alex Zordel", role: "Chief Technology Officer",
      icon: Shield, color: "text-indigo-400",
      avatar: "https://ui-avatars.com/api/?name=Alex+Zordel&background=1a202c&color=fff&size=256",
      bio: "The guardian of technical excellence. Alex ensures every line of code and system deployment meets the highest standards of quality, security, and performance. He is the unbreachable wall against technical debt.",
      skills: ["Technology Strategy", "System Security", "Performance Optimization", "Quality Assurance"],
      superpower: { name: "Aegis Protocol", description: "Deploys an impenetrable shield of security and stability around any project." },
      stats: { engineering: 10, product: 7, delivery: 9, strategy: 8 } // Adjusted delivery for CTO role
    }
  ],
  development: [
    {
      id: "victor", name: "Victor", role: "Lead Developer",
      icon: Code2, color: "text-blue-400",
      avatar: "https://ui-avatars.com/api/?name=Victor&background=1a202c&color=fff&size=256",
      bio: "A master craftsman of code. Victor leads development squads with precision, turning complex requirements into flawless, high-performance features. His code is both an art form and a functional marvel.",
      skills: ["Full-Stack Development", "Agile Leadership", "Algorithm Design", "Code Mentorship"],
      superpower: { name: "Code Cascade", description: "Unleashes a torrent of clean, efficient code that accelerates development sprints." },
      stats: { engineering: 10, product: 6, delivery: 9, strategy: 7 }
    },
    {
      id: "debojit", name: "Debojit", role: "Lead Dev & Manager",
      icon: Swords, color: "text-teal-400",
      avatar: "https://ui-avatars.com/api/?name=Debojit&background=1a202c&color=fff&size=256",
      bio: "The dual-wielding master of code and process. Debojit executes complex technical tasks while simultaneously managing internal workflows, ensuring a seamless flow from concept to completion.",
      skills: ["Project Management", "Full-Stack Development", "Process Optimization", "Team Coordination"],
      superpower: { name: "Flow State", description: "Harmonizes project timelines and development reality, eliminating all bottlenecks." },
      stats: { engineering: 9, product: 7, delivery: 10, strategy: 7 }
    },
    {
      id: "zubayer", name: "Zubayer", role: "Lead AI Engineer",
      icon: BrainCircuit, color: "text-purple-400",
      avatar: "https://ui-avatars.com/api/?name=Zubayer&background=1a202c&color=fff&size=256",
      bio: "The conduit to the machine mind. Zubayer specializes in breathing intelligence into applications, implementing cutting-edge AI/ML models that give our projects their soul and predictive power.",
      skills: ["AI/ML Engineering", "Neural Networks", "Data Science", "API Integration"],
      superpower: { name: "Mind Meld", description: "Directly integrates advanced AI capabilities into any application feature." },
      stats: { engineering: 9, product: 8, delivery: 7, strategy: 10 }
    },
    {
      id: "aleef", name: "Aleef", role: "Backend Developer",
      icon: Server, color: "text-slate-400",
      avatar: "https://ui-avatars.com/api/?name=Aleef&background=1a202c&color=fff&size=256",
      bio: "The architect of the unseen. Aleef constructs the powerful, resilient server architectures and APIs that form the backbone of every Feelize application, ensuring data flows with speed and reliability.",
      skills: ["Backend Architecture", "API Design", "Database Management", "Cloud Infrastructure"],
      superpower: { name: "Server Surge", description: "Optimizes server performance by 10x, handling any amount of user traffic." },
      stats: { engineering: 10, product: 5, delivery: 8, strategy: 6 }
    },
    {
      id: "adeyemi", name: "Adeyemi", role: "Flutter Developer",
      icon: Smartphone, color: "text-sky-400",
      avatar: "https://ui-avatars.com/api/?name=Adeyemi&background=1a202c&color=fff&size=256",
      bio: "The mobile maestro. Adeyemi crafts beautiful, native-performance applications for any device from a single codebase, ensuring a seamless and responsive user experience on the go.",
      skills: ["Flutter Development", "Cross-Platform Apps", "Mobile UI/UX", "Dart"],
      superpower: { name: "Pixel Perfect", description: "Creates flawless mobile interfaces that look and perform natively on any device." },
      stats: { engineering: 8, product: 10, delivery: 9, strategy: 6 }
    },
    {
      id: "thanesha", name: "Thanesha", role: "Backend Developer",
      icon: Server, color: "text-amber-400",
      avatar: "https://ui-avatars.com/api/?name=Thanesha&background=1a202c&color=fff&size=256",
      bio: "A builder of robust digital engines. Thanesha develops scalable and secure backend systems, ensuring every application has a powerful and reliable core to support its functions.",
      skills: ["System Design", "Cloud Services", "API Development", "Data Integrity"],
      superpower: { name: "Core Solidify", description: "Makes backend systems incredibly resilient and immune to traffic spikes." },
      stats: { engineering: 10, product: 5, delivery: 7, strategy: 6 }
    }
  ],
  design: [
    {
      id: "paul", name: "Paul", role: "UI/UX Designer",
      icon: Palette, color: "text-pink-400",
      avatar: "https://ui-avatars.com/api/?name=Paul&background=1a202c&color=fff&size=256",
      bio: "The user's champion. Paul dives deep into the user's psyche to design interfaces that are not only beautiful but also intuitive and delightful to use. He crafts experiences that feel like second nature.",
      skills: ["UI/UX Research", "User Empathy", "Interaction Design", "Prototyping"],
      superpower: { name: "Empathy Wave", description: "Instantly understands user needs and translates them into a perfect, intuitive UI." },
      stats: { engineering: 5, product: 10, delivery: 7, strategy: 8 }
    },
    {
      id: "ajit", name: "Ajit", role: "UI/UX Designer",
      icon: Palette, color: "text-rose-400",
      avatar: "https://ui-avatars.com/api/?name=Ajit&background=1a202c&color=fff&size=256",
      bio: "The visual virtuoso. Ajit blends aesthetics with function, creating stunning, user-centric designs that capture attention and guide users effortlessly. His work is a masterclass in visual storytelling.",
      skills: ["Visual Design", "Design Systems", "Brand Identity", "Motion Graphics"],
      superpower: { name: "Visual Harmony", description: "Creates visually stunning and perfectly branded interfaces from a simple concept." },
      stats: { engineering: 5, product: 10, delivery: 8, strategy: 7 }
    },
    {
      id: "nyxxan", name: "Nyxxan", role: "UI/UX Designer",
      icon: Palette, color: "text-fuchsia-400",
      avatar: "https://ui-avatars.com/api/?name=Nyxxan&background=1a202c&color=fff&size=256",
      bio: "The weaver of digital experiences. Nyxxan specializes in creating immersive and engaging user journeys, wireframing complex flows into simple, elegant, and modern interface designs.",
      skills: ["UX Strategy", "Wireframing", "User Journey Mapping", "Information Architecture"],
      superpower: { name: "Flow Weave", description: "Designs the most complex user journeys into simple, intuitive, and enjoyable paths." },
      stats: { engineering: 6, product: 10, delivery: 7, strategy: 8 }
    }
  ],
  operations: [
    {
      id: "sariar", name: "Sariar", role: "Human Resources",
      icon: Users, color: "text-green-400",
      avatar: "https://ui-avatars.com/api/?name=Sariar&background=1a202c&color=fff&size=256",
      bio: "The heart of the team. Sariar cultivates our culture and manages talent, ensuring that Feelize is powered by the best and brightest minds who are supported to do their greatest work.",
      skills: ["Talent Management", "Culture Building", "Team Development", "HR Strategy"],
      superpower: { name: "Synergy", description: "Unlocks the hidden potential of teams, boosting morale and productivity." },
      stats: { engineering: 4, product: 5, delivery: 10, strategy: 7 } // Adjusted product & strategy for HR relevancy
    },
    {
      id: "micheal", name: "Micheal", role: "Social Media Manager",
      icon: Share2, color: "text-cyan-300",
      avatar: "https://ui-avatars.com/api/?name=Micheal&background=1a202c&color=fff&size=256",
      bio: "The voice of Feelize. Micheal crafts our narrative and engages our community across all platforms, sharing our journey and connecting with clients through compelling content and strategic outreach.",
      skills: ["Content Strategy", "Community Engagement", "Brand Amplification", "Digital Marketing"],
      superpower: { name: "Viral Voice", description: "Crafts messages that resonate and spread organically across digital networks." },
      stats: { engineering: 4, product: 9, delivery: 8, strategy: 10 } // Adjusted product slightly for marketing content focus
    }
  ],
  consultants: [
    {
      id: "mark-k", name: "Mark Knobel", role: "Business Adviser",
      icon: Lightbulb, color: "text-sky-300",
      avatar: "https://ui-avatars.com/api/?name=Mark+Knobel&background=1a202c&color=fff&size=256",
      bio: "The strategic sage. Mark provides invaluable guidance on business growth, market positioning, and long-term strategy, helping Feelize navigate the complexities of the tech landscape.",
      skills: ["Business Strategy", "Market Analysis", "Mentorship", "Growth Hacking"],
      superpower: { name: "Foresight", description: "Identifies future market trends and opportunities before they emerge." },
      stats: { engineering: 4, product: 6, delivery: 7, strategy: 10 } // Adjusted product for business advisory focus
    },
    {
      id: "kalman", name: "Kalman", role: "AI Consultant",
      icon: Wand, color: "text-violet-400",
      avatar: "https://ui-avatars.com/api/?name=Kalman&background=1a202c&color=fff&size=256",
      bio: "The AI oracle. Kalman advises on high-level AI strategy, ensuring that Feelize remains at the absolute cutting edge of artificial intelligence and leverages its power in the most effective ways possible.",
      skills: ["AI Strategy", "Machine Learning Theory", "Tech Advisory", "R&D"],
      superpower: { name: "Arcane Intellect", description: "Solves seemingly impossible problems by applying novel AI methodologies." },
      stats: { engineering: 9, product: 9, delivery: 8, strategy: 10 } // Adjusted engineering and product for deep AI expertise
    }
  ]
};

// CATEGORY_STYLES for the new MemberCard design
const CATEGORY_STYLES = {
  leadership: { bg: 'from-purple-800 to-indigo-900', border: 'border-purple-500/50', name: 'Leadership' },
  development: { bg: 'from-blue-800 to-cyan-900', border: 'border-blue-500/50', name: 'Development' },
  design: { bg: 'from-pink-800 to-rose-900', border: 'border-pink-500/50', name: 'Design' },
  operations: { bg: 'from-green-800 to-teal-900', border: 'border-green-500/50', name: 'Operations' },
  consultants: { bg: 'from-slate-700 to-gray-800', border: 'border-slate-500/50', name: 'Consultants' }
};

// PROJECT TEMPLATES - Pre-assembled teams for different project types
const PROJECT_TEMPLATES = {
  'web-app': {
    name: '🌐 Web Application',
    description: 'Full-stack web application with modern UI',
    recommendedTeam: ['bloch', 'victor', 'paul', 'aleef'],
    requiredSkills: { engineering: 8, product: 7, delivery: 7, strategy: 6 },
    icon: Code2
  },
  'mobile-app': {
    name: '📱 Mobile Application',
    description: 'Cross-platform mobile app with native performance',
    recommendedTeam: ['adeyemi', 'victor', 'ajit', 'thanesha'],
    requiredSkills: { engineering: 8, product: 9, delivery: 8, strategy: 6 },
    icon: Smartphone
  },
  'ai-integration': {
    name: '🤖 AI Integration',
    description: 'AI/ML powered features and intelligent systems',
    recommendedTeam: ['zubayer', 'kalman', 'bloch', 'victor'],
    requiredSkills: { engineering: 9, product: 8, delivery: 7, strategy: 9 },
    icon: BrainCircuit
  },
  'enterprise': {
    name: '🏢 Enterprise Solution',
    description: 'Large-scale system with complex requirements',
    recommendedTeam: ['cory', 'alex-z', 'bloch', 'debojit', 'victor', 'aleef'],
    requiredSkills: { engineering: 9, product: 7, delivery: 9, strategy: 9 },
    icon: Crown
  },
  'mvp': {
    name: '⚡ MVP Sprint',
    description: 'Quick prototype to validate market fit',
    recommendedTeam: ['victor', 'paul', 'aleef'],
    requiredSkills: { engineering: 7, product: 8, delivery: 9, strategy: 7 },
    icon: TrendingUp
  },
  'redesign': {
    name: '🎨 UI/UX Redesign',
    description: 'Complete interface overhaul and user experience',
    recommendedTeam: ['paul', 'ajit', 'nyxxan', 'victor'],
    requiredSkills: { engineering: 6, product: 10, delivery: 7, strategy: 7 },
    icon: Palette
  }
};


const TeamBuilderPage = () => {
  // Initialize columns with shallow copies of ALL_MEMBERS arrays
  const [columns, setColumns] = useState(() => ({
    ...Object.keys(ALL_MEMBERS).reduce((acc, key) => ({ ...acc, [key]: [...ALL_MEMBERS[key]] }), {}),
    selectedTeam: []
  }));
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectTemplates, setShowProjectTemplates] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const backgroundBlurs = [
    { left: '10%', top: '-200px' },
    { left: '70%', top: '-100px' },
    { left: '-142px', top: '1000px' },
    { left: '864px', top: '1500px' },
    { left: '191px', top: '800px' },
    { left: '1226px', top: '1200px' },
  ];

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    // Create a new columns object to avoid direct state mutation
    let newColumns = { ...columns };

    // Shallow copy the source column's array
    const sourceItems = Array.from(newColumns[sourceColId]);
    const [movedItem] = sourceItems.splice(source.index, 1); // Remove the dragged item
    newColumns[sourceColId] = sourceItems; // Update the source column in newColumns

    if (sourceColId === destColId) {
      // Reordering within the same column
      sourceItems.splice(destination.index, 0, movedItem); // Insert the item back
      newColumns[sourceColId] = sourceItems;
    } else {
      // Moving between columns
      // Shallow copy the destination column's array
      const destItems = Array.from(newColumns[destColId]);
      destItems.splice(destination.index, 0, movedItem); // Insert the item into the destination column
      newColumns[destColId] = destItems; // Update the destination column in newColumns

      // If moving a member from 'selectedTeam' back to an original roster, sort that roster to maintain original order
      if (sourceColId === 'selectedTeam' && destColId !== 'selectedTeam') {
        const originalOrder = ALL_MEMBERS[destColId].map(m => m.id);
        newColumns[destColId].sort((a, b) => originalOrder.indexOf(a.id) - originalOrder.indexOf(b.id));
      }
    }
    setColumns(newColumns);
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
  };

  const handleDeselectMember = () => {
    setSelectedMember(null);
  };

  const resetTeam = () => {
    // Reset columns to initial state with fresh shallow copies
    setColumns({
      ...Object.keys(ALL_MEMBERS).reduce((acc, key) => ({ ...acc, [key]: [...ALL_MEMBERS[key]] }), {}),
      selectedTeam: []
    });
    setSelectedProject(null);
  };

  // Load a pre-assembled team template
  const loadTeamTemplate = (templateKey) => {
    const template = PROJECT_TEMPLATES[templateKey];
    if (!template) return;

    // Reset first
    const freshColumns = Object.keys(ALL_MEMBERS).reduce((acc, key) => ({ ...acc, [key]: [...ALL_MEMBERS[key]] }), {});
    
    // Find all recommended members
    const allMembers = Object.values(ALL_MEMBERS).flat();
    const teamMembers = template.recommendedTeam
      .map(id => allMembers.find(m => m.id === id))
      .filter(Boolean);

    // Remove them from their original categories
    teamMembers.forEach(member => {
      const category = Object.keys(ALL_MEMBERS).find(cat => 
        ALL_MEMBERS[cat].some(m => m.id === member.id)
      );
      if (category) {
        freshColumns[category] = freshColumns[category].filter(m => m.id !== member.id);
      }
    });

    setColumns({
      ...freshColumns,
      selectedTeam: teamMembers
    });
    setSelectedProject(templateKey);
    setShowProjectTemplates(false);
  };

  // Calculate team stats
  const calculateTeamStats = () => {
    if (columns.selectedTeam.length === 0) {
      return { engineering: 0, product: 0, delivery: 0, strategy: 0, avgPower: 0 };
    }
    
    const totals = columns.selectedTeam.reduce((acc, member) => ({
      engineering: acc.engineering + member.stats.engineering,
      product: acc.product + member.stats.product,
      delivery: acc.delivery + member.stats.delivery,
      strategy: acc.strategy + member.stats.strategy,
    }), { engineering: 0, product: 0, delivery: 0, strategy: 0 });

    const count = columns.selectedTeam.length;
    const stats = {
      engineering: Math.round(totals.engineering / count),
      product: Math.round(totals.product / count),
      delivery: Math.round(totals.delivery / count),
      strategy: Math.round(totals.strategy / count),
    };
    stats.avgPower = Math.round((stats.engineering + stats.product + stats.delivery + stats.strategy) / 4);
    
    return stats;
  };

  // Check if team meets project requirements
  const meetsRequirements = () => {
    if (!selectedProject || columns.selectedTeam.length === 0) return null;
    const template = PROJECT_TEMPLATES[selectedProject];
    const teamStats = calculateTeamStats();
    
    return {
      engineering: teamStats.engineering >= template.requiredSkills.engineering,
      product: teamStats.product >= template.requiredSkills.product,
      delivery: teamStats.delivery >= template.requiredSkills.delivery,
      strategy: teamStats.strategy >= template.requiredSkills.strategy,
    };
  };

  // Helper function to find the original category of a member by its ID
  const getCategoryForMember = (memberId) => {
    for (const category of Object.keys(ALL_MEMBERS)) {
      if (ALL_MEMBERS[category].some((m) => m.id === memberId)) {
        return category;
      }
    }
    return null;
  };

  // Handle email signup
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmittingEmail(true);
    try {
      // Send to backend newsletter API
      const response = await fetch('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await response.json();

      if (data.success) {
        // Store email in localStorage
        localStorage.setItem('feelize_user_email', emailInput);
        setUserEmail(emailInput);
        setShowEmailPrompt(false);
        setEmailInput('');
        
        alert('🎉 Successfully signed up! You now have full access to AI features.');
      } else {
        alert(data.message || 'Failed to sign up. Please try again.');
      }
      
    } catch (error) {
      console.error('Email signup error:', error);
      alert('Failed to sign up. Please try again.');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // Check if user has access (signed up)
  const hasAccess = () => {
    return userEmail || localStorage.getItem('feelize_user_email');
  };

  // Handle Lock In Team button
  const handleLockInTeam = async () => {
    if (columns.selectedTeam.length === 0) return;
    
    if (!hasAccess()) {
      setShowEmailPrompt(true);
      return;
    }

    // Create project with team
    try {
      const email = userEmail || localStorage.getItem('feelize_user_email');
      const projectData = {
        email,
        projectType: selectedProject || 'custom',
        team: columns.selectedTeam.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role,
          stats: m.stats
        })),
        teamStats: calculateTeamStats()
      };

      // Send to backend API to create project
      const response = await fetch('http://localhost:3000/api/newsletter/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Project created:', data.project);
        
        // Store project ID in localStorage for later use
        localStorage.setItem('current_project_id', data.project.id);
        
        // Navigate to StartProject page with project data
        window.location.href = createPageUrl("StartProject");
      } else {
        alert(data.message || 'Failed to create project. Please try again.');
      }
      
    } catch (error) {
      console.error('Project creation error:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('feelize_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white relative overflow-hidden p-8">
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

      {/* Access Status Indicator */}
      {hasAccess() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 right-8 z-20"
        >
          <div className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/50 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">Signed Up - Full Access</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-7xl lg:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] mb-6">
            🎲 Assemble Your<br />
            <span className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent">Epic Team</span>
          </h1>
          <p className="text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl mx-auto mb-6">
            Choose a project type for instant recommendations, or build your custom dream team champion by champion.
          </p>
          
          {/* Project Template Selector */}
          <div className="flex justify-center gap-3 mb-6 flex-wrap max-w-5xl mx-auto">
            {Object.entries(PROJECT_TEMPLATES).map(([key, template]) => (
              <Button
                key={key}
                onClick={() => loadTeamTemplate(key)}
                variant={selectedProject === key ? "default" : "outline"}
                className={`
                  ${selectedProject === key 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0' 
                    : 'bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700/50'}
                  transition-all
                `}
              >
                <template.icon className="w-4 h-4 mr-2" />
                {template.name}
              </Button>
            ))}
          </div>
          
          {/* Team Stats Summary */}
          {columns.selectedTeam.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex gap-4 px-8 py-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl shadow-2xl"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{columns.selectedTeam.length}</div>
                <div className="text-xs text-gray-400">Champions</div>
              </div>
              <div className="w-px bg-purple-500/30"></div>
              {(() => {
                const stats = calculateTeamStats();
                const requirements = meetsRequirements();
                return (
                  <>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${requirements?.engineering ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {stats.engineering}
                      </div>
                      <div className="text-xs text-gray-400">Engineering</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${requirements?.product ? 'text-purple-400' : 'text-purple-600'}`}>
                        {stats.product}
                      </div>
                      <div className="text-xs text-gray-400">Product</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${requirements?.delivery ? 'text-green-400' : 'text-green-600'}`}>
                        {stats.delivery}
                      </div>
                      <div className="text-xs text-gray-400">Delivery</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${requirements?.strategy ? 'text-orange-400' : 'text-orange-600'}`}>
                        {stats.strategy}
                      </div>
                      <div className="text-xs text-gray-400">Strategy</div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
          
          {/* Project Requirements Indicator */}
          {selectedProject && columns.selectedTeam.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm"
            >
              {(() => {
                const requirements = meetsRequirements();
                const allMet = requirements && Object.values(requirements).every(v => v);
                return allMet ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300">Team meets all project requirements! 🎉</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                    <span className="text-yellow-300">Team needs more balanced skills for this project</span>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </motion.div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row gap-8 relative z-10">

          {/* Left Panel: Champion Roster */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-['Bricolage_Grotesque']">Available Champions</h2>
              </div>
              <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
                {Object.entries(columns).map(([key, members]) => {
                  if (key === 'selectedTeam' || members.length === 0) return null;
                  return (
                    <div key={key}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${CATEGORY_STYLES[key]?.bg}`}></div>
                        <h3 className="text-xl font-semibold capitalize text-purple-300 font-['Bricolage_Grotesque']">
                          {CATEGORY_STYLES[key]?.name || key}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent"></div>
                      </div>
                      <Droppable droppableId={key} direction="horizontal">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex flex-wrap gap-4">

                            {members.map((member, index) => (
                              <Draggable key={member.id} draggableId={member.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    onClick={() => handleSelectMember(member)}
                                    className={`transition-all duration-300 ${
                                      snapshot.isDragging 
                                        ? 'scale-110 !opacity-100 rotate-3 drop-shadow-2xl shadow-cyan-500/50' 
                                        : ''
                                    }`}
                                    style={{
                                      ...provided.draggableProps.style,
                                      ...(snapshot.isDragging && {
                                        boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)',
                                        filter: 'brightness(1.2)',
                                      })
                                    }}>

                                    <MemberCard member={member} category={key} />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Your Team & Details */}
          <div className="lg:w-1/3 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl flex-grow flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Swords className="w-8 h-8 text-blue-400" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-['Bricolage_Grotesque']">Your Party</h2>
                </div>
                {columns.selectedTeam.length > 0 && (
                  <Button
                    onClick={resetTeam}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <Droppable droppableId="selectedTeam">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[300px] p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
                      snapshot.isDraggingOver 
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/30 scale-[1.02]' 
                        : 'border-slate-700'
                    }`}>

                    {columns.selectedTeam.length > 0 ?
                      columns.selectedTeam.map((member, index) => (
                        <Draggable key={member.id} draggableId={member.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleSelectMember(member)}
                              className={`transition-all duration-200 ${
                                snapshot.isDragging 
                                  ? 'scale-105 rotate-1' 
                                  : ''
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                                ...(snapshot.isDragging && {
                                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)',
                                  filter: 'brightness(1.1)',
                                })
                              }}>

                              <LockedMemberCard member={member} />
                            </div>
                          )}
                        </Draggable>
                      )) :

                      <div className="flex items-center justify-center h-full text-slate-500">
                        <p>Drag members here</p>
                      </div>
                    }
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="flex-grow" /> {/* Spacer */}
              {columns.selectedTeam.length > 0 &&
                <TeamAnalysis team={columns.selectedTeam} roster={ALL_MEMBERS} />
              }
              <div className="space-y-3 mt-6">
                {!hasAccess() && columns.selectedTeam.length > 0 && (
                  <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg text-center">
                    <p className="text-sm text-yellow-300 mb-2">🔒 Sign up for our newsletter to generate project reports!</p>
                  </div>
                )}
                <div className="flex gap-4">
                  <Button 
                    onClick={handleLockInTeam}
                    disabled={columns.selectedTeam.length === 0} 
                    className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold hover:from-cyan-500 hover:to-blue-600"
                  >
                    {hasAccess() ? 'Lock In Team & Generate Report' : 'Lock In Team (Sign Up Required)'}
                  </Button>
                  <Button variant="outline" onClick={resetTeam} className="bg-background text-blue-950 px-4 py-2 text-sm font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10">Reset</Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DragDropContext>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember &&
          <MemberDetailPanel member={selectedMember} onDeselect={handleDeselectMember} />
        }
      </AnimatePresence>

      {/* Email Signup Modal */}
      <AnimatePresence>
        {showEmailPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEmailPrompt(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 rounded-2xl border-2 border-purple-500/30 overflow-hidden p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Unlock AI-Powered Reports</h2>
                <p className="text-slate-400">Sign up for our newsletter to generate project reports and access all AI features!</p>
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowEmailPrompt(false)}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingEmail}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold"
                  >
                    {isSubmittingEmail ? 'Signing Up...' : 'Sign Up & Continue'}
                  </Button>
                </div>
              </form>

              <p className="text-xs text-slate-500 text-center mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

};

// New MemberCard design with D&D-style stats
const MemberCard = ({ member, category }) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.consultants;
  const avgPower = Math.round((member.stats.engineering + member.stats.product + member.stats.delivery + member.stats.strategy) / 4);

  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-32 h-48 rounded-xl overflow-hidden cursor-pointer group border-2 ${style.border} hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 bg-slate-900`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-60 group-hover:opacity-80 transition-opacity`} />
      <img src={member.avatar} alt={member.name} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 blur-sm scale-110 group-hover:scale-100 transition-all duration-500" />

      <div className="relative z-10 flex flex-col items-center h-full p-2 text-center">
        {/* Avatar with Power Level Badge */}
        <div className="relative mb-2">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-cyan-400/50 transition-colors">
            <img src={member.avatar.replace('size=256', 'size=128')} alt={member.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-black text-slate-900 shadow-lg">
            {avgPower}
          </div>
        </div>

        {/* Name & Role */}
        <h4 className="font-bold text-xs text-white leading-tight drop-shadow-md">{member.name}</h4>
        <p className="text-[10px] text-slate-300 leading-tight mb-2">{member.role}</p>

        {/* Stat Bars - normalized to 0-10 scale displayed as percentage */}
        <div className="w-full space-y-1 mt-auto">
          {[
            { label: 'ENG', value: member.stats.engineering, color: 'from-cyan-500 to-blue-500' },
            { label: 'PRD', value: member.stats.product, color: 'from-purple-500 to-pink-500' },
            { label: 'DEL', value: member.stats.delivery, color: 'from-green-500 to-emerald-500' },
            { label: 'STR', value: member.stats.strategy, color: 'from-orange-500 to-red-500' }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-[8px] text-slate-400 w-6 text-left font-bold">{stat.label}</span>
              <div className="flex-1 h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / 10) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                />
              </div>
              <span className="text-[8px] text-slate-500 w-3 text-right">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Icon */}
        <div className="mt-2">
          <member.icon className={`w-4 h-4 text-white/70 group-hover:text-cyan-300 transition-colors`} />
        </div>
      </div>
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
    </motion.div>);

};

const LockedMemberCard = ({ member }) => {
  const avgPower = Math.round((member.stats.engineering + member.stats.product + member.stats.delivery + member.stats.strategy) / 4);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 p-3 bg-slate-800/70 backdrop-blur-xl rounded-lg border border-purple-500/30 cursor-pointer hover:bg-slate-700/70 hover:border-purple-400/50 transition-all group"
    >
      <div className="relative">
        <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-md object-cover" />
        <div className={`absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full border border-purple-500/30`}>
          <member.icon className={`w-4 h-4 ${member.color}`} />
        </div>
        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-lg">
          {avgPower}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white text-sm truncate">{member.name}</h4>
        <p className="text-xs text-slate-400 truncate">{member.role}</p>
        {/* Mini stat indicators - normalized to 0-10 scale */}
        <div className="flex gap-1 mt-1">
          {[
            { value: member.stats.engineering, color: 'bg-cyan-500' },
            { value: member.stats.product, color: 'bg-purple-500' },
            { value: member.stats.delivery, color: 'bg-green-500' },
            { value: member.stats.strategy, color: 'bg-orange-500' }
          ].map((stat, i) => (
            <div key={i} className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${(stat.value / 10) * 100}%` }} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};


const MemberDetailPanel = ({ member, onDeselect }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onDeselect}
    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">

    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-4xl h-[80vh] bg-slate-900 rounded-2xl border-2 border-purple-500/30 overflow-hidden flex">

      {/* Left side - Splash Art */}
      <div className="w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-cyan-500 opacity-30" />
        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover object-center grayscale contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <h2 className="text-4xl font-black text-white">{member.name}</h2>
          <h3 className="text-xl text-slate-300">{member.role}</h3>
        </div>
      </div>

      {/* Right side - Details */}
      <div className="w-2/3 p-8 overflow-y-auto">
        <button onClick={onDeselect} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X /></button>
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-2">Lore</h4>
            <p className="text-slate-300 leading-relaxed">{member.bio}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">Abilities</h4>
            <div className="grid grid-cols-2 gap-4">
              {member.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 flex-shrink-0 bg-slate-800 rounded-md flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-white">{skill}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-2">Ultimate Ability</h4>
            <div className="p-4 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-yellow-300">{member.superpower.name}</h5>
                  <p className="text-slate-300">{member.superpower.description}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Enhanced: Member Stats in Detail Panel */}
          {member.stats &&
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">Champion Stats</h4>
              <div className="space-y-3">
                {[
                  { label: 'Engineering', value: member.stats.engineering, color: 'from-cyan-500 to-blue-500', icon: Code2 },
                  { label: 'Product/Design', value: member.stats.product, color: 'from-purple-500 to-pink-500', icon: Palette },
                  { label: 'Delivery/Process', value: member.stats.delivery, color: 'from-green-500 to-emerald-500', icon: TrendingUp },
                  { label: 'Strategy', value: member.stats.strategy, color: 'from-orange-500 to-red-500', icon: BrainCircuit }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <stat.icon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">{stat.label}</span>
                      </div>
                      <span className="text-lg font-bold text-white">{stat.value}/10</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.value / 10) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-300 font-semibold">Overall Power</span>
                  <span className="text-2xl font-black text-yellow-400">
                    {Math.round((member.stats.engineering + member.stats.product + member.stats.delivery + member.stats.strategy) / 4)}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </motion.div>
  </motion.div>
);


// New TeamAnalysis Component
const TeamAnalysis = ({ team, roster }) => {
  const [teamStats, setTeamStats] = useState({ engineering: 0, product: 0, delivery: 0, strategy: 0 });

  useEffect(() => {
    if (team.length === 0) {
      setTeamStats({ engineering: 0, product: 0, delivery: 0, strategy: 0 });
      return;
    }

    // Calculate the maximum score for each category from the selected team
    const maxStats = team.reduce((max, member) => {
      max.engineering = Math.max(max.engineering, member.stats.engineering);
      max.product = Math.max(max.product, member.stats.product);
      max.delivery = Math.max(max.delivery, member.stats.delivery);
      max.strategy = Math.max(max.strategy, member.stats.strategy);
      return max;
    }, { engineering: 0, product: 0, delivery: 0, strategy: 0 });

    setTeamStats(maxStats);
  }, [team]);

  const getEvaluationMessage = () => {
    if (team.length === 0) return "Assemble your team to get an analysis.";

    let advice = "";
    const categories = ["engineering", "product", "delivery", "strategy"];
    const categoryLabels = {
      engineering: "Engineering",
      product: "Product & Design",
      delivery: "Delivery & Process",
      strategy: "Strategy"
    };

    // Check for non-maximized stats and suggest additions
    for (const category of categories) {
      if (teamStats[category] < 10) {
        // Find a candidate in the full ALL_MEMBERS roster
        // who has a 10 in this category and is NOT already in the selectedTeam
        let candidate = null;
        for (const originalCategoryKey in ALL_MEMBERS) {
          if (ALL_MEMBERS.hasOwnProperty(originalCategoryKey)) {
            const membersInOriginalCategory = ALL_MEMBERS[originalCategoryKey];
            candidate = membersInOriginalCategory.find(m =>
              m.stats[category] === 10 && !team.some(teamMember => teamMember.id === m.id)
            );
            if (candidate) break;
          }
        }

        if (candidate) {
          advice = `To maximize your team's ${categoryLabels[category]} potential, consider adding ${candidate.name}, whose expertise is a perfect fit for this role.`;
          break; // Only give one piece of advice at a time
        }
      }
    }

    if (advice) return advice;

    const allStatsMaxed = categories.every(cat => teamStats[cat] === 10);
    if (allStatsMaxed) {
      return "This team is a powerhouse! All core competencies are maximized for peak performance.";
    } else {
      // If not all stats are maxed but no specific '10-skill' candidate was found for improvement.
      return "Your team is looking strong and well-rounded. Consider reviewing individual member stats for further optimization.";
    }
  };

  const StatBar = ({ label, value, color }) => (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-bold text-white">{value.toFixed(1)}</span>
      </div>
      <Progress value={value * 10} className={`h-2 ${color}`} />
    </div>
  );


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4">

      <div>
        <h3 className="text-lg font-bold text-purple-400 mb-3">Team DNA</h3>
        <div className="space-y-3">
          <StatBar label="Engineering" value={teamStats.engineering} color="[&>div]:bg-red-500" />
          <StatBar label="Product/Design" value={teamStats.product} color="[&>div]:bg-yellow-500" />
          <StatBar label="Delivery" value={teamStats.delivery} color="[&>div]:bg-green-500" />
          <StatBar label="Strategy" value={teamStats.strategy} color="[&>div]:bg-cyan-500" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-purple-400 mb-3">AI Coach Evaluation</h3>
        <div className="flex gap-3 items-start p-3 bg-slate-800/60 rounded-xl min-h-[60px]">
          <Bot className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
          <p className="text-slate-300 text-sm">{getEvaluationMessage()}</p>
        </div>
      </div>
    </motion.div>
  );

};

export default TeamBuilderPage;
