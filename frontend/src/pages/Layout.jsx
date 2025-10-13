
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Menu, X, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { User } from "@/api/entities";
import flogo from '../public/flogo.png';

const navigationItems = [
  { name: "Home", url: createPageUrl("Home") },
  { name: "Our Process", url: createPageUrl("Process") },
  { name: "Our Work", url: createPageUrl("Work") },
  { name: "Pricing", url: createPageUrl("Pricing") },
  { name: "Our Team", url: createPageUrl("About") },
  { name: "Testimonials", url: createPageUrl("Testimonials") },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        // User not logged in or session expired
        setCurrentUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    loadUser();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = async () => {
    try {
      await User.logout();
      setCurrentUser(null);
      window.location.href = createPageUrl("Home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isDashboardPage = currentPageName === "AdminDashboard" || currentPageName === "UserDashboard";

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        :root {
          --neon-blue: #00D4FF;
          --neon-purple: #7C3AED;
          --neon-pink: #FF3D8A;
          --neon-cyan: #00FFF0;
          --dark-bg: #0F0F23;
          --card-bg: rgba(15, 15, 35, 0.6);
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #0F0F23;
          overflow-x: hidden;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--neon-cyan), var(--neon-blue), var(--neon-purple));
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .floating-orb {
          position: fixed;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.1;
          filter: blur(40px);
          animation: float 6s ease-in-out infinite;
        }

        .floating-orb:nth-child(1) {
          background: radial-gradient(circle, var(--neon-blue), transparent);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-orb:nth-child(2) {
          background: radial-gradient(circle, var(--neon-purple), transparent);
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .floating-orb:nth-child(3) {
          background: radial-gradient(circle, var(--neon-pink), transparent);
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
        }

        .neon-glow {
          box-shadow:
            0 0 20px rgba(0, 212, 255, 0.3),
            0 0 40px rgba(0, 212, 255, 0.2),
            0 0 80px rgba(0, 212, 255, 0.1);
        }

        .cursor-glow {
          position: fixed;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, var(--neon-cyan), transparent);
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.6;
          z-index: 9999;
          transition: transform 0.1s ease;
        }
      `}</style>

      {/* Floating Background Orbs */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      {/* Cursor Glow Effect */}
      <div
        className="cursor-glow"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />

      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-morphism rounded-2xl px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to={createPageUrl("Home")} className="flex items-center space-x-3 group">
  <div className="relative w-10 h-10">
   <img
  src={flogo}
  alt="Feelize Logo"
  className="w-full h-full object-cover rounded-xl transition-all duration-300 group-hover:scale-110"
/>

  </div>
  <span className="text-2xl font-bold text-white">Feelize</span>
</Link>


              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`text-sm font-medium transition-all duration-300 hover:text-cyan-400 relative group ${
                      location.pathname === item.url
                        ? 'text-cyan-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {item.name}
                    <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${
                      location.pathname === item.url ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                ))}

                {!isLoadingUser && currentUser && (
                  <>
                    <Link
                      to={createPageUrl("UserDashboard")}
                      className={`text-sm font-medium transition-all duration-300 hover:text-cyan-400 relative group ${
                        currentPageName === "UserDashboard" ? 'text-cyan-400' : 'text-slate-300'
                      }`}
                    >
                      My Projects
                      <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${
                        currentPageName === "UserDashboard" ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                    </Link>

                    {currentUser.role === 'admin' && (
                      <Link
                        to={createPageUrl("AdminDashboard")}
                        className={`text-sm font-medium transition-all duration-300 hover:text-cyan-400 relative group ${
                          currentPageName === "AdminDashboard" ? 'text-cyan-400' : 'text-slate-300'
                        }`}
                      >
                        Admin
                        <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${
                          currentPageName === "AdminDashboard" ? 'w-full' : 'w-0 group-hover:w-full'
                        }`} />
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-slate-300 hover:text-red-400 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>

              {/* CTA Button */}
              <div className="hidden md:flex">
                {!isLoadingUser && !currentUser ? (
                  <Link to={createPageUrl("StartProject")}>
                    <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 neon-glow">
                      Start with AI Assistant
                    </Button>
                  </Link>
                ) : (
                  <div className="text-slate-300 text-sm">
                    Welcome, {currentUser?.full_name}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden pt-4 space-y-2 border-t border-white/10 mt-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                      location.pathname === item.url
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {!isLoadingUser && currentUser && (
                  <>
                    <Link
                      to={createPageUrl("UserDashboard")}
                      className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                        currentPageName === "UserDashboard" ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-white/10'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Projects
                    </Link>

                    {currentUser.role === 'admin' && (
                      <Link
                        to={createPageUrl("AdminDashboard")}
                        className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                          currentPageName === "AdminDashboard" ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-white/10'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}

                {!isLoadingUser && !currentUser && (
                  <div className="px-3 pt-2">
                    <Link to={createPageUrl("StartProject")}>
                      <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold">
                        Start with AI Assistant
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {children}
      </main>

{/* Footer */}
<footer className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-t border-white/10 mt-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="grid md:grid-cols-4 gap-8">
      {/* Brand */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 relative">
      <img
        src={flogo} // same import as in header: import flogo from '../public/flogo.png'
        alt="Feelize Logo"
        className="w-full h-full object-cover rounded-xl transition-all duration-300"
      />
    </div>
          <span className="text-2xl font-bold text-white">Feelize</span>
        </div>
        <p className="text-slate-400 mb-4 text-sm leading-relaxed">
          Human Experts, Supercharged by AI.
          <br />The future of development is here.
        </p>
      </div>

      {/* Navigation */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
        <div className="space-y-3">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.url}
              className="block text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          {!isLoadingUser && currentUser && (
            <>
              <Link
                to={createPageUrl("UserDashboard")}
                className="block text-slate-400 hover:text-cyan-400 transition-colors"
              >
                My Projects
              </Link>
              {currentUser.role === "admin" && (
                <Link
                  to={createPageUrl("AdminDashboard")}
                  className="block text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Get Started */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Get Started</h3>
        <p className="text-slate-400 mb-6 text-sm">
          Ready to experience the future of development?
        </p>
        <Link to={createPageUrl("StartProject")}>
          <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 hover:scale-105">
            Start Your Project
          </Button>
        </Link>
      </div>

      {/* Contact */}
<div>
  <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
  <div className="space-y-3 text-slate-400 text-sm">
    <div className="flex items-center space-x-2">
      <Mail className="w-4 h-4 text-cyan-400" />
      <p>info@feelize.com</p>
    </div>
    <div className="flex items-center space-x-2">
      <Phone className="w-4 h-4 text-cyan-400" />
      <p>(800) 227-9944</p>
    </div>
    <div className="flex items-center space-x-2">
      <MapPin className="w-4 h-4 text-cyan-400" />
      <p>New York City, USA</p>
    </div>
  </div>
</div>

    </div>

    <div className="border-t border-white/10 pt-8 mt-8 text-center">
      <p className="text-slate-400 text-sm">
        &copy; 2025 Feelize. Crafting the future, one project at a time.
      </p>
    </div>
  </div>
</footer>

    </div>
  );
}
