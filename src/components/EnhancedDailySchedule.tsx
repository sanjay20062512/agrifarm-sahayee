import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Droplets, 
  Scissors, 
  Sprout,
  Bug,
  Zap,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  MapPin,
  Star
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface DailyTask {
  id: string;
  day: number;
  week: number;
  stage: string;
  tasks: {
    id: string;
    task: string;
    taskTamil: string;
    type: "irrigation" | "fertilizer" | "pest-control" | "weeding" | "sowing" | "harvesting" | "general";
    priority: "high" | "medium" | "low";
    completed: boolean;
    weather_dependent: boolean;
    fertilizer_details?: {
      chemical: string;
      organic: string;
      quantity: string;
    };
    pest_details?: {
      target: string;
      method: string;
      timing: string;
    };
  }[];
  market_price?: {
    current: number;
    trend: "up" | "down" | "stable";
    best_selling_time: string;
    best_selling_place: string;
  };
}

interface EnhancedDailyScheduleProps {
  cropName: string;
  totalDuration: number;
  onBack: () => void;
}

export const EnhancedDailySchedule = ({ cropName, totalDuration, onBack }: EnhancedDailyScheduleProps) => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const { language } = useLanguage();

  // Enhanced daily schedule with detailed tasks and market insights
  const dailySchedule: DailyTask[] = [
    {
      id: "week1-day1",
      day: 1,
      week: 1,
      stage: language === 'ta' ? "நில தயாரிப்பு" : "Land Preparation",
      tasks: [
        { 
          id: "1-1", 
          task: "Deep plowing of field to 20-25cm depth", 
          taskTamil: "20-25 செ.மீ ஆழத்தில் ஆழமாக உழவு செய்யவும்",
          type: "general", 
          priority: "high", 
          completed: false, 
          weather_dependent: true 
        },
        { 
          id: "1-2", 
          task: "Apply Farm Yard Manure (FYM)", 
          taskTamil: "பண்ணை எரு (FYM) இடவும்",
          type: "fertilizer", 
          priority: "high", 
          completed: false, 
          weather_dependent: false,
          fertilizer_details: {
            chemical: "DAP 50kg/acre + Urea 25kg/acre",
            organic: "FYM 10 tonnes/hectare + Vermicompost 2 tonnes/hectare",
            quantity: "Mix thoroughly with soil"
          }
        },
        { 
          id: "1-3", 
          task: "Level the field and create furrows", 
          taskTamil: "வயலை சமன் செய்து வாய்க்கால்கள் அமைக்கவும்",
          type: "general", 
          priority: "medium", 
          completed: false, 
          weather_dependent: true 
        }
      ]
    },
    {
      id: "week1-day3",
      day: 3,
      week: 1,
      stage: language === 'tamil' ? "விதைப்பு தயாரிப்பு" : "Seedbed Preparation",
      tasks: [
        { 
          id: "1-4", 
          task: "Prepare raised seedbeds (1m width)", 
          taskTamil: "உயர்ந்த விதைப்படுக்கைகள் தயார் செய்யவும் (1 மீ அகலம்)",
          type: "sowing", 
          priority: "high", 
          completed: false, 
          weather_dependent: false 
        },
        { 
          id: "1-5", 
          task: "Seed treatment with fungicide", 
          taskTamil: "விதைகளை பூஞ்சைக் கொல்லியால் நேர்த்தி செய்யவும்",
          type: "pest-control", 
          priority: "high", 
          completed: false, 
          weather_dependent: false,
          pest_details: {
            target: "Seed-borne diseases",
            method: "Thiram 2g/kg seed + Carbendazim 1g/kg",
            timing: "2 hours before sowing"
          }
        },
        { 
          id: "1-6", 
          task: "Sow seeds in nursery at 1cm depth", 
          taskTamil: "1 செ.மீ ஆழத்தில் நாற்றங்காலில் விதைக்கவும்",
          type: "sowing", 
          priority: "high", 
          completed: false, 
          weather_dependent: false 
        }
      ]
    },
    {
      id: "week4-day28",
      day: 28,
      week: 4,
      stage: language === 'tamil' ? "நடவு" : "Transplanting",
      tasks: [
        { 
          id: "4-1", 
          task: "Transplant 25-30 day old seedlings", 
          taskTamil: "25-30 நாள் பழைய நாற்றுகளை நடவு செய்யவும்",
          type: "sowing", 
          priority: "high", 
          completed: false, 
          weather_dependent: true 
        },
        { 
          id: "4-2", 
          task: "Apply basal fertilizer", 
          taskTamil: "அடிப்படை உரம் இடவும்",
          type: "fertilizer", 
          priority: "high", 
          completed: false, 
          weather_dependent: false,
          fertilizer_details: {
            chemical: "DAP 250kg/ha + MOP 100kg/ha + Urea 100kg/ha",
            organic: "Neem cake 200kg/ha + Bone meal 150kg/ha + Rock phosphate 100kg/ha",
            quantity: "Apply in bands near root zone"
          }
        }
      ]
    },
    {
      id: "week8-day56",
      day: 56,
      week: 8,
      stage: language === 'tamil' ? "வளர்ச்சி நிலை" : "Vegetative Growth",
      tasks: [
        { 
          id: "8-1", 
          task: "First top dressing fertilizer application", 
          taskTamil: "முதல் மேல் உரம் இடவும்",
          type: "fertilizer", 
          priority: "high", 
          completed: false, 
          weather_dependent: false,
          fertilizer_details: {
            chemical: "Urea 100kg/ha + MOP 50kg/ha",
            organic: "Liquid organic manure 500L/ha + Seaweed extract 2L/ha",
            quantity: "Apply after irrigation when soil is moist"
          }
        },
        { 
          id: "8-2", 
          task: "Monitor and control early pests", 
          taskTamil: "ஆரம்பகால பூச்சிகளை கண்காணித்து கட்டுப்படுத்தவும்",
          type: "pest-control", 
          priority: "high", 
          completed: false, 
          weather_dependent: false,
          pest_details: {
            target: "Aphids, Thrips, Early Blight",
            method: "Neem oil 3ml/L + Imidacloprid 0.3ml/L (if severe)",
            timing: "Evening hours (5-7 PM)"
          }
        }
      ]
    },
    {
      id: "week12-day84",
      day: 84,
      week: 12,
      stage: language === 'tamil' ? "பூக்கும் நிலை" : "Flowering Stage",
      tasks: [
        { 
          id: "12-1", 
          task: "Apply flowering stage fertilizer", 
          taskTamil: "பூக்கும் நிலை உரம் இடவும்",
          type: "fertilizer", 
          priority: "high", 
          completed: false, 
          weather_dependent: false,
          fertilizer_details: {
            chemical: "19:19:19 NPK 25kg/ha + Calcium Nitrate 20kg/ha",
            organic: "Banana peel extract 10L/ha + Epsom salt 5kg/ha",
            quantity: "Foliar spray in early morning"
          }
        },
        { 
          id: "12-2", 
          task: "Monitor for fruit borers", 
          taskTamil: "பழ துளைப்பான் பூச்சிகளை கண்காணிக்கவும்",
          type: "pest-control", 
          priority: "high", 
          completed: false, 
          weather_dependent: false,
          pest_details: {
            target: "Fruit borers, Helicoverpa",
            method: "Pheromone traps + Bt spray 2ml/L + Spinosad 0.5ml/L",
            timing: "Weekly monitoring, spray at dusk"
          }
        }
      ],
      market_price: {
        current: 2500,
        trend: "up",
        best_selling_time: "Early morning (6-8 AM)",
        best_selling_place: "Local wholesale mandi - 15km away"
      }
    },
    {
      id: "week16-day110",
      day: 110,
      week: 16,
      stage: language === 'tamil' ? "அறுவடை" : "Harvesting",
      tasks: [
        { 
          id: "16-1", 
          task: "Harvest mature fruits", 
          taskTamil: "முதிர்ந்த பழங்களை அறுவடை செய்யவும்",
          type: "harvesting", 
          priority: "high", 
          completed: false, 
          weather_dependent: false 
        },
        { 
          id: "16-2", 
          task: "Sort and grade harvested produce", 
          taskTamil: "அறுவடை செய்த பொருளை வகைப்படுத்தி தரம் பிரிக்கவும்",
          type: "harvesting", 
          priority: "high", 
          completed: false, 
          weather_dependent: false 
        }
      ],
      market_price: {
        current: 3200,
        trend: "up",
        best_selling_time: "Wait 3-5 days, prices expected to rise",
        best_selling_place: "Regional wholesale market - 25km (better prices)"
      }
    }
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "irrigation": return <Droplets className="w-4 h-4 text-blue-500" />;
      case "fertilizer": return <Zap className="w-4 h-4 text-yellow-500" />;
      case "pest-control": return <Bug className="w-4 h-4 text-red-500" />;
      case "weeding": return <Scissors className="w-4 h-4 text-green-500" />;
      case "sowing": return <Sprout className="w-4 h-4 text-green-600" />;
      case "harvesting": return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getWeekData = () => {
    return dailySchedule.filter(item => item.week === currentWeek);
  };

  const getCompletionProgress = () => {
    const totalTasks = dailySchedule.reduce((acc, item) => acc + item.tasks.length, 0);
    const completedCount = completedTasks.length;
    return Math.round((completedCount / totalTasks) * 100);
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            ← {language === 'tamil' ? 'பயிர் வழிகாட்டிக்கு திரும்பு' : 'Back to Crop Guide'}
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {cropName} - {language === 'tamil' ? 'தினசரி விவசாய அட்டவணை' : 'Daily Farming Schedule'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'tamil' ? 
              `முழுமையான ${totalDuration}-நாள் விவசாய வழிகாட்டி` : 
              `Complete ${totalDuration}-day cultivation guide with daily tasks`
            }
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-success">{getCompletionProgress()}%</div>
          <p className="text-sm text-muted-foreground">
            {language === 'tamil' ? 'முடிந்தது' : 'Complete'}
          </p>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: Math.ceil(totalDuration / 7) }, (_, i) => i + 1).map(week => (
          <Button
            key={week}
            variant={currentWeek === week ? "nav" : "outline"}
            size="sm"
            onClick={() => setCurrentWeek(week)}
          >
            {language === 'tamil' ? `வாரம் ${week}` : `Week ${week}`}
          </Button>
        ))}
      </div>

      {/* Current Week Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {language === 'tamil' ? `வாரம் ${currentWeek} பணிகள்` : `Week ${currentWeek} Tasks`}
        </h2>

        {getWeekData().map((dayData) => (
          <Card key={dayData.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {language === 'tamil' ? `நாள் ${dayData.day}` : `Day ${dayData.day}`} - {dayData.stage}
                  </CardTitle>
                  <CardDescription>
                    {language === 'tamil' ? 
                      `வாரம் ${dayData.week} / ${Math.ceil(totalDuration / 7)}` :
                      `Week ${dayData.week} of ${Math.ceil(totalDuration / 7)}`
                    }
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {dayData.tasks.length} {language === 'tamil' ? 'பணிகள்' : 'tasks'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Market Price Info */}
              {dayData.market_price && (
                <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        {language === 'tamil' ? 'சந்தை விலை தகவல்' : 'Market Price Info'}
                      </h4>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">₹{dayData.market_price.current}</span>
                        <span>{getTrendIcon(dayData.market_price.trend)}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">
                          {language === 'tamil' ? 'சிறந்த விற்பனை நேரம்:' : 'Best selling time:'}
                        </span>
                        <span>{dayData.market_price.best_selling_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span className="font-medium">
                          {language === 'tamil' ? 'சிறந்த விற்பனை இடம்:' : 'Best place:'}
                        </span>
                        <span>{dayData.market_price.best_selling_place}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tasks */}
              {dayData.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 ${
                    completedTasks.includes(task.id) 
                      ? 'bg-success/10 border-success/20' 
                      : 'bg-background'
                  }`}
                >
                  <Checkbox
                    checked={completedTasks.includes(task.id)}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      {getTaskIcon(task.type)}
                      <span className={`text-sm font-medium ${
                        completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {language === 'tamil' ? task.taskTamil : task.task}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      
                      {task.weather_dependent && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {language === 'tamil' ? 'வானிலை சார்ந்த' : 'Weather Dependent'}
                        </Badge>
                      )}
                    </div>

                    {/* Detailed Information */}
                    {task.fertilizer_details && (
                      <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-yellow-600">
                          {language === 'tamil' ? 'உர விவரங்கள்:' : 'Fertilizer Details:'}
                        </div>
                        <div><strong>{language === 'tamil' ? 'இரசாயன:' : 'Chemical:'}</strong> {task.fertilizer_details.chemical}</div>
                        <div><strong>{language === 'tamil' ? 'இயற்கை:' : 'Organic:'}</strong> {task.fertilizer_details.organic}</div>
                        <div><strong>{language === 'tamil' ? 'முறை:' : 'Method:'}</strong> {task.fertilizer_details.quantity}</div>
                      </div>
                    )}

                    {task.pest_details && (
                      <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-red-600">
                          {language === 'tamil' ? 'பூச்சி கட்டுப்பாடு விவரங்கள்:' : 'Pest Control Details:'}
                        </div>
                        <div><strong>{language === 'tamil' ? 'இலக்கு:' : 'Target:'}</strong> {task.pest_details.target}</div>
                        <div><strong>{language === 'tamil' ? 'முறை:' : 'Method:'}</strong> {task.pest_details.method}</div>
                        <div><strong>{language === 'tamil' ? 'நேரம்:' : 'Timing:'}</strong> {task.pest_details.timing}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Summary */}
      <Card className="bg-gradient-earth">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">{completedTasks.length}</div>
              <p className="text-sm text-muted-foreground">
                {language === 'tamil' ? 'முடிந்த பணிகள்' : 'Tasks Completed'}
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {dailySchedule.reduce((acc, item) => acc + item.tasks.length, 0) - completedTasks.length}
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'tamil' ? 'மீதமுள்ள பணிகள்' : 'Tasks Remaining'}
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentWeek}</div>
              <p className="text-sm text-muted-foreground">
                {language === 'tamil' ? 'தற்போதைய வாரம்' : 'Current Week'}
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{Math.ceil(totalDuration / 7)}</div>
              <p className="text-sm text-muted-foreground">
                {language === 'tamil' ? 'மொத்த வாரங்கள்' : 'Total Weeks'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};