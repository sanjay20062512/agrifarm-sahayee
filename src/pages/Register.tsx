import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/LanguageContext';
import { Leaf, Loader2, Globe, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { stateDistrictClimate } from '@/data/stateDistrictClimate';

const cropOptions = [
  'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Groundnut', 
  'Banana', 'Coconut', 'Tomato', 'Onion', 'Chili',
  'Turmeric', 'Mango', 'Maize', 'Millets', 'Pulses'
];

export const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, updateProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1 - Basic Details
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  
  // Step 2 - Farm Details
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [cropsGrown, setCropsGrown] = useState<string[]>([]);
  const [farmSize, setFarmSize] = useState('');
  const [farmUnit, setFarmUnit] = useState('acres');
  const [farmingType, setFarmingType] = useState('');
  
  // Step 3 - Account Setup
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const states = Object.keys(stateDistrictClimate);
  const districts = state ? Object.keys(stateDistrictClimate[state] || {}) : [];

  const toggleCrop = (crop: string) => {
    setCropsGrown(prev => 
      prev.includes(crop) 
        ? prev.filter(c => c !== crop)
        : [...prev, crop]
    );
  };

  const validateStep1 = () => {
    if (!fullName.trim()) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'பெயர் தேவை' : 'Name is required',
        variant: 'destructive'
      });
      return false;
    }
    if (!mobileNumber || mobileNumber.length < 10) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'சரியான மொபைல் எண் தேவை' : 'Valid mobile number is required',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!state || !district) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'மாநிலம் மற்றும் மாவட்டம் தேவை' : 'State and District are required',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!email || !password) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவை' : 'Email and password are required',
        variant: 'destructive'
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match',
        variant: 'destructive'
      });
      return false;
    }
    if (password.length < 6) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்' : 'Password must be at least 6 characters',
        variant: 'destructive'
      });
      return false;
    }
    if (!acceptTerms) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' ? 'விதிமுறைகளை ஏற்க வேண்டும்' : 'You must accept the terms',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setIsLoading(true);
    
    const { error } = await signUp(email, password, fullName, mobileNumber);
    
    if (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    // Update profile with additional details
    const profileData = {
      mobile_number: mobileNumber,
      gender,
      age: age ? parseInt(age) : undefined,
      state,
      district,
      village,
      crops_grown: cropsGrown,
      farm_size: farmSize ? parseFloat(farmSize) : undefined,
      farm_unit: farmUnit,
      farming_type: farmingType,
      preferred_language: language
    };

    toast({
      title: language === 'ta' ? 'வரவேற்கிறோம்!' : 'Welcome!',
      description: language === 'ta' 
        ? 'உங்கள் கணக்கு உருவாக்கப்பட்டது. மின்னஞ்சலை சரிபார்க்கவும்.' 
        : 'Account created! Please verify your email.'
    });
    
    navigate('/login');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-3">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">THINAI360AI</h1>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'தமிழ்' : 'English'}
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s < step ? 'bg-primary text-primary-foreground' :
                  s === step ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={`w-8 h-1 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {step === 1 && (language === 'ta' ? 'அடிப்படை விவரங்கள்' : 'Basic Details')}
              {step === 2 && (language === 'ta' ? 'பண்ணை விவரங்கள்' : 'Farm Details')}
              {step === 3 && (language === 'ta' ? 'கணக்கு அமைப்பு' : 'Account Setup')}
            </CardTitle>
            <CardDescription>
              {language === 'ta' ? `படி ${step}/3` : `Step ${step} of 3`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1 - Basic Details */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'முழு பெயர்' : 'Full Name'} *</Label>
                  <Input
                    placeholder={language === 'ta' ? 'உங்கள் பெயர்' : 'Your name'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'மொபைல் எண்' : 'Mobile Number'} *</Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-muted-foreground">
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'மின்னஞ்சல்' : 'Email'} ({language === 'ta' ? 'விருப்பம்' : 'Optional'})</Label>
                  <Input
                    type="email"
                    placeholder="farmer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'பாலினம்' : 'Gender'}</Label>
                    <Select value={gender} onValueChange={setGender}>
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
                      placeholder="35"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2 - Farm Details */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'மாநிலம்' : 'State'} *</Label>
                    <Select value={state} onValueChange={(v) => { setState(v); setDistrict(''); }}>
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
                    <Label>{language === 'ta' ? 'மாவட்டம்' : 'District'} *</Label>
                    <Select value={district} onValueChange={setDistrict} disabled={!state}>
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
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'கிராமம்' : 'Village'} ({language === 'ta' ? 'விருப்பம்' : 'Optional'})</Label>
                  <Input
                    placeholder={language === 'ta' ? 'உங்கள் கிராமம்' : 'Your village'}
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'பயிரிடும் பயிர்கள்' : 'Crops Grown'}</Label>
                  <div className="flex flex-wrap gap-2">
                    {cropOptions.map(crop => (
                      <Button
                        key={crop}
                        type="button"
                        variant={cropsGrown.includes(crop) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCrop(crop)}
                      >
                        {crop}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'பண்ணை அளவு' : 'Farm Size'}</Label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ta' ? 'அலகு' : 'Unit'}</Label>
                    <Select value={farmUnit} onValueChange={setFarmUnit}>
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
                  <Label>{language === 'ta' ? 'விவசாய வகை' : 'Farming Type'}</Label>
                  <Select value={farmingType} onValueChange={setFarmingType}>
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
              </>
            )}

            {/* Step 3 - Account Setup */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'மின்னஞ்சல்' : 'Email'} *</Label>
                  <Input
                    type="email"
                    placeholder="farmer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'கடவுச்சொல்' : 'Password'} *</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ta' ? 'கடவுச்சொல் உறுதிப்படுத்து' : 'Confirm Password'} *</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    {language === 'ta' 
                      ? 'விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறேன்' 
                      : 'I accept the Terms & Privacy Policy'}
                  </Label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === 'ta' ? 'முந்தைய' : 'Back'}
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={handleNext} className="flex-1">
                  {language === 'ta' ? 'அடுத்து' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {language === 'ta' ? 'கணக்கு உருவாக்கு' : 'Create Account'}
                </Button>
              )}
            </div>

            <div className="text-center pt-4">
              <Link to="/login" className="text-primary hover:underline">
                {language === 'ta' 
                  ? 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையுங்கள்' 
                  : 'Already have an account? Login'}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
