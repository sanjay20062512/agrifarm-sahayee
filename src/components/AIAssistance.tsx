import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  type: "bot" | "user";
  message: string;
  timestamp: Date;
}

export const AIAssistance = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      message: "🌾 Namaste! I'm your AI Farming Assistant powered by advanced AI. I can help with:\n\n💰 Crop prices and market trends\n🌦️ Weather-based advice\n🌱 Crop recommendations\n🐛 Disease diagnosis\n📊 Soil management\n🌿 Organic farming tips\n💼 Government schemes\n\nAsk me anything about farming!",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      message: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistance', {
        body: { 
          question: newMessage,
          context: `You are helping a farmer in India. Provide practical, actionable advice.`
        }
      });

      if (error) {
        console.error('AI assistance error:', error);
        throw error;
      }

      const botMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        message: data.answer || "I'm sorry, I couldn't process that request. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error calling AI assistance:', error);
      
      let errorMessage = "I'm having trouble connecting right now. Please try again.";
      
      if (error.message?.includes('429')) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.message?.includes('402')) {
        errorMessage = "AI service temporarily unavailable. Please try again later.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      const errorBotMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        message: errorMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageCircle className="h-6 w-6 text-primary" />
            AI Farming Assistant
          </CardTitle>
          <CardDescription>
            Get instant answers powered by advanced AI. Ask about crops, diseases, weather, markets, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 mb-6 h-[500px] overflow-y-auto rounded-lg border p-4 bg-muted/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.type === "bot" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}>
                    {msg.type === "bot" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                  <div
                    className={`rounded-lg p-4 ${
                      msg.type === "bot"
                        ? "bg-card border border-border"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                    <p className={`text-xs mt-2 ${msg.type === "bot" ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="rounded-lg p-4 bg-card border border-border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">Thinking...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask about crops, diseases, prices, weather..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
