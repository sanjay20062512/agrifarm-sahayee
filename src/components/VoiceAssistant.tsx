import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, MicOff, Volume2, VolumeX, Loader2, 
  Globe, Bot, User, Send, StopCircle
} from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceAssistantProps {
  onNavigate?: (tab: string) => void;
}

// Voice command mappings
const commandMappings = {
  en: {
    'crop recommendation': 'crop-recommendation',
    'suggest crop': 'crop-recommendation',
    'recommend crop': 'crop-recommendation',
    'weather': 'crop-recommendation',
    'weather forecast': 'crop-recommendation',
    'disease': 'disease-detector',
    'check disease': 'disease-detector',
    'disease detector': 'disease-detector',
    'plant disease': 'disease-detector',
    'government scheme': 'government-schemes',
    'scheme': 'government-schemes',
    'subsidy': 'government-schemes',
    'machinery': 'machinery-rental',
    'tractor': 'machinery-rental',
    'rent machinery': 'machinery-rental',
    'rent tractor': 'machinery-rental',
    'labour': 'labor-hiring',
    'labor': 'labor-hiring',
    'hire labour': 'labor-hiring',
    'hire labor': 'labor-hiring',
    'worker': 'labor-hiring',
    'organic farming': 'organic-farming',
    'organic': 'organic-farming',
    'learning': 'learning',
    'learn': 'learning',
    'video': 'learning',
    'forum': 'farmer-forum',
    'farmer forum': 'farmer-forum',
    'community': 'farmer-forum',
    'profile': 'profile',
    'my profile': 'profile',
    'account': 'profile',
    'logout': 'logout',
    'log out': 'logout',
    'sign out': 'logout',
    'home': 'home',
    'ai assistant': 'ai-assistance',
    'ai help': 'ai-assistance',
  },
  ta: {
    'பயிர் பரிந்துரை': 'crop-recommendation',
    'பயிர் சிபாரிசு': 'crop-recommendation',
    'வானிலை': 'crop-recommendation',
    'நோய்': 'disease-detector',
    'நோய் கண்டறிதல்': 'disease-detector',
    'அரசு திட்டம்': 'government-schemes',
    'திட்டம்': 'government-schemes',
    'மானியம்': 'government-schemes',
    'இயந்திரம்': 'machinery-rental',
    'டிராக்டர்': 'machinery-rental',
    'இயந்திர வாடகை': 'machinery-rental',
    'தொழிலாளர்': 'labor-hiring',
    'வேலை': 'labor-hiring',
    'இயற்கை விவசாயம்': 'organic-farming',
    'இயற்கை': 'organic-farming',
    'கற்றல்': 'learning',
    'வீடியோ': 'learning',
    'மன்றம்': 'farmer-forum',
    'விவசாயி மன்றம்': 'farmer-forum',
    'சுயவிவரம்': 'profile',
    'என் சுயவிவரம்': 'profile',
    'வெளியேறு': 'logout',
    'முகப்பு': 'home',
  }
};

export const VoiceAssistant = ({ onNavigate }: VoiceAssistantProps) => {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { profile } = useAuth();
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: language === 'ta' 
        ? '🌾 வணக்கம்! நான் உங்கள் AI வேளாண் உதவியாளர். உங்கள் விவசாய பிரச்சனை அல்லது கட்டளையைப் பேசுங்கள்.\n\nநீங்கள் கேட்கலாம்:\n• "இந்த பருவத்திற்கு பயிர் பரிந்துரை"\n• "7 நாள் வானிலை"\n• "நோய் கண்டறிதல்"\n• "அரசு திட்டங்கள்"\n• "டிராக்டர் வாடகை"\n• "தொழிலாளர் தேடு"'
        : '🌾 Namaste! I\'m your AI Farming Assistant. Speak your farming problem or command.\n\nYou can ask:\n• "Suggest crop for this season"\n• "Show 7-day weather forecast"\n• "Check disease in my crop"\n• "Find government schemes"\n• "Rent tractor near me"\n• "Hire labour for harvesting"',
      timestamp: new Date()
    }
  ]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        setTranscript(transcriptText);
        
        if (result.isFinal) {
          handleVoiceInput(transcriptText);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast({
            title: language === 'ta' ? 'அனுமதி தேவை' : 'Permission Required',
            description: language === 'ta' 
              ? 'மைக்ரோஃபோன் அணுகலை அனுமதிக்கவும்' 
              : 'Please allow microphone access',
            variant: 'destructive'
          });
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast({
        title: language === 'ta' ? 'ஆதரிக்கப்படவில்லை' : 'Not Supported',
        description: language === 'ta' 
          ? 'உங்கள் உலாவி குரல் அங்கீகாரத்தை ஆதரிக்கவில்லை' 
          : 'Your browser does not support speech recognition',
        variant: 'destructive'
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const detectNavigation = (text: string): string | null => {
    const lowerText = text.toLowerCase();
    const commands = commandMappings[language] || commandMappings.en;
    
    for (const [phrase, route] of Object.entries(commands)) {
      if (lowerText.includes(phrase.toLowerCase())) {
        return route;
      }
    }
    return null;
  };

  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    
    // Check for navigation commands
    const navTarget = detectNavigation(text);
    if (navTarget) {
      if (navTarget === 'logout') {
        const response = language === 'ta' 
          ? 'சரி, உங்களை வெளியேற்றுகிறேன்.'
          : 'Okay, logging you out.';
        
        const assistantMessage: Message = {
          id: messages.length + 2,
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        speak(response);
        
        setTimeout(() => {
          onNavigate?.('logout');
        }, 2000);
        return;
      }
      
      if (navTarget === 'profile') {
        const response = language === 'ta' 
          ? 'உங்கள் சுயவிவரத்தைத் திறக்கிறேன்.'
          : 'Opening your profile.';
        
        const assistantMessage: Message = {
          id: messages.length + 2,
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        speak(response);
        
        setTimeout(() => {
          onNavigate?.('profile');
        }, 1500);
        return;
      }
      
      const response = language === 'ta' 
        ? `சரி, ${navTarget.replace('-', ' ')} பக்கத்திற்குச் செல்கிறேன்.`
        : `Sure, navigating to ${navTarget.replace('-', ' ')}.`;
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      speak(response);
      
      setTimeout(() => {
        onNavigate?.(navTarget);
      }, 1500);
      return;
    }
    
    // Process with AI
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistance', {
        body: { 
          question: text,
          language: language,
          context: `You are a helpful AI farming assistant for Indian farmers. 
          The user speaks ${language === 'ta' ? 'Tamil' : 'English'}.
          Provide practical, actionable advice. Keep responses concise and farmer-friendly.
          ${profile?.state ? `User's location: ${profile.district}, ${profile.state}` : ''}
          ${profile?.crops_grown?.length ? `User's crops: ${profile.crops_grown.join(', ')}` : ''}`
        }
      });

      if (error) throw error;

      const responseText = data.answer || (language === 'ta' 
        ? 'மன்னிக்கவும், புரியவில்லை. மீண்டும் முயற்சிக்கவும்.'
        : 'Sorry, I didn\'t understand. Please try again.');

      const assistantMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      speak(responseText);
      
    } catch (error: any) {
      console.error('AI assistance error:', error);
      const errorMsg = language === 'ta' 
        ? 'தொடர்பில் சிக்கல். மீண்டும் முயற்சிக்கவும்.'
        : 'Connection issue. Please try again.';
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Mic className="h-6 w-6 text-primary" />
                {language === 'ta' ? 'குரல் உதவியாளர்' : 'Voice Assistant'}
              </CardTitle>
              <CardDescription>
                {language === 'ta' 
                  ? 'உங்கள் விவசாய பிரச்சனை அல்லது கட்டளையைப் பேசுங்கள்' 
                  : 'Speak your farming problem or command'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={language === 'ta' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('ta')}
              >
                தமிழ்
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Messages Area */}
          <ScrollArea className="h-[400px] rounded-lg border p-4 mb-6 bg-muted/30">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                    <div
                      className={`rounded-lg p-4 ${
                        msg.role === 'assistant'
                          ? 'bg-card border border-border'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      <p className={`text-xs mt-2 ${msg.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3 justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="rounded-lg p-4 bg-card border border-border">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">
                          {language === 'ta' ? 'யோசிக்கிறேன்...' : 'Thinking...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Transcript Display */}
          {transcript && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {language === 'ta' ? 'கேட்கிறேன்: ' : 'Hearing: '}
                <span className="text-foreground font-medium">{transcript}</span>
              </p>
            </div>
          )}

          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Microphone Button */}
            <Button
              size="lg"
              variant={isListening ? 'destructive' : 'default'}
              className={`w-20 h-20 rounded-full transition-all ${
                isListening ? 'animate-pulse scale-110' : ''
              }`}
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>

            {/* Speaker Control */}
            <Button
              size="icon"
              variant="outline"
              className="w-12 h-12 rounded-full"
              onClick={isSpeaking ? stopSpeaking : undefined}
              disabled={!isSpeaking}
            >
              {isSpeaking ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {isListening && (
              <Badge variant="secondary" className="gap-1 animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                {language === 'ta' ? 'கேட்கிறேன்...' : 'Listening...'}
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary" className="gap-1">
                <Volume2 className="w-3 h-3" />
                {language === 'ta' ? 'பேசுகிறேன்...' : 'Speaking...'}
              </Badge>
            )}
            {isProcessing && (
              <Badge variant="secondary" className="gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                {language === 'ta' ? 'செயலாக்குகிறேன்...' : 'Processing...'}
              </Badge>
            )}
          </div>

          {/* Quick Commands */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground text-center mb-3">
              {language === 'ta' ? 'விரைவு கட்டளைகள்:' : 'Quick Commands:'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {language === 'ta' ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleVoiceInput('பயிர் பரிந்துரை')}>பயிர் பரிந்துரை</Button>
                  <Button variant="outline" size="sm" onClick={() => handleVoiceInput('நோய் கண்டறிதல்')}>நோய் கண்டறிதல்</Button>
                  <Button variant="outline" size="sm" onClick={() => handleVoiceInput('அரசு திட்டங்கள்')}>அரசு திட்டங்கள்</Button>
                  <Button variant="outline" size="sm" onClick={() => handleVoiceInput('டிராக்டர் வாடகை')}>டிராக்டர் வாடகை</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleVoiceInput('Suggest crop')}>Suggest Crop</Button>
                  <Button variant="outline" size="sm" onClick={() => handleVoiceInput('Check disease')}>Disease Check</Button>
                  <Button variant="outline" size="sm" onClick={() => handleVoiceInput('Government schemes')}>Schemes</Button>
                  <Button variant="outline" size="sm" onClick={() => handleVoiceInput('Rent tractor')}>Rent Machinery</Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
