import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { api } from '@/lib/api';
import './Auth.css';

const Invite = () => {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.redeemInvite(token);
            addToast({
                title: 'Invite accepted',
                description: 'Welcome to EdgeMaster!',
                type: 'success',
            });
        } catch {
            addToast({
                title: 'Invalid invite',
                description: 'This invite token is invalid or expired.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="auth-card">
            <CardHeader>
                <CardTitle className="auth-card__title">Join EdgeMaster</CardTitle>
                <p className="auth-card__subtitle">Enter your invite token to get started</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="token" className="form-label">Invite Token</label>
                        <Input
                            id="token"
                            type="text"
                            placeholder="e.g. INVITE-1234"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Redeem Invite
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="auth-card__footer">
                <p>Already have an account? <Link to="/auth/login" className="link">Sign In</Link></p>
            </CardFooter>
        </Card>
    );
};

export default Invite;
