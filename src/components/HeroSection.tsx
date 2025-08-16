import { Button } from "@/components/ui/button";
import heroImage from "@/assets/agri-hero.jpg";
import { ArrowRight, Users, Lightbulb, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
      </div>

      {/* Hero Content */}
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-grow">
            Welcome to <span className="text-accent">AgriAI</span>
          </h1>
          
          <p className="text-lg lg:text-xl mb-8 opacity-90 animate-grow">
            Your multilingual farming assistant for Indian agriculture
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-grow">
            <div className="flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              <span>Tamil + English Support</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span>Real-time Recommendations</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2">
              <Users className="w-5 h-5 text-accent" />
              <span>Farmer Community</span>
            </div>
          </div>

          <Button 
            onClick={onGetStarted}
            variant="harvest"
            size="lg"
            className="text-lg px-8 py-4 h-auto animate-grow"
          >
            Get Started with Crop Recommendations
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-success">10,000+</h3>
              <p className="text-muted-foreground">Happy Farmers</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-success">500+</h3>
              <p className="text-muted-foreground">Crop Varieties</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-success">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};