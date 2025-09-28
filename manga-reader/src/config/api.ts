// Environment configuration for different hosting platforms
export const config = {
  // Detect hosting platform
  isVercel: typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('.vercel.app') ||
    process.env.REACT_APP_VERCEL === 'true'
  ),
  
  isHostinger: typeof window !== 'undefined' && (
    window.location.hostname.includes('.hostingerapp.com') ||
    process.env.REACT_APP_HOSTINGER === 'true'
  ),

  // Get appropriate API base URL
  getApiBaseUrl: function() {
    if (process.env.NODE_ENV === 'development') {
      return 'https://api.mangadex.org';
    }

    // Try Vercel serverless functions first
    if (this.isVercel) {
      return '/api/mangadex';
    }

    // For Hostinger or other traditional hosts, try different approaches
    if (this.isHostinger || process.env.NODE_ENV === 'production') {
      // Try multiple fallback options
      return this.getProductionApiUrl();
    }

    return 'https://api.mangadex.org';
  },

  // Get production API URL with fallbacks
  getProductionApiUrl: function() {
    // Option 1: Try direct API (might work if CORS is relaxed)
    // Option 2: Use public CORS proxies (unreliable but better than nothing)
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    
    // For now, return direct API and handle CORS in the service
    return 'https://api.mangadex.org';
  }
};

export default config;