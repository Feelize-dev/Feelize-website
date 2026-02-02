
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ExternalLink,
  Calendar,
  Users,
  Zap,
  ShoppingCart,
  Briefcase,
  Palette,
  Code2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Award
} from "lucide-react";

export default function WorkPage() {
  const [filter, setFilter] = useState("all");
  const [hoveredProject, setHoveredProject] = useState(null);

  const backgroundBlurs = [
    { left: '10%', top: '-200px' },
    { left: '70%', top: '-100px' },
    { left: '-142px', top: '1000px' },
    { left: '864px', top: '1500px' },
    { left: '191px', top: '800px' },
    { left: '1226px', top: '1200px' },
  ];

  const projects = [
    {
      id: 1,
      title: "Adept ML: AI Personal Secretary",
      category: "saas",
      client: "Adept ML",
      description:
        "A fully autonomous AI voice and text agent that manages inbound calls, WhatsApp inquiries, and client quoting. It acts as a 24/7 receptionist that never sleeps, ensuring zero lead leakage for businesses.",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
      timeline: "12 weeks",
      results: [
        "100% Lead Capture Rate",
        "24/7 Autonomous Operation",
        "Auto-WhatsApp Follow-ups",
      ],
      technologies: [
        "React",
        "Node.js",
        "Express.js",
        "Flutter",
        "Whisper",
        "GreenApi",
        "Google STT",
        "AI integration",
      ],
      color: "from-purple-500 to-pink-500",
      link: "https://adept.ml",
    },
    {
      id: 2,
      title: "Cloud Castles: Gaming Platform",
      category: "saas",
      client: "Cloud Castles",
      description: "Interactive gaming platform with advanced video manipulation, real-time multiplayer features, and cloud-based game streaming technology.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      timeline: "10 weeks",
      results: ["50K+ active gamers", "99.5% uptime", "Sub-50ms latency"],
      technologies: ["Svelte.js", "Video Manipulation", "WebRTC", "Cloud Streaming"],
      color: "from-blue-500 to-cyan-500",
      link: "https://www.cloudcastles.gg/"
    },
    {
      id: 3,
      title: "Allen Media: Digital Production Hub",
      category: "campaign",
      client: "Allen Media",
      description: "Comprehensive digital media platform featuring advanced video control, content management system, and streamlined production workflows for media professionals.",
      image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["300% content delivery speed", "70% workflow efficiency", "4.8/5 user rating"],
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "WordPress"],
      color: "from-red-500 to-orange-500",
      link: "https://allenmedia.tv/"
    },
    {
      id: 4,
      title: "Stonemark Capital: Investment Platform",
      category: "saas",
      client: "Stonemark Capital",
      description: "Sophisticated investment management platform with real-time portfolio tracking, AI-powered market insights, and secure client portal for wealth management.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      timeline: "14 weeks",
      results: ["$500M+ AUM managed", "2000+ investors onboarded", "Bank-level security"],
      technologies: ["React", "Bootstrap", "Responsive Design", "Financial APIs"],
      color: "from-green-500 to-emerald-500",
      link: "https://stonemarkcapital.com/"
    },
    {
      id: 5,
      title: "Image Appeal: Creative Studio Platform",
      category: "ecommerce",
      client: "Image Appeal",
      description: "Dynamic creative studio website with CSS3 animations, responsive design, and portfolio showcase featuring advanced image galleries and client workflow management.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      timeline: "6 weeks",
      results: ["200% client inquiries", "85% mobile traffic", "4.9/5 satisfaction"],
      technologies: ["JavaScript", "CSS3 Animations", "Responsive Design", "Portfolio CMS"],
      color: "from-purple-500 to-pink-500",
      link: "https://imageappeal.com/"
    },
    {
      id: 6,
      title: "Virtdrop: Virtual Events Platform",
      category: "saas",
      client: "Virtdrop",
      description: "Cutting-edge virtual events platform with custom themes, live streaming capabilities, interactive features, and comprehensive analytics for organizers.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      timeline: "16 weeks",
      results: ["100K+ event attendees", "500+ successful events", "98% satisfaction rate"],
      technologies: ["Custom Theme", "CSS3", "JavaScript", "Bootstrap", "PHP"],
      color: "from-cyan-500 to-blue-500",
      link: "https://virtdrop.com/"
    },
    {
      id: 7,
      title: "Sonora Sprinkler: Service Management",
      category: "campaign",
      client: "Sonora Sprinkler",
      description: "Complete service management platform for irrigation specialists featuring online scheduling, service tracking, customer portal, and automated billing systems.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
      timeline: "7 weeks",
      results: ["400% more bookings", "60% admin time saved", "95% customer retention"],
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "PHP", "WordPress"],
      color: "from-teal-500 to-green-500",
      link: "https://www.sonorasprinkler.com/"
    },
    {
      id: 8,
      title: "Unspouse: Legal Services Platform",
      category: "saas",
      client: "Unspouse",
      description: "Streamlined legal services platform for divorce proceedings with document automation, secure client communication, and case management features.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      timeline: "9 weeks",
      results: ["70% faster case processing", "1000+ cases handled", "Secure document management"],
      technologies: ["WordPress", "Secure Portal", "Document Automation", "Payment Integration"],
      color: "from-indigo-500 to-purple-500",
      link: "https://www.unspouse.com/"
    },
    {
      id: 9,
      title: "Kwiks",
      category: "saas",
      client: "Kwiks",
      description: "Kwiks is a popular social media platform with a large user base, offering a wide range of social sharing opportunities and cash rewards for users.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["High user engagement", "Scalable social infrastructure", "Integrated reward system"],
      technologies: ["React.js", "Next.js", "UX/UI Design", "Maintenance"],
      color: "from-blue-600 to-indigo-600",
      link: "https://kwiks.com/"
    },
    {
      id: 10,
      title: "Case Marina",
      category: "campaign",
      client: "Case Marina",
      description: "A completely renovated marina offering a wide range of amenities for boaters. Pet-friendly and focused on providing the best maritime experience.",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Enhanced user experience", "Custom post architecture", "Secure boat management"],
      technologies: ["WordPress", "UX/UI Design", "API Integrations", "Security"],
      color: "from-cyan-500 to-blue-500",
      link: "https://casemarina.com/"
    },
    {
      id: 11,
      title: "Brookville Auto Group",
      category: "ecommerce",
      client: "Brookville Auto Group",
      description: "Comprehensive automotive service provider specializing in sourcing new and used cars from franchise retailers and partner dealers.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Streamlined inventory management", "Direct franchise integration", "Increased sales leads"],
      technologies: ["WordPress", "Theme Development", "API Integrations", "Maintenance"],
      color: "from-red-600 to-orange-600",
      link: "https://brookvilleautogroup.com/"
    },
    {
      id: 12,
      title: "Moglixy Media",
      category: "campaign",
      client: "Moglixy Media",
      description: "Digital marketing and media agency focused on performance-driven strategies and creative content solutions for modern brands.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Optimized marketing reach", "High-performance platform", "Secure content delivery"],
      technologies: ["WordPress", "Elementor", "SEO", "Security"],
      color: "from-purple-600 to-pink-600",
      link: "https://www.moglixy.com/"
    },
    {
      id: 13,
      title: "Columbia Alumni",
      category: "campaign",
      client: "Columbia University",
      description: "Official alumni portal for Columbia University, specifically the Arts Access initiative, connecting the global alumni network with cultural resources.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Improved alumni connectivity", "Seamless arts portal access", "Global resource distribution"],
      technologies: ["WordPress", "Custom Post Types", "UX/UI Design", "Performance"],
      color: "from-blue-700 to-sky-600",
      link: "https://alumni.columbia.edu/content/caa-arts-access"
    },
    {
      id: 14,
      title: "Columbia University",
      category: "campaign",
      client: "Columbia University",
      description: "Primary digital presence for the Ivy League institution, managing complex information hierarchy and institutional resources for students and faculty.",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Centralized university info", "Enterprise-grade stability", "Accesible academic resources"],
      technologies: ["WordPress", "Enterprise Architecture", "UI/UX Design"],
      color: "from-blue-800 to-blue-500",
      link: "https://www.columbia.edu/"
    },
    {
      id: 15,
      title: "BH Photo Video",
      category: "ecommerce",
      client: "BH Photo Video",
      description: "Large-scale e-commerce integration for photo and video equipment, optimizing product displays and checkout workflows for professional creatives.",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Optimized product funnels", "High-volume transaction support", "Robust catalog management"],
      technologies: ["WordPress", "E-commerce", "API Integration", "Performance Calibration"],
      color: "from-gray-800 to-gray-600",
      link: "https://www.bhphotovideo.com/"
    },
    {
      id: 16,
      title: "Pfizerpro",
      category: "saas",
      client: "Pfizer",
      description: "Professional health resources portal for Pfizer, delivering critical pharmaceutical information and clinical data to healthcare professionals worldwide.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Compliant data delivery", "Global medical reach", "Secure clinical portal"],
      technologies: ["WordPress", "Security Compliance", "Data Privacy", "Custom UI"],
      color: "from-blue-900 to-indigo-800",
      link: "https://www.pfizerpro.com/"
    },
    {
      id: 17,
      title: "Philosophers Guild",
      category: "ecommerce",
      client: "Philosophers Guild",
      description: "Creative gift shop featuring smart and funny gifts for people with high IQs. Optimized for e-commerce and creative storytelling.",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Enhanced story-driven retail", "Optimized conversion rates", "Creative brand alignment"],
      technologies: ["WordPress", "WooCommerce", "Custom UX", "SEO"],
      color: "from-amber-600 to-orange-500",
      link: "https://philosophersguild.com/"
    },
    {
      id: 18,
      title: "My Guess Original",
      category: "ecommerce",
      client: "Guess Watches",
      description: "Official digital storefront for Guess Watches, featuring authentic timepieces and a premium shopping experience for a global audience.",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Premium brand presence", "Seamless mobile shopping", "High-conversion checkout"],
      technologies: ["WordPress", "E-commerce", "Custom Theme", "Payment Integration"],
      color: "from-rose-600 to-pink-500",
      link: "https://shop.guesswatches.com/home?siteID=guesswatches"
    },
    {
      id: 19,
      title: "Shaare Zedek",
      category: "campaign",
      client: "Shaare Zedek",
      description: "Digital platform for the Shaare Zedek congregation, providing community resources, event updates, and religious educational content.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Enhanced community outreach", "Real-time event updates", "Secure donation platform"],
      technologies: ["WordPress", "Community Portal", "Custom Maintenance"],
      color: "from-blue-600 to-sky-500",
      link: "http://www.sznyc.org/"
    },
    {
      id: 20,
      title: "Weightology",
      category: "saas",
      client: "Weightology",
      description: "Research Review and science-based fitness resource providing evidence-based information on fat loss and muscle gain.",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Evidence-based content delivery", "Membership growth tracking", "Science-backed authority"],
      technologies: ["WordPress", "Membership System", "Custom UI", "Data Visualization"],
      color: "from-emerald-600 to-teal-500",
      link: "https://weightology.net/"
    },
    {
      id: 21,
      title: "Celebrity Fix N’ Flip",
      category: "campaign",
      client: "Celebrity Fix N’ Flip",
      description: "Prime real estate investment platform specializing in celebrity-focussed property flipping and high-value renovations.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Exclusive investor portal", "Visual project timelines", "Secure membership area"],
      technologies: ["WordPress", "Membership Protection", "API Integrations", "UX/UI Design"],
      color: "from-amber-700 to-yellow-600",
      link: "https://www.celebfixandflip.com/"
    },
    {
      id: 22,
      title: "Plaza at Clover Lake",
      category: "campaign",
      client: "Plaza at Clover Lake",
      description: "Senior living and assisted living community offering a warm atmosphere and professional care in a serene lakeside setting.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Improved care accessibility", "Inquiry volume increase", "Lakeside brand positioning"],
      technologies: ["WordPress", "Accessibility Standards", "UI/UX Design"],
      color: "from-blue-500 to-green-500",
      link: "http://cloverlakeliving.com/"
    },
    {
      id: 23,
      title: "Neonfix",
      category: "ecommerce",
      client: "Neonfix",
      description: "Premier destination for custom handcrafted neon signs, offering creative lighting solutions for business and home decor.",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Visual product customizer", "Global shipping integration", "Artistic brand identity"],
      technologies: ["WordPress", "WooCommerce", "Custom Design", "SVG Animations"],
      color: "from-fuchsia-600 to-purple-500",
      link: "https://www.neonfix.com/"
    },
    {
      id: 24,
      title: "Podflip",
      category: "saas",
      client: "Podflip",
      description: "Dynamic podcasting platform for creators to host, manage, and monetize their audio content with advanced analytics.",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Sub-second audio delivery", "Advanced listener insights", "Monetization framework"],
      technologies: ["WordPress", "Audio Streaming", "Member Management", "Analytics"],
      color: "from-indigo-600 to-blue-500",
      link: "http://podflip.com/"
    },
    {
      id: 25,
      title: "Press Emporium",
      category: "ecommerce",
      client: "Press Emporium",
      description: "Full-service printing and design boutique offering bespoke stationery, business cards, and high-quality press solutions.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["High-fidelity print previews", "Custom design workflows", "Robust service fulfillment"],
      technologies: ["WordPress", "E-commerce", "Design Automation", "Custom Layouts"],
      color: "from-stone-700 to-stone-500",
      link: "http://pressemporium.mystrikingly.com/"
    },
    {
      id: 26,
      title: "Teamwalker",
      category: "campaign",
      client: "Teamwalker",
      description: "Youth development program founded by Jerry Walker, focusing on education, recreation, and social skills for Jersey City children.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Community impact growth", "Successful youth outreach", "Efficient donation portal"],
      technologies: ["WordPress", "Donation Integration", "Event Management", "Community Outreach"],
      color: "from-orange-600 to-red-500",
      link: "https://teamwalker.org/"
    },
    {
      id: 27,
      title: "Arcscape",
      category: "campaign",
      client: "Arcscape",
      description: "High-end landscape design and architecture firm creating luxury outdoor spaces and sustainable environmental solutions.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Luxury portfolio showcase", "Sustainability tracking", "Client inquiry increase"],
      technologies: ["WordPress", "Visual Portfolio", "Custom UI", "Sustainability Tags"],
      color: "from-green-700 to-emerald-600",
      link: "http://arcscape.com/"
    },
    {
      id: 28,
      title: "Parker Security",
      category: "campaign",
      client: "Parker Security",
      description: "Custom security solutions provider in NYC, offering locksmith services, surveillance systems, and high-security hardware.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["24/7 service availability", "Local NYC SEO dominance", "Secure booking pipeline"],
      technologies: ["WordPress", "Service Scheduling", "Local SEO", "Secure Hosting"],
      color: "from-slate-700 to-slate-500",
      link: "https://www.parkercustomsecurity.com/"
    },
    {
      id: 29,
      title: "Eastside Billiards & Bar",
      category: "campaign",
      client: "Eastside Billiards & Bar",
      description: "NYC's premier billiards club and bar, providing a sophisticated atmosphere for pool players and social gatherings.",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Sophisticated brand image", "Streamlined event booking", "Social media integration"],
      technologies: ["WordPress", "Event Booking", "Custom UX", "API Integrations"],
      color: "from-red-800 to-red-600",
      link: "https://www.eastsidebilliards.com/"
    },
    {
      id: 30,
      title: "Realtor Builders",
      category: "campaign",
      client: "Realtor Builders",
      description: "Full-service real estate development firm specializing in residential construction, property management, and realtor services.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Lead generation increase", "Unified property portal", "Modern estate branding"],
      technologies: ["WordPress", "Property Listings", "Custom Forms", "API Integrations"],
      color: "from-sky-700 to-blue-600",
      link: "http://realtorbuilders.com/"
    },
    {
      id: 31,
      title: "Superwill",
      category: "saas",
      client: "Superwill",
      description: "Innovative estate planning platform that makes creating a will and managing legacy assets simple, secure, and accessible.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Simplified legal process", "Bank-level encryption", "Improved legacy access"],
      technologies: ["WordPress", "Legal Compliance", "Data Encryption", "Custom UI"],
      color: "from-indigo-700 to-violet-600",
      link: "http://superwill.com/"
    },
    {
      id: 32,
      title: "Galentine Media",
      category: "campaign",
      client: "Galentine Media",
      description: "Creative media group specializing in visual storytelling, photography, and high-end video production for lifestyle brands.",
      image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["High-impact visual reach", "Creative brand alignment", "Bespoke content delivery"],
      technologies: ["WordPress", "Visual Asset Management", "Creative UI", "Event Hosting"],
      color: "from-rose-500 to-pink-400",
      link: "http://galentinemedia.com/"
    },
    {
      id: 33,
      title: "Hypernano",
      category: "saas",
      client: "Hypernano",
      description: "Advanced tech group specializing in nano-technology applications, innovative engineering, and material science.",
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Industrial-scale awareness", "Interactive tech showcase", "Lead-to-engineering funnel"],
      technologies: ["WordPress", "Interactive Maps", "Custom UI", "API Integrations"],
      color: "from-emerald-700 to-cyan-600",
      link: "http://hypernano.com/"
    },
    {
      id: 34,
      title: "Sunmint Energy",
      category: "campaign",
      client: "Sunmint Energy",
      description: "Sustainable energy provider offering advanced solar solutions and green energy engineering for residential projects.",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Solar adoption growth", "Green energy analytics", "Sustainable brand identity"],
      technologies: ["WordPress", "Savings Calculator", "Custom UI", "API Integrations"],
      color: "from-yellow-600 to-orange-500",
      link: "https://www.sunmintenergy.com/"
    },
    {
      id: 35,
      title: "Claritag",
      category: "ecommerce",
      client: "Claritag",
      description: "Innovative beauty technology brand offering professional-grade skin care tools and advanced aesthetic solutions for home use.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Direct-to-consumer growth", "High-fidelity UX design", "Seamless shopping funnel"],
      technologies: ["WordPress", "WooCommerce", "Custom UX", "SEO"],
      color: "from-purple-500 to-pink-500",
      link: "https://claritag.com/"
    },
    {
      id: 36,
      title: "Shop Fix Beauty",
      category: "ecommerce",
      client: "Shop Fix Beauty",
      description: "Online retail shop for premium beauty products, offering a curated selection of cosmetics and skin care with a focus on ease of use.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Optimized retail flow", "Brand loyalty increase", "High-performance checkout"],
      technologies: ["WordPress", "WooCommerce", "Custom UX", "SEO"],
      color: "from-pink-600 to-rose-500",
      link: "https://shopfixbeauty.com/"
    },
    {
      id: 37,
      title: "Claire Jacobson Art",
      category: "campaign",
      client: "Claire Jacobson Art",
      description: "Fine art portfolio for Claire Jacobson, showcasing original paintings, drawings, and mixed media works with a minimal aesthetic.",
      image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Artistic brand reach", "Elegant gallery display", "Exhibition inquiry growth"],
      technologies: ["WordPress", "Visual Gallery", "Custom UI", "SEO"],
      color: "from-amber-800 to-amber-600",
      link: "https://clairejacobsonart.com"
    },
    {
      id: 38,
      title: "CHEM-IS-TRY Inc",
      category: "saas",
      client: "CHEM-IS-TRY Inc",
      description: "Specialty chemical company serving the R&D community with custom organic synthesis, manufacturing, and process development.",
      image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Streamlined R&D funnel", "Compliance-driven UI", "Global supply connectivity"],
      technologies: ["WordPress", "API Integrations", "Specialty Catalog", "Security Standards"],
      color: "from-blue-700 to-indigo-600",
      link: "https://chem-is-try.com"
    },
    {
      id: 39,
      title: "QBPN",
      category: "saas",
      client: "QBPN",
      description: "Trusted partner for financial management, providing solutions for debt collection and corporate governance with a client-centric approach.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Efficient financial workflows", "Affordable gov solutions", "Confidential data handling"],
      technologies: ["WordPress", "Financial APIs", "Custom Post Types", "Security Standards"],
      color: "from-emerald-700 to-green-600",
      link: "https://qbpn.com/"
    },
    {
      id: 40,
      title: "DGX Security",
      category: "campaign",
      client: "DGX Security",
      description: "Technology reseller providing value-added security services with a focus on building long-term client relationships and understanding unique needs.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Value-added tech growth", "Deepened client relations", "Unwavering service focus"],
      technologies: ["WordPress", "API Integrations", "Custom Theme", "Security Standards"],
      color: "from-slate-800 to-slate-600",
      link: "https://dgxsecurity.com/"
    },
    {
      id: 41,
      title: "Central East Warehouse",
      category: "ecommerce",
      client: "Central East Warehouse",
      description: "Established hardware supply company providing name-brand cabinet/door hardware, partitions, and commercial lighting supplies.",
      image: "https://images.unsplash.com/photo-1523475496153-3d6cc0f0bf19?w=800&h=600&fit=crop",
      timeline: "8 weeks",
      results: ["Broad supply accessibility", "Efficient retail platform", "Brand name dominance"],
      technologies: ["Weebly CMS", "UX/UI Design", "Maintenance Support"],
      color: "from-orange-800 to-orange-600",
      link: "https://www.centraleastwarehouse.com/"
    }
  ];

  const categories = [
    { id: "all", name: "All Projects", count: projects.length },
    { id: "campaign", name: "Campaign Sites", count: projects.filter(p => p.category === "campaign").length },
    { id: "ecommerce", name: "E-commerce", count: projects.filter(p => p.category === "ecommerce").length },
    { id: "saas", name: "SaaS Platforms", count: projects.filter(p => p.category === "saas").length }
  ];

  const filteredProjects = filter === "all" ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white relative">
      {/* Fixed Background with Gradient Ellipses */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {backgroundBlurs.map((pos, i) => (
          <div
            key={i}
            className="absolute w-[542px] h-[494px] rounded-full blur-[75px]"
            style={{
              left: pos.left,
              top: pos.top,
              background: 'rgba(80, 0, 181, 0.67)',
              opacity: 0.25
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-16 py-24">

          {/* Header */}
          <div className="text-center mb-20">
            <Badge className="px-6 py-4 text-lg rounded-full bg-transparent border-none mb-8">
              <Award className="w-5 h-5 mr-2" />
              ✨ AI-Supercharged Success Stories
            </Badge>

            <h1 className="text-7xl lg:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] mb-6">
              Our Work in Action,<br />
              <span className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent">Results That Speak</span>
            </h1>
            <p className="text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl mx-auto">
              See how our AI-supercharged engineers have transformed businesses across industries. Speed of AI + Quality of Professional Engineers.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-16">
            <div className="w-full sm:w-auto px-4">
              <div className="sm:inline-flex flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilter(category.id)}
                    className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium text-base transition-all duration-300 font-['Geist'] ${filter === category.id
                      ? 'bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-purple-500/20'
                      }`}
                  >
                    {category.name}
                    <span className="ml-2 opacity-60">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group h-full"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <Card className="h-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-400/70 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-purple-500/20 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                  <CardContent className="relative p-0 flex flex-col h-full">
                    {/* Project Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white border-0 text-[10px] px-2 py-0.5 font-['Geist']">
                          {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors font-['Bricolage_Grotesque'] line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-xs font-['Geist']">Client: {project.client}</p>
                      </div>

                      <p className="text-gray-300 mb-4 text-sm leading-relaxed font-['Geist'] line-clamp-3">
                        {project.description}
                      </p>

                      {/* Results */}
                      <div className="mb-4">
                        <h4 className="text-white text-xs font-semibold mb-2 flex items-center gap-1.5 font-['Bricolage_Grotesque']">
                          <TrendingUp className="w-3 h-3 text-purple-400" />
                          Key Results
                        </h4>
                        <div className="space-y-1">
                          {project.results.slice(0, 2).map((result, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                              <span className="text-gray-300 font-['Geist'] line-clamp-1">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.technologies.slice(0, 4).map((tech, idx) => (
                          <Badge key={idx} className="bg-purple-600/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 font-['Geist']">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge className="bg-purple-600/10 text-purple-400 border border-purple-500/20 text-[10px] px-2 py-0.5 font-['Geist']">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>

                      {/* View Project Link */}
                      {project.link && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors group/link"
                          >
                            Visit Website
                            <ExternalLink className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-30" />
              <div className="relative">
                <h2 className="text-5xl font-bold text-white mb-6 font-['Bricolage_Grotesque']">
                  Ready to Join Our
                  <span className="block bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent mt-2">Success Stories?</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-['Geist']">
                  Let our AI-supercharged engineers create your next success story. Experience the same results-driven approach that's transformed these businesses.
                </p>
                <Link to={createPageUrl("StartProject")}>
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:from-[#0580E8]/90 hover:to-[#7000FF]/90 text-white font-bold px-12 py-6 text-lg rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 font-['Bricolage_Grotesque']">
                    Start Your Success Story
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}