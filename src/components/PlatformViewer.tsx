import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Maximize2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";

interface Platform {
  id: string;
  name: string;
  url: string;
  color: string;
  description: string;
  icon: string;
}

interface PlatformViewerProps {
  platform: Platform;
  onBack: () => void;
}

const PlatformViewer = ({ platform, onBack }: PlatformViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = document.getElementById('platform-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleOpenExternal = () => {
    window.open(platform.url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Platform Header */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white text-lg shadow-md`}>
                  {platform.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{platform.name}</h2>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenExternal}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Platform Content */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-muted-foreground">Loading {platform.name}...</p>
              </div>
            </div>
          )}
          
          <iframe
            id="platform-iframe"
            src={platform.url}
            className="w-full h-[calc(100vh-200px)] border-0"
            title={platform.name}
            onLoad={() => setIsLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-navigation allow-popups"
          />
        </CardContent>
      </Card>

      {/* Legal Disclaimer */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> {platform.name} and all associated logos, trademarks, and content belong to their respective owners. 
            Onecart is an independent platform providing convenient access to publicly available websites. 
            We do not own, operate, or have any affiliation with the displayed platforms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformViewer;