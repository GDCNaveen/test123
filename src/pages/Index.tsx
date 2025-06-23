
import React, { useState, useEffect } from 'react';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';
import VideoPlayer from '../components/VideoPlayer';
import SessionWarningDialog from '../components/SessionWarningDialog';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { sessionManager } from '../utils/sessionManager';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const {
    isAuthenticated,
    showWarning,
    remainingTime,
    currentUser,
    login,
    logout,
    extendSession
  } = useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    onSessionExpired: () => {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive"
      });
      setCurrentPage('dashboard');
      setSelectedVideo(null);
    },
    onWarning: () => {
      toast({
        title: "Session Warning",
        description: "Your session will expire soon.",
        variant: "default"
      });
    }
  });

  // Check for existing session on mount
  useEffect(() => {
    const activeUser = sessionManager.hasActiveSessionOnDevice();
    if (activeUser) {
      login();
    }
  }, [login]);

  const handleLogin = (success: boolean) => {
    if (success) {
      login();
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('dashboard');
    setSelectedVideo(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default"
    });
  };

  const handleExtendSession = () => {
    extendSession();
    toast({
      title: "Session Extended",
      description: "Your session has been extended for another 30 minutes.",
      variant: "default"
    });
  };

  const handleVideoSelect = (videoData: any) => {
    setSelectedVideo(videoData);
    setCurrentPage('video');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedVideo(null);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {currentUser && (
        <div className="bg-white shadow-sm border-b px-4 py-2">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <span className="text-sm text-gray-600">Welcome, {currentUser}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      
      {currentPage === 'dashboard' && (
        <Dashboard onVideoSelect={handleVideoSelect} />
      )}
      {currentPage === 'video' && selectedVideo && (
        <VideoPlayer 
          videoData={selectedVideo} 
          onBack={handleBackToDashboard} 
        />
      )}
      
      <SessionWarningDialog
        isOpen={showWarning}
        remainingTime={remainingTime}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Index;
