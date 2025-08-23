import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { 
  Tractor, 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  IndianRupee,
  Phone,
  Award,
  Calendar,
  Settings,
  Fuel,
  Gauge
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MachineryProfile {
  id: string;
  owner_name: string;
  owner_phone: string;
  machinery_type: string;
  brand: string;
  model: string;
  year_of_purchase: number;
  location: string;
  state: string;
  district: string;
  hourly_rate: number;
  daily_rate: number;
  availability: string;
  rating: number;
  total_reviews: number;
  description?: string;
  fuel_type?: string;
  horsepower?: number;
  working_width?: number;
  verified: boolean;
}

const machineryTypes = {
  'tractor': 'Tractor',
  'harvester': 'Harvester',
  'tiller': 'Tiller',
  'irrigation_pump': 'Irrigation Pump',
  'sprayer': 'Sprayer',
  'seed_drill': 'Seed Drill',
  'thresher': 'Thresher',
  'cultivator': 'Cultivator',
  'plough': 'Plough',
  'rotavator': 'Rotavator'
};

export const MachineryRental = () => {
  const [machinery, setMachinery] = useState<MachineryProfile[]>([]);
  const [filteredMachinery, setFilteredMachinery] = useState<MachineryProfile[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [maxRate, setMaxRate] = useState("");
  const [rentalType, setRentalType] = useState<"hourly" | "daily">("daily");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMachinery();
  }, []);

  useEffect(() => {
    filterMachinery();
  }, [machinery, searchLocation, selectedType, maxRate, rentalType]);

  const fetchMachinery = async () => {
    try {
      const { data, error } = await supabase
        .from('machinery_profiles')
        .select('*')
        .eq('availability', 'available')
        .order('rating', { ascending: false });

      if (error) throw error;
      setMachinery(data || []);
    } catch (error) {
      console.error('Error fetching machinery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMachinery = () => {
    let filtered = [...machinery];

    if (searchLocation) {
      filtered = filtered.filter(machine => 
        machine.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        machine.district.toLowerCase().includes(searchLocation.toLowerCase()) ||
        machine.state.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(machine => 
        machine.machinery_type === selectedType
      );
    }

    if (maxRate) {
      const maxRateNum = parseInt(maxRate);
      filtered = filtered.filter(machine => {
        const rate = rentalType === 'hourly' ? machine.hourly_rate : machine.daily_rate;
        return rate <= maxRateNum;
      });
    }

    setFilteredMachinery(filtered);
  };

  const getMachineryIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'tractor': '🚜',
      'harvester': '🌾',
      'tiller': '🔧',
      'irrigation_pump': '💧',
      'sprayer': '💨',
      'seed_drill': '🌱',
      'thresher': '⚙️',
      'cultivator': '🔧',
      'plough': '🪓',
      'rotavator': '⚙️'
    };
    return icons[type] || '🚜';
  };

  const handleBookMachinery = (machineryId: string) => {
    // TODO: Implement booking functionality
    console.log('Booking machinery:', machineryId);
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
          <Tractor className="w-8 h-8 text-primary" />
          Agricultural Machinery Rental
        </h2>
        <p className="text-muted-foreground">
          Rent farm machinery for efficient agricultural operations
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Machinery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <label className="text-sm font-medium text-foreground">Machinery Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(machineryTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Rental Type</label>
              <Select value={rentalType} onValueChange={(value: "hourly" | "daily") => setRentalType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Max Rate</label>
              <Input
                type="number"
                placeholder={rentalType === 'hourly' ? '₹200/hr' : '₹2000/day'}
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchLocation("");
                  setSelectedType("all");
                  setMaxRate("");
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

      {/* Machinery Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMachinery.map((machine) => (
          <Card key={machine.id} className="hover:shadow-crop transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{getMachineryIcon(machine.machinery_type)}</span>
                    {machine.brand} {machine.model}
                    {machine.verified && (
                      <Award className="w-4 h-4 text-success" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    {machineryTypes[machine.machinery_type as keyof typeof machineryTypes]}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {machine.location}, {machine.district}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{machine.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({machine.total_reviews})
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Owner & Contact */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Owner: </span>
                  <span className="font-medium">{machine.owner_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{machine.owner_phone}</span>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{machine.year_of_purchase}</span>
                </div>
                {machine.horsepower && (
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-muted-foreground" />
                    <span>{machine.horsepower} HP</span>
                  </div>
                )}
                {machine.fuel_type && (
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-muted-foreground" />
                    <span>{machine.fuel_type}</span>
                  </div>
                )}
                {machine.working_width && (
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3 text-muted-foreground" />
                    <span>{machine.working_width}m</span>
                  </div>
                )}
              </div>

              {/* Rental Rates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hourly Rate:</span>
                  <div className="flex items-center text-success font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    <span>{machine.hourly_rate}/hr</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily Rate:</span>
                  <div className="flex items-center text-success font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    <span>{machine.daily_rate}/day</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {machine.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {machine.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="crop" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleBookMachinery(machine.id)}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Book Now
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMachinery.length === 0 && (
        <div className="text-center py-12">
          <Tractor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No machinery found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later for more options.
          </p>
        </div>
      )}
    </div>
  );
};