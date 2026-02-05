import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  TrendingUp,
  Search,
  ExternalLink,
  User,
  FolderOpen,
} from "lucide-react";

const MOCK_FEATURED_PROJECTS = [
  {
    id: "1",
    title: "Morning Routine Hacks",
    creator: "Alex Rivera",
    category: "Campaign",
    description: "30-day experiment with top productivity tips. What worked, what didn’t.",
    views: "12.4K",
    published: "2 days ago",
  },
  {
    id: "2",
    title: "Nova App – Product Launch",
    creator: "Jordan Lee",
    category: "Product",
    description: "Launch campaign for Nova: design, copy, and launch week content.",
    views: "8.2K",
    published: "1 week ago",
  },
  {
    id: "3",
    title: "Intro to Video Editing",
    creator: "Sam Chen",
    category: "Content",
    description: "Tutorial series for beginners. Scripts, thumbnails, and episode outlines.",
    views: "24.1K",
    published: "3 days ago",
  },
  {
    id: "4",
    title: "Brand Refresh 2025",
    creator: "Morgan Blake",
    category: "Design",
    description: "Full brand refresh: logo, palette, and social templates.",
    views: "5.6K",
    published: "5 days ago",
  },
  {
    id: "5",
    title: "Fitness Challenge Campaign",
    creator: "Casey Drew",
    category: "Campaign",
    description: "30-day challenge with daily prompts and community hooks.",
    views: "18.9K",
    published: "1 day ago",
  },
  {
    id: "6",
    title: "Podcast Art & Show Notes",
    creator: "Riley Kim",
    category: "Content",
    description: "Cover art and show notes template for the first 10 episodes.",
    views: "3.2K",
    published: "4 days ago",
  },
];

const MOCK_TRENDING_CREATORS = [
  { id: "1", name: "Alex Rivera", projects: 12, tagline: "Productivity & habits", initial: "AR" },
  { id: "2", name: "Jordan Lee", projects: 8, tagline: "Product & design", initial: "JL" },
  { id: "3", name: "Sam Chen", projects: 24, tagline: "Tutorials & education", initial: "SC" },
  { id: "4", name: "Morgan Blake", projects: 6, tagline: "Brand & identity", initial: "MB" },
  { id: "5", name: "Casey Drew", projects: 15, tagline: "Community & challenges", initial: "CD" },
  { id: "6", name: "Riley Kim", projects: 9, tagline: "Audio & podcasting", initial: "RK" },
];

const Showcase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("projects");

  const filteredProjects = MOCK_FEATURED_PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCreators = MOCK_TRENDING_CREATORS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Cre8Hub
              <span className="bg-gradient-to-r from-cre8-blue to-cre8-purple bg-clip-text text-transparent">
                {" "}
                Showcase
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover featured projects and trending creators. Perfect for brands and collaborators looking for talent.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search projects or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-cre8-blue"
            />
          </div>

          {/* Tabs: Featured Projects | Trending Creators */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/5 border border-white/10 mb-10">
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-cre8-blue/20 data-[state=active]:text-white"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Featured Projects
              </TabsTrigger>
              <TabsTrigger
                value="creators"
                className="data-[state=active]:bg-cre8-purple/20 data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Creators
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-cre8-dark/80 backdrop-blur border border-white/10 overflow-hidden transition-all duration-300 hover:border-cre8-blue/40 group"
                  >
                    <div className="aspect-video bg-gradient-to-br from-cre8-blue/20 to-cre8-purple/20 flex items-center justify-center">
                      <FolderOpen className="h-12 w-12 text-white/40 group-hover:text-white/60 transition-colors" />
                    </div>
                    <CardContent className="p-4">
                      <span className="text-xs font-medium text-cre8-blue uppercase tracking-wider">
                        {project.category}
                      </span>
                      <h3 className="text-white font-semibold mt-1 mb-2 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{project.creator}</span>
                        <span>{project.views} views · {project.published}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-white/20 text-gray-300 hover:bg-white/10 hover:text-white gap-2"
                        onClick={() => navigate("/signin")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredProjects.length === 0 && (
                <p className="text-center text-gray-500 py-12">No projects match your search.</p>
              )}
            </TabsContent>

            <TabsContent value="creators" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCreators.map((creator) => (
                  <Card
                    key={creator.id}
                    className="bg-cre8-dark/80 backdrop-blur border border-white/10 overflow-hidden transition-all duration-300 hover:border-cre8-purple/40"
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16 mb-3 ring-2 ring-cre8-purple/30">
                        <AvatarFallback className="bg-gradient-to-br from-cre8-blue to-cre8-purple text-white text-lg">
                          {creator.initial}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-white font-semibold">{creator.name}</h3>
                      <p className="text-gray-400 text-sm mt-0.5">{creator.tagline}</p>
                      <p className="text-gray-500 text-xs mt-2">{creator.projects} projects</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-4 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white gap-2"
                        onClick={() => navigate("/signin")}
                      >
                        <User className="h-4 w-4" />
                        View profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredCreators.length === 0 && (
                <p className="text-center text-gray-500 py-12">No creators match your search.</p>
              )}
            </TabsContent>
          </Tabs>

          {/* CTA for creators */}
          <div className="mt-16 text-center">
            <Card className="inline-block bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">
                  Have a project to share? Boost it from your dashboard and it can appear here.
                </p>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-cre8-blue to-cre8-purple hover:opacity-90 text-white gap-2"
                >
                  Get started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Showcase;
