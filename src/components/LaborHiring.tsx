import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { 
  UserCog, 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  IndianRupee,
  Phone,
  Award,
  Calendar,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LaborProfile {
  id: string;
  name: string;
  phone: string;
  location: string;
  state: string;
  district: string;
  skills: string[];
  experience_years: number;
  daily_wage_min: number;
  daily_wage_max: number;
  availability: string;
  rating: number;
  total_reviews: number;
  verified: boolean;
  description?: string;
}

const skillTranslations = {
  'harvesting': 'Harvesting',
  'sowing': 'Sowing', 
  'irrigation': 'Irrigation',
  'pest_control': 'Pest Control',
  'fertilizer_application': 'Fertilizer Application',
  'land_preparation': 'Land Preparation',
  'weeding': 'Weeding',
  'transplanting': 'Transplanting',
  'pruning': 'Pruning',
  'general_labor': 'General Labor'
};

export const LaborHiring = () => {
  const [laborers, setLaborers] = useState<LaborProfile[]>([]);
  const [filteredLaborers, setFilteredLaborers] = useState<LaborProfile[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [maxWage, setMaxWage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLaborers();
  }, []);

  useEffect(() => {
    filterLaborers();
  }, [laborers, searchLocation, selectedSkill, maxWage]);

  const fetchLaborers = async () => {
    try {
      const { data, error } = await supabase
        .from('labor_profiles')
        .select('*')
        .eq('availability', 'available')
        .order('rating', { ascending: false });

      if (error) throw error;
      setLaborers(data || []);
    } catch (error) {
      console.error('Error fetching laborers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLaborers = () => {
    let filtered = [...laborers];

    if (searchLocation) {
      filtered = filtered.filter(laborer => 
        laborer.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        laborer.district.toLowerCase().includes(searchLocation.toLowerCase()) ||
        laborer.state.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(laborer => 
        laborer.skills.includes(selectedSkill)
      );
    }

    if (maxWage) {
      const maxWageNum = parseInt(maxWage);
      filtered = filtered.filter(laborer => 
        laborer.daily_wage_min <= maxWageNum
      );
    }

    setFilteredLaborers(filtered);
  };

  const getSkillColor = (skill: string) => {
    const colors: { [key: string]: string } = {
      'harvesting': 'bg-success text-success-foreground',
      'sowing': 'bg-primary text-primary-foreground',
      'irrigation': 'bg-blue-500 text-white',
      'pest_control': 'bg-destructive text-destructive-foreground',
      'fertilizer_application': 'bg-warning text-warning-foreground',
      'land_preparation': 'bg-accent text-accent-foreground',
      'weeding': 'bg-green-600 text-white',
      'transplanting': 'bg-purple-500 text-white',
      'pruning': 'bg-orange-500 text-white',
      'general_labor': 'bg-muted text-muted-foreground'
    };
    return colors[skill] || 'bg-muted text-muted-foreground';
  };

  const handleBookLabor = (laborId: string) => {
    // TODO: Implement booking functionality
    console.log('Booking labor:', laborId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <UserCog className="w-8 h-8 text-primary" />
          Agricultural Labor Hiring
        </h2>
        <p className="text-muted-foreground">
          Find skilled agricultural workers for your farm operations
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Labor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                placeholder="Enter location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Required Skill</label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Skills</SelectItem>
                  {Object.entries(skillTranslations).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Max Daily Wage</label>
              <Input
                type="number"
                placeholder="₹500"
                value={maxWage}
                onChange={(e) => setMaxWage(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchLocation("");
                  setSelectedSkill("");
                  setMaxWage("");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Labor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLaborers.map((laborer) => (
          <Card key={laborer.id} className="hover:shadow-crop transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {laborer.name}
                    {laborer.verified && (
                      <Award className="w-4 h-4 text-success" />
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {laborer.location}, {laborer.district}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{laborer.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({laborer.total_reviews})
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Experience & Contact */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{laborer.experience_years} years exp.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{laborer.phone}</span>
                </div>
              </div>

              {/* Wage Range */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Daily Wage:</span>
                <div className="flex items-center text-success font-semibold">
                  <IndianRupee className="w-4 h-4" />
                  <span>{laborer.daily_wage_min}-{laborer.daily_wage_max}</span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <span className="text-sm font-medium text-foreground">Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {laborer.skills.slice(0, 3).map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className={`text-xs ${getSkillColor(skill)}`}
                    >
                      {skillTranslations[skill as keyof typeof skillTranslations] || skill}
                    </Badge>
                  ))}
                  {laborer.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{laborer.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              {laborer.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {laborer.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="crop" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleBookLabor(laborer.id)}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Book Now
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLaborers.length === 0 && (
        <div className="text-center py-12">
          <UserCog className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No laborers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later for more options.
          </p>
        </div>
      )}
    </div>
  );
};