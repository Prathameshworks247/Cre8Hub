
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Basic content optimization",
      "5 AI suggestions per month",
      "Basic analytics",
      "Community access"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Creator",
    price: "₹499",
    period: "per month",
    description: "Best for individual creators",
    features: [
      "Advanced AI optimization",
      "Unlimited AI suggestions",
      "Advanced analytics & insights",
      "Priority community access",
      "Content scheduling",
      "Brand protection tools"
    ],
    buttonText: "Start Creating",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Pro",
    price: "₹999",
    period: "per month",
    description: "For teams and agencies",
    features: [
      "Everything in Creator",
      "Team collaboration tools",
      "White-label solutions",
      "Advanced automation",
      "Custom integrations",
      "Dedicated support",
      "Multi-account management"
    ],
    buttonText: "Go Pro",
    buttonVariant: "default" as const,
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Simple,
            <span className="bg-gradient-to-r from-cre8-blue to-cre8-purple bg-clip-text text-transparent">
              {" "}Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your creative journey. Start free and upgrade as you grow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-cre8-dark/50 backdrop-blur-lg border rounded-xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "border-cre8-blue shadow-2xl shadow-cre8-blue/20"
                  : "border-white/10 hover:border-cre8-blue/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cre8-blue to-cre8-purple px-4 py-1 rounded-full text-white text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-cre8-blue mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/signup" className="block">
                <Button 
                  className={`w-full ${
                    plan.buttonVariant === "outline"
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "bg-gradient-to-r from-cre8-blue to-cre8-purple hover:opacity-90"
                  }`}
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
