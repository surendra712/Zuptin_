import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlatformGrid from "@/components/PlatformGrid";
import PlatformViewer from "@/components/PlatformViewer";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [currentView, setCurrentView] = useState<'hero' | 'platforms' | 'viewer'>('hero');
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Reset to hero view when navigating to home
  useEffect(() => {
    if (location.pathname === '/') {
      setCurrentView('hero');
      setSelectedPlatform(null);
    }
  }, [location.pathname]);

  const handleGetStarted = () => {
    if (!user && !loading) {
      navigate('/auth');
      return;
    }
    setCurrentView('platforms');
  };

  const handleLogoClick = () => {
    setCurrentView('hero');
    setSelectedPlatform(null);
  };

  // Platform selection now directly opens external URLs

  const handleBack = () => {
    if (currentView === 'viewer') {
      setCurrentView('platforms');
      setSelectedPlatform(null);
    } else if (currentView === 'platforms') {
      setCurrentView('hero');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onLogoClick={handleLogoClick} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'hero' && (
          <div className="animate-fade-in">
            <HeroSection onGetStarted={handleGetStarted} />
          </div>
        )}

        {currentView === 'platforms' && (
          <div className="animate-fade-in">
            <PlatformGrid />
          </div>
        )}

        {/* Viewer removed - platforms now open directly in new tabs */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
