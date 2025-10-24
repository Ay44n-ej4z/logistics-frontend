import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create a base query with error handling
const createBaseQuery = (baseUrl: string) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
};

// Enhanced base query with error handling and token refresh
export const createBaseQueryWithReauth = (baseUrl: string) => {
  const baseQuery = createBaseQuery(baseUrl);
  
  return async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    
    // Handle 401/403 errors by attempting token refresh
    // Skip token refresh logic if we're on the login page or if this is a login request
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/login');
    const isLoginRequest = typeof args === 'string' ? args.includes('/auth/login') : args?.url?.includes('/auth/login');
    
    if (result.error && (result.error.status === 401 || result.error.status === 403) && !isLoginPage && !isLoginRequest) {
      console.log('Authentication error detected, attempting token refresh...');
      
      try {
        // Attempt to refresh the token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        
        if (refreshResult.data) {
          // Token refresh successful, update the auth state
          const newToken = (refreshResult.data as any).data?.accessToken;
          if (newToken) {
            // Dispatch setCredentials action using the action creator
            api.dispatch({ 
              type: 'auth/setCredentials',
              payload: { 
                user: (api.getState() as any).auth.user, 
                token: newToken 
              }
            });
            
            // Retry the original request with the new token
            result = await baseQuery(args, api, extraOptions);
          }
        } else {
          // Token refresh failed, logout user
          console.log('Token refresh failed, logging out...');
          api.dispatch({ type: 'auth/logout' });
          
          // Redirect to login page only if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } catch (refreshError) {
        // Token refresh failed, logout user
        console.log('Token refresh error, logging out...', refreshError);
        api.dispatch({ type: 'auth/logout' });
        
        // Redirect to login page only if not already there
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return result;
  };
};

export { createApi };
