import React from 'react';
import { Button } from '@/components/ui/Button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Paywall.css';

const Paywall = ({ tier = 'premium' }) => {
    const navigate = useNavigate();

    return (
        <div className="paywall-container">
            <div className="paywall-content">
                <div className="paywall-icon">
                    <Lock size={32} />
                </div>
                <h2 className="paywall-title">Unlock the full story</h2>
                <p className="paywall-description">
                    This story is for <strong>{tier === 'newsletter' ? 'Newsletter' : 'Premium'}</strong> members only.
                    Sign up now to get unlimited access to all the best stories on HassanWrites.
                </p>
                <div className="paywall-actions">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto"
                        onClick={() => navigate('/membership')}
                    >
                        Get Unlimited Access
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full sm:w-auto"
                        onClick={() => navigate('/auth/login')}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
            <div className="paywall-overlay"></div>
        </div>
    );
};

export default Paywall;
