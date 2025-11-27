import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';

const MainLayout = () => {
    const user = null;

    return (
        <ToastProvider>
            <div className="layout">
                <Header user={user} />
                <main className="main-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ToastProvider>
    );
};

export default MainLayout;
