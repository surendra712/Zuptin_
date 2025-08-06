import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Zap, Smartphone, Clock } from "lucide-react";
import SocialLinks from "./SocialLinks";

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
            Your Favorite Food & Grocery Apps — All in One Smart Cart
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Shop from Blinkit, Zepto, Instamart, BigBasket, Swiggy & Zomato — all within Zuptin.
            Compare prices. Save time. Skip the app-switching.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="hero" 
            onClick={onGetStarted}
            className="shadow-glow"
          >
            <div className="w-5 h-5 rounded overflow-hidden mr-2">
              <img 
                src="/zuptin-logo.jpg" 
                alt="Zuptin Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            Start Shopping with Zuptin
          </Button>
        </div>
        
        <div className="flex justify-center mt-8">
          <SocialLinks />
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
              <h3 className="font-semibold text-lg">📱 No Installs, Just Access</h3>
              <p className="text-muted-foreground text-sm">
                Use Zuptin directly from your browser.
                No downloads, no updates — just instant grocery access.
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
              <h3 className="font-semibold text-lg">🔎 Compare Across Stores</h3>
              <p className="text-muted-foreground text-sm">
                Effortlessly browse and compare prices from all major grocery apps — 
                save time, save money, shop smart.
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
              <h3 className="font-semibold text-lg">⚡ Blazing Fast Experience</h3>
              <p className="text-muted-foreground text-sm">
                Enjoy a super-smooth, lag-free interface built for speed.
                Quick switching, instant loading, zero delay.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroSection;
