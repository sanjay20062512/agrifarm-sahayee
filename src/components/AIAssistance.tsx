import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, Brain } from "lucide-react";
import { AgriAITwin } from "./AgriAITwin";

interface Message {
  id: number;
  type: "bot" | "user";
  message: string;
  timestamp: Date;
}

export const AIAssistance = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      message: "Hello! I'm your AI farming assistant. I can help you with crop recommendations, pest control, fertilizers, irrigation, market prices, and government schemes. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showAITwin, setShowAITwin] = useState(false);

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect')) {
      return "For pest control, I recommend: 1) Identify the pest first - aphids, caterpillars, or beetles? 2) Use Neem oil (organic) spray in evening 3) For severe infestations: Imidacloprid or Chlorpyrifos 4) Always maintain field hygiene and crop rotation 5) Use yellow sticky traps for early detection. What specific pest are you dealing with?";
    }
    
    if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('nutrient')) {
      return "Fertilizer recommendations: 1) Get soil test first - NPK levels are crucial 2) For vegetative growth: Urea (Nitrogen) 3) For flowering: DAP (Phosphorus) 4) For fruit development: MOP (Potassium) 5) Organic options: FYM, vermicompost, green manure 6) Apply in split doses for better absorption. Which crop and growth stage are you asking about?";
    }
    
    if (lowerQuestion.includes('disease') || lowerQuestion.includes('fungus')) {
      return "Common plant diseases and treatment: 1) Fungal: Use Mancozeb or Copper oxychloride 2) Bacterial: Streptocyclin spray 3) Viral: Remove infected plants immediately 4) Prevention: Proper spacing, avoid overhead watering 5) Organic: Neem cake, Trichoderma 6) Always spray in evening hours. Can you describe the symptoms you're seeing?";
    }
    
    if (lowerQuestion.includes('water') || lowerQuestion.includes('irrigation')) {
      return "Smart irrigation practices: 1) Critical stages: Flowering and fruit setting need more water 2) Drip irrigation saves 30-50% water 3) Water early morning or evening 4) Check soil moisture 2-3 inches deep 5) Mulching reduces water loss 6) Avoid waterlogging - ensure drainage. What's your current irrigation method?";
    }
    
    if (lowerQuestion.includes('market') || lowerQuestion.includes('price')) {
      return "Market price guidance: 1) Check daily mandi rates on eNAM portal 2) Harvest timing affects prices significantly 3) Storage can help wait for better prices 4) Direct marketing to reduce middleman costs 5) Value addition increases profits 6) Contract farming ensures price stability. Which crop's market info do you need?";
    }
    
    if (lowerQuestion.includes('seed') || lowerQuestion.includes('variety')) {
      return "Seed selection tips: 1) Use certified seeds for better yield 2) Choose varieties suited for your climate 3) Hybrid varieties give higher yield but can't save seeds 4) Local varieties are climate-adapted 5) Seed treatment with fungicide prevents diseases 6) Store seeds in cool, dry place. What crop are you planning to grow?";
    }
    
    if (lowerQuestion.includes('soil') || lowerQuestion.includes('ph')) {
      return "Soil management advice: 1) Test soil pH - most crops prefer 6.0-7.5 2) Add lime for acidic soil, gypsum for alkaline 3) Increase organic matter with compost 4) Deep ploughing improves soil structure 5) Green manuring adds nitrogen naturally 6) Avoid continuous monocropping. Have you done a recent soil test?";
    }
    
    if (lowerQuestion.includes('organic') || lowerQuestion.includes('natural')) {
      return "Organic farming practices: 1) Compost and vermicompost for nutrients 2) Neem-based pesticides for pest control 3) Crop rotation prevents diseases 4) Beneficial insects as natural predators 5) Green manuring with legumes 6) Mulching conserves moisture 7) Takes 2-3 years for full transition. Which aspect interests you most?";
    }
    
    if (lowerQuestion.includes('weather') || lowerQuestion.includes('rain')) {
      return "Weather-based farming: 1) Monitor 7-day weather forecast regularly 2) Postpone spraying before rain 3) Provide drainage during heavy rains 4) Cover crops during hailstorm 5) Increase irrigation during dry spells 6) Harvest before predicted rains. IMD and private weather apps provide good forecasts.";
    }
    
    return "I'm your AgriAI assistant with deep knowledge in Indian farming. I can provide specific advice on: Crop selection, Pest & disease management, Fertilizer recommendations, Irrigation scheduling, Market prices, Government schemes, Organic farming, Soil health, Weather-based decisions. Please ask about any specific farming challenge you're facing!";
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user" as const,
      message: newMessage,
      timestamp: new Date()
    };

    const botResponse = {
      id: messages.length + 2,
      type: "bot" as const,
      message: getAIResponse(newMessage),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setNewMessage("");
  };

  const quickQuestions = [
    "How to control aphids organically?",
    "Best fertilizer for vegetative growth?",
    "Fungal disease treatment methods",
    "Water management in drip irrigation",
    "Market price trends for tomatoes",
    "Organic pest control methods",
    "Soil pH management techniques",
    "Weather-based farming decisions"
  ];

  if (showAITwin) {
    return <AgriAITwin />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <MessageCircle className="w-8 h-8 text-primary" />
          AI Farming Assistant
        </h2>
        <p className="text-muted-foreground">
          Ask me anything about farming in Tamil or English
        </p>
        <Button 
          onClick={() => setShowAITwin(true)}
          variant="outline"
          size="lg"
          className="mt-4 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20"
        >
          <Brain className="w-5 h-5 mr-2" />
          Launch Agri AI Twin
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Chat with AgriAI</CardTitle>
          <CardDescription>
            Get instant answers to your farming questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto space-y-3 border rounded-lg p-4 bg-muted/30">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.type === 'bot' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                }`}>
                  {msg.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  msg.type === 'bot' 
                    ? 'bg-card text-card-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewMessage(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask your farming question here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              variant="nav"
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};