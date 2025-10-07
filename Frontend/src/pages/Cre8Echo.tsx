import  {ContentGenerator}  from "@/components/ContentGenerator";
import { Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cre8Echo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Smaller Animated Background Orbs */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20 animate-pulse" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Back</span>
              </button>
              
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Cre8Echo
                  </h1>
                  <p className="text-xs text-purple-300">AI-Powered Content Studio</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-purple-200">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] px-4 py-8 md:py-12">
        <ContentGenerator />
      </div>

      {/* Bottom Gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default Cre8Echo;
