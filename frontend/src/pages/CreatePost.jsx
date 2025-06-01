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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
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
          <div className=" max-w-3xl mx-auto p-6 rounded-2xl shadow-md border border-cream bg-sage">
            <p className="items-center text-4xl font-pica text-cream mb-2">Share Your Experience</p>
            <p className="text-sm text-linen mb-4">
              Your post will be automatically categorized based on its content. Share your experience and let our system determine the most appropriate category.
            </p>

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
                    className="w-full px-4 py-2 border border-cream bg-cream text-midnight rounded-xl shadow-inner placeholder:text-midnight/40 focus:ring-2 focus:ring-midnight focus:outline-none"
                    placeholder="Type your thoughts here..."
                  ></textarea>
                </div>
              )}

              {mode === 'audio' && (
              <div className="mb-6">
                <p className="text-xl font-medium text-cream mb-2">Record Your Experience</p>
                <div className="border border-cream rounded-xl p-4 bg-cream shadow-inner">
                  {/* Recording Waveform */}
                  <div className="flex justify-center items-center space-x-1 h-12 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full bg-red-500 animate-wave`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>

                  {/* Timer */}
                  <p className="text-center text-lg font-mono text-midnight">00:00</p>

                  {/* Stop Button */}
                  <div className="flex justify-center mt-3">
                    <button
                      type="button"
                      className="px-4 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    >
                      Stop Recording
                    </button>
                  </div>

                  {/* Playback + Record Again */}
                  <div className="mt-6 text-center">
                    <audio
                      controls
                      className="w-full rounded-md overflow-hidden custom-audio"
                    >
                      <source src="#" type="audio/mp3" />
                    </audio>
                    
                    <button
                      type="button"
                      className="mt-2 text-sm border border-sage text-sage rounded-md px-3 py-1 hover:bg-sage hover:text-cream transition"
                    >
                      Record Again
                    </button>
                  </div>
                </div>
              </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
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
