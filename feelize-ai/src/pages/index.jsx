import Layout from "./Layout.jsx";
import Home from "./HomeComplete";
import StartProject from "./StartProject";
import Process from "./Process";
import Pricing from "./Pricing";
import About from "./About";
import Work from "./Work";
import Testimonials from "./Testimonials";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import DeveloperDashboard from "./DeveloperDashboard";
import ProjectReport from "./ProjectReport";
import TeamReport from "./TeamReport";
import ProjectDashboard from "./ProjectDashboard";
import AffiliateSignup from "./AffiliateSignup";
import ReferralRedirect from "./ReferralRedirect";

// Service Pages
import WebDevelopment from "./WebDevelopment";
import MobileAppDevelopment from "./MobileAppDevelopment";
import UIUXDesign from "./UIUXDesign";
import Branding from "./Branding";
import AIAutomation from "./AIAutomation";

// About Pages
import Careers from "./Careers";
import Contact from "./Contact";



// Admin Pages
import AdminPanel from "./AdminPanel";
import AdminAffiliates from "./AdminAffiliates";
import AdminReferrals from "./AdminReferrals";
import AdminProjects from "./AdminProjects";
import AdminClients from "./AdminClients";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ScrollToTop from "@/components/ScrollToTop.jsx";

const PAGES = {
    Home: Home,
    StartProject: StartProject,
    Process: Process,
    Pricing: Pricing,
    About: About,
    Work: Work,
    Portfolio: Work, // Alias for Work page
    Testimonials: Testimonials,
    AdminDashboard: AdminDashboard,
    UserDashboard: UserDashboard,
    DeveloperDashboard: DeveloperDashboard,
    ProjectReport: ProjectReport,
    TeamReport: TeamReport,
    ProjectDashboard: ProjectDashboard,
    AffiliateSignup: AffiliateSignup,
    AdminPanel: AdminPanel,
    AdminAffiliates: AdminAffiliates,
    AdminReferrals: AdminReferrals,
    AdminProjects: AdminProjects,
    AdminClients: AdminClients,
    // Service Pages
    WebDevelopment: WebDevelopment,
    MobileAppDevelopment: MobileAppDevelopment,
    UIUXDesign: UIUXDesign,
    Branding: Branding,
    AIAutomation: AIAutomation,
    // About Pages
    Careers: Careers,
    Contact: Contact,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Layout currentPageName={currentPage}>
            <ScrollToTop/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/StartProject" element={<StartProject />} />
                <Route path="/Process" element={<Process />} />
                <Route path="/Pricing" element={<Pricing />} />
                <Route path="/About" element={<About />} />
                <Route path="/Work" element={<Work />} />
                <Route path="/Portfolio" element={<Work />} />
                <Route path="/Testimonials" element={<Testimonials />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                <Route path="/UserDashboard" element={<UserDashboard />} />
                <Route path="/DeveloperDashboard" element={<DeveloperDashboard />} />
                <Route path="/ProjectReport" element={<ProjectReport />} />
                <Route path="/TeamReport" element={<TeamReport />} />
                <Route path="/ProjectDashboard" element={<ProjectDashboard />} />
                <Route path="/AffiliateSignup" element={<AffiliateSignup />} />

                {/* Service Pages */}
                <Route path="/WebDevelopment" element={<WebDevelopment />} />
                <Route path="/MobileAppDevelopment" element={<MobileAppDevelopment />} />
                <Route path="/UIUXDesign" element={<UIUXDesign />} />
                <Route path="/Branding" element={<Branding />} />
                <Route path="/AIAutomation" element={<AIAutomation />} />

                {/* About Pages */}
                <Route path="/Careers" element={<Careers />} />
                <Route path="/Contact" element={<Contact />} />


                {/* Admin Panel Routes */}
                <Route path="/AdminPanel" element={<AdminPanel />} />
                <Route path="/AdminAffiliates" element={<AdminAffiliates />} />
                <Route path="/AdminReferrals" element={<AdminReferrals />} />
                <Route path="/AdminProjects" element={<AdminProjects />} />
                <Route path="/AdminClients" element={<AdminClients />} />

                {/* Catch-all for custom referral codes - MUST BE LAST */}
                <Route path="/:referralCode" element={<ReferralRedirect />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}