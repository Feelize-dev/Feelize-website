import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="gradient-text">Get in Touch</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Have a project in mind? We'd love to hear from you. Schedule a meeting
                        with us directly to discuss your ideas.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Email */}
                        <div className="glass-morphism rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-cyan-500/10 rounded-xl">
                                    <Mail className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                                    <p className="text-slate-300 text-sm mb-2">Our team is here to help</p>
                                    <a
                                        href="mailto:info@feelize.com"
                                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                    >
                                        info@feelize.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="glass-morphism rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl">
                                    <Phone className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                                    <p className="text-slate-300 text-sm mb-2">Mon-Fri from 9am to 6pm</p>
                                    <a
                                        href="tel:+18002279944"
                                        className="text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        (800) 227-9944
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cal.com Embed */}
                    <div className="lg:col-span-2">
                        <div className="glass-morphism rounded-2xl overflow-hidden h-full min-h-[700px]">
                            <iframe
                                src={`https://cal.com/evuventure/30min${sessionStorage.getItem("referral_code") ? `?referral_code=${sessionStorage.getItem("referral_code")}` : ""}`}
                                style={{ width: "100%", height: "100%", minHeight: "700px" }}
                                frameBorder="0"
                                title="Schedule a meeting"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Map or Additional Info Section */}
                <div className="glass-morphism rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Start Your Project?
                    </h2>
                    <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                        Whether you have a detailed plan or just an idea, we're here to help bring your vision to life.
                        Let's create something amazing together.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="mailto:info@feelize.com">
                            <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                                Email Us Directly
                            </Button>
                        </a>
                        <a href="tel:+18002279944">
                            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                                Call Us Now
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
