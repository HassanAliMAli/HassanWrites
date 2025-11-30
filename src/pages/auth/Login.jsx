import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import './Auth.css';

import { api } from '@/lib/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.login(email);

            addToast({
                title: 'Magic link sent',
                description: 'Check your email for the login link.',
                type: 'success',
            });

            // Clear form
            setEmail('');
            setPassword('');

        } catch (error) {
            addToast({
                title: 'Login failed',
                description: error.message || 'Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Card className="auth-card">
                <CardHeader>
                    <CardTitle className="auth-card__title">Welcome Back</CardTitle>
                    <p className="auth-card__subtitle">Sign in to your account</p>
                </CardHeader>
                <CardContent>
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


                </CardContent>
                <CardFooter className="auth-card__footer">
                    <p>Have an invite code? <Link to="/auth/invite" className="link">Redeem Invite</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
