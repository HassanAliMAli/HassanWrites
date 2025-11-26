import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-9xl font-bold text-muted opacity-20">404</h1>
            <h2 className="text-3xl font-bold mt-4 mb-2">Page not found</h2>
            <p className="text-muted mb-8 max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/">
                <Button size="lg">
                    <Home size={18} className="mr-2" />
                    Back to Home
                </Button>
            </Link>
        </div>
    );
};

export default NotFound;
