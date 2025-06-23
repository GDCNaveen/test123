
import { useState, useEffect, useRef, useCallback } from 'react';
import { sessionManager } from '../utils/sessionManager';

interface SessionData {
  isAuthenticated: boolean;
  loginTime: number;
  lastActivity: number;
  expiresAt: number;
  username: string;
}

interface UseSessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onSessionExpired?: () => void;
  onWarning?: (remainingTime: number) => void;
}

export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onSessionExpired,
  onWarning
}: UseSessionTimeoutProps = {}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const checkRef = useRef<NodeJS.Timeout>();

  const TIMEOUT_MS = timeoutMinutes * 60 * 1000;
  const WARNING_MS = warningMinutes * 60 * 1000;
  
  // Hard expiry date: June 30th, 2025 at 11:07 PM
  const HARD_EXPIRY_DATE = new Date('2025-06-30T23:07:00');

  const isHardExpired = useCallback(() => {
    return Date.now() > HARD_EXPIRY_DATE.getTime();
  }, []);

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (checkRef.current) clearTimeout(checkRef.current);
  }, []);

  const getSessionData = useCallback((): SessionData | null => {
    // Check if there's an active session on this device
    const activeUsername = sessionManager.hasActiveSessionOnDevice();
    if (!activeUsername) return null;

    const data = localStorage.getItem(`mathAppSession_${activeUsername}`);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }, []);

  const saveSessionData = useCallback((data: SessionData) => {
    if (data.username) {
      localStorage.setItem(`mathAppSession_${data.username}`, JSON.stringify(data));
    }
  }, []);

  const clearSession = useCallback(() => {
    if (currentUser) {
      localStorage.removeItem(`mathAppSession_${currentUser}`);
      sessionManager.logout(currentUser);
    }
    clearAllTimers();
    setIsAuthenticated(false);
    setShowWarning(false);
    setCurrentUser(null);
    onSessionExpired?.();
  }, [clearAllTimers, onSessionExpired, currentUser]);

  const updateActivity = useCallback(() => {
    // Check hard expiry first
    if (isHardExpired()) {
      clearSession();
      return;
    }

    const sessionData = getSessionData();
    if (!sessionData) return;

    const now = Date.now();
    const updatedData: SessionData = {
      ...sessionData,
      lastActivity: now,
      expiresAt: now + TIMEOUT_MS
    };

    saveSessionData(updatedData);
    setShowWarning(false);
    
    // Reset timers
    clearAllTimers();
    startSessionTimers();
  }, [getSessionData, saveSessionData, TIMEOUT_MS, clearAllTimers, isHardExpired, clearSession]);

  const startSessionTimers = useCallback(() => {
    // Check hard expiry first
    if (isHardExpired()) {
      clearSession();
      return;
    }

    const sessionData = getSessionData();
    if (!sessionData) return;

    const now = Date.now();
    const timeUntilExpiry = sessionData.expiresAt - now;
    const timeUntilWarning = timeUntilExpiry - WARNING_MS;

    if (timeUntilExpiry <= 0) {
      clearSession();
      return;
    }

    // Set warning timer
    if (timeUntilWarning > 0) {
      warningRef.current = setTimeout(() => {
        setShowWarning(true);
        setRemainingTime(WARNING_MS);
        onWarning?.(WARNING_MS);
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setRemainingTime(prev => {
            if (prev <= 1000) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
      }, timeUntilWarning);
    } else {
      // Already in warning period
      setShowWarning(true);
      setRemainingTime(timeUntilExpiry);
    }

    // Set expiry timer
    timeoutRef.current = setTimeout(() => {
      clearSession();
    }, timeUntilExpiry);
  }, [getSessionData, WARNING_MS, clearSession, onWarning, isHardExpired]);

  const login = useCallback(() => {
    // Check hard expiry before allowing login
    if (isHardExpired()) {
      clearSession();
      return;
    }

    // Get the current active user from session manager
    const activeUsername = sessionManager.hasActiveSessionOnDevice();
    if (!activeUsername) return;

    const now = Date.now();
    const sessionData: SessionData = {
      isAuthenticated: true,
      loginTime: now,
      lastActivity: now,
      expiresAt: now + TIMEOUT_MS,
      username: activeUsername
    };

    saveSessionData(sessionData);
    setIsAuthenticated(true);
    setCurrentUser(activeUsername);
    startSessionTimers();
  }, [TIMEOUT_MS, saveSessionData, startSessionTimers, isHardExpired, clearSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const extendSession = useCallback(() => {
    // Check hard expiry before extending
    if (isHardExpired()) {
      clearSession();
      return;
    }
    updateActivity();
  }, [updateActivity, isHardExpired, clearSession]);

  // Check session on mount and setup activity listeners
  useEffect(() => {
    // Check hard expiry first
    if (isHardExpired()) {
      clearSession();
      return;
    }

    // Check if there's an active user session in sessionManager
    const activeUsername = sessionManager.hasActiveSessionOnDevice();
    if (activeUsername) {
      // Check if we have session data for this user
      const sessionData = getSessionData();
      if (sessionData && sessionData.isAuthenticated) {
        const now = Date.now();
        if (now < sessionData.expiresAt) {
          // Restore the session
          setIsAuthenticated(true);
          setCurrentUser(activeUsername);
          startSessionTimers();
        } else {
          // Session expired, clear it
          clearSession();
        }
      } else {
        // No session data but user is in sessionManager, create new session
        login();
      }
    }

    // Activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      if (isAuthenticated && !isHardExpired()) {
        updateActivity();
      }
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Periodic session check (every minute)
    checkRef.current = setInterval(() => {
      if (isHardExpired()) {
        clearSession();
        return;
      }
      
      const currentSessionData = getSessionData();
      if (currentSessionData && Date.now() >= currentSessionData.expiresAt) {
        clearSession();
      }
    }, 60000);

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearAllTimers();
    };
  }, [getSessionData, startSessionTimers, clearSession, login, isAuthenticated, updateActivity, clearAllTimers, isHardExpired]);

  return {
    isAuthenticated,
    showWarning,
    remainingTime,
    currentUser,
    login,
    logout,
    extendSession
  };
};
