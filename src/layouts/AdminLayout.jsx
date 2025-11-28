import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToastProvider } from '@/components/ui/Toast';
import './AdminLayout.css';

const AdminLayout = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
        { icon: FileText, label: 'Posts', path: '/admin/posts' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Users, label: 'Subscribers', path: '/admin/subscribers' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <ToastProvider>
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <div className="admin-sidebar__header">
                        <Link to="/" className="admin-logo">HassanWrites</Link>
                    </div>

                    <nav className="admin-nav">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    'admin-nav__item',
                                    location.pathname === item.path && 'active'
                                )}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="admin-sidebar__footer">
                        <button className="admin-nav__item text-error">
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </ToastProvider>
    );
};

export default AdminLayout;
