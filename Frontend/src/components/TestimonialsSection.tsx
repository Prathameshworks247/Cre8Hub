
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content: "CRE8HUB has completely transformed how I create and manage my content. The AI suggestions are spot-on!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b79bcf48?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Mike Chen",
    role: "Entrepreneur",
    content: "The analytics and insights have helped me grow my audience by 300% in just 3 months. Incredible platform!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Emily Rodriguez",
    role: "Social Media Manager",
    content: "Managing multiple clients has never been easier. The automation features save me hours every week.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            What Our
            <span className="bg-gradient-to-r from-cre8-blue to-cre8-purple bg-clip-text text-transparent">
              {" "}Creators Say
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of creators who have transformed their content strategy with CRE8HUB.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-cre8-dark/50 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-cre8-blue/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
