import { Button } from "@/components/ui/button";
import { ShoppingCart, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "./UserMenu";

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header = ({ onLogoClick }: HeaderProps = {}) => {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl overflow-hidden shadow-glow flex items-center justify-center">
                <img 
                  src="/zuptin-logo.jpg" 
                  alt="Zuptin Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Zuptin
              </h1>
              <p className="text-xs text-muted-foreground">Choose.. Compare.. Save..</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {!loading && (
              user ? (
                <UserMenu />
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
