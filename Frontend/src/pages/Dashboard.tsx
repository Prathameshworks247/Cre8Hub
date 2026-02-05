import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, Plus, Palette, Video, Sparkles, Clock, TrendingUp, Zap, Eye, Heart, MessageCircle, Share2, ArrowUp, ArrowDown, Users, Calendar, ThumbsUp, BarChart3, Lightbulb, Play, TrendingDown, Rocket } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import logo from '../../public/lovable-uploads/logomain.png';
import { useBackendAuth } from '@/hooks/useBackendAuth';


const Dashboard = () => {
  const navigate = useNavigate();
  // const [user] = useState({
  //   name: "Sarah Johnson",
  //   email: "sarah@example.com",
  //   avatar: "",
  //   memberSince: "January 2025"
  // });
  const { user } = useBackendAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock data for analytics
  const overallStats = [
    { date: 'Jan', views: 12000, engagement: 850 },
    { date: 'Feb', views: 15000, engagement: 1100 },
    { date: 'Mar', views: 18000, engagement: 1400 },
    { date: 'Apr', views: 22000, engagement: 1800 },
    { date: 'May', views: 28000, engagement: 2300 },
    { date: 'Jun', views: 35000, engagement: 2900 },
  ];

  const lastVideoPerformance = [
    { hour: '0h', views: 120, likes: 15 },
    { hour: '6h', views: 580, likes: 67 },
    { hour: '12h', views: 1240, likes: 145 },
    { hour: '18h', views: 2100, likes: 234 },
    { hour: '24h', views: 3500, likes: 389 },
    { hour: '48h', views: 5200, likes: 567 },
    { hour: '72h', views: 6800, likes: 712 },
  ];

  const aiSuggestions = [
    {
      title: "Top 5 Morning Routine Hacks for Productivity",
      reason: "Trending in your niche (+342% engagement)",
      thumbnail: "🌅",
      potentialViews: "15K-25K",
      confidence: 92
    },
    {
      title: "I Tried [Popular Challenge] for 30 Days",
      reason: "Your audience loves transformation content",
      thumbnail: "🎯",
      potentialViews: "10K-18K",
      confidence: 88
    },
    {
      title: "Behind the Scenes: How I Create Content",
      reason: "High engagement on previous BTS videos",
      thumbnail: "🎬",
      potentialViews: "8K-15K",
      confidence: 85
    },
    {
      title: "Reacting to My First Video vs Now",
      reason: "Nostalgia content performing well",
      thumbnail: "⏮️",
      potentialViews: "12K-20K",
      confidence: 90
    }
  ];

  const features = [
    {
      name: "Cre8Echo",
      description: "Extract your creator persona and generate personalized scripts, captions, and ideas",
      icon: Sparkles,
      status: "active",
      gradient: "from-blue-600/20 via-purple-600/10 to-slate-800",
      accentColor: "blue"
    },
    {
      name: "Cre8Canvas",
      description: "Create eye-catching, high-converting thumbnails with AI-powered image generation",
      icon: Palette,
      status: "active",
      gradient: "from-purple-600/20 via-pink-600/10 to-slate-800",
      accentColor: "purple"
    },
    {
      name: "Cre8Motion",
      description: "Transform scripts into engaging short-form videos with automated editing",
      icon: Video,
      status: "coming-soon",
      gradient: "from-slate-700/50 to-slate-800",
      accentColor: "indigo"
    },
    {
      name: "Cre8Sight",
      description: "Track engagement, identify trends, and understand what drives growth",
      icon: TrendingUp,
      status: "coming-soon",
      gradient: "from-slate-700/50 to-slate-800",
      accentColor: "violet"
    },
    {
      name: "Cre8Boost",
      description: "Mark projects launch-ready. Get promo assets, multi-platform copy, and distribute to social and Cre8Hub showcase",
      icon: Rocket,
      status: "active",
      gradient: "from-cyan-600/20 via-blue-600/10 to-slate-800",
      accentColor: "cyan"
    },
    {
      name: "Cre8Flow",
      description: "Automate repetitive tasks from ideation to publishing",
      icon: Zap,
      status: "coming-soon",
      gradient: "from-slate-700/50 to-slate-800",
      accentColor: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
                <img src={logo} alt="Cre8Hub" className="h-16 w-16" onClick={() => navigate('/')}/>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Creator Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg shadow-blue-500/30 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 ring-2 ring-purple-500/30 ring-offset-2 ring-offset-slate-900" onClick={() => navigate('/profile-setup')}>
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {getInitials(user?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
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
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-300" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h2>
          </div>
          <p className="text-gray-300 text-lg">Here's your content performance overview</p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent border border-blue-500/20 backdrop-blur-xl hover:border-blue-500/40 hover:from-blue-600/15 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors shadow-lg shadow-blue-500/20">
                  <Eye className="h-6 w-6 text-blue-300" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-400 text-sm font-semibold">
                  <ArrowUp className="h-4 w-4" />
                  <span>24.5%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">142.8K</p>
              <p className="text-gray-400 text-sm">Total Views</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-transparent border border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 hover:from-purple-600/15 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors shadow-lg shadow-purple-500/20">
                  <Heart className="h-6 w-6 text-purple-300" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-400 text-sm font-semibold">
                  <ArrowUp className="h-4 w-4" />
                  <span>18.2%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">12.4K</p>
              <p className="text-gray-400 text-sm">Total Likes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600/10 via-indigo-500/5 to-transparent border border-indigo-500/20 backdrop-blur-xl hover:border-indigo-500/40 hover:from-indigo-600/15 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors shadow-lg shadow-indigo-500/20">
                  <Users className="h-6 w-6 text-indigo-300" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-400 text-sm font-semibold">
                  <ArrowUp className="h-4 w-4" />
                  <span>32.1%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">8.9K</p>
              <p className="text-gray-400 text-sm">Subscribers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-600/10 via-violet-500/5 to-transparent border border-violet-500/20 backdrop-blur-xl hover:border-violet-500/40 hover:from-violet-600/15 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-violet-500/20 rounded-lg group-hover:bg-violet-500/30 transition-colors shadow-lg shadow-violet-500/20">
                  <BarChart3 className="h-6 w-6 text-violet-300" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-400 text-sm font-semibold">
                  <ArrowUp className="h-4 w-4" />
                  <span>5.8%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">8.7%</p>
              <p className="text-gray-400 text-sm">Avg. Engagement</p>
            </CardContent>
        </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Last Video Performance */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Play className="h-5 w-5 text-green-400" />
                    <span>Last Video Performance</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    Posted 3 days ago • "My Creative Process Revealed"
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trending</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">Views</p>
                    <p className="text-white text-xl font-bold">6.8K</p>
                    <p className="text-green-400 text-xs flex items-center mt-1">
                      <ArrowUp className="h-3 w-3" />
                      <span>+142%</span>
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">Likes</p>
                    <p className="text-white text-xl font-bold">712</p>
                    <p className="text-green-400 text-xs flex items-center mt-1">
                      <ArrowUp className="h-3 w-3" />
                      <span>+98%</span>
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">Comments</p>
                    <p className="text-white text-xl font-bold">89</p>
                    <p className="text-green-400 text-xs flex items-center mt-1">
                      <ArrowUp className="h-3 w-3" />
                      <span>+76%</span>
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={lastVideoPerformance}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Overall Growth Since Joining */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span>Growth Since Joining</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    Member since  • 6 months
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">Videos Posted</p>
                    <p className="text-white text-xl font-bold">24</p>
                    <p className="text-blue-400 text-xs mt-1">4 per month avg.</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">Growth Rate</p>
                    <p className="text-white text-xl font-bold">+286%</p>
                    <p className="text-green-400 text-xs mt-1">Accelerating</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={overallStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                    <Line type="monotone" dataKey="engagement" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400">Views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-400">Engagement</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Video Suggestions */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-purple-400" />
                  <span>AI Video Suggestions</span>
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Personalized content ideas based on your audience and trends
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-full transition-all"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate More
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSuggestions.map((suggestion, index) => {
                const colors = [
                  { border: 'border-blue-500/20 hover:border-blue-500/40', bg: 'bg-gradient-to-br from-blue-500/10 to-blue-500/5', emoji: 'bg-blue-500/20 border-blue-500/30' },
                  { border: 'border-purple-500/20 hover:border-purple-500/40', bg: 'bg-gradient-to-br from-purple-500/10 to-purple-500/5', emoji: 'bg-purple-500/20 border-purple-500/30' },
                  { border: 'border-indigo-500/20 hover:border-indigo-500/40', bg: 'bg-gradient-to-br from-indigo-500/10 to-indigo-500/5', emoji: 'bg-indigo-500/20 border-indigo-500/30' },
                  { border: 'border-violet-500/20 hover:border-violet-500/40', bg: 'bg-gradient-to-br from-violet-500/10 to-violet-500/5', emoji: 'bg-violet-500/20 border-violet-500/30' },
                ];
                const color = colors[index % colors.length];
                
                return (
                  <Card 
                    key={index}
                    className={`${color.bg} border ${color.border} backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-4 relative">
                      <div className="flex items-start space-x-4">
                        <div className={`text-4xl ${color.emoji} rounded-xl p-3 flex items-center justify-center border shadow-lg`}>
                          {suggestion.thumbnail}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                            {suggestion.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3">{suggestion.reason}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs">
                              <span className="text-emerald-400 flex items-center space-x-1 font-medium">
                                <Eye className="h-3 w-3" />
                                <span>{suggestion.potentialViews}</span>
                              </span>
                              <span className="text-blue-400 flex items-center space-x-1 font-medium">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{suggestion.confidence}%</span>
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 rounded-full text-xs shadow-lg"
                            >
                              Use Idea
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
              <Zap className="h-6 w-6 text-indigo-300" />
            </div>
            <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Creator Tools</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => {
            const accentColors = {
              blue: 'border-blue-500/40 hover:border-blue-400/60',
              purple: 'border-purple-500/40 hover:border-purple-400/60',
              indigo: 'border-indigo-500/30 hover:border-indigo-400/50',
              violet: 'border-violet-500/30 hover:border-violet-400/50',
              cyan: 'border-cyan-500/30 hover:border-cyan-400/50',
              emerald: 'border-emerald-500/30 hover:border-emerald-400/50'
            };
            const iconColors = {
              blue: 'text-blue-300',
              purple: 'text-purple-300',
              indigo: 'text-indigo-300',
              violet: 'text-violet-300',
              cyan: 'text-cyan-300',
              emerald: 'text-emerald-300'
            };
            const iconBgColors = {
              blue: 'bg-blue-500/20 group-hover:bg-blue-500/30 shadow-blue-500/20',
              purple: 'bg-purple-500/20 group-hover:bg-purple-500/30 shadow-purple-500/20',
              indigo: 'bg-indigo-500/15 group-hover:bg-indigo-500/25 shadow-indigo-500/15',
              violet: 'bg-violet-500/15 group-hover:bg-violet-500/25 shadow-violet-500/15',
              cyan: 'bg-cyan-500/15 group-hover:bg-cyan-500/25 shadow-cyan-500/15',
              emerald: 'bg-emerald-500/15 group-hover:bg-emerald-500/25 shadow-emerald-500/15'
            };
            const buttonColors = {
              blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30',
              purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30',
              indigo: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30',
              violet: 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/30',
              cyan: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/30',
              emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30'
            };
            const glowColors = {
              blue: 'from-blue-500/10 to-blue-500/5',
              purple: 'from-purple-500/10 to-purple-500/5',
              indigo: 'from-indigo-500/10 to-indigo-500/5',
              violet: 'from-violet-500/10 to-violet-500/5',
              cyan: 'from-cyan-500/10 to-cyan-500/5',
              emerald: 'from-emerald-500/10 to-emerald-500/5'
            };
            
            return (
              <Card 
                key={feature.name}
                className={`bg-gradient-to-br ${feature.gradient} border ${feature.status === 'active' ? accentColors[feature.accentColor as keyof typeof accentColors] : 'border-white/10 hover:border-white/20'} backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.status === 'active' ? glowColors[feature.accentColor as keyof typeof glowColors] : 'from-transparent to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-xl ${iconBgColors[feature.accentColor as keyof typeof iconBgColors]} backdrop-blur-sm border border-white/10 transition-all shadow-lg`}>
                      <feature.icon className={`h-6 w-6 ${iconColors[feature.accentColor as keyof typeof iconColors]}`} />
                    </div>
                    {feature.status === 'coming-soon' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-gray-300 flex items-center space-x-1 backdrop-blur-sm border border-white/10">
                        <Clock className="h-3 w-3" />
                        <span>Coming Soon</span>
                      </span>
                    )}
                    {feature.status === 'active' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 flex items-center space-x-1 backdrop-blur-sm border border-emerald-500/30">
                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-white text-2xl font-bold">{feature.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  {feature.status === 'active' ? (
                    <Button 
                      className={`w-full ${buttonColors[feature.accentColor as keyof typeof buttonColors]} text-white border-0 rounded-full font-semibold shadow-lg transition-all`}
                      onClick={() => navigate(`/${feature.name.toLowerCase()}`)}
                    >
                      Launch Now
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="w-full bg-white/5 text-gray-400 border border-white/10 rounded-full font-semibold cursor-not-allowed hover:bg-white/5"
                    >
                      Notify Me
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Insights */}
          <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-300" />
                </div>
                <span>Quick Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                      <ArrowUp className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Best posting time</p>
                      <p className="text-gray-400 text-sm">6-8 PM on weekdays</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Top audience age</p>
                      <p className="text-gray-400 text-sm">18-24 years (42%)</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                      <Heart className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Most engaging content</p>
                      <p className="text-gray-400 text-sm">Tutorial videos</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-blue-500/5 to-transparent backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-300" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Jump right into your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg justify-start transition-all"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Open Cre8Echo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-full justify-start transition-all"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Full Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-full justify-start transition-all"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
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