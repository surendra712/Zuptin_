import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow">
                <img 
                  src="/zuptin-logo.jpg" 
                  alt="Zuptin Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Zuptin
                </h2>
                <p className="text-xs text-muted-foreground">Choose.. Compare.. Save..</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/zuptin_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://youtube.com/@zuptin-w7h?si=sZgNX-z7veJZvwo-"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
              >
                <Youtube className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://x.com/zuptin07"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Form
                </Link>
              </li>
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
              © 2025 Zuptin. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p className="mb-1">
                <strong>Disclaimer:</strong> All brand names, logos, and trademarks belong to their respective owners.
              </p>
              <p>
                Zuptin is an independent platform providing convenient access to publicly available grocery platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;