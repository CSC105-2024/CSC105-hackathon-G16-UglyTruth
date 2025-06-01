import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { HeartCrack, Eye, TriangleAlert } from 'lucide-react';

const PostCard = ({ title, tag, warning, content, likes, views }) => {
  const [expanded, setExpanded] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const previewLimit = 100;
  const safeContent = content || '';

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
        </div>

        <p className="text-linen text-sm mb-4">
          {expanded ? safeContent : truncatedContent}
        </p>

        <div className="flex items-center justify-between text-sm text-linen font-semibold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Eye size={16} /> {views}</span>
            <span className="flex items-center gap-1"><HeartCrack size={16}/> {likes}</span>
          </div>

          {expanded && (
            <button className="bg-linen text-midnight font-pica px-3 py-1 rounded-xl cursor-pointer transition-colors">
              Relatable
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

PostCard.propTypes = {
  title: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  warning: PropTypes.bool,
  content: PropTypes.string.isRequired,
  likes: PropTypes.number,
  views: PropTypes.number,
};

PostCard.defaultProps = {
  warning: false,
  likes: 0,
  views: 0,
};

export default PostCard;
