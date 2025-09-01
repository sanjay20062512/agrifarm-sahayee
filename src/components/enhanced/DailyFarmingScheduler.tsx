import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Droplets, 
  Sprout,
  Bug,
  Scissors,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScheduleTask {
  id: string;
  time: string;
  type: 'irrigation' | 'fertilization' | 'pest_control' | 'weeding' | 'harvesting' | 'sowing' | 'observation' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  weather_dependent: boolean;
  completed?: boolean;
}

interface DaySchedule {
  date: string;
  day_number: number;
  growth_stage: string;
  weather_condition: string;
  tasks: ScheduleTask[];
  notes: string;
}

interface CropSchedule {
  id?: string;
  farmer_name: string;
  crop_name: string;
  start_date: string;
  location: string;
  state: string;
  district: string;
  soil_type: string;
  schedule_data: DaySchedule[];
}

const taskTypes = {
  'irrigation': { label: 'Irrigation', icon: Droplets, color: 'bg-blue-500 text-white' },
  'fertilization': { label: 'Fertilization', icon: Sprout, color: 'bg-green-500 text-white' },
  'pest_control': { label: 'Pest Control', icon: Bug, color: 'bg-red-500 text-white' },
  'weeding': { label: 'Weeding', icon: Scissors, color: 'bg-orange-500 text-white' },
  'harvesting': { label: 'Harvesting', icon: Sunrise, color: 'bg-yellow-500 text-white' },
  'sowing': { label: 'Sowing', icon: Sun, color: 'bg-purple-500 text-white' },
  'observation': { label: 'Observation', icon: Sunset, color: 'bg-indigo-500 text-white' },
  'other': { label: 'Other', icon: Moon, color: 'bg-gray-500 text-white' }
};

const soilTypes = ['Clayey', 'Sandy', 'Loamy', 'Silty', 'Black Cotton', 'Red Soil', 'Alluvial'];

const cropTemplates = {
  'rice': {
    total_days: 120,
    stages: [
      { name: 'Land Preparation', start: 0, end: 7 },
      { name: 'Nursery Preparation', start: 8, end: 21 },
      { name: 'Transplanting', start: 22, end: 28 },
      { name: 'Vegetative Growth', start: 29, end: 65 },
      { name: 'Reproductive Phase', start: 66, end: 95 },
      { name: 'Maturity & Harvest', start: 96, end: 120 }
    ],
    tasks: [
      { day: 1, type: 'other', title: 'Field preparation', description: 'Plough the field and level it' },
      { day: 3, type: 'irrigation', title: 'Flooding', description: 'Flood the field with 5cm water' },
      { day: 8, type: 'sowing', title: 'Nursery sowing', description: 'Sow seeds in nursery beds' },
      { day: 10, type: 'irrigation', title: 'Nursery watering', description: 'Light watering for germination' },
      { day: 22, type: 'other', title: 'Transplanting', description: 'Transplant 25-day old seedlings' },
      { day: 25, type: 'irrigation', title: 'Post-transplant irrigation', description: 'Maintain 2-3cm water level' },
      { day: 35, type: 'fertilization', title: 'First top dressing', description: 'Apply urea 25% N' },
      { day: 40, type: 'weeding', title: 'First weeding', description: 'Manual weeding or herbicide' },
      { day: 55, type: 'fertilization', title: 'Second top dressing', description: 'Apply remaining 25% N' },
      { day: 65, type: 'pest_control', title: 'BPH monitoring', description: 'Check for brown plant hopper' },
      { day: 70, type: 'observation', title: 'Flowering check', description: 'Monitor panicle emergence' },
      { day: 85, type: 'irrigation', title: 'Grain filling irrigation', description: 'Maintain moisture for grain filling' },
      { day: 100, type: 'observation', title: 'Harvest readiness', description: 'Check grain maturity (80-85%)' },
      { day: 115, type: 'harvesting', title: 'Harvesting', description: 'Harvest when grains are golden' }
    ]
  },
  'wheat': {
    total_days: 140,
    stages: [
      { name: 'Land Preparation', start: 0, end: 10 },
      { name: 'Sowing', start: 11, end: 20 },
      { name: 'Germination', start: 21, end: 35 },
      { name: 'Tillering', start: 36, end: 65 },
      { name: 'Jointing & Booting', start: 66, end: 95 },
      { name: 'Flowering & Grain Filling', start: 96, end: 125 },
      { name: 'Maturity & Harvest', start: 126, end: 140 }
    ],
    tasks: [
      { day: 1, type: 'other', title: 'Deep ploughing', description: 'Deep plough to 20-25cm depth' },
      { day: 5, type: 'fertilization', title: 'Basal fertilizer', description: 'Apply FYM and basal NPK' },
      { day: 8, type: 'irrigation', title: 'Pre-sowing irrigation', description: 'Irrigate 3-4 days before sowing' },
      { day: 12, type: 'sowing', title: 'Wheat sowing', description: 'Sow with seed drill, 100-125 kg/ha' },
      { day: 21, type: 'observation', title: 'Germination check', description: 'Check for uniform germination' },
      { day: 25, type: 'irrigation', title: 'Crown root irrigation', description: 'First irrigation at crown root stage' },
      { day: 35, type: 'weeding', title: 'First weeding', description: 'Manual weeding or herbicide application' },
      { day: 45, type: 'fertilization', title: 'First top dressing', description: 'Apply 1/3 of nitrogen' },
      { day: 50, type: 'irrigation', title: 'Tillering irrigation', description: 'Irrigation during active tillering' },
      { day: 65, type: 'fertilization', title: 'Second top dressing', description: 'Apply remaining nitrogen' },
      { day: 70, type: 'irrigation', title: 'Jointing irrigation', description: 'Critical irrigation at jointing stage' },
      { day: 85, type: 'pest_control', title: 'Aphid control', description: 'Monitor and control aphids' },
      { day: 95, type: 'irrigation', title: 'Booting irrigation', description: 'Irrigation at boot stage' },
      { day: 105, type: 'irrigation', title: 'Flowering irrigation', description: 'Irrigation during flowering' },
      { day: 115, type: 'irrigation', title: 'Grain filling irrigation', description: 'Irrigation during grain filling' },
      { day: 135, type: 'harvesting', title: 'Harvesting', description: 'Harvest when grains are hard and golden' }
    ]
  },
  'tomato': {
    total_days: 90,
    stages: [
      { name: 'Nursery', start: 0, end: 25 },
      { name: 'Transplanting', start: 26, end: 30 },
      { name: 'Vegetative Growth', start: 31, end: 45 },
      { name: 'Flowering', start: 46, end: 65 },
      { name: 'Fruit Development', start: 66, end: 80 },
      { name: 'Harvest', start: 81, end: 90 }
    ],
    tasks: [
      { day: 1, type: 'sowing', title: 'Nursery sowing', description: 'Sow seeds in pro-trays or nursery beds' },
      { day: 3, type: 'irrigation', title: 'Nursery watering', description: 'Light misting for germination' },
      { day: 10, type: 'fertilization', title: 'Nursery feeding', description: 'Liquid fertilizer for seedlings' },
      { day: 26, type: 'other', title: 'Transplanting', description: 'Transplant 25-day old seedlings' },
      { day: 28, type: 'irrigation', title: 'Post-transplant water', description: 'Light watering to establish' },
      { day: 35, type: 'fertilization', title: 'First fertilization', description: 'Apply NPK complex fertilizer' },
      { day: 40, type: 'other', title: 'Staking', description: 'Provide support with stakes' },
      { day: 45, type: 'weeding', title: 'Weeding & mulching', description: 'Remove weeds and apply mulch' },
      { day: 50, type: 'fertilization', title: 'Flowering fertilizer', description: 'Apply potash-rich fertilizer' },
      { day: 55, type: 'pest_control', title: 'Pest monitoring', description: 'Check for whitefly and aphids' },
      { day: 60, type: 'other', title: 'Pruning', description: 'Remove suckers and lower leaves' },
      { day: 70, type: 'irrigation', title: 'Fruit development water', description: 'Maintain consistent moisture' },
      { day: 80, type: 'observation', title: 'Harvest readiness', description: 'Check for fruit color change' },
      { day: 85, type: 'harvesting', title: 'First harvest', description: 'Harvest mature fruits' }
    ]
  }
};

export const DailyFarmingScheduler = ({ 
  cropName, 
  farmerDetails, 
  onScheduleCreated 
}: { 
  cropName: string;
  farmerDetails: any;
  onScheduleCreated?: (schedule: CropSchedule) => void;
}) => {
  const [schedule, setSchedule] = useState<CropSchedule>({
    farmer_name: farmerDetails?.name || "",
    crop_name: cropName,
    start_date: new Date().toISOString().split('T')[0],
    location: farmerDetails?.location || "",
    state: farmerDetails?.state || "",
    district: farmerDetails?.district || "",
    soil_type: farmerDetails?.soil_type || "Loamy",
    schedule_data: []
  });
  
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSchedules, setSavedSchedules] = useState<CropSchedule[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedSchedules();
  }, []);

  const fetchSavedSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const schedules = data?.map(item => ({
        ...item,
        schedule_data: Array.isArray(item.schedule_data) ? item.schedule_data as unknown as DaySchedule[] : []
      })) || [];
      
      setSavedSchedules(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const generateAISchedule = async () => {
    setIsGenerating(true);
    
    try {
      const cropKey = cropName.toLowerCase() as keyof typeof cropTemplates;
      const template = cropTemplates[cropKey];
      
      if (!template) {
        toast({
          title: "Crop Not Supported",
          description: "AI schedule generation for this crop is coming soon. Please create a custom schedule.",
          variant: "destructive"
        });
        return;
      }

      const scheduleData: DaySchedule[] = [];
      const startDate = new Date(schedule.start_date);

      // Generate schedule for each day
      for (let day = 1; day <= template.total_days; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day - 1);
        
        // Determine growth stage
        const stage = template.stages.find(s => day >= s.start && day <= s.end);
        
        // Get tasks for this day
        const dayTasks = template.tasks
          .filter(task => task.day === day)
          .map(task => ({
            id: `${day}-${task.type}-${Date.now()}`,
            time: getOptimalTime(task.type),
            type: task.type as ScheduleTask['type'],
            title: task.title,
            description: task.description,
            priority: getPriority(task.type) as ScheduleTask['priority'],
            weather_dependent: isWeatherDependent(task.type),
            completed: false
          }));

        // Add daily observation task
        if (day % 7 === 0) {
          dayTasks.push({
            id: `${day}-observation-${Date.now()}`,
            time: '08:00',
            type: 'observation',
            title: 'Weekly crop monitoring',
            description: `Monitor crop health, check for pests/diseases, record growth progress`,
            priority: 'medium',
            weather_dependent: false,
            completed: false
          });
        }

        // Add weather-based irrigation schedule
        if (day % 3 === 0 && !dayTasks.some(t => t.type === 'irrigation')) {
          dayTasks.push({
            id: `${day}-irrigation-${Date.now()}`,
            time: '06:00',
            type: 'irrigation',
            title: 'Regular irrigation',
            description: `Water the crop based on soil moisture and weather conditions`,
            priority: 'high',
            weather_dependent: true,
            completed: false
          });
        }

        scheduleData.push({
          date: currentDate.toISOString().split('T')[0],
          day_number: day,
          growth_stage: stage?.name || 'Growth Phase',
          weather_condition: 'Partly Cloudy', // In real app, this would come from weather API
          tasks: dayTasks,
          notes: `Day ${day} of ${template.total_days} - ${stage?.name || 'Growth Phase'}`
        });
      }

      setSchedule(prev => ({ ...prev, schedule_data: scheduleData }));
      
      toast({
        title: "Schedule Generated",
        description: `AI has generated a comprehensive ${template.total_days}-day schedule for ${cropName} cultivation.`,
      });
      
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getOptimalTime = (taskType: string): string => {
    const timeMap: { [key: string]: string } = {
      'irrigation': '06:00',
      'fertilization': '07:00',
      'pest_control': '17:00',
      'weeding': '08:00',
      'harvesting': '06:00',
      'sowing': '07:00',
      'observation': '08:00',
      'other': '09:00'
    };
    return timeMap[taskType] || '08:00';
  };

  const getPriority = (taskType: string): string => {
    const priorityMap: { [key: string]: string } = {
      'irrigation': 'high',
      'fertilization': 'high',
      'pest_control': 'high',
      'weeding': 'medium',
      'harvesting': 'high',
      'sowing': 'high',
      'observation': 'medium',
      'other': 'medium'
    };
    return priorityMap[taskType] || 'medium';
  };

  const isWeatherDependent = (taskType: string): boolean => {
    return ['irrigation', 'pest_control', 'harvesting', 'sowing'].includes(taskType);
  };

  const saveSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_schedules')
        .insert({
          farmer_name: schedule.farmer_name,
          crop_name: schedule.crop_name,
          start_date: schedule.start_date,
          location: schedule.location,
          state: schedule.state,
          district: schedule.district,
          soil_type: schedule.soil_type,
          schedule_data: schedule.schedule_data as any,
          user_id: null // For demo, using null. In real app, would use auth.uid()
        });

      if (error) throw error;

      toast({
        title: "Schedule Saved",
        description: "Your farming schedule has been saved successfully.",
      });

      fetchSavedSchedules();
      onScheduleCreated?.(schedule);
      
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save schedule. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleTaskCompletion = (dayIndex: number, taskId: string) => {
    setSchedule(prev => ({
      ...prev,
      schedule_data: prev.schedule_data.map((day, idx) => {
        if (idx === dayIndex) {
          return {
            ...day,
            tasks: day.tasks.map(task => 
              task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
            )
          };
        }
        return day;
      })
    }));
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return Sunrise;
    if (hour >= 12 && hour < 17) return Sun;
    if (hour >= 17 && hour < 20) return Sunset;
    return Moon;
  };

  const getCurrentWeek = () => {
    const startIdx = Math.max(0, currentDay - 4);
    const endIdx = Math.min(schedule.schedule_data.length, startIdx + 7);
    return schedule.schedule_data.slice(startIdx, endIdx);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Calendar className="w-8 h-8 text-primary" />
          AI Daily Farming Scheduler
        </h2>
        <p className="text-muted-foreground">
          Comprehensive daily schedule for {cropName} cultivation with real-time weather integration
        </p>
      </div>

      {/* Schedule Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Configuration</CardTitle>
          <CardDescription>Set up your crop schedule parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Farmer Name</label>
              <Input
                value={schedule.farmer_name}
                onChange={(e) => setSchedule(prev => ({ ...prev, farmer_name: e.target.value }))}
                placeholder="Enter farmer name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={schedule.start_date}
                onChange={(e) => setSchedule(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Soil Type</label>
              <Select 
                value={schedule.soil_type} 
                onValueChange={(value) => setSchedule(prev => ({ ...prev, soil_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map(soil => (
                    <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={generateAISchedule} 
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? "Generating AI Schedule..." : "Generate AI Schedule"}
            </Button>
            {schedule.schedule_data.length > 0 && (
              <Button onClick={saveSchedule} variant="outline">
                Save Schedule
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly View */}
      {schedule.schedule_data.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Weekly Schedule View</CardTitle>
                <CardDescription>
                  Day {currentDay} of {schedule.schedule_data.length} - {schedule.schedule_data[currentDay - 1]?.growth_stage}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDay(Math.max(1, currentDay - 7))}
                  disabled={currentDay <= 7}
                >
                  Previous Week
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDay(Math.min(schedule.schedule_data.length, currentDay + 7))}
                  disabled={currentDay > schedule.schedule_data.length - 7}
                >
                  Next Week
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getCurrentWeek().map((day, dayIndex) => {
                const actualDayIndex = schedule.schedule_data.findIndex(d => d.date === day.date);
                return (
                  <Card 
                    key={day.date} 
                    className={`hover:shadow-md transition-all duration-300 ${
                      day.day_number === currentDay ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Day {day.day_number}</CardTitle>
                          <CardDescription className="text-xs">
                            {new Date(day.date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {day.growth_stage}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-2">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sun className="w-3 h-3" />
                        {day.weather_condition}
                      </div>
                      
                      <div className="space-y-1">
                        {day.tasks.slice(0, 3).map((task) => {
                          const TaskIcon = taskTypes[task.type].icon;
                          const TimeIcon = getTimeIcon(task.time);
                          
                          return (
                            <div 
                              key={task.id}
                              className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                                task.completed ? 'bg-green-50 line-through opacity-60' : 'bg-muted/30'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <TimeIcon className="w-3 h-3 text-muted-foreground" />
                                <span className="font-mono text-xs">{task.time}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 flex-1">
                                <TaskIcon className="w-3 h-3" />
                                <span className="truncate">{task.title}</span>
                              </div>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleTaskCompletion(actualDayIndex, task.id)}
                              >
                                {task.completed ? (
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                ) : (
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          );
                        })}
                        
                        {day.tasks.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center py-1">
                            +{day.tasks.length - 3} more tasks
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => setSelectedDate(day.date)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Schedules */}
      {savedSchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Saved Schedules</CardTitle>
            <CardDescription>Previously created farming schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSchedules.map((savedSchedule) => (
                <Card key={savedSchedule.id} className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{savedSchedule.crop_name}</CardTitle>
                    <CardDescription>
                      {savedSchedule.farmer_name} • {savedSchedule.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Start Date:</span> {new Date(savedSchedule.start_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Duration:</span> {savedSchedule.schedule_data.length} days
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Soil Type:</span> {savedSchedule.soil_type}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Load Schedule
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Day View Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Day Details - {new Date(selectedDate).toLocaleDateString()}
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedule.schedule_data
                .filter(day => day.date === selectedDate)
                .map(day => (
                  <div key={day.date} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Growth Stage:</span>
                        <p className="font-medium">{day.growth_stage}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Weather:</span>
                        <p className="font-medium">{day.weather_condition}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Today's Tasks</h4>
                      <div className="space-y-2">
                        {day.tasks.map((task) => {
                          const TaskIcon = taskTypes[task.type].icon;
                          const actualDayIndex = schedule.schedule_data.findIndex(d => d.date === day.date);
                          
                          return (
                            <div 
                              key={task.id}
                              className={`p-3 border rounded-lg ${
                                task.completed ? 'bg-green-50 border-green-200' : 'bg-card'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <TaskIcon className="w-4 h-4" />
                                  <span className="font-medium">{task.title}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${taskTypes[task.type].color}`}
                                  >
                                    {taskTypes[task.type].label}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">{task.time}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => toggleTaskCompletion(actualDayIndex, task.id)}
                                  >
                                    {task.completed ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-orange-500" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              {task.weather_dependent && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    Weather Dependent
                                  </Badge>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <Textarea
                        value={day.notes}
                        onChange={(e) => {
                          const dayIndex = schedule.schedule_data.findIndex(d => d.date === day.date);
                          setSchedule(prev => ({
                            ...prev,
                            schedule_data: prev.schedule_data.map((d, idx) => 
                              idx === dayIndex ? { ...d, notes: e.target.value } : d
                            )
                          }));
                        }}
                        placeholder="Add notes for this day..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};