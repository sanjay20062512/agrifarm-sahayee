import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Users,
  Plus,
  Briefcase,
  UserPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/LanguageContext";
import { Trash2 } from "lucide-react";

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

interface JobProfile {
  id: string;
  name: string;
  phone: string;
  location: string;
  state: string;
  district: string;
  skills: string[];
  specialization: string;
  experience_years: number;
  expected_wage_min: number;
  expected_wage_max: number;
  availability: boolean;
  description?: string;
}

interface JobRequirement {
  id: string;
  farmer_name: string;
  farmer_phone: string;
  required_skills: string[];
  job_location: string;
  state: string;
  district: string;
  start_date: string;
  end_date?: string;
  number_of_workers: number;
  offered_wage: number;
  job_description: string;
  urgent: boolean;
  status: string;
  created_at: string;
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

export const EnhancedLaborHiring = () => {
  const [mode, setMode] = useState<"hiring" | "job">("hiring");
  const [laborers, setLaborers] = useState<LaborProfile[]>([]);
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [jobRequirements, setJobRequirements] = useState<JobRequirement[]>([]);
  const [filteredLaborers, setFilteredLaborers] = useState<LaborProfile[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [maxWage, setMaxWage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCreateRequirement, setShowCreateRequirement] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Form states for job profile creation
  const [jobFormData, setJobFormData] = useState({
    name: "",
    phone: "",
    location: "",
    state: "",
    district: "",
    skills: [] as string[],
    specialization: "",
    experience_years: 0,
    expected_wage_min: 0,
    expected_wage_max: 0,
    description: ""
  });

  // Form states for job requirement creation
  const [requirementFormData, setRequirementFormData] = useState({
    farmer_name: "",
    farmer_phone: "",
    required_skills: [] as string[],
    job_location: "",
    state: "",
    district: "",
    start_date: "",
    end_date: "",
    number_of_workers: 1,
    offered_wage: 0,
    job_description: "",
    urgent: false
  });

  useEffect(() => {
    if (mode === "hiring") {
      fetchLaborers();
      fetchJobRequirements();
    } else {
      fetchJobProfiles();
    }

    // Set up real-time subscriptions
    const laborChannel = supabase
      .channel('labor_profiles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'labor_profiles' }, 
        () => {
          if (mode === "hiring") fetchLaborers();
        }
      )
      .subscribe();

    const jobProfilesChannel = supabase
      .channel('job_profiles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'job_profiles' }, 
        () => {
          if (mode === "job") fetchJobProfiles();
        }
      )
      .subscribe();

    const jobReqChannel = supabase
      .channel('job_requirements_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'job_requirements' }, 
        () => {
          if (mode === "hiring") fetchJobRequirements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(laborChannel);
      supabase.removeChannel(jobProfilesChannel);
      supabase.removeChannel(jobReqChannel);
    };
  }, [mode]);

  useEffect(() => {
    if (mode === "hiring") {
      filterLaborers();
    }
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

  const fetchJobProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('job_profiles')
        .select('*')
        .eq('availability', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobProfiles(data || []);
    } catch (error) {
      console.error('Error fetching job profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('job_requirements')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobRequirements(data || []);
    } catch (error) {
      console.error('Error fetching job requirements:', error);
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

    if (selectedSkill && selectedSkill !== "all") {
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

  const deleteJobProfile = async (profileId: string) => {
    const confirmDelete = window.confirm(t('common.confirm-delete'));
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('job_profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('labor.profile-deleted'),
      });
      fetchJobProfiles();
    } catch (error) {
      console.error('Error deleting job profile:', error);
      toast({
        title: t('common.error'),
        description: t('common.error-occurred'),
        variant: "destructive"
      });
    }
  };

  const deleteJobRequirement = async (requirementId: string) => {
    const confirmDelete = window.confirm(t('common.confirm-delete'));
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('job_requirements')
        .delete()
        .eq('id', requirementId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('labor.requirement-deleted'),
      });
      fetchJobRequirements();
    } catch (error) {
      console.error('Error deleting job requirement:', error);
      toast({
        title: t('common.error'),
        description: t('common.error-occurred'),
        variant: "destructive"
      });
    }
  };

  const createJobProfile = async () => {
    if (!jobFormData.name || !jobFormData.phone || !jobFormData.location || !jobFormData.skills.length) {
      toast({
        title: t('common.error'),
        description: t('labor.fill-required-fields'),
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('job_profiles')
        .insert([{
          ...jobFormData,
          user_id: null, // For demo, using null. In real app, would use auth.uid()
        }]);

      if (error) throw error;

      toast({
        title: "Job Profile Created",
        description: "Your job profile has been created successfully. Farmers can now find and contact you for work opportunities.",
      });

      setShowCreateJob(false);
      fetchJobProfiles();
      
      // Reset form
      setJobFormData({
        name: "",
        phone: "",
        location: "",
        state: "",
        district: "",
        skills: [],
        specialization: "",
        experience_years: 0,
        expected_wage_min: 0,
        expected_wage_max: 0,
        description: ""
      });
    } catch (error) {
      console.error('Error creating job profile:', error);
      toast({
        title: "Error",
        description: "Failed to create job profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createJobRequirement = async () => {
    if (!requirementFormData.farmer_name || !requirementFormData.farmer_phone || !requirementFormData.job_description || !requirementFormData.start_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including start date.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('job_requirements')
        .insert([{
          ...requirementFormData,
          user_id: null, // For demo, using null. In real app, would use auth.uid()
        }]);

      if (error) throw error;

      toast({
        title: "Job Requirement Posted",
        description: "Your job requirement has been posted. Workers matching your criteria will be notified.",
      });

      setShowCreateRequirement(false);
      fetchJobRequirements();
      
      // Reset form
      setRequirementFormData({
        farmer_name: "",
        farmer_phone: "",
        required_skills: [],
        job_location: "",
        state: "",
        district: "",
        start_date: "",
        end_date: "",
        number_of_workers: 1,
        offered_wage: 0,
        job_description: "",
        urgent: false
      });
    } catch (error) {
      console.error('Error creating job requirement:', error);
      toast({
        title: "Error",
        description: "Failed to post job requirement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMatchingWorkers = (requirement: JobRequirement) => {
    return jobProfiles.filter(profile => 
      requirement.required_skills.some(skill => profile.skills.includes(skill)) &&
      profile.district.toLowerCase() === requirement.district.toLowerCase() &&
      profile.expected_wage_min <= requirement.offered_wage
    );
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
          <UserCog className="w-8 h-8 text-primary" />
          Smart Labor Platform
        </h2>
        <p className="text-muted-foreground">
          AI-powered matching between farmers and agricultural workers
        </p>
        
        <div className="flex justify-center gap-2">
          <Button
            variant={mode === "hiring" ? "default" : "outline"}
            onClick={() => setMode("hiring")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Find Workers
          </Button>
          <Button
            variant={mode === "job" ? "default" : "outline"}
            onClick={() => setMode("job")}
            className="flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Find Work
          </Button>
        </div>
      </div>

      {mode === "hiring" ? (
        <>
          {/* Action Buttons for Hiring Mode */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowCreateRequirement(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post Job Requirement
            </Button>
          </div>

          {/* Filters for Finding Workers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Workers
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
                      <SelectItem value="all">All Skills</SelectItem>
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
                      setSelectedSkill("all");
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

          {/* Available Workers */}
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

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Daily Wage:</span>
                    <div className="flex items-center text-success font-semibold">
                      <IndianRupee className="w-4 h-4" />
                      <span>{laborer.daily_wage_min}-{laborer.daily_wage_max}</span>
                    </div>
                  </div>

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

                  {laborer.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {laborer.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button variant="crop" size="sm" className="flex-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Hire Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Job Requirements with AI Matching */}
          {jobRequirements.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Your Job Requirements with AI Matches</h3>
              {jobRequirements.map((requirement) => {
                const matches = getMatchingWorkers(requirement);
                return (
                  <Card key={requirement.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {requirement.job_description}
                            {requirement.urgent && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {requirement.job_location} • {requirement.number_of_workers} workers needed
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{matches.length} AI Matches</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteJobRequirement(requirement.id)}
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
                        <p><strong>Skills Required:</strong> {requirement.required_skills.map(skill => skillTranslations[skill as keyof typeof skillTranslations]).join(', ')}</p>
                        <p><strong>Offered Wage:</strong> ₹{requirement.offered_wage}/day</p>
                        <p><strong>Start Date:</strong> {new Date(requirement.start_date).toLocaleDateString()}</p>
                      </div>
                      {matches.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Top AI Matches:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {matches.slice(0, 4).map((match) => (
                              <div key={match.id} className="p-2 border rounded-lg bg-muted/50">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{match.name}</span>
                                  <span className="text-xs text-muted-foreground">{match.experience_years}y exp</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{match.location}</p>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs">₹{match.expected_wage_min}-{match.expected_wage_max}</span>
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

          {filteredLaborers.length === 0 && (
            <div className="text-center py-12">
              <UserCog className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No workers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or post a job requirement to attract workers.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Job Mode - For Workers Looking for Jobs */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowCreateJob(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Job Profile
            </Button>
          </div>

          {/* Available Job Opportunities */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Available Job Opportunities</h3>
            {jobRequirements.map((job) => (
              <Card key={job.id} className="hover:shadow-crop transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {job.job_description}
                        {job.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.job_location}, {job.district}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-success font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        <span>{job.offered_wage}/day</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{job.number_of_workers} workers needed</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Farmer:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{job.farmer_name}</span>
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{job.farmer_phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Start Date:</span>
                    <span className="text-sm">{new Date(job.start_date).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-foreground">Required Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.required_skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className={`text-xs ${getSkillColor(skill)}`}
                        >
                          {skillTranslations[skill as keyof typeof skillTranslations] || skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="crop" size="sm" className="flex-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Apply Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Worker Profiles */}
          {jobProfiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Worker Profiles Seeking Jobs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobProfiles.map((profile) => (
                  <Card key={profile.id} className="hover:shadow-crop transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{profile.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profile.location}, {profile.district}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteJobProfile(profile.id)}
                          className="text-destructive hover:text-destructive"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{profile.experience_years} years exp.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Expected Wage:</span>
                        <div className="flex items-center text-success font-semibold">
                          <IndianRupee className="w-4 h-4" />
                          <span>{profile.expected_wage_min}-{profile.expected_wage_max}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-foreground">Specialization:</span>
                        <p className="text-sm text-muted-foreground">{profile.specialization}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-foreground">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.skills.slice(0, 3).map((skill) => (
                            <Badge 
                              key={skill} 
                              variant="secondary" 
                              className={`text-xs ${getSkillColor(skill)}`}
                            >
                              {skillTranslations[skill as keyof typeof skillTranslations] || skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {profile.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {profile.description}
                        </p>
                      )}

                      <Button variant="outline" size="sm" className="w-full">
                        <Users className="w-4 h-4 mr-1" />
                        Contact Worker
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Job Profile Modal */}
      {showCreateJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Your Job Profile</CardTitle>
              <CardDescription>
                Let farmers find you for agricultural work opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={jobFormData.name}
                    onChange={(e) => setJobFormData({...jobFormData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={jobFormData.phone}
                    onChange={(e) => setJobFormData({...jobFormData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={jobFormData.state}
                    onChange={(e) => setJobFormData({...jobFormData, state: e.target.value})}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">District</label>
                  <Input
                    value={jobFormData.district}
                    onChange={(e) => setJobFormData({...jobFormData, district: e.target.value})}
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Experience (Years)</label>
                  <Input
                    type="number"
                    value={jobFormData.experience_years}
                    onChange={(e) => setJobFormData({...jobFormData, experience_years: parseInt(e.target.value) || 0})}
                    placeholder="Years of experience"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expected Min Wage (₹/day)</label>
                  <Input
                    type="number"
                    value={jobFormData.expected_wage_min}
                    onChange={(e) => setJobFormData({...jobFormData, expected_wage_min: parseInt(e.target.value) || 0})}
                    placeholder="Minimum daily wage"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expected Max Wage (₹/day)</label>
                  <Input
                    type="number"
                    value={jobFormData.expected_wage_max}
                    onChange={(e) => setJobFormData({...jobFormData, expected_wage_max: parseInt(e.target.value) || 0})}
                    placeholder="Maximum daily wage"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Skills *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {Object.entries(skillTranslations).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={jobFormData.skills.includes(key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setJobFormData({...jobFormData, skills: [...jobFormData.skills, key]});
                          } else {
                            setJobFormData({...jobFormData, skills: jobFormData.skills.filter(s => s !== key)});
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Specialization</label>
                <Input
                  value={jobFormData.specialization}
                  onChange={(e) => setJobFormData({...jobFormData, specialization: e.target.value})}
                  placeholder="e.g., Rice farming specialist, Organic farming expert"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                  placeholder="Describe your experience and what makes you a great worker..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={createJobProfile} className="flex-1">
                  Create Profile
                </Button>
                <Button variant="outline" onClick={() => setShowCreateJob(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Job Requirement Modal */}
      {showCreateRequirement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Post Job Requirement</CardTitle>
              <CardDescription>
                AI will match qualified workers to your job requirements
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
                  <label className="text-sm font-medium">Job Location</label>
                  <Input
                    value={requirementFormData.job_location}
                    onChange={(e) => setRequirementFormData({...requirementFormData, job_location: e.target.value})}
                    placeholder="Enter job location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Number of Workers</label>
                  <Input
                    type="number"
                    value={requirementFormData.number_of_workers}
                    onChange={(e) => setRequirementFormData({...requirementFormData, number_of_workers: parseInt(e.target.value) || 1})}
                    placeholder="Number of workers needed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date *</label>
                  <Input
                    type="date"
                    value={requirementFormData.start_date}
                    onChange={(e) => setRequirementFormData({...requirementFormData, start_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Offered Wage (₹/day)</label>
                  <Input
                    type="number"
                    value={requirementFormData.offered_wage}
                    onChange={(e) => setRequirementFormData({...requirementFormData, offered_wage: parseInt(e.target.value) || 0})}
                    placeholder="Daily wage offered"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  value={requirementFormData.job_description}
                  onChange={(e) => setRequirementFormData({...requirementFormData, job_description: e.target.value})}
                  placeholder="Describe the work to be done..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={createJobRequirement} className="flex-1">
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