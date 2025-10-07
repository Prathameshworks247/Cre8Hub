import { useBackendAuth } from "@/hooks/useBackendAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, Plus, Mic, Image, Video, TrendingUp, Users, Zap, Sparkles, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut } = useBackendAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  

  const features = [
    {
      name: "Cre8Echo",
      description: "Smart Content Ideation – Generate fresh, trend-aligned content ideas and scripts tailored to your unique style and audience.",
      icon: Mic,
      status: "active",
      gradient: "from-blue-600 to-purple-600",
      action: () => navigate("/cre8echo"),
      category: "Create"
    },
    {
      name: "Cre8Canvas",
      description: "AI Thumbnail Designer – Create eye-catching, high-converting thumbnails in seconds with our AI-powered image generation tools.",
      icon: Image,
      status: "coming-soon",
      gradient: "from-pink-600 to-orange-600",
      action: null,
      category: "Design"
    },
    {
      name: "Cre8Motion",
      description: "Next-Gen Video Creation – Transform scripts into engaging short-form videos with automated editing and smart visual enhancements.",
      icon: Video,
      status: "coming-soon",
      gradient: "from-purple-600 to-indigo-600",
      action: null,
      category: "Create"
    },
    {
      name: "Cre8Sight",
      description: "Creator Analytics – Track engagement, identify trends, and understand what drives growth with advanced performance insights.",
      icon: TrendingUp,
      status: "coming-soon",
      gradient: "from-green-600 to-emerald-600",
      action: null,
      category: "Analyze"
    },
    {
      name: "Cre8Reach",
      description: "Personalized Audience Growth – Reach more viewers with AI-driven targeting, posting strategies, and platform-specific recommendations.",
      icon: Users,
      status: "coming-soon",
      gradient: "from-cyan-600 to-blue-600",
      action: null,
      category: "Grow"
    },
    {
      name: "Cre8Flow",
      description: "Creator Workflow Automation – Save time by automating repetitive tasks — from ideation to publishing — so you can focus on creating.",
      icon: Zap,
      status: "coming-soon",
      gradient: "from-yellow-600 to-orange-600",
      action: null,
      category: "Automate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/logomain.png" 
                alt="CRE8HUB Logo" 
                className="h-8"
              />
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/cre8echo")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg shadow-blue-500/25"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Creating
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 ring-2 ring-white/10">
                  <AvatarImage src={user?.avatar || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {user?.name ? getInitials(user.name) : user.email.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Creator'}!
            </h2>
          </div>
          <p className="text-gray-400 text-lg">Explore our powerful creator tools to elevate your content game.</p>
        </div>

        {/* Quick Start Card - Featured */}
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 shadow-2xl mb-8 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-8 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/90 text-sm font-semibold uppercase tracking-wide">Now Available</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Ready to create amazing content?</h3>
                <p className="text-white/80 text-lg">Launch Cre8Echo and start generating ideas instantly.</p>
              </div>
              <Button 
                onClick={() => navigate("/cre8echo")}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 rounded-full shadow-xl px-8 font-bold text-lg"
              >
                Launch Cre8Echo
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Grid */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4">All Features</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => (
            <Card 
              key={feature.name}
              className={`bg-gradient-to-br ${feature.gradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                feature.status === 'active' ? 'hover:scale-105 cursor-pointer' : 'opacity-90'
              } group relative overflow-hidden`}
              onClick={feature.action}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-2xl ${
                    feature.status === 'active' 
                      ? 'bg-white/20 ring-2 ring-white/30' 
                      : 'bg-black/20'
                  } backdrop-blur-sm`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  {feature.status === 'coming-soon' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/30 text-white flex items-center space-x-1 backdrop-blur-sm">
                      <Clock className="h-3 w-3" />
                      <span>Coming Soon</span>
                    </span>
                  )}
                  {feature.status === 'active' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/30 text-white flex items-center space-x-1 backdrop-blur-sm ring-1 ring-green-400/30">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Active</span>
                    </span>
                  )}
                </div>
                <div className="space-y-1 mb-2">
                  <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{feature.category}</span>
                  <CardTitle className="text-white text-2xl font-bold">{feature.name}</CardTitle>
                </div>
                <CardDescription className="text-white/90 text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative pt-0">
                {feature.status === 'active' ? (
                  <Button 
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm rounded-full font-semibold shadow-lg"
                  >
                    Launch Now
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    disabled
                    className="w-full bg-white/10 text-white/60 border-0 backdrop-blur-sm rounded-full font-semibold cursor-not-allowed"
                  >
                    Notify Me When Ready
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Status */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-400" />
                <span>Profile Status</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                {user?.profileCompleted 
                  ? 'Your profile is all set up and ready to go!'
                  : 'Complete your profile to unlock personalized features'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Profile Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user?.profileCompleted 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {user?.profileCompleted ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">User Role</span>
                  <span className="text-white font-medium">
                    {user?.userRole ? user.userRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not Set'}
                  </span>
                </div>
                {!user?.profileCompleted && (
                  <Button 
                    onClick={() => navigate("/profile-setup")}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Jump right into your creative workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/cre8echo")}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg justify-start"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Open Cre8Echo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10 rounded-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;