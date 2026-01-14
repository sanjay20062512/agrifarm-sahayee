import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/LanguageContext';
import { 
  User, MapPin, Leaf, Settings, Activity, 
  LogOut, Save, Loader2, ArrowLeft, Camera,
  Mic, Bell, Globe, Tractor, BookOpen, Bug, FileText
} from 'lucide-react';
import { stateDistrictClimate } from '@/data/stateDistrictClimate';

const cropOptions = [
  'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Groundnut', 
  'Banana', 'Coconut', 'Tomato', 'Onion', 'Chili',
  'Turmeric', 'Mango', 'Maize', 'Millets', 'Pulses'
];

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading, signOut, updateProfile, refreshProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    gender: '',
    age: '',
    state: '',
    district: '',
    village: '',
    crops_grown: [] as string[],
    farm_size: '',
    farm_unit: 'acres',
    farming_type: '',
    preferred_language: 'en',
    voice_assistant_enabled: true,
    notifications_enabled: true
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        mobile_number: profile.mobile_number || '',
        email: profile.email || '',
        gender: profile.gender || '',
        age: profile.age?.toString() || '',
        state: profile.state || '',
        district: profile.district || '',
        village: profile.village || '',
        crops_grown: profile.crops_grown || [],
        farm_size: profile.farm_size?.toString() || '',
        farm_unit: profile.farm_unit || 'acres',
        farming_type: profile.farming_type || '',
        preferred_language: profile.preferred_language || 'en',
        voice_assistant_enabled: profile.voice_assistant_enabled ?? true,
        notifications_enabled: profile.notifications_enabled ?? true
      });
    }
  }, [profile]);

  const states = Object.keys(stateDistrictClimate);
  const districts = formData.state ? Object.keys(stateDistrictClimate[formData.state] || {}) : [];

  const toggleCrop = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      crops_grown: prev.crops_grown.includes(crop)
        ? prev.crops_grown.filter(c => c !== crop)
        : [...prev.crops_grown, crop]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const { error } = await updateProfile({
      full_name: formData.full_name,
      mobile_number: formData.mobile_number,
      gender: formData.gender || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      state: formData.state,
      district: formData.district,
      village: formData.village,
      crops_grown: formData.crops_grown,
      farm_size: formData.farm_size ? parseFloat(formData.farm_size) : undefined,
      farm_unit: formData.farm_unit,
      farming_type: formData.farming_type || undefined,
      preferred_language: formData.preferred_language,
      voice_assistant_enabled: formData.voice_assistant_enabled,
      notifications_enabled: formData.notifications_enabled
    });

    if (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: language === 'ta' ? 'வெற்றி' : 'Success',
        description: language === 'ta' ? 'சுயவிவரம் புதுப்பிக்கப்பட்டது' : 'Profile updated successfully'
      });
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const greeting = language === 'ta' 
    ? `வணக்கம் ${formData.full_name}! THINAI360AI உங்களை வரவேற்கிறது.`
    : `Welcome ${formData.full_name}! THINAI360AI is ready to help you.`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {language === 'ta' ? 'முகப்பு' : 'Home'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'தமிழ்' : 'English'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Message */}
        <Card className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile?.profile_photo} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {formData.full_name?.charAt(0)?.toUpperCase() || 'F'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">{greeting}</h1>
                <p className="text-muted-foreground">
                  {formData.district && formData.state ? `${formData.district}, ${formData.state}` : 'Complete your profile'}
                </p>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                  <Camera className="w-4 h-4" />
                  {language === 'ta' ? 'திருத்து' : 'Edit'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'ta' ? 'தனிப்பட்ட' : 'Personal'}</span>
            </TabsTrigger>
            <TabsTrigger value="farm" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'ta' ? 'பண்ணை' : 'Farm'}</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'ta' ? 'அமைப்புகள்' : 'Settings'}</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'ta' ? 'செயல்பாடு' : 'Activity'}</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ta' ? 'தனிப்பட்ட தகவல்' : 'Personal Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'முழு பெயர்' : 'Full Name'}</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'மொபைல் எண்' : 'Mobile Number'}</Label>
                    <Input
                      value={formData.mobile_number}
                      onChange={(e) => setFormData(p => ({ ...p, mobile_number: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'பாலினம்' : 'Gender'}</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(v) => setFormData(p => ({ ...p, gender: v }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ta' ? 'தேர்வு' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{language === 'ta' ? 'ஆண்' : 'Male'}</SelectItem>
                        <SelectItem value="female">{language === 'ta' ? 'பெண்' : 'Female'}</SelectItem>
                        <SelectItem value="other">{language === 'ta' ? 'மற்றவை' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'வயது' : 'Age'}</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(p => ({ ...p, age: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farm Info Tab */}
          <TabsContent value="farm">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ta' ? 'பண்ணை தகவல்' : 'Farm Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'மாநிலம்' : 'State'}</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(v) => setFormData(p => ({ ...p, state: v, district: '' }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ta' ? 'தேர்வு' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'மாவட்டம்' : 'District'}</Label>
                    <Select 
                      value={formData.district} 
                      onValueChange={(v) => setFormData(p => ({ ...p, district: v }))}
                      disabled={!isEditing || !formData.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ta' ? 'தேர்வு' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'கிராமம்' : 'Village'}</Label>
                    <Input
                      value={formData.village}
                      onChange={(e) => setFormData(p => ({ ...p, village: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'விவசாய வகை' : 'Farming Type'}</Label>
                    <Select 
                      value={formData.farming_type} 
                      onValueChange={(v) => setFormData(p => ({ ...p, farming_type: v }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ta' ? 'தேர்வு' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traditional">{language === 'ta' ? 'பாரம்பரியம்' : 'Traditional'}</SelectItem>
                        <SelectItem value="organic">{language === 'ta' ? 'இயற்கை' : 'Organic'}</SelectItem>
                        <SelectItem value="mixed">{language === 'ta' ? 'கலப்பு' : 'Mixed'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'பண்ணை அளவு' : 'Farm Size'}</Label>
                    <Input
                      type="number"
                      value={formData.farm_size}
                      onChange={(e) => setFormData(p => ({ ...p, farm_size: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'அலகு' : 'Unit'}</Label>
                    <Select 
                      value={formData.farm_unit} 
                      onValueChange={(v) => setFormData(p => ({ ...p, farm_unit: v }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acres">{language === 'ta' ? 'ஏக்கர்' : 'Acres'}</SelectItem>
                        <SelectItem value="hectares">{language === 'ta' ? 'ஹெக்டேர்' : 'Hectares'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'பயிரிடும் பயிர்கள்' : 'Crops Grown'}</Label>
                  <div className="flex flex-wrap gap-2">
                    {cropOptions.map(crop => (
                      <Button
                        key={crop}
                        type="button"
                        variant={formData.crops_grown.includes(crop) ? "default" : "outline"}
                        size="sm"
                        onClick={() => isEditing && toggleCrop(crop)}
                        disabled={!isEditing}
                      >
                        {crop}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ta' ? 'விருப்பத்தேர்வுகள்' : 'Preferences'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === 'ta' ? 'மொழி' : 'Language'}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ta' ? 'உங்கள் விருப்பமான மொழி' : 'Your preferred language'}
                      </p>
                    </div>
                  </div>
                  <Select 
                    value={formData.preferred_language} 
                    onValueChange={(v) => {
                      setFormData(p => ({ ...p, preferred_language: v }));
                      setLanguage(v as 'en' | 'ta');
                    }}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === 'ta' ? 'குரல் உதவியாளர்' : 'Voice Assistant'}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ta' ? 'குரல் கட்டுப்பாட்டை இயக்கு' : 'Enable voice control'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.voice_assistant_enabled}
                    onCheckedChange={(v) => setFormData(p => ({ ...p, voice_assistant_enabled: v }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === 'ta' ? 'அறிவிப்புகள்' : 'Notifications'}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ta' ? 'புஷ் அறிவிப்புகளைப் பெறுங்கள்' : 'Receive push notifications'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.notifications_enabled}
                    onCheckedChange={(v) => setFormData(p => ({ ...p, notifications_enabled: v }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ta' ? 'செயல்பாட்டு சுருக்கம்' : 'Activity Summary'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Leaf className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{profile?.total_crop_recommendations || 0}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ta' ? 'பயிர் பரிந்துரைகள்' : 'Crop Recommendations'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Bug className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">{profile?.total_disease_checks || 0}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ta' ? 'நோய் சோதனைகள்' : 'Disease Checks'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">{profile?.total_schemes_viewed || 0}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ta' ? 'திட்டங்கள் பார்வையிட்டது' : 'Schemes Viewed'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Tractor className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">{profile?.total_machinery_booked || 0}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ta' ? 'இயந்திரம் பதிவு' : 'Machinery Booked'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">{profile?.total_learning_accessed || 0}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ta' ? 'கற்றல் அணுகியது' : 'Learning Accessed'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)} 
                className="flex-1"
              >
                {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleSave} 
                className="flex-1 gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {language === 'ta' ? 'சேமி' : 'Save'}
              </Button>
            </>
          ) : (
            <Button 
              variant="destructive" 
              onClick={handleLogout} 
              className="w-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              {language === 'ta' ? 'வெளியேறு' : 'Logout'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
