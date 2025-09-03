import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ReactElement, useState } from "react";
import { Youtube, Instagram, Twitter, Linkedin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformCardProps {
  platform: "youtube" | "instagram" | "twitter" | "linkedin";
  title: string;
  description: string;
  onSelect: () => void;
  isSelected?: boolean;
  setShowTranscriptRequest: (show: boolean) => void;
  showTranscriptRequest: boolean;
}

const platformIcons = {
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

const platformColors = {
  youtube: "text-red-500",
  instagram: "text-pink-500",
  twitter: "text-blue-400",
  linkedin: "text-blue-600",
};

export function PlatformCard({ platform, title, description, onSelect, isSelected, setShowTranscriptRequest,  showTranscriptRequest}: PlatformCardProps) {
  const [isPersonifyEnabled, setIsPersonifyEnabled] = useState(false);
  
  const Icon = platformIcons[platform];
  const colorClass = platformColors[platform];

  const handlePersonifyToggle = (checked: boolean) => {
    setIsPersonifyEnabled(checked);
    if (checked && platform === "youtube") {
      setShowTranscriptRequest(true);
    } else {
      setShowTranscriptRequest(false);
    }
  };

  const handleGrantAccess = () => {
    // Here we would integrate with YouTube API
    setShowTranscriptRequest(true);
  };

  return (
    <Card
      className={cn(
        "relative group backdrop-blur-2xl bg-white/20 hover:border-primary/50 transition-all duration-300 hover:shadow-cosmic cursor-pointer overflow-hidden border border-transparent",
        isSelected &&
          "border-primary shadow-[0_0_20px_rgba(147,51,234,0.8)] ring-2 ring-primary/50"
      )}
      onClick={onSelect}
    >
      <div className="absolute inset-0 bg-gradient-orb opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-secondary/20 ${colorClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          {platform === "youtube" && (
            <div
              className="flex items-center space-x-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Sparkles className="w-4 h-4 text-cosmic-glow" />
              <span className="text-sm font-medium">Personify</span>
              <Switch
                checked={isPersonifyEnabled}
                onCheckedChange={handlePersonifyToggle}
                className="data-[state=checked]:bg-cre8-purple"
              />
            </div>
          )}
        </div>
        
        {showTranscriptRequest &&platform== "youtube" && (
          <div className="mt-4 p-4 bg-white/20 rounded-xl   space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cosmic-glow" />
              <h4 className="font-medium text-sm">Persona Enhancement Ready</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Grant access to your YouTube channel transcripts to create personalized content that matches your unique voice and style.
            </p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={handleGrantAccess}
                className="bg-gray-800 rounded-full hover:bg-white hover:text-black"
              >
                Grant Access
              </Button>
              <Button 
                size="sm" 
                onClick={() => setShowTranscriptRequest(false)}
                className=" hover:text-black"
              >
                Later
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}