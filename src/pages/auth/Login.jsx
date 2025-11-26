import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { api } from '@/lib/api';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.login(email);
            setIsSent(true);
            addToast({
                title: 'Magic link sent',
                description: 'Check your email for the login link.',
                type: 'success',
            });
        } catch {
            addToast({
                title: 'Error',
                description: 'Failed to send magic link. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="auth-card">
            <CardHeader>
                <CardTitle className="auth-card__title">Sign in</CardTitle>
                <p className="auth-card__subtitle">Enter your email to receive a magic link</p>
            </CardHeader>
            <CardContent>
                {isSent ? (
                    <div className="auth-success-message">
                        <p>Check your email!</p>
                        <p className="text-sm text-muted">We sent a magic link to <strong>{email}</strong></p>
                        <Button variant="ghost" className="mt-4" onClick={() => setIsSent(false)}>
                            Try another email
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Send Magic Link
                        </Button>
                    </form>
                )}
            </CardContent>
            <CardFooter className="auth-card__footer">
                <p>Don't have an account? <Link to="/auth/invite" className="link">Redeem Invite</Link></p>
            </CardFooter>
        </Card>
    );
};

export default Login;
