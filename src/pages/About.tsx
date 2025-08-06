import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">About Zuptin</h1>
          <p className="text-lg text-muted-foreground">
            Coming soon! Learn more about our mission to revolutionize food and grocery delivery.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;