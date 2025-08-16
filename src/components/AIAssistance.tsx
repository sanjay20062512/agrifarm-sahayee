import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User } from "lucide-react";

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
      message: "Thank you for your question! In a full implementation, I would provide detailed, location-specific advice about your farming query. I can help with crop selection, disease identification, fertilizer recommendations, irrigation schedules, market prices, and government schemes.",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setNewMessage("");
  };

  const quickQuestions = [
    "What crops are best for monsoon season?",
    "How to control aphids organically?",
    "When should I apply fertilizer?",
    "Current market prices for wheat",
    "Government subsidies available"
  ];

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