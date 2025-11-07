import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// ENHANCED: More vintage-authentic Jukebox Carousel
export default function JukeboxCarousel({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Jukebox Frame */}
      <div className="relative">
        {/* Main Jukebox Body */}
        <Card className="glass-morphism border-8 border-yellow-600/40 rounded-[3rem] overflow-hidden bg-gradient-to-br from-red-950/80 via-orange-950/80 to-yellow-950/80 shadow-[0_0_80px_rgba(251,191,36,0.3)]">
          <CardContent className="p-0">
            
            {/* Top Arch Section - More Retro */}
            <div className="relative bg-gradient-to-b from-yellow-600/30 to-transparent p-8 border-b-8 border-yellow-600/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.2),transparent)]" />
              
              {/* Vintage Neon Lights */}
              <div className="flex justify-center gap-6 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="relative"
                  >
                    {/* Outer glow ring */}
                    <motion.div
                      className="absolute inset-0 w-6 h-6 rounded-full blur-md"
                      style={{
                        background: ['#ff0080', '#ff8800', '#ffff00', '#00ff88', '#0088ff'][i]
                      }}
                      animate={{
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                    {/* Inner bulb */}
                    <motion.div
                      className="relative w-6 h-6 rounded-full border-3 border-white/30"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${['#ff0080', '#ff8800', '#ffff00', '#00ff88', '#0088ff'][i]}, ${['#cc0066', '#cc6600', '#cccc00', '#00cc66', '#0066cc'][i]})`
                      }}
                      animate={{
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              <h3 className="text-center text-3xl font-black text-yellow-200 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] tracking-wider" style={{ fontFamily: 'Impact, sans-serif', textShadow: '3px 3px 0px rgba(0,0,0,0.5)' }}>
                SELECT YOUR PROJECT
              </h3>
            </div>

            {/* Main Display Area */}
            <div className="relative p-10 bg-gradient-to-b from-black/60 to-black/80">
              {/* Vintage Bubble Tubes on Sides */}
              <div className="absolute left-6 top-0 bottom-0 w-12 flex flex-col justify-around">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="relative"
                  >
                    {/* Tube background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/50 to-cyan-700/50 rounded-full blur-sm" />
                    {/* Bubble */}
                    <motion.div
                      className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300/80 to-cyan-600/80 border-2 border-cyan-200/50"
                      style={{
                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.5)'
                      }}
                      animate={{
                        y: [0, -30, 0],
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="absolute right-6 top-0 bottom-0 w-12 flex flex-col justify-around">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="relative"
                  >
                    {/* Tube background */}
                    <div className="absolute inset-0 bg-gradient-to-l from-pink-900/50 to-pink-700/50 rounded-full blur-sm" />
                    {/* Bubble */}
                    <motion.div
                      className="relative w-10 h-10 rounded-full bg-gradient-to-br from-pink-300/80 to-pink-600/80 border-2 border-pink-200/50"
                      style={{
                        boxShadow: '0 0 20px rgba(236, 72, 153, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.5)'
                      }}
                      animate={{
                        y: [0, 30, 0],
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Project Display */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mx-20"
              >
                {/* Vintage Glass Display Frame */}
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 border-4 border-yellow-600/60 shadow-[0_0_40px_rgba(251,191,36,0.4),inset_0_0_40px_rgba(0,0,0,0.5)]">
                  {/* Chrome reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl pointer-events-none" />
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]" />
                  
                  <div className="relative space-y-5">
                    <div className="flex items-center justify-between">
                      <Badge className={`bg-gradient-to-r ${currentProject.color} text-white text-base px-5 py-2.5 font-bold shadow-lg`}>
                        {currentProject.category}
                      </Badge>
                      <div className="text-yellow-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" style={{ fontFamily: 'monospace' }}>
                        {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                      </div>
                    </div>
                    
                    <h3 className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      {currentProject.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-green-400 bg-green-500/10 rounded-xl p-3 border border-green-500/30">
                      <TrendingUp className="w-6 h-6" />
                      <span className="font-bold text-lg">{currentProject.result}</span>
                    </div>

                    <div className="aspect-video rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border-4 border-slate-700">
                      <img 
                        src={currentProject.image} 
                        alt={currentProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Control Panel - More Retro */}
            <div className="bg-gradient-to-b from-slate-950 to-black p-8 border-t-8 border-yellow-600/40">
              <div className="flex items-center justify-center gap-12">
                {/* Selection Buttons - Vintage Style */}
                <div className="flex gap-3">
                  {projects.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative w-14 h-14 rounded-lg font-black text-lg transition-all shadow-lg ${
                        index === currentIndex 
                          ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-black shadow-[0_0_30px_rgba(251,191,36,0.8)]' 
                          : 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-400 hover:from-slate-600 hover:to-slate-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]'
                      }`}
                      style={{
                        border: index === currentIndex ? '3px solid rgba(251,191,36,0.6)' : '2px solid rgba(100,116,139,0.3)',
                        fontFamily: 'Impact, sans-serif'
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {String.fromCharCode(65 + index)}
                      {index === currentIndex && (
                        <motion.div
                          className="absolute -inset-2 border-3 border-yellow-300 rounded-lg"
                          animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Navigation Buttons - Chrome Style */}
                <div className="flex gap-4">
                  <Button
                    onClick={prevProject}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 hover:from-slate-500 hover:to-slate-700 text-white border-4 border-slate-500 shadow-[0_5px_20px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.2)]"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </Button>
                  
                  <Button
                    onClick={nextProject}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 hover:from-slate-500 hover:to-slate-700 text-white border-4 border-slate-500 shadow-[0_5px_20px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.2)]"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vintage Chrome Stand */}
        <div className="mx-auto w-40 h-10 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 rounded-b-2xl border-4 border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
          style={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.3)'
          }}
        />
      </div>
    </div>
  );
}