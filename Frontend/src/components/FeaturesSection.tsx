
import { Brain, BarChart3, Users, Zap, Target, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Content Optimization",
    description: "Let our advanced AI analyze and optimize your content for maximum engagement and reach."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get deep insights into your audience behavior and content performance with detailed analytics."
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Connect with fellow creators and build a strong community around your brand."
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description: "Streamline your content creation process with intelligent automation tools."
  },
  {
    icon: Target,
    title: "Audience Targeting",
    description: "Reach the right audience at the right time with precision targeting capabilities."
  },
  {
    icon: Shield,
    title: "Brand Protection",
    description: "Protect your brand identity and maintain consistency across all platforms."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-cre8-blue to-cre8-purple bg-clip-text text-transparent">
              {" "}Creative Success
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to create, optimize, and grow your digital presence in one comprehensive platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-cre8-dark/50 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-cre8-blue/50 transition-all duration-300 group"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-cre8-blue to-cre8-purple p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
