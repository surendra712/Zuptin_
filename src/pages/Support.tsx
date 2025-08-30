import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { sendEmail } from '@/lib/emailjs';
import Chatbot from '@/components/Chatbot';
import { MessageCircle } from 'lucide-react';

const Support = () => {
  const { toast } = useToast();

  const handleChatMessage = async (message: string) => {
    try {
      if (message.startsWith('Issue Report:')) {
        const lines = message.split('\n');
        const name = lines[1]?.replace('Name: ', '') || '';
        const email = lines[2]?.replace('Email: ', '') || '';
        const issueMessage = lines[3]?.replace('Message: ', '') || '';

        const result = await sendEmail({
          name,
          email,
          message: issueMessage,
          subject: 'Support Chat Issue Report'
        });

        if (result.success) {
          toast({
            title: "Message Sent!",
            description: "Your issue has been reported successfully. We'll get back to you soon.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to send message. Please try again later.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Customer Support</h1>
            <p className="text-lg text-muted-foreground">
              We're here to help! Get instant support with our AI-powered chat assistant.
            </p>
          </div>

          <div className="flex justify-center">
            <Chatbot onSendMessage={handleChatMessage} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
