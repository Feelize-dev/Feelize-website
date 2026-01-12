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

  const backgroundBlurs = [
    { left: '10%', top: '-200px' },
    { left: '70%', top: '-100px' },
    { left: '-142px', top: '1000px' },
    { left: '864px', top: '1500px' },
    { left: '191px', top: '800px' },
    { left: '1226px', top: '1200px' },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Vernon Attles",
      role: "President, CEO",
      company: "PressEmporium",
      project: "Digital Platform Development",
      rating: 5,
      quote: "Feelize is one of the greatest groups of creative minds and coding professionals that I have ever had the opportunity to work with. They ride the cutting edge of AI tech and their creativity and skill are phenomenal. Working with Feelize has been truly rewarding. Their technical execution is dependable, their project coordination is clear and organized, and they consistently take ownership of their responsibilities from start to finish. Beyond execution, their creativity and attention to detail set them apart, resulting in outcomes that reflect a strong professional standard and thoughtful craftsmanship.",
      results: "Exceptional Craftsmanship",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      name: "Utkarsh Srivastava",
      role: "Founder & Managing Partner",
      company: "Adjuva Legal",
      project: "Legal Tech Solutions",
      rating: 5,
      quote: "I am honored to vouch for Feelize. Their standard of code development, project custodianship, accountability in delivery, and overall project management reflects exceptional quality. The team demonstrates a strong sense of ownership at every stage. Their creativity and technical execution consistently stand at an outstanding level, making them a reliable and trusted partner for projects.",
      results: "Outstanding Technical Execution",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      name: "Sal Austin",
      role: "Senior VP",
      company: "DGX Security",
      project: "Corporate Website (dgxllc.com)",
      rating: 5,
      quote: "I confidently recommend Feelize for their outstanding professionalism and consistency. Their technical expertise, responsible ownership of work, and structured approach to project execution make them a dependable partner. What truly sets them apart is their ability to combine creativity with precision to deliver high-quality results every time. Their incredible work on www.dgxllc.com has proven to be worth its weight in diamonds.",
      results: "High-value Delivery",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      name: "Richard Weiner",
      role: "CEO",
      company: "ABCVI",
      project: "Enterprise Solution",
      rating: 5,
      quote: "Feelize delivers a rare combination of technical skill, accountability, and creative insight. They manage projects with clarity and discipline, ensuring transparency and timely execution. The team's attention to detail and innovative thinking consistently result in outcomes that exceed expectations.",
      results: "Exceeded Expectations",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      name: "Sandy Weberman",
      role: "Owner",
      company: "Sandy Creative",
      project: "Creative Web Development",
      rating: 5,
      quote: "Feelize stands out through a rare combination of technical skill, responsible execution, and thoughtful creativity. Their development practices are well-structured, project delivery is handled with discipline, and the final output consistently reflects attention to detail. Working with Feelize is a reassuring experience from start to finish.",
      results: "Disciplined Delivery",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      color: "from-teal-500 to-blue-500"
    },
    {
      id: 6,
      name: "Neal Elefant",
      role: "President",
      company: "Business Leader",
      project: "AI Web & App Design",
      rating: 5,
      quote: "Feelize is at the forefront of AI Web and app design. Contact them for your next project or to add new life to your existing Website.",
      results: "Cutting Edge Design",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      color: "from-indigo-500 to-purple-500"
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
    <div className="min-h-screen bg-[#0A0E14] text-white relative">
      {/* Fixed Background with Gradient Ellipses */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {backgroundBlurs.map((pos, i) => (
          <div
            key={i}
            className="absolute w-[300px] h-[300px] md:w-[542px] md:h-[494px] rounded-full blur-[75px]"
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
        <div className="container mx-auto px-4 py-12 md:px-16 md:py-24">

          {/* Header */}
          <div className="text-center mb-12 md:mb-20">
            <Badge className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-lg rounded-full bg-transparent border-none mb-4 md:mb-8">
              <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              ✨ Client Love • Real Results
            </Badge>

            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] mb-4 md:mb-6">
              What Our Clients Say<br />
              <span className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent">About Working With Us</span>
            </h1>
            <p className="text-lg md:text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl mx-auto">
              Don't just take our word for it. See what business leaders are saying about our AI-supercharged engineers and the results we've delivered together.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-2xl bg-gradient-to-br from-[#0580E8] to-[#7000FF] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-purple-400 mb-1 md:mb-2 font-['Bricolage_Grotesque']">{stat.value}</h3>
                <p className="text-gray-400 text-xs md:text-sm font-['Geist']">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Main Testimonial */}
          <div
            className="mb-12 md:mb-20"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <Card className="max-w-5xl mx-auto bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30" />

              <CardContent className="relative p-6 md:p-12">
                <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-center">

                  {/* Quote Side */}
                  <div className="lg:col-span-2">
                    <div className="mb-4 md:mb-6">
                      <Quote className="w-8 h-8 md:w-12 md:h-12 text-purple-400 mb-2 md:mb-4 opacity-50" />
                      <p className="text-lg md:text-xl lg:text-2xl italic text-white leading-relaxed font-light font-['Geist']">
                        "{currentData.quote}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 md:mb-6">

                      <div>
                        <h4 className="text-white font-bold text-base md:text-lg font-['Bricolage_Grotesque']">{currentData.name}</h4>
                        <p className="text-gray-400 text-sm md:text-base font-['Geist']">{currentData.role}, {currentData.company}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(currentData.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-purple-400 text-purple-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Side */}
                  <div className="space-y-4 md:space-y-6 pt-6 border-t border-gray-700/50 lg:pt-0 lg:border-t-0">
                    <div>
                      <h5 className="text-white font-semibold mb-2 flex items-center gap-2 font-['Bricolage_Grotesque']">
                        <Award className="w-5 h-5 text-purple-400" />
                        Project
                      </h5>
                      <p className="text-gray-300 font-['Geist'] text-sm md:text-base">{currentData.project}</p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2 flex items-center gap-2 font-['Bricolage_Grotesque']">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        Key Result
                      </h5>
                      <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm py-2 px-4 font-['Geist'] whitespace-normal text-left">
                        {currentData.results}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-4 mt-6 md:mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-600/20 text-white hover:bg-purple-400/30 hover:text-purple-400 transition-all duration-300 border border-purple-500/30"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                      ? 'bg-purple-400 w-6 md:w-8'
                      : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-600/20 text-white hover:bg-purple-400/30 hover:text-purple-400 transition-all duration-300 border border-purple-500/30"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>

          {/* Additional Testimonials Grid */}
          <div className="mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12 font-['Bricolage_Grotesque']">More Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {testimonials.filter((_, index) => index !== currentTestimonial).slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 hover:border-purple-400/70 transition-all duration-300 hover:scale-105 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">

                    <div>
                      <h4 className="text-white font-semibold text-sm font-['Bricolage_Grotesque']">{testimonial.name}</h4>
                      <p className="text-gray-400 text-xs font-['Geist']">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-purple-400 text-purple-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm italic leading-relaxed font-['Geist']">
                    "{testimonial.quote.substring(0, 100)}..."
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30" />
              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 font-['Bricolage_Grotesque']">
                  Ready to Become Our
                  <span className="block bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent mt-2">Next Success Story?</span>
                </h2>
                <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto font-['Geist']">
                  Join the growing list of satisfied clients who've experienced the power of AI-supercharged engineers. Your success story starts with a simple conversation.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:from-[#0580E8]/90 hover:to-[#7000FF]/90 text-white font-bold px-6 py-4 md:px-12 md:py-6 text-base md:text-lg rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 font-['Bricolage_Grotesque']">
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