import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer,
  Droplets,
  Eye,
  AlertTriangle
} from "lucide-react";

interface WeatherData {
  day: string;
  date: string;
  condition: string;
  temp: { min: number; max: number };
  humidity: number;
  windSpeed: number;
  rainfall: number;
  farmingAdvice: string;
  icon: string;
}

interface WeatherReportProps {
  location: string;
}

export const WeatherReport = ({ location }: WeatherReportProps) => {
  const weatherData: WeatherData[] = [
    {
      day: "Today",
      date: "Dec 21",
      condition: "Partly Cloudy",
      temp: { min: 18, max: 28 },
      humidity: 65,
      windSpeed: 12,
      rainfall: 0,
      farmingAdvice: "Good day for sowing operations",
      icon: "🌤️"
    },
    {
      day: "Tomorrow",
      date: "Dec 22",
      condition: "Light Rain",
      temp: { min: 16, max: 24 },
      humidity: 85,
      windSpeed: 8,
      rainfall: 5,
      farmingAdvice: "Avoid irrigation, good for transplanting",
      icon: "🌦️"
    },
    {
      day: "Day 3",
      date: "Dec 23",
      condition: "Heavy Rain",
      temp: { min: 15, max: 22 },
      humidity: 90,
      windSpeed: 15,
      rainfall: 25,
      farmingAdvice: "Avoid field work, check drainage",
      icon: "🌧️"
    },
    {
      day: "Day 4",
      date: "Dec 24",
      condition: "Cloudy",
      temp: { min: 17, max: 25 },
      humidity: 75,
      windSpeed: 10,
      rainfall: 2,
      farmingAdvice: "Resume field activities",
      icon: "☁️"
    },
    {
      day: "Day 5",
      date: "Dec 25",
      condition: "Sunny",
      temp: { min: 19, max: 29 },
      humidity: 55,
      windSpeed: 5,
      rainfall: 0,
      farmingAdvice: "Perfect for harvesting operations",
      icon: "☀️"
    },
    {
      day: "Day 6",
      date: "Dec 26",
      condition: "Hot",
      temp: { min: 21, max: 32 },
      humidity: 45,
      windSpeed: 8,
      rainfall: 0,
      farmingAdvice: "Increase irrigation frequency",
      icon: "🌡️"
    },
    {
      day: "Day 7",
      date: "Dec 27",
      condition: "Windy",
      temp: { min: 20, max: 30 },
      humidity: 60,
      windSpeed: 20,
      rainfall: 0,
      farmingAdvice: "Secure loose structures, avoid spraying",
      icon: "💨"
    }
  ];

  const getAdviceColor = (advice: string) => {
    if (advice.includes("Avoid") || advice.includes("check")) return "text-destructive";
    if (advice.includes("Perfect") || advice.includes("Good")) return "text-success";
    return "text-warning";
  };

  const getTempColor = (temp: number) => {
    if (temp >= 30) return "text-red-500";
    if (temp >= 25) return "text-orange-500";
    if (temp >= 20) return "text-green-500";
    return "text-blue-500";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Cloud className="w-6 h-6 text-primary" />
          7-Day Weather Forecast
        </h2>
        <p className="text-muted-foreground">
          Weather forecast for {location} with farming recommendations
        </p>
      </div>

      {/* Weather Alert */}
      <Card className="bg-destructive/10 border-destructive/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Heavy Rain Alert - Day 3</p>
              <p className="text-sm text-destructive/80">Prepare drainage, avoid field operations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {weatherData.map((weather, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <div className="text-3xl mb-1">{weather.icon}</div>
              <CardTitle className="text-lg">{weather.day}</CardTitle>
              <CardDescription>{weather.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">{weather.condition}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-lg font-bold ${getTempColor(weather.temp.max)}`}>
                    {weather.temp.max}°
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span className={`text-sm ${getTempColor(weather.temp.min)}`}>
                    {weather.temp.min}°C
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>Humidity</span>
                  </div>
                  <span>{weather.humidity}%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-gray-500" />
                    <span>Wind</span>
                  </div>
                  <span>{weather.windSpeed} km/h</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-blue-600" />
                    <span>Rain</span>
                  </div>
                  <span>{weather.rainfall}mm</span>
                </div>
              </div>

              <div className="border-t pt-2">
                <p className={`text-xs font-medium ${getAdviceColor(weather.farmingAdvice)}`}>
                  🌾 {weather.farmingAdvice}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Thermometer className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-sm text-muted-foreground">Avg Temp</p>
            <p className="text-xl font-bold">24°C</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CloudRain className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-muted-foreground">Total Rain</p>
            <p className="text-xl font-bold">32mm</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Wind className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <p className="text-sm text-muted-foreground">Avg Wind</p>
            <p className="text-xl font-bold">11 km/h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground">Avg Humidity</p>
            <p className="text-xl font-bold">68%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};