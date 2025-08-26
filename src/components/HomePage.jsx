import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function HomePage() {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Check if this is a redirect from OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'true') {
      // Redirect came back with success, now get user info from session
      checkAuthStatus();
    } else if (error) {
      // Handle different error types
      let errorMessage = 'Authentication failed. Please try again.';
      if (error === 'unauthorized') {
        errorMessage = 'Only @turing.com accounts are allowed.';
      } else if (error === 'oauth_failed') {
        errorMessage = 'OAuth authentication failed. Please try again.';
      }
      alert(errorMessage);
      setIsLoading(false);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/status', {
        method: 'GET',
        credentials: 'include', // Important for session cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          login(data.user);
        }
      } else {
        console.error('Not authenticated');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Redirect to Flask login endpoint
      window.location.href = 'http://localhost:5000/auth/login';
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Left side illustration */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: '100vh'
      }}>
        {/* Logo */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '32px',
          fontSize: '20px',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          TURING
        </div>

        {/* Floating shapes container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}>
          {/* Top floating cube */}
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '128px',
            width: '64px',
            height: '64px',
            backgroundColor: '#3b82f6',
            transform: 'rotate(12deg)',
            borderRadius: '6px',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)'
          }}></div>

          {/* Cylinder */}
          <div style={{
            position: 'absolute',
            top: '128px',
            right: '96px',
            width: '64px',
            height: '32px',
            backgroundColor: '#60a5fa',
            borderRadius: '50%',
            transform: 'rotate(45deg)',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)'
          }}></div>

          {/* Sphere */}
          <div style={{
            position: 'absolute',
            top: '64px',
            left: '50%',
            marginLeft: '-20px',
            width: '40px',
            height: '40px',
            backgroundColor: '#60a5fa',
            borderRadius: '50%',
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)'
          }}></div>

          {/* Half circle with person */}
          <div style={{
            position: 'absolute',
            top: '160px',
            left: '160px',
            width: '160px',
            height: '80px',
            backgroundColor: '#2563eb',
            borderRadius: '0 0 80px 80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              👨‍💻
            </div>
          </div>

          {/* Cube with desk setup */}
          <div style={{
            position: 'absolute',
            bottom: '128px',
            left: '96px',
            width: '160px',
            height: '160px',
            backgroundColor: '#1d4ed8',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              backgroundColor: 'white',
              width: '64px',
              height: '48px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              💻
            </div>
          </div>

          {/* Cube with standing person */}
          <div style={{
            position: 'absolute',
            bottom: '112px',
            right: '128px',
            width: '144px',
            height: '144px',
            backgroundColor: '#1d4ed8',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              backgroundColor: 'white',
              width: '48px',
              height: '48px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🧍‍♀️
            </div>
          </div>
        </div>
      </div>

      {/* Right side login */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px',
        minHeight: '100vh'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '12px',
          lineHeight: '1.2'
        }}>
          Welcome to Turing Amazon Agentic Tool
        </h1>
        
        <p style={{
          marginBottom: '32px',
          color: '#d1d5db',
          fontSize: '16px'
        }}>
          Please login to continue
        </p>
        
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: isLoading ? '#6b7280' : (isHovered ? '#374151' : '#000000'),
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.7 : 1
          }}
          onMouseEnter={() => !isLoading && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}