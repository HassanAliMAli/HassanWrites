import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-layout__header">
                <Link to="/" className="auth-layout__logo">
                    HassanWrites
                </Link>
            </div>
            <div className="auth-layout__content">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
