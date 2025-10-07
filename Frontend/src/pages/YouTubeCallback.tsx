import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function YouTubeCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your YouTube account...');
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent duplicate calls in StrictMode
      if (hasProcessed.current) return;
      hasProcessed.current = true;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authorization was denied or failed');
          toast({
            title: "YouTube Connection Failed",
            description: "You denied access or there was an error during authorization",
            variant: "destructive",
          });
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          toast({
            title: "YouTube Connection Failed",
            description: "No authorization code was received from YouTube",
            variant: "destructive",
          });
          return;
        }

        // Send the code to the backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/oauth/youtube/callback?code=${code}&state=${state}`);
        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage('YouTube account connected successfully!');
          toast({
            title: "YouTube Connected!",
            description: `Connected to ${result.channelInfo?.title || 'your YouTube channel'}`,
          });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Failed to connect YouTube account');
          toast({
            title: "Connection Failed",
            description: result.message || "Failed to connect your YouTube account",
            variant: "destructive",
          });
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred');
        toast({
          title: "Connection Error",
          description: "An unexpected error occurred while connecting your YouTube account",
          variant: "destructive",
        });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center">
        <div className="space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
              <h2 className="text-xl font-semibold text-white">Connecting YouTube</h2>
              <p className="text-white/70">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <h2 className="text-xl font-semibold text-white">Success!</h2>
              <p className="text-white/70">{message}</p>
              <p className="text-sm text-white/50">Redirecting to dashboard...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-400 mx-auto" />
              <h2 className="text-xl font-semibold text-white">Connection Failed</h2>
              <p className="text-white/70">{message}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
