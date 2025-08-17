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
  AlertTriangle
} from "lucide-react";

interface DailyTask {
  id: string;
  day: number;
  week: number;
  stage: string;
  tasks: {
    id: string;
    task: string;
    type: "irrigation" | "fertilizer" | "pest-control" | "weeding" | "sowing" | "harvesting" | "general";
    priority: "high" | "medium" | "low";
    completed: boolean;
    weather_dependent: boolean;
  }[];
}

interface DailyFarmingScheduleProps {
  cropName: string;
  totalDuration: number;
  onBack: () => void;
}

export const DailyFarmingSchedule = ({ cropName, totalDuration, onBack }: DailyFarmingScheduleProps) => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Mock daily schedule data for a crop (e.g., Tomato - 90 days)
  const dailySchedule: DailyTask[] = [
    {
      id: "week1",
      day: 1,
      week: 1,
      stage: "Land Preparation",
      tasks: [
        { id: "1-1", task: "Deep plowing of field to 20-25cm depth", type: "general", priority: "high", completed: false, weather_dependent: true },
        { id: "1-2", task: "Apply FYM 10 tonnes/hectare", type: "fertilizer", priority: "high", completed: false, weather_dependent: false },
        { id: "1-3", task: "Level the field and create furrows", type: "general", priority: "medium", completed: false, weather_dependent: true }
      ]
    },
    {
      id: "week1-2",
      day: 3,
      week: 1,
      stage: "Seedbed Preparation",
      tasks: [
        { id: "1-4", task: "Prepare raised seedbeds (1m width)", type: "sowing", priority: "high", completed: false, weather_dependent: false },
        { id: "1-5", task: "Treat seeds with fungicide (Thiram 2g/kg)", type: "pest-control", priority: "high", completed: false, weather_dependent: false },
        { id: "1-6", task: "Sow seeds in nursery at 1cm depth", type: "sowing", priority: "high", completed: false, weather_dependent: false }
      ]
    },
    {
      id: "week2",
      day: 7,
      week: 2,
      stage: "Nursery Management",
      tasks: [
        { id: "2-1", task: "Light watering twice daily (morning & evening)", type: "irrigation", priority: "high", completed: false, weather_dependent: true },
        { id: "2-2", task: "Remove weeds from nursery beds", type: "weeding", priority: "medium", completed: false, weather_dependent: false },
        { id: "2-3", task: "Apply shade net if temperature >30°C", type: "general", priority: "medium", completed: false, weather_dependent: true }
      ]
    },
    {
      id: "week3",
      day: 14,
      week: 3,
      stage: "Seedling Care",
      tasks: [
        { id: "3-1", task: "Monitor for damping off disease", type: "pest-control", priority: "high", completed: false, weather_dependent: false },
        { id: "3-2", task: "Thin out weak seedlings", type: "general", priority: "medium", completed: false, weather_dependent: false },
        { id: "3-3", task: "Apply liquid fertilizer (NPK 19:19:19) 2g/L", type: "fertilizer", priority: "medium", completed: false, weather_dependent: false }
      ]
    },
    {
      id: "week4",
      day: 21,
      week: 4,
      stage: "Pre-Transplant",
      tasks: [
        { id: "4-1", task: "Harden seedlings by reducing water", type: "irrigation", priority: "high", completed: false, weather_dependent: false },
        { id: "4-2", task: "Prepare main field with drip irrigation", type: "irrigation", priority: "high", completed: false, weather_dependent: false },
        { id: "4-3", task: "Apply basal fertilizer: DAP 250kg + MOP 100kg/ha", type: "fertilizer", priority: "high", completed: false, weather_dependent: false }
      ]
    },
    {
      id: "week5",
      day: 28,
      week: 5,
      stage: "Transplanting",
      tasks: [
        { id: "5-1", task: "Transplant 25-30 day old seedlings", type: "sowing", priority: "high", completed: false, weather_dependent: true },
        { id: "5-2", task: "Maintain 60cm x 45cm spacing", type: "sowing", priority: "high", completed: false, weather_dependent: false },
        { id: "5-3", task: "Water immediately after transplanting", type: "irrigation", priority: "high", completed: false, weather_dependent: false }
      ]
    },
    {
      id: "week6",
      day: 35,
      week: 6,
      stage: "Establishment",
      tasks: [
        { id: "6-1", task: "Daily irrigation for first week", type: "irrigation", priority: "high", completed: false, weather_dependent: true },
        { id: "6-2", task: "Replace damaged/dead plants", type: "general", priority: "medium", completed: false, weather_dependent: false },
        { id: "6-3", task: "Apply mulch around plants", type: "general", priority: "medium", completed: false, weather_dependent: false }
      ]
    },
    {
      id: "week8",
      day: 49,
      week: 8,
      stage: "Vegetative Growth",
      tasks: [
        { id: "8-1", task: "First top dressing: Urea 100kg/ha", type: "fertilizer", priority: "high", completed: false, weather_dependent: false },
        { id: "8-2", task: "Install support stakes for plants", type: "general", priority: "high", completed: false, weather_dependent: false },
        { id: "8-3", task: "Monitor for early blight & aphids", type: "pest-control", priority: "high", completed: false, weather_dependent: false }
      ]
    },
    {
      id: "week10",
      day: 63,
      week: 10,
      stage: "Flowering",
      tasks: [
        { id: "10-1", task: "Increase irrigation frequency", type: "irrigation", priority: "high", completed: false, weather_dependent: true },
        { id: "10-2", task: "Apply potassium-rich fertilizer", type: "fertilizer", priority: "high", completed: false, weather_dependent: false },
        { id: "10-3", task: "Remove suckers from leaf axils", type: "general", priority: "medium", completed: false, weather_dependent: false }
      ]
    },
    {
      id: "week12",
      day: 77,
      week: 12,
      stage: "Fruit Development",
      tasks: [
        { id: "12-1", task: "Monitor for fruit worms", type: "pest-control", priority: "high", completed: false, weather_dependent: false },
        { id: "12-2", task: "Apply calcium spray to prevent blossom end rot", type: "fertilizer", priority: "medium", completed: false, weather_dependent: false },
        { id: "12-3", task: "Maintain consistent soil moisture", type: "irrigation", priority: "high", completed: false, weather_dependent: true }
      ]
    },
    {
      id: "week13",
      day: 84,
      week: 13,
      stage: "Pre-Harvest",
      tasks: [
        { id: "13-1", task: "Stop nitrogen fertilization", type: "fertilizer", priority: "high", completed: false, weather_dependent: false },
        { id: "13-2", task: "Prepare harvest containers", type: "harvesting", priority: "medium", completed: false, weather_dependent: false },
        { id: "13-3", task: "Test fruit firmness and color", type: "harvesting", priority: "medium", completed: false, weather_dependent: false }
      ]
    },
    {
      id: "week14",
      day: 90,
      week: 14,
      stage: "Harvesting",
      tasks: [
        { id: "14-1", task: "Harvest ripe fruits every 2-3 days", type: "harvesting", priority: "high", completed: false, weather_dependent: false },
        { id: "14-2", task: "Sort and grade harvested fruits", type: "harvesting", priority: "high", completed: false, weather_dependent: false },
        { id: "14-3", task: "Store in cool, ventilated area", type: "harvesting", priority: "high", completed: false, weather_dependent: false }
      ]
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            ← Back to Crop Guide
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {cropName} - Daily Farming Schedule
          </h1>
          <p className="text-muted-foreground">
            Complete {totalDuration}-day cultivation guide with daily tasks
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-success">{getCompletionProgress()}%</div>
          <p className="text-sm text-muted-foreground">Complete</p>
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
            Week {week}
          </Button>
        ))}
      </div>

      {/* Current Week Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Week {currentWeek} Tasks
        </h2>

        {getWeekData().map((dayData) => (
          <Card key={dayData.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Day {dayData.day} - {dayData.stage}</CardTitle>
                  <CardDescription>
                    Week {dayData.week} of {Math.ceil(totalDuration / 7)}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {dayData.tasks.length} tasks
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dayData.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${
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
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTaskIcon(task.type)}
                      <span className={`text-sm font-medium ${
                        completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {task.task}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      
                      {task.weather_dependent && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Weather Dependent
                        </Badge>
                      )}
                    </div>
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
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {dailySchedule.reduce((acc, item) => acc + item.tasks.length, 0) - completedTasks.length}
              </div>
              <p className="text-sm text-muted-foreground">Tasks Remaining</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentWeek}</div>
              <p className="text-sm text-muted-foreground">Current Week</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{Math.ceil(totalDuration / 7)}</div>
              <p className="text-sm text-muted-foreground">Total Weeks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};