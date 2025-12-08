import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Branding() {
    const features = [
        "Brand Strategy & Identity",
        "Logo Design & Branding",
        "Brand Guidelines",
        "Marketing Collateral",
        "Social Media Assets",
        "Brand Voice & Messaging"
    ];

    return (
        <div className="min-h-screen pt-32 pb-20">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-2 bg-orange-500/10 rounded-2xl mb-6">
                        <Sparkles className="w-12 h-12 text-orange-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="gradient-text">Branding</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Build a brand that resonates and stands the test of time. From identity to strategy,
                        we craft brands that make lasting impressions.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="glass-morphism rounded-3xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Branding Services
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                            >
                                <CheckCircle2 className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                                <span className="text-slate-200 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deliverables */}
                <div className="glass-morphism rounded-3xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        What You'll Get
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Logo Files', 'Brand Book', 'Color Palette', 'Typography', 'Business Cards', 'Stationery', 'Social Templates', 'Brand Guidelines'].map((item) => (
                            <div
                                key={item}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-500/30 text-orange-300 font-semibold"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Let's Build Your Brand
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                        Create a memorable brand identity that sets you apart from the competition.
                    </p>
                    <Link to={createPageUrl('StartProject')}>
                        <Button className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-300 hover:to-yellow-400 text-black font-bold px-8 py-6 rounded-xl text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105">
                            Start Your Project
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
