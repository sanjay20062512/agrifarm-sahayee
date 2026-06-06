import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Leaf, 
  Users, 
  MessageCircle, 
  Camera, 
  Building2,
  UserCog,
  Tractor,
  Menu,
  X,
  Globe,
  User,
  LogIn,
  LogOut,
  Mic
} from "lucide-react";
import { Calculator } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      id: "crop-recommendation", 
      label: t("nav.crop-recommendation"), 
      icon: Leaf,
      variant: "nav" as const
    },
    { 
      id: "learning", 
      label: t("nav.learning"), 
      icon: Users,
      variant: "crop" as const
    },
    { 
      id: "organic-farming", 
      label: t("nav.organic-farming"), 
      icon: Leaf,
      variant: "earth" as const
    },
    { 
      id: "farmer-forum", 
      label: t("nav.farmer-forum"), 
      icon: MessageCircle,
      variant: "harvest" as const
    },
    { 
      id: "ai-assistance", 
      label: t("nav.ai-assistance"), 
      icon: MessageCircle,
      variant: "crop" as const
    },
    { 
      id: "disease-detector", 
      label: t("nav.disease-detector"), 
      icon: Camera,
      variant: "earth" as const
    },
    { 
      id: "government-schemes", 
      label: t("nav.government-schemes"), 
      icon: Building2,
      variant: "nav" as const
    },
    { 
      id: "labor-hiring", 
      label: t("nav.labor-hiring"), 
      icon: UserCog,
      variant: "harvest" as const
    },
    { 
      id: "machinery-rental", 
      label: t("nav.machinery-rental"), 
      icon: Tractor,
      variant: "crop" as const
    },
    {
      id: "profit-predictor",
      label: language === "ta" ? "லாப கணிப்பு" : "Profit Calculator",
      icon: Calculator,
      variant: "earth" as const,
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
              <h1 className="text-xl font-bold text-foreground">{t("app.title")}</h1>
              <p className="text-xs text-muted-foreground">{t("app.subtitle")}</p>
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

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'தமிழ்' : 'English'}
            </Button>

            {/* Voice Assistant Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('voice-assistant')}
              className="flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden xl:inline">{language === 'ta' ? 'குரல் உதவி' : 'Voice'}</span>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={profile?.profile_photo || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {profile?.full_name?.charAt(0) || 'F'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:inline max-w-24 truncate">
                      {profile?.full_name || (language === 'ta' ? 'விவசாயி' : 'Farmer')}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    {language === 'ta' ? 'சுயவிவரம்' : 'Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === 'ta' ? 'வெளியேறு' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="nav"
                size="sm"
                onClick={() => navigate('/login')}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {language === 'ta' ? 'உள்நுழை' : 'Login'}
              </Button>
            )}

            <NotificationBell />
          </div>

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
              
              {/* Voice Assistant */}
              <Button
                variant={activeTab === 'voice-assistant' ? 'nav' : 'ghost'}
                onClick={() => {
                  setActiveTab('voice-assistant');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                <Mic className="w-4 h-4 mr-2" />
                {language === 'ta' ? 'குரல் உதவியாளர்' : 'Voice Assistant'}
              </Button>
              
              {/* Language Toggle */}
              <Button
                variant="ghost"
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="w-full justify-start"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? 'தமிழ்' : 'English'}
              </Button>
              
              {/* User Actions */}
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {language === 'ta' ? 'சுயவிவரம்' : 'Profile'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === 'ta' ? 'வெளியேறு' : 'Logout'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="nav"
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {language === 'ta' ? 'உள்நுழை' : 'Login'}
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};