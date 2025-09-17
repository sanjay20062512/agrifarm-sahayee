import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Gauge,
  Plus,
  Wrench,
  ShoppingCart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/LanguageContext";
import { Trash2 } from "lucide-react";

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

interface MachineryListing {
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
  availability: boolean;
  description?: string;
  fuel_type?: string;
  horsepower?: number;
  working_width?: number;
  verified: boolean;
}

interface MachineryRequirement {
  id: string;
  farmer_name: string;
  farmer_phone: string;
  required_machinery_type: string;
  preferred_brand?: string;
  location: string;
  state: string;
  district: string;
  required_date: string;
  duration_hours?: number;
  duration_days?: number;
  max_hourly_rate?: number;
  max_daily_rate?: number;
  specific_requirements?: string;
  urgent: boolean;
  status: string;
  created_at: string;
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

export const EnhancedMachineryRental = () => {
  const [mode, setMode] = useState<"require" | "rental">("require");
  const [machinery, setMachinery] = useState<MachineryProfile[]>([]);
  const [machineryListings, setMachineryListings] = useState<MachineryListing[]>([]);
  const [machineryRequirements, setMachineryRequirements] = useState<MachineryRequirement[]>([]);
  const [filteredMachinery, setFilteredMachinery] = useState<MachineryProfile[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [maxRate, setMaxRate] = useState("");
  const [rentalType, setRentalType] = useState<"hourly" | "daily">("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showCreateRequirement, setShowCreateRequirement] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Form states for machinery listing creation
  const [listingFormData, setListingFormData] = useState({
    owner_name: "",
    owner_phone: "",
    machinery_type: "",
    brand: "",
    model: "",
    year_of_purchase: new Date().getFullYear(),
    location: "",
    state: "",
    district: "",
    hourly_rate: 0,
    daily_rate: 0,
    description: "",
    fuel_type: "",
    horsepower: 0,
    working_width: 0
  });

  // Form states for machinery requirement creation
  const [requirementFormData, setRequirementFormData] = useState({
    farmer_name: "",
    farmer_phone: "",
    required_machinery_type: "",
    preferred_brand: "",
    location: "",
    state: "",
    district: "",
    required_date: "",
    duration_hours: 0,
    duration_days: 0,
    max_hourly_rate: 0,
    max_daily_rate: 0,
    specific_requirements: "",
    urgent: false
  });

  useEffect(() => {
    if (mode === "require") {
      fetchMachinery();
      fetchMachineryRequirements();
    } else {
      fetchMachineryListings();
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "require") {
      filterMachinery();
    }
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

  const fetchMachineryListings = async () => {
    try {
      const { data, error } = await supabase
        .from('machinery_listings')
        .select('*')
        .eq('availability', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMachineryListings(data || []);
    } catch (error) {
      console.error('Error fetching machinery listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMachineryRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('machinery_requirements')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMachineryRequirements(data || []);
    } catch (error) {
      console.error('Error fetching machinery requirements:', error);
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

  const deleteMachineryListing = async (listingId: string) => {
    const confirmDelete = window.confirm(t('common.confirm-delete'));
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('machinery_listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('machinery.listing-deleted'),
      });
      fetchMachineryListings();
    } catch (error) {
      console.error('Error deleting machinery listing:', error);
      toast({
        title: t('common.error'),
        description: t('common.error-occurred'),
        variant: "destructive"
      });
    }
  };

  const deleteMachineryRequirement = async (requirementId: string) => {
    const confirmDelete = window.confirm(t('common.confirm-delete'));
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('machinery_requirements')
        .delete()
        .eq('id', requirementId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('machinery.requirement-deleted'),
      });
      fetchMachineryRequirements();
    } catch (error) {
      console.error('Error deleting machinery requirement:', error);
      toast({
        title: t('common.error'),
        description: t('common.error-occurred'),
        variant: "destructive"
      });
    }
  };

  const createMachineryListing = async () => {
    if (!listingFormData.owner_name || !listingFormData.owner_phone || !listingFormData.machinery_type || !listingFormData.brand || !listingFormData.model) {
      toast({
        title: t('common.error'),
        description: t('machinery.fill-required-fields'),
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('machinery_listings')
        .insert([{
          ...listingFormData,
          user_id: null, // For demo, using null. In real app, would use auth.uid()
        }]);

      if (error) throw error;

      toast({
        title: "Machinery Listed",
        description: "Your machinery has been listed successfully. Farmers can now find and rent it.",
      });

      setShowCreateListing(false);
      fetchMachineryListings();
      
      // Reset form
      setListingFormData({
        owner_name: "",
        owner_phone: "",
        machinery_type: "",
        brand: "",
        model: "",
        year_of_purchase: new Date().getFullYear(),
        location: "",
        state: "",
        district: "",
        hourly_rate: 0,
        daily_rate: 0,
        description: "",
        fuel_type: "",
        horsepower: 0,
        working_width: 0
      });
    } catch (error) {
      console.error('Error creating machinery listing:', error);
      toast({
        title: "Error",
        description: "Failed to list machinery. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createMachineryRequirement = async () => {
    if (!requirementFormData.farmer_name || !requirementFormData.farmer_phone || !requirementFormData.required_machinery_type || !requirementFormData.required_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including required date.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('machinery_requirements')
        .insert([{
          ...requirementFormData,
          user_id: null, // For demo, using null. In real app, would use auth.uid()
        }]);

      if (error) throw error;

      toast({
        title: "Requirement Posted",
        description: "Your machinery requirement has been posted. Owners with matching machinery will be notified.",
      });

      setShowCreateRequirement(false);
      fetchMachineryRequirements();
      
      // Reset form
      setRequirementFormData({
        farmer_name: "",
        farmer_phone: "",
        required_machinery_type: "",
        preferred_brand: "",
        location: "",
        state: "",
        district: "",
        required_date: "",
        duration_hours: 0,
        duration_days: 0,
        max_hourly_rate: 0,
        max_daily_rate: 0,
        specific_requirements: "",
        urgent: false
      });
    } catch (error) {
      console.error('Error creating machinery requirement:', error);
      toast({
        title: "Error",
        description: "Failed to post requirement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMatchingMachinery = (requirement: MachineryRequirement) => {
    return machineryListings.filter(listing => 
      listing.machinery_type === requirement.required_machinery_type &&
      listing.district.toLowerCase() === requirement.district.toLowerCase() &&
      (requirement.max_daily_rate ? listing.daily_rate <= requirement.max_daily_rate : true) &&
      (requirement.preferred_brand ? listing.brand.toLowerCase().includes(requirement.preferred_brand.toLowerCase()) : true)
    );
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Mode Toggle */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Tractor className="w-8 h-8 text-primary" />
          Smart Machinery Platform
        </h2>
        <p className="text-muted-foreground">
          AI-powered matching between machinery owners and farmers
        </p>
        
        <div className="flex justify-center gap-2">
          <Button
            variant={mode === "require" ? "default" : "outline"}
            onClick={() => setMode("require")}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Need Machinery
          </Button>
          <Button
            variant={mode === "rental" ? "default" : "outline"}
            onClick={() => setMode("rental")}
            className="flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            Rent Out Machinery
          </Button>
        </div>
      </div>

      {mode === "require" ? (
        <>
          {/* Action Buttons for Require Mode */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowCreateRequirement(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post Machinery Requirement
            </Button>
          </div>

          {/* Filters for Finding Machinery */}
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

          {/* Available Machinery */}
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
                    <Button variant="crop" size="sm" className="flex-1">
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

          {/* Machinery Requirements with AI Matching */}
          {machineryRequirements.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Your Machinery Requirements with AI Matches</h3>
              {machineryRequirements.map((requirement) => {
                const matches = getMatchingMachinery(requirement);
                return (
                  <Card key={requirement.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {machineryTypes[requirement.required_machinery_type as keyof typeof machineryTypes]}
                            {requirement.urgent && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {requirement.location} • Required on {new Date(requirement.required_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{matches.length} AI Matches</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMachineryRequirement(requirement.id)}
                            className="text-destructive hover:text-destructive"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Required:</strong> {machineryTypes[requirement.required_machinery_type as keyof typeof machineryTypes]}</p>
                        {requirement.preferred_brand && <p><strong>Preferred Brand:</strong> {requirement.preferred_brand}</p>}
                        {requirement.max_daily_rate && <p><strong>Max Budget:</strong> ₹{requirement.max_daily_rate}/day</p>}
                        {requirement.specific_requirements && <p><strong>Requirements:</strong> {requirement.specific_requirements}</p>}
                      </div>
                      {matches.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Top AI Matches:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {matches.slice(0, 4).map((match) => (
                              <div key={match.id} className="p-2 border rounded-lg bg-muted/50">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{match.brand} {match.model}</span>
                                  <span className="text-xs text-muted-foreground">{match.year_of_purchase}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{match.location}</p>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs">₹{match.daily_rate}/day</span>
                                  <Button size="sm" variant="outline" className="h-6 text-xs">
                                    Contact
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredMachinery.length === 0 && (
            <div className="text-center py-12">
              <Tractor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No machinery found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or post a requirement to attract machinery owners.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Rental Mode - For Machinery Owners */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowCreateListing(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              List Your Machinery
            </Button>
          </div>

          {/* Available Requirements */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Farmers Looking for Machinery</h3>
            {machineryRequirements.map((requirement) => (
              <Card key={requirement.id} className="hover:shadow-crop transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {machineryTypes[requirement.required_machinery_type as keyof typeof machineryTypes]}
                        {requirement.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {requirement.location}, {requirement.district}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      {requirement.max_daily_rate && (
                        <div className="flex items-center text-success font-semibold">
                          <IndianRupee className="w-4 h-4" />
                          <span>Up to {requirement.max_daily_rate}/day</span>
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">
                        Required on {new Date(requirement.required_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Farmer:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{requirement.farmer_name}</span>
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{requirement.farmer_phone}</span>
                    </div>
                  </div>

                  {requirement.preferred_brand && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Preferred Brand:</span>
                      <span className="text-sm">{requirement.preferred_brand}</span>
                    </div>
                  )}

                  {requirement.specific_requirements && (
                    <div>
                      <span className="text-sm font-medium text-foreground">Specific Requirements:</span>
                      <p className="text-sm text-muted-foreground">{requirement.specific_requirements}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="crop" size="sm" className="flex-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Respond to Request
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Machinery Listings */}
          {machineryListings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Listed Machinery Available for Rent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machineryListings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-crop transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{getMachineryIcon(listing.machinery_type)}</span>
                          {listing.brand} {listing.model}
                          {listing.verified && (
                            <Award className="w-4 h-4 text-success" />
                          )}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMachineryListing(listing.id)}
                          className="text-destructive hover:text-destructive"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        {machineryTypes[listing.machinery_type as keyof typeof machineryTypes]}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.location}, {listing.district}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Owner: </span>
                          <span className="font-medium">{listing.owner_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{listing.owner_phone}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>{listing.year_of_purchase}</span>
                        </div>
                        {listing.horsepower && (
                          <div className="flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-muted-foreground" />
                            <span>{listing.horsepower} HP</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Daily Rate:</span>
                          <div className="flex items-center text-success font-semibold">
                            <IndianRupee className="w-4 h-4" />
                            <span>{listing.daily_rate}/day</span>
                          </div>
                        </div>
                      </div>

                      {listing.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {listing.description}
                        </p>
                      )}

                      <Button variant="outline" size="sm" className="w-full">
                        <Wrench className="w-4 h-4 mr-1" />
                        Manage Listing
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Machinery Listing Modal */}
      {showCreateListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>List Your Machinery</CardTitle>
              <CardDescription>
                Make your machinery available for rent to nearby farmers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Your Name</label>
                  <Input
                    value={listingFormData.owner_name}
                    onChange={(e) => setListingFormData({...listingFormData, owner_name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={listingFormData.owner_phone}
                    onChange={(e) => setListingFormData({...listingFormData, owner_phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Machinery Type</label>
                  <Select 
                    value={listingFormData.machinery_type} 
                    onValueChange={(value) => setListingFormData({...listingFormData, machinery_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select machinery type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(machineryTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Brand</label>
                  <Input
                    value={listingFormData.brand}
                    onChange={(e) => setListingFormData({...listingFormData, brand: e.target.value})}
                    placeholder="Enter brand"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Model</label>
                  <Input
                    value={listingFormData.model}
                    onChange={(e) => setListingFormData({...listingFormData, model: e.target.value})}
                    placeholder="Enter model"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Year of Purchase</label>
                  <Input
                    type="number"
                    value={listingFormData.year_of_purchase}
                    onChange={(e) => setListingFormData({...listingFormData, year_of_purchase: parseInt(e.target.value) || new Date().getFullYear()})}
                    placeholder="Enter year"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={listingFormData.state}
                    onChange={(e) => setListingFormData({...listingFormData, state: e.target.value})}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">District</label>
                  <Input
                    value={listingFormData.district}
                    onChange={(e) => setListingFormData({...listingFormData, district: e.target.value})}
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={listingFormData.location}
                    onChange={(e) => setListingFormData({...listingFormData, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hourly Rate (₹)</label>
                  <Input
                    type="number"
                    value={listingFormData.hourly_rate}
                    onChange={(e) => setListingFormData({...listingFormData, hourly_rate: parseInt(e.target.value) || 0})}
                    placeholder="Hourly rental rate"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Daily Rate (₹)</label>
                  <Input
                    type="number"
                    value={listingFormData.daily_rate}
                    onChange={(e) => setListingFormData({...listingFormData, daily_rate: parseInt(e.target.value) || 0})}
                    placeholder="Daily rental rate"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Horsepower (Optional)</label>
                  <Input
                    type="number"
                    value={listingFormData.horsepower}
                    onChange={(e) => setListingFormData({...listingFormData, horsepower: parseInt(e.target.value) || 0})}
                    placeholder="Engine horsepower"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={listingFormData.description}
                  onChange={(e) => setListingFormData({...listingFormData, description: e.target.value})}
                  placeholder="Describe your machinery, its condition, and any special features..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={createMachineryListing} className="flex-1">
                  List Machinery
                </Button>
                <Button variant="outline" onClick={() => setShowCreateListing(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Machinery Requirement Modal */}
      {showCreateRequirement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Post Machinery Requirement</CardTitle>
              <CardDescription>
                AI will find and match machinery owners to your requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Your Name</label>
                  <Input
                    value={requirementFormData.farmer_name}
                    onChange={(e) => setRequirementFormData({...requirementFormData, farmer_name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={requirementFormData.farmer_phone}
                    onChange={(e) => setRequirementFormData({...requirementFormData, farmer_phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Required Machinery</label>
                  <Select 
                    value={requirementFormData.required_machinery_type} 
                    onValueChange={(value) => setRequirementFormData({...requirementFormData, required_machinery_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select machinery type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(machineryTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Preferred Brand (Optional)</label>
                  <Input
                    value={requirementFormData.preferred_brand}
                    onChange={(e) => setRequirementFormData({...requirementFormData, preferred_brand: e.target.value})}
                    placeholder="Enter preferred brand"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={requirementFormData.state}
                    onChange={(e) => setRequirementFormData({...requirementFormData, state: e.target.value})}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">District</label>
                  <Input
                    value={requirementFormData.district}
                    onChange={(e) => setRequirementFormData({...requirementFormData, district: e.target.value})}
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={requirementFormData.location}
                    onChange={(e) => setRequirementFormData({...requirementFormData, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Required Date *</label>
                  <Input
                    type="date"
                    value={requirementFormData.required_date}
                    onChange={(e) => setRequirementFormData({...requirementFormData, required_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (Days)</label>
                  <Input
                    type="number"
                    value={requirementFormData.duration_days}
                    onChange={(e) => setRequirementFormData({...requirementFormData, duration_days: parseInt(e.target.value) || 0})}
                    placeholder="Number of days needed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Daily Rate (₹)</label>
                  <Input
                    type="number"
                    value={requirementFormData.max_daily_rate}
                    onChange={(e) => setRequirementFormData({...requirementFormData, max_daily_rate: parseInt(e.target.value) || 0})}
                    placeholder="Maximum you can pay per day"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Specific Requirements</label>
                <Textarea
                  value={requirementFormData.specific_requirements}
                  onChange={(e) => setRequirementFormData({...requirementFormData, specific_requirements: e.target.value})}
                  placeholder="Describe any specific requirements, work to be done, etc..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={createMachineryRequirement} className="flex-1">
                  Post Requirement
                </Button>
                <Button variant="outline" onClick={() => setShowCreateRequirement(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};