import Layout from "./Layout.jsx";

import Home from "./Home";

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

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    StartProject: StartProject,
    
    Process: Process,
    
    Pricing: Pricing,
    
    About: About,
    
    Work: Work,
    
    Testimonials: Testimonials,
    
    AdminDashboard: AdminDashboard,
    
    UserDashboard: UserDashboard,
    
    DeveloperDashboard: DeveloperDashboard,
    
    ProjectReport: ProjectReport,
    
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
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/StartProject" element={<StartProject />} />
                
                <Route path="/Process" element={<Process />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Work" element={<Work />} />
                
                <Route path="/Testimonials" element={<Testimonials />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/UserDashboard" element={<UserDashboard />} />
                
                <Route path="/DeveloperDashboard" element={<DeveloperDashboard />} />
                
                <Route path="/ProjectReport" element={<ProjectReport />} />
                
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