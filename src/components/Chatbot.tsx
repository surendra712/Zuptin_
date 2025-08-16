import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageCircle } from 'lucide-react';

interface ChatbotProps {
  onSendMessage: (message: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onSendMessage }) => {
  const [currentStep, setCurrentStep] = useState('start');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const chatbotFlow = {
    start: {
      message: "Hi! 👋 I'm the Zuptin Support Bot. How can I help you today?",
      options: ["Know about features", "Get help", "Report an issue"]
    },
    "Know about features": {
      message: "Here are Zuptin's main features:\n1️⃣ Update your profile easily\n2️⃣ Change password anytime\n3️⃣ Manage your account settings\n4️⃣ Access quick support options",
      options: ["Back to menu"]
    },
    "Get help": {
      message: "What do you need help with?",
      options: ["Reset password", "Update email", "Delete account", "Back to menu"]
    },
    "Reset password": {
      message: "To reset your password, go to the login page, click 'Forgot Password?', and follow the email instructions.",
      options: ["Back to help", "Back to menu"]
    },
    "Update email": {
      message: "Go to 'Settings', choose 'Update Email', enter your new email, and verify it.",
      options: ["Back to help", "Back to menu"]
    },
    "Delete account": {
      message: "Go to 'Settings', click 'Delete Account', and confirm. This action is permanent.",
      options: ["Back to help", "Back to menu"]
    },
    "Report an issue": {
      message: "Please describe your issue below and submit. Our team will get back to you.",
      form: true,
      options: ["Back to menu"]
    }
  };

  const handleOptionClick = (option: string) => {
    if (option === "Back to menu") {
      setCurrentStep('start');
    } else if (option === "Back to help") {
      setCurrentStep('Get help');
    } else {
      setCurrentStep(option);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Issue Report:\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
    onSendMessage(message);
    setFormData({ name: '', email: '', message: '' });
    setCurrentStep('start');
  };

  const currentFlow = chatbotFlow[currentStep as keyof typeof chatbotFlow];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Zuptin Support Bot</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm whitespace-pre-line">{currentFlow.message}</p>
          </div>

          {currentFlow.form ? (
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Textarea
                placeholder="Describe your issue..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
              />
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Issue
              </Button>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {currentFlow.options.map((option: string) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  onClick={() => handleOptionClick(option)}
                  className="w-full justify-start"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
