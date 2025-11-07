
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

  const packages = [
    {
      id: "campaign",
      name: "Campaign Site",
      price: "$2,999",
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
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-slate-800/50 rounded-full border border-green-500/30 mb-6 sm:mb-8 backdrop-blur-xl">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs sm:text-sm font-medium">Transparent Pricing • Maximum Value</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6">
              Premium Quality,
              <span className="block gradient-text">AI-Accelerated Pricing</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-6 sm:mb-8">
              Our AI-powered efficiency means you get top-tier agency quality without the premium price tag. Smart technology, smarter pricing.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch mb-12 sm:mb-20">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="transition-all duration-300 ease-in-out hover:!scale-105 hover:-translate-y-2 sm:hover:-translate-4 hover:z-10"
              >
                <Card className="h-full glass-morphism border-2 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 border-white/20 hover:border-cyan-400/50 shadow-xl shadow-black/20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-5`} />
                  
                  <CardContent className="relative p-6 sm:p-8 h-full flex flex-col">
                    <div className="flex-grow">
                      <div className="text-center mb-6 sm:mb-8">
                        <div className={`inline-flex p-3 sm:p-4 bg-gradient-to-br ${pkg.color} rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6`}>
                          <pkg.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                        <p className="text-slate-400 text-sm h-10 sm:h-12">{pkg.description}</p>
                      </div>

                      <div className="text-center mb-6 sm:mb-8">
                        {pkg.id !== "hourly" && <p className="text-sm text-slate-400 mb-1">Starting at</p>}
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">{pkg.price}</span>
                      </div>

                      <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 rounded-full">
                          <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400" />
                          <span className="text-slate-300 text-xs sm:text-sm">{pkg.timeline}</span>
                        </div>
                      </div>

                      <ul className="space-y-2 sm:space-y-3">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div className="w-4 sm:w-5 h-4 sm:h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-400" />
                            </div>
                            <span className={`${
                              feature.includes('Everything') ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                            }`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 sm:mt-8">
                      <Link to={createPageUrl("StartProject")}>
                        <Button className={`w-full font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${pkg.buttonClass}`}>
                          Get Started
                          <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Custom Offer Box */}
          <Card className="glass-morphism border border-cyan-400/30 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
            <CardContent className="relative p-6 sm:p-8 lg:p-12">
                <div className="grid md:grid-cols-3 items-center gap-6 sm:gap-8">
                    <div className="md:col-span-2">
                        <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-cyan-500/30">
                            <MessageSquare className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                            Need a Custom Solution?
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg max-w-2xl">
                            Have a unique project, a tight deadline, or specific enterprise needs? Let's talk. We build custom solutions tailored to your exact requirements.
                        </p>
                    </div>
                    <div className="text-center md:text-right">
                        <Link to={createPageUrl("StartProject")}>
                            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
                                Contact Us
                                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3" />
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
