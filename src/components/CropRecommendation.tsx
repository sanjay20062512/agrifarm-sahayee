import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Clock, 
  Droplets, 
  TrendingUp, 
  IndianRupee,
  Lightbulb 
} from "lucide-react";

interface CropData {
  id: string;
  name: string;
  profit: string;
  duration: string;
  waterRequirement: string;
  marketDemand: "High" | "Medium" | "Low";
  reason: string;
  image: string;
}

interface CropRecommendationProps {
  userLocation: string;
  userSeason: string;
}

export const CropRecommendation = ({ userLocation, userSeason }: CropRecommendationProps) => {
  const mockCropData: CropData[] = [
    {
      id: "1",
      name: "Wheat",
      profit: "₹45,000-60,000",
      duration: "120-150 days",
      waterRequirement: "Medium",
      marketDemand: "High",
      reason: "Excellent rabi crop for your region with stable market prices",
      image: "🌾"
    },
    {
      id: "2",
      name: "Rice",
      profit: "₹40,000-55,000",
      duration: "90-120 days",
      waterRequirement: "High",
      marketDemand: "High",
      reason: "High demand in local markets, suitable for your soil type",
      image: "🌾"
    },
    {
      id: "3",
      name: "Tomato",
      profit: "₹80,000-1,20,000",
      duration: "75-85 days",
      waterRequirement: "Medium",
      marketDemand: "High",
      reason: "High value crop with excellent returns for small farms",
      image: "🍅"
    },
    {
      id: "4",
      name: "Onion",
      profit: "₹60,000-90,000",
      duration: "90-120 days",
      waterRequirement: "Low",
      marketDemand: "High",
      reason: "Drought resistant and high demand throughout the year",
      image: "🧅"
    },
    {
      id: "5",
      name: "Cotton",
      profit: "₹50,000-75,000",
      duration: "150-180 days",
      waterRequirement: "Medium",
      marketDemand: "Medium",
      reason: "Good cash crop for black soil regions",
      image: "🌱"
    },
    {
      id: "6",
      name: "Sugarcane",
      profit: "₹70,000-1,00,000",
      duration: "300-365 days",
      waterRequirement: "High",
      marketDemand: "High",
      reason: "Long-term high value crop with assured procurement",
      image: "🎋"
    }
  ];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getWaterColor = (water: string) => {
    switch (water) {
      case "High": return "text-blue-600";
      case "Medium": return "text-blue-400";
      default: return "text-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Recommended Crops for {userLocation}
        </h2>
        <p className="text-muted-foreground">
          {userSeason} season recommendations based on your farm details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockCropData.map((crop) => (
          <Card 
            key={crop.id} 
            className="hover:shadow-crop transition-all duration-300 hover:scale-105 group"
          >
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2 group-hover:animate-float">
                {crop.image}
              </div>
              <CardTitle className="text-lg">{crop.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profit/Acre:</span>
                <div className="flex items-center text-success font-semibold">
                  <IndianRupee className="w-3 h-3" />
                  <span className="text-xs">{crop.profit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <div className="flex items-center text-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  <span className="text-xs">{crop.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Water:</span>
                <div className={`flex items-center ${getWaterColor(crop.waterRequirement)}`}>
                  <Droplets className="w-3 h-3 mr-1" />
                  <span className="text-xs">{crop.waterRequirement}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Demand:</span>
                <Badge variant="secondary" className={getDemandColor(crop.marketDemand)}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {crop.marketDemand}
                </Badge>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{crop.reason}</p>
                </div>
              </div>

              <Button 
                variant="crop" 
                size="sm" 
                className="w-full"
              >
                <Sprout className="w-4 h-4 mr-1" />
                Start Plant
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};