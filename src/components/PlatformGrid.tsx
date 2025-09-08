import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Star, Zap } from "lucide-react";

const platforms = [
  {
    id: "blinkit",
    name: "Blinkit",
    url: "https://blinkit.com",
    color: "bg-yellow-500",
    description: "10-minute delivery",
    icon: "⚡",
    features: ["Ultra fast", "Wide range"]
  },
  {
    id: "zepto",
    name: "Zepto",
    url: "https://www.zeptonow.com",
    color: "bg-purple-500",
    description: "Quick grocery delivery",
    icon: "🚀",
    features: ["Fast delivery", "Fresh produce"]
  },
  {
    id: "swiggy-instamart",
    name: "Swiggy Instamart",
    url: "https://www.swiggy.com/instamart",
    color: "bg-orange-500",
    description: "Instant grocery delivery",
    icon: "🛒",
    features: ["Instant delivery", "Best prices"]
  },
  {
    id: "bigbasket",
    name: "BigBasket",
    url: "https://www.bigbasket.com",
    color: "bg-green-500",
    description: "India's largest grocery",
    icon: "🥬",
    features: ["Huge selection", "Scheduled delivery"]
  },
  {
    id: "swiggy",
    name: "Swiggy",
    url: "https://www.swiggy.com",
    color: "bg-orange-500",
    description: "Food delivery & more",
    icon: "🍽️",
    features: ["Food delivery", "Quick commerce"]
  }
];

const PlatformGrid = () => {
  const handlePlatformClick = (url: string, platformName: string) => {
    try {
      const newWindow = window.open(url, "_blank");
      if (!newWindow) {
        alert(`Please allow popups to access ${platformName}`);
      }
    } catch (error) {
      console.error(`Error opening ${platformName}:`, error);
      alert(`Unable to open ${platformName}. Please try again later.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Platform</h2>
        <p className="text-muted-foreground">
          Access all major grocery platforms in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {platforms.slice(0, 3).map((platform) => (
          <Card
            key={platform.id}
            className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 cursor-pointer border-border/50"
            onClick={() => handlePlatformClick(platform.url, platform.name)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-white text-xl shadow-md`}
                  >
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {platform.description}
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="flex flex-wrap gap-2">
                {platform.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded-full"
                  >
                    {index === 0 ? (
                      <Zap className="h-3 w-3" />
                    ) : (
                      <Star className="h-3 w-3" />
                    )}
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                variant="platform"
                className="w-full justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlatformClick(platform.url, platform.name);
                }}
              >
                Open Platform
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second row with 2 platforms centered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {platforms.slice(3).map((platform) => (
          <Card
            key={platform.id}
            className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 cursor-pointer border-border/50"
            onClick={() => handlePlatformClick(platform.url, platform.name)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-white text-xl shadow-md`}
                  >
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {platform.description}
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="flex flex-wrap gap-2">
                {platform.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded-full"
                  >
                    {index === 0 ? (
                      <Zap className="h-3 w-3" />
                    ) : (
                      <Star className="h-3 w-3" />
                    )}
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                variant="platform"
                className="w-full justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlatformClick(platform.url, platform.name);
                }}
              >
                Open Platform
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlatformGrid;
