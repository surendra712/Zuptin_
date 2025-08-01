import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Zap, Smartphone, Clock } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="space-y-12">
      {/* Hero Content */}
      <div className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
            All Grocery Platforms
            <br />
            <span className="text-3xl md:text-5xl">In One Place</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access Blinkit, Zepto, Swiggy Instamart, BigBasket, Amazon Fresh and more without installing multiple apps. 
            Compare prices, save storage, shop smarter.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="hero" 
            onClick={onGetStarted}
            className="shadow-glow"
          >
            <ShoppingCart className="h-5 w-5" />
            Start Shopping
          </Button>
          <Button variant="outline" size="lg">
            <Zap className="h-4 w-4" />
            See How It Works
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 hover:shadow-elegant transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No App Downloads</h3>
              <p className="text-muted-foreground text-sm">
                Access all platforms directly through your browser. Save phone storage and battery.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-elegant transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Compare Instantly</h3>
              <p className="text-muted-foreground text-sm">
                Switch between platforms seamlessly to compare prices and find the best deals.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-elegant transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Optimized interface for quick switching and smooth browsing experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroSection;