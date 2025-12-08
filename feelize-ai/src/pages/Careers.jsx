import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Briefcase, Users, Rocket, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Careers() {
    const values = [
        {
            icon: <Rocket className="w-8 h-8" />,
            title: "Innovation First",
            description: "Push boundaries and explore cutting-edge technologies"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Collaborative Culture",
            description: "Work with talented minds from around the world"
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Work-Life Balance",
            description: "Flexible schedules and remote-friendly environment"
        }
    ];

    const openPositions = [
        { role: "Senior Full-Stack Developer", type: "Full-Time", location: "Remote" },
        { role: "UI/UX Designer", type: "Full-Time", location: "Remote" },
        { role: "AI/ML Engineer", type: "Full-Time", location: "Remote" },
        { role: "Project Manager", type: "Full-Time", location: "Hybrid" }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-2 bg-cyan-500/10 rounded-2xl mb-6">
                        <Briefcase className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="gradient-text">Join Our Team</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Be part of a team that's shaping the future of development.
                        We're looking for passionate individuals who want to make an impact.
                    </p>
                </div>

                {/* Values */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="glass-morphism rounded-3xl p-8 text-center hover:scale-105 transition-transform duration-300"
                        >
                            <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 rounded-2xl mb-4 text-cyan-400">
                                {value.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                            <p className="text-slate-300">{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* Open Positions */}
                <div className="glass-morphism rounded-3xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Open Positions
                    </h2>
                    <div className="space-y-4">
                        {openPositions.map((position, index) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row md:items-center md:justify-between p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                            >
                                <div className="mb-4 md:mb-0">
                                    <h3 className="text-xl font-bold text-white mb-2">{position.role}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="px-3 py-1 bg-cyan-500/20 rounded-lg text-cyan-300 text-sm">
                                            {position.type}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-500/20 rounded-lg text-blue-300 text-sm">
                                            {position.location}
                                        </span>
                                    </div>
                                </div>
                                <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold">
                                    Apply Now
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Don't See Your Role?
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                        We're always looking for talented people. Send us your resume and let's talk!
                    </p>
                    <a href="mailto:careers@feelize.com">
                        <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-8 py-6 rounded-xl text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 neon-glow">
                            Get in Touch
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
