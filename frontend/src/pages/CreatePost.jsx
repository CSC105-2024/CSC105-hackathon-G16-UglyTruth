import React from 'react';
import SideBar from '../components/SideBar';

const CreatePost = () => {
  return (
    <div>
      <SideBar />
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
    </div>
  );
};

export default CreatePost;