import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { useAuth } from '@/context/AuthContext';
import './Auth.css';

const MOCK_USERS = [
    {
        id: 'admin-001',
        email: 'admin@hassanwrites.com',
        password: 'admin123',
        name: 'Hassan (Admin)',
        role: 'admin',
        avatar_r2_key: null
    },
    {
        id: 'author-001',
        email: 'author@hassanwrites.com',
        password: 'author123',
        name: 'Sarah (Author)',
        role: 'author',
        avatar_r2_key: null
    }
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const { refreshAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = MOCK_USERS.find(
                u => u.email === email && u.password === password
            );

            if (!user) {
                addToast({
                    title: 'Login failed',
                    description: 'Invalid email or password',
                    type: 'error',
                });
                setIsLoading(false);
                return;
            }

            localStorage.setItem('mock_user', JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar_r2_key: user.avatar_r2_key
            }));

            await refreshAuth();

            addToast({
                title: 'Login successful',
                description: `Welcome back, ${user.name}!`,
                type: 'success',
            });

            setTimeout(() => {
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 500);
        } catch {
            addToast({
                title: 'Error',
                description: 'Login failed. Please try again.',
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
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="auth-divider">
                        <span>Test Accounts</span>
                    </div>

                    <div className="test-accounts">
                        <div className="test-account-card">
                            <strong>Admin Account</strong>
                            <p>Email: admin@hassanwrites.com</p>
                            <p>Password: admin123</p>
                        </div>
                        <div className="test-account-card">
                            <strong>Author Account</strong>
                            <p>Email: author@hassanwrites.com</p>
                            <p>Password: author123</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="auth-card__footer">
                    <p>Have an invite code? <Link to="/auth/invite" className="link">Redeem Invite</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
