import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Youtube, Instagram, Twitter, Linkedin, Sparkles, Loader2, CheckCircle, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useBackendAuth } from "@/hooks/useBackendAuth";

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

export function PlatformCard({ platform, title, description, onSelect, isSelected, setShowTranscriptRequest, showTranscriptRequest }: PlatformCardProps) {
  const { toast } = useToast();
  const { user } = useBackendAuth();
  const [isPersonifyEnabled, setIsPersonifyEnabled] = useState(false);
  const [channelId, setChannelId] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<'none' | 'extracting' | 'completed' | 'error'>('none');
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [channelName, setChannelName] = useState('');
  
  const Icon = platformIcons[platform];
  const colorClass = platformColors[platform];

  // Check YouTube connection status on mount
  useEffect(() => {
    const checkYouTubeConnection = async () => {
      if (platform === 'youtube' && user?.id) {
        try {
          const result = await apiService.getYouTubeConnectionStatus();
          if (result.data && typeof result.data === 'object' && 'connected' in result.data) {
            setYoutubeConnected(result.data.connected as boolean);
          }
        } catch (error) {
          console.error('Error checking YouTube connection:', error);
        }
      }
    };
    
    checkYouTubeConnection();
  }, [platform, user?.id]);

  const handlePersonifyToggle = (checked: boolean) => {
    setIsPersonifyEnabled(checked);
    if (checked && platform === "youtube") {
      setShowTranscriptRequest(true);
    } else {
      setShowTranscriptRequest(false);
    }
  };

  const getChannelIdFromUrl = (url: string) => {
    // Extract channel ID from various YouTube URL formats
    const patterns = [
      /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/@([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url; // Return as-is if no pattern matches
  };

  const handleConnectYouTube = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect YouTube",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const result = await apiService.getYouTubeAuthUrl();
      
      if (result.error) {
        toast({
          title: "Failed to get authorization URL",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Redirect to YouTube OAuth
      if (result.data && typeof result.data === 'object' && 'authUrl' in result.data) {
        window.location.href = result.data.authUrl as string;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to YouTube",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleExtractPersona = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to extract persona",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    setExtractionStatus('extracting');
    
    try {
      // Use OAuth-based extraction if connected, otherwise use channel ID
      const result = youtubeConnected 
        ? await apiService.extractPersonaFromYouTube(user.id)
        : await apiService.extractPersonaFromChannel(channelId, user.id);
      
      if (result.error) {
        setExtractionStatus('error');
        toast({
          title: "Persona extraction failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setExtractionStatus('completed');
      toast({
        title: "Persona extracted successfully!",
        description: youtubeConnected 
          ? "Your YouTube persona has been analyzed from your channel"
          : "Your YouTube persona has been analyzed and saved",
      });
      
      // Clear the input and close the request after successful extraction
      setChannelId('');
      setShowTranscriptRequest(false);
    } catch (error) {
      setExtractionStatus('error');
      toast({
        title: "Error",
        description: "Failed to extract persona from YouTube",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGrantAccess = () => {
    // This now triggers the persona extraction flow
    if (channelId.trim()) {
      handleExtractPersona();
    }
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
              className="flex items-center space-x-3"
              onClick={(e) => e.stopPropagation()}
            >
              {youtubeConnected && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                  <Link2 className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-medium text-green-400">Connected</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cosmic-glow" />
                <span className="text-sm font-medium">Personify</span>
                <Switch
                  checked={isPersonifyEnabled}
                  onCheckedChange={handlePersonifyToggle}
                  className="data-[state=checked]:bg-cre8-purple"
                />
              </div>
            </div>
          )}
        </div>
        
        {showTranscriptRequest && (
          <div className="mt-4 p-4 bg-white/20 rounded-xl space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cosmic-glow" />
              <h4 className="font-medium text-sm">Persona Enhancement Ready</h4>
            </div>
            
            {youtubeConnected ? (
              // Connected State - Show only extraction button
              <>
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center space-x-2">
                    <Link2 className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-400">YouTube Connected</p>
                      <p className="text-xs text-green-400/70">Ready to extract from your channel</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Extract your persona from your own YouTube videos for the most accurate results.
                </p>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={handleExtractPersona}
                    disabled={isExtracting}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Extracting from Your Channel...
                      </>
                    ) : extractionStatus === 'completed' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Extracted Successfully
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" />
                        Extract Persona from My Videos
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setShowTranscriptRequest(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Later
                  </Button>
                </div>
              </>
            ) : (
              // Not Connected State - Show connection option
              <>
                <p className="text-xs text-muted-foreground">
                  Connect your YouTube account to extract persona from your own videos.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs font-medium">Connect Your YouTube Account (Recommended)</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-4">
                    Access your own videos and transcripts for more accurate persona extraction
                  </p>
                  <Button 
                    size="sm" 
                    onClick={handleConnectYouTube}
                    disabled={isConnecting}
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Youtube className="w-3 h-3 mr-1" />
                        Connect YouTube Account
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => setShowTranscriptRequest(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Later
                  </Button>
                </div>
              </>
            )}
            
            {extractionStatus === 'completed' && (
              <div className="text-xs text-green-400 text-center bg-green-500/10 rounded-lg p-2">
                ✓ Persona extracted successfully from your YouTube channel!
              </div>
            )}
            
            {extractionStatus === 'error' && (
              <div className="text-xs text-red-400 text-center bg-red-500/10 rounded-lg p-2">
                ✗ Failed to extract persona. Please try again.
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}