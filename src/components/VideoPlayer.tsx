import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

const VideoPlayer = ({ videoData, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for video
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-200 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-2 text-white">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Mathematics Hub</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
            {isLoading ? (
              <div className="aspect-video flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-white text-lg">Loading video...</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video">
                <iframe
                  src={videoData.videoUrl}
                  title={videoData.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{videoData.title}</h1>
            <p className="text-gray-300 mb-4">{videoData.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                {videoData.level}
              </span>
              <span className="text-gray-300">{videoData.duration}</span>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="font-semibold mb-2">What you'll learn:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Master fundamental mathematical concepts</li>
                <li>• Apply problem-solving techniques</li>
                <li>• Build strong foundation for advanced topics</li>
                <li>• Practice with real-world examples</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
