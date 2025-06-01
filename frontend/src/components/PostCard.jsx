import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { HeartCrack, Eye, TriangleAlert, Play, Pause } from 'lucide-react';
import { usePost } from '../contexts/PostContext';
import { useViewLimit } from '../contexts/ViewLimitContext';
import { Axios } from '../axiosinstance';

const PostCard = ({ id, title, tag, warning, content, relatableCount, views: initialViews, userRelated, isAudio, audioPath }) => {
  const [expanded, setExpanded] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const previewLimit = 100;
  const safeContent = content || '';
  const { toggleRelatable, incrementViewCount: apiIncrementViewCount } = usePost();
  const { incrementViewCount: checkAndIncrementViewLimit, hasReachedLimit } = useViewLimit();
  
  // Existing state variables
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewCount, setViewCount] = useState(initialViews || 0);
  const audioRef = useRef(null);
  
  // Load audio when expanded and component mounts
  useEffect(() => {
    if (expanded && isAudio && audioPath && !audioUrl) {
      loadAudio();
    }
  }, [expanded, isAudio, audioPath, audioUrl]);

  // Update local view count when prop changes
  useEffect(() => {
    setViewCount(initialViews || 0);
  }, [initialViews]);
  
  // Load audio directly from static server
  const loadAudio = async () => {
    if (!audioPath) return;
    
    setLoadingAudio(true);
    try {
      // Construct URL directly to the audio file on the server
      // Using the base URL from environment or hardcoded localhost:3000
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      // Ensure we're using the direct filename from audioPath without additional path segments
      const url = `${baseUrl}/${audioPath}`;
      console.log('Loading audio from:', url); // For debugging
      setAudioUrl(url);
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setLoadingAudio(false);
    }
  };
  
  const togglePlayback = (e) => {
    e.stopPropagation(); // Prevent card expansion
    
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

  // Check the view limit first, then handle the expansion
  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // First check: If already expanded, just collapse
    if (expanded) {
      setExpanded(false);
      return;
    }
    
    // Second check: If warning content and not expanded, show warning
    if (warning && !expanded) {
      // Before showing warning, check if we've reached the limit
      if (hasReachedLimit) {
        setIsLimitExceeded(true);
        setShowWarningModal(true);
        return;
      }
      // If we have warnings but haven't reached limit, show content warning
      setShowWarningModal(true);
      return;
    }
    
    // Third check: If we've reached the limit and trying to expand
    if (hasReachedLimit && !expanded) {
      setIsLimitExceeded(true);
      setShowWarningModal(true);
      return;
    }
    
    // If we get here, we can expand the post
    handleExpand();
  };

  const handleExpand = async () => {
    // Check if user has reached daily limit
    const canView = checkAndIncrementViewLimit(id);
    
    if (!canView) {
      setIsLimitExceeded(true);
      setShowWarningModal(true);
      return;
    }
    
    try {
      // Call the incrementViewCount function from context
      await apiIncrementViewCount(id);
    } catch (error) {
      console.error("Error incrementing view count:", error);
      // Fallback to incrementing locally if API fails
      setViewCount(prev => prev + 1);
    }
    
    setExpanded(true);
  };
  
  const handleConfirm = () => {
    setShowWarningModal(false);
    
    // Only proceed if user hasn't reached limit
    if (!isLimitExceeded) {
      handleExpand();
    }
  };
  
  const handleCancel = (e) => {
    e.stopPropagation();
    setShowWarningModal(false);
  };
  
  const truncatedContent = safeContent.length > previewLimit
    ? safeContent.slice(0, previewLimit) + '...'
    : safeContent;

  return (
    <>
      <div
        className={`bg-sage rounded-xl p-4 border border-cream transition-all duration-300 ${hasReachedLimit && !expanded ? 'opacity-70' : 'cursor-pointer'}`}
        onClick={handleCardClick}
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

      {/* Warning/Limit Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-sage border-cream border rounded-xl p-6 max-w-xs w-full text-center shadow-xl">
            <div className="flex flex-col items-center gap-2 mb-4">
              {isLimitExceeded ? (
                // Daily limit exceeded modal
                <>
                  <TriangleAlert size={32} className="text-red-500" />
                  <h4 className="text-lg font-bold text-linen">Daily Limit Reached</h4>
                </>
              ) : (
                // Content warning modal
                <>
                  <TriangleAlert size={32} className="text-amber-300" />
                  <h4 className="text-lg font-bold text-amber-300">Warning</h4>
                </>
              )}
            </div>
            
            <p className="text-linen mb-6">
              {isLimitExceeded 
                ? "You've reached your daily post view limit. Please come back tomorrow to view more posts."
                : "This post may contain disturbing or sensitive content. Are you sure you want to continue?"
              }
            </p>
            
            <div className="flex justify-center gap-4">
              {!isLimitExceeded && (
                <button
                  className="px-4 py-2 rounded-lg bg-amber-300 text-midnight font-bold hover:bg-amber-200 transition"
                  onClick={handleConfirm}
                >
                  Continue
                </button>
              )}
              <button
                className="px-4 py-2 rounded-lg border border-cream text-cream hover:bg-cream hover:text-sage transition"
                onClick={handleCancel}
              >
                {isLimitExceeded ? 'Close' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

PostCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  tag: PropTypes.string,
  warning: PropTypes.bool,
  content: PropTypes.string,
  relatableCount: PropTypes.number,
  views: PropTypes.number,
  userRelated: PropTypes.bool,
  isAudio: PropTypes.bool,
  audioPath: PropTypes.string,
};

export default PostCard;
