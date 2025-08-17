
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center  overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gray-800" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl  font-abril text-white leading-tight">
            Unleash Your
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 font-abril bg-clip-text text-transparent">
              {" "}Creative Potential
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            CRE8HUB combines AI-powered tools and insights to help digital creators optimize their content and grow their audience like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/signup">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90  text-lg px-8 py-6">
                Start Creating Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="rounded-full border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="pt-12">
            <p className="text-sm text-gray-400 mb-4">Trusted by creators worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-white font-semibold">10K+ Creators</div>
              <div className="text-white font-semibold">50M+ Content Pieces</div>
              <div className="text-white font-semibold">99% Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
