import { useState } from "react";
import { MessageCircle, X, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuestionCategory {
  title: string;
  emoji: string;
  questions: string[];
}

const questionCategories: QuestionCategory[] = [
  {
    title: "Weather Questions",
    emoji: "🌤️",
    questions: [
      "Can I go jogging right now?",
      "Will it rain in the next hour?",
      "Is it too hot outside?",
      "What's the UV index near me?",
      "How windy is it today?",
      "Is it safe to go cycling now?",
      "What's the temperature in Abu Dhabi?",
      "Do I need sunglasses now?",
      "Is it humid in Sharjah right now?",
      "What's the air quality index?"
    ]
  },
  {
    title: "Outdoor Activity & Lifestyle",
    emoji: "🏃‍♂️",
    questions: [
      "Can I jog in Abu Dhabi Marina?",
      "Is it too humid for outdoor workouts?",
      "Should I wear a cap now?",
      "Can I go hiking in Hatta?",
      "Is it safe to go swimming now?",
      "Should I postpone my run due to heat?",
      "Is it sunny enough for photography?",
      "Can I take my dog for a walk now?",
      "Is it a good time for outdoor yoga?",
      "Should I go for a bike ride today?"
    ]
  },
  {
    title: "Traffic & Roads",
    emoji: "🚦",
    questions: [
      "How's traffic on Sheikh Zayed Road?",
      "Is there traffic in Dubai Marina?",
      "Are there road closures in Abu Dhabi?",
      "How long to reach Dubai Mall from Downtown?",
      "Is it busy near Al Maktoum Airport?",
      "Is there construction on Sheikh Khalifa Road?",
      "Any accidents reported today?",
      "How's traffic near Mall of the Emirates?",
      "Are the roads wet right now?",
      "Is it a good time to commute to Abu Dhabi?"
    ]
  }
];

const ClimaBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm ClimaBot 🤖 Your AI weather and traffic assistant for UAE.\n\nClick on any question below to get started, or type your own!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (questionText?: string) => {
    const messageToSend = questionText || input.trim();
    if (!messageToSend || isLoading) return;

    setInput("");
    setShowQuestions(false);
    setMessages(prev => [...prev, { role: "user", content: messageToSend }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('climabot-chat', {
        body: { message: messageToSend }
      });

      if (error) {
        console.error('Supabase function error:', error);
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "⚠️ Connection error. Please check your internet connection and try again."
        }]);
        return;
      }

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.response || "I'm having trouble responding right now. Please try again."
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to get response. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover-glow z-50"
        style={{ boxShadow: 'var(--shadow-glow)' }}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] glass-card flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">ClimaBot</h3>
                <p className="text-xs text-muted-foreground">AI Assistant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuestions(!showQuestions)}
                className="h-8 w-8"
              >
                {showQuestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preloaded Questions */}
          {showQuestions && (
            <div className="border-b border-border/50 bg-background/50 max-h-64 overflow-y-auto">
              <div className="p-3 space-y-2">
                {questionCategories.map((category, catIdx) => (
                  <div key={catIdx} className="space-y-1">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === catIdx ? null : catIdx)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent/20 transition-colors text-left"
                    >
                      <span className="text-xs font-semibold flex items-center gap-2">
                        <span>{category.emoji}</span>
                        {category.title}
                      </span>
                      {expandedCategory === catIdx ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                    {expandedCategory === catIdx && (
                      <div className="space-y-1 pl-2">
                        {category.questions.slice(0, 5).map((question, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleQuestionClick(question)}
                            className="w-full text-left text-xs p-2 rounded hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground"
                            disabled={isLoading}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 bg-background/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about weather or traffic..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={() => sendMessage()} disabled={isLoading} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClimaBot;
