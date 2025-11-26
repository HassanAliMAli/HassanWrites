import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/Toast';
import './AuthLayout.css';

const AuthLayout = () => {
    return (
        <ToastProvider>
            <div className="auth-layout">
                <div className="auth-layout__header">
                    <Link to="/" className="auth-layout__logo">
                        EdgeMaster
                    </Link>
                </div>
                <div className="auth-layout__content">
                    <Outlet />
                </div>
            </div>
        </ToastProvider>
    );
};

export default AuthLayout;
