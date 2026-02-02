import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Shield, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Cybersecurity() {
    const features = [
        "Security Audits & Assessments",
        "Penetration Testing",
        "Vulnerability Management",
        "Secure Code Review",
        "Compliance & Regulations",
        "Incident Response Planning"
    ];

    return (
        <div className="min-h-screen pt-32 pb-20">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-2 bg-cyan-500/10 rounded-2xl mb-6">
                        <Shield className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="gradient-text">Cybersecurity</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Protect your digital assets with enterprise-grade security solutions.
                        Stay ahead of threats with proactive cybersecurity measures.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="glass-morphism rounded-3xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Security Services
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                            >
                                <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                                <span className="text-slate-200 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack Preview */}
                <div className="glass-morphism rounded-3xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Security Tools & Standards
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['OWASP', 'SSL/TLS', 'OAuth 2.0', 'JWT', 'Firewall', 'WAF', 'SIEM', 'Zero Trust'].map((tech) => (
                            <div
                                key={tech}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30 text-cyan-300 font-semibold"
                            >
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to Secure Your Business?
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                        Let's build a comprehensive security strategy to protect your assets.
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
