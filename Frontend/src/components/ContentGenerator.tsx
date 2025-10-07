import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlatformCard } from "./PlatformCard";
import { Youtube, Instagram, Twitter, Linkedin, Send, StopCircle, Sparkles, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const [streaming, setStreaming] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showTranscriptRequest, setShowTranscriptRequest] = useState(false);
  const [savedOutputs, setSavedOutputs] = useState([]);
  
  // Streaming states
  const [streamingContent, setStreamingContent] = useState("");
  const [currentIteration, setCurrentIteration] = useState(0);
  const [maxIterations, setMaxIterations] = useState(3);
  const [streamingStatus, setStreamingStatus] = useState("");
  const [critiques, setCritiques] = useState([]);
  const [progress, setProgress] = useState(0);
  
  // Ref to abort streaming
  const abortControllerRef = useRef(null);

  const handleSave = async (output) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_AI_WORKFLOW_URL || 'http://localhost:7000'}/save_output`, {
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

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setStreaming(false);
    setStreamingStatus("Stopped by user");
  };

  const resetStreamingState = () => {
    setStreamingContent("");
    setCurrentIteration(0);
    setStreamingStatus("");
    setCritiques([]);
    setProgress(0);
    setError("");
    setResult(null);
  };

  const handleStreamingGenerate = async () => {
    if (!selectedPlatform || !prompt.trim()) {
      setError("Please select a platform and enter a prompt");
      return;
    }

    setLoading(true);
    setStreaming(true);
    resetStreamingState();

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      console.log("Starting streaming generation...");
      
      const requestBody = {
        platform: selectedPlatform,
        prompt: prompt.trim(),
        personify: showTranscriptRequest,
        iterations: 3
      };

      const response = await fetch(`${import.meta.env.VITE_AI_WORKFLOW_URL || 'http://localhost:6969'}/generate-stream`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "text/plain"
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                setError(data.error);
                setLoading(false);
                setStreaming(false);
                return;
              }

              // Handle different message types
              if (data.status) {
                switch (data.status) {
                  case 'starting':
                    setStreamingStatus("Starting content generation...");
                    setProgress(10);
                    break;
                  case 'generating':
                    setStreamingStatus(`Generating content (Iteration ${data.iteration}/${data.max_iterations})`);
                    setCurrentIteration(data.iteration);
                    setMaxIterations(data.max_iterations);
                    setProgress(20 + (data.iteration / data.max_iterations) * 30);
                    break;
                  case 'content_streaming':
                    setStreamingStatus("Streaming content...");
                    setProgress(50);
                    break;
                  case 'critiquing':
                    setStreamingStatus("Getting feedback from AI critic...");
                    setProgress(70);
                    break;
                  case 'improving':
                    setStreamingStatus("Improving content based on feedback...");
                    setProgress(40);
                    break;
                  case 'approved':
                    setStreamingStatus(`Content approved after ${data.iterations} iterations! ✅`);
                    setProgress(100);
                    break;
                }
              }

              // Handle streaming content tokens
              if (data.type === 'content_token') {
                setStreamingContent(prev => prev + data.token);
              }

              // Handle complete content
              if (data.type === 'content_complete') {
                setStreamingContent(data.content);
                setProgress(60);
              }

              // Handle critiques
              if (data.type === 'critique') {
                setCritiques(prev => [...prev, {
                  iteration: data.iteration,
                  critique: data.critique
                }]);
                setProgress(75);
              }

              // Handle final result
              if (data.type === 'final_result') {
                setResult(data.content);
                setStreamingStatus(data.status === 'APPROVED' ? 
                  `✅ Content approved after ${data.iterations} iterations!` : 
                  `⚠️ Max iterations reached (${data.iterations}). Content may need refinement.`
                );
                setProgress(100);
                setLoading(false);
                setStreaming(false);
              }

            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        setStreamingStatus("Generation cancelled");
      } else {
        console.error("Error in streaming generation:", err);
        setError(`Streaming failed: ${err.message}`);
      }
      setLoading(false);
      setStreaming(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">Powered by AI</span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
          Create Stunning Content
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Choose your platform and let AI craft personalized, engaging content in seconds
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
        <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-lg text-gray-300">
            Selected Platform: <span className="font-bold capitalize bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{selectedPlatform}</span>
          </p>
        </div>
      )}

      {/* Content Input */}
      {selectedPlatform && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
            <Textarea
              placeholder="✨ Describe the content you want to create... Be specific for best results!"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="relative min-h-[160px] bg-slate-900/90 backdrop-blur-md border border-purple-500/20 rounded-2xl resize-none text-gray-100 placeholder:text-gray-500 transition-all duration-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              disabled={loading}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {prompt.length > 0 && `${prompt.length} characters`}
              </div>
              {!loading ? (
                <Button
                  onClick={handleStreamingGenerate}
                  disabled={!prompt.trim() || !selectedPlatform}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Generate with AI
                </Button>
              ) : (
                <Button
                  onClick={stopStreaming}
                  className="bg-red-600 rounded-full hover:bg-red-700 text-white transition-all duration-300 shadow-lg"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Streaming Status */}
          {loading && (
            <div className="mt-6 p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <p className="text-gray-200 font-medium">{streamingStatus}</p>
                  </div>
                  <span className="text-sm text-purple-300 font-medium">
                    {currentIteration > 0 && `Iteration ${currentIteration}/${maxIterations}`}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500 relative animate-shimmer bg-[length:200%_100%]"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-300 mt-2 text-right">{progress}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Streaming Content Display */}
          {(streaming && streamingContent) && (
            <div className="mt-6 p-6 bg-gradient-to-br from-slate-900/90 to-purple-900/20 border border-purple-500/30 rounded-2xl backdrop-blur-sm shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-md opacity-50 animate-pulse"></div>
                    <Sparkles className="relative w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI is Crafting Your Content...
                  </h4>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-300 font-medium">Live</span>
                </div>
              </div>

              <div className="border-t border-purple-500/20 pt-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed text-[15px]">
                  {streamingContent}
                  {streaming && <span className="animate-pulse text-purple-400 font-bold">▊</span>}
                </pre>
              </div>
            </div>
          )}

          {/* Critiques Display */}
          {critiques.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-bold text-white">AI Feedback:</h4>
              {critiques.map((critique, index) => (
                <div key={index} className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-400 font-medium mb-1">
                    Iteration {critique.iteration} Feedback:
                  </p>
                  <p className="text-yellow-200 text-sm">{critique.critique}</p>
                </div>
              ))}
            </div>
          )}

          {/* Final Results Display */}
          {result && !streaming && (
            <div className="mt-6 p-6 bg-gradient-to-br from-slate-900/90 to-green-900/20 border border-green-500/40 rounded-2xl backdrop-blur-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h4 className="font-bold text-xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {result.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300">
                      {result.type?.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300">
                      {result.platform?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {result.description && (
                <p className="mb-4 text-gray-300 text-sm bg-slate-800/30 p-3 rounded-lg">{result.description}</p>
              )}

            <div className="border-t border-gray-600 pt-4 mt-4 prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-1" {...props} />,
                  p: ({node, ...props}) => <p className="text-gray-200 mb-2 leading-relaxed" {...props} />,
                  li: ({node, ...props}) => <li className="list-disc ml-6 text-gray-200" {...props} />,
                  code: ({node, inline = false, ...props}: {node: any; inline?: boolean; [key: string]: any}) => inline ? (
                    <code className="bg-gray-800 px-1 rounded text-pink-400" {...props} />
                  ) : (
                    <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto"><code {...props} /></pre>
                  )
                }}
              >
                {result.content}
              </ReactMarkdown>
            </div>


              {/* Save + Discard Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-600">
                <Button
                  onClick={() => handleSave(result)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Content
                </Button>
                <Button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Discard
                </Button>
                <Button
                  onClick={handleStreamingGenerate}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Regenerate
                </Button>
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