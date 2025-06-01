import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { HeartCrack, Eye, TriangleAlert, Play, Pause } from 'lucide-react';
import { usePost } from '../contexts/PostContext';
import { Axios } from '../axiosinstance';

// Update the props to include id, relatableCount, isAudio and audioPath
const PostCard = ({ id, title, tag, warning, content, relatableCount, views: initialViews, userRelated, isAudio, audioPath }) => {
  const [expanded, setExpanded] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const previewLimit = 100;
  const safeContent = content || '';
  const { toggleRelatable, incrementViewCount } = usePost();
  
  // Missing state variables
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [loadingAudio, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewCount, setViewCount] = useState(initialViews || 0);
  const audioRef = useRef(null);
  
  // Load audio when expanded and component mounts
  useEffect(() => {
    if (expanded && isAudio && audioPath && !audioLoaded && !audioUrl) {
      loadAudio();
    }
  }, [expanded, isAudio, audioPath, audioLoaded, audioUrl]);

  // Update local view count when prop changes
  useEffect(() => {
    setViewCount(initialViews || 0);
    console.log("Initial view count set to:", initialViews);
  }, [initialViews]);
  
  // Load audio directly from static server
  const loadAudio = async () => {
    try {
      setAudioLoading(true);
      
      if (!audioPath) {
        console.error("No audio path provided for post:", id);
        setAudioLoading(false);
        return;
      }
      
      console.log("Loading audio for path:", audioPath);
      // Direct URL to audio file
      const directUrl = `http://localhost:3000/${audioPath}`;
      
      setAudioUrl(directUrl);
      setAudioLoaded(true);
      setAudioLoading(false);
    } catch (error) {
      console.error("Error loading audio:", error);
      setAudioLoading(false);
    }
  };
  
  // Audio control functions
  const togglePlayback = (e) => {
    e.stopPropagation();
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Prevent event propagation to avoid expanding the card when clicking the button
  const handleToggle = (e) => {
    e.stopPropagation();
    toggleRelatable(id);
  };

  const handleExpand = async () => {
    // Only increment view when expanding, not when collapsing
    if (!expanded) {
      try {
        // Call the incrementViewCount function from context
        await incrementViewCount(id);
        
        // No need to manually update view count here since it will be
        // updated in the context state, which will propagate to props
      } catch (error) {
        console.error("Error incrementing view count:", error);
        // Fallback to incrementing locally if API fails
        setViewCount(prev => prev + 1);
      }
    }
    setExpanded(!expanded);
  };
  
  const truncatedContent = safeContent.length > previewLimit
    ? safeContent.slice(0, previewLimit) + '...'
    : safeContent;

  const handleCardClick = () => {
    if (warning && !expanded) {
      setShowWarningModal(true);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  const handleConfirm = () => {
    setShowWarningModal(false);
    setExpanded(true);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowWarningModal(false);
  };

  return (
    <>
      <div
        className="bg-sage rounded-xl p-4 border border-cream cursor-pointer transition-all duration-300"
        onClick={(e) => { handleCardClick(e); handleExpand(e); }}
      >
        <h3 className="text-lg font-bold text-linen mb-2">{title}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cream text-midnight px-2 py-0.5 rounded-full text-xs font-black">{tag}</span>
          {warning && (
            <span className="border border-2 border-amber-300 text-amber-300 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <TriangleAlert size={14}/>
              Warning
            </span>
          )}
          {isAudio && (
            <span className="border border-2 border-blue-300 text-blue-300 px-2 py-0.5 rounded-full text-xs font-semibold">
              Audio
            </span>
          )}
        </div>

        {expanded && isAudio && (
          <div className="mb-4">
            {loadingAudio ? (
              <div className="py-3 text-linen text-sm">Loading audio...</div>
            ) : audioUrl ? (
              <>
                <audio 
                  ref={audioRef} 
                  controls
                  className="w-full mb-2" 
                  src={audioUrl} 
                  onEnded={() => setIsPlaying(false)}
                />
                <button 
                  onClick={togglePlayback}
                  className="bg-midnight text-linen px-3 py-2 rounded-lg flex items-center gap-2 mt-2"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {isPlaying ? 'Pause' : 'Play'} Audio
                </button>
              </>
            ) : (
              <div className="py-3 text-amber-300 text-sm">
                Audio unavailable. Path: {audioPath || "none"}
              </div>
            )}
          </div>
        )}

        <p className="text-linen text-sm mb-4">
          {expanded ? safeContent : truncatedContent}
        </p>

        <div className="flex items-center justify-between text-sm text-linen font-semibold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Eye size={16} /> {viewCount}</span>
            <span className="flex items-center gap-1"><HeartCrack size={16}/> {relatableCount}</span>
          </div>

          {expanded && (
            <button 
              onClick={handleToggle} 
              className={`bg-linen text-midnight font-pica px-3 py-1 rounded-xl cursor-pointer transition-colors ${
                userRelated ? 'bg-cream text-midnight' : 'bg-linen text-midnight'
              }`}
            >
              {userRelated ? 'Related' : 'Relatable'}
            </button>
          )}
        </div>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-sage border-cream border rounded-xl p-6 max-w-xs w-full text-center shadow-xl">
            <div className="flex flex-col items-center gap-2 mb-4">
              <TriangleAlert size={32} className="text-amber-300" />
              <h4 className="text-lg font-bold text-amber-300">Warning</h4>
            </div>
            <p className="text-linen mb-6">
              This post may contain disturbing or sensitive content.<br />
              Are you sure you want to continue?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-amber-300 text-midnight font-bold hover:bg-amber-200 transition"
                onClick={handleConfirm}
              >
                Continue
              </button>
              <button
                className="px-4 py-2 rounded-lg border border-cream text-cream hover:bg-cream hover:text-sage transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Fix duplicate PropTypes definitions
PostCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  warning: PropTypes.bool,
  content: PropTypes.string.isRequired,
  relatableCount: PropTypes.number,
  views: PropTypes.number,
  userRelated: PropTypes.bool,
  isAudio: PropTypes.bool,
  audioPath: PropTypes.string
};

PostCard.defaultProps = {
  warning: false,
  relatableCount: 0,
  views: 0,
  userRelated: false,
  isAudio: false,
  audioPath: null
};

export default PostCard;
