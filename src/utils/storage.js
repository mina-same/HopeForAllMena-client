// Storage utility for session management
// Uses sessionStorage for temporary data and cookies for persistent data

// Cookie utilities
export const cookieUtils = {
  set: (name, value, days = 7) => {
    if (typeof window === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${window.location.protocol === 'https:'}`;
  },

  get: (name) => {
    if (typeof window === 'undefined') return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  remove: (name) => {
    if (typeof window === 'undefined') return;
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },

  // Check if cookies are enabled
  isEnabled: () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const testCookie = 'test_cookie_' + Math.random();
      document.cookie = testCookie + '=1';
      const enabled = document.cookie.indexOf(testCookie) !== -1;
      document.cookie = testCookie + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      return enabled;
    } catch (e) {
      return false;
    }
  }
};

// Session storage utilities
export const sessionUtils = {
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }
  },

  get: (key) => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn('SessionStorage not available:', e);
      return null;
    }
  },

  remove: (key) => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }
  }
};

// Authentication storage utilities
export const authStorage = {
  // Store authentication token (persistent in cookie)
  setToken: (token) => {
    cookieUtils.set('authToken', token, 7); // 7 days
  },

  // Get authentication token
  getToken: () => {
    return cookieUtils.get('authToken');
  },

  // Remove authentication token
  removeToken: () => {
    cookieUtils.remove('authToken');
  },

  // Store user data (persistent in cookie)
  setUser: (user) => {
    cookieUtils.set('userData', JSON.stringify(user), 7); // 7 days
  },

  // Get user data
  getUser: () => {
    const userData = cookieUtils.get('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Remove user data
  removeUser: () => {
    cookieUtils.remove('userData');
  },

  // Clear all auth data
  clearAuth: () => {
    authStorage.removeToken();
    authStorage.removeUser();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!(authStorage.getToken() && authStorage.getUser());
  }
};

// General storage utilities
export const storage = {
  // For temporary data (session only)
  session: sessionUtils,
  
  // For persistent data (cookies)
  persistent: cookieUtils,
  
  // For authentication
  auth: authStorage,
  
  // Fallback to localStorage if needed
  fallback: {
    set: (key, value) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    },
    
    get: (key) => {
      if (typeof window === 'undefined') return null;
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn('LocalStorage not available:', e);
        return null;
      }
    },
    
    remove: (key) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    }
  }
};

export default storage;
