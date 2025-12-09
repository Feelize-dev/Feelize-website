import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MobileAppDevelopment() {
    const features = [
        "iOS App Development",
        "Android App Development",
        "Cross-Platform Solutions",
        "React Native Applications",
        "Flutter Development",
        "App Store Optimization"
    ];

    return (
        <div className="min-h-screen pt-32 pb-20">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-2xl mb-6">
                        <Smartphone className="w-12 h-12 text-purple-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="gradient-text">Mobile App Development</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Create stunning mobile experiences that users love. Native or cross-platform,
                        we build apps that stand out in the App Store and Google Play.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="glass-morphism rounded-3xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Our Mobile Expertise
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                            >
                                <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                                <span className="text-slate-200 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platforms */}
                <div className="glass-morphism rounded-3xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Platforms We Support
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['iOS', 'Android', 'React Native', 'Flutter', 'Firebase', 'Swift', 'Kotlin', 'App Store & Play Store'].map((tech) => (
                            <div
                                key={tech}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 text-purple-300 font-semibold"
                            >
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Let's Build Your Mobile App
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                        Transform your idea into a powerful mobile application that delights users.
                    </p>
                    <Link to={createPageUrl('StartProject')}>
                        <Button className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 text-black font-bold px-8 py-6 rounded-xl text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
                            Start Your Project
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
