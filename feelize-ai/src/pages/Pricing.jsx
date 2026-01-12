
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  ShoppingCart,
  Server,
  TrendingUp,
  Clock, // Clock icon is now also used for the new hourly package
  MessageSquare
} from "lucide-react";

export default function PricingPage() {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const backgroundBlurs = [
    { left: '10%', top: '-200px' },
    { left: '70%', top: '-100px' },
    { left: '-142px', top: '1000px' },
    { left: '864px', top: '1500px' },
    { left: '191px', top: '800px' },
    { left: '1226px', top: '1200px' },
  ];

  const packages = [
    {
      id: "campaign",
      name: "Campaign Site",
      price: "$2,998",
      description: "Best for targeted campaigns or professional profile websites.",
      icon: Zap,
      features: [
        "AI-Powered Discovery",
        "5 x 1-Pager Landing Pages",
        "Custom Visual Design",
        "Lead Capture Forms",
        "Basic Analytics Integration",
        "Blazing Fast Performance",
      ],
      timeline: "1-2 weeks",
      color: "from-blue-400 to-cyan-500",
      buttonClass: "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-cyan-500/25 hover:shadow-cyan-500/40"
    },
    {
      id: "ecommerce",
      name: "E-commerce Pro",
      price: "$7,999",
      description: "A complete online store to sell your products at scale.",
      icon: ShoppingCart,
      features: [
        "Everything in Campaign, plus:",
        "Full E-commerce System",
        "Up to 100 Products",
        "Secure Payment Gateways",
        "Inventory Management",
        "Advanced SEO for Products",
      ],
      timeline: "4-6 weeks",
      color: "from-purple-400 to-pink-500",
      buttonClass: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-purple-500/25 hover:shadow-purple-500/50"
    },
    {
      id: "saas",
      name: "SaaS Platform",
      price: "$20,000+",
      description: "Full-scale custom software-as-a-service application.",
      icon: Server,
      features: [
        "Everything in E-commerce, plus:",
        "Custom Web Application",
        "User Authentication & Roles",
        "Complex Database Architecture",
        "Subscription/Billing Logic",
        "Scalable Cloud Infrastructure",
      ],
      timeline: "8-16 weeks",
      color: "from-orange-400 to-red-500",
      buttonClass: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-orange-500/25 hover:shadow-orange-500/50"
    },
    {
      id: "hourly",
      name: "Hourly Rate",
      price: "$75/hr",
      description: "For ongoing tasks, consultations, or small updates.",
      icon: Clock,
      features: [
        "Flexible Tasking",
        "Expert Consultation",
        "Code Maintenance",
        "Pay-as-you-go",
        "No long-term commitment",
        "Quick Turnaround",
      ],
      timeline: "On-Demand",
      color: "from-green-400 to-teal-500",
      buttonClass: "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white shadow-green-500/25 hover:shadow-green-500/50"
    }
  ];

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
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24">

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <Badge className="px-4 py-2 sm:px-6 sm:py-4 text-sm sm:text-base md:text-lg rounded-full bg-transparent border-none mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              ✨ Transparent Pricing • Maximum Value
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] mb-4 sm:mb-6 px-4">
              AI-Supercharged<br />
              <span className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent">Engineer Pricing</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl mx-auto px-4">
              Speed of AI + Quality of Professional Engineers = Unbeatable Value
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-stretch mb-8 sm:mb-12 md:mb-20">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:z-10"
              >
                <Card className="h-full bg-black/40 backdrop-blur-xl border-2 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 border-purple-500/30 hover:border-purple-400/70 shadow-2xl hover:shadow-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30" />

                  <CardContent className="relative p-4 sm:p-6 md:p-8 h-full flex flex-col">
                    <div className="flex-grow">
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex p-3 sm:p-4 bg-gradient-to-br from-[#0580E8] to-[#7000FF] rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6">
                          <pkg.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-['Bricolage_Grotesque']">{pkg.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm font-['Geist'] min-h-[2.5rem] sm:min-h-[3rem]">{pkg.description}</p>
                      </div>

                      <div className="text-center mb-6 sm:mb-8">
                        {pkg.id !== "hourly" && <p className="text-xs sm:text-sm text-gray-400 mb-1 font-['Geist']">Starting at</p>}
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Bricolage_Grotesque']">{pkg.price}</span>
                      </div>

                      <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600/20 rounded-full border border-purple-500/30">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                          <span className="text-gray-300 text-xs sm:text-sm font-['Geist']">{pkg.timeline}</span>
                        </div>
                      </div>

                      <ul className="space-y-2 sm:space-y-3">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 border border-purple-500/30">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                            </div>
                            <span className={`font-['Geist'] ${feature.includes('Everything') ? 'text-purple-400 font-semibold' : 'text-gray-300'
                              }`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 sm:mt-8">
                      <Link to={createPageUrl("StartProject")}>
                        <Button className="w-full font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:from-[#0580E8]/90 hover:to-[#7000FF]/90 text-white font-['Bricolage_Grotesque'] text-sm sm:text-base">
                          Get Started
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Custom Offer Box */}
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-purple-500/10 opacity-30" />
            <CardContent className="relative p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="grid md:grid-cols-3 items-center gap-6 sm:gap-8">
                <div className="md:col-span-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0580E8] to-[#7000FF] rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-purple-500/30">
                    <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 font-['Bricolage_Grotesque']">
                    Need a Custom Solution?
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl font-['Geist']">
                    Have a unique project, a tight deadline, or specific enterprise needs? Let's talk. We build custom solutions tailored to your exact requirements with AI-supercharged efficiency.
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <Link to={createPageUrl("StartProject")}>
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:from-[#0580E8]/90 hover:to-[#7000FF]/90 text-white font-bold px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 font-['Bricolage_Grotesque']">
                      Contact Us
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
