import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Lazy load pages for performance
const Home = lazy(() => import('@/pages/Home'));
const Article = lazy(() => import('@/pages/Article'));
const Profile = lazy(() => import('@/pages/Profile'));
const Search = lazy(() => import('@/pages/Search'));
const Editor = lazy(() => import('@/pages/Editor'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Invite = lazy(() => import('@/pages/auth/Invite'));

// Admin pages
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Posts = lazy(() => import('@/pages/admin/Posts'));
const Users = lazy(() => import('@/pages/admin/Users'));
const Campaigns = lazy(() => import('@/pages/admin/Campaigns'));
const Payouts = lazy(() => import('@/pages/admin/Payouts'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="invite" element={<Invite />} />
          </Route>

          {/* Editor Route - No Layout */}
          <Route path="/editor" element={<Editor />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<Posts />} />
            <Route path="users" element={<Users />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="payouts" element={<Payouts />} />
          </Route>

          {/* Main Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
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
