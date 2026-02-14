import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Zap, Code2, Sparkles } from "lucide-react";
import { useFPS } from "@/hooks/useFPS";
// import '@/hero.css'

const Hero = () => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const magneticButtonRef = useRef(null);
  const neuralCanvasRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // Split text into individual characters for kinetic typography
  const headline = "Engineering Digital Sovereignty";
  const words = headline.split(" ");

  // Neural Network Background Effect
  useEffect(() => {
    if (prefersReducedMotion.current) return;

    const canvas = neuralCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Create nodes for neural network
    const nodes = [];
    const nodeCount = 50;
    const mouse = { x: 0, y: 0, radius: 150 };

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Magnetic effect from mouse
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          node.x += dx * force * 0.03;
          node.y += dy * force * 0.03;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(5, 128, 232, ${0.3 + Math.random() * 0.3})`;
        ctx.fill();

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.strokeStyle = `rgba(112, 0, 255, ${0.15 * (1 - distance / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Custom Cursor
  useEffect(() => {
    if (prefersReducedMotion.current) return;

    const moveCursor = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.to(cursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // Main GSAP Animations
  useGSAP(
    () => {
      if (prefersReducedMotion.current) {
        // Show everything immediately for reduced motion
        gsap.set(".hero-element", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // SVG Line Drawing
      tl.from(".svg-line", {
        strokeDashoffset: 1000,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.2,
      })
        // Container Expansion
        .from(
          ".glass-container",
          {
            scale: 0,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.4)",
          },
          "-=0.8",
        )
        // Kinetic Typography - Staggered 3D rotation
        .from(
          ".char",
          {
            opacity: 0,
            rotationX: -90,
            y: 50,
            transformOrigin: "50% 50% -50px",
            duration: 0.8,
            stagger: {
              each: 0.03,
              from: "random",
            },
            ease: "back.out(1.2)",
          },
          "-=0.5",
        )
        // Floating Cards with Clip-path
        .from(
          ".float-card",
          {
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
            duration: 1,
            stagger: 0.15,
            ease: "expo.out",
          },
          "-=0.8",
        )
        // Subheading reveal
        .from(
          ".subheading",
          {
            clipPath: "inset(0 100% 0 0)",
            duration: 1,
            ease: "expo.out",
          },
          "-=0.6",
        )
        // CTA Button
        .from(
          ".cta-button",
          {
            scale: 0,
            rotation: -180,
            duration: 0.8,
            ease: "back.out(2)",
          },
          "-=0.4",
        );

      // Parallax effect on floating cards
      const cards = gsap.utils.toArray(".float-card");
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: `${(i + 1) * 20}`,
          x: `${(i + 1) * 10}`,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: containerRef },
  );

  // Magnetic Button Effect
  useEffect(() => {
    if (prefersReducedMotion.current) return;

    const button = magneticButtonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - buttonCenterX;
      const deltaY = e.clientY - buttonCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const magnetRadius = 100;

      if (distance < magnetRadius) {
        const power = (magnetRadius - distance) / magnetRadius;
        gsap.to(button, {
          x: deltaX * power * 0.5,
          y: deltaY * power * 0.5,
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCTAClick = () => {
    const aiSection = document.getElementById("ai-analyzer");
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fps = useFPS();
  console.log("Current FPS:", fps); // Should be ~60

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f] text-white"
      style={{ perspective: "1000px" }}
    >
      {/* Neural Network Background Canvas */}
      <canvas
        ref={neuralCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Custom Cursor */}
      {!prefersReducedMotion.current && (
        <>
          <div
            ref={cursorRef}
            className={`fixed top-0 left-0 w-10 h-10 pointer-events-none z-50 mix-blend-difference transition-all duration-300 ${
              isHovering ? "scale-150" : "scale-100"
            }`}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <div className="w-full h-full rounded-full border-2 border-cyan-400" />
          </div>
          <div
            ref={cursorDotRef}
            className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-50 mix-blend-difference"
            style={{ transform: "translate(-50%, -50%)" }}
          />
        </>
      )}

      {/* SVG Line Decorations */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0580E8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7000FF" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <line
          className="svg-line"
          x1="10%"
          y1="10%"
          x2="30%"
          y2="90%"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        <line
          className="svg-line"
          x1="90%"
          y1="10%"
          x2="70%"
          y2="90%"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
      </svg>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Glassmorphic Container */}
        <div className="glass-container relative max-w-6xl mx-auto">
          {/* Floating Code Cards with Parallax */}
          <div className="float-card absolute -top-20 -left-20 w-64 h-32 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-4 shadow-2xl rotate-[-5deg]">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">
                component.tsx
              </span>
            </div>
            <div className="space-y-1">
              <div
                className="h-2 bg-gradient-to-r from-cyan-400/30 to-transparent rounded"
                style={{ width: "80%" }}
              />
              <div
                className="h-2 bg-gradient-to-r from-purple-400/30 to-transparent rounded"
                style={{ width: "60%" }}
              />
              <div
                className="h-2 bg-gradient-to-r from-blue-400/30 to-transparent rounded"
                style={{ width: "90%" }}
              />
            </div>
          </div>

          <div className="float-card absolute -top-10 -right-32 w-56 h-40 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-4 shadow-2xl rotate-[8deg]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono text-purple-400">
                ai-engine.js
              </span>
            </div>
            <div className="space-y-1">
              <div
                className="h-2 bg-gradient-to-r from-purple-400/30 to-transparent rounded"
                style={{ width: "70%" }}
              />
              <div
                className="h-2 bg-gradient-to-r from-cyan-400/30 to-transparent rounded"
                style={{ width: "85%" }}
              />
              <div
                className="h-2 bg-gradient-to-r from-purple-400/30 to-transparent rounded"
                style={{ width: "50%" }}
              />
            </div>
          </div>

          <div className="float-card absolute bottom-10 -left-32 w-72 h-36 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-4 shadow-2xl rotate-[-3deg]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono text-blue-400">
                performance.cpp
              </span>
            </div>
            <div className="space-y-1">
              <div
                className="h-2 bg-gradient-to-r from-blue-400/30 to-transparent rounded"
                style={{ width: "95%" }}
              />
              <div
                className="h-2 bg-gradient-to-r from-cyan-400/30 to-transparent rounded"
                style={{ width: "75%" }}
              />
              <div
                className="h-2 bg-gradient-to-r from-blue-400/30 to-transparent rounded"
                style={{ width: "88%" }}
              />
            </div>
          </div>

          {/* Main Headline - Kinetic Typography */}
          <h1
            className="text-center mb-8 leading-tight"
            style={{ perspective: "800px" }}
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 md:mr-6">
                {word.split("").map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="char inline-block text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black bg-gradient-to-br from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent"
                    style={{
                      fontFamily: "'Space Grotesk', 'Orbitron', sans-serif",
                      textShadow: "0 0 40px rgba(5, 128, 232, 0.3)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Subheading with Clip-path Reveal */}
          <p className="subheading text-center text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto text-gray-300 font-light tracking-wide">
            Where{" "}
            <span className="text-cyan-400 font-semibold">AI velocity</span>{" "}
            meets{" "}
            <span className="text-purple-400 font-semibold">
              human artistry
            </span>
            . Crafting digital experiences that transcend expectation.
          </p>

          {/* CTA Button - Magnetic Effect */}
          <div className="flex justify-center">
            <button
              ref={magneticButtonRef}
              onClick={handleCTAClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="cta-button group relative px-12 py-5 text-lg font-bold rounded-full overflow-hidden cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #0580E8 0%, #7000FF 100%)",
                boxShadow:
                  "0 0 60px rgba(5, 128, 232, 0.4), 0 0 100px rgba(112, 0, 255, 0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-3 text-white">
                Launch Experience
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>

              {/* Animated gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, #7000FF 0%, #0580E8 100%)",
                }}
              />

              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle, rgba(5, 128, 232, 0.4) 0%, transparent 70%)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-cyan-400/50 flex justify-center pt-2">
            <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default Hero;
