import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Palette, 
  ArrowLeft, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Wand2,
  Youtube,
  MonitorPlay,
  FileImage,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const generationTypes = [
  {
    id: "thumbnail",
    title: "Thumbnail",
    description: "Eye-catching video thumbnails that boost click-through rates",
    icon: Youtube,
    gradient: "from-red-600 to-orange-600",
    dimensions: "1280 x 720",
  },
  {
    id: "advertisement",
    title: "Advertisement",
    description: "Professional ad creatives for social media and display",
    icon: MonitorPlay,
    gradient: "from-blue-600 to-cyan-600",
    dimensions: "1200 x 628",
  },
  {
    id: "poster",
    title: "Poster",
    description: "Stunning posters for events, promotions, and branding",
    icon: FileImage,
    gradient: "from-purple-600 to-pink-600",
    dimensions: "1080 x 1920",
  },
];

const Cre8Canvas = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!selectedType || !prompt.trim()) {
      setError("Please select a type and enter a description");
      return;
    }

    setLoading(true);
    setError("");
    
    // Simulate API call - replace with actual Gemini nano-banana API call
    setTimeout(() => {
      // Mock generated image
      setGeneratedImage("https://via.placeholder.com/1280x720/6366f1/ffffff?text=AI+Generated+Content");
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-pink-600 to-orange-600 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-15 animate-pulse delay-1000" />
      
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
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 blur-lg opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-pink-600 to-orange-600 p-2 rounded-xl">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                    Cre8Canvas
                  </h1>
                  <p className="text-xs text-orange-300">AI-Powered Visual Studio</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-pink-200">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] px-4 py-8 md:py-12">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-pink-300 font-medium">Powered by Gemini Nano-Banana</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-pink-200 to-orange-200 bg-clip-text text-transparent">
              Design Visual Magic
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Create stunning thumbnails, ads, and posters with AI-powered image generation
            </p>
          </div>

          {/* Type Selection Cards */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {generationTypes.map((type) => (
              <Card
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  setError("");
                }}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedType === type.id
                    ? `bg-gradient-to-br ${type.gradient} border-0 shadow-2xl`
                    : "bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-xl"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-2xl ${
                      selectedType === type.id 
                        ? "bg-white/20 backdrop-blur-sm" 
                        : "bg-white/5"
                    }`}>
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    {selectedType === type.id && (
                      <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <CardTitle className={`text-xl ${
                    selectedType === type.id ? "text-white" : "text-gray-200"
                  }`}>
                    {type.title}
                  </CardTitle>
                  <CardDescription className={`text-sm ${
                    selectedType === type.id ? "text-white/80" : "text-gray-400"
                  }`}>
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`text-xs font-medium ${
                    selectedType === type.id ? "text-white/70" : "text-gray-500"
                  }`}>
                    Dimensions: {type.dimensions}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Type Display */}
          {selectedType && (
            <div className="text-center p-4 bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-lg text-gray-300">
                Creating: <span className="font-bold capitalize bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">{selectedType}</span>
              </p>
            </div>
          )}

          {/* Input Section */}
          {selectedType && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              
              {/* Text Input */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Wand2 className="h-5 w-5 text-pink-400" />
                    <span>Describe Your Vision</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Be specific about colors, style, mood, and elements you want
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-orange-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                    <Textarea
                      placeholder="✨ Example: A vibrant YouTube thumbnail featuring a surprised person with dynamic text 'YOU WON'T BELIEVE THIS!' in bold yellow letters, energetic background with lightning effects..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="relative min-h-[120px] bg-slate-900/90 backdrop-blur-md border border-pink-500/20 rounded-xl resize-none text-gray-100 placeholder:text-gray-500 transition-all duration-300 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
                      disabled={loading}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      {prompt.length > 0 && `${prompt.length} characters`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload Section */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-blue-400" />
                    <span>Reference Images (Optional)</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload images for style reference or elements to include
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Button */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={loading}
                    />
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-pink-500/50 hover:bg-white/5 transition-all duration-300 text-center group">
                      <Upload className="h-12 w-12 text-gray-400 group-hover:text-pink-400 mx-auto mb-3 transition-colors" />
                      <p className="text-gray-300 font-medium mb-1">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  </label>

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-slate-800 border border-white/10">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <p className="text-xs text-gray-400 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200 text-center animate-in fade-in duration-300">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <Card className="bg-gradient-to-br from-pink-900/30 to-orange-900/30 border border-pink-500/30 backdrop-blur-sm animate-in fade-in duration-500">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Loader2 className="h-8 w-8 text-pink-400 animate-spin" />
                        <p className="text-xl font-semibold text-white">AI is painting your vision...</p>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-pink-500 h-2 rounded-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
                      </div>
                      <p className="text-center text-gray-400 text-sm">This may take 10-30 seconds depending on complexity</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Generated Result */}
              {generatedImage && !loading && (
                <Card className="bg-gradient-to-br from-slate-900/90 to-pink-900/20 border border-pink-500/40 backdrop-blur-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Sparkles className="h-6 w-6 text-pink-400" />
                        <span>Your AI-Generated {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</span>
                      </CardTitle>
                      <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-300">Ready</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Generated Image Display */}
                    <div className="relative rounded-xl overflow-hidden border-2 border-pink-500/30 shadow-2xl group">
                      <img
                        src={generatedImage}
                        alt="Generated content"
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                        <Upload className="w-4 h-4 mr-2" />
                        Save to Library
                      </Button>
                      <Button 
                        onClick={handleGenerate}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button 
                        onClick={() => {
                          setGeneratedImage(null);
                          setPrompt("");
                          setUploadedImages([]);
                          setSelectedType("");
                        }}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 rounded-full px-6"
                      >
                        Start Over
                      </Button>
                    </div>

                    {/* Tips Section */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-sm text-blue-300 flex items-start space-x-2">
                        <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Pro Tip:</strong> Try different prompts or add reference images to get varied results. You can regenerate as many times as you want!
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />

      {/* Custom Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Cre8Canvas;

