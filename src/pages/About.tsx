import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Mail, Lock } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: User,
      title: "Profile Management",
      description: "Update your personal details and profile photo with ease."
    },
    {
      icon: Lock,
      title: "Account Security",
      description: "Change your password or email anytime, with top-level encryption."
    },
    {
      icon: Mail,
      title: "Quick Support",
      description: "Access FAQs, chatbot help, or contact us directly from your dashboard."
    },
    {
      icon: Shield,
      title: "Data Privacy",
      description: "Your data is yours — always secure, never sold."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              About Zuptin
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Zuptin is a secure, modern, and user-friendly platform designed to simplify account management and customer support. We provide tools that let users easily update profiles, change passwords, manage account preferences, and connect with our support team instantly.
            </p>
          </div>

          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
                <CardDescription>
                  To deliver a seamless digital experience that's fast, reliable, and focused on user privacy.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">
              Zuptin is more than just an account management system — it's your secure gateway to better digital interactions.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
