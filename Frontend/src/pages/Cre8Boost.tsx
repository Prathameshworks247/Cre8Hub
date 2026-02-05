import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Rocket,
  Loader2,
  Copy,
  Check,
  Share2,
  Globe,
  FileText,
  Hash,
  Type,
  Instagram,
  Linkedin,
  Twitter,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_PROJECTS = [
  { id: "1", name: "Morning Routine Hacks", type: "Campaign", updated: "2 days ago" },
  { id: "2", name: "Product Launch – Nova App", type: "Product", updated: "1 week ago" },
  { id: "3", name: "Tutorial Series: Intro to Editing", type: "Content", updated: "3 days ago" },
];

const MOCK_PROMO = {
  caption:
    "Ready to 10x your mornings? 🌅 I spent 30 days testing the top routine hacks — here’s what actually moved the needle. Link in bio for the full breakdown. #productivity #morningroutine #creators",
  shortDescription:
    "A 30-day experiment with the top morning routine tips. What worked, what didn’t, and the one change that made the biggest impact.",
  tagline: "10x your mornings in 30 days.",
  hashtags: ["#productivity", "#morningroutine", "#creators", "#growth", "#habits"],
};

const MOCK_PLATFORM_COPY = {
  instagram: MOCK_PROMO.caption,
  linkedin: `${MOCK_PROMO.tagline}\n\n${MOCK_PROMO.shortDescription}\n\n${MOCK_PROMO.hashtags.join(" ")}`,
  x: `${MOCK_PROMO.tagline} ${MOCK_PROMO.hashtags.slice(0, 3).join(" ")}`,
  web: MOCK_PROMO.shortDescription,
};

const Cre8Boost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [boosted, setBoosted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedProject = MOCK_PROJECTS.find((p) => p.id === selectedProjectId);

  const handleBoost = async () => {
    if (!selectedProjectId) {
      toast({ title: "Select a project", variant: "destructive" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setBoosted(true);
    setLoading(false);
    toast({ title: "cre8Boost activated", description: "Promo assets are ready." });
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cre8-blue to-cre8-purple bg-clip-text text-transparent">
              Cre8Boost
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select project */}
        <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-gray-400 font-mono text-sm">1</span>
              Select a project to boost
            </CardTitle>
            <CardDescription className="text-gray-400">
              Choose the project you want to mark as launch-ready. We’ll generate promo copy and formats for each platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {MOCK_PROJECTS.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    selectedProjectId === project.id
                      ? "border-cre8-blue bg-cre8-blue/10 text-white"
                      : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{project.type} · {project.updated}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Boost CTA */}
        <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-gray-400 font-mono text-sm">2</span>
              Mark as launch-ready
            </CardTitle>
            <CardDescription className="text-gray-400">
              One click to generate a polished promo preview, captions, hooks, and platform-optimized formats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              disabled={!selectedProjectId || loading}
              onClick={handleBoost}
              className="w-full sm:w-auto bg-gradient-to-r from-cre8-blue to-cre8-purple hover:opacity-90 text-white font-semibold gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Rocket className="h-5 w-5" />
              )}
              Boost This Project
            </Button>
            {selectedProject && (
              <p className="text-gray-400 text-sm mt-3">
                Boosting: <span className="text-white">{selectedProject.name}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Promo assets (after boost) */}
        {boosted && (
          <>
            <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-gray-400 font-mono text-sm">3</span>
                  Auto-generated promo assets
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Copy and tweak for your channels. Each field has a copy button.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" /> Social caption
                  </label>
                  <div className="relative">
                    <Textarea
                      readOnly
                      value={MOCK_PROMO.caption}
                      className="min-h-[100px] bg-white/5 border-white/10 text-gray-200 resize-none"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(MOCK_PROMO.caption, "caption")}
                    >
                      {copiedId === "caption" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2">
                    <Type className="h-4 w-4" /> Short description
                  </label>
                  <div className="relative">
                    <Textarea
                      readOnly
                      value={MOCK_PROMO.shortDescription}
                      className="min-h-[80px] bg-white/5 border-white/10 text-gray-200 resize-none"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(MOCK_PROMO.shortDescription, "short")}
                    >
                      {copiedId === "short" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2">
                    <Type className="h-4 w-4" /> Tagline
                  </label>
                  <div className="relative">
                    <input
                      readOnly
                      value={MOCK_PROMO.tagline}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-gray-200"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-1 right-1 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(MOCK_PROMO.tagline, "tagline")}
                    >
                      {copiedId === "tagline" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4" /> Hashtag suggestions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_PROMO.hashtags.map((tag, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-gray-300 hover:bg-white/10"
                        onClick={() => copyToClipboard(tag, `tag-${i}`)}
                      >
                        {copiedId === `tag-${i}` ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multi-platform formatting */}
            <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Multi-platform formatting</CardTitle>
                <CardDescription className="text-gray-400">
                  Pre-formatted copy for each channel. Copy and paste where you publish.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="instagram" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
                    <TabsTrigger value="instagram" className="data-[state=active]:bg-cre8-blue/20 data-[state=active]:text-white">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </TabsTrigger>
                    <TabsTrigger value="linkedin" className="data-[state=active]:bg-cre8-blue/20 data-[state=active]:text-white">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </TabsTrigger>
                    <TabsTrigger value="x" className="data-[state=active]:bg-cre8-blue/20 data-[state=active]:text-white">
                      <Twitter className="h-4 w-4 mr-2" />
                      X
                    </TabsTrigger>
                    <TabsTrigger value="web" className="data-[state=active]:bg-cre8-blue/20 data-[state=active]:text-white">
                      <Globe className="h-4 w-4 mr-2" />
                      Web
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="instagram" className="mt-4">
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={MOCK_PLATFORM_COPY.instagram}
                        className="min-h-[120px] bg-white/5 border-white/10 text-gray-200"
                      />
                      <Button
                        size="sm"
                        className="absolute top-2 right-2 gap-1"
                        onClick={() => copyToClipboard(MOCK_PLATFORM_COPY.instagram, "ig")}
                      >
                        {copiedId === "ig" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="linkedin" className="mt-4">
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={MOCK_PLATFORM_COPY.linkedin}
                        className="min-h-[120px] bg-white/5 border-white/10 text-gray-200"
                      />
                      <Button
                        size="sm"
                        className="absolute top-2 right-2 gap-1"
                        onClick={() => copyToClipboard(MOCK_PLATFORM_COPY.linkedin, "li")}
                      >
                        {copiedId === "li" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="x" className="mt-4">
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={MOCK_PLATFORM_COPY.x}
                        className="min-h-[120px] bg-white/5 border-white/10 text-gray-200"
                      />
                      <Button
                        size="sm"
                        className="absolute top-2 right-2 gap-1"
                        onClick={() => copyToClipboard(MOCK_PLATFORM_COPY.x, "x")}
                      >
                        {copiedId === "x" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="web" className="mt-4">
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={MOCK_PLATFORM_COPY.web}
                        className="min-h-[120px] bg-white/5 border-white/10 text-gray-200"
                      />
                      <Button
                        size="sm"
                        className="absolute top-2 right-2 gap-1"
                        onClick={() => copyToClipboard(MOCK_PLATFORM_COPY.web, "web")}
                      >
                        {copiedId === "web" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Distribute & track */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-cre8-purple" />
                  Distribute & track
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Share to social, publish to the Cre8Hub showcase, or send to brands and collaborators. Track views, clicks, and saves.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  className="bg-gradient-to-r from-cre8-blue to-cre8-purple hover:opacity-90 text-white gap-2"
                  onClick={() => toast({ title: "Share", description: "Share flow coming soon." })}
                >
                  <Share2 className="h-4 w-4" />
                  Share to social
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 gap-2"
                  onClick={() => navigate("/showcase")}
                >
                  <Globe className="h-4 w-4" />
                  Publish to showcase
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 gap-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <BarChart3 className="h-4 w-4" />
                  View performance
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Cre8Boost;
