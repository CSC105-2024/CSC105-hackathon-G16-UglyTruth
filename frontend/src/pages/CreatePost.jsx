import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePost } from '../contexts/PostContext';
import { Mic, FileAudio, Send, Loader2 } from 'lucide-react';

const CreatePost = () => {
  const { isAuthenticated } = useAuth();
  const { createPost, isLoading } = usePost();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingMethod, setRecordingMethod] = useState(null); // null, 'text', or 'audio'
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsProcessing(true);
      
      if (recordingMethod === 'text') {
        // Handle text submission
        if (!title.trim() || !description.trim()) {
          setError('Please provide both title and description');
          setIsProcessing(false);
          return;
        }
        
        await createPost({ title, description });
        navigate('/');
      } 
      else if (recordingMethod === 'audio' && audioBlob) {
        // Handle audio submission
        if (!title.trim()) {
          setError('Please provide a title for your audio');
          setIsProcessing(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('audio', audioBlob, 'recording.mp3');
        
        // The createPost function in PostContext should handle FormData
        await createPost(formData, true);
        navigate('/');
      } 
      else {
        setError('Please either record audio or write your experience');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post');
      setIsProcessing(false);
    }
  };

  const selectTextMethod = () => {
    setRecordingMethod('text');
    stopRecording();
    setAudioBlob(null);
  };

  const selectAudioMethod = () => {
    setRecordingMethod('audio');
    setDescription('');
  };

  const resetRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
  };

  return (    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Share Your Experience</h1>
      
      <p className="text-sm text-gray-600 mb-4">
        Your post will be automatically categorized based on its content. Share your experience and let our system determine the most appropriate category.
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Title field - always visible */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a title for your experience"
            disabled={isProcessing}
          />
        </div>
        
        {/* Method selection if not yet chosen */}
        {!recordingMethod && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-3">How would you like to share your experience?</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={selectTextMethod}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send size={18} />
                Write Text
              </button>
              <button
                type="button"
                onClick={selectAudioMethod}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Mic size={18} />
                Record Audio
              </button>
            </div>
          </div>
        )}
        
        {/* Text input section */}
        {recordingMethod === 'text' && (
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Your Experience
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share your experience here..."
              disabled={isProcessing}
            ></textarea>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setRecordingMethod(null)}
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Switch method
              </button>
            </div>
          </div>
        )}
        
        {/* Audio recording section */}
        {recordingMethod === 'audio' && (
          <div className="mb-6">
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {audioBlob ? 'Recording Complete' : 'Record Your Experience'}
              </p>
              
              {/* Recording controls */}
              <div className="flex flex-col items-center">
                {!audioBlob ? (
                  <>
                    {isRecording ? (
                      <div className="mb-3 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2 animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-red-500"></div>
                        </div>
                        <p className="text-xl font-mono">{formatTime(recordingTime)}</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2 hover:bg-gray-300"
                      >
                        <Mic className="h-8 w-8 text-gray-700" />
                      </button>
                    )}
                    
                    <div className="flex gap-4 mt-2">
                      {isRecording && (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Stop Recording
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="mb-3 flex justify-center">
                      <FileAudio className="h-10 w-10 text-blue-500" />
                    </div>
                    <audio controls className="w-full mb-3">
                      <source src={URL.createObjectURL(audioBlob)} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={resetRecording}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Record Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setRecordingMethod(null)}
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Switch method
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Submit button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isProcessing || isLoading || (recordingMethod === 'audio' && !audioBlob) || !recordingMethod}
            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (isProcessing || isLoading || (recordingMethod === 'audio' && !audioBlob) || !recordingMethod) ? 
              'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Share Experience</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

<<<<<<< HEAD
export default CreatePost;
=======
export default CreatePost;
>>>>>>> 91a5adba86ffa9220e8a52eb449fa1fad2741a0a
