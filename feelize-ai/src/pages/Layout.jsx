import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Gift, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { auth, signInWithGooglePopup } from "@/config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "@/hooks/useUser";
import axios from "axios";

const navigationItems = [
  { name: "Home", url: createPageUrl("Home") },
  { name: "Process", url: createPageUrl("Process") },
  { name: "Pricing", url: createPageUrl("Pricing") },
  { name: "Portfolio", url: createPageUrl("Work") },
  { name: "About", url: createPageUrl("About") },
  { name: "Testimonials", url: createPageUrl("Testimonials") },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { data: user, isLoading, refetch } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Check for referral code in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    if (refCode) {
      sessionStorage.setItem("referral_code", refCode);
      console.log("Referral code captured:", refCode);
    }
  }, [location]);

  const handleLogout = async () => {
    console.log("hi");

    try {

      await axios.post(
        `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      await refetch()
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isDashboardPage =
    currentPageName === "AdminDashboard" ||
    currentPageName === "UserDashboard" ||
    currentPageName === "DeveloperDashboard";

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
          border: 2px solid #534EDC;
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

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="glass-morphism rounded-2xl md:rounded-full px-7 py-3">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link
                to={createPageUrl("Home")}
                className="flex items-center space-x-3 group"
              >
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8598 12.8718C22.7336 8.77621 29.2185 8.02145 35.5533 6.59971C41.6549 5.26572 42.6908 4.79766 48 0C47.596 2.5685 47.5338 4.58118 46.9641 6.33057C45.3739 11.2569 42.1625 14.1414 38.4539 16.2769C33.2742 19.2843 27.675 19.9922 22.1276 20.8932C18.0511 21.5719 14.0421 22.2331 11.9443 27.8206C11.507 23.0909 9.63489 18.6776 6.64552 15.3291C4.75791 13.2801 2.48678 11.7365 0 10.8123C4.22143 5.51731 10.2039 6.21355 16.8598 12.8718Z"
                    fill="white"
                  />
                  <path
                    d="M26.5563 35.6139C28.1102 40.2945 30.5653 44.2087 33.5592 48C32.0985 47.7777 30.6171 47.6665 29.1772 47.3213C24.5174 46.2388 20.2574 43.587 16.9583 39.7153C13.1927 35.3857 14.8865 29.9386 17.5644 27.2121C21.1901 23.5203 25.6757 23.1166 30.0888 22.0985C34.6624 21.0571 38.7026 19.7582 43.0742 16.1073C43.0173 19.3896 42.6495 20.2672 41.5928 22.9527C39.6867 27.7855 35.1234 28.9089 31.1247 30.0732C30.3219 30.3131 29.5087 30.5061 28.6851 30.6875C26.8878 31.0854 25.8467 33.49 26.5563 35.6139Z"
                    fill="white"
                  />
                </svg>
                <span className="text-xl tracking-wide font-medium text-white">
                  Feelize
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`text-md font-light tracking-wide transition-all duration-300 hover:text-cyan-400 relative group ${location.pathname === item.url
                      ? "text-cyan-400"
                      : "text-slate-300"
                      }`}
                  >
                    {item.name}
                    <div
                      className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${location.pathname === item.url
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                        }`}
                    />
                  </Link>
                ))}

                {!isLoading && user && (
                  <>
                    <Link
                      to={createPageUrl("UserDashboard")}
                      className={`text-sm font-medium transition-all duration-300 hover:text-cyan-400 relative group ${currentPageName === "UserDashboard"
                        ? "text-cyan-400"
                        : "text-slate-300"
                        }`}
                    >
                      My Projects
                      <div
                        className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${currentPageName === "UserDashboard"
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                          }`}
                      />
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to={createPageUrl("AdminDashboard")}
                        className={`text-sm font-medium transition-all duration-300 hover:text-cyan-400 relative group ${currentPageName === "AdminDashboard"
                          ? "text-cyan-400"
                          : "text-slate-300"
                          }`}
                      >
                        Admin
                        <div
                          className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${currentPageName === "AdminDashboard"
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                            }`}
                        />
                      </Link>
                    )}

                    {user?.role === "engineer" && (
                      <Link
                        to={createPageUrl("DeveloperDashboard")}
                        className={`text-sm font-medium transition-all duration-300 hover:text-cyan-400 relative group ${currentPageName === "DeveloperDashboard"
                          ? "text-cyan-400"
                          : "text-slate-300"
                          }`}
                      >
                        Dev Dashboard
                        <div
                          className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${currentPageName === "DeveloperDashboard"
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                            }`}
                        />
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

              {/* CTA Button - FIXED: Skeleton while loading */}
              <div className="hidden md:flex min-w-[180px] justify-end">
                {isLoading ? (
                  <div className="h-10 w-44 bg-slate-700/50 animate-pulse rounded-xl" />
                ) : !user ? (
                  <Button
                    onClick={() => {

                      navigate('/StartProject');
                    }}
                    className="bg-gradient-to-r from-blue-500 via-blue-700 to-purple-700 hover:from-blue-600 hover:via-blue-800 hover:to-purple-800 tracking-wide px-14 py-3 rounded-full shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all ease-in-out duration-300 hover:scale-105"
                  >
                    Start with AI Assistant
                  </Button>
                ) : (
                  <div className="text-slate-300 text-sm text-right">
                    Welcome,{" "}
                    <span className="text-cyan-400 font-semibold">
                      {user?.name}
                    </span>
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
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 glass-morphism rounded-2xl p-4 border border-white/10">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${location.pathname === item.url
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-300 hover:bg-white/10"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {!isLoading && user && (
                <>
                  <Link
                    to={createPageUrl("UserDashboard")}
                    className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${currentPageName === "UserDashboard"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-slate-300 hover:bg-white/10"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Projects
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to={createPageUrl("AdminDashboard")}
                      className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${currentPageName === "AdminDashboard"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-slate-300 hover:bg-white/10"
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user?.role === "engineer" && (
                    <Link
                      to={createPageUrl("DeveloperDashboard")}
                      className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${currentPageName === "DeveloperDashboard"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-slate-300 hover:bg-white/10"
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dev Dashboard
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

              {!isLoading && !user && (
                <div className="px-3 pt-2">
                  <Link to={createPageUrl("StartProject")} >
                    <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}>
                      Start with AI Assistant
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">

            {/* Column 1: Brand & Social */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8598 12.8718C22.7336 8.77621 29.2185 8.02145 35.5533 6.59971C41.6549 5.26572 42.6908 4.79766 48 0C47.596 2.5685 47.5338 4.58118 46.9641 6.33057C45.3739 11.2569 42.1625 14.1414 38.4539 16.2769C33.2742 19.2843 27.675 19.9922 22.1276 20.8932C18.0511 21.5719 14.0421 22.2331 11.9443 27.8206C11.507 23.0909 9.63489 18.6776 6.64552 15.3291C4.75791 13.2801 2.48678 11.7365 0 10.8123C4.22143 5.51731 10.2039 6.21355 16.8598 12.8718Z"
                    fill="white"
                  />
                  <path
                    d="M26.5563 35.6139C28.1102 40.2945 30.5653 44.2087 33.5592 48C32.0985 47.7777 30.6171 47.6665 29.1772 47.3213C24.5174 46.2388 20.2574 43.587 16.9583 39.7153C13.1927 35.3857 14.8865 29.9386 17.5644 27.2121C21.1901 23.5203 25.6757 23.1166 30.0888 22.0985C34.6624 21.0571 38.7026 19.7582 43.0742 16.1073C43.0173 19.3896 42.6495 20.2672 41.5928 22.9527C39.6867 27.7855 35.1234 28.9089 31.1247 30.0732C30.3219 30.3131 29.5087 30.5061 28.6851 30.6875C26.8878 31.0854 25.8467 33.49 26.5563 35.6139Z"
                    fill="white"
                  />
                </svg>
                <span className="text-2xl font-bold text-white">Feelize</span>
              </div>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Human Experts, Supercharged by AI.
                <br />
                The future of development is here.
              </p>

              {/* Social Icons */}
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <i className="fab fa-linkedin text-lg"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <i className="fab fa-twitter text-lg"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <i className="fab fa-github text-lg"></i>
                </a>
              </div>
            </div>

            {/* Column 2: Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link to={createPageUrl("About")} className="hover:text-cyan-400">About</Link></li>
                <li><Link to={createPageUrl("Portfolio")} className="hover:text-cyan-400">Portfolio</Link></li>
                <li><Link to={createPageUrl("Testimonials")} className="hover:text-cyan-400">Testimonials</Link></li>
                <li><Link to={createPageUrl("Careers")} className="hover:text-cyan-400">Careers</Link></li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link to={createPageUrl("Process")} className="hover:text-cyan-400">Process</Link></li>
                <li><Link to={createPageUrl("Pricing")} className="hover:text-cyan-400">Pricing</Link></li>
                <li><Link to={createPageUrl("AffiliateSignup")} className="hover:text-cyan-400">Affiliate Program</Link></li>
                <li><Link to={createPageUrl("StartProject")} className="hover:text-cyan-400">Start Your Project</Link></li>
              </ul>
            </div>

            {/* Column 4: Get in Touch */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Get in Touch</h3>
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

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 mt-8 text-center text-slate-400 text-sm">
            <p>
              &copy; 2025 Feelize. Crafting the future, one project at a time.
            </p>
            <div className="mt-2 space-x-4">
              <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-cyan-400">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link to={createPageUrl("TermsOfService")} className="hover:text-cyan-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
