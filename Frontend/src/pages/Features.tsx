import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  Rocket,
  PenLine,
  Sparkles,
  Share2,
  FileText,
  LayoutGrid,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const flowSteps = [
  {
    id: "create",
    title: "Create & Collaborate",
    description: "Build your project in Cre8Hub — design, campaign, content, or product idea. Work alone or with your team.",
    icon: PenLine,
  },
  {
    id: "launch-ready",
    title: "Mark as “Launch-Ready”",
    description: "One click: Boost This Project. Tell the platform you’re ready to promote.",
    icon: Rocket,
    cta: "Boost This Project",
  },
  {
    id: "boost",
    title: "cre8Boost Activates",
    description: "The platform generates a polished promo preview, suggests captions, hooks, and formats, and optimizes visuals for each channel.",
    icon: Sparkles,
  },
  {
    id: "distribute",
    title: "Distribute Instantly",
    description: "Share to social platforms, publish to the public Cre8Hub showcase, send to brands or collaborators, and track engagement.",
    icon: Share2,
  },
];

const coreFeatures = [
  {
    id: "promo",
    title: "Auto-Generated Promo Assets",
    items: ["Social captions", "Short descriptions", "Taglines", "Hashtag suggestions"],
    icon: FileText,
  },
  {
    id: "multi",
    title: "Multi-Platform Formatting",
    items: ["Instagram", "LinkedIn", "X", "Web embeds"],
    icons: [Instagram, Linkedin, Twitter, Globe],
  },
  {
    id: "showcase",
    title: "Public Cre8Hub Showcase",
    items: ["Featured projects", "Trending creators", "Discovery by brands and collaborators"],
    icon: LayoutGrid,
  },
  {
    id: "insights",
    title: "Performance Insights",
    items: ["Views", "Clicks", "Saves", "Interest from brands/clients"],
    icon: BarChart3,
  },
];

const Features = () => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState<string | null>("create");
  const [expandedFeature, setExpandedFeature] = useState<string | null>("promo");
  const [boostHover, setBoostHover] = useState(false);

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-black overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
            className="absolute w-96 h-96 rounded-full mix-blend-screen filter blur-2xl opacity-30"
            style={{
              top: "-10%",
              left: "-10%",
              background: "radial-gradient(circle, #3b82f6, #1d4ed8)",
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full mix-blend-screen filter blur-2xl opacity-35"
            style={{
              top: "-5%",
              right: "-5%",
              background: "radial-gradient(circle, #8b5cf6, #7c3aed)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Page title */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How Cre8Hub
              <span className="bg-gradient-to-r from-cre8-blue to-cre8-purple bg-clip-text text-transparent">
                {" "}
                Works
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From idea to launch in four steps. Cre8Boost turns your project into shareable, platform-ready content.
            </p>
          </div>

          {/* How It Works – User flow */}
          <section className="mb-24">
            <h2 className="text-xl font-semibold text-cre8-blue mb-2 uppercase tracking-wider">
              How It Works
            </h2>
            <p className="text-gray-400 mb-10">User flow</p>

            <div className="space-y-4">
              {flowSteps.map((step, index) => {
                const isExpanded = expandedStep === step.id;
                const Icon = step.icon;
                return (
                  <Card
                    key={step.id}
                    className="bg-cre8-dark/80 backdrop-blur border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    >
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cre8-blue to-cre8-purple shrink-0">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              Step {index + 1}
                            </span>
                            <ChevronRight
                              className={`h-5 w-5 text-gray-500 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                          <CardTitle className="text-white text-lg mt-0.5">
                            {step.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                    </button>
                    {isExpanded && (
                      <CardContent className="pt-0 pb-6">
                        <p className="text-gray-300 pl-16 pr-4">{step.description}</p>
                        {step.cta && (
                          <div className="pl-16 mt-4">
                            <Button
                              size="lg"
                              className="bg-gradient-to-r from-cre8-blue to-cre8-purple hover:opacity-90 text-white font-semibold gap-2"
                              onMouseEnter={() => setBoostHover(true)}
                              onMouseLeave={() => setBoostHover(false)}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/dashboard");
                              }}
                            >
                              <Rocket
                                className={`h-5 w-5 transition-transform ${
                                  boostHover ? "scale-110" : ""
                                }`}
                              />
                              {step.cta}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Visual connector */}
            <div className="hidden md:flex justify-center gap-2 mt-6">
              {flowSteps.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 max-w-24 rounded-full bg-white/10"
                  style={{
                    backgroundColor:
                      expandedStep === flowSteps[i].id
                        ? "rgba(59, 130, 246, 0.6)"
                        : undefined,
                  }}
                />
              ))}
            </div>
          </section>

          {/* Core Features */}
          <section>
            <h2 className="text-xl font-semibold text-cre8-purple mb-2 uppercase tracking-wider">
              Core Features
            </h2>
            <p className="text-gray-400 mb-10">What cre8Boost delivers</p>

            <div className="grid gap-4 sm:grid-cols-2">
              {coreFeatures.map((feature) => {
                const isExpanded = expandedFeature === feature.id;
                const Icon = feature.icon;
                const hasMultipleIcons = "icons" in feature && feature.icons;
                return (
                  <Card
                    key={feature.id}
                    className="bg-cre8-dark/80 backdrop-blur border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() =>
                        setExpandedFeature(isExpanded ? null : feature.id)
                      }
                    >
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cre8-purple to-cre8-blue shrink-0">
                          {hasMultipleIcons ? (
                            <div className="flex gap-0.5">
                              {(feature as { icons: typeof Instagram[] }).icons
                                .slice(0, 4)
                                .map((Ico, i) => (
                                  <Ico key={i} className="h-4 w-4 text-white" />
                                ))}
                            </div>
                          ) : (
                            <Icon className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                          <CardTitle className="text-white text-base mt-0">
                            {feature.title}
                          </CardTitle>
                          <ChevronDown
                            className={`h-5 w-5 text-gray-500 shrink-0 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CardHeader>
                    </button>
                    {isExpanded && (
                      <CardContent className="pt-0 pb-6">
                        <ul className="pl-16 space-y-2">
                          {feature.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <span className="text-cre8-blue">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>

          {/* CTA strip */}
          <section className="mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-gray-300">
                Ready to boost your project? Start from your dashboard.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-cre8-blue to-cre8-purple hover:opacity-90 text-white gap-2"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Features;
