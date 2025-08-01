import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Onecart
                </h2>
                <p className="text-xs text-muted-foreground">All platforms, one app</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Onecart is your gateway to all major grocery delivery platforms. Shop from multiple stores, 
              compare prices, and save time - all from one convenient interface.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Privacy Policy
              </Button>
              <Button variant="outline" size="sm">
                Terms of Service
              </Button>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="font-semibold mb-4">Supported Platforms</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Blinkit</li>
              <li>Zepto</li>
              <li>Swiggy Instamart</li>
              <li>BigBasket</li>
              <li>Amazon Fresh</li>
              <li>Flipkart Grocery</li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Multi-platform access</li>
              <li>Quick price comparison</li>
              <li>Secure checkout</li>
              <li>Fast delivery tracking</li>
              <li>Save storage space</li>
              <li>Dark mode support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 Onecart. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p className="mb-1">
                <strong>Disclaimer:</strong> All brand names, logos, and trademarks belong to their respective owners.
              </p>
              <p>
                Onecart is an independent platform providing convenient access to publicly available grocery platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;