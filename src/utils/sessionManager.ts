
interface ActiveSession {
  username: string;
  deviceId: string;
  loginTime: number;
}

class SessionManager {
  private deviceId: string;
  private readonly STORAGE_KEY = 'mathApp_activeSessions';
  private readonly DEVICE_KEY = 'mathApp_deviceId';

  constructor() {
    // Get or generate a persistent device ID
    this.deviceId = this.getOrCreateDeviceId();
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem(this.DEVICE_KEY);
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.DEVICE_KEY, deviceId);
    }
    return deviceId;
  }

  private getActiveSessions(): Map<string, ActiveSession> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const sessionsArray = JSON.parse(stored);
        return new Map(sessionsArray);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
    return new Map();
  }

  private saveActiveSessions(sessions: Map<string, ActiveSession>): void {
    try {
      const sessionsArray = Array.from(sessions.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionsArray));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  login(username: string): boolean {
    const activeSessions = this.getActiveSessions();
    
    // Check if user is already logged in on another device
    if (activeSessions.has(username)) {
      const existingSession = activeSessions.get(username);
      if (existingSession && existingSession.deviceId !== this.deviceId) {
        return false; // User already logged in on another device
      }
    }

    // Create new session for this device
    activeSessions.set(username, {
      username,
      deviceId: this.deviceId,
      loginTime: Date.now()
    });

    this.saveActiveSessions(activeSessions);
    return true;
  }

  logout(username: string): void {
    const activeSessions = this.getActiveSessions();
    const session = activeSessions.get(username);
    if (session && session.deviceId === this.deviceId) {
      activeSessions.delete(username);
      this.saveActiveSessions(activeSessions);
    }
  }

  isUserLoggedInElsewhere(username: string): boolean {
    const activeSessions = this.getActiveSessions();
    const session = activeSessions.get(username);
    return session ? session.deviceId !== this.deviceId : false;
  }

  getCurrentDeviceId(): string {
    return this.deviceId;
  }

  // Method to check if current device has any active session
  hasActiveSessionOnDevice(): string | null {
    const activeSessions = this.getActiveSessions();
    for (const [username, session] of activeSessions.entries()) {
      if (session.deviceId === this.deviceId) {
        return username;
      }
    }
    return null;
  }

  // Method to clear all sessions (for cleanup if needed)
  clearAllSessions(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Create a singleton instance
export const sessionManager = new SessionManager();
