import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlatformGrid from "@/components/PlatformGrid";
import PlatformViewer from "@/components/PlatformViewer";

const Index = () => {
  const [currentView, setCurrentView] = useState<'hero' | 'platforms' | 'viewer'>('hero');
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentView('platforms');
  };

  const handlePlatformSelect = (platform: any) => {
    setSelectedPlatform(platform);
    setCurrentView('viewer');
  };

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
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'hero' && (
          <div className="animate-fade-in">
            <HeroSection onGetStarted={handleGetStarted} />
          </div>
        )}

        {currentView === 'platforms' && (
          <div className="animate-fade-in">
            <PlatformGrid onPlatformSelect={handlePlatformSelect} />
          </div>
        )}

        {currentView === 'viewer' && selectedPlatform && (
          <div className="animate-fade-in">
            <PlatformViewer platform={selectedPlatform} onBack={handleBack} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
