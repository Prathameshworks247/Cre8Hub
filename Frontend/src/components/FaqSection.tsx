
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is CRE8HUB and how does it work?",
    answer: "CRE8HUB is an AI-powered platform designed to help content creators, entrepreneurs, and social media managers optimize their content and grow their audience. Our advanced AI analyzes your content, provides optimization suggestions, and offers insights to improve engagement and reach."
  },
  {
    question: "Do I need technical skills to use CRE8HUB?",
    answer: "Not at all! CRE8HUB is designed to be user-friendly and accessible to creators of all technical levels. Our intuitive interface and AI-powered suggestions make it easy to optimize your content without any coding or technical knowledge."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, you'll continue to have access to your plan features until the end of your current billing period."
  },
  {
    question: "What types of content does CRE8HUB support?",
    answer: "CRE8HUB supports various types of content including social media posts, blog articles, videos, images, and more. Our AI is trained to understand different content formats and provide relevant optimization suggestions for each type."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a free plan that includes basic features to help you get started. You can explore our platform and see how it works before deciding to upgrade to a paid plan."
  },
  {
    question: "How does the AI optimization work?",
    answer: "Our AI analyzes your content using advanced machine learning algorithms to identify patterns that drive engagement. It considers factors like timing, hashtags, content structure, audience preferences, and trending topics to provide personalized optimization suggestions."
  }
];

const FaqSection = () => {
  return (
    <section className="py-20 ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked
            <span className="bg-gradient-to-r from-cre8-blue to-cre8-purple bg-clip-text text-transparent">
              {" "}Questions
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about CRE8HUB and how it can help you succeed.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-cre8-dark/50 backdrop-blur-lg border border-white/10 rounded-xl px-6 hover:border-cre8-blue/50 transition-all duration-300"
            >
              <AccordionTrigger className="text-white hover:text-cre8-blue text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
