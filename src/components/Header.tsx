import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Leaf, 
  Users, 
  MessageCircle, 
  Camera, 
  Building2,
  Menu,
  X
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { 
      id: "crop-recommendation", 
      label: "Crop Recommendation", 
      icon: Leaf,
      variant: "nav" as const
    },
    { 
      id: "farmer-forum", 
      label: "Farmer Forum", 
      icon: Users,
      variant: "harvest" as const
    },
    { 
      id: "ai-assistance", 
      label: "AI Assistance", 
      icon: MessageCircle,
      variant: "crop" as const
    },
    { 
      id: "disease-detector", 
      label: "AI Disease Detector", 
      icon: Camera,
      variant: "earth" as const
    },
    { 
      id: "government-schemes", 
      label: "Government Schemes", 
      icon: Building2,
      variant: "nav" as const
    }
  ];

  return (
    <header className="bg-card border-b border-border shadow-crop sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AgriAI</h1>
              <p className="text-xs text-muted-foreground">Smart Farming Assistant</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? item.variant : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 animate-grow">
            <nav className="grid grid-cols-1 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? item.variant : "ghost"}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};