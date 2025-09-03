import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlatformCard } from "./PlatformCard";
import { Youtube, Instagram, Twitter, Linkedin, Send, Paperclip } from "lucide-react";

const platforms = [
  {
    id: "youtube",
    title: "YouTube",
    description: "Long-form video content",
    icon: <Youtube className="w-10 h-10" />,
  },
  {
    id: "instagram",
    title: "Instagram",
    description: "Visual storytelling with engaging captions",
    icon: <Instagram className="w-full h-full" />,
  },
  {
    id: "twitter",
    title: "Twitter",
    description: "Concise, viral-worthy posts and threads",
    icon: <Twitter className="w-full h-full" />,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description: "Professional insights and thought leadership",
    icon: <Linkedin className="w-full h-full text-cre8-purple" />,
  },
];

export function ContentGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showTranscriptRequest, setShowTranscriptRequest] = useState(false);
  const [savedOutputs, setSavedOutputs] = useState([]);

  const handleSave = async (output) => {
    try {
      // Note: Using the correct backend URL
      const res = await fetch("http://localhost:6969/save_output", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(output),
      });

      if (res.ok) {
        setSavedOutputs([...savedOutputs, output]);
        setResult(null);
        console.log("Content saved successfully");
      } else {
        const errorData = await res.json();
        console.error("Failed to save output:", errorData);
        setError(`Failed to save: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving output:", error);
      setError(`Save error: ${error.message}`);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPlatform || !prompt.trim()) {
      setError("Please select a platform and enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      console.log("Making request to backend...");
      
      const requestBody = {
        platform: selectedPlatform,
        prompt: prompt.trim(),
        personify: showTranscriptRequest,
        iterations: 3
      };

      console.log("Request body:", requestBody);

      const res = await fetch("http://localhost:6969/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Generated Content Response:", data);
      
      if (data.content) {
        setResult(data.content);
      } else {
        throw new Error("No content received from server");
      }
    } catch (err) {
      console.error("Error generating content:", err);
      setError(`Generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
          Hey! Content Creator
        </h1>
        <p className="text-xl text-muted-foreground">
          What platform can I help you create content for?
        </p>
      </div>

      {/* Platform Selection */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform.id as "youtube" | "instagram" | "twitter" | "linkedin"}
            title={platform.title}
            description={platform.description}
            onSelect={() => {
              setSelectedPlatform(platform.id);
              setError("");
            }}
            setShowTranscriptRequest={setShowTranscriptRequest}
            showTranscriptRequest={showTranscriptRequest}
          />
        ))}
      </div>

      {/* Selected Platform Display */}
      {selectedPlatform && (
        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
          <p className="text-lg text-gray-200">
            Selected Platform: <span className="font-bold capitalize text-white">{selectedPlatform}</span>
          </p>
        </div>
      )}

      {/* Content Input */}
      {selectedPlatform && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="relative">
            <Textarea
              placeholder="Describe the content you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-white/20 backdrop-blur-md rounded-2xl resize-none text-gray-100 placeholder:text-white/40 transition-all duration-300"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="bg-gray-800 rounded-full hover:bg-white hover:text-black"
              >
                <Paperclip className="w-4 h-4 mr-2" />
                Attach file
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading || !selectedPlatform}
                className="bg-gray-800 rounded-full hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl text-center">
              <div className="animate-pulse">
                <p className="text-gray-300">Generating content for {selectedPlatform}...</p>
                <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="mt-6 p-4 bg-gray-800 text-gray-100 rounded-xl shadow">
              <h4 className="font-bold text-lg text-white">{result.title}</h4>
              <p className="text-sm text-gray-400 mb-2">
                {result.type?.replace('_', ' ').toUpperCase()} • {result.platform?.toUpperCase()}
              </p>

              {result.description && (
                <p className="mb-3 text-gray-300 text-sm">{result.description}</p>
              )}

              <div className="border-t border-gray-600 pt-4 mt-4">
                <pre className="whitespace-pre-wrap font-sans text-gray-100 leading-relaxed">
                  {result.content}
                </pre>
              </div>

              {/* Save + Discard Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-600">
                <button
                  onClick={() => handleSave(result)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Content
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}

          {/* Saved Outputs Display */}
          {savedOutputs.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Saved Content</h3>
              <div className="space-y-3">
                {savedOutputs.map((output, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-white">{output.title}</h4>
                    <p className="text-sm text-gray-300">{output.platform} • {output.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}