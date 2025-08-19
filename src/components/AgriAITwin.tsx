import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Leaf, 
  Droplets, 
  CloudRain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Thermometer,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "./LanguageContext";

interface FarmData {
  location: string;
  soilType: string;
  farmSize: number;
  currentCrop: string;
  sowingDate: string;
  irrigationType: string;
  previousYield: number;
}

interface AIRecommendation {
  type: "irrigation" | "fertilizer" | "pest" | "market" | "weather";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  impact: string;
}

export const AgriAITwin = () => {
  const [isSetup, setIsSetup] = useState(false);
  const [farmData, setFarmData] = useState<FarmData>({
    location: "",
    soilType: "",
    farmSize: 0,
    currentCrop: "",
    sowingDate: "",
    irrigationType: "",
    previousYield: 0
  });
  const { language } = useLanguage();

  const soilTypes = ["Black Soil", "Red Soil", "Alluvial Soil", "Clay Soil", "Sandy Soil", "Loamy Soil"];
  const crops = ["Tomato", "Rice", "Wheat", "Cotton", "Sugarcane", "Onion", "Potato", "Chili", "Brinjal"];
  const irrigationTypes = ["Drip", "Sprinkler", "Flood", "Furrow", "Rain-fed"];

  // Mock AI recommendations based on farm data
  const getAIRecommendations = (): AIRecommendation[] => {
    return [
      {
        type: "irrigation",
        priority: "high",
        title: language === 'tamil' ? "இன்று நீர்ப்பாசனம் தேவை" : "Irrigation Needed Today",
        description: language === 'tamil' ? 
          "மண்ணின் ஈரப்பதம் 40% ஆக குறைந்துள்ளது" : 
          "Soil moisture has dropped to 40%",
        action: language === 'tamil' ? 
          "30 நிமிடம் நீர்ப்பாசனம் செய்யவும்" : 
          "Irrigate for 30 minutes today",
        impact: language === 'tamil' ? 
          "5-10% மகசூல் அதிகரிப்பு எதிர்பார்க்கலாம்" : 
          "Expected 5-10% yield increase"
      },
      {
        type: "fertilizer",
        priority: "medium",
        title: language === 'tamil' ? "உர பயன்பாட்டு பரிந்துரை" : "Fertilizer Application Due",
        description: language === 'tamil' ? 
          "பூக்கும் நிலைக்கு பொட்டாசியம் தேவை" : 
          "Potassium needed for flowering stage",
        action: language === 'tamil' ? 
          "MOP 25kg/acre இடவும்" : 
          "Apply MOP 25kg/acre",
        impact: language === 'tamil' ? 
          "பூக்கும் திறன் 15% அதிகரிக்கும்" : 
          "15% improvement in flowering"
      },
      {
        type: "pest",
        priority: "high",
        title: language === 'tamil' ? "பூச்சி தாக்குதல் எச்சரிக்கை" : "Pest Attack Alert",
        description: language === 'tamil' ? 
          "வானிலை நிலவரப்படி அடுத்த 3 நாளில் அசுவினி பூச்சி தாக்குதல் சாத்தியம்" : 
          "Weather conditions favor aphid attack in next 3 days",
        action: language === 'tamil' ? 
          "நீம் எண்ணெய் தெளிக்கவும் (3ml/L)" : 
          "Spray neem oil (3ml/L)",
        impact: language === 'tamil' ? 
          "பயிர் இழப்பை 80% தடுக்கலாம்" : 
          "Prevent 80% crop damage"
      },
      {
        type: "market",
        priority: "medium",
        title: language === 'tamil' ? "சந்தை விலை முன்னறிவிப்பு" : "Market Price Forecast",
        description: language === 'tamil' ? 
          "அடுத்த வாரம் தக்காளி விலை 20% அதிகரிக்க வாய்ப்பு" : 
          "Tomato prices likely to increase 20% next week",
        action: language === 'tamil' ? 
          "அறுவடையை 5 நாள் தள்ளிப்போடவும்" : 
          "Delay harvest by 5 days",
        impact: language === 'tamil' ? 
          "₹5,000 கூடுதல் வருமானம்" : 
          "Additional income of ₹5,000"
      },
      {
        type: "weather",
        priority: "low",
        title: language === 'tamil' ? "வானிலை எச்சரிக்கை" : "Weather Alert",
        description: language === 'tamil' ? 
          "அடுத்த 2 நாளில் கனமழை எதிர்பார்க்கப்படுகிறது" : 
          "Heavy rainfall expected in next 2 days",
        action: language === 'tamil' ? 
          "வயலில் நீர் வெளியேற்ற ஏற்பாடு செய்யவும்" : 
          "Arrange proper drainage in field",
        impact: language === 'tamil' ? 
          "வேர் அழுகல் நோயை தடுக்கலாம்" : 
          "Prevent root rot disease"
      }
    ];
  };

  const handleSetupComplete = () => {
    if (farmData.location && farmData.soilType && farmData.currentCrop) {
      setIsSetup(true);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 border-destructive/20 text-destructive";
      case "medium": return "bg-warning/10 border-warning/20 text-warning";
      default: return "bg-primary/10 border-primary/20 text-primary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "irrigation": return <Droplets className="w-5 h-5 text-blue-500" />;
      case "fertilizer": return <Zap className="w-5 h-5 text-yellow-500" />;
      case "pest": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "market": return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "weather": return <CloudRain className="w-5 h-5 text-blue-400" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  if (!isSetup) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="w-10 h-10 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              {language === 'tamil' ? 'விவசாய AI Twin' : 'Agri AI Twin'}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'tamil' ? 
              "உங்கள் பண்ணையின் டிஜிட்டல் நகல் உருவாக்கி, தனிப்பயனாக்கப்பட்ட அறிவுரைகளைப் பெறுங்கள்" :
              "Create a digital replica of your farm and get personalized AI-powered recommendations"
            }
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              {language === 'ta' ? 'பண்ணை தகவல்கள்' : 'Farm Data Collection'}
            </CardTitle>
            <CardDescription>
              {language === 'tamil' ? 
                "உங்கள் பண்ணையின் விவரங்களை நமக்கு கொடுத்து AI Twin உருவாக்குங்கள்" :
                "Provide your farm details to create your personalized AI Twin"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">
                  {language === 'tamil' ? 'இடம் (மாவட்டம், மாநிலம்)' : 'Location (District, State)'}
                </Label>
                <Input
                  id="location"
                  placeholder={language === 'tamil' ? "உ.ம்: சேலம், தமிழ்நாடு" : "e.g: Salem, Tamil Nadu"}
                  value={farmData.location}
                  onChange={(e) => setFarmData({...farmData, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilType">
                  {language === 'tamil' ? 'மண் வகை' : 'Soil Type'}
                </Label>
                <Select value={farmData.soilType} onValueChange={(value) => setFarmData({...farmData, soilType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'tamil' ? "மண் வகையை தேர்வுசெய்யவும்" : "Select soil type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmSize">
                  {language === 'tamil' ? 'பண்ணை அளவு (ஏக்கர்)' : 'Farm Size (Acres)'}
                </Label>
                <Input
                  id="farmSize"
                  type="number"
                  placeholder="5"
                  value={farmData.farmSize || ""}
                  onChange={(e) => setFarmData({...farmData, farmSize: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentCrop">
                  {language === 'tamil' ? 'தற்போதைய பயிர்' : 'Current Crop'}
                </Label>
                <Select value={farmData.currentCrop} onValueChange={(value) => setFarmData({...farmData, currentCrop: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'tamil' ? "பயிரை தேர்வுசெய்யவும்" : "Select crop"} />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sowingDate">
                  {language === 'tamil' ? 'விதைத்த தேதி' : 'Sowing Date'}
                </Label>
                <Input
                  id="sowingDate"
                  type="date"
                  value={farmData.sowingDate}
                  onChange={(e) => setFarmData({...farmData, sowingDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="irrigationType">
                  {language === 'tamil' ? 'நீர்ப்பாசன முறை' : 'Irrigation Type'}
                </Label>
                <Select value={farmData.irrigationType} onValueChange={(value) => setFarmData({...farmData, irrigationType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'tamil' ? "நீர்ப்பாசன முறையை தேர்வுசெய்யவும்" : "Select irrigation method"} />
                  </SelectTrigger>
                  <SelectContent>
                    {irrigationTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousYield">
                {language === 'tamil' ? 'முந்தைய மகசூல் (டன்/ஏக்கர்)' : 'Previous Yield (Tons/Acre)'}
              </Label>
              <Input
                id="previousYield"
                type="number"
                step="0.1"
                placeholder="2.5"
                value={farmData.previousYield || ""}
                onChange={(e) => setFarmData({...farmData, previousYield: Number(e.target.value)})}
              />
            </div>

            <Button 
              onClick={handleSetupComplete}
              disabled={!farmData.location || !farmData.soilType || !farmData.currentCrop}
              variant="nav"
              size="lg"
              className="w-full"
            >
              <Brain className="w-4 h-4 mr-2" />
              {language === 'tamil' ? 'AI Twin உருவாக்கு' : 'Create AI Twin'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-primary animate-pulse" />
          <h2 className="text-3xl font-bold text-foreground">
            {language === 'tamil' ? 'உங்கள் AI Twin செயலில்' : 'Your AI Twin is Active'}
          </h2>
        </div>
        <p className="text-muted-foreground">
          {language === 'tamil' ? 
            `${farmData.currentCrop} பயிருக்கான தனிப்பயனாக்கப்பட்ட அறிவுரைகள்` :
            `Personalized recommendations for your ${farmData.currentCrop} farm`
          }
        </p>
      </div>

      {/* Farm Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm font-semibold">{farmData.location}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'tamil' ? 'இடம்' : 'Location'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">{farmData.farmSize}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'tamil' ? 'ஏக்கர்' : 'Acres'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">{farmData.currentCrop}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'tamil' ? 'பயிர்' : 'Crop'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">{farmData.soilType}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'tamil' ? 'மண் வகை' : 'Soil'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">{farmData.irrigationType}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'tamil' ? 'நீர்ப்பாசனம்' : 'Irrigation'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">{farmData.previousYield}T</div>
              <div className="text-xs text-muted-foreground">
                {language === 'tamil' ? 'முந்தைய மகசூல்' : 'Last Yield'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          {language === 'tamil' ? 'AI பரிந்துரைகள்' : 'AI Recommendations'}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {getAIRecommendations().map((recommendation, index) => (
            <Card key={index} className={`${getPriorityColor(recommendation.priority)} hover:shadow-lg transition-all duration-300`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(recommendation.type)}
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className={`${getPriorityColor(recommendation.priority)} border-current`}>
                    {recommendation.priority}
                  </Badge>
                </div>
                <CardDescription className="text-foreground/80">
                  {recommendation.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-background/50 p-3 rounded-lg">
                  <div className="font-semibold text-sm mb-1">
                    {language === 'tamil' ? 'செயல்:' : 'Action:'}
                  </div>
                  <div className="text-sm">{recommendation.action}</div>
                </div>
                <div className="bg-success/10 p-3 rounded-lg">
                  <div className="font-semibold text-sm mb-1 text-success">
                    {language === 'tamil' ? 'எதிர்பார்க்கப்படும் தாக்கம்:' : 'Expected Impact:'}
                  </div>
                  <div className="text-sm text-success">{recommendation.impact}</div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  {language === 'tamil' ? 'விவரங்கள் பார்க்க' : 'View Details'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Status */}
      <Card className="bg-gradient-earth">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">
            {language === 'tamil' ? 'AI கற்றுக்கொண்டிருக்கிறது' : 'AI Twin is Learning'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {language === 'tamil' ? 
              "உங்கள் செயல்களையும் முடிவுகளையும் அடிப்படையாக கொண்டு AI மேலும் புத்திசாலியாகிறது" :
              "Based on your actions and outcomes, the AI Twin becomes smarter over time"
            }
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">95%</div>
              <div className="text-muted-foreground">
                {language === 'tamil' ? 'துல்லியம்' : 'Accuracy'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">47</div>
              <div className="text-muted-foreground">
                {language === 'tamil' ? 'பரிந்துரைகள்' : 'Recommendations'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">12%</div>
              <div className="text-muted-foreground">
                {language === 'tamil' ? 'மகசூல் அதிகரிப்பு' : 'Yield Increase'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};