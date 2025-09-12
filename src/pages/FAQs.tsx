import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const faqs = [
    {
      question: "What is Zuptin?",
      answer: "Zuptin is a platform for secure and easy account management, profile updates, and customer support."
    },
    {
      question: "Is Zuptin free to use?",
      answer: "Yes! Zuptin is free for all users."
    },
    {
      question: "How do I create an account?",
      answer: "Click 'Sign Up' on the homepage, enter your details, and you're in instantly."
    },
    {
      question: "How do I update my profile details?",
      answer: "Go to your dashboard, click 'Edit Profile', make changes, and save."
    },
    {
      question: "How can I change my email?",
      answer: "In the settings page, choose 'Update Email', enter your new email, and it updates instantly."
    },
    {
      question: "How do I reset my password?",
      answer: "Go to Settings → Change Password and update it instantly."
    },
    {
      question: "How do I delete my account?",
      answer: "Go to 'Settings', click 'Delete Account', and confirm."
    },
    {
      question: "How does Zuptin protect my data?",
      answer: "We use industry-standard encryption and never share your data with third parties."
    },
    {
      question: "How do I contact support?",
      answer: "You can use the contact form or our chatbot to reach us."
    },
    {
      question: "How quickly will support respond?",
      answer: "Usually within 24–48 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about Zuptin
            </p>
          </div>

          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQs;
