'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/mocks/data';
import { Spin } from 'antd';
import SideNav from './SideNav';
import EventsSidebar from './EventsSidebar';
import { usePathname, useRouter } from 'next/navigation';
import LoginForm from '../Organisms/LoginForm';
import { login } from '@/lib/api';
import TopNav from './TopNav';



export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      localStorage.removeItem('user');
      setUser(null);
      router.replace('/login');
    } else {
      router.push(key);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const user = await login(username, password);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        router.replace('/dashboard');
      }
    } catch {
      setAuthError('Invalid username or password');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="relative" style={{ minHeight: '100vh', backgroundColor: '#f8fafc', border: '2px solid #dbeafe', borderRadius: 18, overflow: 'hidden' }}>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md p-2 flex justify-between items-center z-50" style={{ height: 64 }}>
        <div className="flex items-center">
          <SideNav pathname={pathname} onMenuClick={handleMenuClick} />
        </div>
        <TopNav />
      </div>
      <div
        style={{
          minHeight: '100vh',
          marginTop: 64,
          backgroundImage: `url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%23f8fafc"/><circle cx="50" cy="50" r="40" fill="%23e0e7ef" fill-opacity="0.15"/></svg>')`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          borderRadius: 16,
        }}
        className={!user ? 'blur-sm' : ''}
      >
        <div style={{ marginTop: 64 }}>
          {children}
        </div>
        {user && !pathname.startsWith('/services/') && (
          <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 100 }}>
            <EventsSidebar />
          </div>
        )}
      </div>

      {!user && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <LoginForm onLogin={handleLogin} loading={authLoading} error={authError} />
          </div>
        </div>
      )}
    </div>
  );
}