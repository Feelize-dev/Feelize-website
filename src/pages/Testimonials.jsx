import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Star,
  Quote,
  TrendingUp,
  Zap,
  Clock,
  Heart,
  Users,
  ArrowRight,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function TestimonialsPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "CEO",
      company: "TechFlow Innovations",
      project: "SaaS Dashboard Platform",
      rating: 5,
      quote: "Feelize delivered beyond our wildest expectations. Their AI-powered approach cut our development time in half while maintaining premium quality. The team's expertise and communication were flawless throughout.",
      results: "500% increase in user engagement",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Founder",
      company: "EcoMarket Pro",
      project: "E-commerce Platform",
      rating: 5,
      quote: "Working with Feelize was a game-changer for our business. Their AI integration helped us achieve conversion rates we never thought possible. The ROI was immediate and substantial.",
      results: "300% increase in sales",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      name: "Emily Chen",
      role: "Marketing Director",
      company: "HealthFirst Solutions",
      project: "Campaign Landing Pages",
      rating: 5,
      quote: "The speed and quality of delivery was incredible. Feelize's AI-enhanced process meant we could launch our campaign weeks ahead of schedule with results that exceeded all our KPIs.",
      results: "450% increase in qualified leads",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "CTO",
      company: "DataStream Analytics",
      project: "Custom SaaS Application",
      rating: 5,
      quote: "Feelize combines human expertise with AI efficiency like no other team I've worked with. They solved complex technical challenges while maintaining clear communication and meeting every deadline.",
      results: "60% reduction in operational costs",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Business Owner",
      company: "Luxury Lifestyle Co.",
      project: "E-commerce + Brand Site",
      rating: 5,
      quote: "From concept to launch, Feelize exceeded every expectation. Their AI tools helped us understand our customers better and create an experience that drives real business results.",
      results: "250% improvement in customer retention",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      color: "from-teal-500 to-blue-500"
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "100+",
      label: "Happy Clients",
      color: "text-cyan-400"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
      color: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      value: "300%",
      label: "Avg ROI Increase",
      color: "text-green-400"
    },
    {
      icon: Clock,
      value: "50%",
      label: "Faster Delivery",
      color: "text-purple-400"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 rounded-full border border-yellow-500/30 mb-8 backdrop-blur-xl">
              <Heart className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Client Love • Real Results</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">
              What Our Clients Say
              <span className="block gradient-text">About Working With Us</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              Don't just take our word for it. See what business leaders are saying about our AI-powered approach to development and the results we've delivered together.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-morphism border border-white/10 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Main Testimonial */}
          <div 
            className="mb-20"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <Card className="max-w-5xl mx-auto glass-morphism border border-white/20 rounded-3xl overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${currentData.color} opacity-5`} />
              
              <CardContent className="relative p-12">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  
                  {/* Quote Side */}
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <Quote className="w-12 h-12 text-cyan-400 mb-4 opacity-50" />
                      <p className="text-2xl lg:text-3xl text-white leading-relaxed font-light">
                        "{currentData.quote}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <img 
                        src={currentData.avatar} 
                        alt={currentData.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/30"
                      />
                      <div>
                        <h4 className="text-white font-bold text-lg">{currentData.name}</h4>
                        <p className="text-slate-400">{currentData.role}, {currentData.company}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(currentData.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Side */}
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Award className="w-5 h-5 text-cyan-400" />
                        Project
                      </h5>
                      <p className="text-slate-300">{currentData.project}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Key Result
                      </h5>
                      <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-sm py-2 px-4">
                        {currentData.results}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-slate-800/50 text-white hover:bg-cyan-400/20 hover:text-cyan-400 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-cyan-400 w-8' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-slate-800/50 text-white hover:bg-cyan-400/20 hover:text-cyan-400 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Additional Testimonials Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">More Success Stories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.filter((_, index) => index !== currentTestimonial).slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="glass-morphism border border-white/10 rounded-3xl p-6 hover:border-cyan-400/30 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                      <p className="text-slate-400 text-xs">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "{testimonial.quote.substring(0, 100)}..."
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
                  Ready to Become Our 
                  <span className="block gradient-text mt-2">Next Success Story?</span>
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Join the growing list of satisfied clients who've experienced the power of AI-enhanced development. Your success story starts with a simple conversation.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-12 py-6 text-lg rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
                    Start Your Project Today
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