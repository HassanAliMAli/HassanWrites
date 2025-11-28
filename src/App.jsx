import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Lazy load pages for performance
const Home = lazy(() => import('@/pages/Home'));
const Article = lazy(() => import('@/pages/Article'));
const Profile = lazy(() => import('@/pages/Profile'));
const Search = lazy(() => import('@/pages/Search'));
const Editor = lazy(() => import('@/pages/Editor'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Invite = lazy(() => import('@/pages/auth/Invite'));
const Membership = lazy(() => import('@/pages/Membership'));
const SubscribeSuccess = lazy(() => import('@/pages/SubscribeSuccess'));

// Admin pages
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Posts = lazy(() => import('@/pages/admin/Posts'));
const Users = lazy(() => import('@/pages/admin/Users'));
const Subscribers = lazy(() => import('@/pages/admin/Subscribers'));

const Settings = lazy(() => import('@/pages/admin/Settings'));

import AnalyticsTracker from '@/components/AnalyticsTracker';

function App() {
  return (
    <Router>
      <AnalyticsTracker />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="invite" element={<Invite />} />
          </Route>

          {/* Editor Route - Protected */}
          <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />

          {/* Admin Routes - Protected, Admin Only */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<Posts />} />
            <Route path="users" element={<Users />} />
            <Route path="subscribers" element={<Subscribers />} />

            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Main Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="membership" element={<Membership />} />
            <Route path="subscribe/success" element={<SubscribeSuccess />} />
            <Route path="post/:slug" element={<Article />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
