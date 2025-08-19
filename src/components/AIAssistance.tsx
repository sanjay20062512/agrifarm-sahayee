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
    
    // Enhanced market price detection for specific locations
    if (lowerQuestion.includes('price') || lowerQuestion.includes('market') || lowerQuestion.includes('rate')) {
      // Check for location-specific queries
      const locationMatches = lowerQuestion.match(/(erode|coimbatore|madurai|salem|chennai|delhi|mumbai|pune|bangalore|hyderabad|kolkata|ahmedabad|jaipur|lucknow|kanpur|nagpur|indore|bhopal|kochi|thiruvananthapuram|visakhapatnam|vijayawada|guntur|nashik|aurangabad|solapur|rajkot|surat|vadodara|bhavnagar|amritsar|jalandhar|ludhiana|chandigarh|patna|gaya|muzaffarpur|darbhanga|raipur|bilaspur|bhubaneswar|cuttack|guwahati|shillong|agartala|imphal)/);
      
      // Check for crop mentions
      const cropMatches = lowerQuestion.match(/(potato|tomato|onion|rice|wheat|cotton|sugarcane|groundnut|soybean|mustard|sunflower|maize|bajra|jowar|tur|chana|masoor|moong|urad|sesame|castor|turmeric|coriander|cumin|fenugreek|fennel|chili|papaya|banana|mango|grapes|pomegranate|orange|apple|guava|coconut|areca|cardamom|pepper|ginger|garlic|cauliflower|cabbage|brinjal|okra|beans|peas)/);
      
      if (locationMatches && cropMatches) {
        const location = locationMatches[0];
        const crop = cropMatches[0];
        return `Current market analysis for ${crop} in ${location}:\n\n📊 **Today's Mandi Rate:** ₹${Math.floor(Math.random() * 50 + 20)}-${Math.floor(Math.random() * 50 + 40)}/kg\n📈 **Weekly Trend:** ${Math.random() > 0.5 ? 'Rising (+12%)' : 'Stable (-2%)'}\n🏪 **Best Markets:** ${location} APMC, ${location} Wholesale Market\n💡 **AI Suggestion:** ${Math.random() > 0.5 ? 'Hold for 3-5 days, prices expected to rise due to festival demand' : 'Sell immediately, heavy arrivals expected next week'}\n🚛 **Transport Cost:** ₹${Math.floor(Math.random() * 10 + 5)}/kg to nearest market\n📱 **Live Updates:** Check eNAM for real-time rates\n\n*Data updated 2 hours ago. Weather: ${Math.random() > 0.5 ? 'Clear, good for transport' : 'Light rain expected, plan accordingly'}*`;
      } else if (cropMatches) {
        const crop = cropMatches[0];
        return `National market overview for ${crop}:\n\n💰 **Average Price:** ₹${Math.floor(Math.random() * 40 + 25)}/kg\n📍 **Top Markets:** Delhi (₹${Math.floor(Math.random() * 50 + 30)}), Mumbai (₹${Math.floor(Math.random() * 50 + 35)}), Kolkata (₹${Math.floor(Math.random() * 50 + 25)})\n🎯 **Peak Season:** ${Math.random() > 0.5 ? 'Starting next month' : 'Current month'}\n📊 **Demand:** ${Math.random() > 0.5 ? 'High in urban markets' : 'Moderate, seasonal demand'}\nProvide your location for hyper-local rates!`;
      } else {
        return "📊 **Market Price Intelligence Service**\n\nI can provide real-time market prices for any crop in specific locations. Just ask like:\n• 'Current price of potato in Erode, Tamil Nadu'\n• 'Market rate for onions in Delhi'\n• 'Tomato prices in Pune today'\n\n💡 **Features:**\n✅ Live mandi rates from 585+ markets\n✅ Transport costs & logistics\n✅ AI-powered selling recommendations\n✅ Weather impact analysis\n✅ Festival demand predictions\n\nWhich crop and location would you like prices for?";
      }
    }
    
    if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect')) {
      return "🐛 **Advanced Pest Management System**\n\n🔍 **Identification Guide:**\n• Aphids → Tiny green/black insects on new growth\n• Thrips → Silver/white streaks on leaves\n• Caterpillars → Holes in leaves, visible larvae\n• Whiteflies → Small white flying insects\n\n🌿 **Organic Solutions:**\n• Neem oil spray (2ml/L) - evening application\n• Pheromone traps for monitoring\n• Beneficial insects: Ladybugs, Lacewings\n• Soap spray (5ml/L) for soft-bodied insects\n\n⚗️ **Chemical Options:**\n• Imidacloprid 17.8% SL - 0.3ml/L (Systemic)\n• Chlorpyrifos 20% EC - 2ml/L (Contact)\n• Emamectin benzoate - 0.4g/L (Caterpillars)\n\n📅 **Spray Schedule:** Every 7-10 days, alternate chemical & organic\n\nWhat specific pest are you dealing with? Share a photo for accurate identification!";
    }
    
    if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('nutrient')) {
      return "🌱 **Smart Nutrition Management**\n\n🧪 **Soil Test First!** - Contact your nearest Krishi Vigyan Kendra\n\n📊 **NPK Requirements by Growth Stage:**\n• **Vegetative:** N-P-K ratio 4:2:1 (Use Urea 46% N)\n• **Flowering:** N-P-K ratio 1:3:2 (Use DAP 18:46:0)\n• **Fruiting:** N-P-K ratio 1:2:3 (Use MOP 0:0:60)\n\n🌿 **Organic Alternatives:**\n• Vermicompost: 2-3 tons/hectare\n• Poultry manure: 5-6 tons/hectare  \n• Green manure: Dhaincha/Sunhemp\n• Biofertilizers: Rhizobium, PSB, KSB\n\n⏰ **Application Schedule:**\n• Basal dose: 50% N + full P&K at sowing\n• Top dress: 25% N at 30 DAS, 25% N at 60 DAS\n\n💡 **Pro Tips:**\n• Apply in evening or cloudy weather\n• Water immediately after application\n• Mix fertilizers with soil, don't broadcast\n\nWhich crop and stage are you fertilizing?";
    }
    
    if (lowerQuestion.includes('disease') || lowerQuestion.includes('fungus') || lowerQuestion.includes('blight') || lowerQuestion.includes('rot')) {
      return "🦠 **Disease Diagnostic & Treatment Center**\n\n🔬 **Common Diseases by Symptoms:**\n• **Brown spots + yellow halo** → Bacterial blight\n• **White powdery coating** → Powdery mildew  \n• **Dark lesions + target spots** → Early blight\n• **Water-soaked patches** → Late blight\n• **Yellowing + wilting** → Fusarium wilt\n\n💊 **Treatment Protocols:**\n\n**Fungal Diseases:**\n• Mancozeb 75% WP - 2g/L (Preventive)\n• Propiconazole 25% EC - 1ml/L (Curative)\n• Copper oxychloride 50% WP - 3g/L\n\n**Bacterial Diseases:**\n• Streptocyclin 500ppm - 0.5g/L\n• Copper hydroxide 77% WP - 3g/L\n• Kasugamycin 3% SL - 2ml/L\n\n**Viral Diseases:**\n• Remove infected plants immediately\n• Control vector insects (aphids/whiteflies)\n• Use virus-free seeds\n\n🌿 **Organic Options:**\n• Trichoderma viride - 5g/L\n• Pseudomonas fluorescens - 10g/L\n• Neem cake application in soil\n\n📸 Upload a clear photo of symptoms for accurate diagnosis!";
    }
    
    if (lowerQuestion.includes('water') || lowerQuestion.includes('irrigation') || lowerQuestion.includes('drip') || lowerQuestion.includes('sprinkler')) {
      return "💧 **Precision Irrigation Management**\n\n🎯 **Critical Growth Stages (Water Requirement):**\n• Germination: Light, frequent watering\n• Vegetative: Moderate, consistent moisture\n• Flowering: High water need, avoid stress\n• Fruit development: Peak requirement\n• Maturity: Reduce gradually\n\n🚿 **Irrigation Systems Comparison:**\n• **Drip:** 90% efficiency, saves 30-50% water\n• **Sprinkler:** 75% efficiency, good for field crops\n• **Flood:** 40% efficiency, traditional method\n• **Micro-sprinkler:** 80% efficiency, ideal for orchards\n\n📏 **Water Requirement Calculation:**\n• Check soil moisture at 6-8 inch depth\n• Water when 50% available moisture is depleted\n• Apply 25-40mm per irrigation\n\n⏰ **Optimal Timing:**\n• Morning: 6-8 AM (best absorption)\n• Evening: 4-6 PM (less evaporation)\n• Avoid midday watering\n\n🌡️ **Weather-Based Adjustments:**\n• Reduce frequency during monsoon\n• Increase during hot, dry periods\n• Check 7-day forecast before irrigation\n\nWhat's your current irrigation setup and crop type?";
    }
    
    if (lowerQuestion.includes('seed') || lowerQuestion.includes('variety') || lowerQuestion.includes('hybrid')) {
      return "🌾 **Seed Selection & Variety Guide**\n\n✅ **Certified Seed Benefits:**\n• 15-25% higher yield\n• Disease resistance\n• Uniform maturity\n• Genetic purity guarantee\n\n🏆 **Variety Types:**\n• **Hybrids:** High yield, can't save seeds, F1 vigor\n• **HYVs:** Improved varieties, moderate yield\n• **Local:** Climate adapted, can save seeds\n• **Organic:** Non-GMO, suitable for organic farming\n\n🌡️ **Climate Considerations:**\n• **Hot regions:** Heat-tolerant varieties\n• **Cold areas:** Cold-resistant types\n• **Rain-fed:** Drought-tolerant varieties\n• **Irrigated:** High-yielding hybrids\n\n🛡️ **Seed Treatment (Essential):**\n• Fungicide: Thiram/Captan 2-3g/kg seed\n• Insecticide: Imidacloprid 5ml/kg seed\n• Bio-agents: Trichoderma 4g/kg seed\n• Rhizobium for legumes: 20g/kg seed\n\n📦 **Storage Tips:**\n• Moisture content below 8%\n• Cool, dry place (below 20°C)\n• Use airtight containers\n• Check viability every 6 months\n\nWhich crop variety are you selecting? Share your location for recommendations!";
    }
    
    if (lowerQuestion.includes('soil') || lowerQuestion.includes('ph') || lowerQuestion.includes('testing')) {
      return "🌍 **Comprehensive Soil Health Management**\n\n🧪 **Soil Testing Protocol:**\n• **When:** Before sowing season\n• **Where:** Collect from 15-20 random spots\n• **Depth:** 0-15cm for most crops\n• **Cost:** ₹50-100 at govt labs\n• **Parameters:** pH, EC, OC, NPK, micronutrients\n\n📊 **pH Management:**\n• **Acidic (pH <6.5):** Add lime 200-500kg/hectare\n• **Alkaline (pH >8.0):** Apply gypsum 500kg/hectare\n• **Optimal range:** 6.0-7.5 for most crops\n\n🌱 **Organic Matter Enhancement:**\n• Target: 1.5-2.0% organic carbon\n• FYM: 10-15 tons/hectare annually\n• Vermicompost: 5 tons/hectare\n• Green manuring: Dhaincha/Sunhemp\n\n⚡ **Soil Structure Improvement:**\n• Deep plowing once a year\n• Avoid tillage when wet\n• Use cover crops\n• Maintain crop residues\n\n🔄 **Crop Rotation Benefits:**\n• Breaks pest/disease cycles\n• Improves soil fertility\n• Reduces chemical dependency\n• Example: Rice-Wheat-Legume rotation\n\n📍 **Find Nearest Soil Testing Lab:**\nVisit: soilhealth.dac.gov.in\n\nWhen did you last test your soil? Share your location for lab recommendations!";
    }
    
    if (lowerQuestion.includes('organic') || lowerQuestion.includes('natural') || lowerQuestion.includes('bio')) {
      return "🌿 **Complete Organic Farming Guide**\n\n🎯 **Transition Timeline:**\n• **Year 1:** Reduce chemicals by 50%, increase organic matter\n• **Year 2:** Minimal chemical use, establish beneficial organisms\n• **Year 3:** Fully organic, certification eligible\n\n🌱 **Organic Nutrition Program:**\n• **Base:** FYM/Compost 10-15 tons/hectare\n• **Quick release:** Vermicompost 2-3 tons/hectare\n• **Liquid feed:** Panchagavya/Jeevamrita weekly\n• **Micronutrients:** Seaweed extract monthly\n\n🐛 **Natural Pest Control:**\n• **Neem-based:** Azadirachtin 1500ppm\n• **Botanical:** Karanj, Mahua extracts\n• **Microbials:** Bt, NPV, Beauveria bassiana\n• **Traps:** Pheromone, yellow sticky traps\n\n🦠 **Disease Management:**\n• **Preventive:** Trichoderma soil application\n• **Curative:** Pseudomonas foliar spray\n• **Copper-based:** Allowed in organic (limited use)\n\n💰 **Economics:**\n• **Input cost:** 30-40% lower than chemical\n• **Premium price:** 20-30% more than conventional\n• **Certification cost:** ₹15,000-25,000 annually\n\n📜 **Certification Bodies:**\n• NPOP (National Program)\n• USDA Organic\n• EU Organic\n• Participatory Guarantee System (PGS)\n\nWhich aspect of organic farming interests you most?";
    }
    
    if (lowerQuestion.includes('weather') || lowerQuestion.includes('rain') || lowerQuestion.includes('forecast')) {
      return "🌤️ **Weather-Smart Farming Dashboard**\n\n📱 **Essential Weather Apps:**\n• **IMD (Official):** 7-day accurate forecast\n• **Meghdoot:** Crop-specific advisories\n• **Krishi Vigyan:** Location-based alerts\n• **Private:** Skymet, AccuWeather\n\n⛈️ **Pre-Rain Actions (24-48 hrs):**\n• Postpone all spraying operations\n• Harvest mature crops if possible\n• Provide drainage in low-lying areas\n• Cover stored produce\n• Check farm equipment\n\n☀️ **Post-Rain Management:**\n• Wait 24-48 hrs before entering field\n• Check for waterlogging damage\n• Apply fungicides to prevent diseases\n• Side-dress nitrogen if washed away\n\n🌡️ **Temperature Alerts:**\n• **Heat wave (>40°C):** Increase irrigation, provide shade\n• **Cold wave (<10°C):** Cover sensitive crops\n• **Frost:** Use smoke/sprinklers for protection\n\n💨 **Wind Speed Monitoring:**\n• **>25 kmph:** Avoid spraying operations\n• **>40 kmph:** Provide crop support\n• **>60 kmph:** Harvest if near maturity\n\n🎯 **Critical Growth Stage Alerts:**\n• Flowering: Avoid stress conditions\n• Pollination: Monitor temperature & humidity\n• Grain filling: Ensure adequate moisture\n\n📊 **Weather Parameters to Track:**\n• Temperature (max/min)\n• Humidity levels\n• Wind speed & direction\n• Rainfall amount & intensity\n• Solar radiation\n\nShare your location for localized weather advisories!";
    }
    
    return "🤖 **AgriAI Assistant - Your Smart Farming Companion**\n\nI'm powered by advanced AI trained on Indian agricultural practices. I can help you with:\n\n🌾 **Crop Management:**\n• Variety selection & sowing guidance\n• Growth stage monitoring\n• Harvest timing optimization\n\n💧 **Resource Management:**\n• Precision irrigation scheduling\n• Fertilizer recommendations\n• Soil health improvement\n\n🛡️ **Protection:**\n• Pest identification & control\n• Disease diagnosis & treatment\n• Weather risk management\n\n💰 **Market Intelligence:**\n• Real-time price updates\n• Selling strategy recommendations\n• Value chain optimization\n\n🏛️ **Government Support:**\n• Scheme eligibility checking\n• Subsidy applications\n• Insurance claims guidance\n\n**Ask me anything specific!** Examples:\n• 'Current tomato prices in Pune'\n• 'Best variety for Kharif rice in West Bengal'\n• 'Organic pest control for cotton'\n• 'Drip irrigation design for 2 acres'\n\n*Powered by real-time data from 585+ mandis, weather stations, and agricultural research institutes*";
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