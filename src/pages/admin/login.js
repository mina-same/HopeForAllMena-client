import React from 'react';
import { navigate } from 'gatsby';

export default function AdminLogin() {
  const handleLogin = () => {
    // Temporary bypass - redirect directly to admin
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Admin Login</h2>
          <p className="mt-2 text-muted-foreground">Access the admin dashboard</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
