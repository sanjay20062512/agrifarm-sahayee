import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/components/LanguageContext';
import { Leaf, Phone, Mail, KeyRound, Loader2, Globe } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithEmail, signInWithOtp, verifyOtp } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone login state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signInWithEmail(email, password);
    
    if (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: language === 'ta' ? 'வரவேற்கிறோம்!' : 'Welcome!',
        description: language === 'ta' 
          ? 'வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்' 
          : 'Successfully logged in'
      });
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' 
          ? 'சரியான மொபைல் எண்ணை உள்ளிடவும்' 
          : 'Please enter a valid mobile number',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    const { error } = await signInWithOtp(formattedPhone);
    
    if (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: language === 'ta' ? 'OTP அனுப்பப்பட்டது' : 'OTP Sent',
        description: language === 'ta' 
          ? 'உங்கள் மொபைலுக்கு OTP அனுப்பப்பட்டது' 
          : 'OTP has been sent to your mobile'
      });
      setShowOtpInput(true);
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: language === 'ta' 
          ? '6 இலக்க OTP உள்ளிடவும்' 
          : 'Please enter 6-digit OTP',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    const { error } = await verifyOtp(formattedPhone, otp);
    
    if (error) {
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: language === 'ta' ? 'வரவேற்கிறோம்!' : 'Welcome!',
        description: language === 'ta' 
          ? 'வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்' 
          : 'Successfully logged in'
      });
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4">
            <Leaf className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">THINAI360AI</h1>
          <p className="text-muted-foreground mt-2">
            {language === 'ta' ? 'திறமையான வேளாண் உதவியாளர்' : 'Smart Farming Assistant'}
          </p>
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

        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {language === 'ta' ? 'உள்நுழைக' : 'Login'}
            </CardTitle>
            <CardDescription>
              {language === 'ta' 
                ? 'உங்கள் கணக்கில் உள்நுழையுங்கள்' 
                : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone" className="gap-2">
                  <Phone className="w-4 h-4" />
                  {language === 'ta' ? 'மொபைல்' : 'Mobile'}
                </TabsTrigger>
                <TabsTrigger value="email" className="gap-2">
                  <Mail className="w-4 h-4" />
                  {language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                </TabsTrigger>
              </TabsList>

              {/* Phone/OTP Login */}
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {language === 'ta' ? 'மொபைல் எண்' : 'Mobile Number'}
                  </Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-muted-foreground">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      disabled={showOtpInput}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                {!showOtpInput ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {language === 'ta' ? 'OTP அனுப்பு' : 'Send OTP'}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">
                        {language === 'ta' ? 'OTP உள்ளிடவும்' : 'Enter OTP'}
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="text-center text-2xl tracking-widest"
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <KeyRound className="w-4 h-4 mr-2" />
                      )}
                      {language === 'ta' ? 'சரிபார்த்து உள்நுழை' : 'Verify & Login'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        setShowOtpInput(false);
                        setOtp('');
                      }}
                    >
                      {language === 'ta' ? 'எண்ணை மாற்று' : 'Change Number'}
                    </Button>
                  </>
                )}
              </TabsContent>

              {/* Email Login */}
              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {language === 'ta' ? 'கடவுச்சொல்' : 'Password'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {language === 'ta' ? 'உள்நுழை' : 'Login'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/register" 
                className="text-primary hover:underline block"
              >
                {language === 'ta' 
                  ? 'புதிய விவசாயி? பதிவு செய்யுங்கள்' 
                  : 'New Farmer? Register'}
              </Link>
              <Link 
                to="/forgot-password" 
                className="text-muted-foreground hover:text-primary text-sm block"
              >
                {language === 'ta' 
                  ? 'கடவுச்சொல் மறந்துவிட்டதா?' 
                  : 'Forgot Password?'}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
