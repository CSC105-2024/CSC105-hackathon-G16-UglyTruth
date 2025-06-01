import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePost } from '../contexts/PostContext';
import { Mic, FileAudio, Eye, Loader2 } from 'lucide-react';
import SideBar from '../components/SideBar';
import SideBarMobile from '../components/SideBarMobile';
import useIsMobile from '../hooks/useIsMobile';
import { Menu } from 'lucide-react';

const CreatePost = () => {
  const { isAuthenticated } = useAuth();
  const { createPost, isLoading } = usePost();
  const navigate = useNavigate();
  
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mode, setMode] = useState('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Audio recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Set document title
  useEffect(() => {
    document.title = 'UglyTruth - Share Your Experience';
    return () => {
      // Cleanup: stop any active recording when component unmounts
      stopRecording();
    };
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const startRecording = async () => {
    try {
      setError('');
      
      // Reset any previous recording
      audioChunksRef.current = [];
      setAudioBlob(null);
      setRecordingTime(0);
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        
        // Release stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Release stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const resetRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const handleSubmit = async (e, isPrivate = false) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsProcessing(true);
      
      if (mode === 'text') {
        // Handle text submission
        if (!title.trim() || !description.trim()) {
          setError('Please provide both title and description');
          setIsProcessing(false);
          return;
        }
        
        await createPost({ 
          title, 
          description, 
          isPublic: !isPrivate  // Set isPublic based on the parameter
        });
        navigate('/');
      } 
      else if (mode === 'audio' && audioBlob) {
        // Handle audio submission
        if (!title.trim()) {
          setError('Please provide a title for your audio');
          setIsProcessing(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('audio', audioBlob, 'recording.mp3');
        formData.append('isPublic', !isPrivate); // Set isPublic based on the parameter
        
        // The createPost function in PostContext should handle FormData
        await createPost(formData, true);
        navigate('/');
      } 
      else if (mode === 'audio' && !audioBlob) {
        setError('Please record audio before submitting');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post');
      setIsProcessing(false);
    }
  };

  if (isMobile) {
    return (
      <div className="relative flex flex-col h-screen w-screen bg-midnight text-cream font-nunito overflow-hidden">
        {/* Sidebar Mobile Drawer */}
        <SideBarMobile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cream">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
            <h1 className="text-2xl font-pica">Create Post</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-md border border-cream bg-sage">
            <p className="items-center text-4xl font-pica text-cream mb-2">Share Your Experience</p>
            <p className="text-sm text-linen mb-4">
              Your post will be automatically categorized based on its content. Share your experience and let our system determine the most appropriate category.
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Method Selection */}
            <div className="mb-6">
              <p className="text-xl text-cream font-medium mb-3">How would you like to share your experience?</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMode('text')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl shadow-sm text-sm font-medium transition-all
                    ${mode === 'text'
                      ? 'bg-cream text-sage border-cream'
                      : 'bg-sage text-cream border-cream hover:bg-cream hover:text-sage'}
                  `}
                >
                  Write Text
                </button>
                <button
                  type="button"
                  onClick={() => setMode('audio')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl shadow-sm text-sm font-medium transition-all
                    ${mode === 'audio'
                      ? 'bg-cream text-sage border-cream'
                      : 'bg-sage text-cream border-cream hover:bg-cream hover:text-sage'}
                  `}
                >
                  Record Audio
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <div className="">
                <label htmlFor="title" className="block text-xl font-medium text-cream mb-">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 rounded-xl border border-cream bg-cream text-midnight shadow-inner placeholder:text-midnight/40 focus:ring-2 focus:ring-midnight focus:outline-none mb-3"
                  placeholder="Give your experience a title"
                />
              </div>

              {/* Conditional Inputs */}
              {mode === 'text' && (
                <div className="mb-6">
                  <label htmlFor="description" className="block text-xl font-medium text-cream mb-1">Your Experience</label>
                  <textarea
                    id="description"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 border border-cream bg-cream text-midnight rounded-xl shadow-inner placeholder:text-midnight/40 focus:ring-2 focus:ring-midnight focus:outline-none"
                    placeholder="Type your thoughts here..."
                  ></textarea>
                </div>
              )}

              {mode === 'audio' && (
                <div className="mb-6">
                  <p className="text-xl font-medium text-cream mb-2">Record Your Experience</p>
                  <div className="border border-cream rounded-xl p-4 bg-cream shadow-inner text-midnight">
                    {!audioBlob ? (
                      <>
                        {isRecording ? (
                          <>
                            {/* Recording Waveform */}
                            <div className="flex justify-center items-center space-x-1 h-12 mb-4">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="h-8 w-1 rounded-full bg-red-500 animate-pulse"
                                  style={{ animationDelay: `${i * 0.1}s` }}
                                ></div>
                              ))}
                            </div>

                            {/* Timer */}
                            <p className="text-center text-lg font-mono text-midnight">{formatTime(recordingTime)}</p>

                            {/* Stop Button */}
                            <div className="flex justify-center mt-3">
                              <button
                                type="button"
                                onClick={stopRecording}
                                className="px-4 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                              >
                                Stop Recording
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <button
                              type="button"
                              onClick={startRecording}
                              className="p-6 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-all"
                            >
                              <Mic size={36} className="text-white" />
                            </button>
                            <p className="mt-4 text-midnight">Click to start recording</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mt-6 text-center">
                        <audio
                          controls
                          className="w-full rounded-md overflow-hidden custom-audio"
                        >
                          <source src={URL.createObjectURL(audioBlob)} type="audio/mp3" />
                        </audio>
                        
                        <button
                          type="button"
                          onClick={resetRecording}
                          className="mt-2 text-sm bg-sage border border-cream text-cream rounded-md px-3 py-1 hover:bg-cream hover:text-sage transition"
                        >
                          Record Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex gap-4">
                <button
                  type="button"  // Changed from submit to button
                  onClick={(e) => {
                    handleSubmit(e, true); // Pass true to make it private
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-midnight bg-midnight text-cream font-medium text-sm rounded-xl shadow-md hover:bg-midnight/90 transition"
                >
                  Save Privately
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || isLoading || (mode === 'audio' && !audioBlob)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 border border-midnight bg-midnight text-cream font-medium text-sm rounded-xl shadow-md hover:bg-midnight/90 transition
                    ${(isProcessing || isLoading || (mode === 'audio' && !audioBlob)) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={(e) => {
                    handleSubmit(e, false); // Pass false to make it public
                  }}
                >
                  {isProcessing || isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Share Experience'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex h-full bg-midnight text-cream font-nunito">
      <div className="w-[320px]">
        <SideBar />
      </div>
      <div className="flex-1 min-h-screen min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
        <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-md border border-cream bg-sage">
          <p className="items-center text-4xl font-pica text-cream mb-2">Share Your Experience</p>
          <p className="text-sm text-linen mb-4">
            Your post will be automatically categorized based on its content. Share your experience and let our system determine the most appropriate category.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Method Selection */}
          <div className="mb-6">
            <p className="text-xl text-cream font-medium mb-3">How would you like to share your experience?</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMode('text')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl shadow-sm text-sm font-medium transition-all
                  ${mode === 'text'
                    ? 'bg-cream text-sage border-cream'
                    : 'bg-sage text-cream border-cream hover:bg-cream hover:text-sage'}
                `}
              >
                Write Text
              </button>
              <button
                type="button"
                onClick={() => setMode('audio')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl shadow-sm text-sm font-medium transition-all
                  ${mode === 'audio'
                    ? 'bg-cream text-sage border-cream'
                    : 'bg-sage text-cream border-cream hover:bg-cream hover:text-sage'}
                `}
              >
                Record Audio
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <div className="mb-3">
              <label htmlFor="title" className="block text-xl font-medium text-cream mb-1">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isProcessing}
                className="w-full px-4 py-2 rounded-xl border border-cream bg-cream text-midnight shadow-inner placeholder:text-midnight/40 focus:ring-2 focus:ring-midnight focus:outline-none"
                placeholder="Give your experience a title"
              />
            </div>

            {/* Conditional Inputs */}
            {mode === 'text' && (
              <div className="mb-6">
                <label htmlFor="description" className="block text-xl font-medium text-cream mb-1">Your Experience</label>
                <textarea
                  id="description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 border border-cream bg-cream text-midnight rounded-xl shadow-inner placeholder:text-midnight/40 focus:ring-2 focus:ring-midnight focus:outline-none"
                  placeholder="Type your thoughts here..."
                ></textarea>
              </div>
            )}

            {mode === 'audio' && (
              <div className="mb-6">
                <p className="text-xl font-medium text-cream mb-2">Record Your Experience</p>
                <div className="border border-cream rounded-xl p-4 bg-cream shadow-inner text-midnight">
                  {!audioBlob ? (
                    <>
                      {isRecording ? (
                        <>
                          {/* Recording Waveform */}
                          <div className="flex justify-center items-center space-x-1 h-12 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="h-8 w-1 rounded-full bg-red-500 animate-pulse"
                                style={{ animationDelay: `${i * 0.1}s` }}
                              ></div>
                            ))}
                          </div>

                          {/* Timer */}
                          <p className="text-center text-lg font-mono text-midnight">{formatTime(recordingTime)}</p>

                          {/* Stop Button */}
                          <div className="flex justify-center mt-3">
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="px-4 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                            >
                              Stop Recording
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <button
                            type="button"
                            onClick={startRecording}
                            className="p-6 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-all"
                          >
                            <Mic size={36} className="text-white" />
                          </button>
                          <p className="mt-4 text-midnight">Click to start recording</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mt-6 text-center">
                      <audio
                        controls
                        className="w-full rounded-md overflow-hidden custom-audio"
                      >
                        <source src={URL.createObjectURL(audioBlob)} type="audio/mp3" />
                      </audio>
                      
                      <button
                        type="button"
                        onClick={resetRecording}
                        className="mt-2 text-sm bg-sage border border-cream text-cream rounded-md px-3 py-1 hover:bg-cream hover:text-sage transition"
                      >
                        Record Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex gap-4">
              
              <button
                type="submit"
                disabled={isProcessing || isLoading || (mode === 'audio' && !audioBlob)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 border border-midnight bg-midnight text-cream font-medium text-sm rounded-xl shadow-md hover:bg-midnight/90 transition
                  ${(isProcessing || isLoading || (mode === 'audio' && !audioBlob)) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={(e) => {
                  handleSubmit(e, false); // Pass false to make it public
                }}
              >
                {isProcessing || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Share Experience'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
