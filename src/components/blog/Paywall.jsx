import React from 'react';
import { Button } from '@/components/ui/Button';
import { Lock } from 'lucide-react';
import './Paywall.css';

const Paywall = () => {
    return (
        <div className="paywall-container">
            <div className="paywall-content">
                <div className="paywall-icon">
                    <Lock size={32} />
                </div>
                <h2 className="paywall-title">Unlock the full story</h2>
                <p className="paywall-description">
                    This story is for members only. Sign up now to get unlimited access to all the best stories on HassanWrites.
                </p>
                <div className="paywall-actions">
                    <Button size="lg" className="w-full sm:w-auto">Get Unlimited Access</Button>
                    <Button variant="ghost" className="w-full sm:w-auto">Sign In</Button>
                </div>
            </div>
            <div className="paywall-overlay"></div>
        </div>
    );
};

export default Paywall;
