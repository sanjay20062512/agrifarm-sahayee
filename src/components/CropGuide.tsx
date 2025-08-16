import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Thermometer, 
  Droplets, 
  Calendar, 
  Sprout, 
  Bug, 
  Scissors, 
  TrendingUp,
  IndianRupee,
  AlertTriangle
} from "lucide-react";

interface CropGuideProps {
  cropName: string;
  onBack: () => void;
}

export const CropGuide = ({ cropName, onBack }: CropGuideProps) => {
  const cropGuideData = {
    wheat: {
      climate: {
        temperature: "15-25°C",
        rainfall: "750-1000mm",
        humidity: "50-70%",
        soil: "Well-drained loamy soil with pH 6.0-7.5"
      },
      sowing: {
        timing: "November-December (Rabi season)",
        method: "Broadcasting or line sowing",
        seedRate: "100-125 kg/hectare",
        depth: "3-5 cm"
      },
      irrigation: [
        { stage: "Crown root initiation", days: "20-25 DAS", water: "Light irrigation" },
        { stage: "Tillering", days: "40-45 DAS", water: "Heavy irrigation" },
        { stage: "Jointing", days: "60-65 DAS", water: "Critical irrigation" },
        { stage: "Flowering", days: "85-90 DAS", water: "Critical irrigation" },
        { stage: "Milk stage", days: "105-110 DAS", water: "Light irrigation" }
      ],
      fertilizer: {
        chemical: [
          { name: "Urea", quantity: "130 kg/ha", timing: "Split doses", reason: "Nitrogen for vegetative growth" },
          { name: "DAP", quantity: "100 kg/ha", timing: "Basal application", reason: "Phosphorus for root development" },
          { name: "MOP", quantity: "50 kg/ha", timing: "Basal application", reason: "Potassium for grain filling" }
        ],
        organic: [
          { name: "FYM", quantity: "10 tonnes/ha", timing: "Before sowing", reason: "Improves soil structure and nutrients" },
          { name: "Vermicompost", quantity: "2 tonnes/ha", timing: "With sowing", reason: "Slow release nutrients" }
        ]
      },
      pests: [
        { 
          name: "Aphids", 
          symptoms: "Yellowing leaves, sticky honeydew", 
          treatment: "Imidacloprid 17.8% SL @ 0.3ml/L",
          prevention: "Use yellow sticky traps, maintain field hygiene"
        },
        {
          name: "Termites",
          symptoms: "Wilting plants, damaged roots",
          treatment: "Chlorpyrifos 20% EC @ 2.5ml/L soil drench",
          prevention: "Treat seeds with Imidacloprid before sowing"
        }
      ],
      diseases: [
        {
          name: "Rust",
          symptoms: "Orange-brown pustules on leaves",
          treatment: "Propiconazole 25% EC @ 1ml/L",
          prevention: "Use resistant varieties, proper spacing"
        }
      ],
      harvesting: {
        timing: "110-130 days after sowing",
        method: "Manual harvesting or combine harvester",
        signs: "Golden yellow color, grains hard when pressed",
        yield: "40-50 quintals/hectare"
      },
      profitTips: [
        "Use certified seeds for higher yield",
        "Apply fertilizers based on soil test",
        "Harvest at right maturity to avoid losses",
        "Proper storage to prevent pest damage",
        "Sell during peak demand periods"
      ],
      marketPrice: "₹2,200-2,500 per quintal"
    }
  };

  const data = cropGuideData.wheat; // Default to wheat for demo

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Crops
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          {cropName} Complete Growing Guide
        </h1>
      </div>

      {/* Market Price Alert */}
      <Card className="bg-gradient-earth border-success">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-success" />
              <span className="font-semibold">Current Market Price:</span>
            </div>
            <span className="text-xl font-bold text-success">{data.marketPrice}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Climate & Soil Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-primary" />
              Climate & Soil Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Temperature:</span>
                <p className="font-semibold">{data.climate.temperature}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Rainfall:</span>
                <p className="font-semibold">{data.climate.rainfall}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Humidity:</span>
                <p className="font-semibold">{data.climate.humidity}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Soil:</span>
              <p className="font-semibold">{data.climate.soil}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sowing Method & Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              Sowing Method & Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Best Timing:</span>
                <p className="font-semibold">{data.sowing.timing}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Method:</span>
                <p className="font-semibold">{data.sowing.method}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Seed Rate:</span>
                <p className="font-semibold">{data.sowing.seedRate}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Depth:</span>
                <p className="font-semibold">{data.sowing.depth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Irrigation Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            Irrigation Schedule
          </CardTitle>
          <CardDescription>Critical watering stages for optimal growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.irrigation.map((irrigation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <span className="font-semibold">{irrigation.stage}</span>
                  <p className="text-sm text-muted-foreground">{irrigation.days}</p>
                </div>
                <Badge variant="secondary">{irrigation.water}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fertilizer Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Fertilizer Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-3 text-warning">Chemical Fertilizers</h4>
            <div className="space-y-2">
              {data.fertilizer.chemical.map((fert, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold">{fert.name}</span>
                      <p className="text-sm text-muted-foreground">{fert.timing}</p>
                    </div>
                    <Badge variant="outline">{fert.quantity}</Badge>
                  </div>
                  <p className="text-xs mt-2 text-accent">{fert.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-success">Organic Fertilizers</h4>
            <div className="space-y-2">
              {data.fertilizer.organic.map((fert, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold">{fert.name}</span>
                      <p className="text-sm text-muted-foreground">{fert.timing}</p>
                    </div>
                    <Badge variant="outline">{fert.quantity}</Badge>
                  </div>
                  <p className="text-xs mt-2 text-accent">{fert.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pest & Disease Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-destructive" />
              Pest Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.pests.map((pest, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h5 className="font-semibold text-destructive">{pest.name}</h5>
                <p className="text-sm text-muted-foreground mb-2">{pest.symptoms}</p>
                <div className="space-y-1">
                  <p className="text-xs"><strong>Treatment:</strong> {pest.treatment}</p>
                  <p className="text-xs"><strong>Prevention:</strong> {pest.prevention}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Disease Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.diseases.map((disease, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h5 className="font-semibold text-warning">{disease.name}</h5>
                <p className="text-sm text-muted-foreground mb-2">{disease.symptoms}</p>
                <div className="space-y-1">
                  <p className="text-xs"><strong>Treatment:</strong> {disease.treatment}</p>
                  <p className="text-xs"><strong>Prevention:</strong> {disease.prevention}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Harvesting & Profit Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-primary" />
              Harvesting Method & Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Timing:</span>
                <p className="font-semibold">{data.harvesting.timing}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Expected Yield:</span>
                <p className="font-semibold text-success">{data.harvesting.yield}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Method:</span>
              <p className="font-semibold">{data.harvesting.method}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Maturity Signs:</span>
              <p className="font-semibold">{data.harvesting.signs}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Profit Maximization Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.profitTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-success">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};