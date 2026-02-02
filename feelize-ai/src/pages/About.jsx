import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Users, Sparkles, Target, Rocket, ArrowRight,
  Code2, Palette, BrainCircuit, Shield, Smartphone, Server
} from 'lucide-react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    id: 1,
    name: "Cory",
    role: "Chief Executive Officer",
    image: "https://ui-avatars.com/api/?name=Cory&background=0580E8&color=fff&size=256",
    bio: "Visionary leader steering Feelize's mission to revolutionize development with AI.",
    icon: Shield,
    color: "text-yellow-400"
  },
  {
    id: 2,
    name: "Bloch",
    role: "Founder & Architect",
    image: "https://ui-avatars.com/api/?name=Bloch&background=7000FF&color=fff&size=256",
    bio: "Architect of Feelize's foundation, weaving complex systems with AI innovation.",
    icon: BrainCircuit,
    color: "text-cyan-400"
  },
  {
    id: 3,
    name: "Alex Zordel",
    role: "Chief Technology Officer",
    image: "https://ui-avatars.com/api/?name=Alex+Zordel&background=0580E8&color=fff&size=256",
    bio: "Guardian of technical excellence, ensuring quality, security, and performance.",
    icon: Shield,
    color: "text-indigo-400"
  },
  {
    id: 4,
    name: "Victor",
    role: "Lead Developer",
    image: "https://ui-avatars.com/api/?name=Victor&background=06b6d4&color=fff&size=256",
    bio: "Master craftsman turning complex requirements into flawless, high-performance features.",
    icon: Code2,
    color: "text-blue-400"
  },
  {
    id: 5,
    name: "Debojit",
    role: "Lead Dev & Manager",
    image: "https://ui-avatars.com/api/?name=Debojit&background=14b8a6&color=fff&size=256",
    bio: "Dual-wielding master of code and process, ensuring seamless delivery.",
    icon: Code2,
    color: "text-teal-400"
  },
  {
    id: 6,
    name: "Zubayer",
    role: "Lead AI Engineer",
    image: "https://ui-avatars.com/api/?name=Zubayer&background=a855f7&color=fff&size=256",
    bio: "AI specialist implementing cutting-edge ML models that bring intelligence to life.",
    icon: BrainCircuit,
    color: "text-purple-400"
  },
  {
    id: 7,
    name: "Aleef",
    role: "Full-Stack Developer",
    image: "https://ui-avatars.com/api/?name=Aleef&background=64748b&color=fff&size=256",
    bio: "Backend architect building resilient server architectures and powerful APIs.",
    icon: Server,
    color: "text-slate-400"
  },
  {
    id: 8,
    name: "Adeyemi",
    role: "Flutter Developer",
    image: "https://ui-avatars.com/api/?name=Adeyemi&background=0ea5e9&color=fff&size=256",
    bio: "Mobile maestro crafting beautiful, native-performance applications.",
    icon: Smartphone,
    color: "text-sky-400"
  },
  {
    id: 9,
    name: "Thanesha",
    role: "Backend Developer",
    image: "https://ui-avatars.com/api/?name=Thanesha&background=f59e0b&color=fff&size=256",
    bio: "Builder of robust digital engines with scalable and secure backend systems.",
    icon: Server,
    color: "text-amber-400"
  },
  {
    id: 10,
    name: "Paul",
    role: "UI/UX Designer",
    image: "https://ui-avatars.com/api/?name=Paul&background=ec4899&color=fff&size=256",
    bio: "User champion designing beautiful and intuitive interfaces that delight.",
    icon: Palette,
    color: "text-pink-400"
  },
  {
    id: 11,
    name: "Ajit",
    role: "UI/UX Designer",
    image: "https://ui-avatars.com/api/?name=Ajit&background=f43f5e&color=fff&size=256",
    bio: "Visual virtuoso blending aesthetics with function in user-centric designs.",
    icon: Palette,
    color: "text-rose-400"
  },
  {
    id: 12,
    name: "Nyxxan",
    role: "UI/UX Designer",
    image: "https://ui-avatars.com/api/?name=Nyxxan&background=d946ef&color=fff&size=256",
    bio: "Experience weaver creating immersive and engaging user journeys.",
    icon: Palette,
    color: "text-fuchsia-400"
  }
];

const values = [
  {
    icon: Sparkles,
    title: "AI-Powered Innovation",
    description: "We leverage cutting-edge AI to accelerate development and deliver exceptional results faster than traditional agencies."
  },
  {
    icon: Target,
    title: "Client-Focused Excellence",
    description: "Your success is our mission. We work closely with clients to understand their vision and exceed expectations."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our diverse team of specialists brings deep expertise across development, design, and AI engineering."
  },
  {
    icon: Rocket,
    title: "Rapid Delivery",
    description: "We combine human expertise with AI tools to deliver projects 60% faster without compromising quality."
  }
];

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center p-2 bg-cyan-500/10 rounded-2xl mb-6">
            <Users className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Meet the Team</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We're a team of passionate developers, designers, and AI specialists
            dedicated to building exceptional digital experiences.
          </p>
        </motion.div>

        {/* Our Story Section */}
        <div className="glass-morphism rounded-3xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto space-y-4 text-slate-300 leading-relaxed">
            <p>
              Feelize was founded with a simple yet powerful vision: to revolutionize software
              development by combining human expertise with AI innovation. We believe that the
              future of development lies not in replacing human creativity, but in augmenting
              it with intelligent tools.
            </p>
            <p>
              Our team brings together seasoned developers, talented designers, and AI specialists
              who share a passion for creating exceptional digital products. We've successfully
              delivered projects across industries, from startups to enterprises, always maintaining
              our commitment to quality and innovation.
            </p>
            <p>
              Today, we're proud to be at the forefront of AI-powered development, helping businesses
              transform their ideas into reality faster and more efficiently than ever before.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            What Drives Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Our Leadership & Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-morphism rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 group"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-cyan-400/50 transition-all">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-slate-900 rounded-lg border border-cyan-500/30">
                    <member.icon className={`w-4 h-4 ${member.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-cyan-400 text-center mb-3">
                  {member.role}
                </p>
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center glass-morphism rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Work with Us?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's collaborate to bring your vision to life with our expert team and AI-powered approach.
          </p>
          <Link to={createPageUrl('StartProject')}>
            <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-8 py-6 rounded-xl text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 neon-glow">
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
