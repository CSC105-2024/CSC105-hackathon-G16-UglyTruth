import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { HeartCrack, Eye, TriangleAlert, Play, Pause } from 'lucide-react';
import { usePost } from '../contexts/PostContext';
import { Axios } from '../axiosinstance';

// Update the props to include id, relatableCount, isAudio and audioPath
const PostCard = ({ id, title, tag, warning, content, relatableCount, views: initialViews, userRelated, isAudio, audioPath }) => {
  const [expanded, setExpanded] = useState(false);
  const [viewCount, setViewCount] = useState(initialViews || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef(null);
  
  const { toggleRelatable, incrementViewCount } = usePost();
  const previewLimit = 100;
  const safeContent = content || '';
  
  // Load audio when expanded and component mounts
  useEffect(() => {
    if (expanded && isAudio && audioPath && !audioLoaded && !audioUrl) {
      loadAudio();
    }
  }, [expanded, isAudio, audioPath, audioLoaded, audioUrl]);

  // Update local view count when prop changes
  useEffect(() => {
    setViewCount(initialViews || 0);
  }, [initialViews]);
  
  // Load audio directly from static server
  const loadAudio = async () => {
    try {
      setLoadingAudio(true);
      
      if (!audioPath) {
        console.error("No audio path provided for post:", id);
        setLoadingAudio(false);
        return;
      }
      
      console.log("Loading audio for path:", audioPath);
      // Direct URL to audio file
      const directUrl = `http://localhost:3000/${audioPath}`;
      
      setAudioUrl(directUrl);
      setAudioLoaded(true);
      setLoadingAudio(false);
    } catch (error) {
      console.error("Error loading audio:", error);
      setLoadingAudio(false);
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

  const handleExpand = () => {
    // Only increment view when expanding, not when collapsing
    if (!expanded) {
      incrementViewCount(id);
      setViewCount(prev => prev + 1);
    }
    setExpanded(!expanded);
  };
  
  const truncatedContent = safeContent.length > previewLimit
    ? safeContent.slice(0, previewLimit) + '...'
    : safeContent;

  return (
    <div
      className="bg-sage rounded-xl p-4 border border-cream cursor-pointer transition-all duration-300"
      onClick={handleExpand}
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
  );
};

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
